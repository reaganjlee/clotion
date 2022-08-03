const getCaretCoordinates = () => {
    // export function getCaretCoordinates() {
      let x, y;
      const isSupported = typeof window.getSelection !== "undefined";
      if (isSupported) {
        const selection = window.getSelection();
        // Check if there is a selection (i.e. cursor in place)
        if (selection.rangeCount !== 0) {
          // Clone the range
          const range = selection.getRangeAt(0).cloneRange();
          // Collapse the range to the start, so there are not multiple chars selected
          range.collapse(false);
          // getCientRects returns all the positioning information we need
          const rect = range.getClientRects()[0];
          if (rect) {
            x = rect.left;
            y = rect.top;
          }
        }
      }
      return { x, y };
    };

    export default getCaretCoordinates;