var wins2 = [
	/* same layer horiz */ [0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11], [12, 13, 14], [15, 16, 17], [18, 19, 20], [21, 22, 23], [24, 25, 26],
	/* same layer vert */ [0, 3, 6], [1, 4, 7], [2, 5, 8], [9, 12, 15], [10, 13, 16], [11, 14, 17], [18, 21, 24], [19, 22, 25], [20, 23, 26],
	/*same layer diag */ [0, 4, 8], [2, 4, 6], [9, 13, 17], [11, 13, 15], [18, 22, 26], [20, 22, 24],
	/* same squ diff lay*/ [0, 9, 18], [1, 10, 19], [2, 11, 20], [3, 12, 21], [4, 13, 22], [5, 14, 23], [6, 15, 24], [7, 16, 25], [8, 17, 26],
	/* diff lay horiz */ [0, 10, 20], [3, 13, 22], [6, 16, 25], [2, 10, 18], [5, 13, 21], [8, 16, 24],
	/* diff lay vert */ [0, 12, 24], [1, 13, 25], [2, 14, 26], [6, 12, 18], [7, 13, 19], [8, 14, 20],
	/* diff layer diag */ [0, 13, 26], [2, 13, 24], [6, 13, 20], [8, 13, 18]
];

let size = 3;
let count = 0;
for ( let lr = 0; lr < size; lr++ ) {
	let output = "";
	output += '<div class="layer">';
	for ( let lrw = 0; lrw < size; lrw++ ) {
		output += '<div class="l-row">';
		for ( let lrc = 0; lrc < size; lrc++ ) {
			let ln1 = Math.floor(count / (size * size));
			let rn1 = Math.floor((count % (size * size)) / size);
			let cn1 = Math.floor(count % size);
			output += '<div class="l-cell">';
			output += '<span class="bg-gradient">' + `${count}: ${ln1}, ${rn1}, ${cn1}` + '</span>';
			output += '</div>';
			count += 1;
		}
		output += '</div>';
	}
	output += '</div>';
	$('#grid-wrapper').append(output);
}

// Update Styles
$('.layer').css('width', (size * 51) + 'px');
$('.layer').css('height', (size * 53) + 'px');


let wins = [];

// Horizontal wins
for ( let ln = 0; ln < size; ln++ ) {
	// 0, 1, 2, 3, 4
	for ( let rn = 0; rn < size; rn++ ) {
		// 0, 1, 2, 3, 4
		let win = [];
		for ( let cn = 0; cn < size; cn++ ) {
			// 0, 1, 2, 3, 4
			// push 1 number
			win.push((ln * size * size) + (rn * size) + (cn))
		}
		// push the list of numbers
		wins.push(win)
	}
}


// Vertical wins
for ( let ln = 0; ln < size; ln++ ) {
	// 0, 1, 2, 3, 4
	for ( let cn = 0; cn < size; cn++ ) {
		// 0, 1, 2, 3, 4
		let win = [];
		for ( let rn = 0; rn < size; rn++ ) {
			// 0, 1, 2, 3, 4
			// push 1 number
			win.push((ln * size * size) + (rn * size) + (cn))
		}
		// push the list of numbers
		wins.push(win)
	}
}

// Diagonal Wins
// // 00, 11, 22
for ( let ln = 0; ln < size; ln++ ) {
	// 0, 1, 2, 3, 4
	let win = [];
	for ( let cn = 0; cn < size; cn++ ) {
		// 0, 1, 2, 3, 4
		for ( let rn = 0; rn < size; rn++ ) {
			// 0, 1, 2, 3, 4
			// push 1 number
			if ( rn == cn ) {
				win.push((ln * size * size) + (rn * size) + (cn))
			}
		}
	}
	wins.push(win)
}

// Diagonal Wins
// // 02, 11, 20
for ( let ln = 0; ln < size; ln++ ) {
	// 0, 1, 2, 3, 4
	let win = [];
	win.push((ln * size * size) + (0 * size) + (2))
	win.push((ln * size * size) + (1 * size) + (1))
	win.push((ln * size * size) + (2 * size) + (0))
	wins.push(win)
}

console.log(wins);

/* same squ diff lay*/
/* diff lay horiz */
/* diff lay vert */
/* diff layer diag */

function test(){
	for ( let ln = 0; ln < size; ln++ ) {
		// 0, 1, 2, 3, 4
		for ( let rn = 0; rn < size; rn++ ) {
			// 0, 1, 2, 3, 4
			for ( let cn = 0; cn < size; cn++ ) {
				// 0, 1, 2, 3, 4
				//(ln * size * size) + (rn * size) + (cn)
				
			}	
		}
	}


	let ln1 = count / size * size
	let rn1 = (count % (size * size)) / size
	let cn1 = count % size

	///* same layer vert */ [0, 3, 6], [1, 4, 7], [2, 5, 8], [9, 12, 15], [10, 13, 16], [11, 14, 17], [18, 21, 24], [19, 22, 25], [20, 23, 26],
}
