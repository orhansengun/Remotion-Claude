import {Composition, Still} from 'remotion';
import {Cover} from './components/Cover';
import {Ikea, IKEA_FRAMES} from './videos/Ikea/Ikea';
import {IkeaCover} from './videos/Ikea/IkeaCover';
import {Ucretsiz, UCRETSIZ_FRAMES} from './videos/Ucretsiz/Ucretsiz';
import {UcretsizCover} from './videos/Ucretsiz/UcretsizCover';
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
	<Composition id="Ikea" component={Ikea} durationInFrames={IKEA_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{vo: 'vo-ikea.wav'}} />
	<Still id="IkeaCover" component={IkeaCover} width={WIDTH} height={HEIGHT} />
	<Composition id="Ucretsiz" component={Ucretsiz} durationInFrames={UCRETSIZ_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{vo: 'vo-ucretsiz.wav'}} />
	<Still id="UcretsizCover" component={UcretsizCover} width={WIDTH} height={HEIGHT} />
	</>
);
