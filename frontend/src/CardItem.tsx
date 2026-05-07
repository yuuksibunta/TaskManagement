import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card } from './types';
import EditCardModal from './EditCardModal';

type Props = {
  card: Card;
  onCardUpdate: (cardId: number, title: string, memo: string) => Promise<void>;
};

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

  const handleSave = async (title: string, memo: string) => {
    await onCardUpdate(card.id, title, memo);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} className="card" {...attributes} {...listeners}>
        <div className="card-body">
          <div className="card-title">{card.title}</div>
          {card.memo && <div className="card-memo">{card.memo}</div>}
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
