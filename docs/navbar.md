# Navbar customization

[[toc]]

## Core buttons

The `navbar` option is an array which can contain the following elements:

  - `autorotate` : toggles the automatic rotation
  - `zoomOut` : zooms in
  - `zoomRange` : zoom slider
  - `zoomIn` :  zooms out
  - `download` : download the source image
  - `markers` : toggles the markers
  - `markersList` : shows the markers list
  - `caption` : the caption
  - `gyroscope` : toggles the gyrscope
  - `stereo` : toggles stereo view (VR)
  - `fullscreen` : toggles fullscreen view


## Custom buttons

You can also add as many custom buttons you want. A Custom buttons is an object with the following options.

#### `content` (required)
- type : `string`

Content of the button

#### `onClick` (required)
- type : `function`

Function called when the button is clicked.

#### `id`
- type : `string`

Unique identifier of the button, usefull when using the `navbar.getButton()` method.

#### `title`
- type : `string`

Tooltip displayed when the mouse is over the button.

#### `className`
- type : `string`

CSS class added to the button.

#### `disabled`
- type : `boolean`
- default : `false`

Initially disable the button.

#### `hidden`
- type : `boolean`
- default : `false`

Initially hide the button.


## Example

This example uses some core buttons, the caption and a custom button.

```js
new PhotoSphereViewer.Viewer({
  navbar: [
    'autorotate',
    'zoom',
    'markers',
    {
      id: 'my-button',
      content: 'Custom',
      title: 'Hello world',
      className: 'custom-button',
      onClick: () => {
        alert('Hello from custom button');
      }
    },
    'caption',
    'fullscreen'
  ]
});
```
