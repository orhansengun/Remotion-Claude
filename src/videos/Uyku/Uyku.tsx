import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {BrandSting} from '../../components/BrandSting';
import {Captions} from '../../components/Caption';
import {EndSequence} from '../../components/kit';
import {Hit, Sfx, Soundtrack} from '../../components/Soundtrack';
import {sec} from '../../theme';
import {BEATS, END_AT, STING, T, TOTAL_SECONDS} from './script';
import {UykuWorld} from './world';

export const UYKU_FRAMES = sec(TOTAL_SECONDS);

// Kalp atışı sesleri, ekrandaki kalbin ritmiyle aynı (önce hızlı, 16,09'dan sonra yavaş).
const heartbeats = (): [number, Sfx, number][] => {
	const out: [number, Sfx, number][] = [];
	let at = 13.3;
	while (at < 19.0) {
		out.push([at, 'heartbeat', 0.55]);
		at += 1 / (at < 16.09 ? 1.5 : 0.85);
	}
	return out;
};

const RAW_HITS: [number, Sfx, number][] = [
	[0.1, 'breath', 0.35],
	[2.5, 'fallwind', 0.6],
	[4.15, 'jolt', 0.75],
	...[5.0, 5.4, 5.9, 6.3].map((at): [number, Sfx, number] => [at, 'thud', 0.2]),
	[8.4, 'pop', 0.45],
	...[0, 1, 2, 3, 4, 5, 6].map((k): [number, Sfx, number] => [10.4 + k * 0.28, 'pop', 0.3]),
	[10.9, 'ding', 0.35],
	[13.2, 'breath', 0.4],
	...heartbeats(),
	[17.6, 'breath', 0.5],
	[19.2, 'whoosh', 0.3],
	[21.6, 'hum', 0.35],
	[22.52, 'alarm', 0.5],
	[23.59, 'whoosh', 0.3],
	[23.65, 'rise', 0.4],
	[25.67, 'thud', 0.55],
	[27.37, 'jolt', 0.7],
	[29.58, 'whoosh', 0.3],
	[34.08, 'fallwind', 0.45],
	[35.16, 'thud', 0.55],
	[36.25, 'pop', 0.4],
	[36.9, 'clockring', 0.4],
	[37.5, 'glitch', 0.2],
	[38.0, 'rise', 0.3],
	[39.85, 'breath', 0.35],
	[41.96, 'ding', 0.4],
	[END_AT, 'logo', 0.5],
];
const HITS: Hit[] = RAW_HITS.map(([at, name, vol]) => [T(at), name, vol]);

export const Uyku: React.FC<{vo?: string}> = ({vo}) => {
	const {width, height} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: '#10172A'}}>
			<ThreeCanvas width={width} height={height} shadows camera={{fov: 40, near: 0.05, far: 300}} gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, preserveDrawingBuffer: true}}>
				<UykuWorld />
			</ThreeCanvas>
			<Captions beats={BEATS} tone="light" />
			<BrandSting from={T(STING[0])} to={T(STING[1])} />
			<EndSequence at={T(END_AT)} />
			{vo ? <Soundtrack vo={vo} hits={HITS} endAt={T(END_AT)} music="music/dream-70-uyku.wav" musicGain={1.7} /> : null}
		</AbsoluteFill>
	);
};
