export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
	bg: '#F1EEE6',
	ink: '#1E3A2F',
	green: '#2F6B4F',
	mint: '#5E8C76',
	orange: '#E8732A',
	red: '#D9363E',
	gold: '#D9A62B',
	grey: '#A3ABA5',
	card: '#FFFDF8',
	shadow: 'rgba(30,58,47,0.12)',
};

export const FONT = "'Inter Display', 'Inter', sans-serif";
export const GROUND_Y = 1300;

export const sec = (s: number) => Math.round(s * FPS);

// Kapak ve sahne zemini paletleri. Izgarada tekdüzelik olmasın diye her video konusuna uygun farklı bir palet seçer.
export type Palette = {
	bg: string;
	dots: string;
	ground: string;
	line: string;
	text: string;
	accent: string;
	pillBg: string;
	pillText: string;
	beam: string;
	people: [string, string];
	mark: string;
};

export const PALETTES = {
	cream: {
		bg: '#F1EEE6',
		dots: 'rgba(30,58,47,0.08)',
		ground: '#E6E2D8',
		line: C.ink,
		text: C.ink,
		accent: C.red,
		pillBg: C.ink,
		pillText: C.card,
		beam: 'rgba(255,214,90,0.35)',
		people: [C.mint, C.green],
		mark: C.red,
	},
	navy: {
		bg: '#1E3A5F',
		dots: 'rgba(255,255,255,0.07)',
		ground: '#17304F',
		line: '#0E1F33',
		text: '#FFFDF8',
		accent: '#FFD23F',
		pillBg: '#FFD23F',
		pillText: '#1E3A5F',
		beam: 'rgba(255,230,140,0.2)',
		people: ['#8FB3D9', '#F1EEE6'],
		mark: '#FFD23F',
	},
	sage: {
		bg: '#D9E7DC',
		dots: 'rgba(30,58,47,0.09)',
		ground: '#C6D8CA',
		line: C.ink,
		text: C.ink,
		accent: C.orange,
		pillBg: C.green,
		pillText: C.card,
		beam: 'rgba(255,255,255,0.4)',
		people: [C.green, C.ink],
		mark: C.orange,
	},
	blush: {
		bg: '#F6DCCB',
		dots: 'rgba(120,40,20,0.08)',
		ground: '#EDC9B3',
		line: C.ink,
		text: C.ink,
		accent: C.red,
		pillBg: C.red,
		pillText: C.card,
		beam: 'rgba(255,255,255,0.35)',
		people: ['#C8705A', '#4A1F14'],
		mark: C.red,
	},
	butter: {
		bg: '#F7E7A8',
		dots: 'rgba(60,40,0,0.08)',
		ground: '#EFD885',
		line: C.ink,
		text: C.ink,
		accent: '#B3261E',
		pillBg: '#B3261E',
		pillText: C.card,
		beam: 'rgba(255,255,255,0.4)',
		people: [C.green, C.mint],
		mark: '#B3261E',
	},
} satisfies Record<string, Palette>;
