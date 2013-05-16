/// <reference path="vector2d.ts" />
/// <reference path="hotspot.ts" />
/// <reference path="eventdispatcher.ts" />

class InputHandler extends EventDispatcher {

	element;
	target;
	hotspots;

	mouse 			: Vector2d;
	origin			: Vector2d;

	click 			: bool;
	drag			: bool;
	mousedown		: bool;

	constructor( element )
	{
		super();

		this.mouse 		= new Vector2d;
		this.origin		= new Vector2d;
		this.hotspots 	= [];
		this.element 	= element;
		this.click 		= true;
		
		element.addEventListener('mousedown', this.handleMousedown.bind(this));
		element.addEventListener('mouseup', this.handleMouseup.bind(this));
		element.addEventListener('mousemove', this.updatePosition.bind(this));
	};

	updatePosition( e )
	{
		e.preventDefault();

		this.mouse.x = e.pageX;
		this.mouse.y = e.pageY;

		if ( this.mousedown )
		{
			if ( this.origin.x !== this.mouse.x && this.origin.y !== this.mouse.y )
			{
				this.click 	= false;
				this.drag 	= true;
			}

			if ( this.drag )
			{
				if ( this.target  && this.target.draggable ) 
				{
					this.target.drag( this.origin,  this.mouse );
					this.element.style.cursor = 'all-scroll';
				} 
				else 
				{
					this.dispatchEvent({ type : 'dragWithoutTarget', from: this.origin, to: this.mouse });
				}
			}
		}
	};

	handleMousedown( e )
	{
		e.preventDefault();

		this.updatePosition( e );
		this.origin.x 	= this.mouse.x;
		this.origin.y 	= this.mouse.y;
		this.mousedown 	= true;

		for ( var i=0, len=this.hotspots.length; i<len; i++ )
		{
			if ( this.hotspots[i].collide( this.mouse ) )
			{
				this.target = this.hotspots[i];
				break;
			}
		}
	};

	handleMouseup( e )
	{
		e.preventDefault();

		if ( this.click ) 
		{
			if ( this.target ) this.target.dispatchEvent({ type: 'click' });
		}

		if ( this.drag  && !this.target )
			this.dispatchEvent({ type: 'dragWithoutTargetEnd', from: this.origin, to: this.mouse });

		if ( this.drag && this.target )
			this.target.updateOrigin();

		this.target 	= null;
		this.click 		= true;
		this.drag 		= false;
		this.mousedown	= false;

		this.element.style.cursor = 'auto';
	};

	addHotspot( hotspot:Hotspot )
	{
		this.hotspots.push( hotspot );
	};

};
