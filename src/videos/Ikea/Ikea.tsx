import {AbsoluteFill, interpolate} from 'remotion';
import {Captions} from '../../components/Caption';
import {Abs, EndSequence, Scene, useAbsFrame, usePop, useRamp} from '../../components/kit';
import {Person} from '../../components/Props';
import {Hit, panHits, Soundtrack} from '../../components/Soundtrack';
import {Spotlight, Stage} from '../../components/Stage';
import {C, FONT, GROUND_Y, sec} from '../../theme';
import {BEATS, CUES, SCENES, TOTAL_SECONDS} from './script';

export const IKEA_FRAMES = sec(TOTAL_SECONDS);

const BLUE = '#1F5FA8';
const YELLOW = '#FFD23F';

// Kuşbakışı mağaza planı: tek yönlü yılan yol. Duvarlar sırayla üstten ve alttan gelir.
const MAZE_W = 800;
const MAZE_H = 600;
const PATH: [number, number][] = [
	[80, 560], [80, 70], [240, 70], [240, 530], [400, 530], [400, 70], [560, 70], [560, 530], [720, 530], [720, 40],
];
const WALLS = [160, 320, 480, 640].map((x, i) => (i % 2 ? [x, 140, x, MAZE_H] : [x, 0, x, 460]));

const pathLength = PATH.slice(1).reduce((acc, p, i) => acc + Math.hypot(p[0] - PATH[i][0], p[1] - PATH[i][1]), 0);
const pointAt = (t: number) => {
	let left = t * pathLength;
	for (let i = 1; i < PATH.length; i++) {
		const [x0, y0] = PATH[i - 1];
		const [x1, y1] = PATH[i];
		const seg = Math.hypot(x1 - x0, y1 - y0);
		if (left <= seg) return [x0 + ((x1 - x0) * left) / seg, y0 + ((y1 - y0) * left) / seg];
		left -= seg;
	}
	return PATH[PATH.length - 1];
};

export const Maze: React.FC<{draw: number; fade?: number; straight?: number; labels?: boolean}> = ({
	draw,
	fade = 0,
	straight = 0,
	labels = true,
}) => {
	const [dx, dy] = pointAt(draw);
	return (
		<svg width={MAZE_W} height={MAZE_H} viewBox={`0 0 ${MAZE_W} ${MAZE_H}`} style={{overflow: 'visible'}}>
			<rect x={0} y={0} width={MAZE_W} height={MAZE_H} rx={24} fill={C.card} stroke={C.ink} strokeWidth={10} />
			{WALLS.map(([x1, y1, x2, y2], i) => (
				<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.ink} strokeWidth={10} />
			))}
			<g opacity={1 - fade * 0.75}>
				<polyline
					points={PATH.map((p) => p.join(',')).join(' ')}
					fill="none"
					stroke={C.orange}
					strokeWidth={14}
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeDasharray={`${pathLength}`}
					strokeDashoffset={pathLength * (1 - draw)}
				/>
				<circle cx={dx} cy={dy} r={22} fill={C.mint} stroke={C.ink} strokeWidth={6} />
			</g>
			<line
				x1={80}
				y1={560}
				x2={80 + (720 - 80) * straight}
				y2={560 + (40 - 560) * straight}
				stroke={C.green}
				strokeWidth={22}
				strokeLinecap="round"
			/>
			{labels && (
			<>
			<text x={80} y={MAZE_H + 50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.grey}>
				GİRİŞ
			</text>
			<text x={720} y={-20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.grey}>
				KASA
			</text>
			</>
			)}
		</svg>
	);
};

// 1) Kanca: kuşbakışı labirent çiziliyor, üstüne "PLAN" damgası.
const HookScene: React.FC = () => {
	const draw = useRamp(CUES.mazeDraw[0], CUES.mazeDraw[1]);
	const stamp = usePop(CUES.planStamp, 9);
	return (
		<AbsoluteFill>
			<Abs x={540} y={600}>
				<Maze draw={draw} />
			</Abs>
			<Abs x={800} y={560} style={{transform: `translate(-50%,0) rotate(-14deg) scale(${interpolate(stamp, [0, 1], [2.2, 1])})`, opacity: stamp}}>
				<div style={{border: `10px solid ${C.red}`, color: C.red, fontFamily: FONT, fontWeight: 900, fontSize: 96, padding: '4px 28px', borderRadius: 16, background: 'rgba(255,253,248,0.85)', letterSpacing: 6}}>
					PLAN
				</div>
			</Abs>
		</AbsoluteFill>
	);
};

