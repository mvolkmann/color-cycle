# color-cycle

  A test of the component tool from TJ Holowaychuk.
  For an example of using this, see the mvolkmann/component-app repo.

## Installation

  $ component install mvolkmann/color-cycle

## API

  ```javascript
  var cc = require('color-cycle');

  // Get component HTML and appends to document.
  $('body').append($(cc.getHtml()));

  // Set up event handling.
  cc.setup();
  ```

## License

  MIT
