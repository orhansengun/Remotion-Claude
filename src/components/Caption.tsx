import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, sec} from '../theme';

// Metin işaretleri: ~küçük gri, !kırmızı, ^turuncu, _yeşil, #büyük. "|" satır atlatır.
export type CaptionBeat = {at: number; text: string};

const WORD_GAP = 0.2;

const styleFor = (raw: string) => {
	const marks = raw.match(/^[~!^_#]+/)?.[0] ?? '';
	const word = raw.slice(marks.length);
	let color = C.ink;
	let size = 66;
	let weight = 800;
	if (marks.includes('~')) {
		color = C.grey;
		size = 44;
		weight = 700;
	}
	if (marks.includes('!')) color = C.red;
	if (marks.includes('^')) color = C.orange;
	if (marks.includes('_')) color = C.mint;
	if (marks.includes('#')) size = 96;
	return {word, color, size, weight};
};

export const Captions: React.FC<{beats: CaptionBeat[]}> = ({beats}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const idx = beats.findLastIndex((b) => frame >= sec(b.at));
	if (idx < 0) return null;
	const beat = beats[idx];
	const start = sec(beat.at);
	const lines = beat.text.split('|').map((l) => l.trim().split(/\s+/));
	let wordIndex = 0;

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
			}}
		>
			{lines.map((line, li) => (
				<div key={li}>
					{line.map((raw, wi) => {
						const s = styleFor(raw);
						const appear = start + sec(WORD_GAP * wordIndex++);
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
