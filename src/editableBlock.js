// Imports
import React from 'react';
import ContentEditable from 'react-contenteditable'

// import ReactDOM from 'react-dom/client';
import "./index.css";
import SelectMenu from "./selectMenu";

// import getCaretCoordinates, { setCaretToEnd } from "./utils/caretHelpers";
// import * from "./utils/caretHelpers";
// import * as carethelpers from "./utils/caretHelpers";
// import setCaretToEnd  from './utils/caretHelpers';
// import getCaretCoordinates  from './utils/caretHelpers';

import setCaretToEnd  from './utils/setCaretToEnd';
import getCaretCoordinates  from './utils/getCaretCoordinates';


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
      // previousKey: "",
      selectMenuIsOpen: false,
      selectMenuPosition: {
        x: null,
        y: null
      }
    };
  }

  componentDidMount() {
    this.setState({ html: this.props.html, tag: this.props.tag });
  }

  componentDidUpdate(prevProps, prevState) {
    const htmlChanged = prevState.html !== this.state.html;
    const tagChanged = prevState.tag !== this.state.tag;
    if (htmlChanged || tagChanged) {
      this.props.updatePage({
        id: this.props.id,
        html: this.state.html,
        tag: this.state.tag
      });
    }
  }

  onChangeHandler(e) {
    this.setState({ html: e.target.value });
  }

  // render() {
  //   console.log("This is returning an editable above this?")
  //   return (
  //       <ContentEditable
  //         className="Block"
  //         innerRef={this.contentEditable}
  //         html={this.state.html}
  //         tagName={this.state.tag}
  //         onChange={this.onChangeHandler}
  //       />
        
  //   );
  // }
  onKeyDownHandler(e) {
    if (e.key) {
      console.log(e.key)
    }
    // if (e.key === CMD_KEY) {
    //   // If the user starts to enter a command, we store a backup copy of
    //   // the html. We need this to restore a clean version of the content
    //   // after the content type selection was finished.
    //   this.setState({ htmlBackup: this.state.html });
    // }
    
    if (e.key === CMD_KEY) {
      // console.log("cmd key pressed, state before: ",this.state.htmlBackup)
      this.setState({ htmlBackup: this.state.html });
      // console.log("cmd key pressed, state after: ", this.state.htmlBackup)
    }
    if (e.key === "Enter") {
      // if (this.state.previousKey !== "Shift" && !this.state.selectMenuIsOpen) {
      console.log("shiftKey: ", e.shiftKey)
      console.log("selectMenuIsOpen: ", this.state.selectMenuIsOpen)
      if (!e.shiftKey && !this.state.selectMenuIsOpen) {
        
        e.preventDefault();
        // console.log("add block this is: ", this);
        // console.log("add block contenteditable is: ", this.contentEditable);
        this.props.addBlock({
          id: this.props.id,
          ref: this.contentEditable.current
        });
      }
    }
    
    if (e.key === "Backspace" && !this.state.html) {
      e.preventDefault();
      this.props.deleteBlock({
        id: this.props.id,
        ref: this.contentEditable.current
      });
    }
    // if (!(this.state.previousKey === "Shift" && e.key === "Enter")) {
    // this.setState({ previousKey: e.key });
    // }
    // this.setState(previousKey, e.key)
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
      selectMenuPosition: { x, y }
    });
    document.addEventListener("click", this.closeSelectMenuHandler);
  }

  closeSelectMenuHandler() {
    this.setState({
      htmlBackup: null,
      selectMenuIsOpen: false,
      selectMenuPosition: { x: null, y: null }
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
      <>
        {this.state.selectMenuIsOpen && (
          <SelectMenu
            position={this.state.selectMenuPosition}
            onSelect={this.tagSelectionHandler}
            close={this.closeSelectMenuHandler}
          />
        )}
        <ContentEditable
          className="Block"
          innerRef={this.contentEditable}
          html={this.state.html}
          tagName={this.state.tag}
          onChange={this.onChangeHandler}
          onKeyDown={this.onKeyDownHandler}
          onKeyUp={this.onKeyUpHandler}
        />
        {/* <div>
                <i className="fa fa-bars"></i>
              </div> */}
      </>
    );
  }
}
  

export default EditableBlock;