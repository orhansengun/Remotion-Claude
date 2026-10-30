import {RoundedBox} from '@react-three/drei';
import {useThree} from '@react-three/fiber';
import {Bloom, DepthOfField, EffectComposer, Vignette} from '@react-three/postprocessing';
import {useMemo} from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {VO_RATE} from './script';

// Bu dosyadaki tüm zamanlar ORİJİNAL kayıt saniyesidir (o). Videodaki saniye = o / VO_RATE.
type V3 = [number, number, number];

const useO = (atFrame?: number) => {
	const current = useCurrentFrame();
	const frame = atFrame ?? current;
	const {fps} = useVideoConfig();
	return {o: (frame / fps) * VO_RATE, frame, fps};
};

const ramp = (o: number, a: number, b: number, ease = Easing.inOut(Easing.cubic)) =>
	interpolate(o, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

const pop = (o: number, at: number, fps: number, damping = 12) =>
	spring({frame: ((o - at) / VO_RATE) * fps, fps, config: {damping}});

const mix = (a: V3, b: V3, p: number): V3 => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

const Clay: React.FC<{color: string; rough?: number; opacity?: number; emissive?: string; glow?: number; metal?: number}> = ({
	color,
	rough = 0.8,
	opacity = 1,
	emissive = '#000000',
	glow = 0,
	metal = 0,
}) => (
	<meshStandardMaterial
		color={color}
		roughness={rough}
		metalness={metal}
		transparent={opacity < 1}
		opacity={opacity}
		emissive={emissive}
		emissiveIntensity={glow}
	/>
);

// Tuval üzerine yazılmış yazı dokusu: 3D sahnede okunur etiketler (font indirmeden).
const Label: React.FC<{text: string; position: V3; height?: number; bg?: string; fg?: string; rotation?: V3; opacity?: number}> = ({
	text,
	position,
	height = 0.3,
	bg = '#1E3A2F',
	fg = '#FFFDF8',
	rotation = [0, 0, 0],
	opacity = 1,
}) => {
	const {texture, aspect} = useMemo(() => {
		const size = 96;
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d')!;
		const font = `900 ${size}px 'Inter Display', Inter, sans-serif`;
		ctx.font = font;
		const w = Math.ceil(ctx.measureText(text).width) + size;
		canvas.width = w;
		canvas.height = Math.round(size * 1.6);
		ctx.font = font;
		ctx.fillStyle = bg;
		const r = canvas.height / 2;
		ctx.beginPath();
		ctx.roundRect(0, 0, w, canvas.height, r);
		ctx.fill();
		ctx.fillStyle = fg;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(text, w / 2, canvas.height / 2 + size * 0.05);
		const tex = new THREE.CanvasTexture(canvas);
		tex.colorSpace = THREE.SRGBColorSpace;
		tex.anisotropy = 8;
		return {texture: tex, aspect: w / canvas.height};
	}, [text, bg, fg]);
	return (
		<mesh position={position} rotation={rotation}>
			<planeGeometry args={[height * aspect, height]} />
			<meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} depthWrite={false} />
		</mesh>
	);
};

// ---------- Nesneler ----------
const SCREEN_LOCAL: V3 = [0, 0.065, -0.38];
const POS_ROT: V3 = [0.32, 0, 0];

const Terminal: React.FC<{green: number; glow: number}> = ({green, glow}) => {
	const screen = new THREE.Color('#2F7BFF').lerp(new THREE.Color('#2ECC71'), green);
	return (
		<group position={[0, 0.12, 0]} rotation={POS_ROT}>
			<RoundedBox args={[0.9, 0.12, 1.6]} radius={0.06} smoothness={6} castShadow receiveShadow>
				<Clay color="#2B2F36" rough={0.55} />
			</RoundedBox>
			<mesh position={SCREEN_LOCAL} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[0.72, 0.62]} />
				<meshStandardMaterial color="#0E1A2B" emissive={screen} emissiveIntensity={0.35 + glow} />
			</mesh>
			{/* Onay işareti */}
			<group position={[0, 0.075, -0.38]} rotation={[-Math.PI / 2, 0, 0]} scale={green}>
				<mesh position={[-0.08, -0.04, 0]} rotation={[0, 0, Math.PI / 4]}>
					<planeGeometry args={[0.05, 0.16]} />
					<meshBasicMaterial color="#FFFFFF" toneMapped={false} />
				</mesh>
				<mesh position={[0.05, 0.04, 0]} rotation={[0, 0, -Math.PI / 6]}>
					<planeGeometry args={[0.05, 0.32]} />
					<meshBasicMaterial color="#FFFFFF" toneMapped={false} />
				</mesh>
			</group>
			{Array.from({length: 12}).map((_, i) => (
				<RoundedBox key={i} args={[0.17, 0.05, 0.11]} radius={0.02} position={[-0.22 + (i % 3) * 0.22, 0.08, 0.15 + Math.floor(i / 3) * 0.15]} castShadow>
					<Clay color={i === 11 ? '#3FAE6A' : i === 9 ? '#D9534F' : '#E9E6DF'} rough={0.6} />
				</RoundedBox>
			))}
		</group>
	);
};

