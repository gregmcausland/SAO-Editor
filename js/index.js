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
        e.preventDefault();
        this.mouse.x = e.pageX;
        this.mouse.y = e.pageY;
        if(this.mousedown) {
            if(this.origin.x !== this.mouse.x && this.origin.y !== this.mouse.y) {
                this.click = false;
                this.drag = true;
            }
            if(this.drag) {
                if(this.target) {
                    this.target.dispatchEvent({
                        type: 'drag',
                        from: this.origin,
                        to: this.mouse,
                        eventTarget: this.target
                    });
                    this.element.style.cursor = 'all-scroll';
                }
            }
        }
    };
    InputHandler.prototype.handleMousedown = function (e) {
        e.preventDefault();
        this.updatePosition(e);
        this.origin.x = this.mouse.x;
        this.origin.y = this.mouse.y;
        this.mousedown = true;
        for(var i = 0, len = this.hotspots.length; i < len; i++) {
            if(this.hotspots[i].collide(this.mouse)) {
                this.target = this.hotspots[i];
                break;
            }
        }
    };
    InputHandler.prototype.handleMouseup = function (e) {
        e.preventDefault();
        if(this.click) {
            if(this.target) {
                this.target.dispatchEvent({
                    type: 'click'
                });
            }
        }
        this.target = null;
        this.click = true;
        this.drag = false;
        this.mousedown = false;
        this.element.style.cursor = 'auto';
    };
    InputHandler.prototype.addHotSpot = function (hotspot) {
        this.hotspots.push(hotspot);
    };
    return InputHandler;
})();
;
var EventDispatcher = (function () {
    function EventDispatcher() { }
    EventDispatcher.prototype.addEventListener = function (type, listener) {
        if(this._listeners === undefined) {
            this._listeners = {
            };
        }
        var listeners = this._listeners;
        if(listeners[type] === undefined) {
            listeners[type] = [];
        }
        if(listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
    };
    EventDispatcher.prototype.hasEventListener = function (type, listener) {
        if(this._listeners === undefined) {
            return false;
        }
        var listeners = this._listeners;
        if(listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {
            return true;
        }
        return false;
    };
    EventDispatcher.prototype.removeEventListener = function (type, listener) {
        if(this._listeners === undefined) {
            return;
        }
        var listeners = this._listeners;
        var index = listeners[type].indexOf(listener);
        if(index !== -1) {
            listeners[type].splice(index, 1);
        }
    };
    EventDispatcher.prototype.dispatchEvent = function (event) {
        if(this._listeners === undefined) {
            return;
        }
        var listeners = this._listeners;
        var listenerArray = listeners[event.type];
        if(listenerArray !== undefined) {
            event.target = this;
            for(var i = 0, l = listenerArray.length; i < l; i++) {
                listenerArray[i].call(this, event);
            }
        }
    };
    return EventDispatcher;
})();
;
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Hotspot = (function (_super) {
    __extends(Hotspot, _super);
    function Hotspot(x, y, w, h, enabled) {
        if (typeof enabled === "undefined") { enabled = true; }
        _super.call(this);
        this.position = new Vector2d();
        this.size = new Vector2d();
        this.half = new Vector2d();
        this.enabled = enabled;
        this.position.x = x;
        this.position.y = y;
        this.size.x = w;
        this.size.y = h;
        this.half.x = Math.abs(w / 2);
        this.half.y = Math.abs(h / 2);
    }
    Hotspot.prototype.collide = function (p) {
        var pos = this.position, half = this.half;
        if(p.x >= (pos.x - half.x) && p.x <= (pos.x + half.x) && p.y >= (pos.y - half.y) && p.y <= (pos.y + half.y)) {
            return true;
        } else {
            return false;
        }
    };
    Hotspot.prototype.render = function (ctx) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#000';
        ctx.translate(this.position.x - this.half.x, this.position.y - this.half.y);
        ctx.fillRect(0, 0, this.size.x, this.size.y);
        ctx.restore();
    };
    return Hotspot;
})(EventDispatcher);
var view = new View();
var inputHandler = new InputHandler(view.canvas);
var hotspots = [];
document.body.appendChild(view.canvas);
hotspots.push(new Hotspot(100, 100, 100, 100));
inputHandler.addHotSpot(hotspots[0]);
hotspots[0].addEventListener('click', function () {
    alert('hello world');
});
hotspots[0].addEventListener('drag', function (e) {
    e.eventTarget.position.x = e.to.x;
    e.eventTarget.position.y = e.to.y;
});
function tick() {
    view.clear();
    for(var i = 0, len = hotspots.length; i < len; i++) {
        hotspots[i].render(view.context);
    }
    requestAnimationFrame(tick);
}
tick();
