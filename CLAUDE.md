# Örgün Eğitim video üretimi — çalışma düzeni

1. Konu seçilince **yalnızca seslendirme metni** hazırlanır (`scripts/NN-konu.md`): ElevenLabs'e yapıştırılacak metin,
   telaffuz notları, kaynaklar, paylaşım metni. Bu aşamada video veya kapak render edilmez.
2. Kullanıcı ElevenLabs MP3'ünü gönderir. Ardından:
   - `silencedetect` ile konuşma aralıkları ölçülür, `script.ts` içindeki `SCENES`, `BEATS`, `CUES` buna göre yazılır.
   - Ses `public/vo-<konu>.wav` olarak normalize edilir (highpass + compressor + loudnorm -16).
   - Video render edilir, sonra sabit kazanç + limiter ile -14 LUFS'a getirilir (dinamik loudnorm kullanma).
   - Kapak (`src/components/Cover.tsx`, Instagram 3:4 güvenli alanı) **en son** hazırlanır.
3. Final video ve kapak birlikte teslim edilir (`renders/`).

Renk: Izgara tekdüze görünmesin diye her video konusuna uygun bir palet seçer (`PALETTES` in `src/theme.ts`:
cream, navy, sage, blush, butter). Kapak `palette`, video `<Stage palette>` ile renklenir. Art arda iki paylaşımda aynı
palet kullanılmaz. Şu ana kadar: 01 Sol Rakam = cream (video+kapak), 02 IKEA = video cream, kapak navy.

Stil: düz vektör çizimler, düz vektör çizimler, kelime kelime altyazı, ≤45 sn, ilk 2 sn kanca, sonda logo jeneriği.
Ortak parçalar: `src/components/kit.tsx`, `Soundtrack.tsx`, `Caption.tsx`, `Props.tsx`, `Stage.tsx`.
