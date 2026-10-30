import {ThreeCanvas} from '@remotion/three';
import {Freeze, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CinemaCover} from '../../components/CinemaCover';
import {T} from './script';
import {PosWorld} from './world';

// Kapak karesi: manyetik alanın kartın çipini uyandırdığı an.
export const PosCover: React.FC = () => {
	const {width, height, fps} = useVideoConfig();
	return (
		<CinemaCover kicker="NASIL ÇALIŞIR?" top="Kartını yaklaştırdığın" bottom="2 saniyede ne oluyor?">
			<Freeze frame={Math.round(T(11.3) * fps)}>
				<ThreeCanvas width={width} height={height} shadows camera={{fov: 35, near: 0.05, far: 200}} gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, preserveDrawingBuffer: true}}>
					<PosWorld />
				</ThreeCanvas>
			</Freeze>
		</CinemaCover>
	);
};
