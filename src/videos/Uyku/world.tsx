import {RoundedBox} from '@react-three/drei';
import {Bloom, DepthOfField, EffectComposer, Vignette} from '@react-three/postprocessing';
import {useMemo} from 'react';
import {Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {add, CameraRig, Clay, Label, mix, popAt, ramp, Shot, shotAt, V3} from '../../components/three';
import {VO_RATE} from './script';

// Tüm zamanlar ORİJİNAL kayıt saniyesidir (o).
const spike = (o: number, at: number, len = 0.35) => (o < at || o > at + len ? 0 : Math.sin(((o - at) / len) * Math.PI));

// ---------- Uyuyan figür ----------
type Pose = {jerk?: number; sitUp?: number; tense?: number; breathe?: number; skin?: string; blanket?: string};
const Sleeper: React.FC<Pose> = ({jerk = 0, sitUp = 0, tense = 0, breathe = 0, skin = '#E8C9A8', blanket = '#4D6FB8'}) => (
	<group position={[0, jerk * 0.12, 0]}>
		<group position={[0.05, 0.72, 0]} rotation={[0, 0, -sitUp * 1.15 - jerk * 0.25]}>
			<group position={[-0.05, -0.72, 0]}>
				<mesh position={[-0.78, 0.82, 0]} castShadow>
					<sphereGeometry args={[0.2, 40, 40]} />
					<Clay color={skin} />
				</mesh>
				<mesh position={[-0.28, 0.74, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 1 + breathe * 0.08]} castShadow>
					<capsuleGeometry args={[0.24, 0.45, 10, 24]} />
					<Clay color="#7FA7D9" emissive="#FF8A3D" glow={tense * 0.9} />
				</mesh>
				{[-0.3, 0.3].map((z) => (
					<mesh key={z} position={[-0.15, 0.86 + jerk * 0.1, z]} rotation={[z * jerk * 2, 0, Math.PI / 2 + jerk * 0.6]} castShadow>
						<capsuleGeometry args={[0.07, 0.42, 8, 16]} />
						<Clay color={skin} emissive="#FF8A3D" glow={tense * 0.9} />
					</mesh>
				))}
			</group>
		</group>
		<RoundedBox args={[1.3, 0.2 + jerk * 0.06, 1.12]} radius={0.08} position={[0.3, 0.72, 0]} castShadow receiveShadow>
			<Clay color={blanket} />
		</RoundedBox>
	</group>
);

const Bed: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<group>
		<RoundedBox args={[2.25, 0.32, 1.32]} radius={0.05} position={[0, 0.26, 0]} castShadow receiveShadow>
			<Clay color="#8A6142" />
		</RoundedBox>
		<RoundedBox args={[0.12, 0.9, 1.32]} radius={0.04} position={[-1.1, 0.55, 0]} castShadow>
			<Clay color="#7A5236" />
		</RoundedBox>
		<RoundedBox args={[2.1, 0.22, 1.2]} radius={0.06} position={[0, 0.52, 0]} receiveShadow>
			<Clay color="#EEF1F7" />
		</RoundedBox>
		<RoundedBox args={[0.45, 0.12, 0.72]} radius={0.05} position={[-0.8, 0.67, 0]} receiveShadow>
			<Clay color="#FFFFFF" />
		</RoundedBox>
		{children}
	</group>
);

const Room: React.FC<{lamp: number}> = ({lamp}) => (
	<group>
		<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
			<planeGeometry args={[14, 14]} />
			<Clay color="#2A3350" />
		</mesh>
		<mesh position={[0, 2.5, -1.4]} receiveShadow>
			<planeGeometry args={[14, 5]} />
			<Clay color="#39456A" />
		</mesh>
		<mesh position={[0.7, 1.9, -1.38]}>
			<planeGeometry args={[1.0, 1.2]} />
			<meshStandardMaterial color="#0E1426" emissive="#9FC4FF" emissiveIntensity={0.9} />
		</mesh>
		<mesh position={[0.7, 1.9, -1.37]}>
			<boxGeometry args={[0.05, 1.2, 0.02]} />
			<Clay color="#2A3350" />
		</mesh>
		<RoundedBox args={[0.5, 0.55, 0.45]} radius={0.04} position={[-1.55, 0.28, -0.4]} castShadow>
			<Clay color="#7A5236" />
		</RoundedBox>
		<mesh position={[-1.55, 0.72, -0.4]}>
			<cylinderGeometry args={[0.04, 0.06, 0.32, 12]} />
			<Clay color="#C9CDD3" />
		</mesh>
		<mesh position={[-1.55, 0.95, -0.4]}>
			<coneGeometry args={[0.18, 0.2, 24, 1, true]} />
			<meshStandardMaterial color="#FFE2B0" emissive="#FFB867" emissiveIntensity={0.6 + lamp} side={THREE.DoubleSide} />
		</mesh>
		<pointLight position={[-1.55, 0.9, -0.3]} color="#FFB867" intensity={0.8 + lamp * 2.5} distance={3.5} />
	</group>
);

