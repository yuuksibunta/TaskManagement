import type { Card } from './types';

type Props = {
  card: Card;
};

export default function CardItem({ card }: Props) {
  return (
    <div className="card">
      <div className="card-title">{card.title}</div>
      {card.memo && <div className="card-memo">{card.memo}</div>}
    </div>
  );
}
