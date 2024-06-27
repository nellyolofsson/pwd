<cat-app> 

A web component that represents a cat-app.

## Description of the cat-app component.

The cat-app element is an HTML custom element that displays a simple cat picture generator app. When the element is first loaded, it displays a cat picture and a button to fetch a new cat picture. When the button is clicked, the fetchPics function is called to retrieve a new cat picture and a sound is playing. The element also includes a close button that can be used to remove the element from the page. Additionally, the element has draggable functionality, which allows the user to move it around the page by clicking and dragging on it.

## Properties

initialX: The initial x-coordinate of the mouse cursor when the drag starts.
initialY: The initial y-coordinate of the mouse cursor when the drag starts.
move: A flag indicating whether the element is currently being dragged.

## Example

document.createElement('cat-app')

<cat-app></cat-app>


