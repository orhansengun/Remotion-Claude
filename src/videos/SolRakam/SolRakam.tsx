import {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions} from '../../components/Caption';
import {Crown, Dress, Person, PriceTag} from '../../components/Props';
import {Spotlight, Stage} from '../../components/Stage';
import {C, FONT, GROUND_Y, sec, WIDTH} from '../../theme';
import {BEATS, SCENES, TOTAL_SECONDS} from './script';

export const SOL_RAKAM_FRAMES = sec(TOTAL_SECONDS);
const PAN = 14;

// Sahne içindeki zamanlar mutlak saniyedir; Sequence'in yerel karesine bu ofset eklenir.
const OffsetCtx = createContext(0);
const useAbsFrame = () => useCurrentFrame() + useContext(OffsetCtx);

const usePop = (atSec: number, damping = 12) => {
	const frame = useAbsFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - sec(atSec), fps, config: {damping}});
};

const useRamp = (fromSec: number, toSec: number) => {
	const frame = useAbsFrame();
	return interpolate(frame, [sec(fromSec), sec(toSec)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});
};

const Abs: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	x,
	y,
	children,
	style,
}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, 0)', ...style}}>{children}</div>
);

// Sahneler yan yana duran bir dünyada kamera kaydırılıyormuş gibi girip çıkar.
const Pan: React.FC<{enter: boolean; exitAt: number; children: React.ReactNode}> = ({enter, exitAt, children}) => {
	const frame = useCurrentFrame();
	const ease = Easing.inOut(Easing.cubic);
	const x = enter ? interpolate(frame, [0, PAN], [WIDTH, 0], {extrapolateRight: 'clamp', easing: ease}) : 0;
	const out = interpolate(frame, [exitAt, exitAt + PAN], [0, -WIDTH], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: ease,
	});
	return <AbsoluteFill style={{transform: `translateX(${x + out}px)`}}>{children}</AbsoluteFill>;
};

const Scene: React.FC<{range: readonly [number, number]; children: React.ReactNode; first?: boolean}> = ({
	range,
	children,
	first,
}) => {
	const from = first ? 0 : sec(range[0]) - PAN;
	const exitAt = sec(range[1]) - from;
	return (
		<Sequence from={from} durationInFrames={exitAt + PAN}>
			<OffsetCtx.Provider value={from}>
				<Pan enter={!first} exitAt={exitAt}>
					{children}
				</Pan>
			</OffsetCtx.Provider>
		</Sequence>
	);
};

// 1) Kanca: terazi. Gerçek fark 1 kuruş, beyindeki fark 1 lira.
const HookScene: React.FC = () => {
	const t0 = SCENES.hook[0];
	const tilt = interpolate(usePop(t0 + 0.3, 14), [0, 1], [0, -2.5]) + interpolate(usePop(t0 + 4.4, 9), [0, 1], [0, -15]);
	const reveal = usePop(4.4);
	const pivot = {x: 540, y: 690};
	const L = 300;
	const rad = (tilt * Math.PI) / 180;
	const left = {x: pivot.x - L * Math.cos(rad), y: pivot.y - L * Math.sin(rad)};
	const right = {x: pivot.x + L * Math.cos(rad), y: pivot.y + L * Math.sin(rad)};
	const pan = (p: {x: number; y: number}, price: string, hi: number) => (
		<>
			<svg style={{position: 'absolute', left: 0, top: 0}} width={WIDTH} height={GROUND_Y}>
				<path d={`M${p.x} ${p.y} L${p.x - 110} ${p.y + 170} M${p.x} ${p.y} L${p.x + 110} ${p.y + 170}`} stroke={C.ink} strokeWidth={5} />
				<path d={`M${p.x - 140} ${p.y + 170} H${p.x + 140} Q${p.x + 120} ${p.y + 215} ${p.x} ${p.y + 215} Q${p.x - 120} ${p.y + 215} ${p.x - 140} ${p.y + 170} Z`} fill={C.mint} stroke={C.ink} strokeWidth={6} />
			</svg>
			<Abs x={p.x} y={p.y + 30}>
				<PriceTag price={price} width={250} fontSize={64} highlightFirst={hi} />
			</Abs>
		</>
	);
	return (
		<AbsoluteFill>
			<Spotlight x={540} width={700} opacity={0.6} />
			<svg style={{position: 'absolute', left: 0, top: 0}} width={WIDTH} height={GROUND_Y + 10}>
				<path d={`M${pivot.x} ${pivot.y} L${pivot.x - 70} ${GROUND_Y} H${pivot.x + 70} Z`} fill={C.ink} />
				<line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke={C.ink} strokeWidth={16} strokeLinecap="round" />
				<circle cx={pivot.x} cy={pivot.y} r={20} fill={C.orange} stroke={C.ink} strokeWidth={6} />
			</svg>
			{pan(left, '9,99 ₺', reveal)}
			{pan(right, '10,00 ₺', 0)}
			<Abs x={540} y={1360}>
				<div style={{fontFamily: FONT, fontSize: 44, fontWeight: 800, color: reveal > 0.5 ? C.red : C.grey, whiteSpace: 'nowrap'}}>
					{reveal > 0.5 ? 'beyindeki fark: 1 ₺' : 'gerçek fark: 0,01 ₺'}
				</div>
			</Abs>
		</AbsoluteFill>
	);
};

