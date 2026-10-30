import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, sec} from '../theme';

// Kancadan sonra gelen marka girişi: logo dönerek gelir, "ÖRGÜN EĞİTİM" ve "başlasın!" açılır.
export const BrandSting: React.FC<{from: number; to: number; accent?: string}> = ({from, to, accent = '#FFC145'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const a = sec(from);
	const b = sec(to);
	if (frame < a - 6 || frame > b + 6) return null;
	const inP = interpolate(frame, [a - 6, a + 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const outP = interpolate(frame, [b - 6, b + 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const logo = spring({frame: frame - a, fps, config: {damping: 11}});
	const name = spring({frame: frame - a - 8, fps, config: {damping: 14}});
	const start = spring({frame: frame - a - 16, fps, config: {damping: 9}});
	return (
		<AbsoluteFill
			style={{
				background: 'radial-gradient(circle at 50% 45%, #22304A 0%, #0B1020 70%)',
				clipPath: `circle(${inP * 120 * (1 - outP)}% at 50% 45%)`,
				alignItems: 'center',
				justifyContent: 'center',
				fontFamily: FONT,
			}}
		>
			<Img
				src={staticFile('logo.jpg')}
				style={{
					width: 420,
					height: 420,
					objectFit: 'cover',
					borderRadius: 210,
					border: '8px solid #FFFDF8',
					boxShadow: '0 0 120px rgba(255,193,69,0.45)',
					transform: `scale(${logo}) rotate(${interpolate(logo, [0, 1], [-200, 0])}deg)`,
				}}
			/>
			<div style={{marginTop: 50, color: '#FFFDF8', fontSize: 120, fontWeight: 900, letterSpacing: interpolate(name, [0, 1], [40, 2]), opacity: name}}>
				ÖRGÜN EĞİTİM
			</div>
			<div style={{color: accent, fontSize: 96, fontWeight: 900, transform: `scale(${start})`, letterSpacing: -2}}>başlasın!</div>
		</AbsoluteFill>
	);
};
