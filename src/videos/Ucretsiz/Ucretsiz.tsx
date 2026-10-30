import {AbsoluteFill, interpolate} from 'remotion';
import {Captions} from '../../components/Caption';
import {Abs, EndSequence, Scene, useAbsFrame, usePop, useRamp} from '../../components/kit';
import {Person} from '../../components/Props';
import {Hit, panHits, Soundtrack} from '../../components/Soundtrack';
import {Spotlight, Stage} from '../../components/Stage';
import {C, FONT, GROUND_Y, PALETTES, sec} from '../../theme';
import {BEATS, CUES, SCENES, TOTAL_SECONDS} from './script';

export const UCRETSIZ_FRAMES = sec(TOTAL_SECONDS);

const card = (extra: React.CSSProperties = {}): React.CSSProperties => ({
	background: C.card,
	border: `7px solid ${C.ink}`,
	borderRadius: 22,
	boxShadow: `0 14px 0 ${C.shadow}`,
	fontFamily: FONT,
	...extra,
});

const Pill: React.FC<{bg: string; children: React.ReactNode; size?: number}> = ({bg, children, size = 56}) => (
	<div style={{background: bg, color: C.card, fontFamily: FONT, fontWeight: 900, fontSize: size, padding: '14px 40px', borderRadius: 60, border: `6px solid ${C.ink}`, whiteSpace: 'nowrap'}}>
		{children}
	</div>
);

// 30 günlük takvim; geçen günlerin üstü çizilir, son gün vurgulanabilir.
export const MonthGrid: React.FC<{crossed: number; ring?: number; size?: number}> = ({crossed, ring = 0, size = 76}) => (
	<div style={card({padding: 22, display: 'grid', gridTemplateColumns: `repeat(6, ${size}px)`, gap: 10})}>
		{Array.from({length: 30}).map((_, i) => {
			const last = i === 29;
			const done = i < crossed;
			return (
				<div key={i} style={{width: size, height: size, borderRadius: 12, border: `4px solid ${C.ink}`, background: last ? (done ? C.red : '#F6DCCB') : C.card, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: size * 0.36, color: last && done ? C.card : C.grey}}>
					{i + 1}
					{done && !last ? <div style={{position: 'absolute', inset: 10, background: `linear-gradient(45deg, transparent 44%, ${C.ink} 44%, ${C.ink} 56%, transparent 56%)`}} /> : null}
					{last && ring > 0 ? (
						<svg viewBox="0 0 100 100" style={{position: 'absolute', left: -size * 0.45, top: -size * 0.45, width: size * 1.9, height: size * 1.9, overflow: 'visible'}}>
							<path d="M50 6 C88 4 98 50 88 72 C76 98 20 98 8 66 C-4 34 18 6 58 8" fill="none" stroke={C.red} strokeWidth="7" strokeLinecap="round" strokeDasharray="300" strokeDashoffset={300 * (1 - ring)} />
						</svg>
					) : null}
				</div>
			);
		})}
	</div>
);

// 1) Kanca: ÜCRETSİZ etiketi, 30 gün akar, etiket ₺₺₺'ye döner.
const HookScene: React.FC = () => {
	const tag = usePop(CUES.freeTag);
	const days = useRamp(CUES.days[0], CUES.days[1]);
	const flip = useRamp(CUES.flip, CUES.flip + 0.35);
	return (
		<AbsoluteFill>
			<Abs x={540} y={480} style={{transform: `translate(-50%,0) scale(${tag}) rotate(-4deg) rotateX(${flip * 180}deg)`}}>
				<div style={card({padding: '20px 60px', background: flip < 0.5 ? C.green : C.red, fontSize: 100, fontWeight: 900, color: C.card, letterSpacing: -2})}>
					<div style={{transform: `rotateX(${flip >= 0.5 ? 180 : 0}deg)`}}>{flip < 0.5 ? 'ÜCRETSİZ' : '₺₺₺ / ay'}</div>
				</div>
			</Abs>
			<Abs x={540} y={720} style={{transform: `translate(-50%,0) scale(${0.85 * tag})`, transformOrigin: 'top center'}}>
				<MonthGrid crossed={Math.round(days * 30)} />
			</Abs>
		</AbsoluteFill>
	);
};

