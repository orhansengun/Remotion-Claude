import {Cover} from '../../components/Cover';
import {Maze} from './Ikea';

export const IkeaCover: React.FC = () => (
	<Cover
		kicker="MAĞAZA PSİKOLOJİSİ"
		top="IKEA'da kaybolman"
		bottom="tesadüf değil."
		hero={
			<div style={{transform: 'scale(0.74) rotate(-3deg)', position: 'relative'}}>
				<Maze draw={0.62} labels={false} />
				<div style={{position: 'absolute', left: 460, top: 120, fontFamily: "'Inter Display', sans-serif", fontWeight: 900, fontSize: 200, color: '#D9363E', transform: 'rotate(10deg)'}}>?</div>
			</div>
		}
	/>
);
