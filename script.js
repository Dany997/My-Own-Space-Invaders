const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('.results');
const width = 15;
const aliensRemoved = [];
let currentShooterIndex = 202;
let invadersId;
let isGoingRight = true;
let direction = 1;

for (let i = 0; i < width * width; i++) {
	const square = document.createElement('div');
	grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const alienInvaders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 16, 17, 18, 19, 20];

const draw = () => {
	for (let i = 0; i < alienInvaders.length; i++) {
		if (
			!aliensRemoved.includes(i) &&
			alienInvaders[i] >= 0 &&
			alienInvaders[i] < squares.length
		) {
			squares[alienInvaders[i]].classList.add('invader');
		}
	}
};

const remove = () => {
	for (let i = 0; i < alienInvaders.length; i++) {
		if (alienInvaders[i] >= 0 && alienInvaders[i] < squares.length) {
			squares[alienInvaders[i]].classList.remove('invader');
		}
	}
};

draw();

squares[currentShooterIndex].classList.add('shooter');

const moveShooter = (e) => {
	squares[currentShooterIndex].classList.remove('shooter');

	switch (e.key) {
		case 'ArrowLeft':
			if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
			break;
		case 'ArrowRight':
			if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
			break;
	}
	squares[currentShooterIndex].classList.add('shooter');
};

const moveInvaders = () => {
	const leftEdge = alienInvaders[0] % width === 0;
	const rightEdge =
		alienInvaders[alienInvaders.length - 1] % width === width - 1;

	remove();

	if (rightEdge && isGoingRight) {
		for (let i = 0; i < alienInvaders.length; i++) {
			alienInvaders[i] += width;
		}
		direction = -1;
		isGoingRight = false;
	}

	if (leftEdge && !isGoingRight) {
		for (let i = 0; i < alienInvaders.length; i++) {
			alienInvaders[i] += width;
		}
		direction = 1;
		isGoingRight = true;
	}

	for (let i = 0; i < alienInvaders.length; i++) {
		alienInvaders[i] += direction;
	}
	draw();

	if (squares[currentShooterIndex].classList.contains('invader')) {
		resultDisplay.innerHTML = 'GAME OVER';
		clearInterval(invadersId);
	}

	if (aliensRemoved.length === alienInvaders.length) {
		resultDisplay.innerHTML = 'You Win';
		clearInterval(invadersId);
	}
};

invadersId = setInterval(moveInvaders, 600);

function shoot(e) {
	let laserId;
	let currentLaserIndex = currentShooterIndex;

	function moveLaser() {
		squares[currentLaserIndex].classList.remove('laser');
		currentLaserIndex -= width;

		if (currentLaserIndex < 0) {
			clearInterval(laserId);
			return;
		}

		squares[currentLaserIndex].classList.add('laser');

		if (squares[currentLaserIndex].classList.contains('invader')) {
			squares[currentLaserIndex].classList.remove('laser');
			squares[currentLaserIndex].classList.remove('invader');
			squares[currentLaserIndex].classList.add('boom');

			setTimeout(
				() => squares[currentLaserIndex].classList.remove('boom'),
				300
			);

			clearInterval(laserId);

			const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
			aliensRemoved.push(alienRemoved);
		}
	}

	if (e.key === 'ArrowUp') {
		laserId = setInterval(moveLaser, 100);
	}
}

document.addEventListener('keydown', moveShooter);
document.addEventListener('keydown', shoot);
