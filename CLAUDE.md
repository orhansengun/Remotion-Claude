# Örgün Eğitim video üretimi — çalışma düzeni

1. Konu seçilince önce **seslendirme metni** hazırlanır (`scripts/NN-konu.md`): ElevenLabs'e yapıştırılacak metin,
   telaffuz notları, kaynaklar, paylaşım metni. Bu aşamada video veya kapak render edilmez.
2. Seslendirme:
   - **Otomatik (tercih):** `ELEVENLABS_API_KEY` ve `ELEVENLABS_VOICE_ID` ortamda varsa ve api.elevenlabs.io izinliyse
     `python3 scripts/tts.py scripts/NN-konu.md <konu>` çalıştırılır. Bu `public/vo-<konu>.wav` ve kelime zamanlarını
     (`vo-<konu>.words.json`) üretir; `SCENES`, `BEATS`, `CUES` kelime zamanlarından yazılır. Kullanıcıdan MP3 istenmez.
   - **Yedek:** Erişim yoksa kullanıcı MP3 gönderir; `silencedetect` ile aralıklar ölçülür, ses aynı zincirle normalize edilir.
   - Ses sabittir (aynı voice ID, ayarlar `scripts/voice.json`). Hız ~2,75 kelime/sn, 44 sn için ~100-105 kelime yazılır.
   - Video render edilir, sonra sabit kazanç + limiter ile -14 LUFS'a getirilir (dinamik loudnorm kullanma).
   - Kapak (`src/components/Cover.tsx`, Instagram 3:4 güvenli alanı) **en son** hazırlanır.
3. Final video ve kapak birlikte teslim edilir (`renders/`).

Renk: Izgara tekdüze görünmesin diye her video konusuna uygun bir palet seçer (`PALETTES` in `src/theme.ts`:
cream, navy, sage, blush, butter). Kapak `palette`, video `<Stage palette>` ile renklenir. Art arda iki paylaşımda aynı
palet kullanılmaz. Şu ana kadar: 01 Sol Rakam = cream (video+kapak), 02 IKEA = video cream, kapak navy; 03 Ücretsiz deneme = blush (video+kapak).

Stil: düz vektör çizimler, düz vektör çizimler, kelime kelime altyazı, ≤45 sn, ilk 2 sn kanca, sonda logo jeneriği.
Ortak parçalar: `src/components/kit.tsx`, `Soundtrack.tsx`, `Caption.tsx`, `Props.tsx`, `Stage.tsx`.

## 3D sinematik format (04 POS'tan itibaren varsayılan)

- Konular: merak uyandıran "nasıl çalışır / neden" başlıkları + gündem. Kanca bir soru ya da şaşırtıcı bir iddia.
- 3D: `@remotion/three` + `@react-three/drei` + `@react-three/postprocessing` (DOF, bloom, vinyet). Tek `ThreeCanvas`,
  içinde tüm mekânlar (ör. dükkân, maket şehir, oda) ve `SHOTS` listesiyle kesmeli kamera planları.
  Dikey kadrajın yatay açısı dar: geniş mekânlarda shot başına `fov` 45-50 kullan. 3D yazı için `Label` (canvas dokusu).
- Altyazı: `<Captions tone="light">`. Kapak: `CinemaCover` + `<World atFrame>` ile dondurulmuş 3D kare (`Freeze` ThreeCanvas içine geçmez).
- Render: `--gl=swangle --concurrency=4`; 1080p 45 sn ≈ 20-40 dk. Önizleme için `remotion still --scale=0.333`.
- Kayıt 45 sn'yi aşarsa ses `atempo` ile hızlandırılır (≤ %6), zamanlar `T()` ile çevrilir.

## Müzik ve efektler

- Her video **içeriğine uygun, kendine özel** bir müzik alır (`scripts/gen_audio.py`): ör. 01-03 lofi (`music/lofi-96.wav`),
  04 POS teknoloji/fintek (`music/tech-120-pos.wav`, bölüm yoğunlukları hikâyeye göre). Aynı parça tekrar kullanılmaz.
- Efektler sahnedeki olayla eşleşmeli (POS bip, onay, NFC, uğultu, kıvılcım, veri, kilit, glitch, fiş yazıcı...).
  Yeni konu yeni ses gerektiriyorsa önce `gen_audio.py`'ye eklenir.
