import {CaptionBeat} from '../../components/Caption';

// TAHMİNİ zamanlar (~2,6 kelime/sn). ElevenLabs kaydı gelince konuşma aralarına göre güncellenecek.
export const SCENES = {
	hook: [0, 3.9],
	path: [3.9, 9.9],
	showroom: [9.9, 13.9],
	bag: [13.9, 18.7],
	items: [18.7, 23.3],
	research: [23.3, 27.8],
	exit: [27.8, 33.7],
	gruen: [33.7, 38.2],
	close: [38.2, 42.1],
} as const;

export const TOTAL_SECONDS = 45;

export const BEATS: CaptionBeat[] = [
	{at: -0.2, lines: [1.0], to: 1.9, text: "IKEA'da ^kaybolman | ~tasarım ~hatası !değil."},
	{at: 2.3, to: 3.5, text: '#Planın | #^ta #^kendisi.'},
	{at: 4.0, lines: [5.5], to: 7.4, text: 'Kapıdan girdiğin an | ~tek ^bir ^yol ~seni ~içeri ~çeker.'},
	{at: 7.8, lines: [8.9], to: 9.7, text: 'Kısa yollar var, | ~ama !gizli.'},
	{at: 10.2, to: 11.4, text: 'Önce ^hazır ^odalar.'},
	{at: 11.7, lines: [12.6], to: 13.6, text: 'Kendini o evde | ^hayal ~edersin.'},
	{at: 14.1, lines: [15.2], to: 16.4, text: 'Sonra kocaman, | ^sarı ^bir ^çanta ~alırsın.'},
	{at: 16.8, lines: [17.5], to: 18.4, text: '#Boş #çanta, | ~doldurulmak ^ister.'},
	{at: 18.9, to: 20.7, text: 'Mumlar, ~çerçeveler, ~peçeteler...'},
	{at: 21.0, lines: [22.0], to: 23.0, text: 'Hepsi ^ucuz, | ~hepsi ~yolunun ^üstünde.'},
	{at: 23.5, lines: [25.3], to: 27.5, text: "Alınanların ~yarısından ~fazlası | #!listede #!yoktu."},
	{at: 28.0, to: 29.9, text: 'Çıkışta da | ^ucuz ~bir ^sosisli.'},
	{at: 30.3, to: 32.1, text: 'Çünkü beyin | ~son ^anı ~hatırlar:'},
	{at: 32.4, to: 33.4, text: '#"Ne #ucuz #yer!"'},
	{at: 33.9, to: 35.5, text: 'Buna | ^Gruen ^etkisi ~denir.'},
	{at: 35.9, lines: [36.9], to: 37.9, text: 'Kaybolan müşteri, | #!daha #!çok #!harcar.'},
	{at: 38.4, to: 40.2, text: 'Bir dahaki sefere | ^listeni ~yaz,'},
	{at: 40.4, to: 41.6, text: '#!KISA #!YOLU | #!BUL.'},
	{at: 42.1, text: ''},
];

// Görsel olayların mutlak zamanları; efekt sesleri de bunlara bağlıdır.
export const CUES = {
	mazeDraw: [0.2, 2.2],
	planStamp: 2.4,
	arrows: 4.6,
	shortcut: 8.0,
	rooms: 10.2,
	dream: 11.8,
	bagDrop: 14.6,
	bagEmpty: 16.9,
	items: [18.9, 19.5, 20.1],
	cheapTags: 21.0,
	listPaper: 23.5,
	listCross: 25.3,
	hotdog: 28.1,
	brainBubble: 30.4,
	cheapThought: 32.4,
	gruenPill: 34.0,
	receipt: 35.9,
	listWrite: 38.5,
	shortLine: 40.4,
	end: 42.1,
} as const;