const Card: React.FC<{opacity: number; coil: number; chip: number; number: number; strike: number}> = ({opacity, coil, chip, number, strike}) => (
	<group>
		<RoundedBox args={[0.86, 0.02, 0.54]} radius={0.01} castShadow>
			<Clay color="#E4572E" rough={0.45} opacity={opacity} />
		</RoundedBox>
		{/* Anten bobini: x-ray'de görünür, alanla parlar */}
		{[0.36, 0.32, 0.28].map((s, i) => (
			<group key={i} position={[0.05, 0, 0]} scale={[s / 0.36, 1, s / 0.36]}>
				{[
					[0, 0, -0.2, 0.7, 0.012],
					[0, 0, 0.2, 0.7, 0.012],
					[-0.35, 0, 0, 0.012, 0.4],
					[0.35, 0, 0, 0.012, 0.4],
				].map(([x, y, z, w, d], k) => (
					<mesh key={k} position={[x, y, z]}>
						<boxGeometry args={[w, 0.006, d]} />
						<Clay color="#C98A3A" emissive="#FFB547" glow={coil * 2.5} opacity={1 - opacity * 0.85} metal={0.6} />
					</mesh>
				))}
			</group>
		))}
		<mesh position={[-0.24, 0.013, -0.04]} rotation={[-Math.PI / 2, 0, 0]}>
			<planeGeometry args={[0.15, 0.12]} />
			<meshStandardMaterial color="#E8C15A" metalness={0.8} roughness={0.3} emissive="#FFD27A" emissiveIntensity={chip * 3} />
		</mesh>
		{number > 0 ? (
			<group position={[0.02, 0.013, 0.14]} rotation={[-Math.PI / 2, 0, 0]}>
				<Label text="4242 4242 4242 4242" position={[0, 0, 0]} height={0.07} bg="rgba(0,0,0,0)" fg="#FFFDF8" opacity={number} />
				<mesh position={[0, 0, 0.001]} scale={[strike, 1, 1]}>
					<planeGeometry args={[0.62, 0.014]} />
					<meshBasicMaterial color="#FF3B30" toneMapped={false} transparent opacity={number} />
				</mesh>
			</group>
		) : null}
	</group>
);

const Packet: React.FC<{position: V3; color?: string; scale?: number; code?: string; lock?: number}> = ({position, color = '#4FD1FF', scale = 1, code, lock = 0}) => (
	<group position={position} scale={scale}>
		<RoundedBox args={[0.2, 0.2, 0.2]} radius={0.04} castShadow>
			<Clay color={color} emissive={color} glow={1.6} rough={0.3} />
		</RoundedBox>
		<pointLight color={color} intensity={0.6} distance={1.2} />
		{code ? <Label text={code} position={[0, 0.24, 0]} height={0.11} bg="rgba(14,26,43,0.85)" fg="#9FE8FF" /> : null}
		{lock > 0 ? (
			<group position={[0.17, -0.02, 0.12]} scale={lock * 0.7}>
				<mesh position={[0, 0.07, 0]}>
					<torusGeometry args={[0.05, 0.014, 12, 24, Math.PI]} />
					<Clay color="#C9CDD3" metal={0.9} rough={0.25} />
				</mesh>
				<RoundedBox args={[0.14, 0.11, 0.05]} radius={0.015}>
					<Clay color="#E8C15A" metal={0.7} rough={0.3} />
				</RoundedBox>
			</group>
		) : null}
	</group>
);

