import { useState, useEffect, useRef } from 'react';
import type { Card } from './types';

type Props = {
  card: Card;
  onSave: (title: string, memo: string, dueDate: string, priority: number | null) => Promise<void>;
  onClose: () => void;
};

export default function EditCardModal({ card, onSave, onClose }: Props) {
  const [title, setTitle] = useState(card.title);
  const [memo, setMemo] = useState(card.memo ?? '');
  const [dueDate, setDueDate] = useState(card.dueDate ?? '');
  const [priority, setPriority] = useState<number | null>(card.priority ?? null);
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = async () => {
    if (!title.trim()) {
      titleRef.current?.focus();
      return;
    }
    setSaving(true);
    try {
      await onSave(title.trim(), memo.trim(), dueDate, priority);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>カードを編集</h2>
        <div className="modal-field">
          <label>タイトル</label>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="カードのタイトル"
          />
        </div>
        <div className="modal-field">
          <label>メモ（任意）</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="メモを入力"
            rows={3}
          />
        </div>
        <div className="modal-row">
          <div className="modal-field">
            <label>期限（任意）</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label>優先度（任意）</label>
            <select
              value={priority ?? ''}
              onChange={(e) => setPriority(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">未設定</option>
              <option value="1">高</option>
              <option value="2">中</option>
              <option value="3">低</option>
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
