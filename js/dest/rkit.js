/**
 * RKit - responsive web kit for developers
 * Core
 */
var RKit = {
    version: '1.0.0'
};

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

/**
 * RKit: yoga
 * smart block move
 *
 * Used data attributes
 * data-push="{selector}"
 * data-dir="{before|after|append|prepend}"
 * data-bp="{media{M|T|D}}"
 */
RKit.Yoga = (function($) {
   'use strict';

    var base, config;

    /* default config */
    config = {
        className: 'js-push',
        tempClass: 'js-rkit-temp'
    };

    base = {};

    /**
     * Blocks storage
     * @type {Array}
     */
    base.blocksStorage = [];

    /**
     * Move block
     * @param media
     */
    base.move = function(media) {
        var i, len, pushTo, clone;
        len = base.blocksStorage.length;
        for (i = 0; i < len; i++) {
            if ( base.blocksStorage[i].pushBreakPoint == media && !base.blocksStorage[i].isInsert ) {
                pushTo = $(base.blocksStorage[i].pushTo);
                clone = base.blocksStorage[i].$block.clone().addClass(config.tempClass + '-' + i);

                switch (base.blocksStorage[i].pushDir) {
                    case 'before':
                        pushTo.before(clone);
                        break;
                    case 'after':
                        pushTo.after(clone);
                        break;
                    case 'append':
                        pushTo.append(clone);
                        break;
                    case 'prepend':
                        pushTo.prepend(clone);
                        break;
                }
                base.blocksStorage[i].isInsert = true;
                base.blocksStorage[i].$block.hide();
            } else if ( base.blocksStorage[i].pushBreakPoint == media && base.blocksStorage[i].isInsert ) {
                base.blocksStorage[i].$block.hide();
                $('.' + config.tempClass + '-' + i).show();
            } else if ( base.blocksStorage[i].pushBreakPoint !== media && base.blocksStorage[i].isInsert ) {
                base.blocksStorage[i].$block.show();
                $('.' + config.tempClass + '-' + i).hide();
            }
        }
    };

    /**
     * Cache all blocks
     */
    base.getBlocks = function() {
        var block, pushTo, pushDir, pushBreakPoint;
        $('.' + config.className).each(function() {
            block = $(this);
            pushTo = block.data('push');
            pushDir = block.data('dir');
            pushBreakPoint = block.data('bp');

            base.blocksStorage.push({
                $block: block,
                pushTo: pushTo,
                pushDir: pushDir,
                pushBreakPoint: pushBreakPoint,
                isInsert: false
            });
        });
    };

    /**
     * Initialize
     */
    base.init = function(conf) {
        if (typeof conf === "object") {
            config = $.extend({}, config, conf);
        }
        base.getBlocks();
    };

    return base;
})(jQuery);

RKit.Y = RKit.Yoga;

/**
 * RKit media
 */
RKit.Media = (function($) {
    'use strict';

    var base, config, Win, WinW, keys, MT, TD, mediaList, prefix;

    /* default config */
    config = {
        'breakpoints': {
            'M' : [768],
            'T' : [768, 1024],
            'D' : [1024]
        },
        'prefix' : 'media'
    };

    keys = Object.keys(config.breakpoints);
    MT = keys[0] + '' + keys[1];
    TD = keys[1] + '' + keys[2];

    mediaList = keys.slice(0);
    mediaList.push(MT, TD);

    /* stash public object */
    base = {};

    /**
     * Reset all media flags
     */
    base.resetMedia = function() {
        var mediaListLength = mediaList.length;
        for(var i = 0; i<mediaListLength; i++) {
            window[config.prefix + mediaList[i]] = false;
        }
    };

    /**
     * Set media break point
     * @param media
     */
    base.setMedia = function(media) {
        /* reset all media */
        base.resetMedia();

        /* set media */
        window[config.prefix + media] = true;

        /* trigger event */
        Win.trigger(config.prefix + media);

        /* RKit Module: Yoga */
        if ( typeof RKit.Y === "object" ) {
            RKit.Y.move(config.prefix + media);
        }
    };

    /**
     * Get media break point
     */
    base.getMedia = function() {
        WinW = RKit.U.getViewPortWidth();

        /* mobile */
        if ( !(window[config.prefix + keys[0]]) && (WinW <= config.breakpoints.M[0] - 1) ) {
            base.setMedia(keys[0]);
        }

        /* tablet */
        if ( !(window[config.prefix + keys[1]]) && (WinW >= config.breakpoints.T[0] && WinW <= config.breakpoints.T[1]) ) {
            base.setMedia(keys[1]);
        }

        /* desktop */
        if ( !(window[config.prefix + keys[2]]) && WinW > config.breakpoints.D[0]) {
            base.setMedia(keys[2]);
        }

        /* TODO: mobile & tablet */
        /* TODO: tablet & desktop */

    };

    /**
     * Initialize
     */
    base.init = function(conf) {
        if (typeof conf === "object") {
            config = $.extend({}, config, conf);
        }

        Win = $(window);
        setTimeout(base.getMedia, 0);
        Win.resize(base.getMedia);
    };

    return base;
})(jQuery);

/**
 * RKit: Application Initialize
 *
 */
RKit.init = function (conf) {
    /* Module: Media */
    if (typeof conf.media === "object") {
        RKit.Media.init(conf.media);
    }

    /* Module: Yoga */
    if (typeof conf.yoga === "object") {
        RKit.Y.init(conf.yoga);
    }
};
