const IMGURL = (new URL('./images/nelson.png', import.meta.url)).href
const playing = (new URL('./images/cat.mp3', import.meta.url)).href
const template = document.createElement('template')
template.innerHTML = `

<style>
  #catapp {
    width: 500px;
        height: 500px;
        top: 50%;
        left: 50%;
        position: absolute;
        cursor: move;
        transform: translate(-50%, -50%);
        border: 2px solid black;
        overflow: scroll;
        background-color: rgba(131, 180, 124);
  }

  #catform {
    font-size:17pt;
        background-color: white;
  }
.container {
   font-size: 12pt;
   text-align: center;
}

img {
    width: 40%;
    display:grid;
    margin:auto;
}

.button {
    border-radius: 5px;
    margin: 5px;
    font-size: 15pt;
    cursor: pointer;  
    background-color: Transparent;
    background-repeat:no-repeat;
    border: none;   
    cursor: pointer;
}

#close-button {
        float: right;
        background-color: Transparent;
        background-repeat:no-repeat;
        border: none;   
        cursor: pointer;
        font-size:17pt;

      }


</style>
<div id="catapp" draggable="true">

<form id="catform"> &#128049; CAT-APP <button id="close-button">Exit</button></form>
<div class="container">
<h1>Cat Pics Generator</h1>
<img src="${IMGURL}">
<button class="button">Press hear for a random cat pic</button>
<div class="cat"></div>
</div>
</div>


`

customElements.define('cat-app',
  /**
   * Represents the cat-app element.
   */
  class extends HTMLElement {
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
     * The close button element.
     *
     * @type {HTMLElement}
     */
    #closebutton

    /**
     * The button element that fetches cat pictures.
     *
     * @type {HTMLElement}
     */
    #button

    /**
     * The element that displays the cat pictures.
     *
     * @type {HTMLElement}
     */
    #catIMG

    /**
     * The main cat app element.
     *
     * @type {HTMLElement}
     */
    catapp
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.#closebutton = this.shadowRoot.querySelector('#close-button')
      this.#closebutton.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        this.remove(this.catapp)
      })
      this.catapp = this.shadowRoot.querySelector('#catapp')
      this.#catIMG = this.shadowRoot.querySelector('.cat')
      const audio = new Audio(playing)
      this.#button = this.shadowRoot.querySelector('.button')
      this.#button.addEventListener('click', (event) => {
        event.preventDefault()
        audio.play()
      })
      this.#button.addEventListener('click', async (event) => {
        event.preventDefault()
        this.fetchPics()
      })
      this.addEventListener('dragstart', (event) => {
        // Disable element dragging.
        event.preventDefault()
        event.stopPropagation()
      })
      this.catapp.addEventListener('mousedown', (event) => {
        this.initialX = event.clientX
        this.initialY = event.clientY
        this.move = true
        this.#onDrag(event)
      })
      this.catapp.addEventListener('mousemove', (event) => {
        this.#onDrag(event)
      })
      this.catapp.addEventListener('mouseup', () => {
        this.move = false
      })
    }

    /**
     * Fetches cat pictures from the cat API and displays them.
     */
    async fetchPics () {
      this.#catIMG.textContent = ''
      const response = await window.fetch('https://api.thecatapi.com/v1/images/search')
      const data = await response.json()
      const mycats = data[0].url
      const catpic = document.createElement('img')
      catpic.setAttribute('src', `${mycats}`)
      this.#catIMG.appendChild(catpic)
      return data
    }

    /**
     * Handles the drag event for the cat element.
     *
     * @param {Event} event - The drag event.
     */
    #onDrag (event) {
      const cat = this.shadowRoot.querySelector('#catapp')
      const getStyle = window.getComputedStyle(cat)
      if (this.move) {
        const left = parseInt(getStyle.left) || 0
        const top = parseInt(getStyle.top) || 0
        cat.style.left = `${left + event.clientX - this.initialX}px`
        cat.style.top = `${top + event.clientY - this.initialY}px`
        this.initialX = event.clientX
        this.initialY = event.clientY
      }
    }
  }
)
