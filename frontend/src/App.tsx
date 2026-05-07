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

  const handleCardCreate = async (listId: number, title: string, memo: string, dueDate: string, priority: number | null) => {
    const position = cards.filter((c) => c.taskList.id === listId).length + 1;
    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listId, title, memo, position, dueDate, priority }),
    });
    if (!res.ok) throw new Error('カードの作成に失敗しました');
    const newCard: Card = await res.json();
    setCards((prev) => [...prev, newCard]);
  };

  const handleCardUpdate = async (cardId: number, title: string, memo: string, dueDate: string, priority: number | null) => {
    const res = await fetch(`/api/cards/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, memo, dueDate: dueDate || null, priority }),
    });
    if (!res.ok) throw new Error('カードの更新に失敗しました');
    const updated: Card = await res.json();
    setCards((prev) => prev.map((c) => (c.id === cardId ? updated : c)));
  };

  const handleCardMove = async (activeId: number, overId: number) => {
    const activeCard = cards.find((c) => c.id === activeId);
    const overCard = cards.find((c) => c.id === overId);
    if (!activeCard || !overCard) return;

    const targetListId = overCard.taskList.id;
    const targetListCards = cards
      .filter((c) => c.taskList.id === targetListId)
      .sort((a, b) => a.position - b.position);

    if (activeCard.taskList.id === targetListId) {
      const activeIndex = targetListCards.findIndex((c) => c.id === activeId);
      const overIndex = targetListCards.findIndex((c) => c.id === overId);

      const reordered = [...targetListCards];
      reordered.splice(activeIndex, 1);
      reordered.splice(overIndex, 0, activeCard);

      const updatedCards = cards.map((c) => {
        const idx = reordered.findIndex((r) => r.id === c.id);
        if (idx !== -1) return { ...c, position: idx + 1 };
        return c;
      });
      setCards(updatedCards);

      await Promise.all(
        reordered.map((card, idx) =>
          fetch(`/api/cards/${card.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ position: idx + 1 }),
          })
        )
      );
    } else {
      const overIndex = targetListCards.findIndex((c) => c.id === overId);
      const newPosition = overIndex + 1;

      setCards((prev) =>
        prev.map((c) => {
          if (c.id === activeId) {
            return { ...c, taskList: overCard.taskList, position: newPosition };
          }
          if (c.taskList.id === targetListId && c.position >= newPosition) {
            return { ...c, position: c.position + 1 };
          }
          return c;
        })
      );

      await fetch(`/api/cards/${activeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId: targetListId, position: newPosition }),
      });
    }
  };

  if (loading) return <div className="status-message">読み込み中...</div>;
  if (error) return <div className="status-message error">{error}</div>;

  return (
    <div id="app">
      <header>
        <h1>タスクボード</h1>
      </header>
      <Board
        lists={lists}
        cards={cards}
        onCardCreate={handleCardCreate}
        onCardUpdate={handleCardUpdate}
        onCardMove={handleCardMove}
      />
    </div>
  );
}
