/// <reference path="view" />
/// <reference path="inputhandler" />
/// <reference path="hotspot" />
/// <reference path="vector2d" />


class SAOEditor {

	view 			: View;
	inputHandler	: InputHandler;

	/* Level data */
	collision;

	/* Rendering data */
	selection		: Hotspot;

	constructor()
	{
		this.view 				= new View;
		this.inputHandler 		= new InputHandler( this.view.canvas );

		this.selection			= new Hotspot( 0, 0, 0, 0, false );
		this.collision 			= [];

		/* Bind functions */
		this.inputHandler.addEventListener('dragWithoutTarget', this.ghostAABB.bind(this));
		this.inputHandler.addEventListener('dragWithoutTargetEnd', this.createAABB.bind(this));

		document.body.appendChild( this.view.canvas );
		this.tick();
	};

	tick()
	{
		this.view.clear();
		this.paintCollision();
		this.selection.render( this.view.context );
		requestAnimationFrame( this.tick.bind(this) );
	};

	paintCollision()
	{
		for ( var i=0, len=this.collision.length; i<len; i++ )
		{
			this.collision[i].render( this.view.context, 0, '#00f' );
		}
	};

	/* Renders a 'ghost' AABB during a selection */
	ghostAABB( e )
	{
		this.selection.enabled = true;
		this.selection.setFromCorners( e.from.x, e.from.y, e.to.x, e.to.y );
	};

	createAABB( e )
	{
		var aabb = this.selection.copy();
		this.selection.enabled = false;
		this.inputHandler.addHotspot( aabb );
		this.collision.push( aabb );
	};
}

var editor = new SAOEditor;