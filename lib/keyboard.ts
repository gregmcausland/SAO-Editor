/// <reference path="eventdispatcher" />

class KeyboardHandler extends EventDispatcher {

	logging		: bool;
	capture		: bool; 

	keys;
	callbacks;
	focus;

	constructor( focus ) 
	{
		super();
		
		this.focus = focus;

		this.logging = false;
		this.capture = false;

		this.keys 		= [];
		this.callbacks 	= [];

		this.focus.addEventListener('keydown', this.handleKeyDown.bind(this));
		this.focus.addEventListener('keyup', this.handleKeyUp.bind(this));
	};

	handleKeyDown( e )
	{
		this._setKey( e );
		if (this.callbacks[ e.keyCode ])
		{
			if ( this.capture ) e.preventDefault();
			this.callbacks[ e.keyCode ].call();
		}
	};

	handleKeyUp( e )
	{
		if ( this.capture ) e.preventDefault();
		this._resetKey( e );
	};

	_setKey ( e ) 
	{
		if (this.logging) console.log( e.keyCode );
		this.keys[ e.keyCode ] = true;
	};

	_resetKey ( e ) 
	{
		this.keys[ e.keyCode ] = false;
	};

	key ( id ) 
	{
		return this.keys[ id ];
	}; 

	slowKey( id, callback ) 
	{
		this.callbacks[ id ] = callback;
	};
}