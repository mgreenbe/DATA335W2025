var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
(function() {
    var gads = document.createElement("script");
    gads.async = true;
    gads.type = "text/javascript";
    var useSSL = "https:" == document.location.protocol;
    gads.src = (useSSL ? "https:" : "http:") + "//securepubads.g.doubleclick.net/tag/js/gpt.js";
    var node =document.getElementsByTagName("script")[0];
    node.parentNode.insertBefore(gads, node);
})();

var CFLAdUtility = function() {
    this.network_code = '';
    this.targeting = [];
    this.divs_initialized = [];
    this.log_level = 0;

    this.init = function() {
        googletag.cmd.push(function() {
            googletag.pubads().enableSingleRequest();
            googletag.pubads().collapseEmptyDivs(true);
            googletag.enableServices();
        });

        // Add targeting only if no global JavaScript variable is set to disable it.
        if ( typeof window.disable_cfl_adutility_targeting == 'undefined' ) {
            googletag.cmd.push(function() {    
                var arr_targeting = window.CFLAdUtility.targeting;
                for ( var i = 0; i < arr_targeting.length; i++ ) {
                    var key = Object.keys(arr_targeting[i]);
                    var val = arr_targeting[i][key];

                    // Add a target only if it's not set in a global JavaScript variable as one to skip.
                    var bool_set_target = true;
                    if ( typeof window.disable_cfl_adutility_targets != 'undefined' ) {
                        if ( window.CFLAdUtility.inArray(key[0], window.disable_cfl_adutility_targets) == true ) {
                            bool_set_target = false;
                        }
                    }

                    // Actually set the DFP target.
                    if ( bool_set_target == true ) {
                        googletag.pubads().setTargeting(key[0], [val]);

                        window.CFLAdUtility.log('init(): Target ' + key[0] + ' set to ' + [val]);
                    }
                    else {
                        window.CFLAdUtility.log('init(): Did not set a target of ' + key[0] + ' to ' + [val] + ' because this post has disabled it.');
                    }
                }
            });
        }
    }

    this.displayAd = function( ad_unit, div_id, creative_size, slot_targets ) {
        var str_adunit = "/" + this.network_code + "/" + ad_unit;

        if ( window.CFLAdUtility.inArray(div_id, window.CFLAdUtility.divs_initialized) == true ) {
            window.CFLAdUtility.log('displayAd(): Aborting, already called googletag.display() on #' + div_id);

            return true;
        }
        window.CFLAdUtility.divs_initialized.push(div_id);

        googletag.cmd.push(function() {
            window.CFLAdUtility.log('displayAd(): About to call googletag.defineSlot() for ad unit ' + str_adunit + ' at size [' + creative_size + '] on ID #' + div_id);

            var ad_slot = googletag.defineSlot(str_adunit, creative_size, div_id).addService(googletag.pubads());

            if ( typeof slot_targets != 'undefined' ) {
                for ( var i = 0; i < slot_targets.length; i++ ) {
                    ad_slot.setTargeting(slot_targets[i][0], slot_targets[i][1]);

                    window.CFLAdUtility.log('displayAd(): Set a slot target for ID #' + div_id + ' with a key of ' + slot_targets[i][0] + ' and a value of ' + slot_targets[i][1]);
                }
            }

            googletag.display(div_id);

            window.CFLAdUtility.log('displayAd(): Called googletag.display() on #' + div_id);
        });
    }

    this.getPageTitleAsKeywords = function() {
        var str_path = window.location.pathname;
        str_path = str_path.replace(/http(s|)\:\/\//g, '/');
        str_path = str_path.replace(/^\//, '').replace(/\/$/, '');
        str_path = str_path.toLowerCase();
        var arr_path = str_path.split('/');

        var str_content_slug = arr_path[arr_path.length - 1];

        return str_content_slug;
    }

    this.inArray = function( needle, haystack ) {
        var length = haystack.length;

        for ( var i = 0; i < length; i++ ) {
            if (haystack[i] == needle) return true;
        }

        return false;
    }

    this.getLogLevelFromURL = function() {
        if ( window.location.search.indexOf('ad_debug=1') > -1 ) {
            return 1;
        } 
        
        return 0;
    }

    this.log = function( log_text ) {
        if ( this.log_level >= 1 ) {
            console.log('[CFL AdUtility][' + new Date().toUTCString() + '] ' + log_text);
        }
    }
};