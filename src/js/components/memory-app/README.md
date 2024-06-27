<memory-game>

A web component that represents a memory-game.

## Description of the memory-game component.

This is a custom web component that creates a memory game window and div for the game borad.
Additionally, the element has draggable functionality, which allows the user to move it around the page by clicking and dragging on it.


## Attributes

boardsize

The boardsize attribute, if present, specifies the size of the grid. Its value must be large (4x4), medium (4x2) or small (2x2).

## Properties

initialX: The initial x-coordinate of the mouse cursor when the drag starts.
initialY: The initial y-coordinate of the mouse cursor when the drag starts.
move: A flag indicating whether the element is currently being dragged.

## Examlpe

document.createElement('memory-game')

<memory-game></memory-game>