// 2) Beyin soldan okur: ilk rakam büyür, kalanı bulanıklaşır.
const BrainScene: React.FC = () => {
	const s = SCENES.brain[0];
	const sweep = useRamp(s + 0.4, s + 2.0);
	const focus = useRamp(s + 2.3, s + 3.0);
	const pill = usePop(s + 4.7);
	return (
		<AbsoluteFill>
			<Spotlight x={300} width={520} opacity={focus} />
			<Abs x={540} y={640}>
				<PriceTag price="9,99 ₺" width={760} fontSize={210} highlightFirst={focus} dimRest={focus} />
			</Abs>
			<svg style={{position: 'absolute', left: 0, top: 0}} width={WIDTH} height={GROUND_Y}>
				<g transform={`translate(${interpolate(sweep, [0, 1], [120, 330])}, 800)`} opacity={1 - focus}>
					<circle r={90} fill="rgba(255,255,255,0.35)" stroke={C.ink} strokeWidth={10} />
					<line x1={64} y1={64} x2={140} y2={140} stroke={C.ink} strokeWidth={18} strokeLinecap="round" />
				</g>
			</svg>
			<Abs x={540} y={1080} style={{transform: `translate(-50%,0) scale(${pill})`}}>
				<div style={{background: C.orange, color: C.card, fontFamily: FONT, fontWeight: 900, fontSize: 52, padding: '18px 40px', borderRadius: 60, border: `6px solid ${C.ink}`, whiteSpace: 'nowrap'}}>
					← SOL RAKAM ETKİSİ
				</div>
			</Abs>
			<div style={{position: 'absolute', left: 90, top: GROUND_Y - 150}}>
				<Person />
			</div>
		</AbsoluteFill>
	);
};

// 3) Katalog deneyi: $39, $34'ten daha çok satıyor.
const CatalogScene: React.FC = () => {
	const s = SCENES.catalog[0];
	const items = [
		{x: 230, price: '$34', h: 0.6, at: 6.7, dress: C.mint},
		{x: 540, price: '$39', h: 1, at: 9.0, dress: C.orange},
		{x: 850, price: '$44', h: 0.42, at: 6.9, dress: C.red},
	];
	const crown = usePop(s + 9.6);
	const win = useRamp(s + 9.0, s + 9.6);
	return (
		<AbsoluteFill>
			<Spotlight x={540} width={460} opacity={win} />
			<svg style={{position: 'absolute', left: 0, top: 0}} width={WIDTH} height={600}>
				<line x1={80} y1={500} x2={1000} y2={500} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
			</svg>
			{items.map((it, i) => (
				<Item key={it.price} {...it} i={i} s={s} />
			))}
			<Abs x={540} y={GROUND_Y - 330 - 70} style={{transform: `translate(-50%,0) scale(${crown})`}}>
				<Crown />
			</Abs>
			<Abs x={540} y={GROUND_Y + 40}>
				<div style={{fontFamily: FONT, fontSize: 24, fontWeight: 600, color: C.grey, whiteSpace: 'nowrap'}}>
					Kaynak: Anderson &amp; Simester, Harvard Business Review, 2003 · satışlar temsilîdir
				</div>
			</Abs>
		</AbsoluteFill>
	);
};

