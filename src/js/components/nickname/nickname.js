const template = document.createElement('template')
template.innerHTML = `
<style>
.hidden {
  display:none;
}

#nick {
    position:relative;
    padding-top: 250px;
    margin: 20px;
}
.nickname {
    font-size: 20px;
    color: black;
    border: none;
   
}
.submitbutton {
width: auto;
cursor: pointer;
margin: 5px;
padding: 5px;
}

#name{
      background-color: Transparent;
        background-repeat:no-repeat;
        border: none;   
        cursor: pointer;
        width:350px;
        font-size:14pt;

      }
</style>

<form id="nick" >
  
<input placeholder="Please enter your name to start the chat" type="text" id="name" >
  
<button class= "submitbutton" type="submit" hidden>Enter</button>
</form>

`
customElements.define('the-nick-name',
  /**
   * Represents the-nick-name element.
   */
  class extends HTMLElement {
    /**
     * The name element.
     */
    name
    /**
     * The submitbutton element.
     */
    submitName
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this.name = this.shadowRoot.querySelector('#name')
      this.nick = this.shadowRoot.querySelector('#nick')
      this.nick.addEventListener('submit', (event) => {
        event.preventDefault()
        this.saveName()
      })
    }

    /**
     * Gets the nickname of the user.
     *
     * @type {string} name - The nickname of the user.
     */
    saveName (names) {
      this.nickname = names
    }
  }
)
