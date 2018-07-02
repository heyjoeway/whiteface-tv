var SLIDE_AUTOPLAY_SPEED = 30000;

var slideNum = 1;
var slideMax = 4;
var slideAutoplayInterval;

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
	});

	setTimeout(callback, 300);
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

	var $slide = $('.slide[data-slidenum=' + slideNum + ']');
	$slide.show();

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
}

function slidePrev() {
	slideNum--;
	if (slideNum < 1) slideNum = slideMax;
	slideHideAll(slideShowCurrent);
}

function slidePause() {
	clearInterval(slideAutoplayInterval);
	slideAutoplayInterval = undefined;
	$("#pause").hide();
	$("#play").show();
}

function slidePlay() {
	slideAutoplayInterval = setInterval(
		slideNext, SLIDE_AUTOPLAY_SPEED
	);
	$("#pause").show();
	$("#play").hide();		
}

function slideToggle() {
	if (slideAutoplayInterval) slidePause();
	else slidePlay();
}

$(document).ready(function() {
	slideNum--;
	slideNext();
	slidePlay();

	$(document).keypress(function(e) {
		try {
			({
				49: slidePrev,
				50: slideToggle,
				51: slideNext,
				402: slideNext,
				403: slidePrev,
				13: slideToggle
			})[e.which]();
		} catch(e) { }
	});
});