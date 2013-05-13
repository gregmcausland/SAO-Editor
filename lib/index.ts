/// <reference path="view" />
/// <reference path="inputhandler" />
/// <reference path="hotspot" />
/// <reference path="vector2d" />

var view = new View;
var inputHandler = new InputHandler( view.canvas );
var hotspots = [];

document.body.appendChild( view.canvas );

hotspots.push( new Hotspot(100, 100, 100, 100) );
inputHandler.addHotSpot( hotspots[0] );

hotspots[0].addEventListener('click', function() { 
	alert('hello world') 
});

hotspots[0].addEventListener('drag', function( e ) { 
	e.eventTarget.position.x = e.to.x;
	e.eventTarget.position.y = e.to.y;
});


function tick()
{
	view.clear();
	for ( var i=0, len=hotspots.length; i<len; i++ ) hotspots[i].render( view.context );

	requestAnimationFrame( tick );
}

tick();