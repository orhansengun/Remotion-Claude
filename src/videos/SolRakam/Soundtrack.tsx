import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {sec} from '../../theme';
import {CUES, SCENES} from './script';

type Sfx = 'whoosh' | 'pop' | 'ding' | 'thud' | 'tick' | 'rise' | 'coin' | 'logo';

const PAN_SEC = 14 / 30;
const pans = [SCENES.brain, SCENES.catalog, SCENES.market, SCENES.luxury, SCENES.round].map((r) => r[0] - PAN_SEC);

const HITS: [number, Sfx, number][] = [
	...pans.map((at): [number, Sfx, number] => [at, 'whoosh', 0.35]),
	[CUES.hookSettle, 'thud', 0.3],
	[CUES.hookTilt, 'thud', 0.55],
	[CUES.hookTilt + 0.1, 'ding', 0.3],
	[CUES.brainSweep[0], 'tick', 0.35],
	[CUES.brainFocus, 'pop', 0.5],
	[CUES.brainPill, 'pop', 0.5],
	[CUES.dresses, 'pop', 0.3],
	[CUES.dresses + 0.25, 'pop', 0.3],
	[CUES.dresses + 0.5, 'pop', 0.3],
	...CUES.tags.map((at): [number, Sfx, number] => [at, 'tick', 0.45]),
	[CUES.barsSide, 'rise', 0.25],
	[CUES.barWin, 'rise', 0.35],
	[CUES.crown, 'coin', 0.4],
	[CUES.bag, 'pop', 0.45],
	[CUES.phone, 'pop', 0.45],
	[CUES.sameGame, 'ding', 0.35],
	[CUES.luxuryShift, 'whoosh', 0.25],
	[CUES.luxuryValue, 'coin', 0.35],
	[CUES.roll, 'rise', 0.45],
	[CUES.end, 'logo', 0.5],
];

export const Soundtrack: React.FC = () => (
	<>
		<Audio src={staticFile('vo-sol-rakam.wav')} />
		<Audio
			src={staticFile('music/lofi-96.wav')}
			// Konuşma boyunca müzik geri planda kalır, jenerikte yükselir.
			volume={(f) =>
				interpolate(f, [sec(CUES.end) - 0.5 * 30, sec(CUES.end) + 15], [0.3, 0.55], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				})
			}
		/>
		{HITS.map(([at, name, volume], i) => (
			<Sequence key={i} from={Math.max(0, sec(at))} durationInFrames={sec(2.5)}>
				<Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
			</Sequence>
		))}
	</>
);
