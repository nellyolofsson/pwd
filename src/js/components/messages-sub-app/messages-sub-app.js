import '../nickname'

const IMGURL = (new URL('./images/pen.png', import.meta.url)).href

const template = document.createElement('template')
template.innerHTML = `
<style>
      /* Add some styling for the chat window */
      #messages {
        border: 2px solid black;
        background: url("${IMGURL}");
        cursor: move;
        width: 500px;
        height: 500px;
        top: 50%;
        left: 50%;
        position: absolute;
        transform: translate(-50%, -50%);
        max-width: 100%;
        max-height: 100%;
        overflow: scroll;
      }
      #message-form {
        font-size:17pt;
        background-color: white;
      }
      #close-button {
        float: right;
        background-color: Transparent;
        background-repeat:no-repeat;
        border: none;   
        cursor: pointer;
        font-size:17pt;
      }
      #message-input {
       background-color: Transparent;
        background-repeat:no-repeat;
        border: none;
        cursor: pointer;
        outline: none;
        font-size:14pt;
        position:relative;
       padding-top: 250px;
       margin: 20px;
      }
      #form-holder {
        float:center;
       font-size: 14pt;
       top: 7%;
        left: 5%;
        position: absolute;
      }
      .hidden {
        display:none;
      }

     #nick {
    position:relative;
    padding-top: 250px;
    margin: 20px;
    }
      #emoji {
      width: auto;
      cursor: pointer;
      margin: 5px;
      padding: 5px;
     }
      #click {
    padding: 10px;
    }

    </style>
  
    <!-- Create a chat window to display messages -->
    <div id="messages" class="box" draggable="true" >
      
    <!-- Create a form for sending messages -->

    <form id="message-form">&#9993; CHAT <button id="close-button">Exit</button></form> 

  <div id="nic" hidden></div>

    <form name="publish" id="form-holder" hidden> 
     The Chat: You are connected to the server! Start talking to random strangers &#128513;
      <div id="click"></div>
    <button id="emoji"> &#128513;</button> 
      <div id="text" hidden></div>
  

      <input type="text" name="message" placeholder="Start typing.." id="message-input">
      <input type="submit" value="Send" hidden>
      
  </form>
    </div>
    

`

