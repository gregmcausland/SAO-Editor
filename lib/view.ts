class View {

	canvas;
	context;

	width		: number;
	height		: number;
	resizetimer	: number;

	background	: String;

	constructor( width:number = 0, height:number = 0, background:String = '#f3f3f3' )
	{
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.resize( width, height );

		this.background = background;

		window.addEventListener( 'resize', function() {
			this.resizetimer = setTimeout( this.resize.bind(this), 500 );
		}.bind(this));
	};

	resize( width:number = 0, height:number = 0 )
	{
		var style = this.canvas.style;

		if ( !width ) width = window.innerWidth;
		if ( !height ) height = window.innerHeight;

		this.width 			= width;
		this.height 		= height;
		this.canvas.width 	= width;
		this.canvas.height 	= height;

		style.position 		= 'absolute';
		style.left     		= '50%';
		style.top 			= '50%';
		style.marginTop		= -Math.abs(this.height/2) + 'px';
		style.marginLeft	= -Math.abs(this.width/2) + 'px';
	};

	clear()
	{
		this.context.save();
		this.context.fillStyle = this.background;
		this.context.fillRect( 0, 0, this.width, this.height );
		this.context.restore();
	};

};

