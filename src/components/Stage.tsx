import {AbsoluteFill} from 'remotion';
import {GROUND_Y, Palette, PALETTES} from '../theme';

// Örnekteki krem zemin, hafif nokta dokusu ve zemin çizgisi.
// palette ile videonun zemin rengi değiştirilebilir; varsayılan krem.
export const Stage: React.FC<{children?: React.ReactNode; palette?: Palette}> = ({children, palette: P = PALETTES.cream}) => (
	<AbsoluteFill
		style={{
			backgroundColor: P.bg,
			backgroundImage: `radial-gradient(${P.dots} 2px, transparent 2px)`,
			backgroundSize: '44px 44px',
		}}
	>
		<div
			style={{
				position: 'absolute',
				top: GROUND_Y,
				left: 0,
				right: 0,
				bottom: 0,
				background: `linear-gradient(${P.ground}, ${P.bg})`,
				borderTop: `6px solid ${P.line}`,
			}}
		/>
		{children}
	</AbsoluteFill>
);

export const Spotlight: React.FC<{x: number; opacity?: number; width?: number}> = ({
	x,
	opacity = 1,
	width = 420,
}) => (
	<div
		style={{
			position: 'absolute',
			left: x - width / 2,
			top: 0,
			width,
			height: GROUND_Y,
			opacity,
			background: 'linear-gradient(rgba(255,226,120,0.0), rgba(255,226,120,0.35))',
			clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)',
		}}
	/>
);