// 2) Kart bilgisi istenir, hatırlatma zili sessiz.
const FormScene: React.FC = () => {
	const form = usePop(CUES.form);
	const typed = useRamp(CUES.cardType[0], CUES.cardType[1]);
	const bell = usePop(CUES.bellMute, 9);
	const digits = '4242 4242 4242 4242';
	const shown = digits.slice(0, Math.round(typed * digits.length));
	return (
		<AbsoluteFill>
			<Abs x={470} y={500} style={{transform: `translate(-50%,0) scale(${form})`}}>
				<div style={card({width: 640, padding: '34px 40px'})}>
					<div style={{fontSize: 46, fontWeight: 900, color: C.green}}>30 gün ücretsiz dene</div>
					<div style={{marginTop: 28, fontSize: 26, fontWeight: 800, color: C.grey, letterSpacing: 3}}>KART NUMARASI</div>
					<div style={{marginTop: 10, height: 86, border: `5px solid ${C.ink}`, borderRadius: 14, display: 'flex', alignItems: 'center', padding: '0 24px', fontSize: 38, fontWeight: 800, color: C.ink, whiteSpace: 'nowrap'}}>
						💳&nbsp;{shown}
						<span style={{opacity: typed < 1 ? 1 : 0, color: C.orange}}>|</span>
					</div>
					<div style={{marginTop: 28, height: 90, borderRadius: 50, background: C.green, color: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, fontWeight: 900}}>Başla →</div>
				</div>
			</Abs>
			<Abs x={850} y={1000} style={{transform: `translate(-50%,0) scale(${bell}) rotate(${Math.sin(bell * 12) * 10}deg)`}}>
				<svg width="200" height="200" viewBox="0 0 200 200">
					<path d="M100 30 C60 30 50 70 50 100 V130 L35 150 H165 L150 130 V100 C150 70 140 30 100 30 Z" fill={C.gold} stroke={C.ink} strokeWidth="8" strokeLinejoin="round" />
					<circle cx="100" cy="165" r="16" fill={C.ink} />
					<line x1="30" y1="30" x2="170" y2="175" stroke={C.red} strokeWidth="16" strokeLinecap="round" />
				</svg>
			</Abs>
			<div style={{position: 'absolute', left: 120, top: GROUND_Y - 150}}>
				<Person color={PALETTES.blush.people[0]} />
			</div>
		</AbsoluteFill>
	);
};

