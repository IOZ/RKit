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
     * @param side
     * @returns {*}
     */

    base.getViewPort = function(side) {
        var side = side || 'width';
        var viewport = { width: 0, height: 0 };

        if (typeof window.innerWidth != 'undefined') {
            viewport.width  = window.innerWidth;
            viewport.height = window.innerHeight;
        }
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
            viewport.width  = document.documentElement.clientWidth;
            viewport.height = document.documentElement.clientHeight;
        }
        // older versions of IE
        else {
            viewport.width  = document.getElementsByTagName('body')[0].clientWidth;
            viewport.height = document.getElementsByTagName('body')[0].clientHeight;
        }

        switch(side) {
            case 'width':
                return viewport.width;
                break;
            case 'height':
                return viewport.height;
                break;
            case 'both':
                return viewport;
                break;
        }
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
