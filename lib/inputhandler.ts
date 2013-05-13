class InputHandler {

	element;
	hotspots;

	constructor( element )
	{
		this.hotspots = [];
		this.element = element;
		element.addEventListener('click', this.delegateClick.bind(this));
	};

	delegateClick( e:Event )
	{
	};

	addHotSpot( hotspot )
	{
		this.hotspots.push( hotspot );
	};

};