customElements.define('messages-app',
/**
 * Represents the messages-app element.
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
     * The form[name="publish"] element.
     *
     * @type {HTMLElement}
     */
    #form

    /**
     * The close button.
     *
     * @type {HTMLButtonElement}
     */
    #closebutton

    /**
     * The messages input field.
     *
     * @type {HTMLElement}
     */
    #messagesinput

    /**
     * The form holder for the chat.
     *
     * @type {HTMLElement}
     */
    #formholder

    /**
     * The click div that shows the messages and the username.
     *
     * @type {HTMLDivElement}
     */
    #click

    /**
     * The button for the emoji.
     *
     * @type {HTMLButtonElement}
     */
    #emoji

    /**
     * The text div that shows the emojis.
     *
     * @type {HTMLDivElement}
     */
    #text

    /**
     * The name div that shows the nick-name.
     *
     * @type {HTMLDivElement}
     */
    #name
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
      /**
       * This function is executed when the window is about to be closed or reloaded.
       * It removes the 'username' item from the local storage and returns an empty string.
       *
       * @returns {string} - an empty string.
       */
      window.onbeforeunload = function () {
        window.localStorage.removeItem('username')
        return ''
      }
      this.#text = this.shadowRoot.querySelector('#text')
      this.#emoji = this.shadowRoot.querySelector('#emoji')
      this.#emoji.addEventListener('click', (event) => {
        if (event.clientX === 0 && event.clientY === 0) {
          return
        }
        event.preventDefault()
        event.stopPropagation()
        this.#text.toggleAttribute('hidden')
      })
      this.addEventListener('dragstart', (event) => {
        // Disable element dragging.
        event.preventDefault()
        event.stopPropagation()
      })
      this.#formholder = this.shadowRoot.querySelector('#form-holder')
      this.#name = this.shadowRoot.querySelector('#nic')
      const nickname = document.createElement('the-nick-name')
      this.#name.appendChild(nickname)
      if (window.localStorage.getItem('username') !== null) {
        this.#formholder.removeAttribute('hidden')
        this.#name.setAttribute('hidden', '')
      } else {
        this.#name.removeAttribute('hidden')
      }
      nickname.addEventListener('click', (event) => {
        if (event.clientX === 0 && event.clientY === 0) {
          this.#formholder.removeAttribute('hidden')
          this.#name.setAttribute('hidden', '')
          window.localStorage.setItem('username', JSON.stringify(this.#name.firstChild.name.value))
        }
        event.preventDefault()
        event.stopPropagation()
      })
      this.#form = this.shadowRoot.querySelector('form[name="publish"]')
      this.#click = this.shadowRoot.querySelector('#click')
      this.#getEmojis()
      this.#getServer()
      this.#closebutton = this.shadowRoot.querySelector('#close-button')
      this.#closebutton.addEventListener('click', (event) => {
        this.messages.parentNode.removeChild(this.messages)
        event.preventDefault()
      })
      this.#messagesinput = this.shadowRoot.querySelector('#message-input')
      this.messages = this.shadowRoot.querySelector('#messages')
      this.messages.addEventListener('mousedown', (event) => {
        this.initialX = event.clientX
        this.initialY = event.clientY
        this.move = true
        this.#onDrag(event)
      })
      this.messages.addEventListener('mousemove', (event) => {
        this.#onDrag(event)
      })
      this.messages.addEventListener('mouseup', () => {
        this.move = false
      })
    }

    /**
     * Handles the drag event for the messages element.
     *
     * @param {Event} event - The drag event.
     */
    #onDrag (event) {
      const messages = this.shadowRoot.querySelector('#messages')
      // Get the style for the messages-id the top and left position.
      const getStyle = window.getComputedStyle(messages)
      if (this.move) {
        const left = parseInt(getStyle.left) || 0
        const top = parseInt(getStyle.top) || 0
        // Check the current left style and the current top and change the y and x position as the mouse moves, the addEventListener is in the constructor.
        messages.style.left = `${left + event.clientX - this.initialX}px`
        messages.style.top = `${top + event.clientY - this.initialY}px`
        this.initialX = event.clientX
        this.initialY = event.clientY
      }
    }

    /**
     * Connecting to the web-socket, send messages and recive messages.
     *
     */
    async #getServer () {
      // Creating a new WebSocket object.
      const socket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket')
      // The key value.
      const key = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      const data = { data: key }
      // Add event listener for open event.
      socket.addEventListener('open', () => {
        try {
          // Send data over the socket, for connection.
          socket.send(JSON.stringify({ data }))
        } catch (error) {
          console.error(error)
        }
      })
      // Add event listener for message event.
      socket.addEventListener('message', (event) => {
        try {
          /**
           * Send message over the socket on the form element.
           *
           * @param {event} event - The event for the onsubmit.
           */
          this.#form.onsubmit = (event) => {
            event.preventDefault()
            const outgoingMessage = { data: this.#form.elements.message.value, key, username: JSON.parse(window.localStorage.getItem('username')), type: 'text' }
            socket.send(JSON.stringify(outgoingMessage))
            // Clear the message input field after sending a message.
            this.#messagesinput.value = ''
          }
          /**
           * Handle incoming message and displays the username and shows the messages.
           *
           * @param {event} event - The event for the onmessage.
           *
           */
          socket.onmessage = (event) => {
            event.preventDefault()
            const message = JSON.parse(event.data)
            const messageElem = document.createElement('div')
            const username = document.createElement('p')
            // Not showing the notifications from the server for the user.
            if (message.data && message.type !== 'notification' && message.username && message.username !== 'The Server') {
              username.textContent = message.username + ': ' + message.data
              this.#click.appendChild(username)
              this.#click.appendChild(messageElem)
            }
          }
        } catch (error) {
          console.error(error)
        }
      })
    }

    /**
     * Fetch the emojis for the chat.
     *
     */
    async #getEmojis () {
      try {
        // Fetch the emojis.
        const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data')
        const data = await response.json()
        // Create an array to hold the emojis.
        const holderEmoji = []
        for (const id in data.emojis) {
          // Pick out the emojis that i want to show.
          holderEmoji.push(data.emojis[id].skins[0])
          const emoji = data.emojis[id].skins[0]
          // Append the emojis to an img.
          const img = document.createElement('img')
          img.alt = emoji.native
          // Create an button so you can click on the emojis.
          const button = document.createElement('button')
          button.appendChild(img)
          // Add Listenar to the buttons.
          button.addEventListener('click', (event) => {
            event.stopPropagation()
            event.preventDefault()
            // Set the value for the emojis so it is shown on the messages input-filed.
            let values = this.#messagesinput.value
            values += emoji.native
            this.#messagesinput.value = values
          })
          // Append the emojis to the div-element.
          this.#text.appendChild(button)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
)
