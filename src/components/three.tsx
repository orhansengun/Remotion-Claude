import {useThree} from '@react-three/fiber';
import {useMemo} from 'react';
import {Easing, interpolate, spring} from 'remotion';
import * as THREE from 'three';

// 3D videoların ortak yardımcıları. Zamanlar saniye; hızlandırılmış kayıtlarda çağıran taraf orijinal saniyeyi verir.
export type V3 = [number, number, number];

export const ramp = (o: number, a: number, b: number, ease = Easing.inOut(Easing.cubic)) =>
	interpolate(o, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const popAt = (o: number, at: number, fps: number, rate = 1, damping = 12) =>
	spring({frame: ((o - at) / rate) * fps, fps, config: {damping}});

export const mix = (a: V3, b: V3, p: number): V3 => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];
export const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

export const Clay: React.FC<{color: string; rough?: number; opacity?: number; emissive?: string; glow?: number; metal?: number; flat?: boolean}> = ({
	color,
	rough = 0.8,
	opacity = 1,
	emissive = '#000000',
	glow = 0,
	metal = 0,
	flat = false,
}) => (
	<meshStandardMaterial
		color={color}
		roughness={rough}
		metalness={metal}
		transparent={opacity < 1}
		opacity={opacity}
		emissive={emissive}
		emissiveIntensity={glow}
		flatShading={flat}
	/>
);

// Tuval üzerine yazılmış yazı dokusu: 3D sahnede okunur etiketler (font indirmeden).
export const Label: React.FC<{text: string; position: V3; height?: number; bg?: string; fg?: string; rotation?: V3; opacity?: number}> = ({
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
		ctx.beginPath();
		ctx.roundRect(0, 0, w, canvas.height, canvas.height / 2);
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

export const CameraRig: React.FC<{pos: V3; look: V3; fov: number}> = ({pos, look, fov}) => {
	const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
	if (camera.fov !== fov) {
		camera.fov = fov;
		camera.updateProjectionMatrix();
	}
	camera.position.set(...pos);
	camera.lookAt(...look);
	return null;
};

// Kesmeli kamera planı: [a, b) aralığında from→to kayar.
export type Shot = {a: number; b: number; from: V3; to: V3; look: V3; look2?: V3; fog?: number; fov?: number};
export const shotAt = <S extends Shot>(shots: S[], o: number) => shots.find((s) => o >= s.a && o < s.b) ?? shots[shots.length - 1];
