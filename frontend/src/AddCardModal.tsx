import { useState, useEffect, useRef } from 'react';

type Props = {
  listName: string;
  onSave: (title: string, memo: string, dueDate: string, priority: number | null) => Promise<void>;
  onClose: () => void;
};

export default function AddCardModal({ listName, onSave, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState(false);
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
      setTitleError(true);
      titleRef.current?.focus();
      return;
    }
    setTitleError(false);
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
        <h2>{listName} に追加</h2>
        <div className="modal-field">
          <label>タイトル</label>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setTitleError(false); }}
            onKeyDown={handleKeyDown}
            placeholder="カードのタイトル"
            style={titleError ? { borderColor: '#e74c3c' } : undefined}
          />
          {titleError && <span className="field-error">タイトルは必須です</span>}
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
              <option value="1">🔴 高</option>
              <option value="2">🟡 中</option>
              <option value="3">🟢 低</option>
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? '保存中...' : '追加'}
          </button>
        </div>
      </div>
    </div>
  );
}
