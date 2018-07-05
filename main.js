var SLIDE_AUTOPLAY_SPEED = 30000;

var slideNum = 1;
var slideMax = 5;
var slideAutoplayTimeout;
var slideAutoplayPaused = false;

// https://stackoverflow.com/a/25371174
function base64Encode(str) {
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var out = "", i = 0, len = str.length, c1, c2, c3;
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += CHARS.charAt(c1 >> 2);
            out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out += CHARS.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += CHARS.charAt(c1 >> 2);
        out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += CHARS.charAt(c3 & 0x3F);
    }
    return out;
}

function slideHideAll(callback) {
	$(".slide").each(function() {
		var $slide = $(this);
	
		$slide.css({
			opacity: 0,
			pointerEvents: "none"
		});
		
		setTimeout(function() {
			$slide.hide();
		}, 300);

		$slide.find('.slideyt').each(function() {
			var $this = $(this);
			var player = $this.data('ytplayer');
			if (typeof player == "undefined") return;
			
			var isLive = $this.data('slideytlive');
			
			if (isLive)	player.stopVideo();
			else player.pauseVideo();
		});
	});

	setTimeout(callback, 300);
}

function slideRefreshIframes() {
	var $slide = $('.slide[data-slidenum=' + slideNum + ']');

	$slide.find('.slideiframe').each(function() {
		var $this = $(this);
		var src = $this.attr('src');
		$this.attr('src', 'about:blank');
		setTimeout(function() {
			$this.attr('src', src);
		}, 1);
	});

}

function slideUpdateYt() {
	var $slide = $('.slide[data-slidenum=' + slideNum + ']');

	$slide.find('.slideyt').each(function() {
		var $this = $(this);
		var player = $this.data('ytplayer');
		if (typeof player == "undefined") return;
		player.playVideo();
	});
}

function slideRefreshCurrentBgs() {
	var $slide = $('.slide[data-slidenum=' + slideNum + ']');

	$slide.find('.slidebg').each(function() {
		var $this = $(this);
		var url = $this.data("slidebg");
		var cors = $this.data("slidecors") == "true";

		if (cors)
			$.ajax({
		         url: "http://cors-anywhere.herokuapp.com/" + url,
		         type: "GET",
		         mimeType: "text/plain; charset=x-user-defined",
		         beforeSend: function(xhr) {
		         	xhr.setRequestHeader(
		         		'Content-Type',
		         		'application/x-www-form-urlencoded'
	         		);
		         },
		         success: function(data) {
		         	$this.css(
		         		"backgroundImage",
		         		'url(data:image/jpeg;base64,' + base64Encode(data) + ')'
		         	);
		         }
			});
		else
        	$this.css(
        		"backgroundImage",
        		'url(' + url + "?t=" + (new Date()).getTime() + ')'
        	);
	});
}

function slideShowCurrent() {
	slideRefreshCurrentBgs();
	slideUpdateYt();
	slideRefreshIframes();

	var $slide = $('.slide[data-slidenum=' + slideNum + ']');
	$slide.css('display', 'flex');

	// timeout used to prevent css transition from being skipped
	setTimeout(function() {
		$slide.css({
			opacity: 1,
			pointerEvents: "all"
		});
	}, 10);
}

function slideNext() {
	slideNum++;
	if (slideNum > slideMax) slideNum = 1;
	slideHideAll(slideShowCurrent);
	slideStartTimeout();
}

function slidePrev() {
	slideNum--;
	if (slideNum < 1) slideNum = slideMax;
	slideHideAll(slideShowCurrent);
	slideStartTimeout();	
}

function slidePause() {
	slideAutoplayPaused = true;

	slideStopTimeout();
	$("#pause").hide();
	$("#play").show();
}

function slidePlay() {
	slideAutoplayPaused = false;
	
	slideStartTimeout();
	$("#pause").show();
	$("#play").hide();		
}

function slideToggle() {
	if (slideAutoplayPaused) slidePlay();
	else slidePause();
}

function slideStopTimeout() {
	clearTimeout(slideAutoplayTimeout);
	slideAutoplayTimeout = undefined;
}

function slideStartTimeout() {
	if (slideAutoplayPaused) return;

	slideStopTimeout();

	slideAutoplayTimeout = setTimeout(
		slideNext, SLIDE_AUTOPLAY_SPEED
	);
}



function onYouTubeIframeAPIReady() {
	$('.slideyt').each(function() {
		var $this = $(this);
		$this.data('ytplayer', new YT.Player($this[0]));
	})
}

function initIdle() {
	$(document).idle({
		onIdle: function () {
			$('body').css('cursor', 'none');
			$('#controls').css('opacity', 0);
		},
		onActive: function () {
			$('body').css('cursor', '');
			$('#controls').css('opacity', '');
		},
		idle: 5000
	});
}

function initKeys() {
	$(document).keypress(function(e) {
		try {
			({
				37: slidePrev, // left
				32: slideToggle, // space
				13: slideToggle, // enter
				39: slideNext, // right
			})[e.which]();
		} catch(e) { }
	});
}

$(document).ready(function() {
	slideHideAll(slideShowCurrent);
	slidePlay();
	initIdle();
	initKeys();
});