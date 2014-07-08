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
