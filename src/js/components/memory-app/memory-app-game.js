
import '../memory-flipping'

const images = 9

const IMGURLS = new Array(images)
for (let i = 0; i < images; i++) {
  IMGURLS[i] = (new URL(`./images/${i}.png`, import.meta.url)).href
}
const template = document.createElement('template')
template.innerHTML = `
  <style>
    #memory { 
      background-color: rgba(131, 180, 124);
        border: 2px solid black;
        cursor: move;
        width: 500px;
        height: 500px;
        top: 50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
        overflow: scroll;
        
      }
    :host {
      --tile-size: 100px;
    }
    #game {
      display: grid;
      justify-content: center;
      align-items: center;
      grid-template-columns: repeat(4, var(--tile-size));
      grid-template-rows: repeat(4, var(--tile-size));
      gap: 20px;
    }

    #game.small {
  grid-template-columns: repeat(2, var(--tile-size));
    }

    #game.medium {
  grid-template-columns: repeat(4, var(--tile-size));
  grid-template-rows: repeat(2, var(--tile-size));
}

  #memory-form {
        font-size:17pt;
        background-color: white;
      }

  #options-button {
        float: center;
        background-color: Transparent;
        background-repeat:no-repeat;
        border: none;   
        cursor: pointer;
        font-size:17pt;
  }

  #options-menu {
    display: none;
  }


      #close-button {
        float: right;
        background-color: Transparent;
        background-repeat:no-repeat;
        border: none;   
        cursor: pointer;
        font-size:17pt;
      }
      #gamefinish {
        float: center;
        background-color: Transparent;
        background-repeat:no-repeat;
        border: none;   
        cursor: pointer;
        font-size:17pt;
      }

      memory-flipping::part(tile-front) {
      background: url("${IMGURLS[0]}"), no-repeat center/100%;
      background-size: cover;
    }
    
  </style>

<div id="memory" draggable="true">
<form id="memory-form">&#127918; MEMORY 
  <button id="options-button">Options
  <div id="options-menu" >
  <label>
   <input  type="radio" name="boardsize" value="small" > Small (2x2) 
  </label>
  <br>
  <label>
    <input type="radio" name="boardsize" value="medium" > Medium (4x2)
  </label>
  <br>
  <label>
    <input type="radio" name="boardsize" value="large" > Large (4x4)
  </label>
</div>
  </button>
<button id="gamefinish">Restart</button>
<button type="submit" id="close-button" >Exit</button></form> 

<div id="game" ></div>
  </form>
  </div>
 
`

/*
 * Define custom element.
 */
