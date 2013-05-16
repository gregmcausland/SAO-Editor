var View = (function () {
    function View(width, height, background) {
        if (typeof width === "undefined") { width = 0; }
        if (typeof height === "undefined") { height = 0; }
        if (typeof background === "undefined") { background = '#f3f3f3'; }
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.resize(width, height);
        this.background = background;
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
        this.context.save();
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.restore();
    };
    return View;
})();
;
var Vector2d = (function () {
    function Vector2d() { }
    return Vector2d;
})();
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
    function Hotspot(x, y, w, h, enabled, draggable, resizeable) {
        if (typeof enabled === "undefined") { enabled = true; }
        if (typeof draggable === "undefined") { draggable = false; }
        if (typeof resizeable === "undefined") { resizeable = false; }
        _super.call(this);
        this.position = new Vector2d();
        this.origin = new Vector2d();
        this.size = new Vector2d();
        this.half = new Vector2d();
        this.angle = 0;
        this.corners = [
            new Vector2d(), 
            new Vector2d(), 
            new Vector2d(), 
            new Vector2d()
        ];
        this.translated = [
            new Vector2d(), 
            new Vector2d(), 
            new Vector2d(), 
            new Vector2d()
        ];
        this.draggable = draggable;
        this.resizeable = resizeable;
        this.enabled = enabled;
        this.position.x = this.origin.x = x;
        this.position.y = this.origin.y = y;
        this.size.x = w;
        this.size.y = h;
        this.half.x = Math.abs(w / 2);
        this.half.y = Math.abs(h / 2);
        this.setCorners();
        this.translate();
    }
    Hotspot.prototype.collide = function (p) {
        var pos = this.position, half = this.half;
        if(p.x >= (pos.x - half.x) && p.x <= (pos.x + half.x) && p.y >= (pos.y - half.y) && p.y <= (pos.y + half.y)) {
            return true;
        } else {
            return false;
        }
    };
    Hotspot.prototype.setFromCorners = function (x1, y1, x2, y2) {
        var hw = Math.abs((x2 - x1) / 2), hh = Math.abs((y2 - y1) / 2), x = x1 + Math.round((x2 - x1) / 2), y = y1 + Math.round((y2 - y1) / 2);
        this.position.x = x;
        this.position.y = y;
        this.half.x = hw;
        this.half.y = hh;
        this.size.x = hw * 2;
        this.size.y = hh * 2;
        this.setCorners();
    };
    Hotspot.prototype.setCorners = function () {
        this.corners[0].x = -this.half.x;
        this.corners[0].y = -this.half.y;
        this.corners[1].x = this.half.x;
        this.corners[1].y = -this.half.y;
        this.corners[2].x = this.half.x;
        this.corners[2].y = this.half.y;
        this.corners[3].x = -this.half.x;
        this.corners[3].y = this.half.y;
    };
    Hotspot.prototype.translate = function () {
        this.translated[0] = this.corners[0];
        this.translated[1] = this.corners[1];
        this.translated[2] = this.corners[2];
        this.translated[3] = this.corners[3];
    };
    Hotspot.prototype.copy = function () {
        return new Hotspot(this.position.x, this.position.y, this.size.x, this.size.y, true, true);
    };
    Hotspot.prototype.render = function (ctx, renderStyle, highlighted) {
        if (typeof renderStyle === "undefined") { renderStyle = 1; }
        if (typeof highlighted === "undefined") { highlighted = false; }
        if(this.enabled) {
            ctx.save();
            ctx.fillStyle = '#00f';
            ctx.strokeStyle = '#00f';
            ctx.translate(this.position.x, this.position.y);
            if(renderStyle) {
                ctx.globalAlpha = 0.3;
                ctx.fillRect(this.corners[0].x, this.corners[0].y, this.size.x, this.size.y);
            } else {
                if(highlighted) {
                    ctx.strokeStyle = '#f00';
                    ctx.beginPath();
                    ctx.moveTo(0, -5);
                    ctx.lineTo(0, 5);
                    ctx.moveTo(-5, 0);
                    ctx.lineTo(5, 0);
                    ctx.stroke();
                }
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.moveTo(this.translated[0].x, this.translated[0].y);
                ctx.lineTo(this.translated[1].x, this.translated[1].y);
                ctx.lineTo(this.translated[2].x, this.translated[2].y);
                ctx.lineTo(this.translated[3].x, this.translated[3].y);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
        }
    };
    Hotspot.prototype.drag = function (from, to) {
        var dx = to.x - from.x, dy = to.y - from.y;
        this.position.x = this.origin.x + dx;
        this.position.y = this.origin.y + dy;
    };
    Hotspot.prototype.updateOrigin = function () {
        this.origin.x = this.position.x;
        this.origin.y = this.position.y;
    };
    return Hotspot;
})(EventDispatcher);
var InputHandler = (function (_super) {
    __extends(InputHandler, _super);
    function InputHandler(element) {
        _super.call(this);
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
                if(this.target && this.target.draggable) {
                    this.target.drag(this.origin, this.mouse);
                    this.element.style.cursor = 'all-scroll';
                } else {
                    this.dispatchEvent({
                        type: 'dragWithoutTarget',
                        from: this.origin,
                        to: this.mouse
                    });
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
                this.target.dispatchEvent({
                    type: 'mousedown',
                    mouse: this.mouse
                });
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
            } else {
                this.dispatchEvent({
                    type: 'clickWithoutTarget',
                    mouse: this.mouse
                });
            }
        }
        if(this.drag && !this.target) {
            this.dispatchEvent({
                type: 'dragWithoutTargetEnd',
                from: this.origin,
                to: this.mouse
            });
        }
        if(this.drag && this.target) {
            this.target.updateOrigin();
        }
        this.target = null;
        this.click = true;
        this.drag = false;
        this.mousedown = false;
        this.element.style.cursor = 'auto';
    };
    InputHandler.prototype.addHotspot = function (hotspot) {
        this.hotspots.push(hotspot);
    };
    InputHandler.prototype.deleteHotspot = function (hotspot) {
        var index = this.hotspots.indexOf(hotspot);
        if(index >= 0) {
            this.hotspots.splice(index, 1);
        }
    };
    return InputHandler;
})(EventDispatcher);
;
var KeyboardHandler = (function (_super) {
    __extends(KeyboardHandler, _super);
    function KeyboardHandler(focus) {
        _super.call(this);
        this.focus = focus;
        this.logging = false;
        this.capture = false;
        this.keys = [];
        this.callbacks = [];
        this.focus.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.focus.addEventListener('keyup', this.handleKeyUp.bind(this));
    }
    KeyboardHandler.prototype.handleKeyDown = function (e) {
        this._setKey(e);
        if(this.callbacks[e.keyCode]) {
            if(this.capture) {
                e.preventDefault();
            }
            this.callbacks[e.keyCode].call();
        }
    };
    KeyboardHandler.prototype.handleKeyUp = function (e) {
        if(this.capture) {
            e.preventDefault();
        }
        this._resetKey(e);
    };
    KeyboardHandler.prototype._setKey = function (e) {
        if(this.logging) {
            console.log(e.keyCode);
        }
        this.keys[e.keyCode] = true;
    };
    KeyboardHandler.prototype._resetKey = function (e) {
        this.keys[e.keyCode] = false;
    };
    KeyboardHandler.prototype.key = function (id) {
        return this.keys[id];
    };
    KeyboardHandler.prototype.slowKey = function (id, callback) {
        this.callbacks[id] = callback;
    };
    return KeyboardHandler;
})(EventDispatcher);
var UI = (function () {
    function UI() {
    }
    return UI;
})();
var SAOEditor = (function () {
    function SAOEditor() {
        this.view = new View();
        this.inputHandler = new InputHandler(this.view.canvas);
        this.kbHandler = new KeyboardHandler(window);
        this.kbHandler.capture = true;
        this.selection = new Hotspot(0, 0, 0, 0, false);
        this.collision = [];
        this.ui = {
            mode: document.querySelector('.ui-mode'),
            selection: document.querySelector('.ui-selection')
        };
        this.ui.mode.className += ' show';
        this.inputHandler.addEventListener('dragWithoutTarget', this.ghostAABB.bind(this));
        this.inputHandler.addEventListener('dragWithoutTargetEnd', this.createAABB.bind(this));
        this.inputHandler.addEventListener('clickWithoutTarget', this.clearActiveItem.bind(this));
        this.kbHandler.slowKey(8, this.deleteActiveTarget.bind(this));
        document.body.appendChild(this.view.canvas);
        this.tick();
    }
    SAOEditor.prototype.tick = function () {
        this.view.clear();
        this.paintCollision();
        this.selection.render(this.view.context);
        requestAnimationFrame(this.tick.bind(this));
    };
    SAOEditor.prototype.paintCollision = function () {
        for(var i = 0, len = this.collision.length; i < len; i++) {
            this.collision[i].render(this.view.context, 0, (this.collision[i] === this.activeItem));
        }
    };
    SAOEditor.prototype.ghostAABB = function (e) {
        this.selection.enabled = true;
        this.selection.setFromCorners(e.from.x, e.from.y, e.to.x, e.to.y);
    };
    SAOEditor.prototype.createAABB = function (e) {
        var aabb = this.selection.copy();
        aabb.addEventListener('mousedown', function () {
            this.activeItem = aabb;
        }.bind(this));
        this.selection.enabled = false;
        this.inputHandler.addHotspot(aabb);
        this.collision.push(aabb);
        this.activeItem = aabb;
    };
    SAOEditor.prototype.deleteActiveTarget = function () {
        var index = this.collision.indexOf(this.activeItem);
        if(index >= 0) {
            this.collision.splice(index, 1);
        }
        this.inputHandler.deleteHotspot(this.activeItem);
        this.clearActiveItem();
    };
    SAOEditor.prototype.clearActiveItem = function () {
        this.activeItem = null;
    };
    return SAOEditor;
})();
var editor = new SAOEditor();
