var View = (function () {
    function View(width, height) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.resize(width, height);
        window.addEventListener('resize', function () {
            this.resizetimer = setTimeout(this.resize.bind(this), 500);
        }.bind(this));
    }
    View.prototype.resize = function (width, height) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        var style = this.canvas.style;
        if(!width) {
            width = window.innerWidth;
        }
        if(!height) {
            height = window.innerHeight;
        }
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        style.position = 'absolute';
        style.left = '50%';
        style.top = '50%';
        style.marginTop = -Math.abs(this.height / 2) + 'px';
        style.marginLeft = -Math.abs(this.width / 2) + 'px';
    };
    View.prototype.clear = function () {
        this.context.clearRect(0, 0, this.width, this.height);
    };
    return View;
})();
;
var Vector2d = (function () {
    function Vector2d() { }
    return Vector2d;
})();
var InputHandler = (function () {
    function InputHandler(element) {
        this.mouse = new Vector2d();
        this.origin = new Vector2d();
        this.hotspots = [];
        this.element = element;
        this.click = true;
        element.addEventListener('mousedown', this.handleMousedown.bind(this));
        element.addEventListener('mouseup', this.handleMouseup.bind(this));
        element.addEventListener('mousemove', this.updatePosition.bind(this));
    }
    InputHandler.prototype.updatePosition = function (e) {
        this.mouse.x = e.pageX;
        this.mouse.y = e.pageY;
        if(this.mousedown) {
            if(this.origin.x !== this.mouse.x && this.origin.y !== this.mouse.y) {
                this.click = false;
                this.drag = true;
            }
            if(this.drag) {
                if(this.target) {
                    this.target.fireEvent({
                        type: 'drag',
                        from: this.origin,
                        to: this.mouse
                    });
                }
                console.log('dragging');
            }
        }
    };
    InputHandler.prototype.handleMousedown = function (e) {
        this.updatePosition(e);
        this.origin.x = this.mouse.x;
        this.origin.y = this.mouse.y;
        this.mousedown = true;
    };
    InputHandler.prototype.handleMouseup = function () {
        if(this.click) {
            if(this.target) {
                this.target.fireEvent({
                    type: 'click'
                });
            }
            console.log('clicked ' + this.mouse.x + ' ' + this.mouse.y);
        }
        this.target = null;
        this.click = true;
        this.drag = false;
        this.mousedown = false;
    };
    InputHandler.prototype.addHotSpot = function (hotspot) {
        this.hotspots.push(hotspot);
    };
    return InputHandler;
})();
;
var Hotspot = (function () {
    function Hotspot(x, y, w, h, visible) {
        if (typeof visible === "undefined") { visible = true; }
        this.position = new Vector2d();
        this.size = new Vector2d();
        this.half = new Vector2d();
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
