/// <reference path="eventdispatcher" />
/// <reference path="vector2d" />

class Hotspot extends EventDispatcher {

	position	: Vector2d;
	size		: Vector2d;
	half		: Vector2d;

	enabled		: bool;
	draggable	: bool;
	resizeable	: bool;

	constructor( x:number, y:number, w:number, h:number, enabled:bool = true, draggable:bool = false, resizeable:bool = false )
	{
		super();

		this.position 	= new Vector2d;
		this.size		= new Vector2d;
		this.half 		= new Vector2d;

		this.enabled = enabled;

		this.position.x = x;
		this.position.y = y;

		this.size.x = w;
		this.size.y = h;

		this.half.x = Math.abs(w / 2);
		this.half.y = Math.abs(h / 2);
	};


	collide( p:Vector2d )
	{
		var pos = this.position,
			half = this.half;

		if ( p.x >= (pos.x - half.x) &&
			 p.x <= (pos.x + half.x) && 
			 p.y >= (pos.y - half.y) &&
			 p.y <= (pos.y + half.y))
		{
			return true;
		}
		else
		{
			return false;
		}
	};

	render( ctx )
	{
		ctx.save();
		ctx.globalAlpha 	= 0.3;
		ctx.fillStyle 		= '#000';

		ctx.translate( this.position.x - this.half.x, this.position.y - this.half.y );
		ctx.fillRect( 0, 0, this.size.x, this.size.y );

		ctx.restore();
	}

}