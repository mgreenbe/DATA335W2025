jQuery(document).ready( function() {

    var $headerSearchField = jQuery('.header-search');
    var $mobileSearchField = jQuery('input.mobile-search-field');
    
    // mobile search
    function mobileSearch() {
        $mobileSearchField.focus(function () {
            jQuery(this).removeClass('mobile-search-field-entered');
        });
        $mobileSearchField.blur(function () {
            if (!jQuery(this).val()) {
                jQuery(this).removeClass('mobile-search-field-entered');
            } else {
                jQuery(this).addClass('mobile-search-field-entered');
            }
        });
    }
    mobileSearch();
    
    // desktop search
    function desktopSearch() {		
        jQuery('header').on('click','li.top-nav-toggle-search',function (event) {
			console.log('click');
            $headerSearchField.fadeToggle();
            $headerSearchField.find('input').focus();
            event.stopPropagation();
        });
        $headerSearchField.click(function (event) {
            event.stopPropagation();
        });
        jQuery('html').click(function () {
            $headerSearchField.fadeOut();
        });
    }
    desktopSearch();
    
    // form submission event
    jQuery('#header-search-form, #mobile-search').on('submit', function (event) {
       var searchTerm = jQuery(event.target).find('input').val();
       var blogId = jQuery('html').attr('blog_id');

    //    if ( blogId == '1' ) {
    //        window.location.href = '/search/?q=' + searchTerm;
    //    }
    //    else {
           window.location.href = '/?s=' + searchTerm;        
    //    }

       $headerSearchField.fadeOut();

       return false;
    });
        
});