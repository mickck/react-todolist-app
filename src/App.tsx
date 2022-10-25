import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { IToDoState, toDoState } from "./atoms";
import Board from "./Components/Board";
import { useForm } from "react-hook-form";

const Div = styled.div`
  background: linear-gradient(90deg, #46b9fc 0%, #3f5efb 100%);
`;

const Wrapper = styled.div`
  /* display: flex; */
  /* max-width: 680px; */
  width: 85vw;
  height: 100vh;
  margin: 0 auto;
  justify-content: center;
  align-items: center;

  li {
    list-style: none;
  }
`;
const Form = styled.form`
  width: 200px;
  /* display: flex; */
  justify-content: center;
  align-items: center;
  padding-top: 100px;
  margin-bottom: 50px;
  display: inline-block;
`;

const Input = styled.input`
  background: none;
  outline: none;
  border: none;
  border-bottom: 1px solid white;
  text-align: center;
  font-size: 18px;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Boards = styled.div`
  display: grid;
  width: 95%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm();

  const onDragEnd = (info: DropResult) => {
    const { destination, source, type } = info;
    if (type === "Board") {
      //if destination is undefined just return
      if (!destination) return;
      setToDos((prev) => {
        const update = Object.entries(prev);
        const [temp] = update.splice(source.index, 1);
        update.splice(destination?.index, 0, temp);
        const updateList = update.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
        localStorage.setItem("todo", JSON.stringify(updateList));
        return updateList;
      });
    }
    //1. check  if source board is same destination board
    if (destination?.droppableId === source.droppableId) {
      //   draggable card was moved into a same board
      //1. just copy a board has been modified.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];

        // 1. delete item on source.index.
        boardCopy.splice(source.index, 1);
        // 2. put this item back on the destination.index
        boardCopy.splice(destination?.index, 0, taskObj);

        return {
          ...allBoards, //rest of allBoards
          [source.droppableId]: boardCopy, // the changed board
        };
      });
    } else {
      if (destination === null) {
        setToDos((allBoards) => {
          const update = [...allBoards[source.droppableId]];
          update.splice(source.index, 1);
          const updateList = {
            ...allBoards,
            [source.droppableId]: update,
          };
          localStorage.setItem("todo", JSON.stringify(updateList));
          return updateList;
        });
      }
      if (!destination) return;
      if (destination?.droppableId === source.droppableId) {
        setToDos((allboards) => {
          const update = [...allboards[source.droppableId]];
          const taskObj = update[source.index];
          update.splice(source.index, 1);
          update.splice(destination?.index, 0, taskObj);
          const updateList = {
            ...allboards,
            [source.droppableId]: update,
          };
          localStorage.setItem("todo", JSON.stringify(updateList));
          return updateList;
        });
      }
      if (destination.droppableId !== source.droppableId) {
        setToDos((allBoards) => {
          const sourceUpdate = [...allBoards[source.droppableId]];
          const targetUpdate = [...allBoards[destination.droppableId]];
          const taskObj = sourceUpdate[source.index];
          sourceUpdate.splice(source.index, 1);
          targetUpdate.splice(destination.index, 0, taskObj);
          const updateList = {
            ...allBoards,
            [source.droppableId]: sourceUpdate,
            [destination.droppableId]: targetUpdate,
          };
          localStorage.setItem("todo", JSON.stringify(updateList));
          return updateList;
        });
      }
    }
  };
  const onSubmit = ({ board }: IToDoState) => {
    setToDos((allBoards) => {
      const update = {
        ...allBoards,
        [board + ""]: [],
      };
      localStorage.setItem("todo", JSON.stringify(update));
      return update;
    });
    setValue("board", "");
  };
  return (
    <Div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Input {...register("board", { required: true })} type='text' placeholder='Add a new board!' />
          </Form>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </Div>
  );
}

export default App;
