import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { TaskList, Card } from './types';
import CardItem from './CardItem';
import AddCardModal from './AddCardModal';

type Props = {
  list: TaskList;
  cards: Card[];
  onCardCreate: (listId: number, title: string, memo: string) => Promise<void>;
  onCardUpdate: (cardId: number, title: string, memo: string) => Promise<void>;
};

export default function ListColumn({ list, cards, onCardCreate, onCardUpdate }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const listCards = cards
    .filter((c) => c.taskList.id === list.id)
    .sort((a, b) => a.position - b.position);

  const handleSave = async (title: string, memo: string) => {
    await onCardCreate(list.id, title, memo);
  };

  return (
    <div className="list">
      <div className="list-header">
        <span className="list-title">{list.name}</span>
        <span className="list-count">{listCards.length}</span>
      </div>
      <div className="cards-container">
        <SortableContext items={listCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {listCards.map((card) => (
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
