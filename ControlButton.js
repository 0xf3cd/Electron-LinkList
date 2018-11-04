const Two = require('two.js');
const anime = require('animejs');
const ipcRenderer = require('electron').ipcRenderer;

const circle1 = document.getElementById('circle1');
const circle2 = document.getElementById('circle2');
const circle3 = document.getElementById('circle3');
const check1 = document.getElementById('check1');
const check2 = document.getElementById('check2');
const check3 = document.getElementById('check3');
const searchButton = document.getElementById('search-button');
const addButton = document.getElementById('add-button');
const deleteButton = document.getElementById('delete-button');
const modifyButton = document.getElementById('modify-button');

let singleState = true;
let dualState = false;
let circularState = false;

const unactivateSingle = function() {
	anime.remove(circle1);
	anime.remove(check1);
	anime({
		targets: '.circle1',
		opacity: [1, 0.1],
		easing: 'easeInOutQuad',
		duration: 400
	});
	anime({
		targets: '.check1',
		strokeDashoffset: {
			value: 0,
			duration: 500,
			delay: 50,
			easing: 'easeOutQuart',
		},
		opacity: [1, 0.1]
	});

	singleState = !singleState;
};

const activateSingle = function() {
	anime.remove(circle1);
	anime.remove(check1);
	anime({
		targets: '.circle1',
		opacity: [0.1, 1],
		easing: 'easeInOutQuad',
		duration: 400
	});
	anime({
		targets: '.check1',
		strokeDashoffset: {
			value: [anime.setDashoffset, 0],
			duration: 500,
			delay: 50,
			easing: 'easeOutQuart',
		},
		opacity: [0.1, 1]
	});

	singleState = !singleState;
};

const unactivateDual = function() {
	anime.remove(circle2);
	anime.remove(check2);
	anime({
		targets: '.circle2',
		opacity: [1, 0.1],
		easing: 'easeInOutQuad',
		duration: 400
	});
	anime({
		targets: '.check2',
		strokeDashoffset: {
			value: 0,
			duration: 500,
			delay: 50,
			easing: 'easeOutQuart',
		},
		opacity: [1, 0.1]
	});

	dualState = !dualState;
};

const activateDual = function() {
	anime.remove(circle2);
	anime.remove(check2);
	anime({
		targets: '.circle2',
		opacity: [0.1, 1],
		easing: 'easeInOutQuad',
		duration: 400
	});
	anime({
		targets: '.check2',
		strokeDashoffset: {
			value: [anime.setDashoffset, 0],
			duration: 500,
			delay: 50,
			easing: 'easeOutQuart',
		},
		opacity: [0.1, 1]
	});

	dualState = !dualState;
};

const unactivateCircular = function() {
	anime.remove(circle3);
	anime.remove(check3);
	anime({
		targets: '.circle3',
		opacity: [1, 0.1],
		easing: 'easeInOutQuad',
		duration: 400
	});
	anime({
		targets: '.check3',
		strokeDashoffset: {
			value: 0,
			duration: 500,
			delay: 50,
			easing: 'easeOutQuart',
		},
		opacity: [1, 0.1]
	});

	circularState = !circularState;
};

const activateCircular = function() {
	anime.remove(circle3);
	anime.remove(check3);
	anime({
		targets: '.circle3',
		opacity: [0.1, 1],
		easing: 'easeInOutQuad',
		duration: 400
	});
	anime({
		targets: '.check3',
		strokeDashoffset: {
			value: [anime.setDashoffset, 0],
			duration: 500,
			delay: 50,
			easing: 'easeOutQuart',
		},
		opacity: [0.1, 1]
	});

	circularState = !circularState;
};

const toggleSingleState = function() {
	if(singleState) {
		unactivateSingle();
	} else {
		activateSingle();
	}
};

const toggleDualState = function() {
	if(dualState) {
		unactivateDual();
	} else {
		activateDual();
	}
};

const toggleCircularState = function() {
	if(circularState) {
		unactivateCircular();
	} else {
		activateCircular();
	}
};

const changeChoice = function(event) {
	if(event.target === circle1 || event.target === check1) {
		if(singleState) {
			return;
		} else {
			toggleSingleState();
			if(dualState) {
				toggleDualState();
			} else {
				toggleCircularState();
			}
		}
	} else if(event.target === circle2 || event.target === check2) {
		if(dualState) {
			return;
		} else {
			toggleDualState();
			if(singleState) {
				toggleSingleState();
			} else {
				toggleCircularState();
			}
		}
	} else if(event.target === circle3 || event.target === check3) {
		if(circularState) {
			return;
		} else {
			toggleCircularState();
			if(singleState) {
				toggleSingleState();
			} else {
				toggleDualState();
			}
		}
	}

	let messageTitle;
	if(singleState) {
		messageTitle = 'single';
	} else if(dualState) {
		messageTitle = 'dual';
	} else if(circularState) {
		messageTitle = 'circular';
	}
	ipcRenderer.send('linklist-type-change', messageTitle);
};

const initial = function() {
	activateSingle();
	unactivateDual();
	unactivateCircular();
	singleState = true;
	dualState = false;
	circularState = false;
};

initial();
circle1.addEventListener('click', changeChoice, false);
circle2.addEventListener('click', changeChoice, false);
circle3.addEventListener('click', changeChoice, false);
check1.addEventListener('click', changeChoice, false);
check2.addEventListener('click', changeChoice, false);
check3.addEventListener('click', changeChoice, false);

searchButton.addEventListener('click', (event) => {
	ipcRenderer.send('search-button-click');
}, false);
addButton.addEventListener('click', (event) => {
	ipcRenderer.send('add-button-click');
}, false);
deleteButton.addEventListener('click', (event) => {
	ipcRenderer.send('delete-button-click');
}, false);
modifyButton.addEventListener('click', (event) => {
	ipcRenderer.send('modify-button-click');
}, false);