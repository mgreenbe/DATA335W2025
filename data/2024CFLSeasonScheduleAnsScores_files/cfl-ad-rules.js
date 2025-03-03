var str_ad_network_code = '103711331';

if ( typeof(adZone) == 'undefined' ) {
	var adZone = function() {
		var str_zonedata = '';
		var arr_targets = [];
		var zone_definitions = new Array();
		var obj_adutility = new CFLAdUtility();

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'cfl.ca'}], 'cfl.ca' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'cfl.ca'}], 'cfl.ca' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'cfl.ca'}], 'cfl.ca' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'cfl.ca'}], 'cfl.ca' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'cfl.ca'}], 'cfl.ca' ));
		zone_definitions.push(new Array( '/standings', '', [{'title': 'standings'}, {'site': 'cfl.ca'}], 'cfl.ca' ));
		zone_definitions.push(new Array( '/stats', '', [{'title': 'stats'}, {'site': 'cfl.ca'}], 'cfl.ca' ));
		zone_definitions.push(new Array( '/league-leaders', '', [{'title': 'league-leaders'}, {'site': 'cfl.ca'}], 'cfl.ca' ));
		zone_definitions.push(new Array( '/team-leaders', '', [{'title': 'team-leaders'}, {'site': 'cfl.ca'}], 'cfl.ca' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'cfl.ca'}], 'cfl.ca' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'lcf.ca'}], 'lcf.ca' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'lcf.ca'}], 'lcf.ca' ));
		zone_definitions.push(new Array( '/nouvelles', '', [{'title': 'news'}, {'site': 'lcf.ca'}], 'lcf.ca' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'lcf.ca'}], 'lcf.ca' ));
		zone_definitions.push(new Array( '/calendrier', '', [{'title': 'schedule'}, {'site': 'lcf.ca'}], 'lcf.ca' ));
		zone_definitions.push(new Array( '/classement', '', [{'title': 'standings'}, {'site': 'lcf.ca'}], 'lcf.ca' ));
		zone_definitions.push(new Array( '/stats-leaders', '', [{'title': 'stats'}, {'site': 'lcf.ca'}], 'lcf.ca' ));
		zone_definitions.push(new Array( '/statistiques-equipes-lcf', '', [{'title': 'team-leaders'}, {'site': 'lcf.ca'}], 'lcf.ca' ));
		zone_definitions.push(new Array( '/communaute', '', [{'title': 'community'}, {'site': 'lcf.ca'}], 'lcf.ca' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'bclions.com'}], 'bclions.com' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'bclions.com'}], 'bclions.com' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'bclions.com'}], 'bclions.com' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'bclions.com'}], 'bclions.com' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'bclions.com'}], 'bclions.com' ));
		zone_definitions.push(new Array( '/tickets', '', [{'title': 'tickets'}, {'site': 'bclions.com'}], 'bclions.com' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'bclions.com'}], 'bclions.com' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'goelks.com'}], 'goelks.com' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'goelks.com'}], 'goelks.com' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'goelks.com'}], 'goelks.com' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'goelks.com'}], 'goelks.com' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'goelks.com'}], 'goelks.com' ));
		zone_definitions.push(new Array( '/tickets', '', [{'title': 'tickets'}, {'site': 'goelks.com'}], 'goelks.com' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'goelks.com'}], 'goelks.com' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'stampeders.com'}], 'stampeders.com' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'stampeders.com'}], 'stampeders.com' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'stampeders.com'}], 'stampeders.com' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'stampeders.com'}], 'stampeders.com' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'stampeders.com'}], 'stampeders.com' ));
		zone_definitions.push(new Array( '/tickets', '', [{'title': 'tickets'}, {'site': 'stampeders.com'}], 'stampeders.com' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'stampeders.com'}], 'stampeders.com' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'riderville.com'}], 'riderville.com' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'riderville.com'}], 'riderville.com' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'riderville.com'}], 'riderville.com' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'riderville.com'}], 'riderville.com' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'riderville.com'}], 'riderville.com' ));
		zone_definitions.push(new Array( '/tickets', '', [{'title': 'tickets'}, {'site': 'riderville.com'}], 'riderville.com' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'riderville.com'}], 'riderville.com' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'bluebombers.com'}], 'bluebombers.com' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'bluebombers.com'}], 'bluebombers.com' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'bluebombers.com'}], 'bluebombers.com' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'bluebombers.com'}], 'bluebombers.com' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'bluebombers.com'}], 'bluebombers.com' ));
		zone_definitions.push(new Array( '/tickets', '', [{'title': 'tickets'}, {'site': 'bluebombers.com'}], 'bluebombers.com' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'bluebombers.com'}], 'bluebombers.com' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'argonauts.ca'}], 'argonauts.ca' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'argonauts.ca'}], 'argonauts.ca' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'argonauts.ca'}], 'argonauts.ca' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'argonauts.ca'}], 'argonauts.ca' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'argonauts.ca'}], 'argonauts.ca' ));
		zone_definitions.push(new Array( '/tickets', '', [{'title': 'tickets'}, {'site': 'argonauts.ca'}], 'argonauts.ca' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'argonauts.ca'}], 'argonauts.ca' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'ottawaredblacks.com'}], 'ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'ottawaredblacks.com'}], 'ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'ottawaredblacks.com'}], 'ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'ottawaredblacks.com'}], 'ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'ottawaredblacks.com'}], 'ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/tickets', '', [{'title': 'tickets'}, {'site': 'ottawaredblacks.com'}], 'ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'ottawaredblacks.com'}], 'ottawaredblacks.com' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'fr.ottawaredblacks.com'}], 'fr.ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'fr.ottawaredblacks.com'}], 'fr.ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'fr.ottawaredblacks.com'}], 'fr.ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'fr.ottawaredblacks.com'}], 'fr.ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'fr.ottawaredblacks.com'}], 'fr.ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/tickets', '', [{'title': 'tickets'}, {'site': 'fr.ottawaredblacks.com'}], 'fr.ottawaredblacks.com' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'fr.ottawaredblacks.com'}], 'fr.ottawaredblacks.com' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'montrealalouettes.com'}], 'montrealalouettes.com' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'montrealalouettes.com'}], 'montrealalouettes.com' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'montrealalouettes.com'}], 'montrealalouettes.com' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'montrealalouettes.com'}], 'montrealalouettes.com' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'montrealalouettes.com'}], 'montrealalouettes.com' ));
		zone_definitions.push(new Array( '/tickets', '', [{'title': 'tickets'}, {'site': 'montrealalouettes.com'}], 'montrealalouettes.com' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'montrealalouettes.com'}], 'montrealalouettes.com' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'en.montrealalouettes.com'}], 'en.montrealalouettes.com' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'en.montrealalouettes.com'}], 'en.montrealalouettes.com' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'en.montrealalouettes.com'}], 'en.montrealalouettes.com' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'en.montrealalouettes.com'}], 'en.montrealalouettes.com' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'en.montrealalouettes.com'}], 'en.montrealalouettes.com' ));
		zone_definitions.push(new Array( '/tickets', '', [{'title': 'tickets'}, {'site': 'en.montrealalouettes.com'}], 'en.montrealalouettes.com' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'en.montrealalouettes.com'}], 'en.montrealalouettes.com' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'schooners.ca'}], 'schooners.ca' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'schooners.ca'}], 'schooners.ca' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'schooners.ca'}], 'schooners.ca' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'schooners.ca'}], 'schooners.ca' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'schooners.ca'}], 'schooners.ca' ));
		zone_definitions.push(new Array( '/standings', '', [{'title': 'standings'}, {'site': 'schooners.ca'}], 'schooners.ca' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'schooners.ca'}], 'schooners.ca' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'fr.schooners.ca'}], 'fr.schooners.ca' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'fr.schooners.ca'}], 'fr.schooners.ca' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'fr.schooners.ca'}], 'fr.schooners.ca' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'fr.schooners.ca'}], 'fr.schooners.ca' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'fr.schooners.ca'}], 'fr.schooners.ca' ));
		zone_definitions.push(new Array( '/standings', '', [{'title': 'standings'}, {'site': 'fr.schooners.ca'}], 'fr.schooners.ca' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'fr.schooners.ca'}], 'fr.schooners.ca' ));

		zone_definitions.push(new Array( '/*', '', [{'title': obj_adutility.getPageTitleAsKeywords()}, {'site': 'ticats.ca'}], 'ticats.ca' ));
		zone_definitions.push(new Array( '/', '', [{'title': 'home-page'}, {'site': 'ticats.ca'}], 'ticats.ca' ));
		zone_definitions.push(new Array( '/news', '', [{'title': 'news'}, {'site': 'ticats.ca'}], 'ticats.ca' ));
		zone_definitions.push(new Array( '/videos', '', [{'title': 'videos'}, {'site': 'ticats.ca'}], 'ticats.ca' ));
		zone_definitions.push(new Array( '/schedule', '', [{'title': 'schedule'}, {'site': 'ticats.ca'}], 'ticats.ca' ));
		zone_definitions.push(new Array( '/standings', '', [{'title': 'standings'}, {'site': 'ticats.ca'}], 'ticats.ca' ));
		zone_definitions.push(new Array( '/community', '', [{'title': 'community'}, {'site': 'ticats.ca'}], 'ticats.ca' ));
		zone_definitions.push(new Array( '/listen', '', [{'title': 'listen'}, {'site': 'ticats.ca'}], 'ticats.ca' ));

		var str_path = window.location.pathname;
		var str_domain = window.location.host;
		str_path = str_path.replace(/http(s|)\:\/\//g, '/');
		str_path = str_path.replace(/^\//, '').replace(/\/$/, '');
		str_path = str_path.toLowerCase();
		var arr_path = str_path.split('/');
		if ( arr_path.length > 0 ) {
			var int_sizedefs = zone_definitions.length;
			for ( var i = 0; i < int_sizedefs; i++ ) {
				var arr_zoneurl = zone_definitions[i][0].replace(/^\//, '').replace(/\/$/, '').split('/');
				var keep_matching = true;
				var last_section_matches = false;
				
				if ( typeof zone_definitions[i][3] !== 'undefined' ) {
					if ( str_domain.indexOf(zone_definitions[i][3]) == -1 ) {
						keep_matching = false;
					}
				}

				for ( var j = 0; j < arr_path.length && keep_matching == true; j++ ) {
					if ( arr_zoneurl[j] == arr_path[j] || arr_zoneurl[j] == '*' ) {
						if ( j == (arr_zoneurl.length - 1) ) {
							last_section_matches = true;
						}
					}
					else {
						keep_matching = false;
					}
				}
				
				if ( last_section_matches == true ) {
					str_zonedata = zone_definitions[i][1];
					arr_targets = zone_definitions[i][2];
				}
			}
		}

		arr_targets.push({'pathname': window.location.pathname});
		
		return (new Array(str_zonedata, arr_targets));
	};
}
var arr_zone_data = adZone();

window.CFLAdUtility = new CFLAdUtility();
window.CFLAdUtility.log_level = window.CFLAdUtility.getLogLevelFromURL();
window.CFLAdUtility.network_code = str_ad_network_code;
window.CFLAdUtility.targeting = arr_zone_data[1];
window.CFLAdUtility.init();