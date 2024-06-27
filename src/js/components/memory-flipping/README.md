<memory-flipping>

A web component that represents a memory-flipping.

## Description of the memoery-flipping component.

This is a custom web component that creates a button an tiles to flipp.

## Attributes

disabled

A boolean attribute which, if present, indicates that the user should not be able to interact with the element.
Default value: undefined

flipped

A boolean attribute which, if present, renders the element faced up, showing its front.
Default value: undefined

hide

A boolean attribute which, if present, hides the inner of the element and renders an outline.
Default value: undefined

## Events

Event name: memory-flipping:flipp
Fired when: The tile is flipped.

## Styling with CSS

The main element (button) is styleable using the part tile-main.
The front element (div) is styleable using the part tile-front.
The back element (div) is styleable using the part tile-back.

## Example 

document.createElement('memory-flipping')

<memory-flipping></memory-flipping>
