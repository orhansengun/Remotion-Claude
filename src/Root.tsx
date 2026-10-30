import {Composition} from 'remotion';
import {SolRakam, SOL_RAKAM_FRAMES} from './videos/SolRakam/SolRakam';
import {FPS, HEIGHT, WIDTH} from './theme';

export const Root: React.FC = () => (
	<Composition
		id="SolRakam"
		component={SolRakam}
		durationInFrames={SOL_RAKAM_FRAMES}
		fps={FPS}
		width={WIDTH}
		height={HEIGHT}
	/>
);
