import {CaptionBeat} from '../../components/Caption';

// Sahne sınırları (saniye). Seslendirme süresi değişirse buradan kaydırılır.
export const SCENES = {
	hook: [0, 6.6],
	brain: [6.6, 13.6],
	catalog: [13.6, 26.5],
	market: [26.5, 32.3],
	luxury: [32.3, 37.9],
	round: [37.9, 41.6],
	end: [41.6, 44.5],
} as const;

export const TOTAL_SECONDS = 44.5;

export const BEATS: CaptionBeat[] = [
	{at: -0.2, text: "#9,99 ₺, | 10 ₺'den ~sadece !1 !kuruş ucuz."},
	{at: 4.3, text: 'Ama beynine göre | #!tam #!1 #!lira.'},
	{at: 6.6, text: 'Çünkü beyin | fiyatı ^soldan okur.'},
	{at: 8.9, text: 'İlk rakamı görür, | ~gerisini ~es ~geçer.'},
	{at: 11.3, text: 'Buna | ^sol ^rakam ^etkisi ~denir.'},
	{at: 13.6, text: 'Bir giyim kataloğu | aynı elbiseyi ~üç ~fiyatla ~sattı:'},
	{at: 17.3, text: '#$34, #$39 ~ve #$44.'},
	{at: 20.3, text: 'En çok satan | ~en ~ucuzu ~olmadı.'},
	{at: 22.6, text: '#^$39 ~oldu.'},
	{at: 24.3, text: 'Daha ~pahalısı, | daha ~çok ^sattı.'},
	{at: 26.5, text: 'Markette ^49,90 ₺,'},
	{at: 28.2, text: 'telefonda ^59.999 ₺.'},
	{at: 30.9, text: 'Hepsi | #aynı #oyun.'},
	{at: 32.3, text: 'Ama lüks markalar | ~tam ^tersini ~yapar.'},
	{at: 34.6, text: 'Yuvarlak fiyat | !indirim ~değil,'},
	{at: 36.5, text: '#_değer ~anlatır.'},
	{at: 37.9, text: "Bir dahaki sefere | ^9'u ~görürsen,"},
	{at: 40.0, text: '#!YUKARI | #!YUVARLA.'},
	{at: 41.6, text: ''},
];
