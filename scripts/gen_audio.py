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


# ---------- Teknoloji / fintek müziği: 120 BPM (1 ölçü = 2 sn), Am - F - C - G ----------
def saw(freq, d, harmonics=10, detune=0.0):
	x = t(d)
	f = freq * (1 + detune)
	return sum(np.sin(2 * np.pi * f * k * x) / k for k in range(1, harmonics + 1) if f * k < 9000)


def music_tech(length, sections):
	"""sections: [(başlangıç_sn, seviye)] — 0: sadece pad (gece), 1: pad+bas nabzı+tik, 2: +kick+arp, 3: tam ritim."""
	bpm = 120
	beat = 60 / bpm
	bar = beat * 4
	mix = np.zeros(int(SR * (length + 3)))

	def level_at(sec_):
		lv = sections[0][1]
		for st, l in sections:
			if sec_ >= st:
				lv = l
		return lv

	def add(sig, at, gain):
		i = int(at * SR)
		if i >= len(mix):
			return
		j = min(len(mix), i + len(sig))
		mix[i:j] += sig[: j - i] * gain

	chords = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]]
	roots = [45, 41, 48, 43]
	kick_t = t(0.4)
	kick = np.sin(2 * np.pi * np.cumsum(42 + 110 * np.exp(-kick_t / 0.03)) / SR) * env(0.4, 0.001, 0.14)
	hat = rng.standard_normal(int(SR * 0.04))
	hat = (hat - lowpass(hat, 7000)) * env(0.04, 0.0005, 0.01)
	clap_n = rng.standard_normal(int(SR * 0.18))
	clap = (lowpass(clap_n, 2500) - lowpass(clap_n, 900)) * env(0.18, 0.002, 0.05)

	n_bars = int(length / bar) + 1
	for b in range(n_bars):
		start = b * bar
		lv = level_at(start)
		ch = chords[b % 4]
		# Pad: yavaş açılan, detune edilmiş testere dalgaları
		pad = sum(saw(note(n), bar + 0.4, 8, d) for n in ch for d in (-0.004, 0.004))
		pad = pad * np.minimum(t(bar + 0.4) / 0.35, 1) * np.minimum((bar + 0.4 - t(bar + 0.4)) / 0.4, 1)
		add(lowpass(pad, 900 if lv == 0 else 1800 + 400 * lv), start, 0.05)
		for k in range(16):
			at = start + k * beat / 4
			lvk = level_at(at)
			if lvk == 0 and k % 4 == 0:
				add(tick(), at, 0.25)
			if lvk >= 1:
				add(hat, at, 0.18 if k % 2 else 0.1)
			if lvk >= 1 and k % 2 == 0:
				bass = lowpass(saw(note(roots[b % 4] - 12), 0.22, 12), 380) * env(0.22, 0.003, 0.09)
				add(bass, at, 0.5)
			if lvk >= 2 and (k % 8 == 0 or (lvk == 3 and k % 4 == 0)):
				add(kick, at, 0.8)
			if lvk == 3 and k % 8 == 4:
				add(clap, at, 0.45)
			if lvk >= 2 and (k * 7 + b) % 5 != 0:
				n = ch[k % 3] + 12 + (12 if k % 4 == 3 else 0)
				pl = lowpass(saw(note(n), 0.25, 6), 3200) * env(0.25, 0.002, 0.06)
				for e in range(3):
					add(pl, at + e * beat * 0.75, 0.05 * 0.45**e)
	# Seviye 3'e geçmeden önce 2 saniyelik yükselen ses
	for (st, lv), prev in zip(sections[1:], sections):
		if lv == 3 and prev[1] < 3:
			add(rise(2.0) * np.linspace(0, 1, int(SR * 2.0)), st - 2.0, 0.25)
	mix = mix[: int(SR * length)]
	fade = np.ones_like(mix)
	fade[: SR // 3] = np.linspace(0, 1, SR // 3)
	fade[-SR * 2 :] = np.linspace(1, 0, SR * 2)
	return mix * fade


# ---------- Ödeme / teknoloji efektleri ----------
def posbeep(f=2700, d=0.14):
	x = t(d)
	return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 3 * f * x)) * np.minimum(x / 0.003, 1) * np.minimum((d - x) / 0.01, 1)


