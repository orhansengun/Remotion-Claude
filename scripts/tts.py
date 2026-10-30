"""Seslendirme metnini ElevenLabs ile Örgün Eğitim'in sabit sesiyle seslendirir.

Gerekenler (ortam değişkeni): ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID.
Ağ: api.elevenlabs.io izinli olmalı.

Kullanım: python3 scripts/tts.py scripts/03-konu.md konu
Çıktı:
  public/vo-<konu>.mp3         ham ses
  public/vo-<konu>.wav         normalize edilmiş ses (Remotion bunu kullanır)
  public/vo-<konu>.words.json  kelime başına başlangıç/bitiş saniyeleri (altyazı ve CUES için)
"""
import base64
import json
import os
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def read_script(md_path):
	text = Path(md_path).read_text(encoding='utf-8')
	section = text.split('## ElevenLabs', 1)[-1]
	block = re.search(r'```\n(.*?)```', section, re.S)
	if not block:
		sys.exit('Metin bloğu bulunamadı: "## ElevenLabs" başlığının altında ``` bloğu olmalı.')
	return block.group(1).strip()


def synthesize(text, cfg):
	key = os.environ.get('ELEVENLABS_API_KEY')
	voice = os.environ.get('ELEVENLABS_VOICE_ID')
	if not key or not voice:
		sys.exit('ELEVENLABS_API_KEY ve ELEVENLABS_VOICE_ID ortam değişkenleri gerekli.')
	url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format={cfg['output_format']}"
	body = json.dumps({'text': text, 'model_id': cfg['model_id'], 'voice_settings': cfg['voice_settings']}).encode()
	req = urllib.request.Request(url, data=body, headers={'xi-api-key': key, 'Content-Type': 'application/json'})
	with urllib.request.urlopen(req, timeout=180) as res:
		return json.load(res)


def words_from_alignment(al):
	# Karakter zamanlarını kelimelere toplar; <break> etiketleri metinde olsa da hizalamada yer almaz.
	words, cur, start, end = [], '', None, None
	for ch, s, e in zip(al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']):
		if ch.isspace():
			if cur:
				words.append({'w': cur, 'start': round(start, 3), 'end': round(end, 3)})
			cur, start = '', None
			continue
		if start is None:
			start = s
		cur += ch
		end = e
	if cur:
		words.append({'w': cur, 'start': round(start, 3), 'end': round(end, 3)})
	return [w for w in words if not w['w'].startswith('<') and not w['w'].startswith('time=')]


def main():
	md, name = sys.argv[1], sys.argv[2]
	cfg = json.loads((ROOT / 'scripts/voice.json').read_text())
	data = synthesize(read_script(md), cfg)
	mp3 = ROOT / f'public/vo-{name}.mp3'
	mp3.write_bytes(base64.b64decode(data['audio_base64']))
	words = words_from_alignment(data.get('normalized_alignment') or data['alignment'])
	(ROOT / f'public/vo-{name}.words.json').write_text(json.dumps(words, ensure_ascii=False, indent=1), encoding='utf-8')
	subprocess.run(
		['ffmpeg', '-v', 'error', '-y', '-i', str(mp3), '-af',
		 'highpass=f=70,acompressor=threshold=-24dB:ratio=3:attack=5:release=120,loudnorm=I=-16:TP=-1.5:LRA=9',
		 '-ar', '44100', str(ROOT / f'public/vo-{name}.wav')],
		check=True,
	)
	print(f'{len(words)} kelime, {words[-1]["end"]:.1f} sn → public/vo-{name}.wav')


if __name__ == '__main__':
	main()
