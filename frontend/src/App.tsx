import { useState, useEffect } from 'react';
import type { TaskList, Card } from './types';
import Board from './Board';
import './App.css';

export default function App() {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const [listsRes, cardsRes] = await Promise.all([
          fetch('/api/lists'),
          fetch('/api/cards'),
        ]);
        if (!listsRes.ok || !cardsRes.ok) {
          throw new Error('APIエラーが発生しました');
        }
        setLists(await listsRes.json());
        setCards(await cardsRes.json());
      } catch (e) {
        setError('データの取得に失敗しました。サーバーが起動しているか確認してください。');
      } finally {
        setLoading(false);
      }
    };

    loadBoard();
  }, []);

  if (loading) return <div className="status-message">読み込み中...</div>;
  if (error) return <div className="status-message error">{error}</div>;

  return (
    <div id="app">
      <header>
        <h1>タスクボード</h1>
      </header>
      <Board lists={lists} cards={cards} />
    </div>
  );
}
