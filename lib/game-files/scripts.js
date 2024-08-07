var icons = [
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

var players = {
	red: 'x',
	blue: 'o',
	x: 'red',
	o: 'blue'
};

window.addEventListener('load', function(){

	$("[data-bs-toggle='fade']").on('click', function(){
		let id = $(this).attr('data-bs-target');
		if ( !id ) {
			id = $(this).attr('href');
		}
		if ( $(id).hasClass('show') ) {
			$(id).fadeOut('linear', function(){
				$(id).removeClass('show')
			});
		} else {
			$(id).fadeIn('linear', function(){
				$(id).addClass('show')
			});
		}
	});

	$('[name="grid-size-btns"]').on('click', function(){
		$('#change-layer').html($(this).html()[0] + ' layers');
	});

	$('#game-start').on('click', function(){
		$('#options').fadeOut('linear', function(){
			$('#options').removeClass('show');

			$('#summ span:nth-child(2)').html('<i class="bi bi-robot"></i>');
			//$('#summ span:nth-child(1)').append('<i class="bi bi-robot"></i>');
			//$('#summ span:nth-child(2)').append('<i class="bi bi-robot"></i>');

			$('#summ span:nth-child(3)').html($('[name="grid-size-btns"].active').html() + ' x ' + $('[name="layer-size-btns"].active').html()[0]);

			$('#game').fadeIn('linear', function(){
				$('#game').addClass('show');
			});
		});
	});

	$('#settings-start').on('click', function(){
		$('#settings-end').children('.change').toggleClass('bi-chevron-right');
		$('#settings-end').children('.change').toggleClass('bi-x-lg');
	});

	$('#settings-end').on('click', function(){
		$('#settings-start').trigger('click');
	});

	$('#summ').on('click', function(){
		$('#settings-start').trigger('click');
	});

	$('#settings-end').on( "mouseenter", function(){
		$('#settings-start').addClass('hover');
	} ).on( "mouseleave", function(){
		$('#settings-start').removeClass('hover');
	} );


	// cookies
	//Cookies.set('test', 'test23', {path: '/', samesite: 'Lax', secure: true})
	//Cookies.remove('test', {path: '/', samesite: 'Lax', secure: true});

	var ready = [false, false];
	// RED-X, BLUE-O

	init();

	$('#red .icons i').on('click', function(){
		if ( !ready[0] ) {
			$('#red .icons .selected').removeClass('selected');
			$(this).addClass('selected');
			$('#red button').removeAttr('disabled');
			$('#red button').removeClass('opacity-25');
		}
	});

	$('#blue .icons i').on('click', function(){
		if ( !ready[1] ) {
			$('#blue .icons .selected').removeClass('selected');
			$(this).addClass('selected');
			$('#blue button').removeAttr('disabled');
			$('#blue button').removeClass('opacity-25');
		}
	});

	$('#red button').on('click', function(){
		ready[0] = true;
		$('#red .icons i:not(.selected)').detach()
		$('#red .icons i.selected').removeClass('selected');
		$('#summ span:nth-child(1)').append(`<i class="bi ${$('#red .icons i').attr('class')}"></i>`);
		$('#red > p:first-child').addClass('hide');
		if ( ready[1] ) {
			gameStart();
		}
		$(this).detach();
	});

	$('#blue button').on('click', function(){
		ready[1] = true;
		$('#blue .icons i:not(.selected)').detach()
		$('#blue .icons i.selected').removeClass('selected');
		$('#summ span:nth-child(2)').append(`<i class="bi ${$('#blue .icons i').attr('class')}"></i>`);
		$('#blue > p:first-child').addClass('hide');
		if ( ready[0] ) {
			gameStart();
		}
		$(this).detach();
	});
	
	$('.l-cell').on('click', function(){
		if ( ready[0] && ready[1] && !$('#grid-wrapper').hasClass('its-over') ) {
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

});

function gameWin(cp) {
	$(`#${players[cp]} .display-6`).html(`You won!`);
	let rwon = parseInt($(`#${players[cp]} .won span`).html());
	let blost = parseInt($(`#${players[other(cp)]} .lost span`).html());
	$(`#${players[cp]} .won span`).html(rwon + 1);
	$(`#${players[other(cp)]} .lost span`).html(blost + 1);
	$('.stats').addClass('show');
	//$('#again').addClass('show');
	$('#grid-wrapper').addClass('its-over');
	$('#grid-wrapper').removeClass(`turn-${cp}`);
}

function init(){
	while ( icons.length > 12 ) {
		let ind = Math.floor(Math.random() * icons.length);
		$('#red .icons').append(`<i class="bi-${icons[ind]}"></i>`);
		icons.splice(ind, 1)
	}

	while ( icons.length > 0 ) {
		let ind = Math.floor(Math.random() * icons.length);
		$('#blue .icons').append(`<i class="bi-${icons[ind]}"></i>`);
		icons.splice(ind, 1)
	}

	$('.icons').each(function(){
		$(this).css('min-height', $(this)[0].clientHeight + 'px');
	});
	$('.btn-wrap').each(function(){
		$(this).css('margin-top', `-${$(this).prev()[0].clientHeight}px`);
		$(this).css('min-height', $(this)[0].clientHeight + 'px');
	});
}

function gameStart() {
	// RED-X goes first
	$('#grid').addClass('show');
	updatePlayer('red', 'blue');
	$(`#red .display-6`).removeClass('hide');
}

function updatePlayer(cp, np) {
	// red and blue
	$(`#${cp} .display-6`).removeClass('hide');
	$(`#${np} .display-6`).addClass('hide');
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
}

function cap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}