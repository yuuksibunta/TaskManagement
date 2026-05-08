import { useState } from 'react';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import type { TaskList, Card } from './types';
import ListColumn from './ListColumn';

const PRIORITY_LABEL: Record<number, string> = { 1: '高', 2: '中', 3: '低' };
const PRIORITY_CLASS: Record<number, string> = { 1: 'priority-high', 2: 'priority-mid', 3: 'priority-low' };
const PRIORITY_ICON: Record<number, string> = { 1: '🔴', 2: '🟡', 3: '🟢' };

function formatDueDate(dueDate: string): string {
  const d = new Date(dueDate);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

type Props = {
  lists: TaskList[];
  cards: Card[];
  onCardCreate: (listId: number, title: string, memo: string, dueDate: string, priority: number | null) => Promise<void>;
  onCardUpdate: (cardId: number, title: string, memo: string, dueDate: string, priority: number | null) => Promise<void>;
  onCardDelete: (cardId: number) => Promise<void>;
  onCardMove: (activeId: number, overId: number | string) => Promise<void>;
};

export default function Board({ lists, cards, onCardCreate, onCardUpdate, onCardDelete, onCardMove }: Props) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const sortedLists = [...lists].sort((a, b) => a.position - b.position);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCard(cards.find((c) => c.id === event.active.id) ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over || active.id === over.id) return;
    onCardMove(active.id as number, over.id as number);
  };

  return (
    <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="board">
        {sortedLists.map((list) => (
          <ListColumn
            key={list.id}
            list={list}
            cards={cards}
            onCardCreate={onCardCreate}
            onCardUpdate={onCardUpdate}
            onCardDelete={onCardDelete}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard && (
          <div className="card" style={{ cursor: 'grabbing', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
            <div className="card-body">
              <div className="card-title">{activeCard.title}</div>
              {activeCard.memo && <div className="card-memo">{activeCard.memo}</div>}
              <div className="card-meta">
                {activeCard.priority != null && (
                  <span className={`priority-badge ${PRIORITY_CLASS[activeCard.priority]}`}>
                    {PRIORITY_ICON[activeCard.priority]} {PRIORITY_LABEL[activeCard.priority]}
                  </span>
                )}
                {activeCard.dueDate && (
                  <span className="due-date">{formatDueDate(activeCard.dueDate)}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
