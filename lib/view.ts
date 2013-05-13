class View {

	canvas;
	context;

	width		: number;
	height		: number;

	constructor( width:number = 800, height:number = 600 )
	{
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
		this.resize( width, height );
	};

	resize( width:number, height:number )
	{
		this.width = width;
		this.height = height;
		this.canvas.width = width;
		this.canvas.height = height;
	};

	clear()
	{
		this.context.clearRect( 0, 0, this.width, this.height );
	};

};

