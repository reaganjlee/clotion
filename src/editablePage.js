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
    this.updatePageHandler = this.updatePageHandler.bind(this);
    this.addBlockHandler = this.addBlockHandler.bind(this);
    this.deleteBlockHandler = this.deleteBlockHandler.bind(this);
    this.state = { blocks: [initialBlock] };
  }

  updatePageHandler(updatedBlock) {
    // Logger.debug("This debug msg is in updatePageHandler")
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
      // console.log("current block is: ", currentBlock);
      // console.log("updated blocks is: ", updatedBlocks);
      currentBlock.ref.nextElementSibling.focus();
    });
  }

  deleteBlockHandler(currentBlock) {
    const previousBlock = currentBlock.ref.previousElementSibling;
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
                      updatePage={this.updatePageHandler}
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