def approve():
	out = np.zeros(int(SR * 0.4))
	for i, f in enumerate([2000, 2700]):
		b = posbeep(f, 0.11)
		o = int(i * 0.16 * SR)
		out[o : o + len(b)] += b
	return out


def nfc(d=0.6):
	x = t(d)
	f = 700 + 2200 * np.minimum(x / 0.25, 1)
	chirp = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.01, 0.15)
	sparkle = sum(np.sin(2 * np.pi * rng.uniform(3000, 6000) * x) * env(d, 0.002, 0.08) * (x > s0) for s0 in rng.uniform(0.05, 0.3, 5))
	return chirp + 0.3 * sparkle


def hum(d=1.2):
	x = t(d)
	tone = sum(np.sin(2 * np.pi * 100 * k * x) / k for k in range(1, 6)) * (0.7 + 0.3 * np.sin(2 * np.pi * 7 * x))
	return tone * np.sin(np.pi * x / d)


def zap(d=0.5):
	x = t(d)
	crackle = rng.standard_normal(len(x)) * (rng.random(len(x)) < 0.08) * env(d, 0.001, 0.2)
	f = 200 + 1800 * (x / d) ** 2
	return lowpass(crackle, 5000) * 2 + np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.01, 0.25) * 0.5


def data(d=0.8):
	out = np.zeros(int(SR * d))
	at = 0.0
	while at < d - 0.05:
		dur = rng.uniform(0.015, 0.04)
		b = np.sin(2 * np.pi * rng.choice([1200, 1800, 2400, 3200, 4000]) * t(dur)) * env(dur, 0.001, dur / 2)
		i = int(at * SR)
		out[i : i + len(b)] += b
		at += dur + rng.uniform(0.005, 0.03)
	return out * np.linspace(1, 0.4, len(out))


def lock():
	d = 0.6
	x = t(d)
	click = lowpass(rng.standard_normal(len(x)), 4000) * env(d, 0.0005, 0.008)
	clank = sum(np.sin(2 * np.pi * f * x) * a for f, a in [(900, 1), (1350, 0.6), (2110, 0.4), (3170, 0.2)]) * env(d, 0.001, 0.12)
	return click * 1.5 + np.concatenate([np.zeros(int(SR * 0.06)), clank[: len(x) - int(SR * 0.06)]])


def glitch(d=0.6):
	x = t(d)
	steps = rng.choice([180, 240, 320, 90, 450], size=int(d / 0.04) + 1)
	f = steps[(x / 0.04).astype(int)]
	sq = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR))
	crushed = np.round(sq * 4) / 4
	return (crushed * 0.6 + rng.standard_normal(len(x)) * 0.25) * env(d, 0.002, 0.25)


def boom(d=1.6):
	x = t(d)
	f = 35 + 30 * np.exp(-x / 0.15)
	body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.003, 0.5)
	return body + lowpass(rng.standard_normal(len(x)), 400) * env(d, 0.002, 0.2) * 0.6


def printer(d=1.4):
	x = t(d)
	pulses = (np.sin(2 * np.pi * 38 * x) > 0.2).astype(float)
	buzz = lowpass(rng.standard_normal(len(x)), 3500) * pulses
	motor = np.sin(2 * np.pi * 180 * x) * 0.3
	return (buzz + motor) * np.minimum(x / 0.05, 1) * np.minimum((d - x) / 0.08, 1)