const Person: React.FC<{position: V3; color: string}> = ({position, color}) => (
	<group position={position}>
		<mesh position={[0, 1.55, 0]} castShadow>
			<sphereGeometry args={[0.22, 48, 48]} />
			<Clay color="#E8C9A8" />
		</mesh>
		<mesh position={[0, 0.85, 0]} castShadow>
			<capsuleGeometry args={[0.3, 0.75, 12, 32]} />
			<Clay color={color} />
		</mesh>
	</group>
);

const Bank: React.FC<{position: V3; roof: string; pulse: number}> = ({position, roof, pulse}) => (
	<group position={position} scale={1 + pulse * 0.08}>
		<RoundedBox args={[1.9, 0.25, 1.5]} radius={0.04} position={[0, 0.12, 0]} castShadow receiveShadow>
			<Clay color="#ECE6DA" />
		</RoundedBox>
		<RoundedBox args={[1.5, 1.0, 1.1]} radius={0.04} position={[0, 0.75, -0.1]} castShadow>
			<Clay color="#F4EFE6" />
		</RoundedBox>
		{[-0.55, -0.18, 0.18, 0.55].map((x) => (
			<mesh key={x} position={[x, 0.75, 0.55]} castShadow>
				<cylinderGeometry args={[0.07, 0.07, 1.0, 20]} />
				<Clay color="#FFFFFF" />
			</mesh>
		))}
		<mesh position={[0, 1.5, 0.05]} rotation={[0, Math.PI / 4, 0]} castShadow>
			<coneGeometry args={[1.25, 0.5, 4]} />
			<Clay color={roof} />
		</mesh>
	</group>
);

const Tree: React.FC<{position: V3; s?: number}> = ({position, s = 1}) => (
	<group position={position} scale={s}>
		<mesh position={[0, 0.25, 0]} castShadow>
			<cylinderGeometry args={[0.05, 0.07, 0.5, 10]} />
			<Clay color="#8A6142" />
		</mesh>
		<mesh position={[0, 0.75, 0]} castShadow>
			<sphereGeometry args={[0.32, 24, 24]} />
			<Clay color="#5E8C76" />
		</mesh>
	</group>
);

const Check: React.FC<{position: V3; s: number}> = ({position, s}) => (
	<group position={position} scale={s}>
		<mesh position={[-0.08, -0.04, 0]} rotation={[0, 0, Math.PI / 4]}>
			<boxGeometry args={[0.07, 0.2, 0.07]} />
			<Clay color="#2ECC71" emissive="#2ECC71" glow={0.8} />
		</mesh>
		<mesh position={[0.08, 0.05, 0]} rotation={[0, 0, -Math.PI / 6]}>
			<boxGeometry args={[0.07, 0.36, 0.07]} />
			<Clay color="#2ECC71" emissive="#2ECC71" glow={0.8} />
		</mesh>
	</group>
);

const Padlock: React.FC<{position: V3; s: number}> = ({position, s}) => (
	<group position={position} scale={s}>
		<mesh position={[0, 0.32, 0]}>
			<torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
			<Clay color="#C9CDD3" metal={0.9} rough={0.25} />
		</mesh>
		<RoundedBox args={[0.56, 0.44, 0.18]} radius={0.05} castShadow>
			<Clay color="#E8C15A" metal={0.6} rough={0.35} />
		</RoundedBox>
		<mesh position={[0, 0, 0.095]}>
			<circleGeometry args={[0.05, 20]} />
			<Clay color="#2B2F36" />
		</mesh>
	</group>
);

// ---------- Yerleşim ----------
const H: V3 = [0, 1.05, -0.3];
const CARD_START: V3 = [1.3, 1.25, 0.8];
const CARD_TAP: V3 = [0.32, 0.78, -0.2];
const chipWorld = (): V3 => {
	const v = new THREE.Vector3(-0.24, 0.02, -0.04).applyEuler(new THREE.Euler(1.0, 0, 0));
	return [v.x + H[0], v.y + H[1], v.z + H[2]];
};
const CHIP = chipWorld();
const PACKET_UP: V3 = [-0.15, 1.6, 0.0];

