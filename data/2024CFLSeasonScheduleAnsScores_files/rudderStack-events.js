jQuery( document ).ready(function() {
    // Track e-mail addresses entered into the Newsletter Signup Box at the bottom of Articles.
    jQuery('#article-newsletter-form').on('submit', function() {
      const $this = jQuery(this);
      const userEmail = $this.find("input[name='email']").val();

        rudderanalytics.identify({
          email: userEmail,
        });

        rudderanalytics.track("email_opt_in", {
          source: "newsletter_page",
          team: "cfl" ,
        });
    });


    // Log a MailChimp subscriber's unique_id (mc_eid) to use later to identify the user.
    var str_tf_url = window.location.href;
    var obj_tf_url = new URL(str_tf_url);
    var str_mc_eid = obj_tf_url.searchParams.get("mc_eid");
    if ( str_mc_eid != null ) {
        rudderanalytics.identify({
          mc_eid: str_mc_eid,
        });
    }


    // Log a SalesForce Marketing Cloud's member_id (mid) to use later to identify the user.
    var str_mid = obj_tf_url.searchParams.get("mid");
    if ( str_mid != null ) {
        rudderanalytics.identify({
          sf_mid: str_mid,
        });
    }

    // Log ninja forms and newsletter customer data to rudderstack
    jQuery(document).on( 'nfFormReady', function( e, layoutView) {
      const self = this;

      $(self).on('click', 'input[value="Submit"]' , function(){
        const $form = $(self);
        const $formDiv = $form.find('div[id^="nf-form-"].nf-form-cont');
        const formDivId = $formDiv.attr('id'); // Get the form ID to check against the CFL newsletter Ninja form

        const no_identify = $form.find('input[type="hidden"][value="no_identify"]');

        if (no_identify.length > 0) {
          return false;
        }
       
        const userEmail = $form.find("input[name='email']").val();
        const userFirstName = $form.find("input[name='fname']").val();
        const userLastName = $form.find("input[name='lname']").val();
        const userpostal = $form.find("input[name='zip']").val();
        const userphone = $form.find("input[name='phone']").val();
        const faveTeam = $form.find(".fave_team").val();

        $.identifyCall(userEmail , userFirstName , userLastName , userpostal , userphone, faveTeam);
        //If its a CFL Newsletter Ninja form
        if( formDivId == "nf-form-477-cont") {
          $.trackCall("email_opt_in" , "newsletter_page");
        } 
        //For regular Ninja forms on the site
        else {
          $.trackCall("form_submitted", "cfl"); 
        }
       
        
      });
    });
        
    // Log Newsletter signup customer data to rudderstack for team sites - SSK , WPG  
     jQuery('#mc-embedded-subscribe-form').on('submit', function() {
      const $this = jQuery(this);

      const userEmail = $this.find("input[name='EMAIL']").val();
      const userFirstName = $this.find("input[name='FNAME']").val();
      const userLastName = $this.find("input[name='LNAME']").val();

      const formAction = jQuery('#mc-embedded-subscribe-form').attr('action');
      const teamRiderville = "riderville" ;
      const teamWinnipeg = "bluebombers" ;
      let teamName ;

      if(formAction.includes(teamRiderville)){
        teamName = "ssk";
      }
      else if(formAction.includes(teamWinnipeg)){
        teamName = "wpg";
      }
      
      $.identifyCall(userEmail , userFirstName , userLastName );
      $.trackCall("email_opt_in" , "newsletter_page" , teamName);

     });

    $.identifyCall = function( uemail, ufirstName, ulastName , upostal , uphone, faveTeam = null) {
      rudderanalytics.identify({
        email: uemail,
        firstName : ufirstName,
        lastName : ulastName ,
        postal : upostal ,
        phone : uphone ,
        faveTeam: faveTeam
      });
    }

    $.trackCall = function(trackEvent , pageSource, teamName = null){ 
      rudderanalytics.track( trackEvent, {
        source: pageSource,
        team: teamName
      }); 
    }

});



