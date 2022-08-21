// Imports
import React from "react";

import EditableBlock from "./editableBlock";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import "./index.css";
import uid from "./utils/uid";

const initialBlock = { id: uid(), html: "", tag: "p" };

class EditablePage extends React.Component {
  constructor(props) {
    super(props);
    this.updateBlockHandler = this.updateBlockHandler.bind(this);
    this.addBlockHandler = this.addBlockHandler.bind(this);
    this.deleteBlockHandler = this.deleteBlockHandler.bind(this);
    this.state = { blocks: [initialBlock] };
  }

  updateBlockHandler(updatedBlock) {
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(updatedBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: updatedBlock.tag,
      html: updatedBlock.html,
    };
    this.setState({ blocks: updatedBlocks });
  }

  addBlockHandler(currentBlock) {
    const uid_value = uid();
    const newBlock = { id: uid_value, key: uid_value, html: "", tag: "p" };
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    this.setState({ blocks: updatedBlocks }, () => {
      const nextElementSibling =
        currentBlock.ref.parentElement.nextElementSibling;
      const textBlockElement = nextElementSibling.querySelector(".Block");

      textBlockElement.focus();
    });
  }

  deleteBlockHandler(currentBlock) {
    const previousBlockSibling =
      currentBlock.ref.parentElement.previousElementSibling;
    const previousBlock = previousBlockSibling.querySelector(".Block");
    if (previousBlock) {
      const blocks = this.state.blocks;
      const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      this.setState({ blocks: updatedBlocks }, () => {
        setCaretToEnd(previousBlock);
        previousBlock.focus();
      });
    }
  }

  onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newBlocks = Array.from(this.state.blocks);

    const removedBlock = newBlocks.splice(source.index, 1);
    if (removedBlock) {
      newBlocks.splice(destination.index, 0, removedBlock[0]);
    }

    this.setState({ blocks: newBlocks });
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="Page">
          <Droppable droppableId="hard-coded-droppable-id" type="TASK">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {this.state.blocks.map((block, index) => {
                  return (
                    <EditableBlock
                      key={block.key}
                      id={block.id}
                      tag={block.tag}
                      html={block.html}
                      index={index}
                      updateBlock={this.updateBlockHandler}
                      addBlock={this.addBlockHandler}
                      deleteBlock={this.deleteBlockHandler}
                    />
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    );
  }
}

const setCaretToEnd = (element) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  element.focus();
};

export default EditablePage;
