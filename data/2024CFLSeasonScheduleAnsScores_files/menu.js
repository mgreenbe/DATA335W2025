jQuery( document ).ready(function() {
    // Accordian Action
    var action = 'click';
    var speed = "500";

    // Highlight the active menu item.
    var str_pathname = window.location.pathname;
    var arr_items = jQuery("ul.menu > li[data-menu='" + str_pathname + "']");
    if ( arr_items.length > 0 ) {
        jQuery(arr_items[0]).addClass('main-nav-active');
    }

    if ( $(window).width() <= 736 ) {
        $('ul.sidebar-nav li.menu-item > a').next().hide();

        // List Item click handler for dropdown (+/-) icon to expand/close
        $('ul.sidebar-nav li.menu-item > a').on(action, function() {
            $(this).parent().toggleClass("menu-dropdown-expanded");
        });

        $('ul.sidebar-nav li.menu-item > a').on(action, function(event) {
            // Get the attributes we need to clone the A element.
            var cur_item_name = $(this).text();
            var cur_item_url = $(this).attr("href");

            // Get the class name we'll add to the LI element (to make sure we don't duplicate it multiple times).
            var cur_item_parent_id = $(this).parent().attr('id');

            var cur_parent_list_item = '<li class="menu-item ' + cur_item_parent_id + '"><a href="' + cur_item_url + '" data-ga-category="Clicks - main-menu" data-ga-action="'+cur_item_name+'" data-ga-label="'+cur_item_url+'">'+cur_item_name+'</a></li>';

            //$(this).parents("li:last").toggleClass("menu-dropdown-expanded");
            $(this).next().slideToggle(speed).children('.sub-menu').slideUp();

            // Add the top-level item as a link within the child list of LIs (so it's can actually be navigated to).
            var num_cloned_items_existing = $(event.target).siblings('ul.sub-menu').find('li.' + cur_item_parent_id).length;
            if ( num_cloned_items_existing == 0 ) {
                $(event.target).siblings('ul.sub-menu').prepend(cur_parent_list_item);
            }

            if( $(this).closest("li.menu-item").children("ul.sub-menu").length > 0 ) {
                event.preventDefault();
                return false;
            }

        });
    }

    jQuery('.mobile-toggle-menu').on('click touchstart', function (event) {
        event.preventDefault();
        
        jQuery('.container').toggleClass('mobile-nav-opend');
        jQuery('html').toggleClass('no-background-scroll');
    });

    jQuery('.mobile-nav-overlay').on('click touchstart', function (event) {
        event.preventDefault();
        jQuery('.sub-nav-mobile').removeClass('active');
        jQuery('.container').removeClass('mobile-subnav-opend').removeClass('mobile-nav-opend').removeClass('mobile-calendar-opend');
        jQuery('html').removeClass('no-background-scroll');
    });

    jQuery('.mobile-toggle-calendar').on('click touchstart', function (event) {
        event.preventDefault();

        jQuery('.container').toggleClass('mobile-calendar-opend');
        jQuery('html').toggleClass('no-background-scroll');
        display_mobile_scoreboard();
        Visibility.every(15000, 5 * 60000, function () {
            display_mobile_scoreboard();
        });

        if ( typeof ga == "function" ) {
            var data_category = 'Clicks - Header (Mobile)';
            var data_action = 'header-mobile-scoreboard';
            var data_opt_label = 'Toggle Scoreboard Open';
            var data_opt_value = null;
            
            ga('send', 'event', data_category, data_action, data_opt_label, data_opt_value, {'nonInteraction': 1}); 
        }
    });

    jQuery('.sidebar-has-subnav').on('click', function (event) {
        event.preventDefault();
        var target = jQuery(this).attr('data-target');
        jQuery('#' + target).addClass('active');
        jQuery('.container').toggleClass('mobile-subnav-opend');
    });

    jQuery('.back-link').on('click', function (event) {
        event.preventDefault();
        jQuery(this).closest('.sub-nav-mobile').removeClass('active');
        jQuery('.container').removeClass('mobile-subnav-opend');
    });

    // mobile sub nav - add width to the parent so the children can be scrolled with overflow auto in place
    jQuery('.mobile-sub-nav-items, .mobile-sub-nav-wrap ul, .team-stats-sub-nav ul').each(function () {
        var totalWidth = 0;
        var $self = jQuery(this);
        $self.children('li').each(function () {
            totalWidth += jQuery(this).outerWidth();
        });
        //console.log(totalWidth);
        $self.width(totalWidth + 1);
    });
});

