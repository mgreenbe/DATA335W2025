jQuery(document).ready( function() {

  var $cx = jQuery('.ninja-forms-cont');

  jQuery('.list-dropdown-wrap, .country-wrap', $cx).find('select').customSelect()
  jQuery('.checkbox-wrap, .list-checkbox-wrap', $cx).iCheck();

});