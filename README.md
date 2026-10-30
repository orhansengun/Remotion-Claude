# Örgün Eğitim — Video Üretimi

Remotion ile üretilen 45 saniyelik dikey bilgi videoları.

- Kod: `src/videos/<Video>/` (sahneler), `script.ts` (altyazı ve sahne zamanları)
- Seslendirme metinleri: `scripts/`
- Hazır videolar: `renders/`

```bash
npm install
npm run studio                       # önizleme
npx remotion render src/index.ts SolRakam out/SolRakam.mp4
npx remotion still src/index.ts SolRakamCover out/cover.png   # kapak
```

## Kapak

`src/components/Cover.tsx` ortak kapak şablonudur (1080×1920). Instagram profil ızgarası ortadaki
1080×1440'ı (3:4) gösterdiği için içerik y=240..1680 arasında tutulur. Yeni video için `Root.tsx`'e
`kicker`, `top`, `price`, `bottom` değerleriyle yeni bir `<Still>` eklemek yeterlidir.
