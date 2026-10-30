import {RoundedBox} from '@react-three/drei';
import {Bloom, DepthOfField, EffectComposer, Vignette} from '@react-three/postprocessing';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';

// Deneme: 3D sinematik görünümün bu ortamda render edilebilirliğini ve hızını ölçer.
const clay = (color: string, rough = 0.85) => <meshStandardMaterial color={color} roughness={rough} metalness={0} />;

const Terminal: React.FC<{glow: number}> = ({glow}) => (
	<group position={[0, 0.12, 0]} rotation={[0.32, 0, 0]}>
		<RoundedBox args={[0.9, 0.12, 1.6]} radius={0.06} smoothness={6} castShadow receiveShadow>
			{clay('#2B2F36', 0.55)}
		</RoundedBox>
		<mesh position={[0, 0.065, -0.38]} rotation={[-Math.PI / 2, 0, 0]}>
			<planeGeometry args={[0.72, 0.62]} />
			<meshStandardMaterial color="#0E1A2B" emissive={new THREE.Color('#2F7BFF')} emissiveIntensity={0.25 + glow * 1.4} />
		</mesh>
		{Array.from({length: 12}).map((_, i) => (
			<RoundedBox key={i} args={[0.17, 0.05, 0.11]} radius={0.02} position={[-0.22 + (i % 3) * 0.22, 0.08, 0.15 + Math.floor(i / 3) * 0.15]} castShadow>
				{clay(i === 11 ? '#3FAE6A' : i === 9 ? '#D9534F' : '#E9E6DF', 0.6)}
			</RoundedBox>
		))}
	</group>
);

const Waves: React.FC<{t: number}> = ({t}) => (
	<group position={[0, 0.5, -0.4]} rotation={[0.32, 0, 0]}>
		{[0, 1, 2].map((i) => {
			const p = (t * 1.5 + i / 3) % 1;
			return (
				<mesh key={i} rotation={[Math.PI / 2, 0, 0]} scale={0.2 + p * 0.5}>
					<torusGeometry args={[1, 0.035, 12, 64, Math.PI * 0.7]} />
					<meshStandardMaterial color="#FFB547" emissive="#FF9F1C" emissiveIntensity={1.2} transparent opacity={(1 - p) * 0.9} />
				</mesh>
			);
		})}
	</group>
);

const Person: React.FC<{position: [number, number, number]; color: string}> = ({position, color}) => (
	<group position={position}>
		<mesh position={[0, 1.55, 0]} castShadow>
			<sphereGeometry args={[0.22, 48, 48]} />
			{clay('#E8C9A8')}
		</mesh>
		<mesh position={[0, 0.85, 0]} castShadow>
			<capsuleGeometry args={[0.3, 0.75, 12, 32]} />
			{clay(color)}
		</mesh>
	</group>
);

const Scene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, durationInFrames} = useVideoConfig();
	const t = frame / fps;
	const p = interpolate(frame, [0, durationInFrames], [0, 1], {easing: Easing.inOut(Easing.cubic)});
	const tap = interpolate(frame, [fps * 1.2, fps * 2.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const camPos = new THREE.Vector3(interpolate(p, [0, 1], [1.4, 0.7]), interpolate(p, [0, 1], [2.3, 1.9]), interpolate(p, [0, 1], [3.6, 2.6]));
	return (
		<>
			<color attach="background" args={['#E9E4DA']} />
			<fog attach="fog" args={['#E9E4DA', 4, 11]} />
			<perspectiveCamera />
			<CameraRig pos={camPos} />
			<hemisphereLight args={['#FFF4E0', '#8A7A66', 0.7]} />
			<directionalLight position={[-3, 6, 3]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} shadow-radius={6} shadow-bias={-0.0004}>
				<orthographicCamera attach="shadow-camera" args={[-4, 4, 4, -4, 0.1, 20]} />
			</directionalLight>
			{/* Tezgâh */}
			<RoundedBox args={[5, 0.2, 2.4]} radius={0.04} position={[0, -0.1, 0]} receiveShadow>
				{clay('#B07A4E', 0.7)}
			</RoundedBox>
			<mesh position={[0, -1.2, 0]} receiveShadow>
				<boxGeometry args={[4.8, 2, 2.2]} />
				{clay('#F2EEE6')}
			</mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
				<planeGeometry args={[40, 40]} />
				{clay('#D9D2C5')}
			</mesh>
			<mesh position={[0, 1.5, -3]} receiveShadow>
				<planeGeometry args={[40, 10]} />
				{clay('#EFEAE1')}
			</mesh>
			<Terminal glow={tap} />
			<group position={[interpolate(tap, [0, 1], [1.2, 0]), interpolate(tap, [0, 1], [1.1, 0.62]), interpolate(tap, [0, 1], [0.6, -0.45])]} rotation={[0.32 + (1 - tap) * 0.6, (1 - tap) * 0.6, 0]}>
				<RoundedBox args={[0.86, 0.02, 0.54]} radius={0.01} castShadow>
					{clay('#E4572E', 0.45)}
				</RoundedBox>
				<mesh position={[-0.22, 0.012, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
					<planeGeometry args={[0.14, 0.11]} />
					<meshStandardMaterial color="#E8C15A" metalness={0.8} roughness={0.3} />
				</mesh>
			</group>
			{tap > 0.6 ? <Waves t={t} /> : null}
			<Person position={[-1.5, -0.0, -2.2]} color="#2F6B4F" />
			<Person position={[1.8, -0.0, -2.6]} color="#C0392B" />
			<EffectComposer multisampling={0}>
				<DepthOfField target={[0, 0.25, -0.2]} focalLength={0.04} bokehScale={2.5} />
				<Bloom intensity={0.6} luminanceThreshold={0.85} mipmapBlur />
				<Vignette offset={0.25} darkness={0.55} />
			</EffectComposer>
		</>
	);
};

const CameraRig: React.FC<{pos: THREE.Vector3}> = ({pos}) => {
	return <CameraUpdater pos={pos} />;
};

import {useThree} from '@react-three/fiber';
const CameraUpdater: React.FC<{pos: THREE.Vector3}> = ({pos}) => {
	const camera = useThree((s) => s.camera);
	camera.position.copy(pos);
	camera.lookAt(0, 0.2, 0);
	return null;
};

export const PosTest: React.FC = () => {
	const {width, height} = useVideoConfig();
	return (
		<AbsoluteFill>
			<ThreeCanvas width={width} height={height} shadows camera={{fov: 35, near: 0.1, far: 50}} gl={{antialias: true, toneMapping: THREE.ACESFilmicToneMapping}}>
				<Scene />
			</ThreeCanvas>
		</AbsoluteFill>
	);
};
