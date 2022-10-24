import { atom } from "recoil";

interface IToDoState {
  [key: string]: string[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    ToDo: ["a", "b"],
    Doing: ["c", "d", "e"],
    Done: ["f"],
  },
});