const Item: React.FC<{x: number; price: string; h: number; at: number; dress: string; i: number; s: number}> = ({
	x,
	price,
	h,
	at,
	dress,
	i,
	s,
}) => {
	const dressIn = usePop(s + 0.3 + i * 0.25);
	const tag = usePop(s + 3.7 + i * 0.7);
	const grow = useRamp(s + at, s + at + 0.9);
	const barH = 330 * h * grow;
	return (
		<>
			<Abs x={x} y={480} style={{transform: `translate(-50%, ${interpolate(dressIn, [0, 1], [-300, 0])}px)`}}>
				<Dress color={dress} />
			</Abs>
			<Abs x={x} y={770} style={{transform: `translate(-50%,0) scale(${tag})`}}>
				<PriceTag price={price} width={190} fontSize={56} highlightFirst={0} />
			</Abs>
			<div
				style={{
					position: 'absolute',
					left: x - 70,
					top: GROUND_Y - barH,
					width: 140,
					height: barH,
					background: price === '$39' ? C.orange : C.ink,
					borderRadius: '10px 10px 0 0',
				}}
			/>
		</>
	);
};

const Bag: React.FC = () => (
	<svg width="230" height="260" viewBox="0 0 230 260">
		<path d="M75 70 Q75 20 115 20 Q155 20 155 70" stroke={C.ink} strokeWidth="10" fill="none" />
		<path d="M30 70 H200 L185 250 H45 Z" fill={C.card} stroke={C.ink} strokeWidth="7" strokeLinejoin="round" />
		<circle cx="90" cy="60" r="26" fill={C.red} stroke={C.ink} strokeWidth="5" />
		<rect x="125" y="30" width="40" height="60" rx="8" fill={C.mint} stroke={C.ink} strokeWidth="5" />
	</svg>
);

const Phone: React.FC = () => (
	<svg width="170" height="290" viewBox="0 0 170 290">
		<rect x="8" y="8" width="154" height="274" rx="28" fill={C.ink} />
		<rect x="22" y="34" width="126" height="222" rx="12" fill="#3E6E8E" />
		<rect x="62" y="16" width="46" height="9" rx="4" fill="#0E2219" />
	</svg>
);

// 4) Market ve telefon: aynı oyun.
const MarketScene: React.FC = () => {
	const s = SCENES.market[0];
	const a = usePop(s + 0.2);
	const b = usePop(s + 1.8);
	const hi = useRamp(s + 4.4, s + 4.9);
	const crowd = usePop(s + 4.4);
	const frame = useAbsFrame();
	return (
		<AbsoluteFill>
			<Abs x={290} y={560} style={{transform: `translate(-50%,0) scale(${a})`}}>
				<Bag />
			</Abs>
			<Abs x={290} y={860} style={{transform: `translate(-50%,0) scale(${a})`}}>
				<PriceTag price="49,90 ₺" width={300} fontSize={66} highlightFirst={hi} />
			</Abs>
			<Abs x={790} y={540} style={{transform: `translate(-50%,0) scale(${b})`}}>
				<Phone />
			</Abs>
			<Abs x={790} y={860} style={{transform: `translate(-50%,0) scale(${b})`}}>
				<PriceTag price="59.999 ₺" width={340} fontSize={66} highlightFirst={hi} />
			</Abs>
			{[160, 330, 500, 680, 860].map((x, i) => (
				<div key={x} style={{position: 'absolute', left: x - 35, top: GROUND_Y - 150, opacity: crowd}}>
					<Person
						color={i % 2 ? C.mint : C.green}
						bob={interpolate(crowd, [0, 1], [150, 0]) + Math.sin((frame + i * 7) / 5) * 4 * crowd}
					/>
				</div>
			))}
		</AbsoluteFill>
	);
};

