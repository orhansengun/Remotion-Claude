import {CaptionBeat} from '../../components/Caption';

// Kayıt 45,0 sn; logo jeneriğine yer açmak için %5 hızlandırıldı. Zamanlar ORİJİNAL kayıt saniyesidir; T() videoya çevirir.
export const VO_RATE = 1.05;
export const T = (orig: number) => orig / VO_RATE;
export const TOTAL_SECONDS = 45;
export const STING: [number, number] = [6.0, 7.95]; // "Örgün Eğitim başlasın!"
export const END_AT = 44.18; // "Takip et!"

const RAW: CaptionBeat[] = [
	{at: -0.2, lines: [0.8], to: 1.5, text: 'Tam uykuya | ~dalarken...'},
	{at: 2.58, lines: [3.6], to: 4.3, text: 'Birden ^düşüyormuş ~gibi | #!irkildin #!mi?'},
	{at: 4.79, to: 5.67, text: '#Yalnız #^değilsin.'},
	{at: STING[0], text: ''},
	{at: 8.05, lines: [8.8], to: 9.67, text: 'Bunun adı | #^hipnik #^sıçrama.'},
	{at: 10.1, lines: [10.9], to: 12.54, text: "İnsanların | #_%70'e ~yakını ~bunu ~yaşıyor."},
	{at: 13.07, lines: [14.0], to: 15.8, text: 'Uykuya geçerken | ~kasların ~hızla ^gevşer...'},
	{at: 16.09, to: 17.19, text: 'kalbin ^yavaşlar...'},
	{at: 17.57, to: 18.85, text: 'nefesin ^ağırlaşır.'},
	{at: 19.2, lines: [21.0], to: 22.26, text: 'Ama beyin bu ani gevşemeyi | !yanlış ~yorumlayabilir:'},
	{at: 22.52, to: 23.26, text: '#!"DÜŞÜYORUZ!"'},
	{at: 23.59, lines: [24.3], to: 25.28, text: 'Ve vücuda | ~bir #!alarm ~yollar.'},
	{at: 25.67, lines: [26.2], to: 27.09, text: 'Kaslar | ~bir ~anda ^kasılır...'},
	{at: 27.37, lines: [28.0], to: 29.16, text: 'sen de o | #^sarsıntıyla ~uyanırsın.'},
	{at: 29.58, lines: [30.6, 32.3], to: 33.76, text: 'Bir teoriye göre | ~ağaçlarda ~uyuyan ^atalarımızdan | ~kalma ~bir ^refleks.'},
	{at: 34.08, lines: [35.16], to: 35.85, text: 'Düşmeden önce... | #^tutunmak ~için.'},
	{at: 36.25, lines: [38.0], to: 39.46, text: '^Kafein, ^stres ~ve ^yorgunluk | ~bu ~sıçramaları !artırır.'},
	{at: 39.85, lines: [40.8], to: 41.67, text: 'Yani o irkilme | !bir !arıza ~değil.'},
	{at: 41.96, lines: [42.6], to: 43.76, text: 'Beynin | #_seni #_korumaya ~çalışıyor.'},
	{at: END_AT, text: ''},
];

export const BEATS: CaptionBeat[] = RAW.map((b) => ({
	...b,
	at: T(b.at),
	lines: b.lines?.map(T),
	to: b.to === undefined ? undefined : T(b.to),
}));
