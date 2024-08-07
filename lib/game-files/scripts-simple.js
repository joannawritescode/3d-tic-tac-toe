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

var players = {
	red: 'x',
	blue: 'o',
	x: 'red',
	o: 'blue'
};

var ready;

window.addEventListener('load', function(){

	Cookies.remove('T3-red', {path: '/', samesite: 'Lax', secure: true});
	Cookies.remove('T3-blue', {path: '/', samesite: 'Lax', secure: true});
	Cookies.remove('T3-red-score', {path: '/', samesite: 'Lax', secure: true});
	Cookies.remove('T3-blue-score', {path: '/', samesite: 'Lax', secure: true});

	ready = [false, false];
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

	$('#new-game').on('click', resetGame);
	$('#icons-change').on('click', selectIcons);

});

function gameWin(cp) {
	$(`#${players[cp]} .display-6`).html(`You won!`);
	let rwon = parseInt($(`#${players[cp]}-score .won span`).html());
	let blost = parseInt($(`#${players[other(cp)]}-score .lost span`).html());
	$(`#${players[cp]}-score .won span`).html(rwon + 1);
	$(`#${players[other(cp)]}-score .lost span`).html(blost + 1);
	$('.stats').addClass('show');
	$('#again2').addClass('show');
	$('#grid-wrapper').addClass('its-over');
	$('#grid-wrapper').removeClass(`turn-${cp}`);

	Cookies.set('T3-red-score', `${$('#red-score.stats .won span').html()},${$('#red-score.stats .lost span').html()},${$('#red-score.stats .tied span').html()}`, {expires: 0.001388888889, path: '/', samesite: 'Lax', secure: true});
	Cookies.set('T3-blue-score', `${$('#blue-score.stats .won span').html()},${$('#blue-score.stats .lost span').html()},${$('#blue-score.stats .tied span').html()}`, {expires: 0.001388888889, path: '/', samesite: 'Lax', secure: true});
}

function init(){

	let cRed = Cookies.get();
	if ( ! cRed['T3-red'] || ! cRed['T3-blue'] || cRed['T3-red'][0] == '[' || cRed['T3-blue'][0] == '[' ) {
		Cookies.remove('T3-red', {path: '/', samesite: 'Lax', secure: true});
		Cookies.remove('T3-blue', {path: '/', samesite: 'Lax', secure: true});
		Cookies.remove('T3-red-score', {path: '/', samesite: 'Lax', secure: true});
		Cookies.remove('T3-blue-score', {path: '/', samesite: 'Lax', secure: true});
		selectIcons()
	} else {
		$('#red .icons').append(`<i class="${cRed['T3-red']}"></i>`);
		$('#blue .icons').append(`<i class="${cRed['T3-blue']}"></i>`);
		$('#red button').detach()
		$('#blue button').detach()
		$('#blue > p:first-child').addClass('hide');
		$('#red > p:first-child').addClass('hide');
		ready[1] = true;
		ready[0] = true;

		let scores = cRed['T3-red-score'].split(',');
		if ( scores ) {
			$('#red-score.stats .won span').html(scores[0])
		$('#red-score.stats .lost span').html(scores[1])
		$('#red-score.stats .tied span').html(scores[2])
		}

		let scores2 = cRed['T3-blue-score'].split(',');
		if ( scores2 ) {
			$('#blue-score.stats .won span').html(scores2[0])
			$('#blue-score.stats .lost span').html(scores2[1])
			$('#blue-score.stats .tied span').html(scores2[2])
		}

		gameStart();
		
	}
}

function selectIcons() {
	let icons = iconsOriginal.slice();

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
	$(`#red .display-6`).html("It's your turn.");
	$(`#blue .display-6`).html("It's your turn.");
	$(`#red .display-6`).removeClass('hide');

	$('#again2').removeClass('show');

	console.log($('#red .icons i').attr('class'));

	Cookies.set('T3-red', $('#red .icons i').attr('class'), {expires: 0.001388888889, path: '/', samesite: 'Lax', secure: true});
	Cookies.set('T3-blue', $('#blue .icons i').attr('class'), {expires: 0.001388888889, path: '/', samesite: 'Lax', secure: true});
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
	return false;
}

function cap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}