// 5) Lüks markalar yuvarlak fiyat kullanır.
const LuxuryScene: React.FC = () => {
	const s = SCENES.luxury[0];
	const shift = useRamp(s + 2.3, s + 2.9);
	const value = usePop(s + 4.2, 10);
	return (
		<AbsoluteFill>
			<Spotlight x={780} width={520} opacity={shift} />
			<div style={{opacity: 1 - shift * 0.6}}>
				<Abs x={280} y={740}>
					<PriceTag price="9.999 ₺" label="İNDİRİM" width={330} fontSize={66} textColor={C.red} />
				</Abs>
				<Abs x={420} y={690} style={{transform: 'translate(-50%,0) rotate(12deg)'}}>
					<div style={{width: 96, height: 96, borderRadius: 48, background: C.red, color: C.card, fontFamily: FONT, fontWeight: 900, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `5px solid ${C.ink}`}}>
						%30
					</div>
				</Abs>
			</div>
			<Abs x={780} y={GROUND_Y - 300}>
				<div style={{width: 300, height: 300, background: C.card, border: `6px solid ${C.ink}`, borderBottom: 'none'}} />
			</Abs>
			<Abs x={780} y={770 - value * 20} style={{transform: `translate(-50%,0) scale(${1 + value * 0.08})`}}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<Crown size={80} />
					<div style={{height: 18}} />
					<PriceTag price="10.000 ₺" label="DEĞER" width={350} fontSize={66} color={C.ink} textColor={C.card} />
				</div>
			</Abs>
		</AbsoluteFill>
	);
};

// 6) Kapanış: 9,99 yukarı yuvarlanıp 10,00 olur.
const RoundScene: React.FC = () => {
	const s = SCENES.round[0];
	const roll = useRamp(s + 2.1, s + 2.7);
	const arrow = usePop(s + 2.1);
	return (
		<AbsoluteFill>
			<Spotlight x={540} width={700} opacity={0.5 + roll * 0.5} />
			<Abs x={540} y={720}>
				<div style={{width: 760, height: 270, overflow: 'hidden', background: C.card, border: `6px solid ${C.ink}`, borderRadius: 22, boxShadow: `0 12px 0 ${C.shadow}`, position: 'relative', fontFamily: FONT, fontWeight: 900, fontSize: 200, letterSpacing: -6}}>
					{['9,99 ₺', '10,00 ₺'].map((p, i) => (
						<div key={p} style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: i ? C.red : C.ink, transform: `translateY(${(i - roll) * 270}px)`}}>
							{p}
						</div>
					))}
				</div>
			</Abs>
			<Abs x={540} y={1050} style={{transform: `translate(-50%,0) scale(${arrow})`}}>
				<svg width="140" height="170" viewBox="0 0 140 170">
					<path d="M70 165 V30 M15 80 L70 20 L125 80" stroke={C.red} strokeWidth="22" fill="none" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</Abs>
		</AbsoluteFill>
	);
};

const EndCard: React.FC = () => {
	const s = SCENES.end[0];
	const bg = useRamp(s, s + 0.4);
	const logo = usePop(s + 0.3);
	const cta = usePop(s + 0.9);
	return (
		<AbsoluteFill style={{background: C.ink, clipPath: `circle(${bg * 150}% at 50% 50%)`, alignItems: 'center', justifyContent: 'center', fontFamily: FONT}}>
			<div style={{transform: `scale(${logo})`, textAlign: 'center'}}>
				<div style={{color: C.orange, fontSize: 40, fontWeight: 800, letterSpacing: 10}}>HER GÜN BİR FİKİR</div>
				<div style={{color: C.card, fontSize: 130, fontWeight: 900, letterSpacing: -4, lineHeight: 1}}>ÖRGÜN</div>
				<div style={{color: C.card, fontSize: 130, fontWeight: 900, letterSpacing: -4, lineHeight: 1}}>EĞİTİM</div>
			</div>
			<div style={{marginTop: 70, transform: `scale(${cta})`, background: C.orange, color: C.card, fontSize: 52, fontWeight: 900, padding: '20px 56px', borderRadius: 60}}>
				Takip et →
			</div>
		</AbsoluteFill>
	);
};

export const SolRakam: React.FC = () => (
	<Stage>
		<Scene range={SCENES.hook} first>
			<HookScene />
		</Scene>
		<Scene range={SCENES.brain}>
			<BrainScene />
		</Scene>
		<Scene range={SCENES.catalog}>
			<CatalogScene />
		</Scene>
		<Scene range={SCENES.market}>
			<MarketScene />
		</Scene>
		<Scene range={SCENES.luxury}>
			<LuxuryScene />
		</Scene>
		<Scene range={SCENES.round}>
			<RoundScene />
		</Scene>
		<Captions beats={BEATS} />
		<Sequence from={sec(SCENES.end[0])}>
			<OffsetCtx.Provider value={sec(SCENES.end[0])}>
				<EndCard />
			</OffsetCtx.Provider>
		</Sequence>
	</Stage>
);

