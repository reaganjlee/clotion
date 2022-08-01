// Imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import ContentEditable from 'react-contenteditable'

class EditableBlock extends React.Component {
    constructor(props) {
      super(props);
      this.onChangeHandler = this.onChangeHandler.bind(this);
      this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
      this.contentEditable = React.createRef();
      this.state = {
        htmlBackup: null,
        html: "",
        tag: "p",
        previousKey: "",
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
      
      if (e.key === "/") {
        this.setState({ htmlBackup: this.state.html });
      }
      if (e.key === "Enter") {
        // if (this.state.previousKey !== "Shift" && !this.state.selectMenuIsOpen) {
        if (e.shiftKey && !this.state.selectMenuIsOpen) {
          e.preventDefault();
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
      this.setState({ previousKey: e.key });
      // }
      // this.setState(previousKey, e.key)
    }
  
    render() {
      return (
        <ContentEditable
          className="Block"
          innerRef={this.contentEditable}
          html={this.state.html}
          tagName={this.state.tag}
          onChange={this.onChangeHandler}
          onKeyDown={this.onKeyDownHandler}
        />
      );
    }
  }
  
  
  export default EditableBlock;