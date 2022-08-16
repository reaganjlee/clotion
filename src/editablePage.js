// Imports
import React from "react";
// import ReactDOM from 'react-dom/client';
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
    console.log("UpdatedBlock looks like: ", updatedBlock);
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
    // Logger.info("OMG! Check this window out!", window);
    // console.log("current block is: ", currentBlock);
    const uid_value = uid();
    // console.warn("uid_value is: ", uid_value);
    const newBlock = { id: uid_value, key: uid_value, html: "", tag: "p" };
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    // console.log("UpdatedBlocks before: ", updatedBlocks);
    updatedBlocks.splice(index + 1, 0, newBlock);
    // console.log("UpdatedBlocks after: ", updatedBlocks);
    // this.setState
    // console.log("current block is: ", currentBlock);
    this.setState({ blocks: updatedBlocks }, () => {
      console.log("current block is: ", currentBlock);
      console.log("currentBlock nextElementsibling is: ", currentBlock.ref.nextElementSibling);
      console.log("newBlock is: ", newBlock);

      console.warn("currentblock.parents is: ", currentBlock.ref.parentElement);
      console.warn("currentblock.parent.parent is: ", currentBlock.ref.parentElement.parentElement);
      console.log("currentblock.parent.nextelementsibling is: ", currentBlock.ref.parentElement.nextElementSibling);
      // console.log("currentBlock next next Elementsibling is: ", currentBlock.ref.nextElementSibling.nextElementSibling);
      
      // console.log("updated blocks is: ", updatedBlocks);
      // If I have a second div for the button, I can just call nextelementSibling twice

      // what gets passed in is the contenteditable which is a editableBlock ref/prop. so instead had to get the 
      // next item based upon this block itself, can't just pass in the div.
      //original
      // currentBlock.ref.nextElementSibling.focus();
      // others

      // currentBlock.ref.nextElementSibling.contentEditable.current.focus();
      // newBlock.focus();
      // const testContainer = document.querySelector('#test');
      const nextElementSibling = currentBlock.ref.parentElement.nextElementSibling;
      const textBlockElement = nextElementSibling.querySelector('.Block');


      textBlockElement.focus();
    });
  }

  deleteBlockHandler(currentBlock) {
    const previousBlockSibling = currentBlock.ref.parentElement.previousElementSibling;
    const previousBlock = previousBlockSibling.querySelector('.Block');
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
    // const { source, destination } = result;
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // const droppableColumn = this.state.columns[source.droppableId];
    const newBlocks = Array.from(this.state.blocks);
    console.log("newBlocks is: ", newBlocks);

    const removedBlock = newBlocks.splice(source.index, 1);
    // If statement just in case
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
                  // console.log("loading block: ", index, ", ", block);
                  // console.log("block with index ", index, " has id of: ", block.id);
                  return (
                    <EditableBlock
                      key={block.key}
                      id={block.id}
                      tag={block.tag}
                      html={block.html}
                      index = {index}
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
