import {CaptionBeat} from '../../components/Caption';

// Kayıt 44,6 sn; logo jeneriğine yer açmak için %5 hızlandırıldı. Zamanlar ORİJİNAL kayıt saniyesidir; T() videoya çevirir.
export const VO_RATE = 1.05;
export const T = (orig: number) => orig / VO_RATE;
export const TOTAL_SECONDS = 45;
export const STING: [number, number] = [3.3, 4.95]; // "Örgün Eğitim başlasın!"
export const END_AT = 43.78; // "Takip et!"

const RAW: CaptionBeat[] = [
	{at: -0.2, lines: [1.91], to: 2.9, text: 'Soğan seni ^ağlatmıyor... | #_kendini #_koruyor.'},
	{at: STING[0], text: ''},
	{at: 5.18, lines: [6.6], to: 7.96, text: 'Soğanın hücrelerinde | ~iki ~şey ~ayrı ~ayrı ~bekler:'},
	{at: 8.42, lines: [9.66], to: 10.34, text: '^kükürtlü ^bir ^madde | ~ve ~bir #_enzim.'},
	{at: 10.79, lines: [12.98], to: 13.8, text: 'Bıçak hücreyi parçaladığı an... | #^ikisi #^buluşur.'},
	{at: 14.3, lines: [15.6], to: 16.77, text: 'Saniyeler içinde | ~göz #!yakıcı ~bir ~gaz ~oluşur.'},
	{at: 17.18, lines: [18.25], to: 20.04, text: 'Adı bile zor: | ^syn-propanethial-S-oxide'},
	{at: 20.47, lines: [22.0], to: 23.73, text: 'Gaz havaya yükselir, | ~gözündeki ^sinir ^uçlarına ~ulaşır.'},
	{at: 24.15, lines: [25.51], to: 26.72, text: 'Beyin #!alarm ~verir, | ~gözyaşı ~bezleri ^açılır.'},
	{at: 27.19, lines: [28.08], to: 29.37, text: 'Gözyaşı, | ~o ~gazı #_yıkamak ~için ~akar.'},
	{at: 29.81, lines: [31.5, 33.6], to: 35.05, text: 'Yani bu, soğanın | ~onu ~yemeye ~çalışan ~hayvanlara ~karşı | #^kimyasal #^kalkanı.'},
	{at: 35.41, to: 36.47, text: 'Ağlamamak için mi?'},
	{at: 36.84, lines: [38.96], to: 41.7, text: '#_1 ~Soğanı ^buzdolabında ~soğut, | #_2 ^keskin ~bıçak, #_3 ^kökü ~en ~son.'},
	{at: 42.06, to: 43.38, text: 'Sen hangisini | #^deneyeceksin?'},
	{at: END_AT, text: ''},
];

export const BEATS: CaptionBeat[] = RAW.map((b) => ({
	...b,
	at: T(b.at),
	lines: b.lines?.map(T),
	to: b.to === undefined ? undefined : T(b.to),
}));
