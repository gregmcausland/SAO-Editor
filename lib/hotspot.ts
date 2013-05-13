/// <reference path="vector2d" />

class Hotspot {

	position	: Vector2d;
	size		: Vector2d;
	half		: Vector2d;

	visible		: bool;

	constructor( x:number, y:number, w:number, h:number, visible:bool = true )
	{
		this.position 	= new Vector2d;
		this.size		= new Vector2d;
		this.half 		= new Vector2d;

		this.visible = visible;

		this.position.x = x;
		this.position.y = y;

		this.size.x = w;
		this.size.y = h;

		this.half.x = w / 2;
		this.half.y = h / 2;
	}

}