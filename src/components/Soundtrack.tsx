import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {sec} from '../theme';
import {PAN} from './kit';

export type Sfx =
	| 'whoosh' | 'pop' | 'ding' | 'thud' | 'tick' | 'rise' | 'coin' | 'logo'
	| 'posbeep' | 'approve' | 'nfc' | 'hum' | 'zap' | 'data' | 'lock' | 'glitch' | 'boom' | 'printer'
	| 'heartbeat' | 'breath' | 'fallwind' | 'alarm' | 'jolt' | 'clockring'
	| 'chop' | 'crunch' | 'fizz' | 'drip' | 'fridge' | 'ting' | 'boing';
export type Hit = [at: number, name: Sfx, volume: number];

// Sahne geçişlerine whoosh ekler; sahne başlangıçları verilir (ilk sahne hariç).
export const panHits = (starts: number[]): Hit[] => starts.map((at) => [at - PAN / 30, 'whoosh', 0.35]);

// musicGain: seyrek/sakin parçaları diğerleriyle aynı algılanan seviyeye getirmek için.
export const Soundtrack: React.FC<{vo: string; hits: Hit[]; endAt: number; music?: string; musicGain?: number}> = ({
	vo,
	hits,
	endAt,
	music = 'music/lofi-96.wav',
	musicGain = 1,
}) => (
	<>
		<Audio src={staticFile(vo)} />
		<Audio
			src={staticFile(music)}
			// Konuşma boyunca müzik geri planda kalır, jenerikte yükselir.
			volume={(f) =>
				Math.min(
					1,
					musicGain *
						interpolate(f, [sec(endAt) - 15, sec(endAt) + 15], [0.3, 0.55], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						}),
				)
			}
		/>
		{hits.map(([at, name, volume], i) => (
			<Sequence key={i} from={Math.max(0, sec(at))} durationInFrames={sec(2.5)}>
				<Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
			</Sequence>
		))}
	</>
);
