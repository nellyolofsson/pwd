
import '../memory-app/memory-app-game'

const template = document.createElement('template')
template.innerHTML = `

<style>
#dockblock {
   background-color: rgba(131, 180, 124, 0.4);
   text-align: center;
   border: 2px solid black;
}

.dockitem {
    display:inline-block;
    margin: 20px;
}
.chat {
  background-color: transparent;
    background-repeat:no-repeat;
    border: none;   
    cursor: pointer; 
}


  
.memory {
  background-color: transparent;
    background-repeat:no-repeat;
    border: none;   
    cursor: pointer;
}

.cat {
  background-color: transparent;
    background-repeat:no-repeat;
    border: none;   
    cursor: pointer;
}

  

</style>

<div id="dockblock">
  
  <form class="dockitem" id="click-chat">
  <button class="chat" type="submit">
    
    <span style='font-size:100px;'>&#9993;</span>
</button>
</form>


<form class="dockitem" id="click-memory" >
    <button class="memory" type="submit">
   
    <span style='font-size:100px;'>&#127918;</span> 
  </button>
</form>

 
  <form class="dockitem" id="click-cat">
  <button class="cat" type="submit">
 
    <span style='font-size:100px;'>&#128049;</span>
</button>
</form>
  </div>

`

customElements.define('window-app',
  /**
   * Represents window-app element.
   */
  class extends HTMLElement {
    /**
     * A form element used to launch the messages sub-application.
     *
     * @type {HTMLFormElement}
     */
    #dockchat

    /**
     * A form element used to launch the cat sub-application.
     *
     * @type {HTMLFormElement}
     */
    #dockcat

    /**
     * A form element used to launch the memory game sub-application.
     *
     * @type {HTMLFormElement}
     */
    #dockmemory
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
        // Get elements within shadow root and set up event listeners.
      this.#dockchat = this.shadowRoot.querySelector('#click-chat')
      this.#dockchat.addEventListener('submit', (event) => {
        event.preventDefault()
        const chat = document.createElement('messages-app')
        this.shadowRoot.appendChild(chat)
        chat.messages.style.left = Math.random() * 20 + 50 + '%'
        chat.messages.style.top = '70%'
      })
      this.#dockmemory = this.shadowRoot.querySelector('#click-memory')
      this.#dockmemory.addEventListener('submit', (event) => {
        event.preventDefault()
        const memory = document.createElement('memory-game')
        this.shadowRoot.appendChild(memory)
        // This code is positioning the memory game element in a random horizontal position with a fixed vertical position (70%) within its parent container.
        memory.memory.style.left = Math.random() * 20 + 40 + '%'
        // Returns a random number between 0 and 1, multiplied by 20 and then having 40 added to it.
        memory.memory.style.top = '70%'
      })
      this.#dockcat = this.shadowRoot.querySelector('#click-cat')
      this.#dockcat.addEventListener('submit', (event) => {
        event.preventDefault()
        const cat = document.createElement('cat-app')
        this.shadowRoot.appendChild(cat)
        cat.catapp.style.left = Math.random() * 20 + 30 + '%'
        cat.catapp.style.top = '70%'
      })
    }
  }
)
