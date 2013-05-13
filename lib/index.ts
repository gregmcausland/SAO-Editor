/// <reference path="view.ts" />
/// <reference path="inputhandler.ts" />
/// <reference path="hotspot.ts" />

var view = new View;
var inputHandler = new InputHandler( view.canvas );

document.body.appendChild( view.canvas );

inputHandler.addHotSpot( new Hotspot(100, 100, 30, 30) );



