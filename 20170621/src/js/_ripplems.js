;(function(PD, window, document, undefined) {
    function Rippleria(element, options) {
        this.$element = PD(element);
        this.options = PD.extend({}, Rippleria.Defaults, this._getOptionsFromElementAttributes(), options);

        this._prepare();
        this._bind();
    }

    Rippleria.prototype._bind = function() { 
        var elem = this.$element,
            options = this.options,
            ink, d, x, y, isTouchSupported, eventType;

        isTouchSupported = 'ontouchend' in window || window.DocumentTouch && document instanceof DocumentTouch;

        eventType = isTouchSupported == true ? 'touchend.ripplems' : 'click.ripplems';

        this.$element.bind(eventType, function(e) {
            var ink = PD("<div class='ripplems-ink'/>");
            elem.append(ink);

            if (options.color != undefined) {
                ink.css('background-color', options.color);
            }

            var animation = 'ripplems ' + options.duration / 1000 + 's ' + options.easing;

            ink.css('animation', animation);
            ink.css('-webkit-animation', animation);

            setTimeout(function() {
                ink.remove();
            }, parseFloat(options.duration));

            if(!ink.height() && !ink.width()) {
                d = Math.max(elem.outerWidth(), elem.outerHeight());
                ink.css({height: d, width: d});
            }

            if (isTouchSupported == true) {
                var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                x = touch.pageX - elem.offset().left - ink.width() / 2;
                y = touch.pageY - elem.offset().top - ink.height() / 2;
            } else {
                x = e.pageX - elem.offset().left - ink.width() / 2;
                y = e.pageY - elem.offset().top - ink.height() / 2;
            }

            ink.css({top: y + 'px', left: x + 'px'});
        });
    };

    Rippleria.prototype._prepare = function() {
        var elem = this.$element;

        if (elem.css('position') == 'static') {
            elem.css('position', 'relative');
        }

        elem.css('overflow', 'hidden');

        if(elem.find('img')[0] != undefined) {
            elem.on('dragstart', function(e) { e.preventDefault(); });
        }

        if(this.options.detectBrightness) {
            var r,g,b,brightness,
                colour = this.$element.css("background-color");

            if(colour == 'transparent') {
                var getParentBackground = function(elem) {
                    var colour = elem.css("background-color");

                    if(elem.length != 0) {
                        if(colour == 'transparent') {
                            return getParentBackground(elem.parent());
                        }
                    }

                    return colour;
                };

                colour = getParentBackground(this.$element.parent());
            }

            if (colour.match(/^rgba/)) {
                colour = colour.match(/rgba\(([^)]+)\)/)[1];

                colour = colour.split(/ *, */).map(Number);
                r = colour[0];
                g = colour[1];
                b = colour[2];
            } else if (colour.match(/^rgb/)) {
                colour = colour.match(/rgb\(([^)]+)\)/)[1];
                colour = colour.split(/ *, */).map(Number);
                r = colour[0];
                g = colour[1];
                b = colour[2];
            } else if ('#' == colour[0] && 7 == colour.length) {
                r = parseInt(colour.slice(1, 3), 16);
                g = parseInt(colour.slice(3, 5), 16);
                b = parseInt(colour.slice(5, 7), 16);
            } else if ('#' == colour[0] && 4 == colour.length) {
                r = parseInt(colour[1] + colour[1], 16);
                g = parseInt(colour[2] + colour[2], 16);
                b = parseInt(colour[3] + colour[3], 16);
            }

            brightness = (r * 299 + g * 587 + b * 114) / 1000;

            if (brightness > 150) {
                this.$element.addClass("ripplems-dark");
            }
        }
    };

    Rippleria.prototype._getOptionsFromElementAttributes = function() {
        var base = this;
        attrs = {};

        PD.each(Rippleria.Defaults, function(option, val) {
            var attr = base.$element.attr('ju-ripplems-' + option);
            if (attr != null) {
                attrs[option] = attr;
            }
        });

        return attrs;
    };

    Rippleria.prototype.changeColor = function(color) {
        this.options.color = color;
    };

    Rippleria.prototype.changeEasing = function(easing) {
        this.options.easing = easing;
    };

    Rippleria.prototype.changeDuration = function(duration) {
        this.options.duration = duration;
    };

    Rippleria.Defaults = {
        duration: 750,
        easing: 'linear',
        color: undefined,
        detectBrightness: true
    };

    PD.fn.ripplems = function(option) { 
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var $this = PD(this),
                data = $this.data('ripplems');

            if (!data) {
                data = new Rippleria(this, typeof option == 'object' && option);
                $this.data('ripplems', data);
            }

            if (typeof option == 'string' && option.charAt(0) !== '_') {
                data[option].apply(data, args);
            }
        });
    };

    PD(function() {
        PD('[ju-ripplems]').ripplems();
    });
})(window.PD, window, document);
