// Imports
import React from 'react';
// import ReactDOM from 'react-dom/client';
import EditableBlock from "./editableBlock";

import "./index.css";
import uid from "./utils/uid"

const initialBlock = { id: uid, html: "", tag: "p" };

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
      html: updatedBlock.html
    };
    this.setState({ blocks: updatedBlocks });
  }

  addBlockHandler(currentBlock) {
    // Logger.info("OMG! Check this window out!", window);
    const newBlock = { id: uid, html: "", tag: "p" };
    const blocks = this.state.blocks;
    const index = blocks.map((b) => b.id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    this.setState({ blocks: updatedBlocks }, () => {
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

  render() {
  //   return (
  //     <div className="Page">
  //       {this.state.blocks.map((block, key) => {
  //         return (
  //           <EditableBlock
  //             key={key}
  //             id={block.id}
  //             tag={block.tag}
  //             html={block.html}
  //             updatePage={this.updatePageHandler}
  //             addBlock={this.addBlockHandler}
  //             deleteBlock={this.deleteBlockHandler}
  //           />
  //         );
  //       })}
  //     </div>
  //   );
  // }
    return (
      <div className="Page">
        {this.state.blocks.map((block, key) => {
          return (
            // <EditableBlock
            //   className="Block"
            //   innerRef={this.contentEditable}
            //   html={this.state.html}
            //   tagName={this.state.tag}
            //   onChange={this.onChangeHandler}
            //   onKeyUp={this.onKeyUpHandler}
            //   onKeyDown={this.onKeyDownHandler}
            // />
            <EditableBlock
              key={key}
              id={block.id}
              tag={block.tag}
              html={block.html}
              updatePage={this.updatePageHandler}
              addBlock={this.addBlockHandler}
              deleteBlock={this.deleteBlockHandler}
            />
          );
        })}
      </div> 
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