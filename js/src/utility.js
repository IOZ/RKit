/**
 * RKit Utility
 */
RKit.Utility = (function($) {
    'use strict';

    var base;

    /* stash public object */
    base = {};

    /**
     * Get view port width
     * @returns {*}
     */

    base.getViewPortWidth = function() {
        var viewPortWidth;

        if (typeof window.innerWidth != 'undefined') {
            viewPortWidth  = window.innerWidth;
        }
        else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
            viewPortWidth  = document.documentElement.clientWidth;
        }
        else {
            viewPortWidth  = document.getElementsByTagName('body')[0].clientWidth;
        }

        return viewPortWidth;
    };

    /**
     * Detect mobile
     */
    base.isMobile = function() {
        var re = /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i;
        return re.test(window.navigator.userAgent)
    };

    /**
     * Retina displays
     */
    base.isRetina = function() {
        if (window.devicePixelRatio) {
            return window.devicePixelRatio >= 2;
        } else {
            return false;
        }
    };

    /**
     * Image loader
     * @param {object} container - jquery object which contains images
     */
    base.imageLoader = function(container, fn) {
        var target, n, c, images, image;

        if (typeof container === "object") {
            target = container;
            console.log(0);
        } else if (typeof container === "string") {
            target = $(container);
        }

        images = target.find('img');
        n = images.length;
        c = 0;
        images.each(function() {
            image = $(this);
            image.one('load error', function() {
                c++;
                if (c === n) {
                    if (typeof fn === "function") {
                        fn.call(this);
                    }
                }
            });
        });
    };

    return base;
})(jQuery);

/* shortcut */
RKit.U = RKit.Utility;
