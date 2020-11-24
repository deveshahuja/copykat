let app;
var currSequence = [];
var round = 1;
var scores = [0, 0, 0];
var mute = false;
var elem = document.documentElement;
const canvas = document.getElementById("mycanvas");
const fullBt = document.getElementById("fullscreen");
const imgEl = document.querySelector("img");
var full = false;
fullBt.addEventListener("click", () => {
	imgEl.classList.toggle("exit");
	if (full) closeFullscreen();
	else openFullscreen();
	full = !full;
});

function openFullscreen() {
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) {
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	}
}

function closeFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}
class Components {
	constructor() {
		this.rect = new PIXI.Graphics();
		this.title = new PIXI.Text("CopyKat");
		this.help = new PIXI.Container();
	}
	get header() {
		this.rect.beginFill(0x0f1226);
		this.rect.drawRect(0, 0, app.screen.width, 50);
		this.rect.endFill();
		this.title.style = new PIXI.TextStyle({
			fontFamily: "Arial",
			fontSize: 20,
			fill: "#ffffff",
		});
		this.title.anchor.set(0.5);
		this.title.x = app.screen.width / 2;
		this.title.y = 25;
		return [this.rect, this.title];
	}
	get howTo() {
		let rect = new PIXI.Graphics();
		rect.beginFill(0x222958);
		rect.drawRect(0, 50, app.screen.width, 550);
		rect.endFill();
		this.help.addChild(rect);

		rect = new PIXI.Graphics();
		rect.beginFill(0x3b4686);
		rect.drawRoundedRect(app.screen.width / 2 - 100, 100, 200, 50, 10);
		rect.endFill();
		this.help.addChild(rect);
		rect = new PIXI.Graphics();
		rect.beginFill(0x3b4686);
		rect.drawRoundedRect(app.screen.width / 2 - 170, 200, 340, 210, 15);
		rect.endFill();
		this.help.addChild(rect);

		let title = new PIXI.Text("How To Play");
		title.style = new PIXI.TextStyle({
			fontFamily: "Arial",
			fontSize: 25,
			fill: "#ffffff",
		});
		title.anchor.set(0.5);
		title.x = app.screen.width / 2;
		title.y = 125;
		this.help.addChild(title);
		title = new PIXI.Text("Remember and repeat the sequence of color.");
		title.style = new PIXI.TextStyle({
			fontFamily: "Arial",
			fontSize: 30,
			align: "center",
			fill: "#ffffff",
			wordWrap: true,
			wordWrapWidth: 280,
		});
		title.anchor.set(0.5);
		title.x = app.screen.width / 2;
		title.y = app.screen.height / 2;
		this.help.addChild(title);
		return this.help;
	}
}
var component = new Components();
class BoxSprite {
	constructor(color, position) {
		let box = new PIXI.Graphics();
		box.beginFill(color, 1);
		box.drawRoundedRect(0, 0, 180, 180, 16);
		box.endFill();
		box.beginFill(0xffffff, 0.25);
		box.drawRoundedRect(10, 8, 160, 40, 20);
		box.endFill();
		let texture = app.renderer.generateTexture(box);
		this.sprite = new PIXI.Sprite(texture);
		this.sprite.anchor.set(0.5);

		switch (position) {
			case 1:
				this.sprite.x = 125;
				this.sprite.y = 280;
				break;
			case 2:
				this.sprite.x = 325;
				this.sprite.y = 280;
				break;
			case 3:
				this.sprite.x = 125;
				this.sprite.y = 480;
				break;
			case 4:
				this.sprite.x = 325;
				this.sprite.y = 480;
				break;
		}
	}
	get colorSprite() {
		return this.sprite;
	}
}
class ScoreTitles {
	constructor(roundNo) {
		this.roundTitle = new PIXI.Text("Round " + roundNo);
		this.roundTitle.style = new PIXI.TextStyle({
			fontFamily: "Arial",
			fontSize: 20,
			fill: "#ffffff",
		});
		this.roundTitle.x = 50;
		this.roundTitle.y = 360 + (roundNo - 1) * 50;
		this.scoreTitle = new PIXI.Text(scores[roundNo - 1]);
		this.scoreTitle.style = new PIXI.TextStyle({
			fontFamily: "Arial",
			fontSize: 20,
			fill: "#ffffff",
		});
		this.scoreTitle.x = 370;
		this.scoreTitle.y = 360 + (roundNo - 1) * 50;
	}
	get line() {
		return [this.roundTitle, this.scoreTitle];
	}
}
window.onload = function () {
	app = new PIXI.Application({
		view: canvas,
		height: 600,
		width: 450,
		backgroundColor: 0x222958,
		antialias: true,
	});
	document.body.appendChild(app.view);
	app.stage.interactive = true;

	readyScreen = new PIXI.Container();
	introScreen = new PIXI.Container();
	gameScreen = new PIXI.Container();
	scoreScreen = new PIXI.Container();

	readyScreen.visible = false;
	introScreen.visible = true;
	gameScreen.visible = false;
	scoreScreen.visible = false;

	app.stage.addChild(introScreen);
	app.stage.addChild(gameScreen);
	app.stage.addChild(scoreScreen);
	app.stage.addChild(readyScreen);
	notifContainers();
	timeoutContainer.visible = false;
	wrongContainer.visible = false;
	overContainer.visible = false;
	//helpContainer.visible = false;
	app.stage.addChild(timeoutContainer);
	app.stage.addChild(wrongContainer);
	app.stage.addChild(overContainer);
	//app.stage.addChild(helpContainer);

	app.loader.baseURL = "assets";
	app.loader
		.add("greenTick", "assets/done-black-48dp.svg")
		.add("leftSlide", "assets/keyboard_arrow_left-white-18dp.png")
		.add("helpCircle", "assets/round_help_outline_white_18dp.png")
		.add("starBackground", "assets/star-back.png")
		.add("muteCircle", "assets/volume_off-white-18dp.png")
		.add("unmuteCircle", "assets/volume_up-white-18dp.png");

	app.loader.onProgress.add(showProgress);
	app.loader.onComplete.add(doneLoading);
	app.loader.onError.add(reportError);
	app.loader.load();
	loadIntro();
	function showProgress(e) {
		//console.log(e.progress);
		//loading screen add slider
	}
	function reportError(e) {
		//console.log(e.message);
	}
	function doneLoading(e) {
		//console.log(e.message);
	}
};

