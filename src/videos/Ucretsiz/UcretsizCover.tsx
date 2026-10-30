import {Cover} from '../../components/Cover';
import {C, FONT, PALETTES} from '../../theme';
import {MonthGrid} from './Ucretsiz';

export const UcretsizCover: React.FC = () => (
	<Cover
		palette={PALETTES.blush}
		kicker="ABONELİK PSİKOLOJİSİ"
		top="İlk ay ücretsiz,"
		bottom="çünkü unutacaksın."
		hero={
			<div style={{position: 'relative', transform: 'rotate(-3deg)'}}>
				<MonthGrid crossed={30} ring={1} size={66} />
				<div
					style={{
						position: 'absolute',
						left: -60,
						top: -30,
						transform: 'rotate(-10deg)',
						background: C.green,
						color: C.card,
						fontFamily: FONT,
						fontWeight: 900,
						fontSize: 80,
						padding: '14px 40px',
						borderRadius: 20,
						border: `7px solid ${C.ink}`,
						boxShadow: `0 12px 0 ${C.shadow}`,
					}}
				>
					ÜCRETSİZ
				</div>
			</div>
		}
	/>
);
