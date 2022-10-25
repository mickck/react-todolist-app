import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { useForm } from "react-hook-form";
import { IToDo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  padding-top: 30px;
  padding: 10px 0px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  margin-top: 0;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThisWith: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) => (props.isDraggingOver ? "#dfe6e9" : props.isDraggingFromThisWith ? "#b2bec3" : "transparent")};
  flex-grow: 1;
  transition: background-color 0.4s ease-in-out;
  padding: 20px;
`;
const Button = styled.button`
  /* position: absolute; */
  text-align: right;
  padding-right: 20px;
  background: none;
  border: none;
  outline: none;
  font-size: 25px;
  cursor: pointer;
`;

interface IBoardProps {
  toDos: IToDo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

function Board({ toDos, boardId }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      const update = {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
      localStorage.setItem("todo", JSON.stringify(update));
      return update;
    });
    setValue("toDo", "");
  };
  const onRemove = () => {
    setToDos((allBoards) => {
      const update = Object.entries(allBoards).filter((target) => target[0] !== boardId);
      const updateList = update.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
      localStorage.setItem("todo", JSON.stringify(updateList));
      return updateList;
    });
  };
  return (
    <Wrapper>
      <Title>{boardId}</Title>
      <Button onClick={onRemove}>🗑</Button>
      <Form onSubmit={handleSubmit(onValid)}>
        <input {...register("toDo", { required: true })} type='text' placeholder={`Add task on ${boardId}`}></input>
      </Form>
      <Droppable droppableId={boardId}>
        {(magic, info) => (
          <Area isDraggingOver={info.isDraggingOver} isDraggingFromThisWith={Boolean(info.draggingFromThisWith)} ref={magic.innerRef} {...magic.droppableProps}>
            {toDos.map((toDo, index) => (
              <DraggableCard key={toDo.id} index={index} toDoId={toDo.id} toDoText={toDo.text} />
            ))}
            {/*  keep a board size not to change*/}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
