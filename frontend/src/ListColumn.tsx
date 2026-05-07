import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TaskList, Card } from './types';
import CardItem from './CardItem';
import AddCardModal from './AddCardModal';

type SortKey = 'dueDate' | 'priority';

type Props = {
  list: TaskList;
  cards: Card[];
  onCardCreate: (listId: number, title: string, memo: string, dueDate: string, priority: number | null) => Promise<void>;
  onCardUpdate: (cardId: number, title: string, memo: string, dueDate: string, priority: number | null) => Promise<void>;
};

function sortCards(cards: Card[], key: SortKey | null): Card[] {
  if (key === null) return [...cards].sort((a, b) => a.position - b.position);
  if (key === 'dueDate') {
    return [...cards].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return a.position - b.position;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }
  return [...cards].sort((a, b) => {
    if (a.priority == null && b.priority == null) return a.position - b.position;
    if (a.priority == null) return 1;
    if (b.priority == null) return -1;
    return a.priority - b.priority;
  });
}

const SORT_LABELS: Record<SortKey, string> = {
  dueDate: '期限',
  priority: '優先度',
};

export default function ListColumn({ list, cards, onCardCreate, onCardUpdate }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);

  const { setNodeRef: setDropRef } = useDroppable({ id: `list-${list.id}` });

  const listCards = cards.filter((c) => c.taskList.id === list.id);
  const sortedCards = sortCards(listCards, sortKey);

  const handleSave = async (title: string, memo: string, dueDate: string, priority: number | null) => {
    await onCardCreate(list.id, title, memo, dueDate, priority);
  };

  return (
    <div className="list">
      <div className="list-header">
        <span className="list-title">{list.name}</span>
        <span className="list-count">{listCards.length}</span>
      </div>
      <div className="sort-controls">
        {(['dueDate', 'priority'] as SortKey[]).map((key) => (
          <button
            key={key}
            className={`sort-btn ${sortKey === key ? 'active' : ''}`}
            onClick={() => setSortKey(sortKey === key ? null : key)}
          >
            {SORT_LABELS[key]}
          </button>
        ))}
      </div>
      <div className="cards-container" ref={setDropRef}>
        <SortableContext
          items={sortedCards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedCards.map((card) => (
            <CardItem key={card.id} card={card} onCardUpdate={onCardUpdate} />
          ))}
        </SortableContext>
      </div>
      <div className="add-card-area">
        <button className="btn-add-card" onClick={() => setIsModalOpen(true)}>
          ＋ カードを追加
        </button>
      </div>
      {isModalOpen && (
        <AddCardModal
          listName={list.name}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
