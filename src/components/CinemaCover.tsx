import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FONT} from '../theme';
import {GRID_TOP} from './Cover';

// 3D/sinematik videolar için kapak: tam ekran sahne karesi + üstte başlık. İçerik 3:4 ızgara alanında kalır.
export const CinemaCover: React.FC<{kicker: string; top: string; bottom: string; accent?: string; children: React.ReactNode}> = ({
	kicker,
	top,
	bottom,
	accent = '#FFC145',
	children,
}) => (
	<AbsoluteFill style={{fontFamily: FONT}}>
		{children}
		<AbsoluteFill style={{background: 'linear-gradient(rgba(10,14,22,0.82) 0%, rgba(10,14,22,0.55) 38%, rgba(10,14,22,0) 58%)'}} />
		<div style={{position: 'absolute', top: GRID_TOP + 70, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
			<Img src={staticFile('logo.jpg')} style={{width: 104, height: 104, objectFit: 'cover', borderRadius: 52, border: '5px solid #FFFDF8'}} />
			<div style={{background: accent, color: '#141B26', fontSize: 40, fontWeight: 900, letterSpacing: 4, padding: '16px 34px', borderRadius: 50}}>{kicker}</div>
		</div>
		<div
			style={{
				position: 'absolute',
				top: GRID_TOP + 240,
				left: 60,
				right: 60,
				textAlign: 'center',
				color: '#FFFDF8',
				fontWeight: 900,
				letterSpacing: -3,
				lineHeight: 1.02,
				textShadow: '0 6px 24px rgba(0,0,0,0.6)',
			}}
		>
			<div style={{fontSize: Math.min(100, Math.floor(1000 / (top.length * 0.56)))}}>{top}</div>
			<div style={{fontSize: Math.min(128, Math.floor(1000 / (bottom.length * 0.56))), color: accent, marginTop: 14}}>{bottom}</div>
		</div>
	</AbsoluteFill>
);