customElements.define('memory-game',
  /**
   * Represents a memory game
   */
  class extends HTMLElement {
    /**
     * The game board element.
     *
     * @type {HTMLDivElement}
     */
    #game
    /**
     * The initial x-coordinate of the mouse cursor when the drag starts.
     *
     * @type {number}
     */
    initialX = 0

    /**
     * The initial y-coordinate of the mouse cursor when the drag starts.
     *
     * @type {number}
     */
    initialY = 0

    /**
     * A flag indicating whether the element is currently being dragged.
     *
     * @type {boolean}
     */
    move = false

    /**
     * The restart button.
     *
     * @type {HTMLButtonElement}
     */
    #gamefinish

    /**
     * The close button.
     *
     * @type {HTMLButtonElement}
     */
    #closebutton

    /**
     * The option button.
     *
     * @type {HTMLButtonElement}
     */
    #optionsbuttons

    /**
     * The menu for the board-sizes.
     *
     * @type {HTMLDivElement}
     */
    #optionsmenu

    /**
     * The [name="boardsize"] value.
     *
     * @type {HTMLElement}
     */
    #nameBoardSize

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#gamefinish = this.shadowRoot.querySelector('#gamefinish')
      this.#gamefinish.addEventListener('click', (event) => {
        event.preventDefault()
        this.#reset()
      })
      this.#closebutton = this.shadowRoot.querySelector('#close-button')
      this.#closebutton.addEventListener('click', (event) => {
        event.preventDefault()
        this.remove(this.memory)
      })
      this.#optionsmenu = this.shadowRoot.querySelector('#options-menu')
      this.#optionsbuttons = this.shadowRoot.querySelector('#options-button')
      this.#optionsbuttons.addEventListener('click', (event) => {
        event.preventDefault()
        this.#optionsmenu.style.display = this.#optionsmenu.style.display === 'none' ? 'block' : 'none'
      })
      this.#nameBoardSize = this.shadowRoot.querySelectorAll('[name="boardsize"]')
      for (const button of this.#nameBoardSize) {
        // Set the value to the radio-buttons.
        button.setAttribute('boardsize', button.value)
        button.addEventListener('keydown', (event) => {
          if (event.keyCode === 13) {
            this.boardSize = event.target.value
          }
        })
        button.addEventListener('click', (event) => {
          this.boardSize = event.target.value
        })
      }
      this.#game = this.shadowRoot.querySelector('#game')
      this.#game.addEventListener('memory-flipping:flipp', (event) => {
        event.preventDefault()
        this.#tiles.all.forEach((tile) => {
          tile.hideDisabledAttribute()
        })
        window.setTimeout(() => {
          if (this.lastcclick === undefined) {
            this.lastcclick = event.detail.tile
          } else {
            this.#checkValue(this.lastcclick, event.detail.tile)
            this.lastcclick = undefined
          }
          this.#tiles.all.forEach((tile) => tile.hideDisabledAttribute())
        }, 1000)
      })
      this.addEventListener('dragstart', (event) => {
        // Disable element dragging.
        event.preventDefault()
        event.stopPropagation()
      })
      this.memory = this.shadowRoot.querySelector('#memory')
      this.memory.addEventListener('mousedown', (event) => {
        this.initialX = event.clientX
        this.initialY = event.clientY
        this.move = true
        this.#onDrag(event)
      })
      this.memory.addEventListener('mousemove', (event) => {
        this.#onDrag(event)
      })
      this.memory.addEventListener('mouseup', () => {
        this.move = false
      })
    }

    /**
     * Get the board-size.
     *
     * @returns {string} - the attribute to the borad-size.
     */
    get boardSize () {
      return this.getAttribute('boardsize')
    }

    /**
     * Set the board-size value.
     *
     */
    set boardSize (value) {
      this.setAttribute('boardsize', value)
    }

    /**
     * The name to be observerd.
     *
     * @returns {string[]} - A string array of attribute to monitor.
     */
    static get observedAttributes () {
      return ['boardsize']
    }

    /**
     * Returns an object with the dimensions of the game board.
     *
     * @returns {object} - An object with the following properties width and height for the game-borad.
     */
    get #boardSize () {
      let width = 4
      let height = 4
      switch (this.boardSize) {
        case 'small':
          width = height = 2
          break
        case 'medium':
          height = 2
          break
        case 'large':
          width = height = 4
      }
      return { width, height }
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'boardsize') {
        this.#game.textContent = ''
        this.#reset()
      }
    }

    /**
     * Get all the tiles from the game-board.
     *
     * @returns {object} - with all the tiles.
     */
    get #tiles () {
      const tiles = Array.from(this.#game.childNodes)

      return {
        all: tiles
      }
    }

    /**
     * The restart button and adding tiles to the game.
     *
     */
    #reset () {
      // Getting the real width and height from the boardsize.
      const { width, height } = this.#boardSize
      // Getting the height and width
      const counter = width * height
      // Coping the array tile.
      const allTiles = Array.from(this.#tiles.all)
      // Restart the tiles if they all are hidden and flipped.
      if (allTiles.every(tile => tile.flipBack())) {
        allTiles.forEach(tile => tile.restart())
        allTiles.forEach(tile => tile.show())
      }
      // Remove the tiles when game is finsh else they will be dublicated.
      if (counter !== this.#tiles.all.length) {
        while (this.#game.firstChild) {
          this.#game.remove(this.#game.childNodes)
        }
        // Change the small bordsizie so it is 2*2.
        if (width === 2) {
          this.#game.classList.add('small')
        } else {
          this.#game.classList.remove('small')
        }
        // Adding tiles to the game-board, and img bescuse i dont have an img-tag in the html.
        for (let i = 0; i < counter; i++) {
          const tile = document.createElement('memory-flipping')
          const img = document.createElement('img')
          tile.appendChild(img)
          this.#game.appendChild(tile)
        }
      }
      // The starttime and attempts
      this.starttime = new Date().getTime()
      this.attempts = 0

      // Shuffle  all the tiles.
      const indexes = [...Array(counter).keys()]
      indexes.sort(() => Math.random() - 0.5)

      // Update images and setattribute img, setattribute data-value so i can find match.
      this.#tiles.all.forEach((tile, i) => {
        const same = indexes[i] % (counter / 2) + 1
        tile.querySelector('img').setAttribute('src', IMGURLS[same])
        tile.setAttribute('data-value', same)
      })
    }

    /**
     * Check if the attibute data-value is a match.
     *
     * @param {string} src1 - The fisrt image that the user picks.
     * @param {string} src2 - The second image that the user picks.
     */
    #checkValue (src1, src2) {
      // Adding the attemps here.
      this.attempts++
      if (src1.getAttribute('data-value') === src2.getAttribute('data-value')) {
        src1.show()
        src2.show()
        this.#checkIfallIsMatch()
      } else {
        src1.restart()
        src2.restart()
      }
    }

    /**
     * Check if the tiles are a match and show time and attempts it took to finish the game.
     */
    #checkIfallIsMatch () {
      const allTiles = Array.from(this.#tiles.all)
      if (allTiles.every(tile => tile.checkMatch())) {
        let endTime = new Date().getTime() - this.starttime
        endTime = endTime / 1000
        const message = `You finished the game in ${endTime} seconds! and ${this.attempts} attempts! Nice! `
        window.alert(message)
      }
    }

    /**
     * Handles the drag event for the cat element.
     *
     * @param {Event} event - The drag event.
     */
    #onDrag (event) {
      const memory = this.shadowRoot.querySelector('#memory')
      // Get the style for the memory the top and left position.
      const getStyle = window.getComputedStyle(memory)
      // If this move is true
      if (this.move) {
        const left = parseInt(getStyle.left) || 0
        const top = parseInt(getStyle.top) || 0
        // Check the current left style and the current top and change the y and x position as the mouse moves, the addEventListener is in the constructor.
        memory.style.left = `${left + event.clientX - this.initialX}px`
        memory.style.top = `${top + event.clientY - this.initialY}px`
        this.initialX = event.clientX
        this.initialY = event.clientY
      }
    }
  }
)