const D: V3 = [0, 0, -60]; // maket şehir
const B: V3 = [60, 0, 0]; // banka kontrol odası
const STOPS: V3[] = [
	[-6, 1.4, 2],
	[-2.5, 2.3, -1.5],
	[1.8, 2.9, 1],
	[6, 2.3, -1.5],
].map((p) => add(D, p as V3));
const curve = new THREE.CatmullRomCurve3(STOPS.map((p) => new THREE.Vector3(...p)));
const tube = new THREE.TubeGeometry(curve, 200, 0.03, 8, false);

// Paketin şehirdeki ilerlemesi (0: dükkân → 1: senin bankan); dönüşte tersine.
const journeyU = (o: number) => {
	if (o < 32.66) {
		return (
			ramp(o, 22.2, 24.15) * 0.33 +
			ramp(o, 24.49, 27.26) * 0.33 +
			ramp(o, 27.58, 28.83) * 0.34
		);
	}
	return 1 - ramp(o, 32.66, 34.3, Easing.inOut(Easing.quad));
};
const pointOn = (u: number): V3 => {
	const p = curve.getPointAt(Math.min(1, Math.max(0, u)));
	return [p.x, p.y, p.z];
};

// ---------- Kamera planları (kesmeli) ----------
type Shot = {a: number; b: number; from: V3; to: V3; look: V3; look2?: V3; fog?: number; follow?: boolean; fov?: number};
const SHOTS: Shot[] = [
	{a: -1, b: 2.07, from: [1.6, 2.5, 3.8], to: [1.0, 1.9, 2.8], look: [0, 0.3, 0], look2: [0, 0.4, -0.2]},
	{a: 2.07, b: 4.6, from: [-0.5, 1.75, 1.25], to: [-0.35, 1.55, 0.95], look: [0, 0.4, -0.45]},
	{a: 4.6, b: 6.99, from: [-1.5, 1.9, 2.6], to: [-1.0, 1.7, 2.2], look: [0, 0.7, -0.3]},
	{a: 6.99, b: 8.43, from: [1.0, 1.6, 1.25], to: [0.75, 1.5, 1.0], look: [0.15, 1.1, -0.2]},
	{a: 8.43, b: 13.27, from: [1.7, 0.6, 0.9], to: [1.3, 0.75, 0.6], look: [0, 0.8, -0.35]},
	{a: 13.27, b: 19.4, from: [-0.6, 2.0, 1.9], to: [-0.4, 2.25, 2.3], look: [-0.15, 1.3, -0.25], look2: [-0.12, 1.5, -0.1]},
	{a: 19.4, b: 22.05, from: [0.2, 2.3, 2.9], to: [0.35, 2.4, 3.2], look: [0.12, 1.55, 0], fov: 42},
	{a: 22.05, b: 29.31, from: [0, 0, 0], to: [0, 0, 0], look: [0, 0, 0], follow: true, fog: 24},
	{a: 29.31, b: 32.66, from: add(B, [0, 2.5, 6.4]), to: add(B, [0, 2.2, 5.6]), look: add(B, [0, 0.95, 0.8]), fog: 18, fov: 50},
	{a: 32.66, b: 34.85, from: add(D, [0, 13, 13]), to: add(D, [0, 11.5, 11]), look: add(D, [0, 0.5, 0]), fog: 40},
	{a: 34.85, b: 36.82, from: [-0.5, 1.75, 1.3], to: [-0.35, 1.55, 1.0], look: [0, 0.4, -0.45]},
	{a: 36.82, b: 40.51, from: add(B, [-1.5, 2.2, 4.8]), to: add(B, [-1.2, 1.9, 4.2]), look: add(B, [-0.7, 0.95, 1.6]), fog: 16, fov: 46},
	{a: 40.51, b: 99, from: [1.8, 1.6, 2.6], to: [1.2, 1.35, 2.0], look: [0, 0.45, -0.3]},
];

const shotAt = (o: number) => SHOTS.find((s) => o >= s.a && o < s.b) ?? SHOTS[SHOTS.length - 1];

const CameraRig: React.FC<{pos: V3; look: V3; fov: number}> = ({pos, look, fov}) => {
	const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
	if (camera.fov !== fov) {
		camera.fov = fov;
		camera.updateProjectionMatrix();
	}
	camera.position.set(...pos);
	camera.lookAt(...look);
	return null;
};

