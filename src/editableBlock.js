// Imports
import React from "react";
import ContentEditable from "react-contenteditable";

import "./index.css";
import SelectMenu from "./selectMenu";

import setCaretToEnd from "./utils/setCaretToEnd";
import getCaretCoordinates from "./utils/getCaretCoordinates";

import { Draggable } from "react-beautiful-dnd";

import styled from "styled-components";

const TextArea = styled(ContentEditable)`
  background: ${(props) => (props.isDragging ? "#f8f8f8;" : "white")};
`;

const DragHandle = styled.div`
  opacity: ${(props) => (props.isDragging ? "0.4" : "0.4")};
`;

const CMD_KEY = "/";

class EditableBlock extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);

    this.onKeyUpHandler = this.onKeyUpHandler.bind(this);
    this.openSelectMenuHandler = this.openSelectMenuHandler.bind(this);
    this.closeSelectMenuHandler = this.closeSelectMenuHandler.bind(this);
    this.tagSelectionHandler = this.tagSelectionHandler.bind(this);

    this.contentEditable = React.createRef();
    this.state = {
      htmlBackup: null,
      html: "",
      tag: "p",
      selectMenuIsOpen: false,
      selectMenuPosition: {
        x: null,
        y: null,
      },
    };
  }

  componentDidMount() {
    this.setState({ html: this.props.html, tag: this.props.tag });
  }

  componentDidUpdate(prevProps, prevState) {
    const htmlChanged = prevState.html !== this.state.html;
    const tagChanged = prevState.tag !== this.state.tag;
    if (htmlChanged || tagChanged) {
      this.props.updateBlock({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag,
      });
    }
  }

  onChangeHandler(e) {
    this.setState({ html: e.target.value });
  }

  onKeyDownHandler(e) {
    if (e.key === CMD_KEY) {
      this.setState({ htmlBackup: this.state.html });
    }
    if (e.key === "Enter") {
      if (!e.shiftKey && !this.state.selectMenuIsOpen) {
        e.preventDefault();
        this.props.addBlock({
          id: this.props.id,
          ref: this.contentEditable.current,
        });
      }
    }

    if (e.key === "Backspace" && !this.state.html) {
      e.preventDefault();
      this.props.deleteBlock({
        id: this.props.id,
        ref: this.contentEditable.current,
      });
    }
  }

  onKeyUpHandler(e) {
    if (e.key === CMD_KEY) {
      this.openSelectMenuHandler();
    }
  }

  openSelectMenuHandler() {
    const { x, y } = getCaretCoordinates();
    this.setState({
      selectMenuIsOpen: true,
      selectMenuPosition: { x, y },
    });
    document.addEventListener("click", this.closeSelectMenuHandler);
  }

  closeSelectMenuHandler() {
    this.setState({
      htmlBackup: null,
      selectMenuIsOpen: false,
      selectMenuPosition: { x: null, y: null },
    });
    document.removeEventListener("click", this.closeSelectMenuHandler);
  }

  tagSelectionHandler(tag) {
    this.setState({ tag: tag, html: this.state.htmlBackup }, () => {
      setCaretToEnd(this.contentEditable.current);
      this.closeSelectMenuHandler();
    });
  }

  render() {
    return (
      <Draggable draggableId={this.props.id} index={this.props.index}>
        {(provided, snapshot) => (
          <>
            {this.state.selectMenuIsOpen && (
              <SelectMenu
                position={this.state.selectMenuPosition}
                onSelect={this.tagSelectionHandler}
                close={this.closeSelectMenuHandler}
              />
            )}
            <span
              className="flex-box"
              {...provided.draggableProps}
              ref={provided.innerRef}
              isDragging={snapshot.isDragging}
            >
              {/* <div className="together"> */}
              {/* Currently errors with the div because called nextelementsibling inside inside the div is nothing */}
              {/* <TextArea> */}
              <TextArea
                className="Block"
                innerRef={this.contentEditable}
                html={this.state.html}
                tagName={this.state.tag}
                onChange={this.onChangeHandler}
                onKeyDown={this.onKeyDownHandler}
                onKeyUp={this.onKeyUpHandler}
                isDragging={snapshot.isDragging}
              />
              {/* </TextArea> */}
              <DragHandle
                {...provided.dragHandleProps}
                isDragging={snapshot.isDragging}
              >
                {/* <i className="fa fa-bars drag-handle"></i> */}
                {/* <i className="fa-drag-handle drag-handle"></i> */}
                <i className="fa-solid fa-grip-vertical drag-handle"></i>
                {/* <FontAwesomeIcon icon="fa-solid fa-grip-vertical" /> */}
              </DragHandle>

              {/* <div>what is this </div> */}
            </span>
            {/* <div class="flex-box">
              <div {...provided.dragHandleProps}>
                <i className="fa fa-bars"></i>
              </div>
              <div>{this.props.task.content}</div>
              
            </div> */}
            {/* </div> */}
          </>
        )}
      </Draggable>
    );
  }
}

export default EditableBlock;
