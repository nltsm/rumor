app.addModule('audio-player', function () {
	this.mainPlayer = {
		$block: $('.audio-player'),
		$audioPlayer: $('.audio-player .audioplayer'),
		$image: $('.audio-player_image'),
		$text: $('.audio-player_text'),
		duration: $('.audioplayer-time-duration'),
		progressBarPlayed: $('.audioplayer-bar-played')
	};
	
	this.init = function () {
		
	};
});
app.addModule('audio', function () {
	var currentAudio;
	var $header;
	var mainPlayer;
	
	var dataContainer = {
		$block: $('.thread, .post'),
		$image: $('.thread_image, .post_image'),
		$text: $('.thread_title, .post_text')
	};
	
	this.init = function () {
		$header = app.getModule('header').$header;
		mainPlayer = app.getModule('audio-player').mainPlayer;
		
		this.initAudio();
		
		click('.audio-player .audioplayer-playpause', function () {
			$(currentAudio).closest('.audioplayer').find('.audioplayer-playpause')[0].click();
		});
		
		click('.audio-player_back', function () {
			var playPause = $(currentAudio).closest('.threads_item').prev().find('.audioplayer-playpause');
			
			if (playPause.length) {
				playPause[0].click();
			}
		});
		click('.audio-player_next', function () {
			var playPause = $(currentAudio).closest('.threads_item').next().find('.audioplayer-playpause');
			
			if (playPause.length) {
				playPause[0].click();
			}
		});
		$(document).on('scroll', function () {
			if ($(document).scrollTop() > $header.innerHeight()) {
				mainPlayer.$block.addClass('__scroll');
			} else {
				mainPlayer.$block.removeClass('__scroll');
			}
		});
	};
	
	this.onPlaying = function () {
		if ($(currentAudio).closest('[data-player]').length) {
			mainPlayer.$block.addClass('active');
		} else {
			mainPlayer.$block.removeClass('active');
		}
		
		var player = $(currentAudio).closest('.audioplayer');
		
		var className = player.attr('class');
		var duration = player.find('.audioplayer-time-duration').text();
		var playedBar = player.find('.audioplayer-bar-played').attr('style');
		
		changeAudioAttributesInMainPlayer({
			className: className,
			duration: duration,
			playedBar: playedBar
		})
	};
	
	this.onStart = function (player) {
		currentAudio = player.find('audio').get(0);
		
		stopAudiosExceptCurrent(player);
		
		if (hasDataToBeInMainPlayer(player)) {			
			var container = $(player).closest(dataContainer.$block);
			var imageStyle = container.find(dataContainer.$image).attr('style');
			var text = container.find(dataContainer.$text).html();
			
			changeDataInMainPlayer({
				imageStyle: imageStyle,
				text: text
			});
		}
	};
	
	this.initAudio = function () {
		var _this = this;
		$('audio').each(function () {
			if (!$(this).closest('.audioplayer').length) {
				$(this).audioPlayer({
					onPlaying: _this.onPlaying,
					onStart: _this.onStart
				});
			}
		});
	};
	
	this.playAudio = function (audio) {
		$(audio).closest('.audioplayer').find('.audioplayer-playpause').click();
	};
	
	function stopAudiosExceptCurrent(audioPlayer) {
		$('.audioplayer-playing .audioplayer-playpause')
			.not($(audioPlayer).find('.audioplayer-playpause'))
			.not('.audio-player .audioplayer-playpause')
			.each(function () {
				this.click();
			});

		$('audio').not(currentAudio).each(function () {
			this.currentTime = 0;
		});
	}
	function hasDataToBeInMainPlayer(audioPlayer) {
		return $(audioPlayer).closest(dataContainer.$block).length;
	}
	function changeDataInMainPlayer(data) {
		mainPlayer.$image.attr('style', data.imageStyle);
		mainPlayer.$text.html(data.text);
	}
	function changeAudioAttributesInMainPlayer(attributes) {
		mainPlayer.$audioPlayer.attr('class', attributes.className);
		mainPlayer.duration.html(attributes.duration);
		mainPlayer.progressBarPlayed.attr('style', attributes.playedBar);
	}
});
app.addModule('filestyle', function () {
	this.init = function () {
		$("input[type=file]:not(.__no-style)").each(function () {
			$(this).addClass('jfilestyle');
			
			$(this).jfilestyle({
				input: false,
				text: $(this).attr('data-text')
			});
		});
	};
});
app.addModule('flash-massage', function () {
	var self = this;
	
	this.init = function () {
		$('.flash-massage_close').click(function () {
			self.close();
		})
	};
	this.close = function () {
		$('.flash-massage').removeClass('__visible');
	};
});
app.addModule('header', function () {
	this.$header = $('.header');
	
	this.init = function () {
		click('.header_search-ico', function () {
			$('.header_search-ico').addClass('hidden');
			$('.header_search-form').addClass('visible').find('input')[0].focus();
		});
		
		click(function () {
			if (! isClickedClosest('.header_search')) {
				$('.header_search-ico').removeClass('hidden');
				$('.header_search-form').removeClass('visible');
			}
		});
		
		click('.header_themes-button', function () {
			$(this).closest('.header_themes').toggleClass('active');
		});
		
		click(function () {
			if (! isClickedClosest('.header_themes')) {
				$('.header_themes').removeClass('active');
			}
		});
	};
});
app.addModule('leave-comment', function () {
	this.init = function () {
		$('.leave-comment_audio-added a').click(function (e) {
			e.preventDefault();
			
			$('#record-added').removeClass('__visible');
			
			window.getRecordAudio = function () {
				return false;
			};
		});
	};
});
var geocoder;
var infowindow;

