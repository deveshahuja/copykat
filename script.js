//import * as PIXI from "pixi.js";
let app;
var currSequence = [];
var round = 1;
var scores = [0, 0, 0];
//var curr;
var mute = false;

window.onload = function () {
	app = new PIXI.Application({
		height: 600,
		width: 450,
		backgroundColor: 0x222958,
		//backgroundColor: 0xeeeeee,
		antialias: true,
	});
	//0xd34180 red
	//#e2c20a yellow
	//#1ace74 green
	//#1ab2d0 blue
	document.body.appendChild(app.view);
	app.stage.interactive = true;

	readyScreen = new PIXI.Container();
	introScreen = new PIXI.Container();
	gameScreen = new PIXI.Container();
	scoreScreen = new PIXI.Container();

	readyScreen.visible = false;
	introScreen.visible = true;
	gameScreen.visible = false;
	//loadScore();
	scoreScreen.visible = false;

	app.stage.addChild(introScreen);
	app.stage.addChild(gameScreen);
	app.stage.addChild(scoreScreen);
	app.stage.addChild(readyScreen);
	notifContainers();
	timeoutContainer.visible = false;
	wrongContainer.visible = false;
	overContainer.visible = false;
	helpContainer.visible = false;
	app.stage.addChild(timeoutContainer);
	app.stage.addChild(wrongContainer);
	app.stage.addChild(overContainer);
	app.stage.addChild(helpContainer);

	loadIntro();

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
	function showProgress(e) {
		//console.log(e.progress);
	}
	function reportError(e) {
		//console.log(e.message);
	}
	function doneLoading(e) {
		//loadScreen.visible = false;
		//player = PIXI.Sprite.from(app.loader.resources.sourse_name1.texture);
	}
	//addEventListener pointerdown include game in div

	//app.ticker.add(gameLoop);
};

