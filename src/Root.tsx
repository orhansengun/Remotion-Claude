import {Composition, Still} from 'remotion';
import {Cover} from './components/Cover';
import {SolRakam, SOL_RAKAM_FRAMES} from './videos/SolRakam/SolRakam';
import {FPS, HEIGHT, WIDTH} from './theme';

export const Root: React.FC = () => (
	<>
	<Composition
		id="SolRakam"
		component={SolRakam}
		durationInFrames={SOL_RAKAM_FRAMES}
		fps={FPS}
		width={WIDTH}
		height={HEIGHT}
	/>
	<Still
		id="SolRakamCover"
		component={Cover}
		width={WIDTH}
		height={HEIGHT}
		defaultProps={{kicker: 'FİYAT PSİKOLOJİSİ', top: 'Beynin bu fiyatı', price: '9,99 ₺', bottom: '9 lira sanıyor.'}}
	/>
	</>
);
