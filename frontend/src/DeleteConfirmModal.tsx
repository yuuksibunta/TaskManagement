import type { Card } from './types';

type Props = {
  card: Card;
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export default function DeleteConfirmModal({ card, onConfirm, onClose }: Props) {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>カードを削除</h2>
        <p className="delete-confirm-message">
          「<strong>{card.title}</strong>」を削除しますか？<br />
          この操作は元に戻せません。
        </p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn-delete" onClick={handleConfirm}>削除</button>
        </div>
      </div>
    </div>
  );
}
