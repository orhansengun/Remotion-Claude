import {CaptionBeat} from '../../components/Caption';

// Zamanlar ElevenLabs kaydındaki (public/vo-ikea.wav) konuşma aralarından ölçüldü (saniye).
export const SCENES = {
	hook: [0, 4.3],
	path: [4.3, 10.1],
	showroom: [10.1, 13.9],
	bag: [13.9, 19.3],
	items: [19.3, 24.8],
	research: [24.8, 29.8],
	exit: [29.8, 35.4],
	gruen: [35.4, 39.75],
	close: [39.75, 42.75],
} as const;

export const TOTAL_SECONDS = 45;

export const BEATS: CaptionBeat[] = [
	{at: -0.2, lines: [1.2], to: 2.4, text: "IKEA'da ^kaybolman | ~tasarım ~hatası !değil."},
	{at: 2.92, to: 4.0, text: '#Planın | #^ta #^kendisi.'},
	{at: 4.59, lines: [5.93], to: 7.4, text: 'Kapıdan girdiğin an | ~tek ^bir ^yol ~seni ~içeri ~çeker.'},
	{at: 7.96, lines: [9.18], to: 9.7, text: 'Kısa yollar var, | ~ama !gizli.'},
	{at: 10.41, to: 11.5, text: 'Önce ^hazır ^odalar.'},
	{at: 12.01, lines: [12.9], to: 13.6, text: 'Kendini o evde | ^hayal ~edersin.'},
	{at: 14.15, lines: [15.3], to: 16.7, text: 'Sonra kocaman, | ^sarı ^bir ^çanta ~alırsın.'},
	{at: 17.24, lines: [18.19], to: 19.0, text: '#Boş #çanta, | ~doldurulmak ^ister.'},
	{at: 19.63, lines: [20.33, 21.1], to: 21.9, text: 'Mumlar, | ~çerçeveler, | ~peçeteler...'},
	{at: 22.4, lines: [23.4], to: 24.55, text: 'Hepsi ^ucuz, | ~hepsi ~yolunun ^üstünde.'},
	{at: 25.07, to: 26.2, text: 'Bir ^araştırmaya ~göre,'},
	{at: 26.41, lines: [28.3], to: 29.5, text: "IKEA'da ~alınanların ~yarısından ~fazlası | #!listede #!yoktu."},
	{at: 30.08, lines: [30.9], to: 31.6, text: 'Çıkışta da | ^ucuz ~bir ^sosisli.'},
	{at: 32.09, lines: [32.9], to: 33.7, text: 'Çünkü beyin | ~son ^anı ~hatırlar:'},
	{at: 34.27, to: 35.1, text: '#"Ne #ucuz #yer!"'},
	{at: 35.61, lines: [36.0], to: 36.9, text: 'Buna | ^Gruen ^etkisi ~denir.'},
	{at: 37.44, lines: [38.65], to: 39.4, text: 'Kaybolan müşteri, | #!daha #!çok #!harcar.'},
	{at: 40.02, lines: [40.9], to: 41.5, text: 'Bir dahaki sefere | ^listeni ~yaz,'},
	{at: 41.88, lines: [42.25], to: 42.6, text: '#!KISA #!YOLU | #!BUL.'},
	{at: 42.75, text: ''},
];

// Görsel olayların mutlak zamanları; efekt sesleri de bunlara bağlıdır.
export const CUES = {
	mazeDraw: [0.2, 2.4],
	planStamp: 2.95,
	arrows: 5.93,
	shortcut: 8.1,
	rooms: 10.41,
	dream: 12.8,
	bagDrop: 15.3,
	bagEmpty: 17.24,
	items: [19.63, 20.33, 21.1],
	cheapTags: 22.4,
	listPaper: 25.07,
	listCross: 28.3,
	hotdog: 30.9,
	brainBubble: 32.2,
	cheapThought: 34.27,
	gruenPill: 35.9,
	receipt: 37.44,
	listWrite: 40.8,
	shortLine: 41.88,
	end: 42.75,
} as const;
