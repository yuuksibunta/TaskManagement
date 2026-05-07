import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from './types';
import EditCardModal from './EditCardModal';

type Props = {
  card: Card;
  onCardUpdate: (cardId: number, title: string, memo: string, dueDate: string, priority: number | null) => Promise<void>;
};

const PRIORITY_LABEL: Record<number, string> = { 1: '高', 2: '中', 3: '低' };
const PRIORITY_CLASS: Record<number, string> = { 1: 'priority-high', 2: 'priority-mid', 3: 'priority-low' };
const PRIORITY_ICON: Record<number, string> = { 1: '🔴', 2: '🟡', 3: '🟢' };

function formatDueDate(dueDate: string): string {
  const d = new Date(dueDate);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function isDueDateOverdue(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
}

export default function CardItem({ card, onCardUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleSave = async (title: string, memo: string, dueDate: string, priority: number | null) => {
    await onCardUpdate(card.id, title, memo, dueDate, priority);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} className="card" {...attributes} {...listeners}>
        <div className="card-body">
          <div className="card-title">{card.title}</div>
          {card.memo && <div className="card-memo">{card.memo}</div>}
          <div className="card-meta">
            {card.priority != null && (
              <span className={`priority-badge ${PRIORITY_CLASS[card.priority]}`}>
                {PRIORITY_ICON[card.priority]} {PRIORITY_LABEL[card.priority]}
              </span>
            )}
            {card.dueDate && (
              <span className={`due-date ${isDueDateOverdue(card.dueDate) ? 'overdue' : ''}`}>
                {formatDueDate(card.dueDate)}
              </span>
            )}
          </div>
        </div>
        <button
          className="btn-edit"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          ✎
        </button>
      </div>
      {isEditing && (
        <EditCardModal
          card={card}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}
