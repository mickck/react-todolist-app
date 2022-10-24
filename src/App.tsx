import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";

const Div = styled.div`
  background: linear-gradient(90deg, #fc466b 0%, #3f5efb 100%);
`;

const Wrapper = styled.div`
  display: flex;
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

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onDragEnd = (info: DropResult) => {
    // console.log(info);
    const { destination, draggableId, source } = info;

    //if destination is undefined just return
    if (!destination) return;

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
    }
    if (destination.droppableId !== source.droppableId) {
      // draggable card was moved into a diffrent board

      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  return (
    <Div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
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
