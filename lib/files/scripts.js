const iconsOriginal = [
	'car-front-fill',
	'cone-striped',
	'stoplights',
	'signpost-fill',
	'cake2-fill',
	'balloon-fill',
	'gift-fill',
	'music-note-beamed',
	'camera-fill',
	'image',
	'sun-fill',
	'tree-fill',
	'moon-fill',
	'binoculars-fill',
	'rocket-takeoff-fill',
	'stars',
	'emoji-angry-fill',
	'emoji-frown-fill',
	'emoji-smile-fill',
	'emoji-wink-fill',
	'suit-heart-fill',
	'triangle-fill',
	'square-fill',
	'circle-fill'
];

const breakpoints = [ 0, 576, 768, 992, 1200, 1400 ];

var players = {
	red: 'x',
	blue: 'o',
	x: 'red',
	o: 'blue'
};

var ready;

window.addEventListener('load', function(){
	// RED-X, BLUE-O

	init();
	$(window).on('resize', function(){
		waitForFinalEvent(function(){
      resized();
    }, 500, `${$(window).width()}`);
	});
	
	$('.l-cell').on('click', function(){
		if ( !$('#grid-wrapper').hasClass('its-over') ) {
			let current = $('#grid-wrapper').attr('class')[5];
			// check square, make move
			if ( $(this).children('span').hasClass('x') || $(this).children('span').hasClass('o') ) {
				// this space isn't empty
			} else {
				$(this).children('span').removeClass('bg-gradient');
				$(this).children('span').addClass(current);
				$(this).children('span').html(current);
				
				let three = checkWin();
				if ( three ) {
					for ( let ind of three ) {
						$('.l-cell span')[ind].classList.add('win');
					}
					gameWin(current);
				} else {
					// switch player
					switchPlayer(current, other(current));
				}
			}
		}
	});

	$('.btn-group button').on('click', function(){
		$(this).addClass('active');
		$(this).siblings('button.active').each(function(){
			$(this).removeClass('active');
		});
	});

	$('#new-game').on('click', resetGame);
	$('#icons-change').on('click', selectIcons);

});

function returnUniqueString() {
	return `${Math.floor(Math.random() * 26)}${Date.now()}`;
}

var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

function gameWin(cp) {
	$(`#${players[cp]} .turn-ind`).html(`You won!`);
	$('#again1').trigger('click');
	$('#again2 #text').html(players[cp] + " won!");
	$('#grid-wrapper').addClass('its-over');
	$('#grid-wrapper').removeClass(`turn-${cp}`);
}

function init(){
	resized();
	selectIcons();
	gameStart();
}

function resized() {
	let ww = $(window).width();
	if ( ww <= 991 ) {
		$('#if-narrow').append($('#red'));
		$('#if-narrow').append($('#blue'));

		if ( ww <= 576 ) {
			$('.turn-ind').addClass('fs-4');
			$('.turn-ind').removeClass('fs-1');
			$('.turn-ind').removeClass('fs-2');
			$('.turn-ind').removeClass('fs-3');

			$('#grid').css('min-width', '100%');
			$('#grid').css('max-width', '100%');
		} else if ( ww <= 768 ) {

			if ( ww <= 609 ) {
				$('#if-narrow').removeClass('flex-sm-column');
				$('#if-narrow').addClass('flex-sm-row');
			} else {
				$('#if-narrow').removeClass('flex-sm-row');
				$('#if-narrow').addClass('flex-sm-column');
			}

			$('.turn-ind').addClass('fs-3');
			$('.turn-ind').removeClass('fs-1');
			$('.turn-ind').removeClass('fs-2');
			$('.turn-ind').removeClass('fs-4');

			$('#grid').css('min-width', (size * 51 * 2.5) + 'px');
			$('#grid').css('max-width', 'unset');
		} else {
			$('.turn-ind').addClass('fs-2');
			$('.turn-ind').removeClass('fs-1');
			$('.turn-ind').removeClass('fs-3');
			$('.turn-ind').removeClass('fs-4');

			$('#grid').css('min-width', (size * 51 * 2.5) + 'px');
			$('#grid').css('max-width', 'unset');
		}
	} else {
		if ($('#if-narrow').children().length > 0) {
			$('#red').insertBefore($('#red-placeholder'));
			$('#blue').insertBefore($('#blue-placeholder'));
		}

		$('#grid').css('min-width', (size * 51 * 2.5) + 'px');
			$('#grid').css('max-width', 'unset');
	}
}

function selectIcons() {

	let icons = iconsOriginal.slice();

	let ind = Math.floor(Math.random() * icons.length);
	$('#red .icons').append(`<i class="bi-${icons[ind]}"></i>`);
	icons.splice(ind, 1);

	ind = Math.floor(Math.random() * icons.length);
	$('#blue .icons').append(`<i class="bi-${icons[ind]}"></i>`);

	$('.icons').each(function(){
		$(this).css('min-height', $(this)[0].clientHeight + 'px');
	});
}

function resetGame() {
	$('.l-cell span.x').removeClass('x');
	$('.l-cell span.o').removeClass('o');
	$('.l-cell span.win').removeClass('win');
	$('.l-cell span').each(function(){
		$(this).html($(this).attr('count'));
	});
	gameStart();
}

function gameStart() {
	// RED-X goes first
	$('#grid').addClass('show');
	$('#grid-wrapper').removeClass('its-over');
	$('#grid-wrapper').addClass('turn-x');
	updatePlayer('red', 'blue');
	$(`#red .turn-ind`).html("It's your turn.");
	$(`#blue .turn-ind`).html("It's your turn.");
	$(`#red .turn-ind`).removeClass('hide');
}

function updatePlayer(cp, np) {
	// red and blue
	$(`#${cp} .turn-ind`).removeClass('hide');
	$(`#${np} .turn-ind`).addClass('hide');
}

function switchPlayer(cp, np) {
	// x and o
	updatePlayer(players[np], players[cp]);
	$('#grid-wrapper').addClass(`turn-${np}`);
	$('#grid-wrapper').removeClass(`turn-${cp}`);
}

function other(cp) {
	let players = ['x', 'o'];
	let np = players[0];
	if ( cp == players[0] ) {
		np = players[1];
	}
	return np;
}

function checkWin() {
	for ( let poss of wins ) {
		if ( $('.l-cell span')[poss[0]].outerText == $('.l-cell span')[poss[1]].outerText && $('.l-cell span')[poss[0]].outerText == $('.l-cell span')[poss[2]].outerText ) {
			return poss;
		}
	}
	return false;
}

function cap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
