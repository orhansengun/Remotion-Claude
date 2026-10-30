import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {Captions} from '../../components/Caption';
import {EndSequence} from '../../components/kit';
import {Hit, Sfx, Soundtrack} from '../../components/Soundtrack';
import {FONT, sec} from '../../theme';
import {BEATS, END_AT, T, TOTAL_SECONDS} from './script';
import {PosWorld} from './world';

export const POS_FRAMES = sec(TOTAL_SECONDS);

// "Hepsi 2 saniyeden kısa" anında sayaç.
const Timer: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = frame / fps;
	const a = T(34.85);
	const b = T(36.82);
	if (s < a || s > b) return null;
	const v = interpolate(s, [a + 0.1, a + 1.0], [0, 1.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const op = interpolate(s, [a, a + 0.15, b - 0.2, b], [0, 1, 1, 0]);
	return (
		<div style={{position: 'absolute', bottom: 330, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, opacity: op}}>
			<div style={{display: 'inline-block', background: 'rgba(14,26,43,0.78)', borderRadius: 40, padding: '18px 48px', color: '#6EE7A0', fontSize: 120, fontWeight: 900, letterSpacing: -3, fontVariantNumeric: 'tabular-nums'}}>
				{v.toFixed(1).replace('.', ',')} sn
			</div>
		</div>
	);
};

const RAW_HITS: [number, Sfx, number][] = [
	[1.25, 'nfc', 0.5],
	[1.45, 'posbeep', 0.45],
	[3.45, 'approve', 0.55],
	[4.7, 'whoosh', 0.3],
	...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i): [number, Sfx, number] => [4.75 + i * 0.16, 'tick', 0.35]),
	[7.0, 'pop', 0.4],
	[7.4, 'thud', 0.45],
	[8.5, 'hum', 0.45],
	[9.7, 'hum', 0.4],
	[10.2, 'zap', 0.45],
	[12.03, 'zap', 0.6],
	[12.1, 'ding', 0.3],
	[13.6, 'tick', 0.4],
	[14.6, 'thud', 0.4],
	[15.93, 'data', 0.45],
	[16.7, 'data', 0.35],
	[17.6, 'lock', 0.55],
	[19.4, 'pop', 0.4],
	[20.2, 'glitch', 0.5],
	[20.9, 'thud', 0.45],
	[22.05, 'whoosh', 0.4],
	[22.3, 'data', 0.3],
	[24.15, 'ding', 0.35],
	[24.5, 'whoosh', 0.25],
	[27.26, 'ding', 0.35],
	[27.6, 'whoosh', 0.25],
	[28.83, 'ding', 0.4],
	[29.31, 'whoosh', 0.35],
	[30.2, 'hum', 0.4],
	[30.6, 'approve', 0.4],
	[31.6, 'approve', 0.4],
	[32.66, 'whoosh', 0.4],
	[32.7, 'rise', 0.35],
	[34.85, 'approve', 0.55],
	[36.82, 'whoosh', 0.35],
	[38.95, 'lock', 0.6],
	[39.0, 'thud', 0.5],
	[40.55, 'boom', 0.4],
	[40.95, 'printer', 0.45],
	[END_AT, 'logo', 0.5],
];
const HITS: Hit[] = RAW_HITS.map(([at, name, vol]) => [T(at), name, vol]);

export const Pos: React.FC<{vo?: string}> = ({vo}) => {
	const {width, height} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: '#E9E4DA'}}>
			<ThreeCanvas
				width={width}
				height={height}
				shadows
				camera={{fov: 35, near: 0.05, far: 200}}
				gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, preserveDrawingBuffer: true}}
			>
				<PosWorld />
			</ThreeCanvas>
			<Captions beats={BEATS} tone="light" />
			<Timer />
			<EndSequence at={T(END_AT)} />
			{vo ? <Soundtrack vo={vo} hits={HITS} endAt={T(END_AT)} music="music/tech-120-pos.wav" /> : null}
		</AbsoluteFill>
	);
};
