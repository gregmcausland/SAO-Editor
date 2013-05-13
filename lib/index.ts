class Vector2d {
	x		:number;
	y		:number;
}

class View {

	canvas;
	context;

	width		: number;
	height		: number;

	constructor( width:number = 800, height:number = 600 )
	{
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.resize( width, height );
	};

	resize( width:number, height:number )
	{
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
	};

	clear()
	{
		this.context.clearRect( 0, 0, this.width, this.height );
	};

};

class InputHandler {

	element;
	hotspots;

	constructor( element )
	{
		this.hotspots = [];
		this.element = element;
		element.addEventListener('click', this.delegateClick.bind(this));
	};

	delegateClick( e:Event )
	{
	};

	addHotSpot( hotspot )
	{
		this.hotspots.push( hotspot );
	};

};

class Hotspot {

	position	: Vector2d;
	size		: Vector2d;
	half		: Vector2d;

	visible		: bool;

	constructor( x:number, y:number, w:number, h:number, visible:bool = true )
	{
		this.visible = visible;
		this.position.x = x;
		this.position.y = y;
		this.size.x = w;
		this.size.y = h;
		this.half.x = w / 2;
		this.half.y = h / 2;
	}

}


var view = new View;
var inputHandler = new InputHandler( view.canvas );

document.body.appendChild( view.canvas );

inputHandler.addHotSpot( new Hotspot(100, 100, 30, 30) );