const Chevron: React.FC<{opacity: number}> = ({opacity}) => (
	<svg width="90" height="60" viewBox="0 0 90 60" style={{opacity}}>
		<path d="M10 6 L50 30 L10 54 H40 L80 30 L40 6 Z" fill={YELLOW} stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
	</svg>
);

// 2) Tek yönlü yol: yerde oklar, müşteri ilerliyor; kısa yol kapısı bitkinin arkasında.
const PathScene: React.FC = () => {
	const frame = useAbsFrame();
	const walk = useRamp(SCENES.path[0] + 0.3, SCENES.path[1]);
	const door = usePop(CUES.shortcut);
	const hide = useRamp(CUES.shortcut + 0.9, CUES.shortcut + 1.4);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 100, right: 100, top: 540, height: 300, background: BLUE, border: `8px solid ${C.ink}`, borderRadius: 12}}>
				<div style={{position: 'absolute', left: '50%', top: 70, transform: 'translateX(-50%)', background: YELLOW, border: `6px solid ${C.ink}`, borderRadius: 60, padding: '10px 60px', fontFamily: FONT, fontWeight: 900, fontSize: 92, color: BLUE, letterSpacing: 4}}>
					IKEA
				</div>
			</div>
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<div key={i} style={{position: 'absolute', left: 90 + i * 130, top: GROUND_Y - 80}}>
					<Chevron opacity={interpolate(frame, [sec(CUES.arrows + i * 0.15), sec(CUES.arrows + i * 0.15) + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
				</div>
			))}
			<div style={{position: 'absolute', left: 820, top: GROUND_Y - 330, width: 170, height: 330, background: C.card, border: `7px solid ${C.ink}`, borderBottom: 'none', opacity: door, transform: `scale(${door})`, transformOrigin: 'bottom'}}>
				<div style={{position: 'absolute', top: -70, left: -20, right: -20, background: C.green, color: C.card, fontFamily: FONT, fontWeight: 900, fontSize: 30, textAlign: 'center', padding: '8px 0', borderRadius: 10}}>
					KISA YOL →
				</div>
			</div>
			<svg width="260" height="360" viewBox="0 0 260 360" style={{position: 'absolute', left: 780, top: GROUND_Y - 360, transform: `scaleY(${hide})`, transformOrigin: 'bottom'}}>
				<path d="M95 360 L80 270 H180 L165 360 Z" fill={C.orange} stroke={C.ink} strokeWidth="6" />
				{[[-40, 0], [0, -30], [40, 5], [-20, 40], [25, 45]].map(([dx, dy], i) => (
					<ellipse key={i} cx={130 + dx * 1.8} cy={150 + dy * 2} rx={70} ry={42} transform={`rotate(${dx} ${130 + dx * 1.8} ${150 + dy * 2})`} fill={i % 2 ? C.mint : C.green} stroke={C.ink} strokeWidth="5" />
				))}
			</svg>
			<div style={{position: 'absolute', left: interpolate(walk, [0, 1], [40, 640]), top: GROUND_Y - 150}}>
				<Person bob={Math.abs(Math.sin(frame / 4)) * -8} />
			</div>
		</AbsoluteFill>
	);
};

