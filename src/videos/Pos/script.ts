import {CaptionBeat} from '../../components/Caption';

// Kayıt 46,5 sn; 45 sn sınırı için %5 hızlandırıldı (atempo). Aşağıdaki tüm zamanlar
// ORİJİNAL kayıttaki saniyelerdir, T() ile videodaki saniyeye çevrilir.
export const VO_RATE = 1.05;
export const T = (orig: number) => orig / VO_RATE;
export const TOTAL_SECONDS = 45;
export const END_AT = 43.15; // "Takip et" → logo jeneriği

const RAW: CaptionBeat[] = [
	{at: -0.2, lines: [0.9], to: 1.6, text: "Kartını POS'a | ~yaklaştırdın."},
	{at: 2.07, to: 3.1, text: 'İki saniye sonra:'},
	{at: 3.49, to: 4.13, text: '#_ONAYLANDI.'},
	{at: 4.6, lines: [5.5], to: 6.56, text: 'Peki o ^iki ^saniyede | ~ne ~oldu?'},
	{at: 6.99, lines: [7.5], to: 8.0, text: 'Kartında | #!pil #!yok.'},
	{at: 8.43, lines: [10.1], to: 11.69, text: "POS'un ^manyetik ^alanı, | ~çipe ~elektrik ~verir."},
	{at: 12.03, to: 12.84, text: '#Kart #^uyanır.'},
	{at: 13.27, lines: [14.6], to: 15.52, text: 'Çip, kart numaranı | !açıkça ~göndermez.'},
	{at: 15.93, lines: [17.2], to: 19.05, text: 'Alışverişe özel, | ^tek ^kullanımlık ~bir ~şifre ~üretir.'},
	{at: 19.4, lines: [20.3], to: 21.66, text: 'Kopyalansa bile | !ikinci !kez ~işe ~yaramaz.'},
	{at: 22.05, lines: [22.9], to: 24.15, text: 'Önce | ^mağazanın ^bankasına,'},
	{at: 24.49, lines: [25.0], to: 27.26, text: 'oradan | ^Visa, ^Mastercard ~ya ~da ^Troy ~ağına,'},
	{at: 27.58, lines: [28.0], to: 28.83, text: 'sonra | ^senin ^bankana ~gider.'},
	{at: 29.31, lines: [30.5], to: 32.34, text: 'Bankan ^bakiyeni ~ve | ^dolandırıcılık ^riskini ~kontrol ~eder,'},
	{at: 32.66, lines: [33.3], to: 34.42, text: 'cevabı | ~aynı ~yoldan ~geri ~yollar.'},
	{at: 34.85, lines: [35.4], to: 36.45, text: 'Hepsi | #_2 #_saniyeden ~kısa.'},
	{at: 36.82, lines: [37.8], to: 38.62, text: 'Ama para o an | !mağazaya !geçmez.'},
	{at: 38.95, lines: [39.4], to: 40.17, text: 'Sadece | #^bloke ~edilir.'},
	{at: 40.51, lines: [41.3], to: 42.8, text: 'Asıl transfer, | ^gün ^sonunda ~toplu ~yapılır.'},
	{at: END_AT, text: ''},
];

export const BEATS: CaptionBeat[] = RAW.map((b) => ({
	...b,
	at: T(b.at),
	lines: b.lines?.map(T),
	to: b.to === undefined ? undefined : T(b.to),
}));
