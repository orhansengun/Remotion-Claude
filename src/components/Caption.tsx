import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, sec} from '../theme';

// Metin işaretleri: ~küçük gri, !kırmızı, ^turuncu, _yeşil, #büyük. "|" satır atlatır.
export type CaptionBeat = {at: number; text: string; lines?: number[]; to?: number};

const MAX_GAP = 0.3;

const styleFor = (raw: string, light: boolean) => {
	const marks = raw.match(/^[~!^_#]+/)?.[0] ?? '';
	const word = raw.slice(marks.length);
	let color = light ? '#FFFDF8' : C.ink;
	let size = 66;
	let weight = 800;
	if (marks.includes('~')) {
		color = light ? '#E4E0D8' : C.grey;
		size = 44;
		weight = 700;
	}
	if (marks.includes('!')) color = light ? '#FF6B5E' : C.red;
	if (marks.includes('^')) color = light ? '#FFB547' : C.orange;
	if (marks.includes('_')) color = light ? '#6EE7A0' : C.mint;
	if (marks.includes('#')) size = 96;
	return {word, color, size, weight};
};

// tone="light": 3D/sinematik arka planlar için beyaz, gölgeli yazı.
export const Captions: React.FC<{beats: CaptionBeat[]; tone?: 'dark' | 'light'}> = ({beats, tone = 'dark'}) => {
	const light = tone === 'light';
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const idx = beats.findLastIndex((b) => frame >= sec(b.at));
	if (idx < 0) return null;
	const beat = beats[idx];
	const lines = beat.text.split('|').map((l) => l.trim().split(/\s+/));
	const lineStarts = [beat.at, ...(beat.lines ?? [])];
	// Kelimeler, satırın konuşulduğu süreye yayılarak sırayla belirir.
	const wordAt = (li: number, wi: number) => {
		const from = lineStarts[li] ?? lineStarts[lineStarts.length - 1];
		const until = lineStarts[li + 1] ?? beat.to ?? from + MAX_GAP * lines[li].length;
		const gap = Math.min(MAX_GAP, (until - from) / lines[li].length);
		return sec(from + gap * wi);
	};

	return (
		<div
			style={{
				position: 'absolute',
				top: 210,
				left: 70,
				right: 70,
				textAlign: 'center',
				fontFamily: FONT,
				letterSpacing: -1.5,
				lineHeight: 1.15,
				textShadow: light ? '0 3px 14px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.6)' : undefined,
			}}
		>
			{lines.map((line, li) => (
				<div key={li}>
					{line.map((raw, wi) => {
						const s = styleFor(raw, light);
						const appear = wordAt(li, wi);
						const p = spring({frame: frame - appear, fps, config: {damping: 14, mass: 0.6}});
						return (
							<span
								key={wi}
								style={{
									display: 'inline-block',
									margin: '0 10px',
									color: s.color,
									fontSize: s.size,
									fontWeight: s.weight,
									opacity: interpolate(p, [0, 1], [0, 1]),
									transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
								}}
							>
								{s.word}
							</span>
						);
					})}
				</div>
			))}
		</div>
	);
};
