import {AbsoluteFill, interpolate} from 'remotion';
import {Abs, EndSequence, Scene, useAbsFrame, usePop, useRamp} from '../../components/kit';
import {Captions} from '../../components/Caption';
import {SolRakamSoundtrack} from './Soundtrack';
import {Crown, Dress, Person, PriceTag} from '../../components/Props';
import {Spotlight, Stage} from '../../components/Stage';
import {C, FONT, GROUND_Y, sec, WIDTH} from '../../theme';
import {BEATS, CUES, SCENES, TOTAL_SECONDS} from './script';

export const SOL_RAKAM_FRAMES = sec(TOTAL_SECONDS);
// 1) Kanca: terazi. Gerçek fark 1 kuruş, beyindeki fark 1 lira.
const HookScene: React.FC = () => {
	const tilt =
		interpolate(usePop(CUES.hookSettle, 14), [0, 1], [0, -2.5]) + interpolate(usePop(CUES.hookTilt, 9), [0, 1], [0, -15]);
	const reveal = usePop(CUES.hookTilt);
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
	const sweep = useRamp(CUES.brainSweep[0], CUES.brainSweep[1]);
	const focus = useRamp(CUES.brainFocus, CUES.brainFocus + 0.6);
	const pill = usePop(CUES.brainPill);
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
	const items = [
		{x: 230, price: '$34', h: 0.6, growAt: CUES.barsSide, dress: C.mint},
		{x: 540, price: '$39', h: 1, growAt: CUES.barWin, dress: C.orange},
		{x: 850, price: '$44', h: 0.42, growAt: CUES.barsSide + 0.2, dress: C.red},
	];
	const crown = usePop(CUES.crown);
	const win = useRamp(CUES.barWin, CUES.crown);
	return (
		<AbsoluteFill>
			<Spotlight x={540} width={460} opacity={win} />
			<svg style={{position: 'absolute', left: 0, top: 0}} width={WIDTH} height={600}>
				<line x1={80} y1={500} x2={1000} y2={500} stroke={C.ink} strokeWidth={10} strokeLinecap="round" />
			</svg>
			{items.map((it, i) => (
				<Item key={it.price} {...it} i={i} />
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

const Item: React.FC<{x: number; price: string; h: number; growAt: number; dress: string; i: number}> = ({
	x,
	price,
	h,
	growAt,
	dress,
	i,
}) => {
	const dressIn = usePop(CUES.dresses + i * 0.25);
	const tag = usePop(CUES.tags[i]);
	const grow = useRamp(growAt, growAt + 0.9);
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
	const a = usePop(CUES.bag);
	const b = usePop(CUES.phone);
	const hi = useRamp(CUES.sameGame, CUES.sameGame + 0.5);
	const crowd = usePop(CUES.sameGame);
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
	const shift = useRamp(CUES.luxuryShift, CUES.luxuryShift + 0.6);
	const value = usePop(CUES.luxuryValue, 10);
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
	const roll = useRamp(CUES.roll, CUES.roll + 0.6);
	const arrow = usePop(CUES.roll);
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
		<EndSequence at={CUES.end} />
		<SolRakamSoundtrack />
	</Stage>
);

