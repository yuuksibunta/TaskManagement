import { DndContext, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { TaskList, Card } from './types';
import ListColumn from './ListColumn';

type Props = {
  lists: TaskList[];
  cards: Card[];
  onCardCreate: (listId: number, title: string, memo: string, dueDate: string, priority: number | null) => Promise<void>;
  onCardUpdate: (cardId: number, title: string, memo: string, dueDate: string, priority: number | null) => Promise<void>;
  onCardMove: (activeId: number, overId: number) => Promise<void>;
};

export default function Board({ lists, cards, onCardCreate, onCardUpdate, onCardMove }: Props) {
  const sortedLists = [...lists].sort((a, b) => a.position - b.position);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onCardMove(active.id as number, over.id as number);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="board">
        {sortedLists.map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            cards={cards}
            onCardCreate={onCardCreate}
            onCardUpdate={onCardUpdate}
          />
        ))}
      </div>
    </DndContext>
  );
}
