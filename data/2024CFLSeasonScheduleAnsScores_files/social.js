jQuery(document).ready( function() {

  /* helper for the socialShare plugin. Get parameters directly from data attributes

      <button class="social-share"></button> will initialize the share feature

      add following data-attributes only as necessary:

        data-services - if not present will use 'facebook,twitter,google'
              list available: 'blogger,delicious,digg,facebook,friendfeed,google,linkedin,myspace,pinterest,reddit,stumbleupon,tumblr,twitter,windows,yahoo'

        data-title - if not present will use page title tag
        data-url - if not present will use current page url
        data-desc - if not present will look for meta description tag

  */

  jQuery('.social-share').each(function() {

    var $this = jQuery(this),
      config = {};

    jQuery.extend(config, {
      social: $this.data('services') ? $this.data('services') : 'facebook,twitter,linkedin'
    })
    if ($this.data('title')) {
      jQuery.extend(config, {
        title: $this.data('title')
      })
    }
    if ($this.data('url')) {
      jQuery.extend(config, {
        shareUrl: $this.data('url')
      })
    }
    if ($this.data('description')) {
      jQuery.extend(config, {
        description: $this.data('description')
      })
    }

    $this.socialShare(config)

  });

});