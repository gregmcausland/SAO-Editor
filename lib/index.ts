/// <reference path="view" />
/// <reference path="inputhandler" />
/// <reference path="hotspot" />
/// <reference path="vector2d" />

var view = new View;
var inputHandler = new InputHandler( view.canvas );

document.body.appendChild( view.canvas );

function tick()
{
	view.clear();
	requestAnimationFrame( tick );
}

tick();