const Person: React.FC<{position: V3; color: string; glow?: number}> = ({position, color, glow = 0}) => (
	<group position={position}>
		<mesh position={[0, 1.4, 0]} castShadow>
			<sphereGeometry args={[0.18, 32, 32]} />
			<Clay color="#E8C9A8" emissive="#FF9F1C" glow={glow * 0.4} />
		</mesh>
		<mesh position={[0, 0.75, 0]} castShadow>
			<capsuleGeometry args={[0.24, 0.65, 10, 24]} />
			<Clay color={color} emissive="#FF9F1C" glow={glow * 1.4} />
		</mesh>
	</group>
);

const Heart: React.FC<{position: V3; s: number}> = ({position, s}) => (
	<group position={position} scale={s}>
		{[-0.07, 0.07].map((x) => (
			<mesh key={x} position={[x, 0.04, 0]}>
				<sphereGeometry args={[0.09, 24, 24]} />
				<Clay color="#E23D4B" emissive="#FF2D45" glow={0.9} />
			</mesh>
		))}
		<mesh position={[0, -0.07, 0]} rotation={[Math.PI, 0, 0]}>
			<coneGeometry args={[0.155, 0.2, 24]} />
			<Clay color="#E23D4B" emissive="#FF2D45" glow={0.9} />
		</mesh>
	</group>
);

