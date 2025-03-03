jQuery( document ).ready(function() {
    // Track e-mail addresses entered into the Newsletter Signup Box at the bottom of Articles.
    jQuery(document).on('blur', ".newsletter-input input[name='email']", function() {
        Trialfire.identify({
          email: $(this).val(),
        });
    });

    
    // Log a MailChimp subscriber's unique_id (mc_eid) to use later to identify the user.
    var str_tf_url = window.location.href;
    var obj_tf_url = new URL(str_tf_url);
    var str_mc_eid = obj_tf_url.searchParams.get("mc_eid");
    if ( str_mc_eid != null ) {
        Trialfire.identify({
          mc_eid: str_mc_eid,
        });
    }


    // Log a SalesForce Marketing Cloud's member_id (mid) to use later to identify the user.
    var str_mid = obj_tf_url.searchParams.get("mid");
    if ( str_mid != null ) {
        Trialfire.identify({
          sf_mid: str_mid,
        });
    }

    // Log ninja forms newsletter customer data to trialfire
    jQuery(document).on( 'nfFormReady', function(e, layoutView) {
      const $this = jQuery(this);

      $this.on('click', 'input[value="Submit"]' , function(){
        const $clickedElement = jQuery(this);

        const  userEmail = $clickedElement.find("input[name='email']").val();
        const  userFirstName = $clickedElement.find("input[name='fname']").val();
        const  userLastName = $clickedElement.find("input[name='lname']").val();
        const  userpostal = $clickedElement.find("input[name='zip']").val();
        const  userphone = $clickedElement.find("input[name='phone']").val();

        $.trialfireIdentify(userEmail , userFirstName , userLastName , userpostal , userphone);
        $.trialfireTrack("email_opt_in" , "newsletter_page" , "EDM");
        
      });
    });

     // Log Newsletter signup customer data to trialfire for team sites - SSK , WPG  
     jQuery('#mc-embedded-subscribe-form').on('submit', function() {
      const $this = jQuery(this);

      const userEmail = $this.find("input[name='EMAIL']").val();
      const userFirstName = $this.find("input[name='FNAME']").val();
      const userLastName = $this.find("input[name='LNAME']").val();
      
      const formAction = jQuery('#mc-embedded-subscribe-form').attr('action');
      const teamRiderville = "riderville" ;
      const teamWinnipeg = "bluebombers" ;
      let teamName ;

      if(formAction.includes(teamRiderville) ){
        teamName = "ssk";
      }
      else if(formAction.includes(teamWinnipeg) ){
        teamName = "wpg";
      }
      
      $.trialfireIdentify(userEmail , userFirstName , userLastName );
      $.trialfireTrack("email_opt_in" , "newsletter_page" , teamName);
       
     });

    // Log CFL Newsletter signup customer data to trailfire on submit click event
    jQuery('.mc4wp-form').on('submit', function() {
      const $this = jQuery(this);

      const userEmail = $this.find("input[name='EMAIL']").val();
      const userFirstName = $this.find("input[name='FNAME']").val();
      const userLastName = $this.find("input[name='LNAME']").val();
      
      $.trialfireIdentify(userEmail , userFirstName , userLastName );
      $.trialfireTrack("email_opt_in" , "newsletter_page" , "cfl");
           
    });

    $.trialfireIdentify = function( uemail, ufirstName, ulastName , upostal , uphone){ 
      Trialfire.identify({
        email: uemail,
        firstName : ufirstName,
        lastName : ulastName ,
        postal : upostal ,
        phone : uphone ,
      });
    }

    $.trialfireTrack = function(trackEvent , pageSource, teamName){ 
      Trialfire.track( trackEvent, {
        source: pageSource,
        team: teamName
      }); 
    }

});
