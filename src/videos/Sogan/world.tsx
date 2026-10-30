import {RoundedBox} from '@react-three/drei';
import {Bloom, DepthOfField, EffectComposer, Vignette} from '@react-three/postprocessing';
import {useMemo} from 'react';
import {Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {add, CameraRig, Clay, Label, mix, popAt, ramp, Shot, shotAt, V3} from '../../components/three';
import {VO_RATE} from './script';

// Tüm zamanlar ORİJİNAL kayıt saniyesidir (o).
const ONION = '#C98B4E';
const FLESH = '#F4EBD3';

// Soğan: bütün ya da ikiye ayrılmış (kesik yüzünde halkalar).
const Onion: React.FC<{split?: number; root?: number; s?: number}> = ({split = 0, root = 0, s = 1}) => (
	<group scale={s}>
		{split <= 0.01 ? (
			<mesh position={[0, 0.42, 0]} scale={[1, 0.92, 1]} castShadow>
				<sphereGeometry args={[0.45, 32, 24]} />
				<Clay color={ONION} rough={0.55} />
			</mesh>
		) : (
			[-1, 1].map((side) => (
				<group key={side} position={[side * split * 0.38, 0.42, split * 0.1]} rotation={[0, -side * split * 0.9, 0]}>
					<mesh rotation={[0, 0, side * Math.PI / 2]} scale={[0.92, 1, 1]} castShadow>
						<sphereGeometry args={[0.45, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
						<Clay color={ONION} rough={0.55} />
					</mesh>
					{[0.44, 0.34, 0.24, 0.14].map((r, i) => (
						<mesh key={r} rotation={[0, side * Math.PI / 2, 0]} renderOrder={2}>
							<ringGeometry args={[r - 0.03, r, 40]} />
							<meshStandardMaterial color={i % 2 ? '#D8B98A' : '#EADBB8'} side={THREE.DoubleSide} roughness={0.5} />
						</mesh>
					))}
					<mesh rotation={[0, side * Math.PI / 2, 0]}>
						<circleGeometry args={[0.44, 40]} />
						<meshStandardMaterial color="#F7F0DC" side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} />
					</mesh>
				</group>
			))
		)}
		{split <= 0.01 ? (
			<>
				<mesh position={[0, 0.88, 0]}>
					<coneGeometry args={[0.06, 0.18, 12]} />
					<Clay color="#9A6A3A" />
				</mesh>
				<mesh position={[0, 0.02, 0]}>
					<cylinderGeometry args={[0.1, 0.06, 0.06, 16]} />
					<Clay color="#7A5236" emissive="#FF3B30" glow={root * 1.2} />
				</mesh>
			</>
		) : null}
	</group>
);

const Shield: React.FC<{position: V3; s: number; color?: string}> = ({position, s, color = '#7CE0C3'}) => (
	<group position={position} scale={s}>
		<mesh scale={[1, 1.2, 0.3]}>
			<sphereGeometry args={[0.55, 6, 2, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
			<meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} transparent opacity={0.32} roughness={0.3} depthWrite={false} />
		</mesh>
	</group>
);

const Knife: React.FC<{glint?: number}> = ({glint = 0}) => (
	<group>
		<mesh castShadow>
			<boxGeometry args={[1.4, 0.32, 0.02]} />
			<meshStandardMaterial color="#D9DEE5" metalness={0.9} roughness={0.15 - glint * 0.1} emissive="#FFFFFF" emissiveIntensity={glint * 0.8} />
		</mesh>
		<RoundedBox args={[0.6, 0.16, 0.08]} radius={0.03} position={[1.0, 0.05, 0]} castShadow>
			<Clay color="#2B2F36" />
		</RoundedBox>
	</group>
);

// Ağızlı enzim (pacman benzeri küre)
const Enzyme: React.FC<{position: V3; open: number}> = ({position, open}) => (
	<group position={position} rotation={[0, 0, Math.PI / 2]}>
		<mesh>
			<sphereGeometry args={[0.16, 24, 16, open * 0.6, Math.PI * 2 - open * 1.2]} />
			<Clay color="#3E7BFA" emissive="#3E7BFA" glow={0.4} rough={0.4} />
		</mesh>
	</group>
);

const Rabbit: React.FC<{position: V3; hop: number; facing: number}> = ({position, hop, facing}) => (
	<group position={add(position, [0, Math.abs(Math.sin(hop * Math.PI)) * 0.35, 0])} rotation={[0, facing, 0]}>
		<mesh position={[0, 0.28, 0]} scale={[1.2, 1, 1]} castShadow>
			<sphereGeometry args={[0.28, 24, 20]} />
			<Clay color="#D8D2C6" />
		</mesh>
		<mesh position={[0.3, 0.5, 0]} castShadow>
			<sphereGeometry args={[0.17, 24, 20]} />
			<Clay color="#E2DDD2" />
		</mesh>
		{[-0.06, 0.06].map((z) => (
			<mesh key={z} position={[0.27, 0.78, z]} rotation={[z * 3, 0, 0.2]} castShadow>
				<capsuleGeometry args={[0.04, 0.26, 6, 12]} />
				<Clay color="#E2DDD2" />
			</mesh>
		))}
		<mesh position={[0.45, 0.5, 0.06]}>
			<sphereGeometry args={[0.025, 10, 10]} />
			<Clay color="#2B2F36" />
		</mesh>
	</group>
);

const Fridge: React.FC<{open: number}> = ({open}) => (
	<group>
		<RoundedBox args={[1.1, 2.0, 0.9]} radius={0.06} position={[0, 1.0, 0]} castShadow>
			<Clay color="#EEF1F5" />
		</RoundedBox>
		<mesh position={[0, 1.0, 0.46]}>
			<planeGeometry args={[0.95, 1.85]} />
			<meshStandardMaterial color="#BFE3FF" emissive="#9FD8FF" emissiveIntensity={open * 1.3} />
		</mesh>
		<group position={[0.55, 1.0, 0.45]} rotation={[0, open * 1.7, 0]}>
			<RoundedBox args={[1.1, 2.0, 0.08]} radius={0.04} position={[-0.55, 0, 0.04]} castShadow>
				<Clay color="#E4E8EE" />
			</RoundedBox>
		</group>
		{open > 0.3 ? <pointLight position={[0, 1.2, 0.9]} color="#9FD8FF" intensity={open * 3} distance={3} /> : null}
	</group>
);

// ---------- Mekânlar ----------
const K: V3 = [0, 0, 0]; // mutfak
const CELL: V3 = [40, 0, 0]; // hücre içi
const EYE: V3 = [80, 0, 0]; // göz
const FIELD: V3 = [120, 0, 0]; // tarla

type S = Shot;
const SHOTS: S[] = [
	{a: -1, b: 3.3, from: [0.2, 1.9, 3.7], to: [0.1, 1.6, 3.0], look: [0, 0.5, 0], fov: 38},
	{a: 3.3, b: 5.0, from: [0.1, 1.6, 3.0], to: [0.1, 1.55, 2.9], look: [0, 0.5, 0], fov: 38},
	{a: 5.0, b: 14.2, from: add(CELL, [0, 1.6, 5.8]), to: add(CELL, [0, 1.5, 5.0]), look: add(CELL, [0, 1.25, 0]), fov: 46, fog: 18},
	{a: 14.2, b: 20.4, from: add(CELL, [0.4, 2.2, 4.8]), to: add(CELL, [0.2, 2.6, 4.3]), look: add(CELL, [0, 1.8, 0]), fov: 44, fog: 18},
	{a: 20.4, b: 29.7, from: add(EYE, [0, 1.3, 4.6]), to: add(EYE, [0, 1.4, 3.6]), look: add(EYE, [0, 1.5, 0]), fov: 42, fog: 16},
	{a: 29.7, b: 35.3, from: add(FIELD, [1.6, 1.6, 4.2]), to: add(FIELD, [1.0, 1.3, 3.3]), look: add(FIELD, [0, 0.5, 0]), fov: 42, fog: 18},
	{a: 35.3, b: 38.9, from: [-3.4, 1.9, 3.6], to: [-3.1, 1.75, 3.1], look: [-2.2, 1.1, -0.6], fov: 46},
	{a: 38.9, b: 40.35, from: [0.9, 1.3, 1.7], to: [0.7, 1.2, 1.4], look: [0.3, 0.7, 0], fov: 38},
	{a: 40.35, b: 42.0, from: [-0.2, 0.9, 1.6], to: [-0.1, 0.8, 1.3], look: [-0.5, 0.4, 0], fov: 38},
	{a: 42.0, b: 99, from: [-0.9, 2.2, 5.2], to: [-0.9, 2.0, 4.6], look: [-0.9, 0.95, -0.3], fov: 50},
];

export const SoganWorld: React.FC<{atFrame?: number}> = ({atFrame}) => {
	const current = useCurrentFrame();
	const {fps} = useVideoConfig();
	const frame = atFrame ?? current;
	const o = (frame / fps) * VO_RATE;
	const pop = (at: number, damping = 12) => popAt(o, at, fps, VO_RATE, damping);
	const shot = shotAt(SHOTS, o);
	const sp = ramp(o, shot.a, shot.b, Easing.inOut(Easing.sin));
	const camPos = mix(shot.from, shot.to, sp);
	const look = shot.look2 ? mix(shot.look, shot.look2, sp) : shot.look;

	const split = ramp(o, 0.9, 1.5, Easing.out(Easing.back(1.3)));
	// Hücre: bıçak, zar kırılması, buluşma
	const knife = ramp(o, 10.9, 11.5, Easing.in(Easing.cubic));
	const burst = ramp(o, 11.45, 12.3, Easing.out(Easing.cubic));
	const meet = ramp(o, 12.98, 13.9);
	const gasRise = ramp(o, 14.3, 20.4, Easing.linear);
	// Göz
	const gasToEye = ramp(o, 20.5, 23.6, Easing.inOut(Easing.quad));
	const sparks = o >= 22.4 && o < 24.3;
	const alarm = o >= 24.15 && o < 27.2 ? 0.5 + 0.5 * Math.sin(o * 20) : 0;
	const tears = ramp(o, 25.6, 29.5, Easing.linear);
	const wash = ramp(o, 27.3, 29.2);
	// Tarla
	const rabbitIn = ramp(o, 30.6, 31.9);
	const puff = ramp(o, 32.4, 33.4, Easing.out(Easing.cubic));
	const flee = ramp(o, 33.2, 34.6, Easing.in(Easing.quad));
	// İpuçları
	const fridgeOpen = ramp(o, 36.9, 37.6);
	const glint = o >= 38.96 && o < 40.3 ? Math.max(0, Math.sin((o - 38.96) * 4)) : 0;
	const root = o >= 40.39 ? 0.6 + 0.4 * Math.sin(o * 8) : 0;

	const bgCol = o >= 5.0 && o < 20.4 ? '#13261E' : o >= 20.4 && o < 29.7 ? '#241A2E' : o >= 29.7 && o < 35.3 ? '#2B3B4E' : '#2A211B';
	const bg = new THREE.Color(bgCol);
	const fogFar = shot.fog ?? 14;
	const lightTarget = useMemo(() => new THREE.Object3D(), []);
	lightTarget.position.set(...look);
	lightTarget.updateMatrixWorld();

	const sulfur = useMemo(() => Array.from({length: 14}).map((_, i) => [-0.75 + (i % 4) * 0.2 + Math.sin(i) * 0.05, 0.75 + Math.floor(i / 4) * 0.22, 0.1 + Math.cos(i * 2) * 0.15] as V3), []);
	const enzymes = useMemo(() => Array.from({length: 8}).map((_, i) => [0.4 + (i % 3) * 0.28, 0.8 + Math.floor(i / 3) * 0.28, 0.1 + Math.sin(i * 3) * 0.15] as V3), []);
	const gas = useMemo(() => Array.from({length: 22}).map((_, i) => [Math.sin(i * 2.3) * 0.7, (i * 0.13) % 1, Math.cos(i * 1.7) * 0.4] as V3), []);

	return (
		<>
			<color attach="background" args={[bg]} />
			<fog attach="fog" args={[bg, fogFar * 0.45, fogFar]} />
			<CameraRig pos={camPos} look={look} fov={shot.fov ?? 40} />
			<hemisphereLight args={['#FFF1DC', '#3A2A20', 0.75]} />
			<primitive object={lightTarget} />
			<directionalLight position={add(look, [-2.5, 5, 3])} target={lightTarget} intensity={2.0} color="#FFE6C4" castShadow shadow-mapSize={[1024, 1024]} shadow-radius={5} shadow-bias={-0.0005}>
				<orthographicCamera attach="shadow-camera" args={[-4, 4, 4, -4, 0.1, 25]} />
			</directionalLight>

			{/* ---- Mutfak ---- */}
			<group position={K}>
				<mesh position={[0, -0.1, 0]} receiveShadow>
					<boxGeometry args={[7, 0.2, 3]} />
					<Clay color="#B5835A" rough={0.7} />
				</mesh>
				<mesh position={[0, 2, -1.5]} receiveShadow>
					<planeGeometry args={[14, 5]} />
					<Clay color="#E8DCC8" />
				</mesh>
				{Array.from({length: 6}).map((_, i) => (
					<mesh key={i} position={[-2.5 + i, 1.4, -1.49]}>
						<planeGeometry args={[0.96, 0.5]} />
						<Clay color={i % 2 ? '#F2EADB' : '#D9CBB2'} />
					</mesh>
				))}
				<RoundedBox args={[1.6, 0.08, 1.0]} radius={0.03} position={[0, 0.04, 0]} receiveShadow castShadow>
					<Clay color="#D9B48A" rough={0.6} />
				</RoundedBox>
				{o < 35.3 ? (
					<group position={[0, 0.08, 0]}>
						<Onion split={split} />
						{o >= 1.85 && o < 5.0 ? <Shield position={[0, 0.55, 0.75]} s={pop(1.91) * 0.75} /> : null}
					</group>
				) : null}
				{/* İpuçları */}
				{o >= 35.3 ? (
					<>
						<group position={[-2.2, 0, -0.6]}>
							<Fridge open={fridgeOpen} />
							{fridgeOpen > 0.4 ? (
								<group position={[0, 1.1, 0.2]}>
									<Onion s={0.45} />
								</group>
							) : null}
							{fridgeOpen > 0.4
								? Array.from({length: 8}).map((_, i) => (
										<mesh key={i} position={[Math.sin(i * 2 + o) * 0.6, 0.5 + ((i * 0.3 + o * 0.4) % 1.8), 0.7]}>
											<octahedronGeometry args={[0.04, 0]} />
											<meshBasicMaterial color="#DFF3FF" toneMapped={false} />
										</mesh>
									))
								: null}
						</group>
						<group position={[0.4, 0.62, 0]} rotation={[0, -0.3, -0.25 + glint * 0.15]} scale={0.7 + pop(38.96) * 0.3}>
							<Knife glint={glint} />
						</group>
						{glint > 0.6 ? (
							<mesh position={[0.1, 0.8, 0.15]} scale={glint * 0.4}>
								<octahedronGeometry args={[0.2, 0]} />
								<meshBasicMaterial color="#FFFFFF" toneMapped={false} />
							</mesh>
						) : null}
						<group position={[-0.5, 0.08, 0.1]} rotation={[0, 0, Math.PI / 2 - 0.2]}>
							<Onion root={root} s={0.6} />
						</group>
						{o >= 40.39 ? <Label text="KÖK: EN SON" position={[-0.9, 0.5, 0.45]} height={0.13} bg="#D9363E" opacity={pop(40.39)} /> : null}
						{o >= 42.0 ? (
							<>
								<Label text="1" position={[-1.75, 2.2, 0.2]} height={0.3} bg="#2ECC71" fg="#0B1020" opacity={pop(42.06)} />
								<Label text="2" position={[0.1, 1.15, 0.2]} height={0.3} bg="#2ECC71" fg="#0B1020" opacity={pop(42.3)} />
								<Label text="3" position={[-0.55, 0.95, 0.3]} height={0.3} bg="#2ECC71" fg="#0B1020" opacity={pop(42.55)} />
							</>
						) : null}
					</>
				) : null}
				<pointLight position={[1.5, 2.2, 1.5]} color="#FFC88A" intensity={1.2} distance={6} />
			</group>

			{/* ---- Hücre içi ---- */}
			<group position={CELL}>
				<RoundedBox args={[2.6, 1.8, 0.9]} radius={0.35} position={[0, 1.1, 0]}>
					<meshStandardMaterial color="#B8E07A" transparent opacity={0.18} roughness={0.2} />
				</RoundedBox>
				{/* zar: iki bölmeyi ayırır, bıçakla kırılır */}
				{o < 14.2 && [-1, 1].map((side) => (
					<mesh key={side} position={[0.05 + side * burst * 0.3, 1.1 + side * 0.45 + side * burst * 0.5, 0]} rotation={[0, 0, side * burst * 0.8]}>
						<boxGeometry args={[0.04, 0.85, 0.8]} />
						<meshStandardMaterial color="#E8F5C8" transparent opacity={0.6 * (1 - burst * 0.7)} />
					</mesh>
				))}
				{sulfur.map((p, i) => {
					const target: V3 = enzymes[i % enzymes.length];
					const pos = mix(p, add(target, [-0.12, 0, 0]), meet);
					const hi = o >= 8.42 && o < 10.79 ? 0.6 : 0;
					return o < 14.3 ? (
						<mesh key={i} position={pos}>
							<sphereGeometry args={[0.07, 16, 12]} />
							<Clay color="#FFD23F" emissive="#FFD23F" glow={0.3 + hi} />
						</mesh>
					) : null;
				})}
				{enzymes.map((p, i) => (o < 14.3 ? <Enzyme key={i} position={p} open={0.5 + 0.5 * Math.sin(o * 6 + i)} /> : null))}
				{o >= 8.42 && o < 10.79 ? <Label text="KÜKÜRTLÜ MADDE" position={[-0.45, 2.15, 0.5]} height={0.12} bg="#C9A21A" opacity={pop(8.42)} /> : null}
				{o >= 9.66 && o < 10.79 ? <Label text="ENZİM" position={[0.6, 2.15, 0.5]} height={0.12} bg="#3E7BFA" opacity={pop(9.66)} /> : null}
				{o >= 10.79 && o < 12.4 ? (
					<group position={[0.05, 3.2 - knife * 2.4, 0.2]} rotation={[0, 0, Math.PI / 2]}>
						<Knife />
					</group>
				) : null}
				{o >= 14.3
					? gas.map((p, i) => {
							const y = 0.9 + ((p[1] + gasRise * 1.6) % 1.6) * 1.4;
							return (
								<mesh key={i} position={[p[0] * (0.6 + gasRise * 0.6), y, p[2]]} scale={0.6 + gasRise * 0.8}>
									<sphereGeometry args={[0.1, 14, 10]} />
									<meshStandardMaterial color="#FFF4C2" emissive="#FFE680" emissiveIntensity={0.5} transparent opacity={0.45} />
								</mesh>
							);
						})
					: null}
				{o >= 18.25 && o < 20.4 ? <Label text="syn-propanethial-S-oxide" position={[0, 1.55, 1.0]} height={0.11} bg="#D9363E" opacity={pop(18.25)} /> : null}
			</group>

			{/* ---- Göz ---- */}
			<group position={EYE}>
				<mesh position={[0, 1.5, -0.2]}>
					<sphereGeometry args={[0.95, 40, 32]} />
					<Clay color="#FFF6F0" emissive="#FF4D5E" glow={alarm * 0.5} rough={0.25} />
				</mesh>
				<mesh position={[0, 1.5, 0.758]}>
					<circleGeometry args={[0.42, 40]} />
					<Clay color="#3E7BFA" rough={0.3} />
				</mesh>
				<mesh position={[0, 1.5, 0.764]}>
					<circleGeometry args={[0.2, 32]} />
					<Clay color="#0B1020" rough={0.2} />
				</mesh>
				<mesh position={[0.12, 1.62, 0.77]}>
					<circleGeometry args={[0.06, 16]} />
					<meshBasicMaterial color="#FFFFFF" toneMapped={false} />
				</mesh>
				{o < 29.7
					? gas.slice(0, 14).map((p, i) => {
							const start: V3 = [p[0] * 1.2, -0.6 + p[1] * 0.5, 1.2];
							const end: V3 = [p[0] * 0.5, 1.3 + Math.sin(i) * 0.25, 0.85];
							const pos = mix(start, end, gasToEye);
							return (
								<mesh key={i} position={pos} scale={0.8 * (1 - wash)}>
									<sphereGeometry args={[0.09, 12, 10]} />
									<meshStandardMaterial color="#FFF4C2" emissive="#FFE680" emissiveIntensity={0.5} transparent opacity={0.5} />
								</mesh>
							);
						})
					: null}
				{sparks
					? Array.from({length: 8}).map((_, i) => {
							const a = (i / 8) * Math.PI * 2 + o * 3;
							return (
								<mesh key={i} position={[Math.cos(a) * 1.05, 1.5 + Math.sin(a) * 1.05, 0.5]} rotation={[0, 0, a]}>
									<boxGeometry args={[0.18, 0.025, 0.025]} />
									<meshBasicMaterial color="#FFE14D" toneMapped={false} />
								</mesh>
							);
						})
					: null}
				{alarm > 0 ? <Label text="ALARM!" position={[0, 2.75, 0.4]} height={0.26} bg="#D9363E" opacity={pop(24.15)} /> : null}
				{tears > 0
					? Array.from({length: 6}).map((_, i) => {
							const p = (tears * 2.2 + i / 6) % 1;
							return (
								<mesh key={i} position={[0.75 - (i % 2) * 1.5, 1.2 - p * 1.6, 0.75]} scale={[0.6, 0.9, 0.6]}>
									<sphereGeometry args={[0.09, 16, 12]} />
									<meshStandardMaterial color="#7FC8FF" emissive="#7FC8FF" emissiveIntensity={0.4} transparent opacity={0.85} roughness={0.1} />
								</mesh>
							);
						})
					: null}
				<pointLight position={[0, 2.4, 2]} color="#FFD6E0" intensity={1.5} distance={6} />
			</group>

			{/* ---- Tarla ---- */}
			<group position={FIELD}>
				<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
					<planeGeometry args={[30, 30]} />
					<Clay color="#6B4A2E" />
				</mesh>
				{[[-1.2, 0, -0.8], [0, 0, 0], [1.1, 0, -0.6], [-0.4, 0, -1.8], [0.9, 0, -2.0]].map((p, i) => (
					<group key={i} position={p as V3}>
						<group position={[0, -0.25, 0]}>
							<Onion s={0.7} />
						</group>
						{[-0.15, 0, 0.15].map((r) => (
							<mesh key={r} position={[r * 0.4, 0.75, 0]} rotation={[0, 0, r]} castShadow>
								<cylinderGeometry args={[0.02, 0.035, 0.7, 8]} />
								<Clay color="#5E9B4C" />
							</mesh>
						))}
					</group>
				))}
				<Rabbit position={[1.8 - rabbitIn * 1.35 + flee * 2.6, 0, 0.35]} hop={o < 33.2 ? rabbitIn * 3 : flee * 4} facing={flee > 0.05 ? 0 : Math.PI} />
				{puff > 0 && puff < 1
					? Array.from({length: 10}).map((_, i) => {
							const a = (i / 10) * Math.PI * 2;
							return (
								<mesh key={i} position={[0.2 + Math.cos(a) * puff * 0.7, 0.5 + Math.sin(a) * puff * 0.5 + puff * 0.3, 0.3]} scale={0.5 + puff}>
									<sphereGeometry args={[0.1, 12, 10]} />
									<meshStandardMaterial color="#FFF4C2" emissive="#FFE680" emissiveIntensity={0.5} transparent opacity={(1 - puff) * 0.7} />
								</mesh>
							);
						})
					: null}
				{o >= 33.6 ? <Shield position={[0, 0.35, 0.7]} s={pop(33.6) * 0.8} /> : null}
				{o >= 33.6 ? <Label text="KİMYASAL KALKAN" position={[0.2, 1.05, 0.9]} height={0.11} bg="#2FB8A6" opacity={pop(33.6)} /> : null}
			</group>

			<EffectComposer multisampling={0}>
				<DepthOfField target={look} focalLength={0.035} bokehScale={2} />
				<Bloom intensity={0.6} luminanceThreshold={0.8} mipmapBlur />
				<Vignette offset={0.25} darkness={0.55} />
			</EffectComposer>
		</>
	);
};