const Shield: React.FC<{position: V3; s: number}> = ({position, s}) => (
	<group position={position} scale={s}>
		<mesh scale={[1, 1.2, 0.35]}>
			<sphereGeometry args={[0.28, 6, 2, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
			<Clay color="#2FB8A6" emissive="#4FE3CF" glow={1.1} rough={0.4} />
		</mesh>
		<pointLight color="#4FE3CF" intensity={1.5} distance={2.5} />
	</group>
);

// ---------- Mekânlar ----------
const G: V3 = [40, 0, 0]; // yataklar şehri
const F: V3 = [80, 0, 0]; // %70 figürleri
const BR: V3 = [120, 0, 0]; // beyin
const FO: V3 = [160, 0, 0]; // gece ormanı
const TR: V3 = [200, 0, 0]; // tetikleyiciler

const HEAD: V3 = [-0.78, 0.85, 0];
const SIGNAL: V3[] = [HEAD, [-0.3, 0.8, 0], [0.3, 0.82, 0], [0.9, 0.8, 0]];
const signalAt = (p: number): V3 => {
	const seg = Math.min(SIGNAL.length - 2, Math.floor(p * (SIGNAL.length - 1)));
	const local = p * (SIGNAL.length - 1) - seg;
	return mix(SIGNAL[seg], SIGNAL[seg + 1], local);
};

type S = Shot & {follow?: 'fall'};
const SHOTS: S[] = [
	{a: -1, b: 2.5, from: [2.3, 2.1, 3.3], to: [1.5, 1.6, 2.4], look: [-0.3, 0.75, 0], fov: 40},
	{a: 2.5, b: 4.2, from: [0, 0, 0], to: [0, 0, 0], look: [0, 0, 0], follow: 'fall', fov: 45},
	{a: 4.2, b: 4.79, from: [0.9, 1.45, 1.6], to: [0.8, 1.4, 1.45], look: [-0.7, 0.85, 0], fov: 40},
	{a: 4.79, b: 8.05, from: add(G, [0, 10, 6.5]), to: add(G, [0, 8.6, 5.4]), look: add(G, [0, 0, -0.4]), fov: 48, fog: 30},
	{a: 8.05, b: 13.07, from: add(F, [0, 2.3, 9.4]), to: add(F, [0, 2.1, 8.4]), look: add(F, [0, 1.25, 0]), fov: 46, fog: 24},
	{a: 13.07, b: 19.2, from: [0.6, 1.7, 2.1], to: [0.35, 1.5, 1.7], look: [-0.35, 0.95, 0], fov: 40},
	{a: 19.2, b: 23.59, from: add(BR, [1.3, 2.3, 4.6]), to: add(BR, [0.9, 2.1, 3.9]), look: add(BR, [0, 1.75, 0]), fov: 42, fog: 18},
	{a: 23.59, b: 29.58, from: [0.7, 2.8, 2.4], to: [0.5, 2.4, 2.1], look: [0, 0.8, 0], fov: 44},
	{a: 29.58, b: 36.25, from: add(FO, [1.6, 2.8, 3.3]), to: add(FO, [1.2, 2.55, 2.7]), look: add(FO, [0.35, 2.05, -0.5]), fov: 44, fog: 22},
	{a: 36.25, b: 39.85, from: add(TR, [0, 1.9, 5.0]), to: add(TR, [0, 1.75, 4.4]), look: add(TR, [0, 0.95, 0]), fov: 46, fog: 22},
	{a: 39.85, b: 99, from: [1.9, 1.9, 2.7], to: [1.35, 1.55, 2.05], look: [-0.5, 0.95, 0], fov: 40},
];

export const UykuWorld: React.FC<{atFrame?: number}> = ({atFrame}) => {
	const current = useCurrentFrame();
	const {fps} = useVideoConfig();
	const frame = atFrame ?? current;
	const o = (frame / fps) * VO_RATE;
	const pop = (at: number, damping = 12) => popAt(o, at, fps, VO_RATE, damping);
	const shot = shotAt(SHOTS, o);
	const sp = ramp(o, shot.a, shot.b, Easing.inOut(Easing.sin));

	// Düşüş ve irkilme
	const falling = o >= 2.5 && o < 4.2;
	const fallP = ramp(o, 2.5, 4.15, Easing.in(Easing.quad));
	const bedY = falling ? -fallP * 7 : 0;
	const jolt1 = spike(o, 4.2, 0.4);
	// Alarm sinyali, kasılma, uyanma
	const signal = ramp(o, 23.65, 25.3, Easing.inOut(Easing.quad));
	const jerk2 = spike(o, 25.67, 0.45);
	const sitUp = ramp(o, 27.37, 27.75, Easing.out(Easing.back(1.6))) * (1 - ramp(o, 29.0, 29.5));
	const shake = jolt1 + spike(o, 27.37, 0.6) + spike(o, 25.67, 0.4) * 0.5;
	// Gevşeme, kalp, nefes
	const tense = o < 13.07 ? 1 : 1 - ramp(o, 13.07, 15.8);
	const heartRate = o < 16.09 ? 1.5 : 1.5 - ramp(o, 16.09, 17.0) * 0.65;
	const beat = Math.pow(Math.max(0, Math.sin(2 * Math.PI * heartRate * o)), 8);
	const breathRate = o < 17.57 ? 0.38 : 0.18;
	const breathe = Math.sin(2 * Math.PI * breathRate * o);
	const lamp = ramp(o, 39.85, 40.6);

	let camPos: V3;
	let look: V3;
	if (shot.follow === 'fall') {
		camPos = [1.9, bedY + 1.4, 2.5];
		look = [-0.3, bedY + 0.6, 0];
	} else {
		camPos = mix(shot.from, shot.to, sp);
		look = shot.look2 ? mix(shot.look, shot.look2, sp) : shot.look;
	}
	if (shake > 0) {
		camPos = add(camPos, [Math.sin(o * 90) * 0.05 * shake, Math.cos(o * 77) * 0.05 * shake, 0]);
	}

	const bg = new THREE.Color(falling ? '#05070F' : o >= 29.58 && o < 36.25 ? '#0E1A22' : '#10172A');
	const fogFar = shot.fog ?? 14;
	const lightTarget = useMemo(() => new THREE.Object3D(), []);
	lightTarget.position.set(...look);
	lightTarget.updateMatrixWorld();

	// %70: 10 figürden 7'si sırayla yanar
	const lit = [0, 2, 3, 5, 6, 8, 9];
	const streaks = useMemo(
		() => Array.from({length: 40}).map((_, i) => [Math.sin(i * 12.9) * 2.6, -1 - ((i * 0.37) % 9), Math.cos(i * 7.3) * 2.2] as V3),
		[],
	);

	return (
		<>
			<color attach="background" args={[bg]} />
			<fog attach="fog" args={[bg, fogFar * 0.4, fogFar]} />
			<CameraRig pos={camPos} look={look} fov={shot.fov ?? 40} />
			<hemisphereLight args={['#6A80C0', '#141826', 0.6]} />
			<primitive object={lightTarget} />
			<directionalLight position={add(look, [2, 5, 3])} target={lightTarget} intensity={1.7} color="#C8D8FF" castShadow shadow-mapSize={[2048, 2048]} shadow-radius={6} shadow-bias={-0.0004}>
				<orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 0.1, 30]} />
			</directionalLight>

			{/* ---- Yatak odası ---- */}
			<group visible={!falling}>
				<Room lamp={lamp} />
			</group>
			<group position={[0, bedY, 0]}>
				<Bed>
					<Sleeper
						jerk={jolt1 + jerk2}
						sitUp={sitUp}
						tense={o >= 13.07 && o < 19.2 ? tense : 0}
						breathe={o >= 13.07 && o < 19.2 ? breathe : breathe * 0.5}
					/>
				</Bed>
			</group>
			{falling
				? streaks.map((p, i) => (
						<mesh key={i} position={p}>
							<boxGeometry args={[0.02, 0.6, 0.02]} />
							<meshBasicMaterial color="#9FC4FF" transparent opacity={0.5} toneMapped={false} />
						</mesh>
					))
				: null}
			{o >= 13.07 && o < 19.2 ? <Heart position={[-0.3, 1.32, 0.25]} s={0.9 + beat * 0.25} /> : null}
			{o >= 23.6 && o < 25.5 ? (
				<group position={signalAt(signal)}>
					<mesh>
						<sphereGeometry args={[0.07, 20, 20]} />
						<meshBasicMaterial color="#FF3B30" toneMapped={false} />
					</mesh>
					<pointLight color="#FF3B30" intensity={2} distance={1.2} />
				</group>
			) : null}
			{o >= 23.6 && o < 27.4 ? <Label text="ALARM!" position={[0.25, 1.35, 0.4]} height={0.15} bg="#D9363E" opacity={pop(23.7)} /> : null}
			{o >= 39.85 ? (
				<>
					<Shield position={[-0.78, 1.5, 0]} s={pop(41.96, 10)} />
					<Label text="Z z z" position={[-0.3, 1.25 + Math.sin(o * 2) * 0.05, 0.2]} height={0.16} bg="rgba(0,0,0,0)" fg="#CFE0FF" opacity={ramp(o, 40.0, 40.6)} />
				</>
			) : null}

			{/* ---- Yataklar şehri: "Yalnız değilsin" ---- */}
			<group position={G}>
				<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
					<planeGeometry args={[30, 30]} />
					<Clay color="#1C2440" />
				</mesh>
				{Array.from({length: 20}).map((_, i) => {
					const x = ((i % 4) - 1.5) * 1.6;
					const z = (Math.floor(i / 4) - 2) * 1.05;
					return (
						<group key={i} position={[x, 0, z]} scale={0.55}>
							<Bed>
								<Sleeper jerk={spike(o, 4.9 + ((i * 0.37) % 2.8), 0.35)} blanket={['#4D6FB8', '#B85C4D', '#5E8C76', '#C9A24D'][i % 4]} />
							</Bed>
						</group>
					);
				})}
			</group>

			{/* ---- %70 figürleri ---- */}
			<group position={F}>
				<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
					<planeGeometry args={[30, 30]} />
					<Clay color="#1C2440" />
				</mesh>
				{Array.from({length: 10}).map((_, i) => {
					const k = lit.indexOf(i);
					const glow = k >= 0 ? pop(10.4 + k * 0.28) : 0;
					return <Person key={i} position={[((i % 5) - 2) * 0.72, 0, i < 5 ? -0.5 : 0.4]} color={glow > 0.5 ? '#E8732A' : '#5C6A8C'} glow={glow} />;
				})}
				<Label text="HİPNİK SIÇRAMA" position={[0, 2.35, 0.2]} height={0.42} bg="#E8732A" opacity={pop(8.4)} />
				{o > 10.9 ? <Label text="%70" position={[0, 1.95, 0.9]} height={0.4} bg="#2ECC71" fg="#0B1020" opacity={pop(10.9)} /> : null}
			</group>

			{/* ---- Beyin ---- */}
			<group position={BR}>
				<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
					<planeGeometry args={[30, 30]} />
					<Clay color="#141B30" />
				</mesh>
				<group position={[0, 1.6, 0]}>
					<mesh>
						<sphereGeometry args={[1.0, 48, 48]} />
						<meshStandardMaterial color="#9FC4FF" transparent opacity={0.12} roughness={0.2} />
					</mesh>
					{[-0.23, 0.23].map((x) => {
						const alarm = o >= 22.52 && o < 23.6 ? 0.5 + 0.5 * Math.sin(o * 22) : 0;
						return (
							<mesh key={x} position={[x, 0.1, 0]} scale={[0.42, 0.42, 0.58]}>
								<icosahedronGeometry args={[1, 3]} />
								<Clay color="#F2A5B5" flat rough={0.6} emissive="#FF2D45" glow={alarm * 1.5} />
							</mesh>
						);
					})}
					{Array.from({length: 16}).map((_, i) => {
						const a = o * (1.2 + (i % 4) * 0.4) + i;
						const r = 0.35 + (i % 3) * 0.1;
						const red = o >= 21.6;
						return (
							<mesh key={i} position={[Math.cos(a) * r, 0.1 + Math.sin(a * 1.3) * 0.3, Math.sin(a) * r * 1.2]}>
								<sphereGeometry args={[0.03, 10, 10]} />
								<meshBasicMaterial color={red ? '#FF3B30' : '#7FE7FF'} toneMapped={false} />
							</mesh>
						);
					})}
					<pointLight color={o >= 22.52 ? '#FF3B30' : '#7FE7FF'} intensity={1.5} distance={3} />
				</group>
				<mesh position={[0, 0.35, 0]}>
					<cylinderGeometry args={[0.12, 0.16, 0.7, 16]} />
					<Clay color="#E8C9A8" opacity={0.5} />
				</mesh>
			</group>

			{/* ---- Gece ormanı ---- */}
			<group position={FO}>
				<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
					<planeGeometry args={[40, 40]} />
					<Clay color="#16302A" />
				</mesh>
				<mesh position={[-0.9, 2.0, -0.5]} castShadow>
					<cylinderGeometry args={[0.3, 0.42, 4, 20]} />
					<Clay color="#5A3E2B" />
				</mesh>
				<mesh position={[0.35, 2.2, -0.5]} rotation={[0, 0, Math.PI / 2]} castShadow>
					<cylinderGeometry args={[0.1, 0.14, 2.5, 16]} />
					<Clay color="#5A3E2B" />
				</mesh>
				{[[-0.9, 4.0, -0.6, 1.2], [0.2, 3.6, -0.9, 0.9], [-1.8, 3.4, -0.4, 0.8], [1.2, 3.2, -1.2, 0.8]].map(([x, y, z, r], i) => (
					<mesh key={i} position={[x, y, z]} castShadow>
						<sphereGeometry args={[r, 24, 24]} />
						<Clay color="#1F4A3A" />
					</mesh>
				))}
				<mesh position={[3, 5.5, -7]}>
					<sphereGeometry args={[0.6, 32, 32]} />
					<meshBasicMaterial color="#F4F1DE" toneMapped={false} />
				</mesh>
				{Array.from({length: 12}).map((_, i) => (
					<mesh key={i} position={[Math.sin(i * 3.1 + o) * 2.5, 0.6 + ((i * 0.7 + o * 0.3) % 2.5), Math.cos(i * 1.7) * 1.8]}>
						<sphereGeometry args={[0.025, 8, 8]} />
						<meshBasicMaterial color="#E9FF8A" toneMapped={false} />
					</mesh>
				))}
				<pointLight position={[1.2, 3.2, 1.2]} color="#CFE0FF" intensity={3} distance={6} />
				<Ancestor slip={ramp(o, 34.08, 34.7, Easing.in(Easing.quad))} grab={ramp(o, 35.1, 35.4, Easing.out(Easing.back(1.5)))} />
			</group>

			{/* ---- Tetikleyiciler ---- */}
			<group position={TR}>
				<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
					<planeGeometry args={[30, 30]} />
					<Clay color="#1C2440" />
				</mesh>
				{[-0.8, 0, 0.8].map((x) => (
					<RoundedBox key={x} args={[0.7, 0.5, 0.7]} radius={0.05} position={[x, 0.25, 0]} castShadow receiveShadow>
						<Clay color="#39456A" />
					</RoundedBox>
				))}
				<group position={[-0.8, 0.5, 0]} scale={pop(36.25) * 0.85}>
					<mesh position={[0, 0.2, 0]} castShadow>
						<cylinderGeometry args={[0.2, 0.16, 0.4, 32]} />
						<Clay color="#FFFFFF" />
					</mesh>
					<mesh position={[0, 0.395, 0]} rotation={[-Math.PI / 2, 0, 0]}>
						<circleGeometry args={[0.18, 32]} />
						<Clay color="#5A3420" />
					</mesh>
					<mesh position={[0.22, 0.22, 0]}>
						<torusGeometry args={[0.08, 0.025, 10, 20]} />
						<Clay color="#FFFFFF" />
					</mesh>
					{[0, 1, 2].map((k) => {
						const p = (o * 0.6 + k / 3) % 1;
						return (
							<mesh key={k} position={[Math.sin(p * 6 + k) * 0.05, 0.5 + p * 0.5, 0]} scale={0.6 + p}>
								<sphereGeometry args={[0.05, 12, 12]} />
								<meshStandardMaterial color="#FFFFFF" transparent opacity={(1 - p) * 0.5} />
							</mesh>
						);
					})}
					<Label text="KAFEİN" position={[0, -0.25, 0.43]} height={0.13} bg="#8A5A3A" />
				</group>
				<group position={[0, 0.5, 0]} scale={pop(36.9) * 0.85} rotation={[0, 0, Math.sin(o * 50) * 0.08 * spike(o, 37.0, 1.0)]}>
					<mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
						<cylinderGeometry args={[0.26, 0.26, 0.14, 32]} />
						<Clay color="#D9363E" />
					</mesh>
					<mesh position={[0, 0.3, 0.075]}>
						<circleGeometry args={[0.2, 32]} />
						<Clay color="#FFFDF8" />
					</mesh>
					{[-0.15, 0.15].map((x) => (
						<mesh key={x} position={[x, 0.58, 0]}>
							<sphereGeometry args={[0.08, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
							<Clay color="#E8C15A" metal={0.6} />
						</mesh>
					))}
					<Label text="STRES" position={[0, -0.25, 0.43]} height={0.13} bg="#D9363E" />
				</group>
				<group position={[0.8, 0.5, 0]} scale={pop(37.5) * 0.85}>
					<mesh position={[0, 0.25, 0]} castShadow>
						<cylinderGeometry args={[0.13, 0.13, 0.5, 24]} />
						<Clay color="#2B2F36" opacity={0.85} />
					</mesh>
					<mesh position={[0, 0.07, 0]}>
						<cylinderGeometry args={[0.135, 0.135, 0.1, 24]} />
						<Clay color="#FF3B30" emissive="#FF3B30" glow={0.6 + 0.6 * Math.sin(o * 10)} />
					</mesh>
					<mesh position={[0, 0.53, 0]}>
						<cylinderGeometry args={[0.05, 0.05, 0.05, 16]} />
						<Clay color="#C9CDD3" metal={0.8} />
					</mesh>
					<Label text="YORGUNLUK" position={[0, -0.25, 0.43]} height={0.11} bg="#5C6A8C" />
				</group>
				{[-0.8, 0, 0.8].map((x, i) => (
					<mesh key={x} position={[x + 0.3, 1.0, 0.2]} scale={pop(38.0 + i * 0.15)}>
						<coneGeometry args={[0.08, 0.2, 16]} />
						<Clay color="#FF3B30" emissive="#FF3B30" glow={0.8} />
					</mesh>
				))}
			</group>

			<EffectComposer multisampling={0}>
				<DepthOfField target={look} focalLength={0.035} bokehScale={2.2} />
				<Bloom intensity={0.8} luminanceThreshold={0.75} mipmapBlur />
				<Vignette offset={0.25} darkness={0.6} />
			</EffectComposer>
		</>
	);
};

// Dalda uyuyan ata: kayar ve bir koluyla dala tutunur.
const Ancestor: React.FC<{slip: number; grab: number}> = ({slip, grab}) => {
	const fur = '#7A5A3E';
	return (
		<group position={[0.45, 2.3, -0.5]}>
			<group position={[0, 0.2 - slip * 0.75, slip * 0.18]} rotation={[0, 0, (Math.PI / 2) * (1 - slip)]}>
				<mesh castShadow>
					<capsuleGeometry args={[0.18, 0.4, 10, 20]} />
					<Clay color={fur} />
				</mesh>
				<mesh position={[0, 0.42, 0]} castShadow>
					<sphereGeometry args={[0.16, 28, 28]} />
					<Clay color="#9A7556" />
				</mesh>
			</group>
			<mesh position={[0.05, 0.05 - (1 - grab) * 0.3, 0.12]} rotation={[0, 0, (1 - grab) * 1.2]} scale={[1, 0.6 + grab * 0.6, 1]} castShadow visible={slip > 0.3}>
				<capsuleGeometry args={[0.05, 0.4, 8, 12]} />
				<Clay color={fur} />
			</mesh>
		</group>
	);
};
