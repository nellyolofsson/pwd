const template = document.createElement('template')
template.innerHTML = `
<style>

#tile {
  display: inline-block;
  height: 80px;
  width: 80px;
  border: solid 1px #767676;
  border-radius: 10px;
  outline: none;
  background-color: #fff;
  cursor: pointer;
  box-shadow: 0px 0 10px #ccc;
  transition: 1s;
  top: 0;
  left: 0;
        
}
#tile[flipped] {
  transform: rotateY(180deg);
}

#tile[flipped] #front {
  display: none;
}

#tile[flipped] #back {
  background-color: white;
  display: inline-block;
}


#tile[disabled] {
  cursor: default;
  pointer-events: none;
  user-select: none;
  box-shadow: none;
}

#tile[hide] {
      cursor: default;
      pointer-events: none;
      box-shadow: none;
      border-style: dotted;
      border-color: #858585;
    }

#tile[hide] slot {
  visibility: hidden;
}

#tile:focus {
       box-shadow: 0px 0 10px red;
     }


#front,
#back {
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  border-radius: 5px;
  margin: 2px;
}

#back {
   background-color: #fff;
   display:none;
}

 slot {
  justify-content: center;
  align-items: center;
}

slot >* {
  max-width: 100%;
  max-height: 100%;
}

 ::slotted(img) {
  max-width: 100%;
  max-height: 100%;
}

  </style> 
 
<button part="tile-main" id="tile">
<div part="tile-front" id="front"> 
    </div>
    <div part="tile-back" id="back"> 
     <slot></slot>
  </div>
  </button>
 
`
customElements.define('memory-flipping',
  /**
   * Represents a flipping tile.
   */
  class extends HTMLElement {
    /**
     * The button for the memory-game.
     *
     * @type {HTMLButtonElement}
     */
    button
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.button = this.shadowRoot.querySelector('button')
      this.button.addEventListener('click', (event) => {
      // Check if only the main button was pressed, and no other buttons or keys were pressed.
      // It checks if the event.button is equal to 0, which means that the primary button (usually left button) is pressed.
      // It checks if event.buttons is less than 2, which means that only one button is pressed.
      // It checks if altKey, ctrlKey, metaKey, and shiftKey are all false, which means that no other keys are pressed with the button.
        if (event.button === 0 &&
          event.buttons < 2 &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey) {
          // If all conditions are true, it will call the "#flipCard" function which will toggle the flipped attribute of the button and raise the memory-flipping:flipp event.
          this.#flipCard()
        }
      })
    }

    /**
     * Toggles the flipped attribute of the button and dispatches a custom event.
     *
     */
    #flipCard () {
      // Do not do anything if the element is disabled or hidden.
      if (!this.button.hasAttribute('disabled') && !this.button.hasAttribute('hide')) {
        // It toggles the "flipped" attribute of the button, meaning it will add the attribute if it's not present, and remove it if it is.
        this.button.toggleAttribute('flipped')
        // Raise the memory-flipping:flip event.
        // It dispatches a custom event called 'memory-flipping:flipp' with the bubbles option set to true, this event can be listened by other parts of the code, and the event object contains a detail object with the flipped state of the button and the tile object.
        this.dispatchEvent(new CustomEvent('memory-flipping:flipp', {
          bubbles: true,
          detail: { flipped: this.button.hasAttribute('flipped'), tile: this }
        }))
      }
    }

    /**
     * Check if the button has flipped attribute.
     *
     * @returns {boolean} - Returns true if the button has the flipped attribute, false otherwise.
     */
    flipBack () {
      return this.button.hasAttribute('flipped')
    }

    /**
     * Check if the button has hide attribute.
     *
     * @returns {boolean} - Returns true if the button has the hide attribute, false otherwise.
     */
    checkMatch () {
      return this.button.hasAttribute('hide')
    }

    /**
     * Toggles the disabled attribute of the button.
     *
     */
    hideDisabledAttribute () {
      // Toggle an attribute on or off, meaning if the attribute is present it will remove it, if it's not it will add it.
      this.button.toggleAttribute('disabled')
    }

    /**
     * Toggles the flipped attribute of the button.
     *
     */
    restart () {
      this.button.toggleAttribute('flipped')
    }

    /**
     * Toggles the hide attribute of the button.
     *
     */
    show () {
      this.button.toggleAttribute('hide')
    }
  }
)
