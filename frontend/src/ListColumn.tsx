import type { TaskList, Card } from './types';
import CardItem from './CardItem';

type Props = {
  list: TaskList;
  cards: Card[];
};

export default function ListColumn({ list, cards }: Props) {
  const listCards = cards
    .filter((c) => c.taskList.id === list.id)
    .sort((a, b) => a.position - b.position);

  return (
    <div className="list">
      <div className="list-header">
        <span className="list-title">{list.name}</span>
        <span className="list-count">{listCards.length}</span>
      </div>
      <div className="cards-container">
        {listCards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