function loadScore() {
	let sum = scores.reduce((a, b) => a + b, 0);

	//highlight 191e41
	let highScore = Math.max(...scores);
	let highidx =
		scores.findIndex((s) => {
			return s === highScore;
		}) + 1;

	let highY;
	if (highidx === 1) highY = 350;
	if (highidx === 2) highY = 400;
	if (highidx === 3) highY = 450;

	var backRotate = new PIXI.Sprite.from(
		app.loader.resources.starBackground.texture
	);
	backRotate.anchor.set(0.5);
	backRotate.x = app.screen.width / 2;
	backRotate.y = 150;

	scoreScreen.addChild(backRotate);
	app.ticker.add(() => {
		backRotate.rotation += 0.01;
	});
	let rect = new PIXI.Graphics();
	rect.beginFill(0x0f1226);
	rect.drawRect(0, 0, app.screen.width, 50);
	rect.endFill();
	scoreScreen.addChild(rect);
	let title = new PIXI.Text("CopyKat");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff", //also gradient
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = 25;
	scoreScreen.addChild(title);

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
		fill: "#ffffff", //also gradient
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

	title = new PIXI.Text("Round 1");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff", //also gradient
	});
	title.x = 50;
	title.y = 360;
	scoreScreen.addChild(title);

	title = new PIXI.Text("Round 2");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff", //also gradient
	});
	title.x = 50;
	title.y = 410;
	scoreScreen.addChild(title);

	title = new PIXI.Text("Round 3");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff", //also gradient
	});
	title.x = 50;
	title.y = 460;
	scoreScreen.addChild(title);

	title = new PIXI.Text(scores[0]);
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff", //also gradient
	});
	title.x = 370;
	title.y = 360;
	scoreScreen.addChild(title);

	title = new PIXI.Text(scores[1]);
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff", //also gradient
	});
	title.x = 370;
	title.y = 410;
	scoreScreen.addChild(title);

	title = new PIXI.Text(scores[2]);
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff", //also gradient
	});
	title.x = 370;
	title.y = 460;
	scoreScreen.addChild(title);

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
		fill: "#ffffff", //also gradient
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
		fill: "#ffffff", //also gradient
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
		loadIntro();
		introScreen.visible = true;
		introScreen.visible = false;
		gameScreen.visible = false;
		scoreScreen.visible = false;
		timeoutContainer.visible = false;
		wrongContainer.visible = false;
		overContainer.visible = false;
		//clearInterval(timeLimit);
		//clearInterval(id);
		//add other screens
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
		fill: "#ffffff", //also gradient
	});
	text.anchor.set(0.5);
	text.x = app.screen.width / 2;
	text.y = 350;
	//interactive events off
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
		fill: "#ffffff", //also gradient
		wordWrap: true,
		wordWrapWidth: 380,
		align: "center",
	});
	text.anchor.set(0.5);
	text.x = app.screen.width / 2;
	text.y = 350;
	//interactive events off
	wrongContainer.addChild(box);
	wrongContainer.addChild(text);
	//wrongContainer.visible=false;

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
		fill: "#ffffff", //also gradient
	});
	text.anchor.set(0.5);
	text.x = app.screen.width / 2;
	text.y = 350;
	//interactive events off
	overContainer.addChild(box);
	overContainer.addChild(text);
	//overContainer.visible = false;

	helpContainer = new PIXI.Container();

	let rect = new PIXI.Graphics();
	rect.beginFill(0x222958);
	rect.drawRect(0, 50, app.screen.width, 550);
	rect.endFill();
	helpContainer.addChild(rect);

	rect = new PIXI.Graphics();
	rect.beginFill(0x3b4686);
	rect.drawRoundedRect(app.screen.width / 2 - 100, 100, 200, 50, 10);
	rect.endFill();
	helpContainer.addChild(rect);
	rect = new PIXI.Graphics();
	rect.beginFill(0x3b4686);
	rect.drawRoundedRect(app.screen.width / 2 - 170, 200, 340, 210, 15);
	rect.endFill();
	helpContainer.addChild(rect);
	/*
	let title = new PIXI.Text("CopyKat");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff", //also gradient
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = 25;

	helpContainer.addChild(title);
	*/
	let title = new PIXI.Text("How To Play");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 25,
		fill: "#ffffff", //also gradient
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = 125;
	helpContainer.addChild(title);
	title = new PIXI.Text("Remember and repeat the sequence of color.");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 30,
		align: "center",
		fill: "#ffffff", //also gradient
		wordWrap: true,
		wordWrapWidth: 280,
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = app.screen.height / 2;
	helpContainer.addChild(title);
}
function loadGame() {
	const box1 = new PIXI.Graphics();
	const box2 = new PIXI.Graphics();
	const box3 = new PIXI.Graphics();
	const box4 = new PIXI.Graphics();

	//box1.lineStyle(2, 0xffffff);
	box1.beginFill(0xd34180, 1);
	box1.drawRoundedRect(0, 0, 180, 180, 16);
	box1.endFill();
	box1.beginFill(0xffffff, 0.25);
	box1.drawRoundedRect(10, 8, 160, 40, 20);
	box1.endFill();
	var texture = app.renderer.generateTexture(box1);
	var sprite1 = new PIXI.Sprite(texture);

	box2.beginFill(0xe2c20a, 1);
	box2.drawRoundedRect(0, 0, 180, 180, 16);
	box2.endFill();
	box2.beginFill(0xffffff, 0.25);
	box2.drawRoundedRect(10, 8, 160, 40, 20);
	box2.endFill();
	var texture = app.renderer.generateTexture(box2);
	var sprite2 = new PIXI.Sprite(texture);

	box3.beginFill(0x1ace74, 1);
	box3.drawRoundedRect(0, 0, 180, 180, 16);
	box3.endFill();
	box3.beginFill(0xffffff, 0.25);
	box3.drawRoundedRect(10, 8, 160, 40, 20);
	box3.endFill();
	var texture = app.renderer.generateTexture(box3);
	var sprite3 = new PIXI.Sprite(texture);

	box4.beginFill(0x1ab2d0, 1);
	box4.drawRoundedRect(0, 0, 180, 180, 16);
	box4.endFill();
	box4.beginFill(0xffffff, 0.25);
	box4.drawRoundedRect(10, 8, 160, 40, 20);
	box4.endFill();
	var texture = app.renderer.generateTexture(box4);
	var sprite4 = new PIXI.Sprite(texture);

	sprite1.anchor.set(0.5);
	sprite2.anchor.set(0.5);
	sprite3.anchor.set(0.5);
	sprite4.anchor.set(0.5);

	sprite1.y = sprite2.y = 280;
	sprite3.y = sprite4.y = 480;
	sprite1.x = sprite3.x = 125;
	sprite2.x = sprite4.x = 325;

	let rect = new PIXI.Graphics();
	rect.beginFill(0x0f1226);
	rect.drawRect(0, 0, app.screen.width, 50);
	rect.endFill();
	gameScreen.addChild(rect);

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

	optionBtn.anchor.set(0.5);
	optionBtn.x = 40;
	optionBtn.y = 25;
	optionBtn.interactive = true;
	optionBtn.buttonMode = true;
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
		} else {
			optionBtn.texture = helpTx;
			if (!mute) slide.play();
			helpContainer.visible = false;
		}

		//stop timeout
	});

	let title = new PIXI.Text("CopyKat");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff", //also gradient
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = 25;
	gameScreen.addChild(title);

	updateScore();
	function updateScore() {
		//round scoreboard 353c66
		let sum = scores.reduce((a, b) => a + b, 0);
		rect = new PIXI.Graphics();
		rect.beginFill(0x353c66);
		rect.drawRect(0, 50, app.screen.width, 50);
		rect.endFill();
		gameScreen.addChild(rect);
		roundDisp = new PIXI.Text("Round: " + round + "/3");
		roundDisp.style = new PIXI.TextStyle({
			fontFamily: "Arial",
			fontSize: 20,
			fill: "#ffffff", //also gradient
			align: "left",
		});
		roundDisp.anchor.set(0.5);
		roundDisp.x = 80;
		roundDisp.y = 75;
		gameScreen.addChild(roundDisp);
		//gameScreen.removeChild(title);

		scoreDisp = new PIXI.Text("Score: " + sum);
		scoreDisp.style = new PIXI.TextStyle({
			fontFamily: "Arial",
			fontSize: 20,
			fill: "#ffffff", //also gradient
		});
		scoreDisp.anchor.set(0.5);
		scoreDisp.x = 380;
		scoreDisp.y = 75;
		gameScreen.addChild(scoreDisp);
	}

	gameScreen.addChild(sprite1, sprite2, sprite3, sprite4);

	//////////////

	let gr = new PIXI.Graphics();
	gr.lineStyle(4, 0xffffff);
	gr.beginFill(0xffffff, 0.4);
	gr.drawRoundedRect(0, 0, 180, 180, 16);
	gr.endFill();
	var texture = app.renderer.generateTexture(gr);
	/*
	//gradient import canvas 2d
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var grd = ctx.createRadialGradient(0, 0, 5, 0, 0, 100);
	grd.addColorStop(0, "red");
	grd.addColorStop(1, "white");
	// Fill with gradient
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, 150, 100);
	var texture = new PIXI.Texture.from(c);
	*/
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
	//tickMask.scale *= 0.7;
	tickMask.anchor.set(0.5);
	gameScreen.addChild(tickMask);
	tickMask.visible = false;
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
		/*
		mask.alpha = 0;
		let fadeId = setInterval(() => {
			mask.plpha += 0.05;
		}, 10);
		setTimeout(() => {
			clearInterval(fadeId);
		}, 200);
		*/
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

	var timeLimit;
	var checki;

	currSequence.push(Math.floor(1 + Math.random() * 4));

	setRound();
	function setRound() {
		updateScore();
		sprite1.interactive = false;
		sprite2.interactive = false;
		sprite3.interactive = false;
		sprite4.interactive = false;
		text.visible = true;
		//timeoutContainer.visible = false;
		optionBtn.alpha = 0.5;
		optionBtn.interactive = false;
		optionBtn.buttonMode = false;
		let cidx = 0;

		var id = setInterval(() => {
			//currSequence.push(Math.floor(1 + Math.random() * 4));//only when correct
			console.log("[" + cidx + "] " + currSequence[cidx]);
			highlight(highlightMask, currSequence[cidx++]);
		}, 1000);
		clearInterval(timeLimit);
		setTimeout(() => {
			//input time
			clearInterval(id);
			text.visible = false;
			sprite1.interactive = true;
			sprite2.interactive = true;
			sprite3.interactive = true;
			sprite4.interactive = true;
			optionBtn.alpha = 1;
			optionBtn.interactive = true;
			optionBtn.buttonMode = true;
			checki = 0;
			timeLimit = setInterval(() => {
				timeoutContainer.visible = true;
				setTimeout(() => {
					timeoutContainer.visible = false;
					if (round < 3) {
						round++;
						setRound();
					} else if (gameScreen.visible == true) {
						overContainer.visible = true;
						setTimeout(() => {
							clearInterval(timeLimit);
							loadScore();
							console.log("game over");
							scoreScreen.visible = true;
							overContainer.visible = false;
							gameScreen.visible = false;
							timeoutContainer.visible = false;
						}, 2000);
					}
				}, 2000);
				console.log("timeout");
			}, 10000); //   currlen*1000
		}, 1000 * currSequence.length + 500);
	}

	function boxClick(boxNo) {
		if (currSequence[checki++] === boxNo) {
			if (currSequence.length === checki) {
				scores[round - 1]++;
				console.log("correct");
				currSequence.push(Math.floor(1 + Math.random() * 4));
				//correct mask on
				highlight(correctMask, boxNo);
				highlight(tickMask, boxNo);
				//clearInterval(timeLimit);
				setRound(); //delay in between

				//again with len++
			}
		} else {
			console.log("wrong");
			if (!mute) wrong.play();
			//wrong mask on
			round++;
			sprite1.interactive = false;
			sprite2.interactive = false;
			sprite3.interactive = false;
			sprite4.interactive = false;
			//clearTimeout(timeLimit);
			if (round <= 3) {
				wrongContainer.visible = true;
				setTimeout(() => {
					wrongContainer.visible = false;
					setRound();
				}, 2000);
			} else {
				overContainer.visible = true;
				setTimeout(() => {
					loadScore();
					clearInterval(timeLimit);
					console.log("wrong over");
					scoreScreen.visible = true;
					overContainer.visible = false;
					timeoutContainer.visible = false;
					gameScreen.visible = false;
				}, 2000);
			}
		}
		highlight(highlightMask, boxNo);
		console.log("sprite" + boxNo);
	}
	//use score+1
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
	let rect = new PIXI.Graphics();
	rect.beginFill(0x0f1226);
	rect.drawRect(0, 0, app.screen.width, 50);
	rect.endFill();
	introScreen.addChild(rect);
	rect = new PIXI.Graphics();
	rect.beginFill(0x3b4686);
	rect.drawRoundedRect(app.screen.width / 2 - 100, 100, 200, 50, 10);
	rect.endFill();
	introScreen.addChild(rect);
	rect = new PIXI.Graphics();
	rect.beginFill(0x3b4686);
	rect.drawRoundedRect(app.screen.width / 2 - 170, 200, 340, 210, 15);
	rect.endFill();
	introScreen.addChild(rect);

	let title = new PIXI.Text("CopyKat");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff", //also gradient
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = 25;

	introScreen.addChild(title);
	title = new PIXI.Text("How To Play");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 25,
		fill: "#ffffff", //also gradient
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = 125;
	introScreen.addChild(title);
	title = new PIXI.Text("Remember and repeat the sequence of color.");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 30,
		align: "center",
		fill: "#ffffff", //also gradient
		wordWrap: true,
		wordWrapWidth: 280,
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = app.screen.height / 2;
	introScreen.addChild(title);

	rect = new PIXI.Graphics();
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
	/*
	start.on("click", () => {
		introScreen.visible = false;
		readyScreen.visible = true;
		readySetGo();
	});
	*/

	//var clickBt = new Audio("sounds/clickBt.mp3");
	start.on("pointertap", () => {
		introScreen.visible = false;
		readyScreen.visible = true;
		//if (!mute) clickBt.play();
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
	let rect = new PIXI.Graphics();
	rect.beginFill(0x0f1226);
	rect.drawRect(0, 0, app.screen.width, 50);
	rect.endFill();
	readyScreen.addChild(rect);
	let title = new PIXI.Text("CopyKat");
	title.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 20,
		fill: "#ffffff", //also gradient
	});
	title.anchor.set(0.5);
	title.x = app.screen.width / 2;
	title.y = 25;
	readyScreen.addChild(title);
	//sound

	let circle = new PIXI.Graphics();
	circle.lineStyle(5, 0xffffff, 1);
	circle.beginFill(0x567bd3);
	circle.drawCircle(0, 0, 50);
	circle.endFill();
	circle.x = app.screen.width / 2;
	circle.y = app.screen.height / 2;
	circle.scale.x *= 0.1;
	circle.scale.y *= 0.1;
	readyScreen.addChild(circle);

	let three = new PIXI.Text(3);
	three.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 60,
		fill: "#ffffff",
		fontWeight: "bolder",
	});
	three.anchor.set(0.5);
	three.x = app.screen.width / 2;
	three.y = app.screen.height / 2;
	three.scale.x *= 0.1;
	three.scale.y *= 0.1;
	//one.rotation += 10;
	readyScreen.addChild(three);

	let two = new PIXI.Text(2);
	two.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 60,
		fill: "#ffffff",
		fontWeight: "bolder",
	});
	two.anchor.set(0.5);
	two.x = app.screen.width / 2;
	two.y = app.screen.height / 2;
	two.scale.x *= 0.1;
	two.scale.y *= 0.1;
	//one.rotation += 10;
	readyScreen.addChild(two);
	two.visible = false;

	let one = new PIXI.Text(1);
	one.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 60,
		fill: "#ffffff",
		fontWeight: "bolder",
	});
	one.anchor.set(0.5);
	one.x = app.screen.width / 2;
	one.y = app.screen.height / 2;
	one.scale.x *= 0.1;
	one.scale.y *= 0.1;
	//one.rotation += 10;
	readyScreen.addChild(one);
	one.visible = false;

	let go = new PIXI.Text("GO");
	go.style = new PIXI.TextStyle({
		fontFamily: "Arial",
		fontSize: 50,
		fill: "#ffffff",
		fontWeight: "bolder",
	});
	go.anchor.set(0.5);
	go.x = app.screen.width / 2;
	go.y = app.screen.height / 2;
	go.scale.x *= 0.1;
	go.scale.y *= 0.1;
	//one.rotation += 10;
	readyScreen.addChild(go);
	go.visible = false;

	let inc = 10;
	let duration = 900;
	let scale = 1.03;
	let id = setInterval(() => {
		circle.scale.x *= scale;
		circle.scale.y *= scale;
		three.scale.x *= scale;
		three.scale.y *= scale;
	}, inc);
	var ready = new Audio("sounds/readysetgo.mp3");
	ready.play();
	setTimeout(() => {
		clearInterval(id);
		three.visible = false;
		two.visible = true;
		circle.scale.x = 0.1;
		circle.scale.y = 0.1;
		id = setInterval(() => {
			circle.scale.x *= scale;
			circle.scale.y *= scale;
			two.scale.x *= scale;
			two.scale.y *= scale;
		}, inc);
		setTimeout(() => {
			clearInterval(id);
			two.visible = false;
			one.visible = true;
			circle.scale.x = 0.1;
			circle.scale.y = 0.1;
			id = setInterval(() => {
				circle.scale.x *= scale;
				circle.scale.y *= scale;
				one.scale.x *= scale;
				one.scale.y *= scale;
			}, inc);
			setTimeout(() => {
				clearInterval(id);
				one.visible = false;
				go.visible = true;
				circle.scale.x = 0.1;
				circle.scale.y = 0.1;
				id = setInterval(() => {
					circle.scale.x *= 1.023;
					circle.scale.y *= 1.023;
					go.scale.x *= 1.023;
					go.scale.y *= 1.023;
				}, inc);
				setTimeout(() => {
					clearInterval(id);
					readyScreen.visible = false;
					gameScreen.visible = true;
					loadGame();
				}, duration + 230);
			}, duration);
		}, duration);
	}, duration);
}
