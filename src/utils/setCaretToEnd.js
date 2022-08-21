const setCaretToEnd = (element) => {
      // Create a new range
      const range = document.createRange();
      // Get the selection object
      const selection = window.getSelection();
      // Select all the content from the contenteditable element
      range.selectNodeContents(element);
      // Collapse it to the end, i.e. putting the cursor to the end
      range.collapse(false);
      // Clear all existing selections
      selection.removeAllRanges();
      // Put the new range in place
      selection.addRange(range);
      // Set the focus to the contenteditable element
      element.focus();
    };

export default setCaretToEnd;