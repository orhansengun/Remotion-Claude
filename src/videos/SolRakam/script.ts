import {CaptionBeat} from '../../components/Caption';

// Zamanlar ElevenLabs kaydındaki (public/vo-sol-rakam.mp3) konuşma aralarından ölçüldü (saniye).
export const SCENES = {
	hook: [0, 7.5],
	brain: [7.5, 14.6],
	catalog: [14.6, 27.5],
	market: [27.5, 34.1],
	luxury: [34.1, 39.7],
	round: [39.7, 43.0],
	end: [43.0, 45.0],
} as const;

export const TOTAL_SECONDS = 45;

// at: ilk satırın başladığı an, lines: sonraki satırların başlangıçları, to: konuşmanın bittiği an.
export const BEATS: CaptionBeat[] = [
	{at: -0.2, lines: [2.24], to: 4.3, text: "#9,99 ₺, | 10 ₺'den ~sadece !1 !kuruş ucuz."},
	{at: 4.97, lines: [6.54], to: 7.2, text: 'Ama beynine göre | #!tam #!1 #!lira.'},
	{at: 7.8, to: 9.5, text: 'Çünkü beyin | fiyatı ^soldan okur.'},
	{at: 10.03, lines: [11.2], to: 12.2, text: 'İlk rakamı görür, | ~gerisini ~es ~geçer.'},
	{at: 12.65, to: 14.3, text: 'Buna | ^sol ^rakam ^etkisi ~denir.'},
	{at: 15.05, to: 18.0, text: 'Bir giyim kataloğu | aynı elbiseyi ~üç ~fiyatla ~sattı:'},
	{at: 18.54, lines: [19.36], to: 21.0, text: '#$34, | #$39 ~ve #$44.'},
	{at: 21.62, lines: [22.5], to: 23.4, text: 'En çok satan, | ~en ~ucuzu ~olmadı.'},
	{at: 23.86, to: 24.9, text: '#^$39 ~oldu.'},
	{at: 25.36, lines: [26.3], to: 27.1, text: 'Daha ~pahalısı, | daha ~çok ^sattı.'},
	{at: 27.85, to: 29.4, text: 'Markette ^49,90 ₺,'},
	{at: 29.79, to: 32.5, text: 'telefonda ^59.999 ₺.'},
	{at: 33.05, to: 33.8, text: 'Hepsi | #aynı #oyun.'},
	{at: 34.34, lines: [35.4], to: 36.2, text: 'Ama lüks markalar | ~tam ^tersini ~yapar.'},
	{at: 36.82, lines: [37.6], to: 38.4, text: 'Yuvarlak fiyat | !indirim ~değil,'},
	{at: 38.75, to: 39.4, text: '#_değer ~anlatır.'},
	{at: 39.98, lines: [41.0], to: 41.7, text: "Bir dahaki sefere | ^9'u ~görürsen,"},
	{at: 42.19, lines: [42.55], to: 42.9, text: '#!YUKARI | #!YUVARLA.'},
	{at: 43.0, text: ''},
];

// Görsel olayların mutlak zamanları; efekt sesleri de bunlara bağlıdır.
export const CUES = {
	hookSettle: 0.3,
	hookTilt: 6.54,
	brainSweep: [7.8, 9.4],
	brainFocus: 10.03,
	brainPill: 12.9,
	dresses: 14.9,
	tags: [18.54, 19.36, 20.2],
	barsSide: 21.62,
	barWin: 23.86,
	crown: 24.4,
	bag: 27.85,
	phone: 29.79,
	sameGame: 33.05,
	luxuryShift: 36.82,
	luxuryValue: 38.75,
	roll: 42.19,
	end: 43.0,
} as const;