function display_mobile_scoreboard() {
    if ( jQuery('.container').hasClass('mobile-calendar-opend') == false ) {
        return;
    }
    
    jQuery.ajax({ 
        url: "/wp-content/themes/cfl.ca/inc/admin-ajax.php?action=get_mobile_scoreboard" 
    })
    .done(function( data ) { 
        jQuery('#mob-sb-games').html(data);
    });
}

function displayLocalGameDate( game_time ) {
    if ( game_time.length === 0 ) {
        return '';
    }

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    if ( jQuery(document).find('html').attr('lang') == 'fr' ) {
        days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Dec'];   
    }

    var d = new Date(Number(game_time));

    var str_day = days[ d.getDay() ];
    var str_month = months[ d.getMonth() ];
    var str_dayofmonth = d.getDate();

    if ( jQuery(document).find('html').attr('lang') == 'fr' ) {
        return str_day + ' ' + str_dayofmonth + ' ' + str_month;
    }

    return str_day + ' ' + str_month + ' ' + str_dayofmonth;
}

function displayLocalGameTime( game_time ) {
    if ( game_time.length === 0 ) {
        return '';
    }

    var d = new Date(Number(game_time));
    //var offset = (d.getTimezoneOffset() * -1);
    //d = new Date(d.getTime() + (offset * 60000));

    var int_hour = d.getHours();
    var int_minutes = d.getMinutes();
    var str_ante = 'AM';
    var str_hour = int_hour;
    
    if ( int_hour === 12 ) {
        str_ante = 'PM';
    }
    if ( int_hour > 12 ) {
        str_hour = int_hour - 12;
        str_ante = 'PM';
    }
    if ( int_hour === 0 ) {
        str_hour = '12';
    }
    var str_minutes = String(int_minutes);
    if ( str_minutes.length < 2 ) {
        str_minutes = '0' + str_minutes;
    }

    if ( jQuery(document).find('html').attr('lang') == 'fr' ) {
        return int_hour + ":" + str_minutes + ' ' + getTimezoneAcronym();
    }

    return str_hour + ":" + str_minutes + " " + str_ante + ' ' + getTimezoneAcronym();
}

function getTimezoneAcronym() {
    var str_tz_region = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if ( typeof str_tz_region === 'undefined' ) {
        str_tz_region = moment.tz.guess();
    }
    var str_timezone = moment.tz.zone(str_tz_region).abbr( moment() );

    var arr_translations = new Array();
    arr_translations['PDT'] = 'HP';
    arr_translations['PST'] = 'HP';
    arr_translations['MDT'] = 'HR';
    arr_translations['MST'] = 'HR';
    arr_translations['CDT'] = 'HC';
    arr_translations['CST'] = 'HC';
    arr_translations['EDT'] = 'HE';
    arr_translations['EST'] = 'HE';
    arr_translations['ADT'] = 'HA';
    arr_translations['AST'] = 'HA';
    arr_translations['NDT'] = 'HT';
    arr_translations['NST'] = 'HT';

    if ( jQuery(document).find('html').attr('lang') == 'fr' ) {
        if ( typeof arr_translations[str_timezone] !== 'undefined' ) {
            str_timezone = arr_translations[str_timezone];
        }
    }

    return str_timezone;
}

// Get a URL parameter value by its name; if blank, returns null.
function getURLParameterByName( name, url ) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Turn escaped HTML back into HTML that is immediately parsed and displayed/executed.
function htmlDecode(input) {
    var e = document.createElement('textarea');
    e.innerHTML = input;

    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

// Add a useful function for detecting if the site visitor is using a touch device.
function is_touch_device() {
  return 'ontouchstart' in window        // works on most browsers 
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
};

// Count the number of times the A element has been clicked using the data-clicked attribute; 
// if it doesn't exist, add it and don't let them click through (prevent default action).
function has_been_tapped( el, set_attribute ) {
    var data_clicked = jQuery(el).attr('data-clicked');
    if ( typeof data_clicked === 'undefined' ) {
        // Delete the data-clicked attribute from all other elements.
        jQuery("[data-clicked]").removeAttr('data-clicked');

        // Add the data-clicked attribute to this element.
        jQuery(el).attr('data-clicked', '1');

        return false;
    }

    return true;
}

// Instantiate headroom.js (fixed header, but only on scroll-up).
jQuery(document).ready( function() {
    if ( $(".headroom-nav").length > 0 ) {
        var nav_element = document.getElementById("headroom-nav");
        var headroom  = new Headroom(nav_element, {
            "offset": 175,
            "tolerance": {
              up: 5,
              down: 5, 
            },
        });
        headroom.init(); 
    }
});