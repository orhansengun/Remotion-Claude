import {ThreeCanvas} from '@remotion/three';
import {useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CinemaCover} from '../../components/CinemaCover';
import {T} from './script';
import {PosWorld} from './world';

// Kapak karesi: kart yaklaştırılmış, ekran yeşil onay gösteriyor.
export const PosCover: React.FC = () => {
	const {width, height, fps} = useVideoConfig();
	return (
		<CinemaCover kicker="NASIL ÇALIŞIR?" top="Kartını yaklaştırdığın" bottom="2 saniyede ne oluyor?">
			<ThreeCanvas width={width} height={height} shadows camera={{fov: 35, near: 0.05, far: 200}} gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, preserveDrawingBuffer: true}}>
				<PosWorld atFrame={Math.round(T(3.9) * fps)} />
			</ThreeCanvas>
		</CinemaCover>
	);
};
