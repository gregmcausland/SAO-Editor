/// <reference path="eventdispatcher" />
/// <reference path="vector2d" />

class Hotspot extends EventDispatcher {

	position	: Vector2d;
	origin		: Vector2d;
	size		: Vector2d;
	half		: Vector2d;

	enabled		: bool;
	draggable	: bool;
	resizeable	: bool;

	constructor( x:number, y:number, w:number, h:number, enabled:bool = true, draggable:bool = false, resizeable:bool = false )
	{
		super();

		this.position	= new Vector2d;
		this.origin		= new Vector2d;
		this.size		= new Vector2d;
		this.half		= new Vector2d;

		this.draggable 	= draggable;
		this.resizeable = resizeable;
		this.enabled 	= enabled;

		this.position.x = this.origin.x = x;
		this.position.y = this.origin.y = y;

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

	setFromCorners( x1:number, y1:number, x2:number, y2:number )
	{
		var hw = Math.abs((x2 - x1) / 2),
			hh = Math.abs((y2 - y1) / 2),
			x = x1 + Math.round((x2 - x1) / 2),
			y = y1 + Math.round((y2 - y1) / 2);
		
		this.position.x = x;
		this.position.y = y;
		this.half.x = hw;
		this.half.y = hh;
		this.size.x = hw * 2;
		this.size.y = hh * 2;
	};

	copy()
	{
		return new Hotspot( this.position.x, this.position.y, this.size.x, this.size.y, true, true );
	};

	render( ctx, renderStyle:number = 1, fillStyle='#000')
	{
		if ( this.enabled )
		{
			ctx.save();
			ctx.globalAlpha 	= 0.3;
			ctx.fillStyle 		= fillStyle;
			ctx.strokeStyle		= fillStyle;

			ctx.translate( this.position.x - this.half.x, this.position.y - this.half.y );

			if ( renderStyle ) 
			{
				ctx.fillRect( 0, 0, this.size.x, this.size.y );
			}
			else 
			{
				ctx.beginPath();
				ctx.moveTo( 0, 0 );
				ctx.lineTo( this.size.x, 0 );
				ctx.lineTo( this.size.x, this.size.y );
				ctx.lineTo( 0, this.size.y );
				ctx.lineTo( 0, 0);
				ctx.stroke();
			}

			ctx.restore();
		}
	};

	drag( from:Vector2d, to:Vector2d )
	{
		var dx = to.x - from.x,
			dy = to.y - from.y;

		this.position.x = this.origin.x + dx;
		this.position.y = this.origin.y + dy;
	};

	updateOrigin()
	{
		this.origin.x = this.position.x;
		this.origin.y = this.position.y;
	};

}