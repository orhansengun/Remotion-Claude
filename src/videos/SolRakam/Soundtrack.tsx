import {Hit, panHits, Soundtrack} from '../../components/Soundtrack';
import {CUES, SCENES} from './script';

const HITS: Hit[] = [
	...panHits([SCENES.brain, SCENES.catalog, SCENES.market, SCENES.luxury, SCENES.round].map((r) => r[0])),
	[CUES.hookSettle, 'thud', 0.3],
	[CUES.hookTilt, 'thud', 0.55],
	[CUES.hookTilt + 0.1, 'ding', 0.3],
	[CUES.brainSweep[0], 'tick', 0.35],
	[CUES.brainFocus, 'pop', 0.5],
	[CUES.brainPill, 'pop', 0.5],
	[CUES.dresses, 'pop', 0.3],
	[CUES.dresses + 0.25, 'pop', 0.3],
	[CUES.dresses + 0.5, 'pop', 0.3],
	...CUES.tags.map((at): Hit => [at, 'tick', 0.45]),
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

export const SolRakamSoundtrack: React.FC = () => <Soundtrack vo="vo-sol-rakam.wav" hits={HITS} endAt={CUES.end} />;