function loadScore() {
	let sum = scores.reduce((a, b) => a + b, 0);
	let highScore = Math.max(...scores);
	let highidx =
		scores.findIndex((s) => {
			return s === highScore;
		}) + 1;

	let highY;
	if (highidx === 1) highY = 350;
	if (highidx === 2) highY = 400;
	if (highidx === 3) highY = 450;

	var backRotate = new PIXI.Sprite.from(app.loader.resources.starBackground.texture);
	backRotate.anchor.set(0.5);
	backRotate.x = app.screen.width / 2;
	backRotate.y = 150;
	scoreScreen.addChild(backRotate);
	app.ticker.add(() => {
		backRotate.rotation += 0.01;
	});

	scoreScreen.addChild(...component.header);

	//353c66
	rect = new PIXI.Graphics();
	rect.beginFill(0x353c66);
	rect.drawRect(0, 255, app.screen.width, 50);
	rect.endFill();
	scoreScreen.addChild(rect);
	title = new PIXI.Text("Scorecard");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 25,
		fill: "#ffffff",
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = 280;
	scoreScreen.addChild(title);

	//lower background
	rect = new PIXI.Graphics();
	rect.beginFill(0x222958);
	rect.drawRect(0, 305, app.screen.width, 300);
	rect.endFill();
	scoreScreen.addChild(rect);

	let scoreLine = new ScoreTitles(1);
	scoreScreen.addChild(...scoreLine.line);
	scoreLine = new ScoreTitles(2);
	scoreScreen.addChild(...scoreLine.line);
	scoreLine = new ScoreTitles(3);
	scoreScreen.addChild(...scoreLine.line);

	//mid
	star = new PIXI.Graphics();
	star.beginFill(0x8e9fca);
	star.drawStar(app.screen.width / 2, 150, 5, 60, 25);
	star.endFill();
	scoreScreen.addChild(star);
	title = new PIXI.Text(sum);
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 35,
		fill: "#ffffff",
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = 150;
	scoreScreen.addChild(title);

	rect = new PIXI.Graphics();
	rect.beginFill(0x191e41, 0.4);
	rect.drawRoundedRect(30, highY, app.screen.width - 60, 50, 10);
	rect.endFill();
	scoreScreen.addChild(rect);

	cir = new PIXI.Graphics();
	cir.beginFill(0xf8e81c);
	cir.drawCircle(420, highY + 25, 12);
	cir.endFill();
	scoreScreen.addChild(cir);
	//star f8981c
	star = new PIXI.Graphics();
	star.beginFill(0xf8981c);
	star.drawStar(420, highY + 25, 5, 8);
	star.endFill();
	scoreScreen.addChild(star);

	rect = new PIXI.Graphics();
	rect.beginFill(0x51c4a5);
	rect.drawRoundedRect(0, 0, 180, 50, 10);
	rect.endFill();

	const texture = app.renderer.generateTexture(rect);
	const cont = new PIXI.Sprite(texture);
	cont.anchor.set(0.5);
	cont.x = app.screen.width / 2;
	cont.y = 540;
	cont.interactive = true;
	cont.buttonMode = true;

	title = new PIXI.Text("Continue");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff",
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = 540;

	var clickBt = new Audio("sounds/clickBt.mp3");
	cont.on("pointertap", () => {
		currSequence = [];
		round = 1;
		scores = [0, 0, 0];
		if (!mute) clickBt.play();
		readyScreen.visible = false;
		introScreen.visible = true;
		loadIntro();
		gameScreen.visible = false;
		scoreScreen.visible = false;
		timeoutContainer.visible = false;
		wrongContainer.visible = false;
		overContainer.visible = false;
	});

	scoreScreen.addChild(cont);
	scoreScreen.addChild(title);
}
function notifContainers() {
	timeoutContainer = new PIXI.Container();
	let box = new PIXI.Graphics();
	box.beginFill(0x7986ba, 0.8);
	box.drawRect(0, 50, 450, 550);
	box.endFill();
	box.beginFill(0x5c6899, 0.9);
	box.drawRect(0, 280, app.screen.width, 140);
	box.endFill();
	let text = new PIXI.Text("Timed out , Try Again");
	text.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 30,
		fill: "#ffffff",
	});
	text.anchor.set(0.5);
	text.x = app.screen.width / 2;
	text.y = 350;
	timeoutContainer.addChild(box);
	timeoutContainer.addChild(text);
	timeoutContainer.visible = false;

	//wrong answer
	wrongContainer = new PIXI.Container();
	box = new PIXI.Graphics();
	box.beginFill(0x7986ba, 0.8);
	box.drawRect(0, 50, 450, 550);
	box.endFill();
	box.beginFill(0x5c6899, 0.9);
	box.drawRect(0, 280, app.screen.width, 140);
	box.endFill();
	text = new PIXI.Text("Incorrect! Watch the pattern again.");
	text.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 30,
		fill: "#ffffff",
		wordWrap: true,
		wordWrapWidth: 380,
		align: "center",
	});
	text.anchor.set(0.5);
	text.x = app.screen.width / 2;
	text.y = 350;
	wrongContainer.addChild(box);
	wrongContainer.addChild(text);

	//game over
	overContainer = new PIXI.Container();
	box = new PIXI.Graphics();
	box.beginFill(0x7986ba, 0.8);
	box.drawRect(0, 50, 450, 550);
	box.endFill();
	box.beginFill(0x5c6899, 0.9);
	box.drawRect(0, 280, app.screen.width, 140);
	box.endFill();
	text = new PIXI.Text("Game Over");
	text.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 35,
		fill: "#ffffff",
	});
	text.anchor.set(0.5);
	text.x = app.screen.width / 2;
	text.y = 350;
	overContainer.addChild(box);
	overContainer.addChild(text);
}
function loadGame() {
	gameScreen.addChild(...component.header);

	var sp = new BoxSprite(0xd34180, 1);
	var sprite1 = sp.colorSprite;
	var sp = new BoxSprite(0xe2c20a, 2);
	var sprite2 = sp.colorSprite;
	var sp = new BoxSprite(0x1ace74, 3);
	var sprite3 = sp.colorSprite;
	var sp = new BoxSprite(0x1ab2d0, 4);
	var sprite4 = sp.colorSprite;
	gameScreen.addChild(sprite1, sprite2, sprite3, sprite4);
	function interactions(state) {
		sprite1.interactive = state;
		sprite2.interactive = state;
		sprite3.interactive = state;
		sprite4.interactive = state;
	}

	var muteTx = app.loader.resources.muteCircle.texture;
	var unmuteTx = app.loader.resources.unmuteCircle.texture;
	var unmute = new Audio("sounds/unmute.mp3");
	var volBtn = new PIXI.Sprite(unmuteTx);
	volBtn.anchor.set(0.5);
	volBtn.x = 410;
	volBtn.y = 25;
	volBtn.interactive = true;
	volBtn.buttonMode = true;
	mute = false;
	gameScreen.addChild(volBtn);
	volBtn.on("pointertap", () => {
		mute = !mute;
		if (mute) volBtn.texture = muteTx;
		else {
			volBtn.texture = unmuteTx;
			unmute.play();
		}
	});

	var helpTx = app.loader.resources.helpCircle.texture;
	var backTx = app.loader.resources.leftSlide.texture;
	var optionBtn = new PIXI.Sprite(helpTx);

	var timeLimit;
	var checki;

	optionBtn.anchor.set(0.5);
	optionBtn.x = 40;
	optionBtn.y = 25;
	function optionActive(state) {
		optionBtn.alpha = state ? 1 : 0.5;
		optionBtn.interactive = state;
		optionBtn.buttonMode = state;
	}
	optionActive(true);
	bol = false;
	gameScreen.addChild(optionBtn);
	var question = new Audio("sounds/question.mp3");
	var slide = new Audio("sounds/slide.mp3");
	optionBtn.on("pointertap", () => {
		bol = !bol;
		if (bol) {
			optionBtn.texture = backTx;
			if (!mute) question.play();
			helpContainer.visible = true;
			scooreBoard.visible = false;
			interactions(false);
		} else {
			optionBtn.texture = helpTx;
			if (!mute) slide.play();
			helpContainer.visible = false;
			scooreBoard.visible = true;
			interactions(true);
		}
	});
	let scooreBoard = new PIXI.Container();
	updateScore();
	function updateScore() {
		let sum = scores.reduce((a, b) => a + b, 0);
		rect = new PIXI.Graphics();
		rect.beginFill(0x353c66);
		rect.drawRect(0, 50, app.screen.width, 50);
		rect.endFill();
		scooreBoard.addChild(rect);
		roundDisp = new PIXI.Text("Round: " + round + "/3");
		roundDisp.style = new PIXI.TextStyle({
			fontFamily: "Arial",
			fontSize: 20,
			fill: "#ffffff",
			align: "left",
		});
		roundDisp.anchor.set(0.5);
		roundDisp.x = 80;
		roundDisp.y = 75;
		scooreBoard.addChild(roundDisp);

		scoreDisp = new PIXI.Text("Score: " + sum);
		scoreDisp.style = new PIXI.TextStyle({
			fontFamily: "Arial",
			fontSize: 20,
			fill: "#ffffff",
		});
		scoreDisp.anchor.set(0.5);
		scoreDisp.x = 380;
		scoreDisp.y = 75;
		scooreBoard.addChild(scoreDisp);
		gameScreen.addChild(scooreBoard);
	}

	let gr = new PIXI.Graphics();
	gr.lineStyle(4, 0xffffff);
	gr.beginFill(0xffffff, 0.4);
	gr.drawRoundedRect(0, 0, 180, 180, 16);
	gr.endFill();
	var texture = app.renderer.generateTexture(gr);

	var highlightMask = new PIXI.Sprite(texture);
	highlightMask.anchor.set(0.5);
	gameScreen.addChild(highlightMask);
	highlightMask.visible = false;

	gr = new PIXI.Graphics();
	gr.lineStyle(4, 0x66ff00);
	gr.beginFill(0x2a6900, 0.5);
	gr.drawRoundedRect(0, 0, 175, 175, 16);
	gr.endFill();
	var texture = app.renderer.generateTexture(gr);
	var correctMask = new PIXI.Sprite(texture);
	correctMask.anchor.set(0.5);
	gameScreen.addChild(correctMask);
	correctMask.visible = false;

	var tickMask = new PIXI.Sprite.from(app.loader.resources.greenTick.texture);

	tickMask.anchor.set(0.5);
	gameScreen.addChild(tickMask);
	tickMask.visible = false;

	var helpContainer = component.howTo;
	gameScreen.addChild(helpContainer);
	helpContainer.visible = false;

	var beep1 = new Audio("sounds/beep1.mp3");
	var beep2 = new Audio("sounds/beep2.mp3");
	var beep3 = new Audio("sounds/beep3.mp3");
	var beep4 = new Audio("sounds/beep4.mp3");
	var wrong = new Audio("sounds/wrong.mp3");
	function highlight(mask, i) {
		switch (i) {
			case 1:
				mask.x = 125;
				mask.y = 280;
				if (!mute) beep1.play();
				break;
			case 2:
				mask.x = 325;
				mask.y = 280;
				if (!mute) beep2.play();
				break;
			case 3:
				mask.x = 125;
				mask.y = 480;
				if (!mute) beep3.play();
				break;
			case 4:
				mask.x = 325;
				mask.y = 480;
				if (!mute) beep4.play();
				break;
		}
		mask.visible = true;
		setTimeout(() => {
			mask.visible = false;
		}, 500);
	}

	text = new PIXI.Text("Watch");
	text.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 25,
		fill: "#ffffff",
	});
	text.anchor.set(0.5);
	text.x = app.screen.width / 2;
	text.y = 140;
	gameScreen.addChild(text);

	currSequence.push(Math.floor(1 + Math.random() * 4));

	setRound();
	function setRound() {
		updateScore();
		sum = scores.reduce((a, b) => a + b, 0);
		interactions(false);
		text.visible = true;
		optionActive(false);
		let cidx = 0;

		var id = setInterval(() => {
			highlight(highlightMask, currSequence[cidx++]);
		}, 1000);
		clearInterval(timeLimit);
		setTimeout(() => {
			//input time
			clearInterval(id);
			text.visible = false;
			interactions(true);
			optionActive(true);
			checki = 0;
			timeLimit = setInterval(() => {
				if (scoreScreen.visible == false && text.visible == false && helpContainer.visible == false) {
					if (round < 3) {
						timeoutContainer.visible = true;
						optionActive(false);
						if (!mute) wrong.play();
					}
					setTimeout(() => {
						timeoutContainer.visible = false;
						optionActive(true);
						if (round < 3) {
							if (helpContainer.visible == false && sum > 1) round++;
							setRound();
						} else if (gameScreen.visible == true) {
							overContainer.visible = true;
							if (!mute) wrong.play();
							setTimeout(() => {
								clearInterval(timeLimit);
								loadScore();
								//console.log("game over");
								scoreScreen.visible = true;
								overContainer.visible = false;
								gameScreen.visible = false;
								timeoutContainer.visible = false;
							}, 2000);
						}
					}, 2000);
				}
				//console.log("timeout");
			}, 15000); //15sec
		}, 1000 * currSequence.length + 500);
	}

	function boxClick(boxNo) {
		if (currSequence[checki++] === boxNo) {
			if (currSequence.length === checki) {
				scores[round - 1]++;
				//console.log("correct");
				currSequence.push(Math.floor(1 + Math.random() * 4));
				//correct mask on
				highlight(correctMask, boxNo);
				highlight(tickMask, boxNo);
				setRound();
			}
		} else {
			//console.log("wrong");
			if (!mute) wrong.play();
			//wrong mask on
			if (sum > 1) round++;
			interactions(false);
			optionActive(false);
			if (round <= 3) {
				wrongContainer.visible = true;
				setTimeout(() => {
					wrongContainer.visible = false;
					optionActive(true);
					setRound();
				}, 2000);
			} else {
				overContainer.visible = true;
				setTimeout(() => {
					loadScore();
					clearInterval(timeLimit);
					//console.log("wrong over");
					scoreScreen.visible = true;
					optionActive(true);
					overContainer.visible = false;
					timeoutContainer.visible = false;
					gameScreen.visible = false;
				}, 2000);
			}
		}
		highlight(highlightMask, boxNo);
		//console.log("sprite" + boxNo);
	}
	sprite1.on("pointertap", () => {
		boxClick(1);
	});
	sprite2.on("pointertap", () => {
		boxClick(2);
	});
	sprite3.on("pointertap", () => {
		boxClick(3);
	});
	sprite4.on("pointertap", () => {
		boxClick(4);
	});
}

