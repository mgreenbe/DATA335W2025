window.DATA_CATEGORY_NAME = "data-ga-category";
window.DATA_ACTION_NAME = "data-ga-action"; 
window.DATA_OPT_LABEL_NAME = "data-ga-opt-label"; 
window.DATA_OPT_VALUE_NAME = "data-ga-opt-value"; 

function analytics_element_tracking_click() {
    var data_category;
    var data_action; 
    var data_opt_label; 
    var data_opt_value; 
    
    if (jQuery(this).attr(window.DATA_CATEGORY_NAME) != null && jQuery(this).attr(window.DATA_CATEGORY_NAME).length > 0 ) {
        data_category = jQuery(this).attr(window.DATA_CATEGORY_NAME); 
    }
    
    if (jQuery(this).attr(window.DATA_ACTION_NAME) != null && jQuery(this).attr(window.DATA_ACTION_NAME).length > 0 ) {
        data_action = jQuery(this).attr(window.DATA_ACTION_NAME); 
    }
    
    if (jQuery(this).attr(window.DATA_OPT_LABEL_NAME) != null && jQuery(this).attr(window.DATA_OPT_LABEL_NAME).length > 0 ) {
        data_opt_label = jQuery(this).attr(window.DATA_OPT_LABEL_NAME); 
    }
    
    if (jQuery(this).attr(window.DATA_OPT_VALUE_NAME) != null && jQuery(this).attr(window.DATA_OPT_VALUE_NAME).length > 0 ) {
        data_opt_value = jQuery(this).attr(window.DATA_OPT_VALUE_NAME); 
    }

    ga('send', 'event', data_category, data_action, data_opt_label, data_opt_value, {'nonInteraction': 1});
}

function analytics_events_init() {
    // Google Analytics MUST be active, which implies there exists an function called ga. 
    if (typeof ga == "function") {    
        // Look for and bind any elements with a data-an-category attribute. 
        jQuery("*[" + window.DATA_CATEGORY_NAME + "]").each( function(index, element) {        
            if ( jQuery(this).attr(window.DATA_CATEGORY_NAME) != null && jQuery(this).attr(window.DATA_CATEGORY_NAME).length > 0 && jQuery(this).attr(window.DATA_ACTION_NAME) != null && jQuery(this).attr(window.DATA_ACTION_NAME).length > 0) {
                jQuery(this).bind("click", analytics_element_tracking_click);
            }            
        });        
    }
}

jQuery(document).ready(analytics_events_init); 