# ---------- Rüya / uyku müziği: ~70 BPM ambient, Dmaj7 - Bm7 - Gmaj7 - A ----------
def music_dream(length, mutes, tension, forest, sting):
	"""mutes: [(a, b)] müziğin kesildiği aralıklar; tension: (a, b) gerilim nabzı; forest: (a, b) gece sesleri; sting: marka vuruşu anı."""
	mix = np.zeros(int(SR * (length + 4)))

	def add(sig, at, gain):
		i = int(at * SR)
		if i >= len(mix) or i < 0:
			return
		j = min(len(mix), i + len(sig))
		mix[i:j] += sig[: j - i] * gain

	bar = 60 / 70 * 4
	chords = [[62, 66, 69, 73], [59, 62, 66, 69], [55, 59, 62, 66], [57, 61, 64, 69]]
	n_bars = int(length / bar) + 2
	for b in range(n_bars):
		start = b * bar
		ch = chords[b % 4]
		d = bar + 1.5
		x = t(d)
		pad = sum(np.sin(2 * np.pi * note(n) * x) + 0.3 * np.sin(2 * np.pi * note(n) * 2.003 * x) for n in ch)
		pad *= np.minimum(x / 0.8, 1) * np.minimum((d - x) / 1.2, 1)
		add(pad, start, 0.05)
		add(np.sin(2 * np.pi * note(ch[0] - 24) * x) * np.minimum(x / 0.5, 1) * np.minimum((d - x) / 1.0, 1), start, 0.12)
		# müzik kutusu çanları
		for k, n in enumerate([ch[3] + 12, ch[2] + 12, ch[1] + 24, ch[2] + 12, ch[3] + 12, ch[0] + 24]):
			if (k + b) % 4 == 3:
				continue
			bell = ding(note(n), 1.2) * 0.6
			add(bell, start + k * bar / 6, 0.06)
	# gerilim: düşük nabız + yükselen ton
	ta, tb = tension
	for k in range(int((tb - ta) / 0.43)):
		at = ta + k * 0.43
		pulse = np.sin(2 * np.pi * 55 * t(0.3)) * env(0.3, 0.005, 0.12)
		add(pulse, at, 0.5)
		add(np.sin(2 * np.pi * note(74 + (k % 2)) * t(0.2)) * env(0.2, 0.005, 0.08), at + 0.21, 0.04)
	mix_len = int(SR * length)
	mix = mix[:mix_len]
	gate = np.ones(mix_len)
	for a, b in mutes:
		i, j = int(a * SR), int(b * SR)
		gate[i:j] = 0.0
		ramp_n = int(0.25 * SR)
		gate[j : j + ramp_n] = np.minimum(gate[j : j + ramp_n], np.linspace(0, 1, len(gate[j : j + ramp_n])))
	mix = lowpass(mix, 5000) * gate
	fa, fb = forest
	night = crickets(fb - fa)
	mix[int(fa * SR) : int(fa * SR) + len(night)] += night[: mix_len - int(fa * SR)] * 0.12
	st = int(sting * SR)
	hit = boom(1.6) * 0.5 + logo()[: int(SR * 1.6)] * 0.25
	mix[st : st + len(hit)] += hit[: mix_len - st]
	fade = np.ones_like(mix)
	fade[: SR // 2] = np.linspace(0, 1, SR // 2)
	fade[-SR * 2 :] = np.linspace(1, 0, SR * 2)
	return mix * fade


# ---------- Uyku / beden efektleri ----------
def heartbeat(d=0.9):
	out = np.zeros(int(SR * d))
	for at, g in [(0.0, 1.0), (0.22, 0.7)]:
		x = t(0.18)
		beat = np.sin(2 * np.pi * np.cumsum(45 + 40 * np.exp(-x / 0.03)) / SR) * env(0.18, 0.004, 0.05)
		i = int(at * SR)
		out[i : i + len(beat)] += beat * g
	return lowpass(out, 300)


def breath(d=1.6):
	x = t(d)
	n = rng.standard_normal(len(x))
	shaped = lowpass(n, 1200) - lowpass(n, 300)
	return shaped * np.sin(np.pi * x / d) ** 2


def fallwind(d=1.6):
	x = t(d)
	n = rng.standard_normal(len(x))
	cutoff = 3000 * (1 - x / d) + 300
	return lowpass(n, cutoff) * np.minimum(x / 0.2, 1) * np.minimum((d - x) / 0.1, 1)


def alarm(d=1.2):
	x = t(d)
	f = np.where((x * 6).astype(int) % 2 == 0, 880, 660)
	tone = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.5
	return lowpass(tone, 3000) * np.minimum(x / 0.01, 1) * np.minimum((d - x) / 0.05, 1)


def jolt():
	b = boom(1.0)
	w = whoosh(0.25)
	out = b.copy()
	out[: len(w)] += w * 0.8
	return out + np.concatenate([thud(0.4), np.zeros(len(out) - int(SR * 0.4))]) * 0.8


def crickets(d=6.0):
	out = np.zeros(int(SR * d))
	at = 0.0
	while at < d - 0.2:
		chirp = np.sin(2 * np.pi * 4300 * t(0.12)) * (np.sin(2 * np.pi * 30 * t(0.12)) > 0) * env(0.12, 0.005, 0.05)
		i = int(at * SR)
		out[i : i + len(chirp)] += chirp
		at += rng.uniform(0.25, 0.6)
	return out


def clockring(d=0.9):
	x = t(d)
	bell = (np.sin(2 * np.pi * 2100 * x) + 0.5 * np.sin(2 * np.pi * 3150 * x)) * (np.sin(2 * np.pi * 18 * x) > 0)
	return bell * np.minimum((d - x) / 0.1, 1) * 0.6


# ---------- Mutfak / oyuncu caz: ~100 BPM, pizzicato + yürüyen bas + fırça ----------
def pluck(freq, d=0.35, bright=4):
	x = t(d)
	return sum(np.sin(2 * np.pi * freq * k * x) / k**1.5 for k in range(1, bright + 1)) * env(d, 0.002, 0.09)


def music_kitchen(length, sections, cuts, sting):
	"""sections: [(sn, mod)] mod: 'light' | 'curious' | 'tension' | 'full'; cuts: [(a, b)] susma; sting: marka vuruşu."""
	bpm = 100
	beat = 60 / bpm
	mix = np.zeros(int(SR * (length + 3)))

	def add(sig, at, gain):
		i = int(at * SR)
		if i >= len(mix) or i < 0:
			return
		j = min(len(mix), i + len(sig))
		mix[i:j] += sig[: j - i] * gain

	def mode_at(x):
		m = sections[0][1]
		for st, mm in sections:
			if x >= st:
				m = mm
		return m

	happy = [[48, [64, 67, 69]], [45, [64, 67, 72]], [50, [65, 69, 72]], [43, [65, 67, 71]]]  # C6 Am7 Dm7 G7
	tense = [[45, [60, 64, 69]], [40, [59, 64, 68]], [45, [60, 64, 69]], [40, [59, 62, 68]]]  # Am E7
	brush_n = rng.standard_normal(int(SR * 0.12))
	brush = (lowpass(brush_n, 6000) - lowpass(brush_n, 1500)) * env(0.12, 0.01, 0.04)
	n_beats = int(length / beat) + 1
	for k in range(n_beats):
		at = k * beat
		m = mode_at(at)
		prog = tense if m == 'tension' else happy
		root, ch = prog[(k // 4) % 4]
		walk = [0, 4, 7, 9] if m != 'tension' else [0, 3, 7, 3]
		add(lowpass(pluck(note(root - 12 + walk[k % 4]), 0.45, 3), 900), at, 0.55)
		if m in ('curious', 'full', 'light') and k % 2 == 1:
			for n in ch:
				add(pluck(note(n), 0.3, 5), at + beat * 0.5 if m == 'full' else at, 0.07)
		if m == 'tension':
			add(np.sin(2 * np.pi * note(ch[2] + 12) * t(beat)) * env(beat, 0.05, 0.3), at, 0.03)
		if m in ('curious', 'full', 'tension'):
			add(brush, at, 0.25)
			add(brush, at + beat * 0.66, 0.15)
		if m == 'full' and k % 2 == 0:
			kick = np.sin(2 * np.pi * np.cumsum(50 + 60 * np.exp(-t(0.25) / 0.03)) / SR) * env(0.25, 0.002, 0.1)
			add(kick, at, 0.45)
		if m in ('light', 'full') and k % 8 == 6:
			mel = [76, 74, 72, 74, 76, 79][(k // 8) % 6]
			x = t(beat * 1.5)
			add(np.sin(2 * np.pi * note(mel) * x + 0.15 * np.sin(2 * np.pi * 5.5 * x)) * env(beat * 1.5, 0.03, 0.4), at, 0.05)
	mix = mix[: int(SR * length)]
	gate = np.ones(len(mix))
	for a, b in cuts:
		i, j = int(a * SR), int(b * SR)
		gate[i:j] = 0
		rn = int(0.2 * SR)
		gate[j : j + rn] = np.linspace(0, 1, len(gate[j : j + rn]))
	mix = mix * gate
	st = int(sting * SR)
	hit = boom(1.4) * 0.4 + logo()[: int(SR * 1.4)] * 0.3
	mix[st : st + len(hit)] += hit[: len(mix) - st]
	fade = np.ones_like(mix)
	fade[: SR // 3] = np.linspace(0, 1, SR // 3)
	fade[-SR * 2 :] = np.linspace(1, 0, SR * 2)
	return mix * fade


# ---------- Mutfak efektleri ----------
def chop():
	d = 0.35
	x = t(d)
	knock = np.sin(2 * np.pi * np.cumsum(180 + 200 * np.exp(-x / 0.01)) / SR) * env(d, 0.001, 0.05)
	click = lowpass(rng.standard_normal(len(x)), 5000) * env(d, 0.0005, 0.006)
	return knock + click * 1.2


def crunch(d=0.5):
	x = t(d)
	n = rng.standard_normal(len(x)) * (rng.random(len(x)) < 0.25)
	return (lowpass(n, 6000) - lowpass(n, 800)) * env(d, 0.002, 0.15) * 2


def fizz(d=1.4):
	x = t(d)
	n = rng.standard_normal(len(x))
	bubbles = n * (rng.random(len(x)) < 0.02) * 3
	return (lowpass(n, 9000) - lowpass(n, 3000)) * 0.4 * np.sin(np.pi * x / d) + lowpass(bubbles, 4000) * np.sin(np.pi * x / d)


def drip():
	d = 0.3
	x = t(d)
	f = 1800 * np.exp(-x / 0.05) + 600
	return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.001, 0.06)


def fridge():
	d = 1.4
	x = t(d)
	click = lowpass(rng.standard_normal(len(x)), 3000) * env(d, 0.001, 0.01)
	hum_ = (np.sin(2 * np.pi * 60 * x) + 0.5 * np.sin(2 * np.pi * 120 * x)) * np.minimum(x / 0.3, 1) * np.minimum((d - x) / 0.3, 1) * 0.4
	return click * 1.5 + hum_


def ting():
	return ding(3136, 1.0) * 0.8 + ding(4186, 1.0) * 0.4


def boing(d=0.45):
	x = t(d)
	f = 220 + 500 * (x / d) + 60 * np.sin(2 * np.pi * 14 * x)
	return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.005, 0.18)


if __name__ == '__main__':
	write('music/lofi-96.wav', music(45.0), 0.8)
	# 03 POS: kanca → çip (2) → para yolculuğu (3) → gece/bloke (0) → gün sonu (1) → kapanış (2)
	# 05 Uyku: düşüşte müzik susar, alarmda gerilim, ormanda gece sesleri, marka girişinde vuruş (zamanlar videodaki sn)
	write('music/dream-70-uyku.wav', music_dream(45.0, mutes=[(2.4, 3.9)], tension=(17.9, 28.0), forest=(28.2, 34.5), sting=5.75), 0.8)
	# 06 Soğan (videodaki sn): kanca hafif → hücre meraklı → bıçakta sus → gaz/göz gerilim → tarla hafif → ipuçları tam
	write('music/kitchen-100-sogan.wav', music_kitchen(45.0, [(0, 'light'), (4.6, 'curious'), (13.0, 'tension'), (28.3, 'light'), (33.7, 'full')], cuts=[(10.6, 11.4)], sting=3.15), 0.8)
	write('music/tech-120-pos.wav', music_tech(45.0, [(0, 1), (11.46, 2), (21.0, 3), (35.07, 0), (38.58, 1), (41.1, 2)]), 0.8)
	for name, sig in {
		'whoosh': whoosh(),
		'pop': pop(),
		'ding': ding(),
		'thud': thud(),
		'tick': tick(),
		'rise': rise(),
		'coin': coin(),
		'logo': logo(),
		'posbeep': posbeep(),
		'approve': approve(),
		'nfc': nfc(),
		'hum': hum(),
		'zap': zap(),
		'data': data(),
		'lock': lock(),
		'glitch': glitch(),
		'boom': boom(),
		'printer': printer(),
		'heartbeat': heartbeat(),
		'breath': breath(),
		'fallwind': fallwind(),
		'alarm': alarm(),
		'jolt': jolt(),
		'clockring': clockring(),
		'chop': chop(),
		'crunch': crunch(),
		'fizz': fizz(),
		'drip': drip(),
		'fridge': fridge(),
		'ting': ting(),
		'boing': boing(),
	}.items():
		write(f'sfx/{name}.wav', sig)
	print('ok')
