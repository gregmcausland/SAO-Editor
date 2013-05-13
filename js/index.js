var View = (function () {
    function View(width, height) {
        if (typeof width === "undefined") { width = 800; }
        if (typeof height === "undefined") { height = 600; }
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.resize(width, height);
    }
    View.prototype.resize = function (width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    };
    View.prototype.clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };
    return View;
})();
;
var InputHandler = (function () {
    function InputHandler(element) {
        this.hotspots = [];
        this.element = element;
        element.addEventListener('click', this.delegateClick.bind(this));
    }
    InputHandler.prototype.delegateClick = function (e) {
    };
    InputHandler.prototype.addHotSpot = function (hotspot) {
        this.hotspots.push(hotspot);
    };
    return InputHandler;
})();
;
var Vector2d = (function () {
    function Vector2d() { }
    return Vector2d;
})();
var Hotspot = (function () {
    function Hotspot(x, y, w, h, visible) {
        if (typeof visible === "undefined") { visible = true; }
        this.visible = visible;
        this.position.x = x;
        this.position.y = y;
        this.size.x = w;
        this.size.y = h;
        this.half.x = w / 2;
        this.half.y = h / 2;
    }
    return Hotspot;
})();
var view = new View();
var inputHandler = new InputHandler(view.canvas);
document.body.appendChild(view.canvas);
inputHandler.addHotSpot(new Hotspot(100, 100, 30, 30));
