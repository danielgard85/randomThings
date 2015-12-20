var configurationPrinter = {
	// time intervals in seconds
	timeIntervalFrom : 5,
	timeIntervalTo   : 10
};

(function ($, cf) {

	function clickElement (domElem) {
		var evt = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			view: window,
		});

		domElem.dispatchEvent(evt);
	}

	var	fragment = $('<div class="annotator-wrapper"></div>'),
	clicker = {
		prev: function () {

			var anchors = $('.sbo-nav-top a.prev.nav-link');

			if(anchors.length)
			clickElement(anchors[0]);
		},
		next: function () {
			var anchors = $('.sbo-nav-top a.next.nav-link');
			if(anchors.length){
				clickElement(anchors[0]);
			}
			else{
				scheduler.stop();
				cloner.append();
				console.log('Nothing left to add');
			}
		}
	},
	cloner = {
		append : function Clone() {
			Clone.previous = Clone.previous || '';
			var content = $('div.annotator-wrapper').html();
			if(Clone.previous !== content){
				fragment.append(content);
			}
		}
	},
	printer = {
		toConsole: function () {
			console.log(fragment);
		},
		toWindow: function () {
			var theBook = window.open('','Print');
			var bookDocument = theBook.document,
				styles1 = $('link').filter('[rel="stylesheet"]').clone(),
				styles2 = $('style').clone();

			bookDocument.write(
				[
				'<!DOCTYPE HTML>',
				'<html>',
					'<head>',
					'</head>',
					'<body class="tutorials-feature js-show-related scalefonts library nav-collapsed">',
						'<div id="container">',
							'<div id="sbo-rt-content">',
								'<div class="annotator-wrapper">',
									fragment.html(),
								'</div>',
							'</div>',
						'</div>',
						'<script>',
							'var jq = document.createElement("script");',
							'jq.src = "//code.jquery.com/jquery-1.11.1.min.js";',
							'document.getElementsByTagName("head")[0].appendChild(jq);',
						'</script>',
						'<script>var $; setTimeout(function(){ $("a").removeAttr("href"); },100);</script>',
					'</body>',
				'</html>'
				].join('\n'));
			
			$(bookDocument)
			.find('head')
			.append(styles1)
			.append(styles2)
			.append('<style>img{display:block;}@media print{ @page{margin: 0.25in 0.25in 0.25in 0.25in } img{max-height:2.5in;width:auto;} body div *{line-height:normal!important;background-color:#fff!important;}}</style>');
		}
	},
	scheduler = (function () {
		var currentTimer = false,
			isActive = false;

		function getRandomTimer () {
			var from = configurationPrinter.timeIntervalFrom,
				to   = configurationPrinter.timeIntervalTo;

			return Math.round(((Math.random()*(to - from))+from)*1000);
		}

		function iterativeAction( ) {
			cloner.append();
			clicker.next();
		}

		function playPauseAction ( ) {
				if(isActive){
					var waitingTime = getRandomTimer();
					iterativeAction();
					currentTimer = setTimeout(playPauseAction,waitingTime);
					console.log('waiting :',waitingTime);
				}
				else{
					if(!currentTimer){
						clearTimeout(currentTimer);
						currentTimer = false;
					}
				}
		}

		return {
			play:function ( ) {
				if(currentTimer){
					clearTimeout(currentTimer);
					isActive = false;
					currentTimer = false;
					console.log('Paused');
				}
				else{
					isActive = true;
					console.log('Running');
					playPauseAction();
				}
			},
			stop:function ( ) {
				clearTimeout(currentTimer);
				currentTimer = false;
				isActive = false;
			}
		};
	}());

function handler (key) {
	switch(key){
		// 'a' : prev
		case 65: 
			clicker.prev();
			break;
		// 'd' : next
		case 68:
			clicker.next();
			break;
		// 'p' : Play/Pause
		case 80:
			scheduler.play();
			break;
		// 's' : 
		case 83:
			cloner.append();
			break;
		// 'v' : View Content
		case 86:
			printer.toConsole();
			break;
		// 'x' : Open Document
		case 88: 
			printer.toWindow();
			break;
	}
}


$(document).on('keydown',function (ev) {
	handler(ev.keyCode);
});

console.clear();
setTimeout(function () {
	console.log('Press "p" to start/pause\nPress "x" to see final result');	
},100);

}(jQuery,configurationPrinter))
