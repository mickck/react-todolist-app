import { atom } from "recoil";

export interface IToDo {
  id: number;
  text: string;
}

export interface IToDoState {
  [key: string]: IToDo[];
}
const localTodo = localStorage.getItem("todo");
const todoJSON = JSON.parse(localTodo as any);

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: todoJSON || {
    "TO DO": [],
    Doing: [],
    Done: [],
  },
});