// 3) Hazır odalar ve hayal balonu.
const ShowroomScene: React.FC = () => {
	const room = usePop(CUES.rooms);
	const dream = usePop(CUES.dream);
	return (
		<AbsoluteFill>
			<Spotlight x={430} width={720} opacity={room} />
			<div style={{position: 'absolute', left: 90, top: 640, width: 680, height: GROUND_Y - 640, background: '#F6E7CF', border: `8px solid ${C.ink}`, borderBottom: 'none', transform: `scaleY(${room})`, transformOrigin: 'bottom'}}>
				<div style={{position: 'absolute', left: 60, top: 70, width: 150, height: 110, background: C.card, border: `6px solid ${C.ink}`}}>
					<div style={{position: 'absolute', inset: 14, background: C.mint, clipPath: 'polygon(0 100%, 40% 30%, 65% 70%, 80% 50%, 100% 100%)'}} />
				</div>
				<div style={{position: 'absolute', left: 260, bottom: 0, width: 330, height: 150}}>
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 30, height: 90, background: C.orange, border: `6px solid ${C.ink}`, borderRadius: 26}} />
					<div style={{position: 'absolute', left: 20, right: 20, bottom: 90, height: 70, background: '#F39A5B', border: `6px solid ${C.ink}`, borderRadius: 22}} />
					<div style={{position: 'absolute', left: 30, width: 14, bottom: 0, height: 34, background: C.ink}} />
					<div style={{position: 'absolute', right: 30, width: 14, bottom: 0, height: 34, background: C.ink}} />
				</div>
				<div style={{position: 'absolute', left: 90, bottom: 0, width: 10, height: 300, background: C.ink}} />
				<div style={{position: 'absolute', left: 40, bottom: 290, width: 110, height: 70, background: YELLOW, border: `6px solid ${C.ink}`, clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)'}} />
			</div>
			<div style={{position: 'absolute', left: 860, top: GROUND_Y - 150}}>
				<Person color={C.green} />
			</div>
			<Abs x={830} y={720} style={{transform: `translate(-50%,0) scale(${dream})`, transformOrigin: 'bottom right'}}>
				<div style={{background: C.card, border: `6px solid ${C.ink}`, borderRadius: 80, width: 230, height: 170, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<svg width="120" height="110" viewBox="0 0 120 110">
						<path d="M10 55 L60 10 L110 55 V105 H10 Z" fill={C.mint} stroke={C.ink} strokeWidth="6" strokeLinejoin="round" />
						<path d="M60 92 C30 72 40 50 60 64 C80 50 90 72 60 92 Z" fill={C.red} />
					</svg>
				</div>
				<div style={{position: 'absolute', right: 20, bottom: -50, width: 34, height: 34, borderRadius: 17, background: C.card, border: `5px solid ${C.ink}`}} />
				<div style={{position: 'absolute', right: 0, bottom: -90, width: 20, height: 20, borderRadius: 10, background: C.card, border: `4px solid ${C.ink}`}} />
			</Abs>
		</AbsoluteFill>
	);
};

const BigBag: React.FC<{fill?: number}> = ({fill = 0}) => (
	<svg width="460" height="420" viewBox="0 0 460 420" style={{overflow: 'visible'}}>
		<path d="M110 120 Q110 10 230 10 Q350 10 350 120" stroke={YELLOW} strokeWidth="26" fill="none" />
		<path d="M110 120 Q110 10 230 10 Q350 10 350 120" stroke={C.ink} strokeWidth="6" fill="none" />
		<path d="M30 120 H430 L400 410 H60 Z" fill={BLUE} stroke={C.ink} strokeWidth="8" strokeLinejoin="round" />
		<rect x={150} y={230} width={160} height={70} rx={12} fill={YELLOW} stroke={C.ink} strokeWidth="5" />
		<path d={`M40 ${125 + (1 - fill) * 270} H420`} stroke="rgba(255,255,255,0.35)" strokeWidth="8" strokeDasharray="18 14" />
	</svg>
);

// 4) Kocaman sarı çanta: boş ve doldurulmayı bekliyor.
const BagScene: React.FC = () => {
	const frame = useAbsFrame();
	const drop = usePop(CUES.bagDrop, 10);
	const empty = useRamp(CUES.bagEmpty, CUES.bagEmpty + 0.4);
	const breathe = 1 + Math.sin(frame / 6) * 0.025 * empty;
	return (
		<AbsoluteFill>
			<Spotlight x={540} width={640} opacity={drop} />
			<Abs x={540} y={GROUND_Y - 430} style={{transform: `translate(-50%, ${(1 - drop) * -900}px) scale(${breathe})`, transformOrigin: 'bottom'}}>
				<BigBag />
			</Abs>
			<Abs x={540} y={GROUND_Y - 640} style={{opacity: empty, transform: `translate(-50%,0) scale(${0.7 + empty * 0.3})`}}>
				<div style={{fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.card, background: C.red, borderRadius: 50, padding: '10px 40px', border: `6px solid ${C.ink}`}}>BOŞ</div>
			</Abs>
		</AbsoluteFill>
	);
};

const Candle = () => (
	<svg width="90" height="150" viewBox="0 0 90 150">
		<path d="M45 10 C60 30 55 45 45 50 C35 45 30 30 45 10 Z" fill={C.orange} stroke={C.ink} strokeWidth="4" />
		<rect x={20} y={55} width={50} height={90} rx={8} fill={C.card} stroke={C.ink} strokeWidth="6" />
	</svg>
);
const Frame = () => (
	<svg width="130" height="150" viewBox="0 0 130 150">
		<rect x={6} y={6} width={118} height={138} rx={6} fill={C.orange} stroke={C.ink} strokeWidth="6" />
		<rect x={26} y={26} width={78} height={98} fill={C.card} stroke={C.ink} strokeWidth="4" />
		<circle cx={65} cy={65} r={14} fill={C.mint} />
	</svg>
);
const Napkins = () => (
	<svg width="140" height="110" viewBox="0 0 140 110">
		{[0, 1, 2, 3].map((i) => (
			<rect key={i} x={8} y={70 - i * 20} width={124} height={34} rx={6} fill={i % 2 ? '#F28C8C' : C.card} stroke={C.ink} strokeWidth="5" />
		))}
	</svg>
);

const SmallTag: React.FC<{text: string; s: number}> = ({text, s}) => (
	<div style={{transform: `scale(${s}) rotate(-6deg)`, background: YELLOW, border: `5px solid ${C.ink}`, borderRadius: 12, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: '6px 18px', color: C.ink, whiteSpace: 'nowrap'}}>
		{text}
	</div>
);

// 5) Küçük ucuz ürünler tek tek çantaya düşer.
const ItemsScene: React.FC = () => {
	const pops = CUES.items.map((t) => usePop(t, 11));
	const tags = usePop(CUES.cheapTags);
	const items = [
		{x: 260, el: <Candle />, tag: '29 ₺'},
		{x: 540, el: <Frame />, tag: '49 ₺'},
		{x: 820, el: <Napkins />, tag: '19 ₺'},
	];
	const fill = pops.reduce((a, b) => a + b, 0) / 3;
	return (
		<AbsoluteFill>
			{items.map((it, i) => (
				<div key={i}>
					<Abs x={it.x} y={560} style={{transform: `translate(-50%, ${interpolate(pops[i], [0, 1], [-700, 0])}px)`}}>
						{it.el}
					</Abs>
					<Abs x={it.x} y={760}>
						<SmallTag text={it.tag} s={tags} />
					</Abs>
				</div>
			))}
			<Abs x={540} y={GROUND_Y - 430}>
				<BigBag fill={fill} />
			</Abs>
		</AbsoluteFill>
	);
};

// 6) Araştırma: listede olmayanlar.
const ResearchScene: React.FC = () => {
	const paper = usePop(CUES.listPaper);
	const cross = useRamp(CUES.listCross, CUES.listCross + 0.5);
	const stat = usePop(CUES.listCross + 0.2, 9);
	const rows = ['Kitaplık', 'Lamba', 'Mum', 'Çerçeve', 'Peçete', 'Yastık'];
	return (
		<AbsoluteFill>
			<Abs x={330} y={560} style={{transform: `translate(-50%,0) rotate(-4deg) scale(${paper})`}}>
				<div style={{width: 420, background: C.card, border: `7px solid ${C.ink}`, borderRadius: 14, padding: '26px 34px', fontFamily: FONT, boxShadow: `0 14px 0 ${C.shadow}`}}>
					<div style={{fontSize: 34, fontWeight: 900, color: C.mint, letterSpacing: 4, marginBottom: 10}}>ALDIKLARIN</div>
					{rows.map((r, i) => {
						const planned = i < 2;
						return (
							<div key={r} style={{fontSize: 46, fontWeight: 800, color: C.ink, display: 'flex', alignItems: 'center', gap: 16, lineHeight: 1.45}}>
								<span style={{color: planned ? C.green : C.red, width: 40, opacity: planned ? 1 : cross}}>{planned ? '✓' : '✗'}</span>
								<span style={{position: 'relative'}}>
									{r}
									{!planned && <span style={{position: 'absolute', left: 0, top: '52%', height: 6, width: `${cross * 100}%`, background: C.red}} />}
								</span>
							</div>
						);
					})}
				</div>
			</Abs>
			<Abs x={790} y={700} style={{transform: `translate(-50%,0) scale(${stat})`}}>
				<div style={{textAlign: 'center', fontFamily: FONT}}>
					<div style={{fontSize: 170, fontWeight: 900, color: C.red, letterSpacing: -8, lineHeight: 1}}>%50+</div>
					<div style={{fontSize: 40, fontWeight: 800, color: C.ink}}>listede yoktu</div>
				</div>
			</Abs>
			<Abs x={540} y={GROUND_Y + 40}>
				<div style={{fontFamily: FONT, fontSize: 24, fontWeight: 600, color: C.grey, whiteSpace: 'nowrap'}}>Kaynak: Alan Penn, UCL Bartlett · mağaza düzeni araştırması</div>
			</Abs>
		</AbsoluteFill>
	);
};

const ThoughtBubble: React.FC<{s: number; children: React.ReactNode}> = ({s, children}) => (
	<div style={{transform: `scale(${s})`, transformOrigin: 'bottom left', position: 'relative'}}>
		<div style={{background: C.card, border: `6px solid ${C.ink}`, borderRadius: 70, padding: '28px 44px', fontFamily: FONT, fontWeight: 900, fontSize: 56, color: C.ink, whiteSpace: 'nowrap'}}>
			{children}
		</div>
		<div style={{position: 'absolute', left: 30, bottom: -46, width: 32, height: 32, borderRadius: 16, background: C.card, border: `5px solid ${C.ink}`}} />
		<div style={{position: 'absolute', left: 10, bottom: -84, width: 18, height: 18, borderRadius: 9, background: C.card, border: `4px solid ${C.ink}`}} />
	</div>
);

// 7) Çıkışta ucuz sosisli ve "Ne ucuz yer!" anısı.
const ExitScene: React.FC = () => {
	const stand = usePop(CUES.hotdog);
	const bubble = usePop(CUES.brainBubble);
	const cheap = usePop(CUES.cheapThought, 9);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 80, top: GROUND_Y - 380, width: 220, height: 380, background: C.card, border: `8px solid ${C.ink}`, borderBottom: 'none'}}>
				<div style={{position: 'absolute', top: -80, left: -10, right: -10, background: C.green, color: C.card, fontFamily: FONT, fontWeight: 900, fontSize: 40, textAlign: 'center', padding: '8px 0', borderRadius: 10}}>ÇIKIŞ</div>
			</div>
			<div style={{position: 'absolute', left: 480, top: GROUND_Y - 300, transform: `scale(${stand})`, transformOrigin: 'bottom'}}>
				<div style={{width: 420, height: 200, marginTop: 100, background: YELLOW, border: `8px solid ${C.ink}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<svg width="230" height="110" viewBox="0 0 230 110">
						<rect x={10} y={30} width={210} height={60} rx={30} fill="#E8B26A" stroke={C.ink} strokeWidth="6" />
						<rect x={0} y={44} width={230} height={32} rx={16} fill={C.red} stroke={C.ink} strokeWidth="6" />
						<path d="M30 58 Q50 46 70 58 T110 58 T150 58 T190 58" stroke={YELLOW} strokeWidth="6" fill="none" />
					</svg>
				</div>
				<div style={{position: 'absolute', top: 0, right: -30}}>
					<SmallTag text="ucuz!" s={1} />
				</div>
			</div>
			<div style={{position: 'absolute', left: 340, top: GROUND_Y - 150}}>
				<Person color={C.mint} />
			</div>
			<div style={{position: 'absolute', left: 380, top: 560}}>
				<ThoughtBubble s={bubble}>{cheap > 0.3 ? '“Ne ucuz yer!”' : '…'}</ThoughtBubble>
			</div>
		</AbsoluteFill>
	);
};

// 8) Gruen etkisi: kaybolan müşterinin fişi uzar.
const GruenScene: React.FC = () => {
	const pill = usePop(CUES.gruenPill);
	const grow = useRamp(CUES.receipt, CUES.receipt + 1.8);
	const frame = useAbsFrame();
	const lines = 9;
	return (
		<AbsoluteFill>
			<Abs x={540} y={520} style={{transform: `translate(-50%,0) scale(${pill})`}}>
				<div style={{background: C.orange, color: C.card, fontFamily: FONT, fontWeight: 900, fontSize: 60, padding: '16px 44px', borderRadius: 60, border: `6px solid ${C.ink}`, whiteSpace: 'nowrap'}}>
					GRUEN ETKİSİ
				</div>
			</Abs>
			<div style={{position: 'absolute', left: 140, top: GROUND_Y - 150}}>
				<Person color={C.mint} bob={Math.sin(frame / 5) * 4} />
			</div>
			<Abs x={175} y={GROUND_Y - 260} style={{transform: `translate(-50%,0) rotate(${frame * 6}deg)`}}>
				<svg width="90" height="90" viewBox="0 0 90 90">
					<path d="M45 45 m0 -6 a6 6 0 1 1 -6 6 a12 12 0 1 1 12 12 a18 18 0 1 1 -18 -18 a24 24 0 1 1 24 24" fill="none" stroke={C.red} strokeWidth="6" strokeLinecap="round" />
				</svg>
			</Abs>
			<div style={{position: 'absolute', left: 520, top: 680, width: 380, height: 40 + grow * 520, overflow: 'hidden', background: C.card, border: `7px solid ${C.ink}`, borderRadius: '6px 6px 0 0', fontFamily: FONT}}>
				{Array.from({length: lines}).map((_, i) => (
					<div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '8px 26px', fontSize: 32, fontWeight: 800, color: i === lines - 1 ? C.red : C.ink, borderTop: i === lines - 1 ? `5px dashed ${C.ink}` : 'none'}}>
						<span>{i === lines - 1 ? 'TOPLAM' : '▬▬▬'}</span>
						<span>{i === lines - 1 ? '₺₺₺₺' : `${[29, 49, 19, 89, 15, 39, 59, 25][i]} ₺`}</span>
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

// 9) Kapanış: liste yazılır, labirentin içinden düz kısa yol çizilir.
const CloseScene: React.FC = () => {
	const list = usePop(CUES.listWrite);
	const straight = useRamp(CUES.shortLine, CUES.shortLine + 0.7);
	return (
		<AbsoluteFill>
			<Abs x={540} y={620}>
				<Maze draw={1} fade={1} straight={straight} />
			</Abs>
			<Abs x={250} y={500} style={{transform: `translate(-50%,0) rotate(-8deg) scale(${list})`}}>
				<div style={{width: 260, background: C.card, border: `6px solid ${C.ink}`, borderRadius: 12, padding: '18px 24px', fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink, boxShadow: `0 10px 0 ${C.shadow}`}}>
					<div style={{color: C.mint, fontSize: 26, letterSpacing: 3}}>LİSTEM</div>
					<div>✓ Kitaplık</div>
					<div>✓ Lamba</div>
				</div>
			</Abs>
		</AbsoluteFill>
	);
};

const HITS: Hit[] = [
	...panHits(Object.values(SCENES).slice(1).map((r) => r[0])),
	[CUES.mazeDraw[0], 'rise', 0.3],
	[CUES.planStamp, 'thud', 0.6],
	...[0, 1, 2, 3, 4, 5].map((i): Hit => [CUES.arrows + i * 0.15, 'tick', 0.3]),
	[CUES.shortcut, 'pop', 0.45],
	[CUES.shortcut + 0.9, 'whoosh', 0.25],
	[CUES.rooms, 'pop', 0.45],
	[CUES.dream, 'ding', 0.3],
	[CUES.bagDrop + 0.15, 'thud', 0.55],
	[CUES.bagEmpty, 'pop', 0.4],
	...CUES.items.map((t): Hit => [t + 0.2, 'pop', 0.45]),
	[CUES.cheapTags, 'coin', 0.3],
	[CUES.listPaper, 'pop', 0.4],
	[CUES.listCross, 'tick', 0.4],
	[CUES.listCross + 0.2, 'thud', 0.45],
	[CUES.hotdog, 'pop', 0.45],
	[CUES.brainBubble, 'pop', 0.35],
	[CUES.cheapThought, 'ding', 0.35],
	[CUES.gruenPill, 'pop', 0.5],
	[CUES.receipt, 'rise', 0.4],
	[CUES.receipt + 1.8, 'coin', 0.4],
	[CUES.listWrite, 'pop', 0.4],
	[CUES.shortLine, 'rise', 0.45],
	[CUES.end, 'logo', 0.5],
];

export const Ikea: React.FC<{vo?: string}> = ({vo}) => (
	<Stage>
		<Scene range={SCENES.hook} first>
			<HookScene />
		</Scene>
		<Scene range={SCENES.path}>
			<PathScene />
		</Scene>
		<Scene range={SCENES.showroom}>
			<ShowroomScene />
		</Scene>
		<Scene range={SCENES.bag}>
			<BagScene />
		</Scene>
		<Scene range={SCENES.items}>
			<ItemsScene />
		</Scene>
		<Scene range={SCENES.research}>
			<ResearchScene />
		</Scene>
		<Scene range={SCENES.exit}>
			<ExitScene />
		</Scene>
		<Scene range={SCENES.gruen}>
			<GruenScene />
		</Scene>
		<Scene range={SCENES.close}>
			<CloseScene />
		</Scene>
		<Captions beats={BEATS} />
		<EndSequence at={CUES.end} />
		{vo ? <Soundtrack vo={vo} hits={HITS} endAt={CUES.end} /> : null}
	</Stage>
);
