import {CaptionBeat} from '../../components/Caption';

// Zamanlar ElevenLabs kaydındaki (public/vo-ucretsiz.wav) konuşma aralarından ölçüldü (saniye).
export const SCENES = {
	hook: [0, 3.7],
	form: [3.7, 9.6],
	cancel: [9.6, 16.8],
	own: [16.8, 22.7],
	loss: [22.7, 27.3],
	gym: [27.3, 34.9],
	free: [34.9, 39.6],
	close: [39.6, 42.5],
} as const;

export const TOTAL_SECONDS = 45;

export const BEATS: CaptionBeat[] = [
	{at: -0.2, to: 1.1, text: '#İlk #ay #^ücretsiz.'},
	{at: 1.63, lines: [2.4], to: 3.4, text: 'Çünkü iptal etmeyi | #!unutacaksın.'},
	{at: 3.86, lines: [4.8], to: 5.5, text: 'Şirketler bunu | ~senden ^iyi ~bilir.'},
	{at: 6.04, lines: [7.73], to: 9.2, text: 'Kart bilgini ~baştan ~ister, | ~ama ^hatırlatma !göndermez.'},
	{at: 9.79, to: 10.9, text: 'Kaydolmak | #_tek #_tık.'},
	{at: 11.43, to: 12.3, text: 'İptal etmek mi?'},
	{at: 12.74, lines: [14.46], to: 16.5, text: 'Menülerin, soruların, | !"Emin !misin?" ~ekranlarının ~arkasında.'},
	{at: 16.99, lines: [18.2], to: 19.1, text: 'Bir ay sonra | ~o ~hizmet ~artık #^senin.'},
	{at: 19.63, lines: [20.4, 21.46], to: 22.4, text: 'Listelerin, | profillerin, | ~alışkanlıkların...'},
	{at: 22.91, lines: [23.9], to: 25.0, text: 'Vazgeçmek, | !kaybetmek ~gibi ~gelir.'},
	{at: 25.48, to: 26.9, text: 'Buna | ^kayıp ^korkusu ~denir.'},
	{at: 27.52, lines: [28.6], to: 29.5, text: 'Bir araştırma | ~spor ~salonlarına ~baktı.'},
	{at: 30.0, lines: [31.3], to: 32.6, text: 'Aylık üyeler, | ~gidiş ~başına #!$17 ~ödedi.'},
	{at: 33.0, lines: [33.9], to: 34.6, text: 'Oysa tek giriş | #_$10.'},
	{at: 35.06, lines: [36.4], to: 37.2, text: 'Yani ücretsiz deneme | #!bedava #!değil.'},
	{at: 37.71, lines: [38.5], to: 39.3, text: 'Unutkanlığına yapılan | ^bir ^yatırım.'},
	{at: 39.79, lines: [40.95, 41.6], to: 42.3, text: 'Kaydolduğun gün, | ~iptal ~gününü | #!TAKVİME #!YAZ.'},
	{at: 42.5, text: ''},
];

// Görsel olayların mutlak zamanları; efekt sesleri de bunlara bağlıdır.
export const CUES = {
	freeTag: 0.1,
	days: [1.63, 3.15],
	flip: 3.2,
	form: 3.95,
	cardType: [6.04, 7.2],
	bellMute: 8.3,
	signup: 9.9,
	click: 10.4,
	cancelLink: 11.5,
	menus: 12.74,
	sure: 14.5,
	ownCard: 17.0,
	ownItems: [19.63, 20.4, 21.46],
	lossEq: 22.95,
	lossPill: 25.5,
	gym: 27.6,
	bar17: 31.3,
	bar10: 33.3,
	bedava: 35.1,
	crack: 36.4,
	invest: 37.8,
	calendar: 39.8,
	circle: 41.0,
	end: 42.5,
} as const;
