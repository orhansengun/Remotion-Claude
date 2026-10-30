import {ThreeCanvas} from '@remotion/three';
import {useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CinemaCover} from '../../components/CinemaCover';
import {T} from './script';
import {SoganWorld} from './world';

// Kapak karesi: ikiye ayrılmış soğan ve önünde parlayan kalkan.
export const SoganCover: React.FC = () => {
	const {width, height, fps} = useVideoConfig();
	return (
		<CinemaCover kicker="NEDEN OLUR?" top="Soğan seni ağlatmıyor," bottom="kendini koruyor." accent="#7CE0C3">
			<ThreeCanvas width={width} height={height} shadows camera={{fov: 40, near: 0.05, far: 300}} gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, preserveDrawingBuffer: true}}>
				<SoganWorld atFrame={Math.round(T(2.8) * fps)} />
			</ThreeCanvas>
		</CinemaCover>
	);
};
