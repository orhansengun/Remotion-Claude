import {Cover} from '../../components/Cover';
import {PALETTES} from '../../theme';
import {Maze} from './Ikea';

export const IkeaCover: React.FC = () => (
	<Cover
		palette={PALETTES.navy}
		kicker="MAĞAZA PSİKOLOJİSİ"
		top="IKEA'da kaybolman"
		bottom="tesadüf değil."
		hero={
			<div style={{transform: 'scale(0.74) rotate(-3deg)', position: 'relative'}}>
				<Maze draw={0.62} labels={false} />
				<div style={{position: 'absolute', left: 460, top: 120, fontFamily: "'Inter Display', sans-serif", fontWeight: 900, fontSize: 200, color: PALETTES.navy.mark, transform: 'rotate(10deg)', WebkitTextStroke: '8px #0E1F33', paintOrder: 'stroke fill'}}>?</div>
			</div>
		}
	/>
);