// ---------- Sahne ----------
// atFrame: kapak gibi durağan kareler için sahneyi belirli bir anda dondurur.
export const PosWorld: React.FC<{atFrame?: number}> = ({atFrame}) => {
	const {o, fps} = useO(atFrame);
	const shot = shotAt(o);
	const sp = ramp(o, shot.a, shot.b, Easing.inOut(Easing.sin));

	// Kart hareketi: yaklaş → dokun → geri sar → havada incele
	const approach = ramp(o, 0, 1.5, Easing.out(Easing.cubic));
	const rewind = ramp(o, 4.7, 6.2);
	const tapped = o >= 34.0;
	const cardPos = tapped ? CARD_TAP : rewind > 0 ? mix(CARD_TAP, H, rewind) : mix(CARD_START, CARD_TAP, approach);
	const cardRot: V3 = tapped ? [0.32, 0.2, 0] : rewind > 0 ? [0.32 + 0.68 * rewind, 0.2 * (1 - rewind), 0] : [0.32 + (1 - approach) * 0.6, 0.2 + (1 - approach) * 0.4, 0];
	const xray = ramp(o, 7.0, 7.6) * (1 - ramp(o, 21.8, 22.0));
	const coil = ramp(o, 9.6, 11.0);
	const wake = Math.max(ramp(o, 11.4, 12.03), 0) * (1 - ramp(o, 12.4, 13.2) * 0.5);
	const numberShow = ramp(o, 13.5, 13.9) * (1 - ramp(o, 15.6, 16.0));
	const strike = ramp(o, 14.6, 15.2);

	const green = Math.max(ramp(o, 3.4, 3.6) * (1 - ramp(o, 4.7, 5.2)), ramp(o, 34.8, 35.0));

	// Şifre paketi
	const emerge = ramp(o, 15.93, 16.7, Easing.out(Easing.back(1.4)));
	const scrambleDone = o > 17.6;
	const finalCode = '7F#Q-92AX';
	const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#';
	const code = scrambleDone
		? finalCode
		: finalCode
				.split('')
				.map((c, i) => (c === '-' ? '-' : chars[(Math.floor(o * 24) * (i + 3) + i * 7) % chars.length]))
				.join('');
	const packetLock = pop(o, 17.6, fps);
	const clone = ramp(o, 19.4, 20.0);
	const cloneRed = ramp(o, 20.2, 20.4);
	const shatter = ramp(o, 20.9, 21.6, Easing.out(Easing.cubic));

	// Şehir yolculuğu
	const u = journeyU(o);
	const jp = pointOn(u);
	const returning = o >= 32.66;
	const arrive = (at: number) => pop(o, at, fps, 8) * (1 - ramp(o, at + 0.4, at + 1.0));

	// Banka odası
	const scanIn = ramp(o, 29.4, 30.2);
	const roomPacket = add(B, [-3 + scanIn * 3 + ramp(o, 32.1, 32.6) * 3, 0.95, 0]);
	const scanGlow = ramp(o, 30.2, 30.5) * (1 - ramp(o, 32.0, 32.3));
	const coinsIn = pop(o, 29.9, fps);
	const shieldIn = pop(o, 30.9, fps);
	const ok1 = pop(o, 30.6, fps, 9);
	const ok2 = pop(o, 31.6, fps, 9);
	const roomGreen = o > 32.0;
	const lockDrop = pop(o, 38.95, fps, 10);

	// Gece: ışıklar söner, fiş basılır
	const night = ramp(o, 40.51, 41.2);
	const receipt = ramp(o, 40.9, 42.7, Easing.linear);

	let camPos: V3;
	let look: V3;
	if (shot.follow) {
		camPos = add(jp, [1.6, 5.6, 7.6]);
		look = add(jp, [0, -1.0, 0]);
	} else {
		camPos = mix(shot.from, shot.to, sp);
		look = shot.look2 ? mix(shot.look, shot.look2, sp) : shot.look;
	}
	const bg = new THREE.Color('#E9E4DA').lerp(new THREE.Color('#141B26'), night);
	const fogFar = shot.fog ?? 11;
	const lightTarget = useMemo(() => new THREE.Object3D(), []);
	lightTarget.position.set(...look);
	lightTarget.updateMatrixWorld();

	return (
		<>
			<color attach="background" args={[bg]} />
			<fog attach="fog" args={[bg, fogFar * 0.4, fogFar]} />
			<CameraRig pos={camPos} look={look} fov={shot.fov ?? 35} />
			<hemisphereLight args={['#FFF4E0', '#8A7A66', 0.75 - night * 0.6]} />
			<primitive object={lightTarget} />
			<directionalLight
				position={add(look, [-3, 6, 3])}
				target={lightTarget}
				intensity={2.2 - night * 1.9}
				castShadow
				shadow-mapSize={[2048, 2048]}
				shadow-radius={6}
				shadow-bias={-0.0004}
			>
				<orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5, 0.1, 30]} />
			</directionalLight>

			{/* ---- Dükkân ---- */}
			<RoundedBox args={[5, 0.2, 2.4]} radius={0.04} position={[0, -0.1, 0]} receiveShadow>
				<Clay color="#B07A4E" rough={0.7} />
			</RoundedBox>
			<mesh position={[0, -1.2, 0]} receiveShadow>
				<boxGeometry args={[4.8, 2, 2.2]} />
				<Clay color="#F2EEE6" />
			</mesh>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
				<planeGeometry args={[40, 40]} />
				<Clay color="#D9D2C5" />
			</mesh>
			<mesh position={[0, 1.5, -3]} receiveShadow>
				<planeGeometry args={[40, 10]} />
				<Clay color="#EFEAE1" />
			</mesh>
			<Terminal green={green} glow={green * 1.2 + night * 0.6} />
			{night > 0 ? <pointLight position={[0, 0.9, 0.2]} color="#FFB867" intensity={night * 3} distance={4} /> : null}
			{receipt > 0 ? (
				<group position={[0, 0.43, -0.74]} rotation={[-0.25, 0, 0]}>
					<mesh position={[0, receipt * 0.45, 0]}>
						<planeGeometry args={[0.5, receipt * 0.9]} />
						<meshStandardMaterial color="#FFFDF8" roughness={0.9} side={THREE.DoubleSide} emissive="#FFF1D6" emissiveIntensity={0.25} />
					</mesh>
					{receipt > 0.4 ? <Label text="GÜN SONU" position={[0, receipt * 0.9 - 0.1, 0.004]} height={0.09} bg="#1E3A2F" /> : null}
				</group>
			) : null}
			<group position={cardPos} rotation={cardRot} visible={night < 0.05}>
				<Card opacity={1 - xray * 0.7} coil={coil} chip={coil * 0.6 + wake} number={numberShow} strike={strike} />
			</group>
			{/* Battery: "Kartında pil yok" */}
			{o > 6.9 && o < 8.6 ? (
				<group position={[0.3, 1.25, -0.25]} scale={pop(o, 7.0, fps) * 0.55} rotation={[0, 0, 0.3]}>
					<mesh>
						<cylinderGeometry args={[0.08, 0.08, 0.3, 24]} />
						<Clay color="#3FAE6A" />
					</mesh>
					<mesh position={[0, 0.17, 0]}>
						<cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
						<Clay color="#C9CDD3" metal={0.8} />
					</mesh>
					<mesh rotation={[0, 0, -1.1]} scale={[ramp(o, 7.4, 7.7), 1, 1]}>
						<boxGeometry args={[0.45, 0.04, 0.2]} />
						<Clay color="#FF3B30" emissive="#FF3B30" glow={0.6} />
					</mesh>
				</group>
			) : null}
			{/* Manyetik alan halkaları */}
			{o > 8.43 && o < 13.3
				? [0, 1, 2, 3].map((i) => {
						const p = ((o - 8.43) * 0.9 + i / 4) % 1;
						const y = 0.55 + p * 0.45;
						return (
							<mesh key={i} position={[0, y, -0.4 + p * 0.1]} rotation={[Math.PI / 2 - 0.3, 0, 0]} scale={0.25 + p * 0.25}>
								<torusGeometry args={[1, 0.03, 12, 64]} />
								<meshStandardMaterial color="#FFB547" emissive="#FF9F1C" emissiveIntensity={1.6} transparent opacity={(1 - p) * 0.85} />
							</mesh>
						);
					})
				: null}
			{/* Çipin ürettiği tek kullanımlık şifre */}
			{o > 15.9 && o < 22.05 ? (
				<>
					<Packet position={mix(CHIP, PACKET_UP, emerge)} scale={0.5 + emerge * 0.5} code={code} lock={packetLock} />
					{clone > 0 && shatter < 1 ? (
						<Packet position={add(PACKET_UP, [clone * 0.55, -clone * 0.05, 0])} color={cloneRed > 0.5 ? '#FF3B30' : '#4FD1FF'} scale={1 - shatter} />
					) : null}
					{shatter > 0
						? Array.from({length: 10}).map((_, i) => {
								const a = (i / 10) * Math.PI * 2;
								const r = shatter * 0.5;
								return (
									<mesh key={i} position={add(PACKET_UP, [0.55 + Math.cos(a) * r, -0.05 + Math.sin(a) * r * 0.8 - shatter * shatter * 0.3, Math.sin(a * 2) * r * 0.4])} rotation={[a, a * 2, 0]} scale={1 - shatter * 0.7}>
										<boxGeometry args={[0.05, 0.05, 0.05]} />
										<Clay color="#FF3B30" emissive="#FF3B30" glow={1.2} />
									</mesh>
								);
							})
						: null}
				</>
			) : null}
			<Person position={[-1.5, 0, -2.2]} color="#2F6B4F" />
			<Person position={[1.8, 0, -2.6]} color="#C0392B" />

			{/* ---- Maket şehir ---- */}
			<group>
				<mesh rotation={[-Math.PI / 2, 0, 0]} position={D} receiveShadow>
					<planeGeometry args={[60, 60]} />
					<Clay color="#DCD5C8" />
				</mesh>
				<mesh rotation={[-Math.PI / 2, 0, 0]} position={add(D, [0, 0.01, 0.2])} receiveShadow>
					<planeGeometry args={[18, 0.8]} />
					<Clay color="#C9C0B0" />
				</mesh>
				{/* Dükkân */}
				<group position={add(D, [-6, 0, 2])} scale={1 + arrive(22.1) * 0.06}>
					<RoundedBox args={[1.3, 1.0, 1.0]} radius={0.04} position={[0, 0.5, 0]} castShadow>
						<Clay color="#F4EFE6" />
					</RoundedBox>
					<mesh position={[0, 1.05, 0.55]} rotation={[0.5, 0, 0]} castShadow>
						<boxGeometry args={[1.4, 0.05, 0.5]} />
						<Clay color="#E8732A" />
					</mesh>
					<Label text="DÜKKÂN" position={[0, 1.6, 0.3]} height={0.32} bg="#E8732A" />
				</group>
				<Bank position={STOPS[1].map((v, i) => (i === 1 ? 0 : v)) as V3} roof="#2F6B4F" pulse={arrive(24.15)} />
				<Label text="MAĞAZANIN BANKASI" position={add(STOPS[1], [0, 0.55, 0.6])} height={0.34} />
				{/* Kart ağı küresi */}
				<group position={[STOPS[2][0], 1.5, STOPS[2][2]]} scale={1 + arrive(27.26) * 0.1}>
					<mesh castShadow>
						<sphereGeometry args={[0.75, 48, 48]} />
						<Clay color="#2F7BFF" emissive="#2F7BFF" glow={0.25 + arrive(27.26)} rough={0.4} />
					</mesh>
					{[0, 1, 2].map((i) => (
						<mesh key={i} rotation={[Math.PI / 2 + i * 0.6, i * 0.9, 0]}>
							<torusGeometry args={[0.95 + i * 0.08, 0.015, 8, 80]} />
							<Clay color="#9FE8FF" emissive="#9FE8FF" glow={0.8} />
						</mesh>
					))}
					<mesh position={[0, -0.8, 0]}>
						<cylinderGeometry args={[0.08, 0.2, 0.7, 16]} />
						<Clay color="#2B2F36" />
					</mesh>
				</group>
				<Label text="VISA · MASTERCARD · TROY" position={add(STOPS[2], [0, 0.55, 0.9])} height={0.3} bg="#2F7BFF" />
				<Bank position={STOPS[3].map((v, i) => (i === 1 ? 0 : v)) as V3} roof="#E8732A" pulse={arrive(28.83)} />
				<Label text="SENİN BANKAN" position={add(STOPS[3], [0, 0.55, 0.6])} height={0.34} bg="#E8732A" />
				<mesh geometry={tube}>
					<meshStandardMaterial color="#FFB547" emissive="#FFB547" emissiveIntensity={0.7} transparent opacity={0.55} />
				</mesh>
				{[[-8, 0, -3], [-4, 0, 4], [0, 0, -4], [3.5, 0, 3.5], [8.5, 0, 2.5], [9, 0, -4], [-9, 0, 1], [4, 0, -5]].map((p, i) => (
					<Tree key={i} position={add(D, p as V3)} s={0.9 + (i % 3) * 0.2} />
				))}
				{o >= 22.05 && o < 34.85 ? <Packet position={jp} color={returning ? '#2ECC71' : '#4FD1FF'} scale={1.6} /> : null}
			</group>

			{/* ---- Banka kontrol odası ---- */}
			<group>
				<mesh rotation={[-Math.PI / 2, 0, 0]} position={B} receiveShadow>
					<planeGeometry args={[20, 20]} />
					<Clay color="#D6CFC2" />
				</mesh>
				<mesh position={add(B, [0, 2, -2.5])} receiveShadow>
					<planeGeometry args={[20, 6]} />
					<Clay color="#E7E1D6" />
				</mesh>
				<group position={add(B, [0, 0.95, 0])} rotation={[0, Math.PI / 2, 0]}>
					<mesh castShadow>
						<torusGeometry args={[0.75, 0.08, 20, 64]} />
						<Clay color="#2B2F36" emissive={roomGreen ? '#2ECC71' : '#4FD1FF'} glow={0.3 + scanGlow * 2} rough={0.4} />
					</mesh>
				</group>
				<mesh position={add(B, [0, 0.45, 0])} castShadow>
					<cylinderGeometry args={[0.08, 0.12, 0.2, 16]} />
					<Clay color="#2B2F36" />
				</mesh>
				{o > 29.31 && o < 32.66 ? <Packet position={roomPacket} color={roomGreen ? '#2ECC71' : '#4FD1FF'} scale={1.4} /> : null}
				{/* Bakiye: madeni para yığını */}
				<group position={add(B, [-0.7, 0, 1.6])} scale={(o > 36.8 ? 1 : coinsIn) * 0.8}>
					{Array.from({length: 9}).map((_, i) => (
						<mesh key={i} position={[(i % 2) * 0.02, 0.05 + i * 0.09, 0]} castShadow>
							<cylinderGeometry args={[0.32, 0.32, 0.08, 40]} />
							<Clay color="#E8C15A" metal={0.6} rough={0.35} />
						</mesh>
					))}
					{o < 36.8 ? <Label text="BAKİYE" position={[0, 1.25, 0.2]} height={0.24} /> : null}
					{o < 36.8 ? <Check position={[0.5, 1.0, 0.2]} s={ok1} /> : null}
					{lockDrop > 0 ? (
						<>
							<Padlock position={[0, 0.45 + (1 - lockDrop) * 1.2, 0.45]} s={lockDrop} />
							<Label text="BLOKE" position={[0, 1.25, 0.3]} height={0.26} bg="#D9363E" opacity={lockDrop} />
						</>
					) : null}
					{lockDrop > 0
						? Array.from({length: 7}).map((_, i) => (
								<mesh key={i} position={[Math.cos(i * 0.9) * 0.38, 0.4, Math.sin(i * 0.9) * 0.38]} rotation={[Math.PI / 2, 0, i * 0.9 + (i % 2) * 1.2]} scale={lockDrop}>
									<torusGeometry args={[0.08, 0.022, 10, 20]} />
									<Clay color="#9AA1A8" metal={0.9} rough={0.3} />
								</mesh>
							))
						: null}
				</group>
				{/* Güvenlik kalkanı */}
				<group position={add(B, [0.7, 0.5, 1.6])} scale={(o > 36.8 ? 0 : shieldIn) * 0.8}>
					<mesh castShadow scale={[1, 1.2, 0.35]}>
						<sphereGeometry args={[0.38, 6, 2, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
						<Clay color="#2F6B4F" rough={0.5} />
					</mesh>
					<Label text="GÜVENLİK" position={[0, 0.7, 0.2]} height={0.24} />
					<Check position={[0.45, 0.4, 0.2]} s={ok2} />
				</group>
			</group>

			<EffectComposer multisampling={0}>
				<DepthOfField target={look} focalLength={0.035} bokehScale={2.2} />
				<Bloom intensity={0.7} luminanceThreshold={0.8} mipmapBlur />
				<Vignette offset={0.25} darkness={0.55} />
			</EffectComposer>
		</>
	);
};
