var MainNavigation = (function($) {

    var truncHTML = '<li class="overflow-drop-item main-nav-li">' +
                        '<a class="overflow-drop-dots main-nav-a" href="javascript:;" title="">' +
                            '<span>...</span>' +
                        '</a>' +
                        '<div class="overflow-drop-container clearfix">' +
                            '<div class="d-table">' +
                                '<ul class="overflow-drop-items"></ul>' +
                            '</div>' +
                        '</div>' +
                    '</li>';

    var defaults = {
        users: '.user-options-container nav > ul > li:not(:last-child)',
        container: 'header .main-nav-container ul.menu',
        items: '> li',
        trunc: truncHTML,
        overflow: '.overflow-drop-item',
        overflowItems: '.overflow-drop-items',
        overflowContainer: '.overflow-drop-container',
        overflowUser: '.overflow-drop-user',

        // callbacks
        onInit: function() {},
        onWrap: function() {}
    };

    function _Navigation(settings) {
        this._timeout = null;
        this.settings = $.extend(defaults, settings);

        return this.init();
    };

    _Navigation.prototype.resize = function() {
        var _self = this;
        clearTimeout(this._timeout);

        this._timeout = setTimeout(function() {
            _self.unwrap();
            _self.wrap();

            jQuery('header .main-nav').css('overflow', 'visible');
            jQuery('header .main-nav').css('height', 'inherit');
        }, 20);

        return this;
    };

    _Navigation.prototype.getItems = function() {
        this.items = this.container.find(this.settings.items);

        return this.items;
    };

    _Navigation.prototype.getExcess = function() {
        var i, len;
                  
        len = this.originalItems.length;
        
        for(i=1; i < len; i++) {
                if(this.originalItems.eq(0).offset().top < this.originalItems.eq(i).offset().top)
                    break;
        }
        
        return len - i;
    };    

    _Navigation.prototype.wrap = function() {
        var excess = this.getExcess();

        if(!excess) {
            this.getOverflow();
            this.overflow.addClass('hidden');
            return this;
        }

        var desiredOffset = this.originalItems.eq(0).offset().top;
        var overflowOffset = desiredOffset + 1;
        
        while (overflowOffset > desiredOffset)
        {
            this.unwrap();
            this.getItems();
            this.items = jQuery(this.items.splice(this.items.length-excess, excess));
            this.originalItems.eq(-excess).after(this.trunc);
            this.getOverflow();  
            this.items.clone().appendTo(this.overflowItems);
            this.items.addClass('hidden');
            this.overflow.removeClass('hidden');
            overflowOffset = this.overflow.offset().top - 12;
               
            excess++;
        }
        
        this.settings.onWrap();

        return this;
    };

    _Navigation.prototype.unwrap = function() {
        this.container.find(this.settings.overflow).remove();

        this.originalItems.removeClass('hidden');

        return this;
    };

    _Navigation.prototype.bind = function() {
        var _self = this;
        this.container.on('hover', this.settings.overflow, function(evt) {
            evt.preventDefault();

            _self.overflowContainer.stop()
        });

        jQuery(window).on('resize', function() {
            _self.resize();
        });

        return this;
    };

    _Navigation.prototype.getOverflow = function() {
        this.overflow = this.container.find(this.settings.overflow);
        this.overflowItems = this.container.find(this.settings.overflowItems);
        this.overflowContainer = this.container.find(this.settings.overflowContainer);
        this.overflowUser = this.container.find(this.settings.overflowUser);

        this.overflowWidth = this.overflow.outerWidth(true);

        return this;
    };

    _Navigation.prototype.init = function() {
        var _self = this;

        this.container = jQuery(this.settings.container);
        this.originalItems = this.getItems();
        
        if (this.originalItems.length)
        {
            this.trunc = this.settings.trunc;
            this.overflowWidth = 40;
            this.searchWidth = this.container.find('.header-search-wrap').outerWidth(true);
            this.users = jQuery(this.settings.users);
    
            this.getItems();
            this.bind();
    
            jQuery(window).trigger('resize');
    
            this.settings.onInit();

            jQuery(document).on('load', function() {
                _self.resize();
            });
        }

        return this;
    };

    return {
        create: function(options) {
            return new _Navigation(options);
        }
    };

})(jQuery);

var StickyMenu = (function($) {
    
    function _StickyMenu(options) {
        this.$headerContainers = options.headersContainers;
        if (typeof options.originalPositionMarkerSelector == 'undefined')
        {
            this.originalPositionMarkerId = options.originalPositionMarkerId;
            this.originalPositionMarkerSelector = '#' + this.originalPositionMarkerId;
        }
        else
            this.originalPositionMarkerSelector = options.originalPositionMarkerSelector;        
        this.stickyClass = options.stickyClass;
        this.timeoutTask();
        this.staticOriginalPositionMarker = jQuery(this.originalPositionMarkerSelector).length > 0;
        this.duration = options.duration;
        this.startOffset = options.startOffset;
        return this;
    };
  
    _StickyMenu.prototype.stickyPos = function(reinitialize) {
        if (reinitialize && ! this.staticOriginalPositionMarker)
            jQuery(this.originalPositionMarkerSelector).remove();
        
        if (! jQuery(this.originalPositionMarkerSelector).length)
            this.$headerContainers.after('<div id="'+this.originalPositionMarkerId+'"></div>');
            
        return jQuery(this.originalPositionMarkerSelector).offset();
    }
    
    _StickyMenu.prototype.stickIt = function() {
        var scrollTop = jQuery(window).scrollTop();
        
        if (scrollTop != this.lastScrollTop)
        {
            this.lastScrollTop = scrollTop; 
            var orgElementTop = this.stickyPos().top + jQuery(this.originalPositionMarkerSelector).height();
        
            if (scrollTop > 0 && scrollTop + this.startOffset  >= (orgElementTop) && orgElementTop >= 0) {
                if (! this.$headerContainers.hasClass(this.stickyClass)) {
                    jQuery(window).trigger('resize');
                    this.$headerContainers.css('position', 'fixed');
                    this.$headerContainers.hide().addClass(this.stickyClass).slideDown(this.duration);
                }
            } 
            else {
                this.$headerContainers.css('position', 'inherit');
                this.$headerContainers.removeClass(this.stickyClass).removeAttr('style');
                jQuery(window).trigger('resize');
                orgElementTop = this.stickyPos(true);
            }
        }
        
        
        this.timeoutTask();
    }
    
    _StickyMenu.prototype.timeoutTask = function() {
        var that = this;
        //setTimeout(function(){that.stickIt()}, 100); 
    }
  
      return {
        create: function(options) {
            return new _StickyMenu(options);
        }
      };
        
})(jQuery);


jQuery(document).ready( function() {
    var globalStickyNav = new StickyMenu.create({
        headersContainers: jQuery('.header-containers'),
        originalPositionMarkerId: 'header-containers-original',
        stickyClass: 'header-containers-sticky',
        duration: 450,
        startOffset: -200
    });
    window._NAV = new MainNavigation.create({
        onInit: function () {
            globalStickyNav.stickyPos();
        }
    });
    if (jQuery('.social-sticky-header').length > 0)
    {
        var socialStickyNav = new  StickyMenu.create({
            headersContainers: jQuery('.social-sticky-header'),
            originalPositionMarkerSelector: '.article-header',
            stickyClass: 'd-block',
            duration: 350,
            startOffset: -160
        });
    }
});