import {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, sec, WIDTH} from '../theme';

export const PAN = 14;

// Sahne içindeki zamanlar mutlak saniyedir; Sequence'in yerel karesine bu ofset eklenir.
export const OffsetCtx = createContext(0);
export const useAbsFrame = () => useCurrentFrame() + useContext(OffsetCtx);

export const usePop = (atSec: number, damping = 12) => {
	const frame = useAbsFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - sec(atSec), fps, config: {damping}});
};

export const useRamp = (fromSec: number, toSec: number) => {
	const frame = useAbsFrame();
	return interpolate(frame, [sec(fromSec), sec(toSec)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.inOut(Easing.cubic),
	});
};

export const Abs: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	x,
	y,
	children,
	style,
}) => (
	<div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, 0)', ...style}}>{children}</div>
);

// Sahneler yan yana duran bir dünyada kamera kaydırılıyormuş gibi girip çıkar.
export const Pan: React.FC<{enter: boolean; exitAt: number; children: React.ReactNode}> = ({enter, exitAt, children}) => {
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

export const Scene: React.FC<{range: readonly [number, number]; children: React.ReactNode; first?: boolean}> = ({
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

// Jenerik: Örgün Eğitim logosu, logonun sarı zeminiyle aynı renkte bir perde üzerinde.
export const EndCard: React.FC<{at: number}> = ({at: s}) => {
	const bg = useRamp(s, s + 0.45);
	const logo = usePop(s + 0.25, 11);
	const cta = usePop(s + 0.8);
	const frame = useAbsFrame();
	const drift = Math.sin((frame - sec(s)) / 18) * 1.5;
	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(180deg, #EDD596 0%, #EBC46E 55%, #E8B247 100%)',
				clipPath: `circle(${bg * 150}% at 50% 55%)`,
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: FONT,
			}}
		>
			<Img
				src={staticFile('logo.jpg')}
				style={{
					width: 900,
					transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])}) rotate(${interpolate(logo, [0, 1], [-12, 0]) + drift}deg)`,
					opacity: logo,
					maskImage: 'radial-gradient(circle at 50% 50%, black 52%, transparent 70%)',
					WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 52%, transparent 70%)',
				}}
			/>
			<div
				style={{
					marginTop: 10,
					transform: `scale(${cta})`,
					background: '#B3261E',
					color: C.card,
					fontSize: 54,
					fontWeight: 900,
					padding: '20px 60px',
					borderRadius: 60,
					boxShadow: '0 10px 0 rgba(120,30,20,0.25)',
				}}
			>
				Takip et →
			</div>
		</AbsoluteFill>
	);
};


// Jenerik dahil, bir videonun ortak iskeleti: sahneler zamanlarıyla sırayla kaydırılır.
export const EndSequence: React.FC<{at: number}> = ({at}) => (
	<Sequence from={sec(at)}>
		<OffsetCtx.Provider value={sec(at)}>
			<EndCard at={at} />
		</OffsetCtx.Provider>
	</Sequence>
);
