/*!
 * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(window, doc){
var m = Math,
	dummyStyle = doc.createElement('div').style,
	vendor = (function () {
		var vendors = 't,webkitT,MozT,msT,OT'.split(','),
			t,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			t = vendors[i] + 'ransform';
			if ( t in dummyStyle ) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})(),
	cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

	// Style properties
	transform = prefixStyle('transform'),
	transitionProperty = prefixStyle('transitionProperty'),
	transitionDuration = prefixStyle('transitionDuration'),
	transformOrigin = prefixStyle('transformOrigin'),
	transitionTimingFunction = prefixStyle('transitionTimingFunction'),
	transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
	isAndroid = (/android/gi).test(navigator.appVersion),
	isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

    has3d = prefixStyle('perspective') in dummyStyle,
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor !== false,
    hasTransitionEnd = prefixStyle('transition') in dummyStyle,

	RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
	START_EV = hasTouch ? 'touchstart' : 'mousedown',
	MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
	END_EV = hasTouch ? 'touchend' : 'mouseup',
	CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
	TRNEND_EV = (function () {
		if ( vendor === false ) return false;

		var transitionEnd = {
				''			: 'transitionend',
				'webkit'	: 'webkitTransitionEnd',
				'Moz'		: 'transitionend',
				'O'			: 'otransitionend',
				'ms'		: 'MSTransitionEnd'
			};

		return transitionEnd[vendor];
	})(),

	nextFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) { return setTimeout(callback, 1); };
	})(),
	cancelFrame = (function () {
		return window.cancelRequestAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.webkitCancelRequestAnimationFrame ||
			window.mozCancelRequestAnimationFrame ||
			window.oCancelRequestAnimationFrame ||
			window.msCancelRequestAnimationFrame ||
			clearTimeout;
	})(),

	// Helpers
	translateZ = has3d ? ' translateZ(0)' : '',

	// Constructor
	iScroll = function (el, options) {
		var that = this,
			i;

		that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
		that.wrapper.style.overflow = 'hidden';
		that.scroller = that.wrapper.children[0];

		// Default options
		that.options = {
			hScroll: true,
			vScroll: true,
			x: 0,
			y: 0,
			bounce: true,
			bounceLock: false,
			momentum: true,
			lockDirection: true,
			useTransform: true,
			useTransition: false,
			topOffset: 0,
			checkDOMChanges: false,		// Experimental
			handleClick: true,

			// Scrollbar
			hScrollbar: true,
			vScrollbar: true,
			fixedScrollbar: isAndroid,
			hideScrollbar: isIDevice,
			fadeScrollbar: isIDevice && has3d,
			scrollbarClass: '',

			// Zoom
			zoom: false,
			zoomMin: 1,
			zoomMax: 4,
			doubleTapZoom: 2,
			wheelAction: 'scroll',

			// Snap
			snap: false,
			snapThreshold: 1,

			// Events
			onRefresh: null,
		onBeforeScrollStart:
		function (e) {
				var target = e.target;
				while (target.nodeType != 1) {
				target = target.parentNode;
				}
				if (target.tagName != 'SELECT' && target.tagName != 'TEXTAREA' && target.tagName != 'INPUT'&& target.tagName != 'DIV') {
				e.preventDefault();
				}
			},
			onScrollStart: null,
			onBeforeScrollMove: null,
			onScrollMove: null,
			onBeforeScrollEnd: null,
			onScrollEnd: null,
			onTouchEnd: null,
			onDestroy: null,
			onZoomStart: null,
			onZoom: null,
			onZoomEnd: null
		};

		// User defined options
		for (i in options) that.options[i] = options[i];
		
		// Set starting position
		that.x = that.options.x;
		that.y = that.options.y;

		// Normalize options
		that.options.useTransform = hasTransform && that.options.useTransform;
		that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
		that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
		that.options.zoom = that.options.useTransform && that.options.zoom;
		that.options.useTransition = hasTransitionEnd && that.options.useTransition;

		// Helpers FIX ANDROID BUG!
		// translate3d and scale doesn't work together!
		// Ignoring 3d ONLY WHEN YOU SET that.options.zoom
		if ( that.options.zoom && isAndroid ){
			translateZ = '';
		}
		
		// Set some default styles
		that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
		that.scroller.style[transitionDuration] = '0';
		that.scroller.style[transformOrigin] = '0 0';
		if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
		
		if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
		else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

		if (that.options.useTransition) that.options.fixedScrollbar = true;

		that.refresh();

		that._bind(RESIZE_EV, window);
		that._bind(START_EV);
		if (!hasTouch) {
			if (that.options.wheelAction != 'none') {
				that._bind('DOMMouseScroll');
				that._bind('mousewheel');
			}
		}

		if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
			that._checkDOMChanges();
		}, 500);
	};

// Prototype
iScroll.prototype = {
	enabled: true,
	x: 0,
	y: 0,
	steps: [],
	scale: 1,
	currPageX: 0, currPageY: 0,
	pagesX: [], pagesY: [],
	aniTime: null,
	wheelZoomCount: 0,
	
	handleEvent: function (e) {
		var that = this;
		switch(e.type) {
			case START_EV:
				if (!hasTouch && e.button !== 0) return;
				that._start(e);
				break;
			case MOVE_EV: that._move(e); break;
			case END_EV:
			case CANCEL_EV: that._end(e); break;
			case RESIZE_EV: that._resize(); break;
			case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
			case TRNEND_EV: that._transitionEnd(e); break;
		}
	},
	
	_checkDOMChanges: function () {
		if (this.moved || this.zoomed || this.animating ||
			(this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

		this.refresh();
	},
	
	_scrollbar: function (dir) {
		var that = this,
			bar;

		if (!that[dir + 'Scrollbar']) {
			if (that[dir + 'ScrollbarWrapper']) {
				if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
				that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
				that[dir + 'ScrollbarWrapper'] = null;
				that[dir + 'ScrollbarIndicator'] = null;
			}

			return;
		}

		if (!that[dir + 'ScrollbarWrapper']) {
			// Create the scrollbar wrapper
			bar = doc.createElement('div');

			if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
			else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

			bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

			that.wrapper.appendChild(bar);
			that[dir + 'ScrollbarWrapper'] = bar;

			// Create the scrollbar indicator
			bar = doc.createElement('div');
			if (!that.options.scrollbarClass) {
				bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
			}
			bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
			if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

			that[dir + 'ScrollbarWrapper'].appendChild(bar);
			that[dir + 'ScrollbarIndicator'] = bar;
		}

		if (dir == 'h') {
			that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
			that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
			that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
			that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
			that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
		} else {
			that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
			that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
			that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
			that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
			that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
		}

		// Reset position
		that._scrollbarPos(dir, true);
	},
	
	_resize: function () {
		var that = this;
		setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
	},
	
	_pos: function (x, y) {
		if (this.zoomed) return;

		x = this.hScroll ? x : 0;
		y = this.vScroll ? y : 0;

		if (this.options.useTransform) {
			this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
		} else {
			x = m.round(x);
			y = m.round(y);
			this.scroller.style.left = x + 'px';
			this.scroller.style.top = y + 'px';
		}

		this.x = x;
		this.y = y;

		this._scrollbarPos('h');
		this._scrollbarPos('v');
	},

	_scrollbarPos: function (dir, hidden) {
		var that = this,
			pos = dir == 'h' ? that.x : that.y,
			size;

		if (!that[dir + 'Scrollbar']) return;

		pos = that[dir + 'ScrollbarProp'] * pos;

		if (pos < 0) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
			}
			pos = 0;
		} else if (pos > that[dir + 'ScrollbarMaxScroll']) {
			if (!that.options.fixedScrollbar) {
				size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
				if (size < 8) size = 8;
				that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
				pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
			} else {
				pos = that[dir + 'ScrollbarMaxScroll'];
			}
		}

		that[dir + 'ScrollbarWrapper'].style[transitionDelay] = '0';
		that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
		that[dir + 'ScrollbarIndicator'].style[transform] = 'translate(' + (dir == 'h' ? pos + 'px,0)' : '0,' + pos + 'px)') + translateZ;
	},
	
	_start: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			matrix, x, y,
			c1, c2;

		if (!that.enabled) return;

		if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

		if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

		that.moved = false;
		that.animating = false;
		that.zoomed = false;
		that.distX = 0;
		that.distY = 0;
		that.absDistX = 0;
		that.absDistY = 0;
		that.dirX = 0;
		that.dirY = 0;

		// Gesture start
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
			that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

			that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
			that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

			if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
		}

		if (that.options.momentum) {
			if (that.options.useTransform) {
				// Very lame general purpose alternative to CSSMatrix
				matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
				x = +(matrix[12] || matrix[4]);
				y = +(matrix[13] || matrix[5]);
			} else {
				x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
				y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
			}
			
			if (x != that.x || y != that.y) {
				if (that.options.useTransition) that._unbind(TRNEND_EV);
				else cancelFrame(that.aniTime);
				that.steps = [];
				that._pos(x, y);
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
			}
		}

		that.absStartX = that.x;	// Needed by snap threshold
		that.absStartY = that.y;

		that.startX = that.x;
		that.startY = that.y;
		that.pointX = point.pageX;
		that.pointY = point.pageY;

		that.startTime = e.timeStamp || Date.now();

		if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

		that._bind(MOVE_EV, window);
		that._bind(END_EV, window);
		that._bind(CANCEL_EV, window);
	},
	
	_move: function (e) {
		var that = this,
			point = hasTouch ? e.touches[0] : e,
			deltaX = point.pageX - that.pointX,
			deltaY = point.pageY - that.pointY,
			newX = that.x + deltaX,
			newY = that.y + deltaY,
			c1, c2, scale,
			timestamp = e.timeStamp || Date.now();

		if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

		// Zoom
		if (that.options.zoom && hasTouch && e.touches.length > 1) {
			c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
			c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
			that.touchesDist = m.sqrt(c1*c1+c2*c2);

			that.zoomed = true;

			scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

			if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
			else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

			that.lastScale = scale / this.scale;

			newX = this.originX - this.originX * that.lastScale + this.x;
			newY = this.originY - this.originY * that.lastScale + this.y;

			this.scroller.style[transform] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')' + translateZ;

			if (that.options.onZoom) that.options.onZoom.call(that, e);
			return;
		}

		that.pointX = point.pageX;
		that.pointY = point.pageY;

		// Slow down if outside of the boundaries
		if (newX > 0 || newX < that.maxScrollX) {
			newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
		}
		if (newY > that.minScrollY || newY < that.maxScrollY) {
			newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
		}

		that.distX += deltaX;
		that.distY += deltaY;
		that.absDistX = m.abs(that.distX);
		that.absDistY = m.abs(that.distY);

		if (that.absDistX < 6 && that.absDistY < 6) {
			return;
		}

		// Lock direction
		if (that.options.lockDirection) {
			if (that.absDistX > that.absDistY + 5) {
				newY = that.y;
				deltaY = 0;
			} else if (that.absDistY > that.absDistX + 5) {
				newX = that.x;
				deltaX = 0;
			}
		}

		that.moved = true;
		that._pos(newX, newY);
		that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if (timestamp - that.startTime > 300) {
			that.startTime = timestamp;
			that.startX = that.x;
			that.startY = that.y;
		}
		
		if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
	},
	
	_end: function (e) {
		if (hasTouch && e.touches.length !== 0) return;

		var that = this,
			point = hasTouch ? e.changedTouches[0] : e,
			target, ev,
			momentumX = { dist:0, time:0 },
			momentumY = { dist:0, time:0 },
			duration = (e.timeStamp || Date.now()) - that.startTime,
			newPosX = that.x,
			newPosY = that.y,
			distX, distY,
			newDuration,
			snap,
			scale;

		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);

		if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

		if (that.zoomed) {
			scale = that.scale * that.lastScale;
			scale = Math.max(that.options.zoomMin, scale);
			scale = Math.min(that.options.zoomMax, scale);
			that.lastScale = scale / that.scale;
			that.scale = scale;

			that.x = that.originX - that.originX * that.lastScale + that.x;
			that.y = that.originY - that.originY * that.lastScale + that.y;
			
			that.scroller.style[transitionDuration] = '200ms';
			that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + that.scale + ')' + translateZ;
			
			that.zoomed = false;
			that.refresh();

			if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
			return;
		}

		if (!that.moved) {
			if (hasTouch) {
				if (that.doubleTapTimer && that.options.zoom) {
					// Double tapped
					clearTimeout(that.doubleTapTimer);
					that.doubleTapTimer = null;
					if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
					that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
					if (that.options.onZoomEnd) {
						setTimeout(function() {
							that.options.onZoomEnd.call(that, e);
						}, 200); // 200 is default zoom duration
					}
				} else if (this.options.handleClick) {
					that.doubleTapTimer = setTimeout(function () {
						that.doubleTapTimer = null;

						// Find the last touched element
						target = point.target;
						while (target.nodeType != 1) target = target.parentNode;

						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
							ev = doc.createEvent('MouseEvents');
							ev.initMouseEvent('click', true, true, e.view, 1,
								point.screenX, point.screenY, point.clientX, point.clientY,
								e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
								0, null);
							ev._fake = true;
							target.dispatchEvent(ev);
						}
					}, that.options.zoom ? 250 : 0);
				}
			}

			that._resetPos(400);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		if (duration < 300 && that.options.momentum) {
			momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
			momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

			newPosX = that.x + momentumX.dist;
			newPosY = that.y + momentumY.dist;

			if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
			if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
		}

		if (momentumX.dist || momentumY.dist) {
			newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

			// Do we need to snap?
			if (that.options.snap) {
				distX = newPosX - that.absStartX;
				distY = newPosY - that.absStartY;
				if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
				else {
					snap = that._snap(newPosX, newPosY);
					newPosX = snap.x;
					newPosY = snap.y;
					newDuration = m.max(snap.time, newDuration);
				}
			}

			that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		// Do we need to snap?
		if (that.options.snap) {
			distX = newPosX - that.absStartX;
			distY = newPosY - that.absStartY;
			if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
			else {
				snap = that._snap(that.x, that.y);
				if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
			}

			if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
			return;
		}

		that._resetPos(200);
		if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
	},
	
	_resetPos: function (time) {
		var that = this,
			resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
			resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		if (resetX == that.x && resetY == that.y) {
			if (that.moved) {
				that.moved = false;
				if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
			}

			if (that.hScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
				that.hScrollbarWrapper.style.opacity = '0';
			}
			if (that.vScrollbar && that.options.hideScrollbar) {
				if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
				that.vScrollbarWrapper.style.opacity = '0';
			}

			return;
		}

		that.scrollTo(resetX, resetY, time || 0);
	},

	_wheel: function (e) {
		var that = this,
			wheelDeltaX, wheelDeltaY,
			deltaX, deltaY,
			deltaScale;

		if ('wheelDeltaX' in e) {
			wheelDeltaX = e.wheelDeltaX / 12;
			wheelDeltaY = e.wheelDeltaY / 12;
		} else if('wheelDelta' in e) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
		} else if ('detail' in e) {
			wheelDeltaX = wheelDeltaY = -e.detail * 3;
		} else {
			return;
		}
		
		if (that.options.wheelAction == 'zoom') {
			deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
			if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
			if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
			
			if (deltaScale != that.scale) {
				if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
				that.wheelZoomCount++;
				
				that.zoom(e.pageX, e.pageY, deltaScale, 400);
				
				setTimeout(function() {
					that.wheelZoomCount--;
					if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
				}, 400);
			}
			
			return;
		}
		
		deltaX = that.x + wheelDeltaX;
		deltaY = that.y + wheelDeltaY;

		if (deltaX > 0) deltaX = 0;
		else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

		if (deltaY > that.minScrollY) deltaY = that.minScrollY;
		else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
    
		if (that.maxScrollY < 0) {
			that.scrollTo(deltaX, deltaY, 0);
		}
	},
	
	_transitionEnd: function (e) {
		var that = this;

		if (e.target != that.scroller) return;

		that._unbind(TRNEND_EV);
		
		that._startAni();
	},


	/**
	*
	* Utilities
	*
	*/
	_startAni: function () {
		var that = this,
			startX = that.x, startY = that.y,
			startTime = Date.now(),
			step, easeOut,
			animate;

		if (that.animating) return;
		
		if (!that.steps.length) {
			that._resetPos(400);
			return;
		}
		
		step = that.steps.shift();
		
		if (step.x == startX && step.y == startY) step.time = 0;

		that.animating = true;
		that.moved = true;
		
		if (that.options.useTransition) {
			that._transitionTime(step.time);
			that._pos(step.x, step.y);
			that.animating = false;
			if (step.time) that._bind(TRNEND_EV);
			else that._resetPos(0);
			return;
		}

		animate = function () {
			var now = Date.now(),
				newX, newY;

			if (now >= startTime + step.time) {
				that._pos(step.x, step.y);
				that.animating = false;
				if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
				that._startAni();
				return;
			}

			now = (now - startTime) / step.time - 1;
			easeOut = m.sqrt(1 - now * now);
			newX = (step.x - startX) * easeOut + startX;
			newY = (step.y - startY) * easeOut + startY;
			that._pos(newX, newY);
			if (that.animating) that.aniTime = nextFrame(animate);
		};

		animate();
	},

	_transitionTime: function (time) {
		time += 'ms';
		this.scroller.style[transitionDuration] = time;
		if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
		if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
	},

	_momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
		var deceleration = 0.0006,
			speed = m.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

		// Proportinally reduce speed if we are outside of the boundaries
		if (dist > 0 && newDist > maxDistUpper) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistUpper = maxDistUpper + outsideDist;
			speed = speed * maxDistUpper / newDist;
			newDist = maxDistUpper;
		} else if (dist < 0 && newDist > maxDistLower) {
			outsideDist = size / (6 / (newDist / speed * deceleration));
			maxDistLower = maxDistLower + outsideDist;
			speed = speed * maxDistLower / newDist;
			newDist = maxDistLower;
		}

		newDist = newDist * (dist < 0 ? -1 : 1);
		newTime = speed / deceleration;

		return { dist: newDist, time: m.round(newTime) };
	},

	_offset: function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;
			
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		
		if (el != this.wrapper) {
			left *= this.scale;
			top *= this.scale;
		}

		return { left: left, top: top };
	},

	_snap: function (x, y) {
		var that = this,
			i, l,
			page, time,
			sizeX, sizeY;

		// Check page X
		page = that.pagesX.length - 1;
		for (i=0, l=that.pagesX.length; i<l; i++) {
			if (x >= that.pagesX[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
		x = that.pagesX[page];
		sizeX = m.abs(x - that.pagesX[that.currPageX]);
		sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
		that.currPageX = page;

		// Check page Y
		page = that.pagesY.length-1;
		for (i=0; i<page; i++) {
			if (y >= that.pagesY[i]) {
				page = i;
				break;
			}
		}
		if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
		y = that.pagesY[page];
		sizeY = m.abs(y - that.pagesY[that.currPageY]);
		sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
		that.currPageY = page;

		// Snap with constant speed (proportional duration)
		time = m.round(m.max(sizeX, sizeY)) || 200;

		return { x: x, y: y, time: time };
	},

	_bind: function (type, el, bubble) {
		(el || this.scroller).addEventListener(type, this, !!bubble);
	},

	_unbind: function (type, el, bubble) {
		(el || this.scroller).removeEventListener(type, this, !!bubble);
	},


	/**
	*
	* Public methods
	*
	*/
	destroy: function () {
		var that = this;

		that.scroller.style[transform] = '';

		// Remove the scrollbars
		that.hScrollbar = false;
		that.vScrollbar = false;
		that._scrollbar('h');
		that._scrollbar('v');

		// Remove the event listeners
		that._unbind(RESIZE_EV, window);
		that._unbind(START_EV);
		that._unbind(MOVE_EV, window);
		that._unbind(END_EV, window);
		that._unbind(CANCEL_EV, window);
		
		if (!that.options.hasTouch) {
			that._unbind('DOMMouseScroll');
			that._unbind('mousewheel');
		}
		
		if (that.options.useTransition) that._unbind(TRNEND_EV);
		
		if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
		
		if (that.options.onDestroy) that.options.onDestroy.call(that);
	},

	refresh: function () {
		var that = this,
			offset,
			i, l,
			els,
			pos = 0,
			page = 0;

		if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
		that.wrapperW = that.wrapper.clientWidth || 1;
		that.wrapperH = that.wrapper.clientHeight || 1;

		that.minScrollY = -that.options.topOffset || 0;
		that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
		that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
		that.maxScrollX = that.wrapperW - that.scrollerW;
		that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
		that.dirX = 0;
		that.dirY = 0;

		if (that.options.onRefresh) that.options.onRefresh.call(that);

		that.hScroll = that.options.hScroll && that.maxScrollX < 0;
		that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

		that.hScrollbar = that.hScroll && that.options.hScrollbar;
		that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

		offset = that._offset(that.wrapper);
		that.wrapperOffsetLeft = -offset.left;
		that.wrapperOffsetTop = -offset.top;

		// Prepare snap
		if (typeof that.options.snap == 'string') {
			that.pagesX = [];
			that.pagesY = [];
			els = that.scroller.querySelectorAll(that.options.snap);
			for (i=0, l=els.length; i<l; i++) {
				pos = that._offset(els[i]);
				pos.left += that.wrapperOffsetLeft;
				pos.top += that.wrapperOffsetTop;
				that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
				that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
			}
		} else if (that.options.snap) {
			that.pagesX = [];
			while (pos >= that.maxScrollX) {
				that.pagesX[page] = pos;
				pos = pos - that.wrapperW;
				page++;
			}
			if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

			pos = 0;
			page = 0;
			that.pagesY = [];
			while (pos >= that.maxScrollY) {
				that.pagesY[page] = pos;
				pos = pos - that.wrapperH;
				page++;
			}
			if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
		}

		// Prepare the scrollbars
		that._scrollbar('h');
		that._scrollbar('v');

		if (!that.zoomed) {
			that.scroller.style[transitionDuration] = '0';
			that._resetPos(400);
		}
	},

	scrollTo: function (x, y, time, relative) {
		var that = this,
			step = x,
			i, l;

		that.stop();

		if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
		
		for (i=0, l=step.length; i<l; i++) {
			if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
			that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
		}

		that._startAni();
	},

	scrollToElement: function (el, time) {
		var that = this, pos;
		el = el.nodeType ? el : that.scroller.querySelector(el);
		if (!el) return;

		pos = that._offset(el);
		pos.left += that.wrapperOffsetLeft;
		pos.top += that.wrapperOffsetTop;

		pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
		pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
		time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

		that.scrollTo(pos.left, pos.top, time);
	},

	scrollToPage: function (pageX, pageY, time) {
		var that = this, x, y;
		
		time = time === undefined ? 400 : time;

		if (that.options.onScrollStart) that.options.onScrollStart.call(that);

		if (that.options.snap) {
			pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
			pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

			pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
			pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

			that.currPageX = pageX;
			that.currPageY = pageY;
			x = that.pagesX[pageX];
			y = that.pagesY[pageY];
		} else {
			x = -that.wrapperW * pageX;
			y = -that.wrapperH * pageY;
			if (x < that.maxScrollX) x = that.maxScrollX;
			if (y < that.maxScrollY) y = that.maxScrollY;
		}

		that.scrollTo(x, y, time);
	},

	disable: function () {
		this.stop();
		this._resetPos(0);
		this.enabled = false;

		// If disabled after touchstart we make sure that there are no left over events
		this._unbind(MOVE_EV, window);
		this._unbind(END_EV, window);
		this._unbind(CANCEL_EV, window);
	},
	
	enable: function () {
		this.enabled = true;
	},
	
	stop: function () {
		if (this.options.useTransition) this._unbind(TRNEND_EV);
		else cancelFrame(this.aniTime);
		this.steps = [];
		this.moved = false;
		this.animating = false;
	},
	
	zoom: function (x, y, scale, time) {
		var that = this,
			relScale = scale / that.scale;

		if (!that.options.useTransform) return;

		that.zoomed = true;
		time = time === undefined ? 200 : time;
		x = x - that.wrapperOffsetLeft - that.x;
		y = y - that.wrapperOffsetTop - that.y;
		that.x = x - x * relScale + that.x;
		that.y = y - y * relScale + that.y;

		that.scale = scale;
		that.refresh();

		that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
		that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

		that.scroller.style[transitionDuration] = time + 'ms';
		that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
		that.zoomed = false;
	},
	
	isReady: function () {
		return !this.moved && !this.zoomed && !this.animating;
	}
};

function prefixStyle (style) {
	if ( vendor === '' ) return style;

	style = style.charAt(0).toUpperCase() + style.substr(1);
	return vendor + style;
}

dummyStyle = null;	// for the sake of it

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})(window, document);

