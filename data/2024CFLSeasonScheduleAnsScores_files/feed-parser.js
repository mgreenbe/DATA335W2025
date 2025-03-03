var FeedParser = (function($) {
	    
	function _FeedParser(context, lang) {
		this.context = context;
		this.lang = lang;
	}

	//Date Helpers
	var startOfDay = function (date) {
		// Assigning a Date object actually assigns it by reference; we want to 
		// create a copy using its value by doing the below.
		var copiedDate = new Date(date.getTime());
	 	copiedDate.setHours(0, 0, 0, 0);

	  	return copiedDate;
	};
	var isTomorrow = function (date) {
	  	var tomorrow = new Date();
	  	tomorrow.setDate(tomorrow.getDate() + 1);
	  	return startOfDay(date).getTime() == startOfDay(tomorrow).getTime();
	};
	var isToday = function (date) {
	  	return startOfDay(date).getTime() == startOfDay(new Date()).getTime();
	};        
    var isTodaysGameDuringTheDay = function(date) {
        // set a date object time to be 6:59:59pm today
        var beforeTonightDate = new Date();             
        beforeTonightDate.setHours(18,59,59);
        var beforeTonightTime = beforeTonightDate.getTime(); 
        var gameTime = date.getTime(); 
                                
        return gameTime < beforeTonightTime; 
    }
        
	var monthsShort = { 
	  "en": ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	  "fr": ['Janv', 'F\u00e9vr', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Ao\u00fbt', 'Sept', 'Oct', 'Nov', 'Déc']
	};
	var daysShort = {
	  "en": ['Sun','Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
	  "fr": ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
	};
	function zeroPad(num, places) {
		if ( num == null ) {
			return '00';
		}

		var zero = places - num.toString().length + 1;

		return Array(+(zero > 0 && zero)).join("0") + num;
	}

	function time12H( date ) {
	  var hours = date.getHours();
	  var minutes = zeroPad(date.getMinutes(),2);
	  var ampm = hours >= 12 ? 'pm' : 'am';
	  
	  hours = hours % 12;
	  hours = hours ? hours : 12;

	  var strTime = hours + ':' + minutes + ' ' + ampm + ' ' + getTimezoneAcronym();
	  
	  return strTime;
	}

	function time24H( date ) {
	  var hours = date.getHours();
	  var minutes = zeroPad(date.getMinutes(),2);

	  var strTime = hours + ':' + minutes + ' ' + getTimezoneAcronym();

	  return strTime;
	}

	function getTimezoneAcronym() {
        
        if (typeof(moment_compat) !== "undefined" && typeof(moment.tz) === "undefined") {
            console.warn("moment.tz is undefined. Assigning moment_compat to moment...");
            moment = moment_compat; 
        }
        
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
	
	//Event date formatter
	_FeedParser.prototype.formatEventDate = function(key, eventData, $el) {
		var date = new Date(eventData[key]);
        var time_display = ""; 
        var arr_event_data = []; 
        
		if (eventData.eventStatus_eventStatusId == 2 && eventData.eventStatus_isActive == true) {
			if ( eventData["eventStatus_minutes"] == null  ) {
				1;
			}
			else {
				if ( eventData["eventStatus_period"] >= 5 ) {
					var str_num_ot = '';
					if ( eventData["eventStatus_period"] >= 6 ) {
						str_num_ot = '' + (eventData["eventStatus_period"] - 4);
					}
					time_display = str_num_ot + this.t('OT') + ' ' + zeroPad(eventData["eventStatus_minutes"], 2) + ':' + zeroPad(eventData["eventStatus_seconds"], 2);
				}
				else {
					time_display = this.formatOrdinalSuffix("eventStatus_period", eventData, $el, true) + ' ' + zeroPad(eventData["eventStatus_minutes"], 2) + ':' + zeroPad(eventData["eventStatus_seconds"], 2);
				}
        	}
		}
		else if (eventData.eventStatus_eventStatusId == 2 && eventData.eventStatus_isActive == false) {
            time_display = this.t("End Of") + " " + this.formatOrdinalSuffix("eventStatus_period",eventData, $el, true); 			
		}
		else if (eventData.eventStatus_eventStatusId == 1 && isTomorrow(date)) {
            time_display = this.t("Tomorrow"); 			
		}
		else if (eventData.eventStatus_eventStatusId == 1 && isToday(date)) {
            if (isTodaysGameDuringTheDay(date)) {
                time_display = this.t("Today");                
            }
            else {
                time_display = this.t("Tonight");                 
            }			
		}
		else {
			if ( this.lang == 'en' ) {
                time_display = daysShort[this.lang][date.getDay()] + ' ' + monthsShort[this.lang][date.getMonth()] + ' ' + date.getDate(); // + ' ' + date.getFullYear();
			}
			else {
                time_display = daysShort[this.lang][date.getDay()] + ' ' + date.getDate() + ' ' + monthsShort[this.lang][date.getMonth()]; // + ' ' + date.getFullYear();
			}            
		}
                
        if (eventData.eventStatus_eventStatusId < 4) { // if we're not in final....  
            // Fire Event Here to update the time status on a game (for consistency)
            arr_event_data = [{event_id: eventData.eventId, time_display: time_display}];
            $("body").trigger("scoreboard-time-update", arr_event_data);                 		        
        }
        // else if were in a final state, display final word for widgets using it. (Not the scoreboard pills). 
        else if (eventData.eventStatus_eventStatusId >= 4) { 
            var final_text = "";             
            if (eventData.eventStatus_period > 4) { 
                final_text = this.t("F (OT)");
			}
            else {
                final_text = "Final"; // Final is the same word in both languages. 
            }
            arr_event_data = [{event_id: eventData.eventId, time_display: final_text}];
            $("body").trigger("scoreboard-time-update", arr_event_data);                 		                    
        }

        $el.html(time_display);
	}
	
	//Event time formatter
	_FeedParser.prototype.formatEventTime = function(key, eventData, $el) {
		var date = new Date(eventData[key]);
		if ( eventData.eventStatus_eventStatusId == 1 ) {
		  if ( this.lang == 'en' ) {
			$el.html( time12H(date) );
		  }
		  else {
			$el.html( time24H(date) );
		  }
		}
		else
		  $el.html('');
	}
	
	_FeedParser.prototype.formatEventStatus = function(key, eventData, $el) {
		if (eventData.eventStatus_eventStatusId == 1) {
			$el.html('');
		}
		else {
			if ( eventData.eventStatus_eventStatusId == 4 ) { 
				if ( eventData.eventStatus_period > 4 ) { 
	                $el.html(this.t("F (OT)"));
				}
				else {
					this.formatTranslate(key, eventData, $el);
				}
			}
			else {
				this.formatTranslate(key, eventData, $el);
			}
		}
	}

	_FeedParser.prototype.formatEventTypeName = function(key, eventData, $el) {
		this.formatTranslate(key, eventData, $el);
	}

	_FeedParser.prototype.formatEventStatusGameTracker = function(key, eventData, $el) {
		if ( eventData.eventStatus_eventStatusId == 1 ) {
			$el.html('');
		}
		else if ( eventData.eventStatus_eventStatusId == 2 ) {
			$el.html(this.formatOrdinalSuffix("eventStatus_period", eventData, $el, true) + ' &amp; ' + eventData.eventStatus_distance);
		}
		else {
			this.formatTranslate(key, eventData, $el);
		}
	}

	_FeedParser.prototype.formatScore = function(key, eventData, $el) {
		// Output the scores for each team only if the game is underway or final.
		if ( eventData.eventStatus_name == 'Pre-Game' || eventData.eventStatus_name == 'Postponed' ) { 
			$el.html('');
		}
		else {
			$el.html(eventData[key]);
		}
	}

	_FeedParser.prototype.formatOdds = function(key, eventData, $el) {
		// Output the odds for each team only if the game is not underway or final.
		if (eventData[key] != null) {
			if ( eventData.eventStatus_name == 'Pre-Game' || eventData.eventStatus_name == 'Postponed' ) { 
				var value = eventData[key]; 
				if ( key == 'odds_spread' && !isNaN(value) ) {
					value = (value<0?"":"+") + parseFloat(value).toFixed(1);
				}

				if ( key == 'odds_total' && !isNaN(value) ) {
					value = "T:" + value; 
				}

				$el.html(value);
			}
			else {
				$el.html('');
			}
		}
	}

	_FeedParser.prototype.formatVenueName = function( key, eventData, $el ) {
		$el.html(this.t(eventData[key]));
	}

	//Event ordinal suffix formatter
	_FeedParser.prototype.formatOrdinalSuffix = function(key, eventData, $el, returnOnly) {
	  var suffixes = {  "en" : ['th','st','nd','rd'],
						"fr" : ['e','er']           };

	  var val = eventData[key];
	  if (! (val > 0))
		$el.html('');
	  var suffix = suffixes[this.lang][val];
	  if (typeof suffix == 'undefined')
		suffix = suffixes[this.lang][0];

		if ( typeof returnOnly !== 'undefined' ) {
			return val + suffix;
		}

		$el.html(val + suffix);
	}

	_FeedParser.prototype.formatNested = function( key, eventData, $el ) {
		this.parseEvent($el, eventData[key]);
	}
	
	// Nested property data css class formatter
	_FeedParser.prototype.formatNestedPropertyClass = function(key, eventData, $el) {
	  $el.removeClass(); $el.addClass('js-dataformat-'+key+' '+$el.data('baseclass')+eventData[key][$el.data('property')].toLowerCase().replace(" ",""));
	}
	
	// Nested property data formatter
	_FeedParser.prototype.formatNestedProperty = function(key, eventData, $el) {
	  $el.html(eventData[key][$el.data('property')]);
	}

	_FeedParser.prototype.formatTeamLocation = function(key, eventData, $el) {
		this.formatTranslate(key, eventData, $el);
	}

	//Event data Line Scores Headers formatter
	_FeedParser.prototype.formatLineScoresHeaders = function( key, eventData, $el ) {
		var header = '<th></th>';

		for ( var i = 0; i < eventData[key].length || i < 4; i++ ) {
			var str_header = '';
			if ( eventData[key][i] != undefined ) {
				str_header = eventData[key][i]['quarter'];
			}
			else {
				str_header = i + 1;
			}

			header += '<th>' + str_header + '</th>';
		}

		$el.html(header);
	}
	
	//Event data Line Scores formatter
	_FeedParser.prototype.formatLineScores = function(key, eventData, $el) {
	  var team = key.match(/[0-9]/);
	  var lineScores = '<td>'+eventData["team_"+team+"_abbreviation"]+'</td>';
	  for (var i=0;i<eventData[key].length || i<4;i++)
		lineScores+='<td>'+(eventData[key][i]!=undefined?eventData[key][i]['score']:'-')+'</td>';
	  $el.html(lineScores);
	}
	
	//Event data string translator
	_FeedParser.prototype.formatTranslate = function(key, eventData, $el) {
	  $el.html(this.t(eventData[key]));
	}
	
	//Event data css class formatter
	_FeedParser.prototype.formatClass = function(key, eventData, $el) {
		$el.removeClass(); 
		if ( eventData[key] != null ) {
			$el.addClass('js-dataformat-'+key+' '+$el.data('baseclass')+eventData[key].toLowerCase().replace(" ",""));
		}
	}
	
	//Event data formatter toggling class on parent based on boolean attribute
	_FeedParser.prototype.formatToggleParentClass = function(key, eventData, $el) {
	  $el.parent().toggleClass($el.data('toggleclass'), eventData[key] );
	}
	
	//Event data formatter toggling class based on boolean attribute
	_FeedParser.prototype.formatToggleClass = function(key, eventData, $el) {
	  $el.toggleClass($el.data('toggleclass'), eventData[key] );
	}

	//Event data href formatter
	_FeedParser.prototype.formatHref = function(key, eventData, $el) {
	  $el.attr('href',eventData[key]);
	}
	
	//Event data href formatter
	_FeedParser.prototype.formatBackgroundImg = function(key, eventData, $el) {
	  $el.css('background-image','url('+eventData[key][0]+')');
	}
	
	// Tickets button visibility and click handler formatter
	_FeedParser.prototype.formatTicketsButton = function( key, eventData, $el ) {
		$el.unbind('click');

		$el.click(function() {			
			if ( eventData[key] != null ) {
				// Add Google Analytics cross-domain tracking to "Get Tickets" links.
				if ( typeof ga == 'function' ) {
					if ( typeof ga.getAll == 'function' ) {
						var obj_url = new URL(eventData[key]);

						if ( eventData[key].includes('?') ) {
							eventData[key] = obj_url.origin + obj_url.pathname + obj_url.search + '&' + ga.getAll()[0].get('linkerParam') + obj_url.hash;
						}
						else {
							eventData[key] = obj_url.origin + obj_url.pathname + obj_url.search + '?' + ga.getAll()[0].get('linkerParam') + obj_url.hash;
						}
					}
				}

				window.open(eventData[key], '_blank');
			}
			else {
				window.location.href = eventData['gametracker_url'];
			}
		});

		if (eventData['eventStatus_eventStatusId'] != 1) {
			$el.detach();
		}

		// Add Google Analytics event click tracking attributes to the link.
		var obj_date = new Date(eventData['startDate']);
		var str_date = obj_date.getFullYear() + '-' + (obj_date.getMonth() + 1) + '-' + obj_date.getDate();

		$el.attr('data-ga-action', 'Get Tickets');
		$el.attr('data-ga-opt-label', str_date + ' - ' + eventData['team_1_nickname'] + ' vs. ' + eventData['team_2_nickname']);

		jQuery($el).bind("click", analytics_element_tracking_click);
	}
	
	_FeedParser.prototype.formatTeamAbbreviation = function(key, eventData, $el) {
		var str_team_abbreviation = eventData[key];
		str_team_abbreviation = str_team_abbreviation.toLowerCase();
		str_team_abbreviation = this.t(str_team_abbreviation);

		$el.html(str_team_abbreviation);
	}

	_FeedParser.prototype.formatPlayerPosition = function(key, eventData, $el) {
		var str_player_position = eventData[key];
		str_player_position = str_player_position.toLowerCase();
		str_player_position = this.t(str_player_position);

		$el.html(str_player_position);
	}

	_FeedParser.prototype.formatPlayerName = function(key, eventData, $el) {
		var re = /[ .']+/i;
		var str_player_name_as_slug = eventData['firstName'] + '-' + eventData['lastName'];
		str_player_name_as_slug = str_player_name_as_slug.replace(re, '-');

		re = /^a-z0-9-/i;
		str_player_name_as_slug = str_player_name_as_slug.replace(re, '-');

		re = /-{2,}/;
		str_player_name_as_slug = str_player_name_as_slug.replace(re, '-');

		str_player_name_as_slug = str_player_name_as_slug.toLowerCase();

		var str_player_url = '/players/' + str_player_name_as_slug + '/' + eventData['playerId'] + '/';
		var str_player_name = '<a href="' + str_player_url + '">' + eventData['lastName'] + ', ' + eventData['firstName'] + '</a>';

		$el.html(str_player_name);
	}

	//Data attribute formatter
	_FeedParser.prototype.formatDataAttribute = function(key, eventData, $el) {
		var dataAttr = $el.data('attribute');
		if (dataAttr != undefined)
		{
			$el.data(dataAttr,eventData[key]);
			$el.attr('data-'+dataAttr,eventData[key]);
		}
	}
	
	//Return translated string
	_FeedParser.prototype.t = function(s) {
	  var stringsTable = {
		"In-Progress": {"en":"Live", "fr": "En Cours"},
		"Postponed": {"en":"Postponed", "fr":"Reporté"},
		"Tonight": {"en":"Tonight", "fr":"Ce Soir"},
		"Tomorrow": {"en":"Tomorrow", "fr":"Demain"},
        "Today": {"en": "Today", "fr":"Aujourd'hui"}, 
		"F (OT)": {"en":"F (OT)", "fr":"F (P)"},
		"OT": {"en":"OT", "fr":"P"},
		"Forfeit by Away": {"en":"Forfeit"},
		"Forfeit by Home": {"en":"Forfeit"},
		"Forfeit by both teams" : {"en":"Forfeit"}, 
		"bc": { "en": "BC", "fr": "C.-B." }, 
		"ol": { "en": "OL", "fr": "LO" }, 
		"ot": { "en": "OT", "fr": "C" }, 
		"dl": { "en": "DL", "fr": "DL" }, 
		"dt": { "en": "DT", "fr": "DT" }, 
		"de": { "en": "DE", "fr": "AD" }, 
		"rb": { "en": "RB", "fr": "DO" }, 
		"fb": { "en": "FB", "fr": "CA" }, 
		"lb": { "en": "LB", "fr": "SEC" }, 
		"qb": { "en": "QB", "fr": "QA" }, 
		"k": { "en": "K", "fr": "B" }, 
		"p": { "en": "P", "fr": "B" }, 
		"db": { "en": "DB", "fr": "DD" }, 
		"cb": { "en": "CB", "fr": "DC" }, 
		"s": { "en": "S", "fr": "M" }, 
		"wr": { "en": "WR", "fr": "RÉ" }, 	
		"sb": { "en": "SB", "fr": "DI" }, 
		"Montreal": { "en": "Montreal", "fr": "Montréal" }, 
		"BC": { "en": "BC", "fr": "C.-B." }, 
		"End Of": { "en": "End Of", "fr": "Fin Du" }, 		
		"Commonwealth Stadium": { "en": "Commonwealth Stadium", "fr": "The Brick Field au stade du Commonwealth" }, 
		"Tim Hortons Field": { "en": "Tim Hortons Field", "fr": "Terrain Tim Hortons" }, 
		"TD Place Stadium": { "en": "TD Place Stadium", "fr": "Place TD" }, 
		"Percival Molson Memorial Stadium": { "en": "Percival Molson Memorial Stadium", "fr": "Stade Percival-Molson" }, 
		"103rd Grey Cup": { "en": "103rd Grey Cup", "fr": "103e Coupe Grey" }, 
		"104th Grey Cup": { "en": "104th Grey Cup", "fr": "104e Coupe Grey" }, 
		"105th Grey Cup": { "en": "105th Grey Cup", "fr": "105e Coupe Grey" }, 
		"106rd Grey Cup": { "en": "106th Grey Cup", "fr": "106e Coupe Grey" }, 
		"107th Grey Cup": { "en": "107th Grey Cup", "fr": "107e Coupe Grey" }, 
		"108th Grey Cup": { "en": "108th Grey Cup", "fr": "108e Coupe Grey" }, 
		"109th Grey Cup": { "en": "109th Grey Cup", "fr": "109e Coupe Grey" }, 
		"110th Grey Cup": { "en": "110th Grey Cup", "fr": "110e Coupe Grey" }, 
	  };
	  
	  if ( typeof stringsTable[s] == 'object' && typeof stringsTable[s][this.lang] == 'string' ) {
	  	return stringsTable[s][this.lang];
	  }
	  
	  return s;
	}
	
	// Parse event from the feed
	_FeedParser.prototype.parseEvent = function( eventBox, eventData, feedSelector ) {
		var context = this;
		if ( typeof feedSelector == 'undefined' ) {
			feedSelector = '';
		}

		if ( eventData == undefined ) {
			console.log("Empty data structure");

			return;
		}

		$.each( eventData, function(key, value) {
			//console.log('_FeedParser.prototype.parseEvent(): ' + key);
			eventBox.find('.js-'+feedSelector+'data-'+key).html(value);

			eventBox.find('.js-'+feedSelector+'dataformat-'+key).each(function() {
				var functionName = $(this).data('format');

				if (typeof context[functionName] == 'function') {
					context[functionName](key, eventData, $(this));
				}
				else if (typeof context.context[functionName] == 'function') {
					context.context[functionName](key, eventData, $(this));
				}
				else {
					console.log("Data formatter unavailable: " + functionName); 
				}
			});

			eventBox.toggleClass('live', eventData.eventStatus_eventStatusId == 2);
		});
	}
	
	return {
	  create: function(context, lang) {
		  return new _FeedParser(context, lang);
	  }
	};   
})(jQuery);