import type { TaskList, Card } from './types';
import ListColumn from './ListColumn';

type Props = {
  lists: TaskList[];
  cards: Card[];
};

export default function Board({ lists, cards }: Props) {
  const sortedLists = [...lists].sort((a, b) => a.position - b.position);

  return (
    <div className="board">
      {sortedLists.map((list) => (
        <ListColumn key={list.id} list={list} cards={cards} />
      ))}
    </div>
  );
}