function initMap() {
	var $map = $('[data-map]');

	if (!$map.length) {
		return false;
	}
	
	geocoder = new google.maps.Geocoder;

	$map.each(function () {
		var mapDiv = $(this);
		var map;

		var lat = Number(mapDiv.attr('data-lat'));
		var lng = Number(mapDiv.attr('data-lng'));
		var zoom = Number(mapDiv.attr('data-zoom'));
		var content = mapDiv.attr('data-content');

		map = new google.maps.Map(mapDiv[0], {
			center: {lat: lat, lng: lng},
			zoom: zoom,
			disableDefaultUI: true
		});

		var marker = new google.maps.Marker({
			position: {lat: lat, lng: lng},
			map: map
		});

		if (content) {
			var contentString = '<div class="map-content">' + content + '</div>';

			infowindow = new google.maps.InfoWindow({
				content: contentString
			});

			marker.addListener('click', function () {
				infowindow.open(map, marker);
			});
		}

		if (mapDiv.attr('data-input')) {
			var input = document.getElementById(mapDiv.attr('data-input'));
			
			var autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});
			
			setTimeout(function () {
				$('.form-map_search').append($('.pac-container'));
			}, 1000);

			autocomplete.addListener('place_changed', function () {
				var place = autocomplete.getPlace();
				
				var position = {
					lat: place.geometry.location.lat(),
					lng: place.geometry.location.lng()
				};
				
				marker.setPosition(position);
				map.panTo(position);
			});

			google.maps.event.addListener(map, "click", function (event) {
				var lat = event.latLng.lat();
				var lng = event.latLng.lng();
				
				var position = {lat: lat, lng: lng};
				
				changeMapOnClick(map, marker, input, position);
			});
		}
	});
}

function changeMapOnClick(map, marker, input, position) {
	geocoder.geocode({'location': position}, function (results, status) {
		if (status === 'OK') {
			if (results[0]) {
				var address = results[0].formatted_address;
				
				marker.setPosition(position);
				map.panTo(position);
				
				$(input).val(address);
			} else {
				window.alert('No results found');
			}
		} else {
			window.alert('Geocoder failed due to: ' + status);
		}
	});
}
app.addModule('mobile-load', function () {
	this.init = function () {
		$('[data-clone-id]').each(function () {
			var element = $('#' + $(this).attr('data-clone-id'));
			
			if (element.length) {
				$(this).append(
					element.clone(true, true).removeAttr('id').addClass('__cloned')
				);
			}
			
			$(this).removeAttr('data-clone-id');
		});
	};
});
app.addModule('popup', function () {
	this.init = function () {
		$('.popup').magnificPopup({
			preloader: false,
			showCloseBtn: false,
			removalDelay: 300,
			mainClass: 'mfp-fade'
		});
		
		$('.popup-image').magnificPopup({
			preloader: false,
			showCloseBtn: false,
			removalDelay: 300,
			mainClass: 'mfp-fade',
			type: 'image'
		});
		
		$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,

			fixedContentPos: false
		});
		
		$('.popup-close').click(function (e) {
			e.preventDefault();
			$.magnificPopup.close();
		});
	};
});
app.addModule('record', function () {
	this.init = function () {
		URL = window.URL || window.webkitURL;

		var gumStream;
		var rec;
		var input;
		
		
		var AudioContext = window.AudioContext || window.webkitAudioContext;
		var audioContext;

		var recordButton = document.getElementById("recordButton");
		var stopButton = document.getElementById("stopButton");
		
		if (!recordButton) {
			return;
		}
		
		recordButton.addEventListener("click", startRecording);
		stopButton.addEventListener("click", stopRecording);

		/**
		 * Начало записи
		 */
		function startRecording() {
			var constraints = {audio: true, video: false};
			
			navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
				audioContext = new AudioContext();

				gumStream = stream;

				input = audioContext.createMediaStreamSource(stream);

				rec = new Recorder(input, {numChannels: 1});

				rec.record();
				
				$(recordButton).addClass('__hidden');
				$(stopButton).addClass('__visible');

			}).catch(function (err) {
				
			});
		}

		function stopRecording(e) {
			e.preventDefault();
			
			$(recordButton).removeClass('__hidden');
			$(stopButton).removeClass('__visible');
			
			if (!rec) {
				return;
			}
			
			rec.stop();
			
			gumStream.getAudioTracks()[0].stop();
			
			rec.exportWAV(finishRecording);
			
			$('#record-added').addClass('__visible')
		}

		function finishRecording(blob) {			
			var url = URL.createObjectURL(blob);
			
			var audio = $('#recordAudio');
			
			audio.attr('src', url);
			$('.profile-edit_play').addClass('active');
			
			window.getRecordAudio = function () {
				return blob ? blob : false;
			};
		}
	};
});
app.addModule('scrollbar', function () {
	this.init = function () {
		try {
			var scrollBar = $('[data-scrollbar]');
		
			scrollBar.scrollbar({}).parent().addClass('scrollbar-inner');
			
			var div = $('<div />').css('height', '50px');
			
			scrollBar.append(div);
			
			setTimeout(function () {
				div.remove();
			}, 1000);
		} catch(e) {}
	}
});
app.addModule('select', function () {
	this.init = function () {
		$('select').on('select2:open', function (e) {
			$('.select2-results__options').scrollbar().parent().addClass('scrollbar-inner');
		});
		
		$('.select').select2({
			minimumResultsForSearch: -1,
			width: '100%'
		});
	}
});
app.addModule('thread', function () {
	this.init = function () {
		
	};
});
jQuery(function () {
	app.callModules();
});