const Dialog: React.FC<{title: string; s: number; red?: boolean}> = ({title, s, red}) => (
	<div style={card({width: 420, padding: '22px 28px', transform: `scale(${s})`, opacity: s})}>
		<div style={{fontSize: 36, fontWeight: 900, color: red ? C.red : C.ink}}>{title}</div>
		<div style={{display: 'flex', gap: 14, marginTop: 16}}>
			<div style={{flex: 1, height: 52, borderRadius: 30, background: C.green, color: C.card, fontSize: 26, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{red ? 'Vazgeç' : 'Devam'}</div>
			<div style={{flex: 1, height: 52, borderRadius: 30, border: `4px solid ${C.grey}`, color: C.grey, fontSize: 24, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{red ? 'Evet' : 'Geri'}</div>
		</div>
	</div>
);

// 3) Kaydol tek tık; iptal menülerin ve "Emin misin?" pencerelerinin arkasında.
const CancelScene: React.FC = () => {
	const signup = usePop(CUES.signup);
	const click = usePop(CUES.click, 8);
	const link = usePop(CUES.cancelLink);
	const menus = ['Ayarlar ›', 'Hesap ›', 'Abonelik ›'].map((_, i) => usePop(CUES.menus + i * 0.4));
	const sure = [0, 1, 2].map((i) => usePop(CUES.sure + i * 0.45, 10));
	return (
		<AbsoluteFill>
			<Abs x={270} y={560} style={{transform: `translate(-50%,0) scale(${signup * (1 - click * 0.08 + click * 0.08)})`}}>
				<div style={{background: C.green, color: C.card, fontFamily: FONT, fontWeight: 900, fontSize: 64, padding: '36px 56px', borderRadius: 30, border: `7px solid ${C.ink}`, boxShadow: `0 ${14 - click * 8}px 0 ${C.ink}`}}>KAYDOL</div>
			</Abs>
			<Abs x={270} y={760} style={{opacity: click}}>
				<Pill bg={C.green} size={40}>1 tık</Pill>
			</Abs>
			<Abs x={780} y={500} style={{transform: `translate(-50%,0) scale(${link})`}}>
				<div style={{fontFamily: FONT, fontSize: 30, fontWeight: 700, color: C.grey, textDecoration: 'underline'}}>iptal et</div>
			</Abs>
			{menus.map((m, i) => (
				<Abs key={i} x={780 + i * 18} y={570 + i * 70} style={{transform: `translate(-50%,0) scale(${m})`, opacity: m}}>
					<div style={card({width: 360, padding: '14px 26px', fontSize: 34, fontWeight: 800, color: C.ink})}>{['Ayarlar ›', 'Hesap ›', 'Abonelik ›'][i]}</div>
				</Abs>
			))}
			{sure.map((s, i) => (
				<Abs key={i} x={700 + i * 40} y={830 + i * 90}>
					<Dialog title={['Emin misin?', 'Gerçekten mi?', 'Son kararın mı?'][i]} s={s} red />
				</Abs>
			))}
		</AbsoluteFill>
	);
};

// 4) Bir ay sonra hizmet "senin": profil, listeler, alışkanlıklar birikir.
const OwnScene: React.FC = () => {
	const phone = usePop(CUES.ownCard);
	const items = CUES.ownItems.map((t) => usePop(t));
	const rows = [
		{icon: '🎵', label: 'Listelerin', color: C.orange},
		{icon: '👤', label: 'Profillerin', color: C.mint},
		{icon: '🔥', label: 'Alışkanlıkların', color: C.red},
	];
	return (
		<AbsoluteFill>
			<Spotlight x={540} width={700} opacity={phone} />
			<Abs x={540} y={480} style={{transform: `translate(-50%,0) scale(${phone})`}}>
				<div style={{width: 520, height: 780, background: C.ink, borderRadius: 60, padding: 24}}>
					<div style={{width: '100%', height: '100%', background: '#FFF6EF', borderRadius: 40, padding: '40px 30px', fontFamily: FONT}}>
						<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
							<div style={{width: 90, height: 90, borderRadius: 45, background: PALETTES.blush.people[0], border: `5px solid ${C.ink}`}} />
							<div style={{fontSize: 46, fontWeight: 900, color: C.ink}}>Senin hesabın</div>
						</div>
						{rows.map((r, i) => (
							<div key={r.label} style={{marginTop: 36, height: 120, borderRadius: 24, background: C.card, border: `5px solid ${C.ink}`, display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px', transform: `translateX(${(1 - items[i]) * 500}px)`, opacity: items[i]}}>
								<div style={{width: 72, height: 72, borderRadius: 18, background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40}}>{r.icon}</div>
								<div style={{fontSize: 40, fontWeight: 800, color: C.ink}}>{r.label}</div>
							</div>
						))}
					</div>
				</div>
			</Abs>
		</AbsoluteFill>
	);
};

// 5) Vazgeçmek = kaybetmek; kayıp korkusu.
const LossScene: React.FC = () => {
	const eq = usePop(CUES.lossEq);
	const eqMark = usePop(CUES.lossEq + 1.0, 9);
	const pill = usePop(CUES.lossPill);
	const frame = useAbsFrame();
	return (
		<AbsoluteFill>
			<Abs x={540} y={560} style={{transform: `translate(-50%,0) scale(${eq})`, display: 'flex', alignItems: 'center', gap: 30}}>
				<div style={card({padding: '24px 34px', fontSize: 58, fontWeight: 900, color: C.ink})}>Vazgeçmek</div>
				<div style={{fontFamily: FONT, fontSize: 120, fontWeight: 900, color: C.red, transform: `scale(${eqMark})`}}>=</div>
				<div style={card({padding: '24px 34px', fontSize: 58, fontWeight: 900, color: C.card, background: C.red})}>Kaybetmek</div>
			</Abs>
			<Abs x={540} y={800} style={{transform: `translate(-50%,0) scale(${eqMark})`}}>
				<svg width="240" height="220" viewBox="0 0 240 220">
					<path d="M120 200 C30 140 0 90 30 45 C60 5 110 20 120 55 C130 20 180 5 210 45 C240 90 210 140 120 200 Z" fill={C.red} stroke={C.ink} strokeWidth="8" strokeLinejoin="round" />
					<path d="M120 55 L100 100 L135 125 L110 170" fill="none" stroke={C.ink} strokeWidth="8" strokeLinejoin="round" />
				</svg>
			</Abs>
			<Abs x={540} y={1090} style={{transform: `translate(-50%,0) scale(${pill})`}}>
				<Pill bg={C.orange}>KAYIP KORKUSU</Pill>
			</Abs>
			<div style={{position: 'absolute', left: 120, top: GROUND_Y - 150}}>
				<Person color={PALETTES.blush.people[0]} bob={Math.sin(frame / 3) * 2 * pill} />
			</div>
		</AbsoluteFill>
	);
};

// 6) Spor salonu: aylık üye gidiş başına $17, tek giriş $10.
const GymScene: React.FC = () => {
	const gym = usePop(CUES.gym);
	const g17 = useRamp(CUES.bar17, CUES.bar17 + 0.8);
	const g10 = useRamp(CUES.bar10, CUES.bar10 + 0.8);
	const bars = [
		{x: 360, h: 17, g: g17, color: C.red, label: 'AYLIK ÜYE', sub: 'gidiş başına'},
		{x: 720, h: 10, g: g10, color: C.green, label: 'TEK GİRİŞ', sub: 'gidiş başına'},
	];
	return (
		<AbsoluteFill>
			<Abs x={540} y={500} style={{transform: `translate(-50%,0) scale(${gym})`, display: 'flex', alignItems: 'center', gap: 24}}>
				<svg width="150" height="80" viewBox="0 0 150 80">
					<rect x="0" y="10" width="26" height="60" rx="6" fill={C.ink} />
					<rect x="124" y="10" width="26" height="60" rx="6" fill={C.ink} />
					<rect x="26" y="34" width="98" height="12" fill={C.ink} />
				</svg>
				<div style={{fontFamily: FONT, fontWeight: 900, fontSize: 52, color: C.ink}}>SPOR SALONU</div>
			</Abs>
			{bars.map((b) => {
				const h = b.h * 30 * b.g;
				return (
					<div key={b.label}>
						<div style={{position: 'absolute', left: b.x - 100, top: GROUND_Y - h, width: 200, height: h, background: b.color, border: `6px solid ${C.ink}`, borderBottom: 'none', borderRadius: '14px 14px 0 0'}} />
						<Abs x={b.x} y={GROUND_Y - h - 110} style={{opacity: b.g}}>
							<div style={{fontFamily: FONT, fontWeight: 900, fontSize: 90, color: b.color, letterSpacing: -3}}>${Math.round(b.h * b.g)}</div>
						</Abs>
						<Abs x={b.x} y={GROUND_Y + 20} style={{opacity: b.g, textAlign: 'center'}}>
							<div style={{fontFamily: FONT, fontWeight: 900, fontSize: 34, color: C.ink, whiteSpace: 'nowrap'}}>{b.label}</div>
							<div style={{fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.grey}}>{b.sub}</div>
						</Abs>
					</div>
				);
			})}
			<Abs x={540} y={GROUND_Y + 130}>
				<div style={{fontFamily: FONT, fontSize: 24, fontWeight: 600, color: C.grey, whiteSpace: 'nowrap'}}>Kaynak: DellaVigna &amp; Malmendier, American Economic Review, 2006</div>
			</Abs>
		</AbsoluteFill>
	);
};

// 7) "BEDAVA" çatlar, altından "unutkanlığına yatırım" çıkar.
const FreeScene: React.FC = () => {
	const word = usePop(CUES.bedava);
	const crack = useRamp(CUES.crack, CUES.crack + 0.4);
	const split = useRamp(CUES.invest - 0.2, CUES.invest + 0.3);
	const invest = usePop(CUES.invest, 10);
	const half = (side: 1 | -1) => ({
		position: 'absolute' as const,
		inset: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		clipPath: side < 0 ? 'polygon(0 0, 52% 0, 46% 50%, 54% 100%, 0 100%)' : 'polygon(52% 0, 100% 0, 100% 100%, 54% 100%, 46% 50%)',
		transform: `translate(${side * split * 260}px, ${split * 120}px) rotate(${side * split * 14}deg)`,
		opacity: 1 - split,
	});
	return (
		<AbsoluteFill>
			<Abs x={540} y={560} style={{transform: `translate(-50%,0) scale(${word})`}}>
				<div style={{position: 'relative', width: 900, height: 260, fontFamily: FONT, fontWeight: 900, fontSize: 210, color: C.green, letterSpacing: -6}}>
					{[-1, 1].map((side) => (
						<div key={side} style={half(side as 1 | -1)}>BEDAVA</div>
					))}
					<svg viewBox="0 0 900 260" style={{position: 'absolute', inset: 0, opacity: crack * (1 - split)}}>
						<path d="M468 0 L450 70 L480 120 L414 190 L486 260" fill="none" stroke={C.ink} strokeWidth="10" strokeDasharray="400" strokeDashoffset={400 * (1 - crack)} />
					</svg>
				</div>
			</Abs>
			<Abs x={540} y={620} style={{transform: `translate(-50%,0) scale(${invest})`, textAlign: 'center'}}>
				<div style={{fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.ink}}>unutkanlığına</div>
				<div style={{fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.red, letterSpacing: -4}}>YATIRIM</div>
			</Abs>
		</AbsoluteFill>
	);
};

// 8) Kapanış: takvimde iptal günü kırmızı halka ile işaretlenir.
const CloseScene: React.FC = () => {
	const cal = usePop(CUES.calendar);
	const ring = useRamp(CUES.circle, CUES.circle + 0.6);
	return (
		<AbsoluteFill>
			<Abs x={540} y={560} style={{transform: `translate(-50%,0) scale(${0.95 * cal})`, transformOrigin: 'top center'}}>
				<MonthGrid crossed={ring > 0.5 ? 30 : 0} ring={ring} size={86} />
			</Abs>
			<Abs x={850} y={1110} style={{opacity: ring, transform: `translate(-50%,0) rotate(-6deg) scale(${0.6 + ring * 0.4})`}}>
				<Pill bg={C.red} size={44}>İPTAL GÜNÜ</Pill>
			</Abs>
		</AbsoluteFill>
	);
};

const HITS: Hit[] = [
	...panHits(Object.values(SCENES).slice(1).map((r) => r[0])),
	[CUES.freeTag, 'pop', 0.5],
	[CUES.days[0], 'rise', 0.3],
	[CUES.flip, 'coin', 0.5],
	[CUES.form, 'pop', 0.4],
	...[0, 1, 2, 3, 4, 5].map((i): Hit => [CUES.cardType[0] + i * 0.2, 'tick', 0.25]),
	[CUES.bellMute, 'thud', 0.5],
	[CUES.signup, 'pop', 0.45],
	[CUES.click, 'tick', 0.6],
	[CUES.cancelLink, 'tick', 0.3],
	...[0, 1, 2].map((i): Hit => [CUES.menus + i * 0.4, 'pop', 0.35]),
	...[0, 1, 2].map((i): Hit => [CUES.sure + i * 0.45, 'thud', 0.35]),
	[CUES.ownCard, 'pop', 0.45],
	...CUES.ownItems.map((t): Hit => [t, 'pop', 0.4]),
	[CUES.lossEq, 'pop', 0.4],
	[CUES.lossEq + 1.0, 'thud', 0.5],
	[CUES.lossPill, 'ding', 0.35],
	[CUES.gym, 'pop', 0.4],
	[CUES.bar17, 'rise', 0.4],
	[CUES.bar17 + 0.8, 'coin', 0.35],
	[CUES.bar10, 'rise', 0.3],
	[CUES.bedava, 'pop', 0.45],
	[CUES.crack, 'thud', 0.6],
	[CUES.invest, 'coin', 0.45],
	[CUES.calendar, 'pop', 0.4],
	[CUES.circle, 'rise', 0.45],
	[CUES.end, 'logo', 0.5],
];

export const Ucretsiz: React.FC<{vo?: string}> = ({vo}) => (
	<Stage palette={PALETTES.blush}>
		<Scene range={SCENES.hook} first>
			<HookScene />
		</Scene>
		<Scene range={SCENES.form}>
			<FormScene />
		</Scene>
		<Scene range={SCENES.cancel}>
			<CancelScene />
		</Scene>
		<Scene range={SCENES.own}>
			<OwnScene />
		</Scene>
		<Scene range={SCENES.loss}>
			<LossScene />
		</Scene>
		<Scene range={SCENES.gym}>
			<GymScene />
		</Scene>
		<Scene range={SCENES.free}>
			<FreeScene />
		</Scene>
		<Scene range={SCENES.close}>
			<CloseScene />
		</Scene>
		<Captions beats={BEATS} />
		<EndSequence at={CUES.end} />
		{vo ? <Soundtrack vo={vo} hits={HITS} endAt={CUES.end} /> : null}
	</Stage>
);
