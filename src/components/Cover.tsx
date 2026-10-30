import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT, Palette, PALETTES} from '../theme';
import {Person} from './Props';

// Reels kapağı 1080×1920; profil ızgarası ortadaki 1080×1440'ı (3:4) gösterir.
// Bu yüzden tüm içerik y=240..1680 güvenli alanında tutulur.
export const GRID_TOP = 240;
export const GRID_BOTTOM = 1680;

export type CoverProps = {
	kicker: string;
	top: string;
	bottom: string;
	// price verilirse ilk karakteri vurgulanan büyük etiket; hero verilirse onun yerine özel görsel.
	price?: string;
	hero?: React.ReactNode;
	palette?: Palette;
};

export const Cover: React.FC<CoverProps> = ({kicker, top, bottom, price = '', hero, palette: P = PALETTES.cream}) => (
	<AbsoluteFill
		style={{
			backgroundColor: P.bg,
			backgroundImage: `radial-gradient(${P.dots} 2px, transparent 2px)`,
			backgroundSize: '44px 44px',
			fontFamily: FONT,
			alignItems: 'center',
		}}
	>
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: '50%',
				width: 900,
				height: 1920,
				marginLeft: -450,
				background: `linear-gradient(transparent, ${P.beam} 60%, transparent)`,
				clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)',
			}}
		/>
		<div style={{position: 'absolute', top: GRID_TOP + 70, display: 'flex', alignItems: 'center', gap: 22}}>
			<Img
				src={staticFile('logo.jpg')}
				style={{
					width: 110,
					height: 110,
					objectFit: 'cover',
					borderRadius: 55,
					border: `5px solid ${P.line}`,
				}}
			/>
			<div
				style={{
					background: P.pillBg,
					color: P.pillText,
					fontSize: 40,
					fontWeight: 900,
					letterSpacing: 4,
					padding: '16px 34px',
					borderRadius: 50,
				}}
			>
				{kicker}
			</div>
		</div>
		<div
			style={{
				position: 'absolute',
				top: GRID_TOP + 270,
				// Uzun başlıklar kenara dayanmasın diye boyut karakter sayısına göre küçülür.
				fontSize: Math.min(118, Math.floor(960 / (top.length * 0.56))),
				fontWeight: 900,
				color: P.text,
				letterSpacing: -4,
				textAlign: 'center',
				lineHeight: 1,
			}}
		>
			{top}
		</div>
		{hero ? (
			<div style={{position: 'absolute', top: GRID_TOP + 420, height: 480, display: 'flex', alignItems: 'center'}}>{hero}</div>
		) : (
		<div
			style={{
				position: 'absolute',
				top: GRID_TOP + 450,
				width: 940,
				padding: '40px 0 50px',
				background: C.card,
				border: `10px solid ${C.ink}`,
				borderRadius: 34,
				boxShadow: `0 22px 0 ${C.shadow}`,
				textAlign: 'center',
				fontSize: 320,
				fontWeight: 900,
				letterSpacing: -14,
				lineHeight: 1,
				transform: 'rotate(-3deg)',
			}}
		>
			<span style={{color: C.orange, position: 'relative'}}>
				{price[0]}
				<svg
					viewBox="0 0 200 260"
					style={{position: 'absolute', left: -60, top: -40, width: 300, height: 390, overflow: 'visible'}}
				>
					<path
						d="M100 10 C185 8 205 120 190 180 C170 255 40 262 15 190 C-10 115 30 20 120 18"
						fill="none"
						stroke={C.red}
						strokeWidth="12"
						strokeLinecap="round"
					/>
				</svg>
			</span>
			<span style={{color: C.grey, opacity: 0.45, filter: 'blur(5px)'}}>{price.slice(1)}</span>
		</div>
		)}
		<div
			style={{
				position: 'absolute',
				top: GRID_TOP + 940,
				fontSize: 150,
				fontWeight: 900,
				color: P.accent,
				letterSpacing: -5,
				textAlign: 'center',
				lineHeight: 1,
			}}
		>
			{bottom}
		</div>
		<div style={{position: 'absolute', top: GRID_BOTTOM - 150, left: 0, right: 0, height: 400, background: `linear-gradient(${P.ground}, ${P.bg})`, borderTop: `8px solid ${P.line}`}} />
		<div style={{position: 'absolute', top: GRID_BOTTOM - 340, display: 'flex', gap: 46, alignItems: 'flex-end'}}>
			{[0, 1, 0, 1, 0].map((k) => P.people[k]).map((color, i) => (
				<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
					<div style={{fontSize: 56, fontWeight: 900, color: P.mark, height: 70, opacity: i % 2 ? 0 : 1}}>?</div>
					<Person color={color} scale={0.8} />
				</div>
			))}
		</div>
	</AbsoluteFill>
);
