/// <reference path="view" />
/// <reference path="inputhandler" />
/// <reference path="hotspot" />
/// <reference path="vector2d" />
/// <reference path="keyboard" />
/// <reference path="ui" />

class SAOEditor {

	view 			: View;
	inputHandler	: InputHandler;
	kbHandler		: KeyboardHandler;

	/* Level data */
	collision;

	/* Rendering data */
	selection		: Hotspot;
	activeItem		: Hotspot; 

	ui;

	constructor()
	{
		this.view 				= new View;
		this.inputHandler 		= new InputHandler( this.view.canvas );
		this.kbHandler 			= new KeyboardHandler( window );
		this.kbHandler.capture 	= true;
		//this.kbHandler.logging 	= true;

		this.selection			= new Hotspot( 0, 0, 0, 0, false );
		this.collision 			= [];

		this.ui = {
			mode: 			document.querySelector('.ui-mode'),
			selection: 		document.querySelector('.ui-selection')
		}

		this.ui.mode.className += ' show';

		/* Bind functions */
		this.inputHandler.addEventListener('dragWithoutTarget', this.ghostAABB.bind(this));
		this.inputHandler.addEventListener('dragWithoutTargetEnd', this.createAABB.bind(this));
		this.inputHandler.addEventListener('clickWithoutTarget', this.clearActiveItem.bind(this));
		this.kbHandler.slowKey( 8, this.deleteActiveTarget.bind(this) );

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
			this.collision[i].render( this.view.context, 0, (this.collision[i] === this.activeItem) );
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

		aabb.addEventListener('mousedown', function() {
			this.activeItem = aabb;
		}.bind(this));

		this.selection.enabled = false;
		this.inputHandler.addHotspot( aabb );
		this.collision.push( aabb );
		this.activeItem = aabb;
	};

	deleteActiveTarget()
	{
		var index = this.collision.indexOf( this.activeItem );
		if ( index >= 0 ) this.collision.splice( index, 1 );
		this.inputHandler.deleteHotspot( this.activeItem );
		this.clearActiveItem();
	};

	clearActiveItem()
	{
		this.activeItem = null;
	}
}

var editor = new SAOEditor;