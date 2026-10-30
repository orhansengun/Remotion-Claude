# Video 01 — "9,99 TL, 10 TL'den ucuz değil" (Sol Rakam Etkisi)

**Süre:** 45 sn (ses + müzik + efekt + logo jeneriği) · **Format:** 1080×1920 dikey · **Render:** `renders/01-sol-rakam-etkisi.mp4`

## ElevenLabs'e yapıştırılacak metin

Rakamlar, doğru okunsun diye yazıyla yazıldı. `<break>` etiketleri sahne geçişlerindeki duraklardır.

```
Dokuz lira doksan dokuz kuruş, on liradan sadece bir kuruş ucuz. <break time="0.3s" />
Ama beynine göre... tam bir lira. <break time="0.4s" />
Çünkü beyin fiyatı soldan okur. İlk rakamı görür, gerisini es geçer. Buna sol rakam etkisi denir. <break time="0.4s" />
Bir giyim kataloğu aynı elbiseyi üç fiyatla sattı: otuz dört, otuz dokuz ve kırk dört dolar. <break time="0.3s" />
En çok satan, en ucuzu olmadı. Otuz dokuz dolar oldu. Daha pahalısı, daha çok sattı. <break time="0.4s" />
Markette kırk dokuz doksan, telefonda elli dokuz bin dokuz yüz doksan dokuz. Hepsi aynı oyun. <break time="0.4s" />
Ama lüks markalar tam tersini yapar. Yuvarlak fiyat indirim değil, değer anlatır. <break time="0.4s" />
Bir dahaki sefere dokuzu görürsen... yukarı yuvarla. <break time="0.3s" />
Takip et.
```

**Önerilen ayarlar:** Eleven Multilingual v2 · enerjik, genç bir anlatıcı sesi · Stability ~40 · Style ~30 · hız 1.0–1.1.
Toplam okuma hedefi ~43 sn. Uzun kalırsa hızı 1.1'e çekin.

## Zaman tablosu (videodaki altyazılar bu saniyelerde başlar)

| Saniye | Söylenen |
|---|---|
| 0,0 | Dokuz lira doksan dokuz kuruş, on liradan sadece bir kuruş ucuz. |
| 4,3 | Ama beynine göre tam bir lira. |
| 6,6 | Çünkü beyin fiyatı soldan okur. |
| 8,9 | İlk rakamı görür, gerisini es geçer. |
| 11,3 | Buna sol rakam etkisi denir. |
| 13,6 | Bir giyim kataloğu aynı elbiseyi üç fiyatla sattı: |
| 17,3 | otuz dört, otuz dokuz ve kırk dört dolar. |
| 20,3 | En çok satan, en ucuzu olmadı. |
| 22,6 | Otuz dokuz dolar oldu. |
| 24,3 | Daha pahalısı, daha çok sattı. |
| 26,5 | Markette kırk dokuz doksan, |
| 28,2 | telefonda elli dokuz bin dokuz yüz doksan dokuz. |
| 30,9 | Hepsi aynı oyun. |
| 32,3 | Ama lüks markalar tam tersini yapar. |
| 34,6 | Yuvarlak fiyat indirim değil, |
| 36,5 | değer anlatır. |
| 37,9 | Bir dahaki sefere dokuzu görürsen, |
| 40,0 | yukarı yuvarla. |
| 41,6 | (Kapanış kartı) Takip et. |

Final videoda sahneler ElevenLabs kaydının konuşma aralarına göre yeniden zamanlandı (`src/videos/SolRakam/script.ts` → `BEATS`, `CUES`).

## Ses miksajı

- Seslendirme: `public/vo-sol-rakam.wav` (orijinal MP3, -16 LUFS'a normalize edildi)
- Müzik: `public/music/lofi-96.wav`; `scripts/gen_audio.py` ile sentezlendi, telif sorunu yok. Konuşmanın yaklaşık 18 dB altında çalar, jenerikte yükselir.
- Efektler: `public/sfx/*.wav` (whoosh, pop, tick, ding, coin, rise, thud, logo), `Soundtrack.tsx` içinde görsel olaylara bağlı.
- Mastering: render sonrası -14 LUFS, tepe değeri -1,5 dBFS:
  ```bash
  ffmpeg -i out/SolRakam-raw.mp4 -c:v copy -af "volume=<-14 - I>dB,alimiter=limit=0.84:level=false" -c:a aac -b:a 192k out/SolRakam.mp4
  ```

## Paylaşım metni

**Açıklama:** 9,99 TL'lik bir şeyi neden 9 lira gibi görürsün? Beynin fiyatı soldan okur. Bir dahaki indirimde yukarı yuvarla. 🧠💸
**Kaynak:** Anderson & Simester, "Mind Your Pricing Cues", Harvard Business Review, 2003.
**Etiketler:** #fiyatpsikolojisi #pazarlama #tüketicipsikolojisi #ekonomi #örgüneğitim #bilgi #keşfet
