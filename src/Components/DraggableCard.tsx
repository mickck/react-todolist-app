import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div`
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 8px 10px;
`;

interface IDDragabbleCardPros {
  toDo: string;
  index: number;
}

function DraggableCard({ toDo, index }: IDDragabbleCardPros) {
  return (
    //key and dgraggableID need to be same
    <Draggable key={toDo} draggableId={toDo} index={index}>
      {(magic) => (
        <Card ref={magic.innerRef} {...magic.dragHandleProps} {...magic.draggableProps}>
          {toDo}
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);
