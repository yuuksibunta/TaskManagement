export type TaskList = {
  id: number;
  name: string;
  position: number;
};

export type Card = {
  id: number;
  taskList: TaskList;
  title: string;
  memo: string | null;
  position: number;
  createdAt: string | null;
  updatedAt: string | null;
};
