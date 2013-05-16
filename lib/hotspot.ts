/// <reference path="eventdispatcher" />
/// <reference path="vector2d" />

class Hotspot extends EventDispatcher {

	position	: Vector2d;
	origin		: Vector2d;
	size		: Vector2d;
	half		: Vector2d;
	angle		: number;

	corners		: Vector2d[];
	translated	: Vector2d[];

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
		this.angle 		= 0;

		this.corners	= [	new Vector2d, new Vector2d, new Vector2d, new Vector2d ];
		this.translated	= [	new Vector2d, new Vector2d, new Vector2d, new Vector2d ];

		this.draggable 	= draggable;
		this.resizeable = resizeable;
		this.enabled 	= enabled;

		this.position.x = this.origin.x = x;
		this.position.y = this.origin.y = y;

		this.size.x = w;
		this.size.y = h;

		this.half.x = Math.abs(w / 2);
		this.half.y = Math.abs(h / 2);

		this.setCorners();
		this.translate();
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

		this.setCorners();
	};

	setCorners()
	{
		this.corners[0].x = -this.half.x;
		this.corners[0].y = -this.half.y;

		this.corners[1].x = this.half.x;
		this.corners[1].y = -this.half.y;

		this.corners[2].x = this.half.x;
		this.corners[2].y = this.half.y;

		this.corners[3].x = -this.half.x;
		this.corners[3].y = this.half.y;
	}

	translate()
	{
		// Translate into translated;
		this.translated[0] = this.corners[0];
		this.translated[1] = this.corners[1];
		this.translated[2] = this.corners[2];
		this.translated[3] = this.corners[3];
	}

	copy()
	{
		return new Hotspot( this.position.x, this.position.y, this.size.x, this.size.y, true, true );
	};

	render( ctx, renderStyle:number = 1, highlighted:bool = false)
	{
		if ( this.enabled )
		{
			ctx.save();
			ctx.fillStyle 		= '#00f';
			ctx.strokeStyle		= '#00f';

			ctx.translate( this.position.x, this.position.y );

			if ( renderStyle ) 
			{
				ctx.globalAlpha = 0.3;
				ctx.fillRect( this.corners[0].x, this.corners[0].y, this.size.x, this.size.y );
			}
			else 
			{
				if (highlighted)
				{
					ctx.strokeStyle = '#f00';
					ctx.beginPath();
					ctx.moveTo(  0, -5 );
					ctx.lineTo(  0, 5  );
					ctx.moveTo( -5, 0  );
					ctx.lineTo(  5, 0  );
					ctx.stroke();
				}

				ctx.beginPath();
				ctx.lineWidth = 2;
				ctx.moveTo( this.translated[0].x, this.translated[0].y );
				ctx.lineTo( this.translated[1].x, this.translated[1].y );
				ctx.lineTo( this.translated[2].x, this.translated[2].y );
				ctx.lineTo( this.translated[3].x, this.translated[3].y );
				ctx.closePath();
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