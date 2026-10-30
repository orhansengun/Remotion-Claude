"""Telifsiz arka plan müziği ve efekt seslerini sentezler (public/ altına WAV yazar).

Kullanım: python3 scripts/gen_audio.py
"""
import wave
from pathlib import Path

import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parent.parent / 'public'
rng = np.random.default_rng(7)


def t(d):
	return np.arange(int(SR * d)) / SR


def env(d, attack=0.005, decay=0.3):
	x = t(d)
	return np.minimum(x / attack, 1) * np.exp(-x / decay)


def lowpass(x, cutoff):
	# Tek kutuplu alçak geçiren filtre; cutoff sabit ya da örnek başına dizi olabilir.
	cutoff = np.broadcast_to(cutoff, x.shape)
	a = 1 - np.exp(-2 * np.pi * cutoff / SR)
	y = np.empty_like(x)
	acc = 0.0
	for i in range(len(x)):
		acc += a[i] * (x[i] - acc)
		y[i] = acc
	return y


def write(name, x, peak=0.9):
	x = x / (np.max(np.abs(x)) + 1e-9) * peak
	path = OUT / name
	path.parent.mkdir(parents=True, exist_ok=True)
	with wave.open(str(path), 'wb') as w:
		w.setnchannels(1)
		w.setsampwidth(2)
		w.setframerate(SR)
		w.writeframes((x * 32767).astype(np.int16).tobytes())


def note(f):
	return 440 * 2 ** ((f - 69) / 12)


def keys(freq, d, decay=0.9):
	x = t(d)
	tone = sum(np.sin(2 * np.pi * freq * k * x) * a for k, a in [(1, 1), (2, 0.35), (3, 0.12), (4, 0.05)])
	return tone * env(d, 0.01, decay)


def marimba(freq, d=0.5):
	x = t(d)
	return (np.sin(2 * np.pi * freq * x) + 0.25 * np.sin(2 * np.pi * freq * 4 * x) * np.exp(-x / 0.03)) * env(d, 0.002, 0.18)


# ---------- Müzik: 96 BPM, Fmaj7 - G6 - Em7 - Am7 ----------
def music(length=46.0):
	bpm = 96
	beat = 60 / bpm
	bar = beat * 4
	mix = np.zeros(int(SR * (length + 2)))

	def add(sig, at, gain):
		i = int(at * SR)
		if i >= len(mix):
			return
		j = min(len(mix), i + len(sig))
		mix[i:j] += sig[: j - i] * gain

	chords = [
		[53, 57, 60, 64],  # Fmaj7
		[55, 59, 62, 64],  # G6
		[52, 55, 59, 62],  # Em7
		[57, 60, 64, 67],  # Am7
	]
	kick_t = t(0.35)
	kick = np.sin(2 * np.pi * np.cumsum(45 + 80 * np.exp(-kick_t / 0.04)) / SR) * env(0.35, 0.002, 0.12)
	hat = lowpass(rng.standard_normal(int(SR * 0.05)), 9000) * env(0.05, 0.001, 0.015)
	hat = hat - lowpass(hat, 4000)

	n_bars = int(length / bar) + 1
	for b in range(n_bars):
		ch = chords[b % 4]
		start = b * bar
		for at in (0, beat * 1.5, beat * 2.5):
			for n in ch:
				add(keys(note(n), bar, 0.8), start + at, 0.09)
		add(keys(note(ch[0] - 24), beat * 2, 0.5), start, 0.32)
		add(keys(note(ch[0] - 24), beat * 2, 0.5), start + beat * 2.5, 0.25)
		if b >= 1:
			add(kick, start, 0.5)
			add(kick, start + beat * 2, 0.4)
		for e in range(8):
			add(hat, start + e * beat / 2 + beat / 4, 0.35 if e % 2 else 0.2)
		if b >= 2:
			pattern = [ch[2], ch[3], ch[1] + 12, ch[3], ch[2] + 12, ch[3], ch[1] + 12, ch[0] + 12]
			for e, n in enumerate(pattern):
				if (b + e) % 3 != 2:
					add(marimba(note(n + 12)), start + e * beat / 2, 0.12)

	mix = mix[: int(SR * length)]
	mix = lowpass(mix, 6500)
	fade = np.ones_like(mix)
	fade[: SR // 2] = np.linspace(0, 1, SR // 2)
	fade[-SR * 2 :] = np.linspace(1, 0, SR * 2)
	return mix * fade


# ---------- Efektler ----------
def whoosh(d=0.45):
	x = t(d)
	noise = rng.standard_normal(len(x))
	shape = np.sin(np.pi * x / d) ** 2
	cutoff = 400 + 3500 * np.sin(np.pi * x / d)
	return lowpass(noise, cutoff) * shape


def pop(d=0.09):
	x = t(d)
	f = 300 + 500 * np.exp(-x / 0.015)
	return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.001, 0.03)


def ding(f=1318.5, d=1.0):
	x = t(d)
	return (np.sin(2 * np.pi * f * x) + 0.4 * np.sin(2 * np.pi * f * 2.76 * x) * np.exp(-x / 0.1)) * env(d, 0.002, 0.35)


def thud(d=0.4):
	x = t(d)
	f = 50 + 70 * np.exp(-x / 0.05)
	body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.002, 0.12)
	click = lowpass(rng.standard_normal(len(x)), 2500) * env(d, 0.001, 0.01)
	return body + 0.3 * click


def tick(d=0.04):
	return lowpass(rng.standard_normal(int(SR * d)), 6000) * env(d, 0.0005, 0.006) + np.sin(2 * np.pi * 2200 * t(d)) * env(d, 0.0005, 0.01)


def rise(d=0.5):
	x = t(d)
	f = 300 * (4 ** (x / d))
	return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * x / d) * 0.8 + whoosh(d) * 0.4


def coin():
	out = np.zeros(int(SR * 0.9))
	for i, f in enumerate([1975.5, 2637.0]):
		s = ding(f, 0.8)
		o = int(i * 0.08 * SR)
		out[o : o + len(s)] += s[: len(out) - o]
	return out


def logo():
	out = np.zeros(int(SR * 2.2))
	for i, n in enumerate([72, 76, 79, 84]):
		s = ding(note(n), 1.6) + keys(note(n - 12), 1.6, 0.6) * 0.6
		o = int(i * 0.09 * SR)
		out[o : o + len(s)] += s
	return out + np.concatenate([whoosh(0.6), np.zeros(len(out) - int(SR * 0.6))]) * 0.5


if __name__ == '__main__':
	write('music/lofi-96.wav', music(45.0), 0.8)
	for name, sig in {
		'whoosh': whoosh(),
		'pop': pop(),
		'ding': ding(),
		'thud': thud(),
		'tick': tick(),
		'rise': rise(),
		'coin': coin(),
		'logo': logo(),
	}.items():
		write(f'sfx/{name}.wav', sig)
	print('ok')
