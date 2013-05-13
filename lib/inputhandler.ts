/// <reference path="vector2d.ts" />

class InputHandler {

	element;
	hotspots;
	target;

	mouse 			: Vector2d;
	origin			: Vector2d;

	click 			: bool;
	drag			: bool;
	mousedown		: bool;

	constructor( element )
	{
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
				if ( this.target ) this.target.fireEvent({ type: 'drag', from: this.origin, to: this.mouse });
				console.log('dragging');
			}
		}
	};

	handleMousedown( e )
	{
		this.updatePosition( e );
		this.origin.x 	= this.mouse.x;
		this.origin.y 	= this.mouse.y;
		this.mousedown 	= true;
	};

	handleMouseup()
	{
		if ( this.click ) {
			if ( this.target ) this.target.fireEvent({ type: 'click' });
			console.log('clicked ' + this.mouse.x + ' ' + this.mouse.y);
		}
		this.target 	= null;
		this.click 		= true;
		this.drag 		= false;
		this.mousedown	= false;
	};

	addHotSpot( hotspot )
	{
		this.hotspots.push( hotspot );
	};

};
