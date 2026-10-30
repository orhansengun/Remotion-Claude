import {ThreeCanvas} from '@remotion/three';
import {useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {CinemaCover} from '../../components/CinemaCover';
import {T} from './script';
import {UykuWorld} from './world';

// Kapak karesi: yatak boşluğa düşerken.
export const UykuCover: React.FC = () => {
	const {width, height, fps} = useVideoConfig();
	return (
		<CinemaCover kicker="NEDEN OLUR?" top="Uykuda düşüyormuş gibi" bottom="neden irkiliyoruz?" accent="#9FC4FF">
			<ThreeCanvas width={width} height={height} shadows camera={{fov: 40, near: 0.05, far: 300}} gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping, preserveDrawingBuffer: true}}>
				<UykuWorld atFrame={Math.round(T(3.4) * fps)} />
			</ThreeCanvas>
		</CinemaCover>
	);
};
