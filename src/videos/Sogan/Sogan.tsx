import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {BrandSting} from '../../components/BrandSting';
import {Captions} from '../../components/Caption';
import {EndSequence} from '../../components/kit';
import {Hit, Sfx, Soundtrack} from '../../components/Soundtrack';
import {sec} from '../../theme';
import {BEATS, END_AT, STING, T, TOTAL_SECONDS} from './script';
import {SoganWorld} from './world';

export const SOGAN_FRAMES = sec(TOTAL_SECONDS);

const RAW_HITS: [number, Sfx, number][] = [
	[0.95, 'chop', 0.6],
	[1.91, 'ding', 0.35],
	[5.2, 'whoosh', 0.3],
	[8.42, 'pop', 0.35],
	[9.66, 'pop', 0.35],
	[10.9, 'whoosh', 0.4],
	[11.45, 'chop', 0.7],
	[11.5, 'crunch', 0.6],
	...[12.98, 13.3, 13.6].map((at): [number, Sfx, number] => [at, 'pop', 0.25]),
	[14.3, 'fizz', 0.5],
	[16.0, 'fizz', 0.4],
	[18.25, 'pop', 0.4],
	[20.47, 'whoosh', 0.3],
	[20.6, 'fizz', 0.4],
	[22.4, 'zap', 0.4],
	[24.15, 'alarm', 0.35],
	...[25.6, 26.2, 26.9, 27.5, 28.2].map((at): [number, Sfx, number] => [at, 'drip', 0.5]),
	[29.81, 'whoosh', 0.3],
	[30.6, 'boing', 0.4],
	[31.3, 'boing', 0.35],
	[32.2, 'crunch', 0.4],
	[32.4, 'fizz', 0.5],
	[33.2, 'boing', 0.4],
	[33.6, 'ding', 0.4],
	[35.3, 'whoosh', 0.3],
	[36.9, 'fridge', 0.6],
	[38.96, 'ting', 0.5],
	[40.39, 'chop', 0.4],
	...[42.06, 42.3, 42.55].map((at): [number, Sfx, number] => [at, 'pop', 0.35]),
	[END_AT, 'logo', 0.5],
];
const HITS: Hit[] = RAW_HITS.map(([at, name, vol]) => [T(at), name, vol]);

export const Sogan: React.FC<{vo?: string}> = ({vo}) => {
	const {width, height} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: '#2A211B'}}>
			<ThreeCanvas width={width} height={height} shadows camera={{fov: 40, near: 0.05, far: 300}} gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, preserveDrawingBuffer: true}}>
				<SoganWorld />
			</ThreeCanvas>
			<Captions beats={BEATS} tone="light" />
			<BrandSting from={T(STING[0])} to={T(STING[1])} />
			<EndSequence at={T(END_AT)} />
			{vo ? <Soundtrack vo={vo} hits={HITS} endAt={T(END_AT)} music="music/kitchen-100-sogan.wav" musicGain={1.8} /> : null}
		</AbsoluteFill>
	);
};
