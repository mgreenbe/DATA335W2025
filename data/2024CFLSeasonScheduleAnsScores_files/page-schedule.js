jQuery(document).ready( function() {

  var $cx = jQuery('.schedule-wrapper');

  jQuery('.action a', $cx).on('click', function(e) {
    // Prevent toggle of accordion item when clicking the link for gametracker
    e.stopPropagation();

    var str_url = $(this).data('url');
    if ( typeof ga == 'function' ) {
      if ( typeof ga.getAll == 'function' ) {
        if ( str_url.includes('?') ) {
          str_url = str_url + '&' + ga.getAll()[0].get('linkerParam');
        }
        else {
          str_url = str_url + '?' + ga.getAll()[0].get('linkerParam');
        }
      }
    }

    window.location.href = str_url;
  });

  jQuery('.countdown', $cx).each( function( i ) {
    dtime = new Date( jQuery(this).data('kickoff') );

    jQuery(this).countdown(dtime, function(event) {
        var str_days = 'days';
        var str_hours = 'hours';
        if ( jQuery(document).find('html').attr('lang') == 'fr' ) {
            str_days = 'jours';
            str_hours = 'heures';
        }

        var $this = $(this).html(event.strftime(''
          + '<div><div class="number">%D</div><div class="text">' + str_days + '</div></div><div class="separator">:</div>'
          + '<div><div class="number">%H</div><div class="text">' + str_hours + '</div></div><div class="separator">:</div>'
          + '<div><div class="number">%M</div><div class="text">mins</div></div><div class="separator">:</div>'
          + '<div><div class="number">%S</div><div class="text">secs</div></div>'));
        });
  });

    jQuery('#season-dropdown li a').on('click', function(e) {
        var str_season = $(this).text();

        window.location.href = window.location.pathname + '?season=' + str_season;
    })
});