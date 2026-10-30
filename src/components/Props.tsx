import {C, FONT} from '../theme';

type TagProps = {
	price: string;
	label?: string;
	color?: string;
	textColor?: string;
	width?: number;
	fontSize?: number;
	highlightFirst?: number; // 0..1 ilk rakamın vurgusu
	dimRest?: number; // 0..1 kalan rakamların sönmesi
};

// Fiyat etiketi; ilk rakam ayrıca vurgulanabilir.
export const PriceTag: React.FC<TagProps> = ({
	price,
	label,
	color = C.card,
	textColor = C.ink,
	width = 300,
	fontSize = 72,
	highlightFirst = 0,
	dimRest = 0,
}) => {
	const first = price[0];
	const rest = price.slice(1);
	return (
		<div
			style={{
				width,
				padding: '22px 0 26px',
				background: color,
				border: `6px solid ${C.ink}`,
				borderRadius: 18,
				boxShadow: `0 10px 0 ${C.shadow}`,
				textAlign: 'center',
				fontFamily: FONT,
				position: 'relative',
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: -16,
					left: '50%',
					width: 22,
					height: 22,
					marginLeft: -11,
					borderRadius: 11,
					background: C.bg,
					border: `5px solid ${C.ink}`,
				}}
			/>
			{label ? (
				<div style={{fontSize: 22, fontWeight: 800, letterSpacing: 3, color: C.mint, marginBottom: 4}}>
					{label}
				</div>
			) : null}
			<div style={{fontSize, fontWeight: 900, color: textColor, letterSpacing: -2, whiteSpace: 'nowrap'}}>
				<span
					style={{
						display: 'inline-block',
						color: highlightFirst > 0.5 ? C.orange : textColor,
						transform: `scale(${1 + highlightFirst * 0.35})`,
						transformOrigin: 'bottom center',
					}}
				>
					{first}
				</span>
				<span style={{opacity: 1 - dimRest * 0.75, filter: `blur(${dimRest * 6}px)`}}>{rest}</span>
			</div>
		</div>
	);
};

// Örnekteki yuvarlak kafalı küçük insan figürü.
export const Person: React.FC<{color?: string; scale?: number; bob?: number}> = ({
	color = C.mint,
	scale = 1,
	bob = 0,
}) => (
	<svg width={70 * scale} height={150 * scale} viewBox="0 0 70 150" style={{transform: `translateY(${bob}px)`}}>
		<circle cx="35" cy="28" r="22" fill={color} />
		<circle cx="28" cy="26" r="3" fill={C.ink} />
		<circle cx="42" cy="26" r="3" fill={C.ink} />
		<path d="M10 150 V80 Q10 56 35 56 Q60 56 60 80 V150 Z" fill={color} />
	</svg>
);

export const Dress: React.FC<{color: string}> = ({color}) => (
	<svg width="180" height="260" viewBox="0 0 180 260">
		<path d="M90 0 V22 M60 22 H120" stroke={C.ink} strokeWidth="6" fill="none" strokeLinecap="round" />
		<path
			d="M62 28 L76 40 Q90 50 104 40 L118 28 L132 80 L116 96 L160 250 H20 L64 96 L48 80 Z"
			fill={color}
			stroke={C.ink}
			strokeWidth="6"
			strokeLinejoin="round"
		/>
		<path d="M64 96 Q90 110 116 96" stroke={C.ink} strokeWidth="5" fill="none" />
	</svg>
);

export const Crown: React.FC<{size?: number}> = ({size = 90}) => (
	<svg width={size} height={size * 0.7} viewBox="0 0 100 70">
		<path d="M8 62 L4 14 L30 36 L50 4 L70 36 L96 14 L92 62 Z" fill={C.gold} stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
	</svg>
);