function loadIntro() {
	var component = new Components();
	introScreen.addChild(...component.header);
	introScreen.addChild(component.howTo);

	let rect = new PIXI.Graphics();
	rect.beginFill(0xe0e3ed);
	rect.drawRoundedRect(0, 0, 150, 60, 15);
	rect.endFill();
	const texture = app.renderer.generateTexture(rect);
	const start = new PIXI.Sprite(texture);
	start.anchor.set(0.5);
	start.x = app.screen.width / 2;
	start.y = 500;
	start.interactive = true;
	start.buttonMode = true;
	introScreen.addChild(start);

	title = new PIXI.Text("Start");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		//align: "center",
		fill: "#000000",
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = 500;
	introScreen.addChild(title);

	start.on("pointertap", () => {
		introScreen.visible = false;
		readyScreen.visible = true;
		readySetGo();
	});

	start.on("pointerover", () => {
		start.scale.x *= 1.1;
		start.scale.y *= 1.1;
		title.scale.x *= 1.1;
		title.scale.y *= 1.1;
	});
	start.on("pointerout", () => {
		start.scale.x /= 1.1;
		start.scale.y /= 1.1;
		title.scale.x /= 1.1;
		title.scale.y /= 1.1;
	});
}
function readySetGo() {
	readyScreen.addChild(...component.header);

	let circle = new PIXI.Graphics();
	circle.lineStyle(5, 0xffffff, 1);
	circle.beginFill(0x567bd3);
	circle.drawCircle(0, 0, 50);
	circle.endFill();
	circle.x = app.screen.width / 2;
	circle.y = app.screen.height / 2;
	readyScreen.addChild(circle);

	let currText = new PIXI.Text(3);
	currText.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 55,
		fill: "#ffffff",
		fontWeight: "bolder",
	});
	currText.anchor.set(0.5);
	currText.x = app.screen.width / 2;
	currText.y = app.screen.height / 2;
	readyScreen.addChild(currText);

	let inc = 10;
	let duration = 900;
	let scale = 1.03;
	let id = setInterval(() => {
		circle.scale.x *= scale;
		circle.scale.y *= scale;
		currText.scale.x *= scale;
		currText.scale.y *= scale;
	}, inc);
	var ready = new Audio("sounds/readysetgo.mp3");
	ready.play();
	function setScale(scale) {
		circle.scale.x *= scale;
		circle.scale.y *= scale;
		currText.scale.x *= scale;
		currText.scale.y *= scale;
	}
	function baseScale() {
		currText.scale.x = 0.1;
		currText.scale.y = 0.1;
		circle.scale.x = 0.1;
		circle.scale.y = 0.1;
	}
	baseScale();
	setTimeout(() => {
		clearInterval(id);

		currText.text = "2";
		baseScale();
		id = setInterval(() => {
			setScale(scale);
		}, inc);
		setTimeout(() => {
			clearInterval(id);
			currText.text = "1";
			baseScale();
			id = setInterval(() => {
				setScale(scale);
			}, inc);
			setTimeout(() => {
				clearInterval(id);
				currText.text = "GO";
				baseScale();
				id = setInterval(() => {
					setScale(1.023);
				}, inc);
				setTimeout(() => {
					clearInterval(id);
					readyScreen.visible = false;
					currText.visible = false;
					gameScreen.visible = true;
					circle.visible = false;
					loadGame();
				}, duration + 230);
			}, duration);
		}, duration);
	}, duration);
}
