/**
 * RKit Helper Methods
 */
(function($) {
    'use strict';

    window.RKit = RKit || {};

    RKit.getViewPortWidth = function() {
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
    RKit.isMobile = function() {
        var re = /(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i;
        return re.test(window.navigator.userAgent)
    };

    /**
     * Detect retina displays
     */
    RKit.isRetina = function() {
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
    RKit.imageLoader = function(container, fn) {
        var target, n, c, images, image;

        if (typeof container === "object") {
            target = container;
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

})(jQuery);