/* Zepto v1.1.2 - zepto event ajax form ie - zeptojs.com/license */
var Zepto = function () { function G(a) { return a == null ? String(a) : z[A.call(a)] || "object" } function H(a) { return G(a) == "function" } function I(a) { return a != null && a == a.window } function J(a) { return a != null && a.nodeType == a.DOCUMENT_NODE } function K(a) { return G(a) == "object" } function L(a) { return K(a) && !I(a) && Object.getPrototypeOf(a) == Object.prototype } function M(a) { return a instanceof Array } function N(a) { return typeof a.length == "number" } function O(a) { return g.call(a, function (a) { return a != null }) } function P(a) { return a.length > 0 ? c.fn.concat.apply([], a) : a } function Q(a) { return a.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase() } function R(a) { return a in j ? j[a] : j[a] = new RegExp("(^|\\s)" + a + "(\\s|$)") } function S(a, b) { return typeof b == "number" && !k[Q(a)] ? b + "px" : b } function T(a) { var b, c; return i[a] || (b = h.createElement(a), h.body.appendChild(b), c = getComputedStyle(b, "").getPropertyValue("display"), b.parentNode.removeChild(b), c == "none" && (c = "block"), i[a] = c), i[a] } function U(a) { return "children" in a ? f.call(a.children) : c.map(a.childNodes, function (a) { if (a.nodeType == 1) return a }) } function V(c, d, e) { for (b in d) e && (L(d[b]) || M(d[b])) ? (L(d[b]) && !L(c[b]) && (c[b] = {}), M(d[b]) && !M(c[b]) && (c[b] = []), V(c[b], d[b], e)) : d[b] !== a && (c[b] = d[b]) } function W(a, b) { return b == null ? c(a) : c(a).filter(b) } function X(a, b, c, d) { return H(b) ? b.call(a, c, d) : b } function Y(a, b, c) { c == null ? a.removeAttribute(b) : a.setAttribute(b, c) } function Z(b, c) { var d = b.className, e = d && d.baseVal !== a; if (c === a) return e ? d.baseVal : d; e ? d.baseVal = c : b.className = c } function $(a) { var b; try { return a ? a == "true" || (a == "false" ? !1 : a == "null" ? null : !/^0/.test(a) && !isNaN(b = Number(a)) ? b : /^[\[\{]/.test(a) ? c.parseJSON(a) : a) : a } catch (d) { return a } } function _(a, b) { b(a); for (var c in a.childNodes) _(a.childNodes[c], b) } var a, b, c, d, e = [], f = e.slice, g = e.filter, h = window.document, i = {}, j = {}, k = { "column-count": 1, columns: 1, "font-weight": 1, "line-height": 1, opacity: 1, "z-index": 1, zoom: 1 }, l = /^\s*<(\w+|!)[^>]*>/, m = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, n = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, o = /^(?:body|html)$/i, p = /([A-Z])/g, q = ["val", "css", "html", "text", "data", "width", "height", "offset"], r = ["after", "prepend", "before", "append"], s = h.createElement("table"), t = h.createElement("tr"), u = { tr: h.createElement("tbody"), tbody: s, thead: s, tfoot: s, td: t, th: t, "*": h.createElement("div") }, v = /complete|loaded|interactive/, w = /^\.([\w-]+)$/, x = /^#([\w-]*)$/, y = /^[\w-]*$/, z = {}, A = z.toString, B = {}, C, D, E = h.createElement("div"), F = { tabindex: "tabIndex", readonly: "readOnly", "for": "htmlFor", "class": "className", maxlength: "maxLength", cellspacing: "cellSpacing", cellpadding: "cellPadding", rowspan: "rowSpan", colspan: "colSpan", usemap: "useMap", frameborder: "frameBorder", contenteditable: "contentEditable" }; return B.matches = function (a, b) { if (!b || !a || a.nodeType !== 1) return !1; var c = a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.matchesSelector; if (c) return c.call(a, b); var d, e = a.parentNode, f = !e; return f && (e = E).appendChild(a), d = ~B.qsa(e, b).indexOf(a), f && E.removeChild(a), d }, C = function (a) { return a.replace(/-+(.)?/g, function (a, b) { return b ? b.toUpperCase() : "" }) }, D = function (a) { return g.call(a, function (b, c) { return a.indexOf(b) == c }) }, B.fragment = function (b, d, e) { var g, i, j; return m.test(b) && (g = c(h.createElement(RegExp.$1))), g || (b.replace && (b = b.replace(n, "<$1></$2>")), d === a && (d = l.test(b) && RegExp.$1), d in u || (d = "*"), j = u[d], j.innerHTML = "" + b, g = c.each(f.call(j.childNodes), function () { j.removeChild(this) })), L(e) && (i = c(g), c.each(e, function (a, b) { q.indexOf(a) > -1 ? i[a](b) : i.attr(a, b) })), g }, B.Z = function (a, b) { return a = a || [], a.__proto__ = c.fn, a.selector = b || "", a }, B.isZ = function (a) { return a instanceof B.Z }, B.init = function (b, d) { var e; if (!b) return B.Z(); if (typeof b == "string") { b = b.trim(); if (b[0] == "<" && l.test(b)) e = B.fragment(b, RegExp.$1, d), b = null; else { if (d !== a) return c(d).find(b); e = B.qsa(h, b) } } else { if (H(b)) return c(h).ready(b); if (B.isZ(b)) return b; if (M(b)) e = O(b); else if (K(b)) e = [b], b = null; else if (l.test(b)) e = B.fragment(b.trim(), RegExp.$1, d), b = null; else { if (d !== a) return c(d).find(b); e = B.qsa(h, b) } } return B.Z(e, b) }, c = function (a, b) { return B.init(a, b) }, c.extend = function (a) { var b, c = f.call(arguments, 1); return typeof a == "boolean" && (b = a, a = c.shift()), c.forEach(function (c) { V(a, c, b) }), a }, B.qsa = function (a, b) { var c, d = b[0] == "#", e = !d && b[0] == ".", g = d || e ? b.slice(1) : b, h = y.test(g); return J(a) && h && d ? (c = a.getElementById(g)) ? [c] : [] : a.nodeType !== 1 && a.nodeType !== 9 ? [] : f.call(h && !d ? e ? a.getElementsByClassName(g) : a.getElementsByTagName(b) : a.querySelectorAll(b)) }, c.contains = function (a, b) { return a !== b && a.contains(b) }, c.type = G, c.isFunction = H, c.isWindow = I, c.isArray = M, c.isPlainObject = L, c.isEmptyObject = function (a) { var b; for (b in a) return !1; return !0 }, c.inArray = function (a, b, c) { return e.indexOf.call(b, a, c) }, c.camelCase = C, c.trim = function (a) { return a == null ? "" : String.prototype.trim.call(a) }, c.uuid = 0, c.support = {}, c.expr = {}, c.map = function (a, b) { var c, d = [], e, f; if (N(a)) for (e = 0; e < a.length; e++) c = b(a[e], e), c != null && d.push(c); else for (f in a) c = b(a[f], f), c != null && d.push(c); return P(d) }, c.each = function (a, b) { var c, d; if (N(a)) { for (c = 0; c < a.length; c++) if (b.call(a[c], c, a[c]) === !1) return a } else for (d in a) if (b.call(a[d], d, a[d]) === !1) return a; return a }, c.grep = function (a, b) { return g.call(a, b) }, window.JSON && (c.parseJSON = JSON.parse), c.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) { z["[object " + b + "]"] = b.toLowerCase() }), c.fn = { forEach: e.forEach, reduce: e.reduce, push: e.push, sort: e.sort, indexOf: e.indexOf, concat: e.concat, map: function (a) { return c(c.map(this, function (b, c) { return a.call(b, c, b) })) }, slice: function () { return c(f.apply(this, arguments)) }, ready: function (a) { return v.test(h.readyState) && h.body ? a(c) : h.addEventListener("DOMContentLoaded", function () { a(c) }, !1), this }, get: function (b) { return b === a ? f.call(this) : this[b >= 0 ? b : b + this.length] }, toArray: function () { return this.get() }, size: function () { return this.length }, remove: function () { return this.each(function () { this.parentNode != null && this.parentNode.removeChild(this) }) }, each: function (a) { return e.every.call(this, function (b, c) { return a.call(b, c, b) !== !1 }), this }, filter: function (a) { return H(a) ? this.not(this.not(a)) : c(g.call(this, function (b) { return B.matches(b, a) })) }, add: function (a, b) { return c(D(this.concat(c(a, b)))) }, is: function (a) { return this.length > 0 && B.matches(this[0], a) }, not: function (b) { var d = []; if (H(b) && b.call !== a) this.each(function (a) { b.call(this, a) || d.push(this) }); else { var e = typeof b == "string" ? this.filter(b) : N(b) && H(b.item) ? f.call(b) : c(b); this.forEach(function (a) { e.indexOf(a) < 0 && d.push(a) }) } return c(d) }, has: function (a) { return this.filter(function () { return K(a) ? c.contains(this, a) : c(this).find(a).size() }) }, eq: function (a) { return a === -1 ? this.slice(a) : this.slice(a, +a + 1) }, first: function () { var a = this[0]; return a && !K(a) ? a : c(a) }, last: function () { var a = this[this.length - 1]; return a && !K(a) ? a : c(a) }, find: function (a) { var b, d = this; return typeof a == "object" ? b = c(a).filter(function () { var a = this; return e.some.call(d, function (b) { return c.contains(b, a) }) }) : this.length == 1 ? b = c(B.qsa(this[0], a)) : b = this.map(function () { return B.qsa(this, a) }), b }, closest: function (a, b) { var d = this[0], e = !1; typeof a == "object" && (e = c(a)); while (d && !(e ? e.indexOf(d) >= 0 : B.matches(d, a))) d = d !== b && !J(d) && d.parentNode; return c(d) }, parents: function (a) { var b = [], d = this; while (d.length > 0) d = c.map(d, function (a) { if ((a = a.parentNode) && !J(a) && b.indexOf(a) < 0) return b.push(a), a }); return W(b, a) }, parent: function (a) { return W(D(this.pluck("parentNode")), a) }, children: function (a) { return W(this.map(function () { return U(this) }), a) }, contents: function () { return this.map(function () { return f.call(this.childNodes) }) }, siblings: function (a) { return W(this.map(function (a, b) { return g.call(U(b.parentNode), function (a) { return a !== b }) }), a) }, empty: function () { return this.each(function () { this.innerHTML = "" }) }, pluck: function (a) { return c.map(this, function (b) { return b[a] }) }, show: function () { return this.each(function () { this.style.display == "none" && (this.style.display = ""), getComputedStyle(this, "").getPropertyValue("display") == "none" && (this.style.display = T(this.nodeName)) }) }, replaceWith: function (a) { return this.before(a).remove() }, wrap: function (a) { var b = H(a); if (this[0] && !b) var d = c(a).get(0), e = d.parentNode || this.length > 1; return this.each(function (f) { c(this).wrapAll(b ? a.call(this, f) : e ? d.cloneNode(!0) : d) }) }, wrapAll: function (a) { if (this[0]) { c(this[0]).before(a = c(a)); var b; while ((b = a.children()).length) a = b.first(); c(a).append(this) } return this }, wrapInner: function (a) { var b = H(a); return this.each(function (d) { var e = c(this), f = e.contents(), g = b ? a.call(this, d) : a; f.length ? f.wrapAll(g) : e.append(g) }) }, unwrap: function () { return this.parent().each(function () { c(this).replaceWith(c(this).children()) }), this }, clone: function () { return this.map(function () { return this.cloneNode(!0) }) }, hide: function () { return this.css("display", "none") }, toggle: function (b) { return this.each(function () { var d = c(this); (b === a ? d.css("display") == "none" : b) ? d.show() : d.hide() }) }, prev: function (a) { return c(this.pluck("previousElementSibling")).filter(a || "*") }, next: function (a) { return c(this.pluck("nextElementSibling")).filter(a || "*") }, html: function (a) { return arguments.length === 0 ? this.length > 0 ? this[0].innerHTML : null : this.each(function (b) { var d = this.innerHTML; c(this).empty().append(X(this, a, b, d)) }) }, text: function (b) { return arguments.length === 0 ? this.length > 0 ? this[0].textContent : null : this.each(function () { this.textContent = b === a ? "" : "" + b }) }, attr: function (c, d) { var e; return typeof c == "string" && d === a ? this.length == 0 || this[0].nodeType !== 1 ? a : c == "value" && this[0].nodeName == "INPUT" ? this.val() : !(e = this[0].getAttribute(c)) && c in this[0] ? this[0][c] : e : this.each(function (a) { if (this.nodeType !== 1) return; if (K(c)) for (b in c) Y(this, b, c[b]); else Y(this, c, X(this, d, a, this.getAttribute(c))) }) }, removeAttr: function (a) { return this.each(function () { this.nodeType === 1 && Y(this, a) }) }, prop: function (b, c) { return b = F[b] || b, c === a ? this[0] && this[0][b] : this.each(function (a) { this[b] = X(this, c, a, this[b]) }) }, data: function (b, c) { var d = this.attr("data-" + b.replace(p, "-$1").toLowerCase(), c); return d !== null ? $(d) : a }, val: function (a) { return arguments.length === 0 ? this[0] && (this[0].multiple ? c(this[0]).find("option").filter(function () { return this.selected }).pluck("value") : this[0].value) : this.each(function (b) { this.value = X(this, a, b, this.value) }) }, offset: function (a) { if (a) return this.each(function (b) { var d = c(this), e = X(this, a, b, d.offset()), f = d.offsetParent().offset(), g = { top: e.top - f.top, left: e.left - f.left }; d.css("position") == "static" && (g.position = "relative"), d.css(g) }); if (this.length == 0) return null; var b = this[0].getBoundingClientRect(); return { left: b.left + window.pageXOffset, top: b.top + window.pageYOffset, width: Math.round(b.width), height: Math.round(b.height) } }, css: function (a, d) { if (arguments.length < 2) { var e = this[0], f = getComputedStyle(e, ""); if (!e) return; if (typeof a == "string") return e.style[C(a)] || f.getPropertyValue(a); if (M(a)) { var g = {}; return c.each(M(a) ? a : [a], function (a, b) { g[b] = e.style[C(b)] || f.getPropertyValue(b) }), g } } var h = ""; if (G(a) == "string") !d && d !== 0 ? this.each(function () { this.style.removeProperty(Q(a)) }) : h = Q(a) + ":" + S(a, d); else for (b in a) !a[b] && a[b] !== 0 ? this.each(function () { this.style.removeProperty(Q(b)) }) : h += Q(b) + ":" + S(b, a[b]) + ";"; return this.each(function () { this.style.cssText += ";" + h }) }, index: function (a) { return a ? this.indexOf(c(a)[0]) : this.parent().children().indexOf(this[0]) }, hasClass: function (a) { return a ? e.some.call(this, function (a) { return this.test(Z(a)) }, R(a)) : !1 }, addClass: function (a) { return a ? this.each(function (b) { d = []; var e = Z(this), f = X(this, a, b, e); f.split(/\s+/g).forEach(function (a) { c(this).hasClass(a) || d.push(a) }, this), d.length && Z(this, e + (e ? " " : "") + d.join(" ")) }) : this }, removeClass: function (b) { return this.each(function (c) { if (b === a) return Z(this, ""); d = Z(this), X(this, b, c, d).split(/\s+/g).forEach(function (a) { d = d.replace(R(a), " ") }), Z(this, d.trim()) }) }, toggleClass: function (b, d) { return b ? this.each(function (e) { var f = c(this), g = X(this, b, e, Z(this)); g.split(/\s+/g).forEach(function (b) { (d === a ? !f.hasClass(b) : d) ? f.addClass(b) : f.removeClass(b) }) }) : this }, scrollTop: function (b) { if (!this.length) return; var c = "scrollTop" in this[0]; return b === a ? c ? this[0].scrollTop : this[0].pageYOffset : this.each(c ? function () { this.scrollTop = b } : function () { this.scrollTo(this.scrollX, b) }) }, scrollLeft: function (b) { if (!this.length) return; var c = "scrollLeft" in this[0]; return b === a ? c ? this[0].scrollLeft : this[0].pageXOffset : this.each(c ? function () { this.scrollLeft = b } : function () { this.scrollTo(b, this.scrollY) }) }, position: function () { if (!this.length) return; var a = this[0], b = this.offsetParent(), d = this.offset(), e = o.test(b[0].nodeName) ? { top: 0, left: 0 } : b.offset(); return d.top -= parseFloat(c(a).css("margin-top")) || 0, d.left -= parseFloat(c(a).css("margin-left")) || 0, e.top += parseFloat(c(b[0]).css("border-top-width")) || 0, e.left += parseFloat(c(b[0]).css("border-left-width")) || 0, { top: d.top - e.top, left: d.left - e.left } }, offsetParent: function () { return this.map(function () { var a = this.offsetParent || h.body; while (a && !o.test(a.nodeName) && c(a).css("position") == "static") a = a.offsetParent; return a }) } }, c.fn.detach = c.fn.remove, ["width", "height"].forEach(function (b) { var d = b.replace(/./, function (a) { return a[0].toUpperCase() }); c.fn[b] = function (e) { var f, g = this[0]; return e === a ? I(g) ? g["inner" + d] : J(g) ? g.documentElement["scroll" + d] : (f = this.offset()) && f[b] : this.each(function (a) { g = c(this), g.css(b, X(this, e, a, g[b]())) }) } }), r.forEach(function (a, b) { var d = b % 2; c.fn[a] = function () { var a, e = c.map(arguments, function (b) { return a = G(b), a == "object" || a == "array" || b == null ? b : B.fragment(b) }), f, g = this.length > 1; return e.length < 1 ? this : this.each(function (a, h) { f = d ? h : h.parentNode, h = b == 0 ? h.nextSibling : b == 1 ? h.firstChild : b == 2 ? h : null, e.forEach(function (a) { if (g) a = a.cloneNode(!0); else if (!f) return c(a).remove(); _(f.insertBefore(a, h), function (a) { a.nodeName != null && a.nodeName.toUpperCase() === "SCRIPT" && (!a.type || a.type === "text/javascript") && !a.src && window.eval.call(window, a.innerHTML) }) }) }) }, c.fn[d ? a + "To" : "insert" + (b ? "Before" : "After")] = function (b) { return c(b)[a](this), this } }), B.Z.prototype = c.fn, B.uniq = D, B.deserializeValue = $, c.zepto = B, c }(); window.Zepto = Zepto, window.$ === undefined && (window.$ = Zepto), function (a) { function m(a) { return a._zid || (a._zid = c++) } function n(a, b, c, d) { b = o(b); if (b.ns) var e = p(b.ns); return (h[m(a)] || []).filter(function (a) { return a && (!b.e || a.e == b.e) && (!b.ns || e.test(a.ns)) && (!c || m(a.fn) === m(c)) && (!d || a.sel == d) }) } function o(a) { var b = ("" + a).split("."); return { e: b[0], ns: b.slice(1).sort().join(" ") } } function p(a) { return new RegExp("(?:^| )" + a.replace(" ", " .* ?") + "(?: |$)") } function q(a, b) { return a.del && !j && a.e in k || !!b } function r(a) { return l[a] || j && k[a] || a } function s(b, c, e, f, g, i, j) { var k = m(b), n = h[k] || (h[k] = []); c.split(/\s/).forEach(function (c) { if (c == "ready") return a(document).ready(e); var h = o(c); h.fn = e, h.sel = g, h.e in l && (e = function (b) { var c = b.relatedTarget; if (!c || c !== this && !a.contains(this, c)) return h.fn.apply(this, arguments) }), h.del = i; var k = i || e; h.proxy = function (a) { a = y(a); if (a.isImmediatePropagationStopped()) return; a.data = f; var c = k.apply(b, a._args == d ? [a] : [a].concat(a._args)); return c === !1 && (a.preventDefault(), a.stopPropagation()), c }, h.i = n.length, n.push(h), "addEventListener" in b && b.addEventListener(r(h.e), h.proxy, q(h, j)) }) } function t(a, b, c, d, e) { var f = m(a); (b || "").split(/\s/).forEach(function (b) { n(a, b, c, d).forEach(function (b) { delete h[f][b.i], "removeEventListener" in a && a.removeEventListener(r(b.e), b.proxy, q(b, e)) }) }) } function y(b, c) { if (c || !b.isDefaultPrevented) { c || (c = b), a.each(x, function (a, d) { var e = c[a]; b[a] = function () { return this[d] = u, e && e.apply(c, arguments) }, b[d] = v }); if (c.defaultPrevented !== d ? c.defaultPrevented : "returnValue" in c ? c.returnValue === !1 : c.getPreventDefault && c.getPreventDefault()) b.isDefaultPrevented = u } return b } function z(a) { var b, c = { originalEvent: a }; for (b in a) !w.test(b) && a[b] !== d && (c[b] = a[b]); return y(c, a) } var b = a.zepto.qsa, c = 1, d, e = Array.prototype.slice, f = a.isFunction, g = function (a) { return typeof a == "string" }, h = {}, i = {}, j = "onfocusin" in window, k = { focus: "focusin", blur: "focusout" }, l = { mouseenter: "mouseover", mouseleave: "mouseout" }; i.click = i.mousedown = i.mouseup = i.mousemove = "MouseEvents", a.event = { add: s, remove: t }, a.proxy = function (b, c) { if (f(b)) { var d = function () { return b.apply(c, arguments) }; return d._zid = m(b), d } if (g(c)) return a.proxy(b[c], b); throw new TypeError("expected function") }, a.fn.bind = function (a, b, c) { return this.on(a, b, c) }, a.fn.unbind = function (a, b) { return this.off(a, b) }, a.fn.one = function (a, b, c, d) { return this.on(a, b, c, d, 1) }; var u = function () { return !0 }, v = function () { return !1 }, w = /^([A-Z]|returnValue$|layer[XY]$)/, x = { preventDefault: "isDefaultPrevented", stopImmediatePropagation: "isImmediatePropagationStopped", stopPropagation: "isPropagationStopped" }; a.fn.delegate = function (a, b, c) { return this.on(b, a, c) }, a.fn.undelegate = function (a, b, c) { return this.off(b, a, c) }, a.fn.live = function (b, c) { return a(document.body).delegate(this.selector, b, c), this }, a.fn.die = function (b, c) { return a(document.body).undelegate(this.selector, b, c), this }, a.fn.on = function (b, c, h, i, j) { var k, l, m = this; if (b && !g(b)) return a.each(b, function (a, b) { m.on(a, c, h, b, j) }), m; !g(c) && !f(i) && i !== !1 && (i = h, h = c, c = d); if (f(h) || h === !1) i = h, h = d; return i === !1 && (i = v), m.each(function (d, f) { j && (k = function (a) { return t(f, a.type, i), i.apply(this, arguments) }), c && (l = function (b) { var d, g = a(b.target).closest(c, f).get(0); if (g && g !== f) return d = a.extend(z(b), { currentTarget: g, liveFired: f }), (k || i).apply(g, [d].concat(e.call(arguments, 1))) }), s(f, b, i, h, c, l || k) }) }, a.fn.off = function (b, c, e) { var h = this; return b && !g(b) ? (a.each(b, function (a, b) { h.off(a, c, b) }), h) : (!g(c) && !f(e) && e !== !1 && (e = c, c = d), e === !1 && (e = v), h.each(function () { t(this, b, e, c) })) }, a.fn.trigger = function (b, c) { return b = g(b) || a.isPlainObject(b) ? a.Event(b) : y(b), b._args = c, this.each(function () { "dispatchEvent" in this ? this.dispatchEvent(b) : a(this).triggerHandler(b, c) }) }, a.fn.triggerHandler = function (b, c) { var d, e; return this.each(function (f, h) { d = z(g(b) ? a.Event(b) : b), d._args = c, d.target = h, a.each(n(h, b.type || b), function (a, b) { e = b.proxy(d); if (d.isImmediatePropagationStopped()) return !1 }) }), e }, "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function (b) { a.fn[b] = function (a) { return a ? this.bind(b, a) : this.trigger(b) } }), ["focus", "blur"].forEach(function (b) { a.fn[b] = function (a) { return a ? this.bind(b, a) : this.each(function () { try { this[b]() } catch (a) { } }), this } }), a.Event = function (a, b) { g(a) || (b = a, a = b.type); var c = document.createEvent(i[a] || "Events"), d = !0; if (b) for (var e in b) e == "bubbles" ? d = !!b[e] : c[e] = b[e]; return c.initEvent(a, d, !0), y(c) } }(Zepto), function ($) { function triggerAndReturn(a, b, c) { var d = $.Event(b); return $(a).trigger(d, c), !d.isDefaultPrevented() } function triggerGlobal(a, b, c, d) { if (a.global) return triggerAndReturn(b || document, c, d) } function ajaxStart(a) { a.global && $.active++ === 0 && triggerGlobal(a, null, "ajaxStart") } function ajaxStop(a) { a.global && !--$.active && triggerGlobal(a, null, "ajaxStop") } function ajaxBeforeSend(a, b) { var c = b.context; if (b.beforeSend.call(c, a, b) === !1 || triggerGlobal(b, c, "ajaxBeforeSend", [a, b]) === !1) return !1; triggerGlobal(b, c, "ajaxSend", [a, b]) } function ajaxSuccess(a, b, c, d) { var e = c.context, f = "success"; c.success.call(e, a, f, b), d && d.resolveWith(e, [a, f, b]), triggerGlobal(c, e, "ajaxSuccess", [b, c, a]), ajaxComplete(f, b, c) } function ajaxError(a, b, c, d, e) { var f = d.context; d.error.call(f, c, b, a), e && e.rejectWith(f, [c, b, a]), triggerGlobal(d, f, "ajaxError", [c, d, a || b]), ajaxComplete(b, c, d) } function ajaxComplete(a, b, c) { var d = c.context; c.complete.call(d, b, a), triggerGlobal(c, d, "ajaxComplete", [b, c]), ajaxStop(c) } function empty() { } function mimeToDataType(a) { return a && (a = a.split(";", 2)[0]), a && (a == htmlType ? "html" : a == jsonType ? "json" : scriptTypeRE.test(a) ? "script" : xmlTypeRE.test(a) && "xml") || "text" } function appendQuery(a, b) { return b == "" ? a : (a + "&" + b).replace(/[&?]{1,2}/, "?") } function serializeData(a) { a.processData && a.data && $.type(a.data) != "string" && (a.data = $.param(a.data, a.traditional)), a.data && (!a.type || a.type.toUpperCase() == "GET") && (a.url = appendQuery(a.url, a.data), a.data = undefined) } function parseArguments(a, b, c, d) { var e = !$.isFunction(b); return { url: a, data: e ? b : undefined, success: e ? $.isFunction(c) ? c : undefined : b, dataType: e ? d || c : c } } function serialize(a, b, c, d) { var e, f = $.isArray(b), g = $.isPlainObject(b); $.each(b, function (b, h) { e = $.type(h), d && (b = c ? d : d + "[" + (g || e == "object" || e == "array" ? b : "") + "]"), !d && f ? a.add(h.name, h.value) : e == "array" || !c && e == "object" ? serialize(a, h, c, b) : a.add(b, h) }) } var jsonpID = 0, document = window.document, key, name, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, scriptTypeRE = /^(?:text|application)\/javascript/i, xmlTypeRE = /^(?:text|application)\/xml/i, jsonType = "application/json", htmlType = "text/html", blankRE = /^\s*$/; $.active = 0, $.ajaxJSONP = function (a, b) { if ("type" in a) { var c = a.jsonpCallback, d = ($.isFunction(c) ? c() : c) || "jsonp" + ++jsonpID, e = document.createElement("script"), f = window[d], g, h = function (a) { $(e).triggerHandler("error", a || "abort") }, i = { abort: h }, j; return b && b.promise(i), $(e).on("load error", function (c, h) { clearTimeout(j), $(e).off().remove(), c.type == "error" || !g ? ajaxError(null, h || "error", i, a, b) : ajaxSuccess(g[0], i, a, b), window[d] = f, g && $.isFunction(f) && f(g[0]), f = g = undefined }), ajaxBeforeSend(i, a) === !1 ? (h("abort"), i) : (window[d] = function () { g = arguments }, e.src = a.url.replace(/=\?/, "=" + d), document.head.appendChild(e), a.timeout > 0 && (j = setTimeout(function () { h("timeout") }, a.timeout)), i) } return $.ajax(a) }, $.ajaxSettings = { type: "GET", beforeSend: empty, success: empty, error: empty, complete: empty, context: null, global: !0, xhr: function () { return new window.XMLHttpRequest }, accepts: { script: "text/javascript, application/javascript, application/x-javascript", json: jsonType, xml: "application/xml, text/xml", html: htmlType, text: "text/plain" }, crossDomain: !1, timeout: 0, processData: !0, cache: !0 }, $.ajax = function (options) { var settings = $.extend({}, options || {}), deferred = $.Deferred && $.Deferred(); for (key in $.ajaxSettings) settings[key] === undefined && (settings[key] = $.ajaxSettings[key]); ajaxStart(settings), settings.crossDomain || (settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host), settings.url || (settings.url = window.location.toString()), serializeData(settings), settings.cache === !1 && (settings.url = appendQuery(settings.url, "_=" + Date.now())); var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url); if (dataType == "jsonp" || hasPlaceholder) return hasPlaceholder || (settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + "=?" : settings.jsonp === !1 ? "" : "callback=?")), $.ajaxJSONP(settings, deferred); var mime = settings.accepts[dataType], headers = {}, setHeader = function (a, b) { headers[a.toLowerCase()] = [a, b] }, protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol, xhr = settings.xhr(), nativeSetHeader = xhr.setRequestHeader, abortTimeout; deferred && deferred.promise(xhr), settings.crossDomain || setHeader("X-Requested-With", "XMLHttpRequest"), setHeader("Accept", mime || "*/*"); if (mime = settings.mimeType || mime) mime.indexOf(",") > -1 && (mime = mime.split(",", 2)[0]), xhr.overrideMimeType && xhr.overrideMimeType(mime); (settings.contentType || settings.contentType !== !1 && settings.data && settings.type.toUpperCase() != "GET") && setHeader("Content-Type", settings.contentType || "application/x-www-form-urlencoded"); if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name]); xhr.setRequestHeader = setHeader, xhr.onreadystatechange = function () { if (xhr.readyState == 4) { xhr.onreadystatechange = empty, clearTimeout(abortTimeout); var result, error = !1; if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == "file:") { dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader("content-type")), result = xhr.responseText; try { dataType == "script" ? (1, eval)(result) : dataType == "xml" ? result = xhr.responseXML : dataType == "json" && (result = blankRE.test(result) ? null : $.parseJSON(result)) } catch (e) { error = e } error ? ajaxError(error, "parsererror", xhr, settings, deferred) : ajaxSuccess(result, xhr, settings, deferred) } else ajaxError(xhr.statusText || null, xhr.status ? "error" : "abort", xhr, settings, deferred) } }; if (ajaxBeforeSend(xhr, settings) === !1) return xhr.abort(), ajaxError(null, "abort", xhr, settings, deferred), xhr; if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]; var async = "async" in settings ? settings.async : !0; xhr.open(settings.type, settings.url, async, settings.username, settings.password); for (name in headers) nativeSetHeader.apply(xhr, headers[name]); return settings.timeout > 0 && (abortTimeout = setTimeout(function () { xhr.onreadystatechange = empty, xhr.abort(), ajaxError(null, "timeout", xhr, settings, deferred) }, settings.timeout)), xhr.send(settings.data ? settings.data : null), xhr }, $.get = function (a, b, c, d) { return $.ajax(parseArguments.apply(null, arguments)) }, $.post = function (a, b, c, d) { var e = parseArguments.apply(null, arguments); return e.type = "POST", $.ajax(e) }, $.getJSON = function (a, b, c) { var d = parseArguments.apply(null, arguments); return d.dataType = "json", $.ajax(d) }, $.fn.load = function (a, b, c) { if (!this.length) return this; var d = this, e = a.split(/\s/), f, g = parseArguments(a, b, c), h = g.success; return e.length > 1 && (g.url = e[0], f = e[1]), g.success = function (a) { d.html(f ? $("<div>").html(a.replace(rscript, "")).find(f) : a), h && h.apply(d, arguments) }, $.ajax(g), this }; var escape = encodeURIComponent; $.param = function (a, b) { var c = []; return c.add = function (a, b) { this.push(escape(a) + "=" + escape(b)) }, serialize(c, a, b), c.join("&").replace(/%20/g, "+") } }(Zepto), function (a) { a.fn.serializeArray = function () { var b = [], c; return a([].slice.call(this.get(0).elements)).each(function () { c = a(this); var d = c.attr("type"); this.nodeName.toLowerCase() != "fieldset" && !this.disabled && d != "submit" && d != "reset" && d != "button" && (d != "radio" && d != "checkbox" || this.checked) && b.push({ name: c.attr("name"), value: c.val() }) }), b }, a.fn.serialize = function () { var a = []; return this.serializeArray().forEach(function (b) { a.push(encodeURIComponent(b.name) + "=" + encodeURIComponent(b.value)) }), a.join("&") }, a.fn.submit = function (b) { if (b) this.bind("submit", b); else if (this.length) { var c = a.Event("submit"); this.eq(0).trigger(c), c.isDefaultPrevented() || this.get(0).submit() } return this } }(Zepto), function (a) { "__proto__" in {} || a.extend(a.zepto, { Z: function (b, c) { return b = b || [], a.extend(b, a.fn), b.selector = c || "", b.__Z = !0, b }, isZ: function (b) { return a.type(b) === "array" && "__Z" in b } }); try { getComputedStyle(undefined) } catch (b) { var c = getComputedStyle; window.getComputedStyle = function (a) { try { return c(a) } catch (b) { return null } } } }(Zepto);
!function (a) { function b(a, b, c, d) { return Math.abs(a - b) >= Math.abs(c - d) ? a - b > 0 ? "Left" : "Right" : c - d > 0 ? "Up" : "Down" } function c() { k = null, m.last && (m.el.trigger("longTap"), m = {}) } function d() { k && clearTimeout(k), k = null } function e() { h && clearTimeout(h), i && clearTimeout(i), j && clearTimeout(j), k && clearTimeout(k), h = i = j = k = null, m = {} } function f(a) { return ("touch" == a.pointerType || a.pointerType == a.MSPOINTER_TYPE_TOUCH) && a.isPrimary } function g(a, b) { return a.type == "pointer" + b || a.type.toLowerCase() == "mspointer" + b } var h, i, j, k, l, m = {}, n = 750; a(document).ready(function () { var o, p, q, r, s = 0, t = 0; "MSGesture" in window && (l = new MSGesture, l.target = document.body), a(document).bind("MSGestureEnd", function (a) { var b = a.velocityX > 1 ? "Right" : a.velocityX < -1 ? "Left" : a.velocityY > 1 ? "Down" : a.velocityY < -1 ? "Up" : null; b && (m.el.trigger("swipe"), m.el.trigger("swipe" + b)) }).on("touchstart MSPointerDown pointerdown", function (b) { (!(r = g(b, "down")) || f(b)) && (q = r ? b : b.touches[0], b.touches && 1 === b.touches.length && m.x2 && (m.x2 = void 0, m.y2 = void 0), o = Date.now(), p = o - (m.last || o), m.el = a("tagName" in q.target ? q.target : q.target.parentNode), h && clearTimeout(h), m.x1 = q.pageX, m.y1 = q.pageY, p > 0 && 250 >= p && (m.isDoubleTap = !0), m.last = o, k = setTimeout(c, n), l && r && l.addPointer(b.pointerId)) }).on("touchmove MSPointerMove pointermove", function (a) { (!(r = g(a, "move")) || f(a)) && (q = r ? a : a.touches[0], d(), m.x2 = q.pageX, m.y2 = q.pageY, s += Math.abs(m.x1 - m.x2), t += Math.abs(m.y1 - m.y2)) }).on("touchend MSPointerUp pointerup", function (c) { (!(r = g(c, "up")) || f(c)) && (d(), m.x2 && Math.abs(m.x1 - m.x2) > 30 || m.y2 && Math.abs(m.y1 - m.y2) > 30 ? j = setTimeout(function () { m.el.trigger("swipe"), m.el.trigger("swipe" + b(m.x1, m.x2, m.y1, m.y2)), m = {} }, 0) : "last" in m && (30 > s && 30 > t ? i = setTimeout(function () { var b = a.Event("tap"); b.cancelTouch = e, m.el.trigger(b), m.isDoubleTap ? (m.el && m.el.trigger("doubleTap"), m = {}) : h = setTimeout(function () { h = null, m.el && m.el.trigger("singleTap"), m = {} }, 250) }, 0) : m = {}), s = t = 0) }).on("touchcancel MSPointerCancel pointercancel", e), a(window).on("scroll", e) }), ["swipe", "swipeLeft", "swipeRight", "swipeUp", "swipeDown", "doubleTap", "tap", "singleTap", "longTap"].forEach(function (b) { a.fn[b] = function (a) { return this.on(b, a) } }) }(Zepto);
;(function () {
    var fontsize = function () {
      var W = document.body.getBoundingClientRect().width, defaultW = 750, defaultSize = 40;
      if (W > defaultW) W = defaultW;
      if (W < 320) W = 320; 
      window.W = W; document.getElementsByTagName('html')[0].style.fontSize = (W / defaultW * defaultSize).toFixed(2) + 'px';
  };
  window.addEventListener('resize', function () { setTimeout(fontsize, 300) });
  window.addEventListener("DOMContentLoaded", fontsize);
  setTimeout(fontsize, 300);

  var myScroll;
  function loaded() {
    myScroll = new iScroll('main');
  }
  document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
  document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);
})();

;(function(){
  // ontouchstart
  // ontouchmove
  // ontouchend
  $(function(){
    // onkeyup="if(isNaN(value))execCommand('undo')" onafterpaste="if(isNaN(value))execCommand('undo')"
    $(".moneytxt").on("blur focus input",function(t){
      var _t = $(this),
          _tV = _t.val(),
          _dV = _t.attr("data-v");
      if(isNaN(_tV)){
        _t.val(_dV);
        return;
      }else{      
        console.log(toNumTwo(_tV));
        _t.attr("data-v",_t.val());
      }
      verificationInput(_t);
    });

    $("#goto-result").on('click',function(){
      var _ck = $(this).attr("btn-no");
      if(!_ck){
        return false;
      }
      console.log(verificationInput());
    });
    $('input, textarea, button, a, select').off('touchstart mousedown').on('touchstart mousedown', function(e) {
          e.stopPropagation();
      });
    })

  function verificationInput(t){
    var price = $(".price-val"),
        weight = $(".weight-val"),
        priceVal = price.val(),
        weightVal = weight.val();
      if(!isNull(priceVal) || !isNull(weightVal) || isNaN(priceVal) || isNaN(weightVal)){
        btnG(false);
        return false;
      }
      btnG(true);
      return true;
  };

  function toNumTwo(num){
    if(!num.indexOf(".")){
      return num;
    }
    var nubA =num.split('.');
    if(nubA.length <= 1 || nubA == undefined || nubA == ''){
      return num;
    }

    return parseFloat(num).toFixed(2);

    //return num;

  }

  function btnG(a){
    var goBtn = $("#goto-result");
    if(a == false){
      goBtn.attr("btn-no",false);
      goBtn.addClass("no-click");
    }else {
      goBtn.attr("btn-no",true);
      goBtn.removeClass("no-click");
    }
  }

  function isNull(data) {
    return (data == "" || data == undefined || data == null) ? false : data;
  }

})();
