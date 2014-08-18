/**
 * RKit media
 */
RKit.Media = (function($) {
    'use strict';

    var base, config, Win, WinW, keys;

    /* default config */
    config = {
        'breakpoints': [
            ['mediaM', 768],
            ['mediaT', [768, 1024]],
            ['mediaD', 1024]
        ]
    };

    /* stash public methods */
    base = {};

    /**
     * Reset all media flags
     */
    base.resetMedia = function() {
        for(var i = 0, mediaLength = config.breakpoints.length; i < mediaLength; i++) {
            window[config.breakpoints[i][0]] = false;
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
        window[media] = true;

        /* trigger event */
        Win.trigger(media);

        /* RKit Module: Yoga */
        if ( typeof RKit.Y === "object" ) {
            RKit.Y.move(media);
        }
    };
    /**
     * Get media break point
     */
    base.getMedia = function() {
        WinW = RKit.U.getViewPortWidth();
        /* mobile */
        if ( !(window[ config.breakpoints[0][0] ]) && (WinW <= config.breakpoints[0][1] - 1) ) {
            base.setMedia(config.breakpoints[0][0]);
        }

        /* tablet */
        if ( !(window[ config.breakpoints[1][0] ]) && (WinW >= config.breakpoints[1][1] && WinW <= config.breakpoints[1][2]) ) {
            base.setMedia(config.breakpoints[1][0]);
        }

        /* desktop */
        if ( !(window[ config.breakpoints[2][0] ]) && WinW > config.breakpoints[2][1]) {
            base.setMedia(config.breakpoints[2][0]);
        }

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
