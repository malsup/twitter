/*!
 * jQuery Twitter Search Plugin
 * Examples and documentation at: http://jquery.malsup.com/twitter/
 * Copyright (c) 2010 M. Alsup
 * Version: 1.00 (04-APR-2010)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.3.2 or later
 */
;(function($) {
	$.fn.twitterSearch = function(options) {
		if (typeof options == 'string')
			options = { term: options };
		return this.each(function() {
			var cont = this, $this = $(this);
			$this.css({ overflow: 'hidden' });
			var opts = $.extend(true, {}, $.fn.twitterSearch.defaults, options || {}, $.metadata ? $this.metadata() : {});
			opts.formatter = opts.formatter || $.fn.twitterSearch.formatter; 
			var url = opts.url + opts.term;
			var err = false;
			
			if (opts.pause)
				$this.hover(function(){this.twitterSearchPause = true;},function(){this.twitterSearchPause = false;});
			
			// grab twitter stream
			$.getJSON(url, function(json) {
				if (json.error) {
					err = true;
					$this.text(json.error);
					return;
				}
				// iterate twitter results 
				$.each(json.results, function(i) {
					var tweet = opts.formatter(this, opts), $tweet = $(tweet);
					$tweet.css(opts.css['tweet']);
					var $img = $tweet.find('.twitterSearchProfileImg').css(opts.css['img']);
					$tweet.find('.twitterSearchUser').css(opts.css['user']);
					$tweet.find('.twitterSearchTime').css(opts.css['time']);
					$tweet.find('a').css(opts.css['a']);
					$tweet.appendTo($this);
					var $text = $tweet.find('.twitterSearchText').css(opts.css['text']);
					if (opts.avatar) {
						var w = $img.outerWidth() + parseInt($tweet.css('paddingLeft'));
						$text.css('paddingLeft', w);
					}
				});
			});
			
			if (err)
				return;

			// start the animation
			setTimeout(go, opts.timeout);

			function go() {
				if (cont.twitterSearchPause) {
					setTimeout(go, 500);
					return;
				}
				var $el = $this.children(':first');
				$el.animate(opts.animOut, opts.animOutSpeed, function() {
					var h = $el.outerHeight();
					$el.animate({ marginTop: -h }, opts.animInSpeed, function() {
						$el.css({
							marginTop: 0,
							opacity: 1
						}).css(opts.css['tweet']).show().appendTo($this);
					});
					// stage next animation
					setTimeout(go, opts.timeout);					
				});
			}
		});
	};

	$.fn.twitterSearch.formatter = function(json, opts) {
		var t = json.text;
		if (opts.anchors) {
			t = json.text.replace(/(http:\/\/\S+)/g, '<a href="$1">$1</a>');
			t = t.replace(/\@(\w+)/g, '<a href="http://twitter.com/$1">@$1</a>');
		}
		var s = '<div class="'+opts.tweetClass+'">';
		if (opts.avatar)
			s += '<img class="twitterSearchProfileImg" src="' + json.profile_image_url + '" />';
		s += '<div><span class="twitterSearchUser"><a href="http://www.twitter.com/'+ json.from_user+'/status/'+ json.id +'">' 
		  + json.from_user + '</a></span>';
		if (opts.time)
			s += ' <span class="twitterSearchTime">('+ prettyDate(json.created_at) +')</span>'
		 s += '<div class="twitterSearchText">' + t + '</div></div></div>';
		 return s;
	};
	
	$.fn.twitterSearch.defaults = {
		url: 'http://search.twitter.com/search.json?callback=?&q=',
		term: '',
		tweetClass: 'tweet',
		avatar: true,
		anchors: true,
		animOutSpeed: 300,
		animInSpeed: 300,
		animOut: { opacity: 0 },
		formatter: null,
		pause: false,
		time: true,
		timeout: 4000,
		css: {
			tweet: { padding: '5px 10px', clear: 'left' },
			img:   { float: 'left', margin: '5px', width: '48px', height: '48px' },
			user:  { fontWeight: 'bold' },
			time:  { fontSize: 'smaller' },
			text:  {},
			a:     { textDecoration: 'none' }
		}
	};
	
	/*
	 * JavaScript Pretty Date
	 * Copyright (c) 2008 John Resig (jquery.com)
	 * Licensed under the MIT license.
	 */
	// converts ISO time to casual time
	function prettyDate(time){
		var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);
				
		if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
			return;
		return day_diff == 0 && (
				diff < 60 && "just now" ||
				diff < 120 && "1 minute ago" ||
				diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
				diff < 7200 && "1 hour ago" ||
				diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
			day_diff == 1 && "Yesterday" ||
			day_diff < 7 && day_diff + " days ago" ||
			day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
	}

})(jQuery);
