define((require) => {
	// gameController.js
	// Controller functions for transitioning between the buy screen, selection page, intro and game
	// Also sets up the spine animation layout (fixLater) and orientation changes. This is not a good module

	const app = require("skbJet/componentManchester/standardIW/app");
	const layout = require("skbJet/componentManchester/standardIW/layout");
	const config = require("skbJet/componentManchester/standardIW/gameConfig");
	const audio = require("skbJet/componentManchester/standardIW/audio");
	const textStyles = require("skbJet/componentManchester/standardIW/textStyles");
	const gameSize = require("skbJet/componentManchester/standardIW/gameSize");
	const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
	const displayList = require("skbJet/componentManchester/standardIW/displayList");

	const layoutEngine = require("skbJet/componentManchester/standardIW/layout/engine");
	const orientation = require("skbJet/componentManchester/standardIW/orientation");
	const isMobileOrTablet = require("skbJet/componentLondon/utils/isMobileOrTablet");

	const templateLayout = require("game/template/layout");
	const templateConfig = require("game/template/config");
	const templateAudioMap = require("game/template/audioMap");
	const templateTextStyles = require("game/template/textStyles");
	const gameConfig = require("game/custom/config");
	const gameAudioMap = require("game/custom/audioMap");
	const gameLayout = require("game/custom/layout");
	const gameTextStyles = require("game/custom/textStyles");

	const dimensions = require("game/template/dimensions");
	const windowSize = require('skbJet/component/deviceCompatibility/windowSize');

	const spineHelper = require("game/spineHelper");
	const mainGame = require("game/components/mainGame");
	const bonusGame = require("game/components/bonusGame");
	const nokFormat = require("skbJet/componentLondon/utils/nokFormat");
	const meterData = require("skbJet/componentManchester/standardIW/meterData");

	const ScratchSymbol = require("game/components/ScratchSymbol");

	require("com/gsap/TweenMax");
	const Tween = window.TweenMax;

	//Scaling margins
	const SCALEGUTTER_OUT = 50;
	const SCALEGUTTER_IN = 60;

	// Register template configs and game overrides
	layout.register(templateLayout, gameLayout);
	audio.register(templateAudioMap, gameAudioMap);
	config.register(templateConfig, gameConfig);
	textStyles.register(templateTextStyles, gameTextStyles);

	// Set game size for portrait and landscape
	gameSize.set(dimensions);

	let _bonusVisible = false;

	// We have some custom resize code that has to fire *after* the event listener in gameSize. The listener is added in gameInit to ensure this.
	function resize(buttonSetY, balanceY, logoBoneY) {
		let winW = windowSize.getDeviceWidth();
		let winH = windowSize.getDeviceHeight();
		if(winH > winW) {
			let ratio = window.innerWidth / app.renderer.width;
			let sH = Math.min(app.renderer.height * ratio, window.innerHeight + SCALEGUTTER_OUT);
			let margin = (window.innerHeight - sH) / 2;

			app.view.style.height = String(sH) + "px";
			app.view.style.width = String(window.innerWidth) + "px";
			app.view.style.marginLeft = "0px";
			app.view.style.marginTop = String(margin) + "px";

			let sR = (app.view.height - margin - margin) / parseInt(app.view.style.height);
			let scaledMargin = Math.min(margin * sR, 0);
			if(scaledMargin < -SCALEGUTTER_IN) {
				displayList.buttonSet.y = buttonSetY + scaledMargin + SCALEGUTTER_IN;
				displayList.balanceMeterNT.y = balanceY - scaledMargin - SCALEGUTTER_IN;
				spineHelper.findSlot("logoFlaxWhite").bone.y = logoBoneY + scaledMargin + SCALEGUTTER_IN;	
			} else {
				displayList.buttonSet.y = buttonSetY;
				displayList.balanceMeterNT.y = balanceY;
				spineHelper.findSlot("logoFlaxWhite").bone.y = logoBoneY;
			}
		} else {
			app.view.style.width = String(window.innerWidth) + "px";
			app.view.style.height = String(window.innerHeight) + "px";
			app.view.style.marginTop = "0px";
			app.view.style.marginLeft = "0px";
		}
		//HACK: On the EM portal the game tries to downscale itself instead of leaving us to do it. Undo all its bad changes here.
		document.body.style.width = window.innerWidth + "px";
		document.body.style.height = window.innerHeight + "px";
		document.body.style.backgroundColor = "#000";
		document.body.style.overflow = "hidden";
		document.getElementById("game").style.transform = "";
		
		let bugDiv = document.getElementById("bugDiv");
		if(bugDiv !== null) {
			bugDiv.parentElement.removeChild(bugDiv);
		}
	}

	function updateLayout() {
		layoutEngine.update(
			templateLayout._BASE_APP,
			layout.layouts,
			isMobileOrTablet ? "portrait" : orientation.get()
		);
	}

	function init() {
		//create intro, layout and UI Spines
		let ori = isMobileOrTablet ? "portrait" : orientation.get();
		if(ori == "landscape") {
			spineHelper.addSpine("BilFlaxLandscapeSpineSetUpCarIntro", "main");
			spineHelper.addSpine("BilFlaxLandscapeSpineSetUpBonusGameOpen", "bonusOpen");
			spineHelper.addSpine("BilFlaxLandscapeSpineSetUpBonusGamePlayed", "bonusPlayed");
			spineHelper.addSpine("BilFlaxLandscapeFade", "popUpOverlay", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxLandscapeSpineSetUpFlare01", "flare1", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxLandscapeSpineSetUpFlare02", "flare2", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxLandscapeSpineSetUpFlare03", "flare3", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxLandscapeSpineSetUpCarPopUp", "carPopUp", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxLandscapeSpineSetUpWinPopUp", "winPopUp", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxLandscapeSpineSetUpLosePopUp", "losePopUp", "resultPlaquesContainer");
			ScratchSymbol.maskMap = [false,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,false,false];
		} else {
			spineHelper.addSpine("BilFlaxPortraitSpineSetUpCarIntro", "main");
			spineHelper.addSpine("BilFlaxPortraitSpineSetUpBonusGameOpen", "bonusOpen");
			spineHelper.addSpine("BilFlaxPortraitSpineSetUpBonusGamePlayed", "bonusPlayed");
			spineHelper.addSpine("BilFlaxPortraitFade", "popUpOverlay", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxPortraitSpineSetUpFlare01", "flare1", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxPortraitSpineSetUpFlare02", "flare2", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxPortraitSpineSetUpFlare03", "flare3", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxPortraitSpineSetUpCarPopUp", "carPopUp", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxPortraitSpineSetUpWinPopUp", "winPopUp", "resultPlaquesContainer");
			spineHelper.addSpine("BilFlaxPortraitSpineSetUpLosePopUp", "losePopUp", "resultPlaquesContainer");
			ScratchSymbol.maskMap = [false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false];
		}

		spineHelper.setSkin(["imagesColour1", "imagesColour2"][Math.random() > 0.5 ? 0 : 1], ["main", "bonusOpen"]);

		//add dynamic text to relevant spines
		//				slot			style			string
		spineHelper.addTextSprite("PriceText", (ori === "portrait" ? "ticketPriceStyle" : "ticketPriceStyleSmall"), "ticketCost");
		spineHelper.addBitmapTextSprite("prizeValueText", "prizeRP");

		//Add buttons and listeners
		spineHelper.addButton("buttonResults", {
			string:         "button_viewResult",
			textures: {
				enabled:    "buttonBaseUp",
				over:       "buttonBaseOver",
				pressed:    "buttonBaseDown",
				disabled:   "buttonBaseDisabled"
			},
			style: {
				enabled:    "mainButtonEnabled",
				over:       "mainButtonOver",
				pressed:    "mainButtonPressed",
				disabled:   "mainButtonDisabled"
			}
		});
		displayList["buttonResults_button"].on("press", function onPress() {
			if(!isMobileOrTablet) {
				msgBus.publish("UI.updateButtons", {
					audioOn: {visible: true, enabled: true},
					audioOff: {visible: true, enabled: true},
					info: {visible: true, enabled: true},
					left: {visible: false, enabled: false},
					right: {visible: false, enabled: false},
					hint: {visible: false, enabled: false},
					back: {visible: false, enabled: false},
					scratchAll: {visible: false, enabled: false},
					gamePips: {visible: false},
					buy: {visible: false, enabled: false},
					try: {visible: false, enabled: false},
					playAgain: {visible: true, enabled: true}
				});
			} else {
				msgBus.publish("UI.updateButtons", {
					audioOn: {visible: true, enabled: true},
					audioOff: {visible: true, enabled: true},
					info: {visible: true, enabled: true},
					left: {visible: true, enabled: true},
					right: {visible: true, enabled: true},
					hint: {visible: false, enabled: false},
					back: {visible: false, enabled: false},
					scratchAll: {visible: false, enabled: false},
					gamePips: {visible: false},
					buy: {visible: false, enabled: false},
					try: {visible: false, enabled: false},
					playAgain: {visible: true, enabled: true}
				});
			}
			msgBus.publish("Game.viewResult");

			displayList["buttonResults_button"].interactive = false;
			displayList["buttonOk_button"].interactive = false;
			Tween.fromTo(displayList.resultPlaquesContainer, 0.5, {alpha: 1}, {alpha: 0, visible: 0});
			spineHelper.hideSlot("fade", 0.5);
		});

		spineHelper.addButton("buttonOk", {
			string:         "button_ok",
			textures: {
				enabled:    "buttonBaseUp",
				over:       "buttonBaseOver",
				pressed:    "buttonBaseDown",
				disabled:   "buttonBaseDisabled"
			},
			style: {
				enabled:    "mainButtonEnabled",
				over:       "mainButtonOver",
				pressed:    "mainButtonPressed",
				disabled:   "mainButtonDisabled"
			}
		});
		displayList["buttonOk_button"].on("press", function onPress() {
			displayList["buttonResults_button"].interactive = false;
			displayList["buttonOk_button"].interactive = false;
			msgBus.publish("UI.updateButtons", {
				audioOn: {visible: true, enabled: true},
				audioOff: {visible: true, enabled: true},
				info: {visible: true, enabled: true},
				left: {visible: false, enabled: false},
				right: {visible: false, enabled: false},
				back: {visible: false, enabled: false},
				hint: {visible: false, enabled: false},
				scratchAll: {visible: false, enabled: false},
				playAgain: {visible: false, enabled: false},
				buy: {visible: false, enabled: false},
				try: {visible: false, enabled: false}
			});

			Tween.fromTo(displayList.resultPlaquesContainer, 0.5, {alpha: 1}, {alpha: 0, visible: 0, onComplete: function (){
				msgBus.publish("Game.Finish");
			}});
			spineHelper.hideSlot("fade", 0.5);
		});
		displayList["buttonResults_button"].interactive = false;
		displayList["buttonOk_button"].interactive = false;
		msgBus.subscribe("Game.ShowResult", showPlaque);

		spineHelper.findSlot("BonusFade").currentSprite.interactive = true;
		spineHelper.findSlot("BonusFade").currentSprite.on("pointerdown", (e) => {
			e.stopPropagation();
		});
		
		spineHelper.findSlot("fade").currentSprite.interactive = true;
		spineHelper.findSlot("fade").currentSprite.on("pointerdown", (e) => {
			e.stopPropagation();
		});

		let slot = spineHelper.findSlot("ButtonClose");
		slot.currentSprite.interactive = true;
		slot.currentSprite.on("pointerdown", (event) => {
			if(event.data.pointerType === 'mouse' && event.data.button !== 0) {
				return; //left clicks only
			}
			if(_bonusVisible) {
				hideBonus();
			}
		});
		slot = spineHelper.findSlot("bonusPanelClosed");
		slot.currentSprite.interactive = true;
		slot.currentSprite.on("pointerdown", (event) => {
			if(event.data.pointerType === 'mouse' && event.data.button !== 0) {
				return; //left clicks only
			}
			if(!_bonusVisible) {
				showBonus();
			}
		});

		//add tile slots to displayList
		spineHelper.slotToContainer("MainGameScratchFoil1");
		spineHelper.slotToContainer("MainGameScratchFoil2");
		spineHelper.slotToContainer("MainGameScratchFoil3");
		spineHelper.slotToContainer("MainGameScratchFoil4");
		spineHelper.slotToContainer("MainGameScratchFoil5");
		spineHelper.slotToContainer("MainGameScratchFoil6");
		spineHelper.slotToContainer("MainGameScratchFoil7");
		spineHelper.slotToContainer("MainGameScratchFoil8");
		spineHelper.slotToContainer("MainGameScratchFoil9");
		spineHelper.slotToContainer("BonusScratchFoil1");
		spineHelper.slotToContainer("BonusScratchFoil2");
		spineHelper.slotToContainer("BonusScratchFoil3");
		spineHelper.slotToContainer("BonusScratchFoil4");
		spineHelper.slotToContainer("BonusScratchFoil5");
		spineHelper.slotToContainer("BonusScratchFoil6");


		//Setup the purchase screen
		transitionPurchase();

		//force orientation checks
		msgBus.subscribe("GameSize.OrientationChange", updateLayout);
		updateLayout();

		const BALANCE_Y = displayList.balanceMeterNT.y.valueOf();
		const BUTTONSET_Y = displayList.buttonSet.y.valueOf();
		const FLAXLOGO_BONE_Y = spineHelper.findSlot("logoFlaxWhite").bone.y.valueOf();
		window.addEventListener("resize", () => { resize(BUTTONSET_Y, BALANCE_Y, FLAXLOGO_BONE_Y); });
		resize(BUTTONSET_Y, BALANCE_Y, FLAXLOGO_BONE_Y);
	}

	function showPlaque() {
		if(_bonusVisible) {
			hideBonus();
		}

		displayList["buttonResults_button"].interactive = true;
		displayList["buttonOk_button"].interactive = true;
		msgBus.publish("UI.updateButtons", {
			audioOn: {enabled: false},
			audioOff: {enabled: false},
			info: {enabled: false},
			left: {enabled: false},
			right: {enabled: false},
			back: {enabled: false},
			hint: {enabled: false},
			scratchAll: {enabled: false},
			playAgain: {enabled: false}
		});
		let formattedWin, win, nonCash;
		if(config.mockData) {
			formattedWin = nokFormat(window.fakeMeterWin);
			win = window.fakeMeterWin;
			nonCash = window.fakeMeterNonCash;
		} else {
			formattedWin = nokFormat(meterData.totalWin);
			win = meterData.totalWin;
			nonCash = meterData.nonCash;
		}

		spineHelper.showSlot("fade", 1);
		if(win === 0) {
			//lose
			spineHelper.moveToSlot("buttonResults_button", "buttonResults", "losePopUp");
			spineHelper.moveToSlot("buttonOk_button", "buttonOk", "losePopUp");
			spineHelper.spines["losePopUp"].state.setAnimation(0, "AnimationPopUp", false);
		} else if(nonCash) {
			//car win
			spineHelper.moveToSlot("buttonResults_button", "buttonResults", "carPopUp");
			spineHelper.moveToSlot("buttonOk_button", "buttonOk", "carPopUp");
			spineHelper.spines["flare1"].state.setAnimation(0, "animationFlare01Intro", false);
			spineHelper.spines["flare1"].state.setAnimation(1, "animationFlare01Spin", true);
			spineHelper.spines["flare2"].state.setAnimation(0, "animationFlare02Intro", false);
			spineHelper.spines["flare2"].state.setAnimation(1, "animationFlare02Spin", true);
			spineHelper.spines["flare3"].state.setAnimation(0, "animationFlare03Intro", false);
			spineHelper.spines["flare3"].state.setAnimation(1, "animationFlare03Spin", true);
			spineHelper.spines["carPopUp"].state.setAnimation(0, "AnimationPopUp", false);
		} else {
			//cash win
			displayList["prizeValueText_dynamicText"].text = formattedWin;

			spineHelper.moveToSlot("buttonResults_button", "buttonResults", "winPopUp");
			spineHelper.moveToSlot("buttonOk_button", "buttonOk", "winPopUp");
			spineHelper.spines["flare1"].state.setAnimation(0, "animationFlare01Intro", false);
			spineHelper.spines["flare1"].state.setAnimation(1, "animationFlare01Spin", true);
			spineHelper.spines["flare3"].state.setAnimation(0, "animationFlare03Intro", false);
			spineHelper.spines["flare3"].state.setAnimation(1, "animationFlare03Spin", true);
			spineHelper.spines["winPopUp"].state.setAnimation(0, "AnimationPopUp", false);
		}
		displayList["buttonResults_button"].interactive = true;
		displayList["buttonOk_button"].interactive = true;
	}

	//Reset the intro animation to wait on the first frame
	function resetIntro() {
		spineHelper.spines["main"].state.setAnimation(0, "animation", false);
		spineHelper.spines["main"].state.apply(spineHelper.spines.main.skeleton);
		spineHelper.spines["main"].state.clearTrack(0);
	}

	//Reset the main layout spine sprites
	function resetPopUps() {
		spineHelper.spines["carPopUp"].state.setAnimation(0, "AnimationPopUp", false);
		spineHelper.spines["carPopUp"].state.apply(spineHelper.spines["carPopUp"].skeleton);
		spineHelper.spines["carPopUp"].state.clearTrack(0);
		spineHelper.spines["winPopUp"].state.setAnimation(0, "AnimationPopUp", false);
		spineHelper.spines["winPopUp"].state.apply(spineHelper.spines["winPopUp"].skeleton);
		spineHelper.spines["winPopUp"].state.clearTrack(0);
		spineHelper.spines["losePopUp"].state.setAnimation(0, "AnimationPopUp", false);
		spineHelper.spines["losePopUp"].state.apply(spineHelper.spines["losePopUp"].skeleton);
		spineHelper.spines["losePopUp"].state.clearTrack(0);
		spineHelper.spines["flare1"].state.setAnimation(0, "animationFlare01Intro", false);
		spineHelper.spines["flare1"].state.setAnimation(1, "animationFlare01Spin", true);
		spineHelper.spines["flare1"].state.apply(spineHelper.spines["flare1"].skeleton);
		spineHelper.spines["flare1"].state.clearTrack(0);
		spineHelper.spines["flare2"].state.setAnimation(0, "animationFlare02Intro", false);
		spineHelper.spines["flare2"].state.setAnimation(1, "animationFlare02Spin", true);
		spineHelper.spines["flare2"].state.apply(spineHelper.spines["flare2"].skeleton);
		spineHelper.spines["flare2"].state.clearTrack(0);
		spineHelper.spines["flare3"].state.setAnimation(0, "animationFlare03Intro", false);
		spineHelper.spines["flare3"].state.setAnimation(1, "animationFlare03Spin", true);
		spineHelper.spines["flare3"].state.apply(spineHelper.spines["flare3"].skeleton);
		spineHelper.spines["flare3"].state.clearTrack(0);
		spineHelper.hideSlot("fade");
		displayList.resultPlaquesContainer.alpha = 1;
		displayList.resultPlaquesContainer.visible = true;
	}

	function showBonus() {
		_bonusVisible = true;
		mainGame.setActive(false);
		if(bonusGame.scratchedOnce) {
			spineHelper.hideSlot("BonusGameBaseResultsLose1", 0.5);
			spineHelper.hideSlot("BonusGameBaseResultsLose2", 0.5);
			spineHelper.hideSlot("BonusGameBaseResultsLose3", 0.5);
			spineHelper.hideSlot("BonusGameBaseResultsLose4", 0.5);
			spineHelper.hideSlot("BonusGameBaseResultsLose5", 0.5);
			spineHelper.hideSlot("BonusGameBaseResultsLose6", 0.5);

			spineHelper.showSlot("bonusTitleClosed", 0.5, 0.5);
			spineHelper.showSlot("skrapHerBonusTextClosed", 0.5, 0.5);
		}
		bonusGame.tiles[0].changeContainer(spineHelper.findSlot("BonusScratchFoil1").currentSprite, 1);
		bonusGame.tiles[1].changeContainer(spineHelper.findSlot("BonusScratchFoil2").currentSprite, 1);
		bonusGame.tiles[2].changeContainer(spineHelper.findSlot("BonusScratchFoil3").currentSprite, 1);
		bonusGame.tiles[3].changeContainer(spineHelper.findSlot("BonusScratchFoil4").currentSprite, 1);
		bonusGame.tiles[4].changeContainer(spineHelper.findSlot("BonusScratchFoil5").currentSprite, 1);
		bonusGame.tiles[5].changeContainer(spineHelper.findSlot("BonusScratchFoil6").currentSprite, 1);

		spineHelper.showSlot("BonusScratchFoil1", 1, 0.5);
		spineHelper.showSlot("BonusScratchFoil2", 1, 0.5);
		spineHelper.showSlot("BonusScratchFoil3", 1, 0.5);
		spineHelper.showSlot("BonusScratchFoil4", 1, 0.5);
		spineHelper.showSlot("BonusScratchFoil5", 1, 0.5);
		spineHelper.showSlot("BonusScratchFoil6", 1, 0.5);
		spineHelper.showSlot("BonusScratchFoil6", 1, 0.5);
		spineHelper.showSlot("BonusDiamondSmall", 1, 0.5);
		spineHelper.showSlot("ButtonClose", 1, 0.5);
		spineHelper.showSlot("BonusFade", 1, 0.5);
		Tween.delayedCall(1.1, bonusGame.setActive, [true]);
	}

	function hideBonus() {
		if(!_bonusVisible) {
			return;
		}
		bonusGame.setActive(false);
		_bonusVisible = false;
		spineHelper.hideSlot("BonusScratchFoil1", 1);
		spineHelper.hideSlot("BonusScratchFoil2", 1);
		spineHelper.hideSlot("BonusScratchFoil3", 1);
		spineHelper.hideSlot("BonusScratchFoil4", 1);
		spineHelper.hideSlot("BonusScratchFoil5", 1);
		spineHelper.hideSlot("BonusScratchFoil6", 1);
		spineHelper.hideSlot("BonusScratchFoil6", 1);
		spineHelper.hideSlot("BonusDiamondSmall", 1);
		spineHelper.hideSlot("ButtonClose", 1);
		spineHelper.hideSlot("BonusFade", 1);
		spineHelper.findSlot("BonusFade").currentSprite.interactive = false;

		if(bonusGame.scratchedOnce) {
			showBonusPreview();
		}
		Tween.delayedCall(1.1, mainGame.setActive, [true]);
	}

	function showBonusPreview() {
		bonusGame.tiles[0].changeContainer(spineHelper.findSlot("BonusGameBaseResultsLose1").currentSprite, 0.55);
		bonusGame.tiles[0].winBorder.scale.set(0.54);
		bonusGame.tiles[1].changeContainer(spineHelper.findSlot("BonusGameBaseResultsLose2").currentSprite, 0.55);
		bonusGame.tiles[1].winBorder.scale.set(0.54);
		bonusGame.tiles[2].changeContainer(spineHelper.findSlot("BonusGameBaseResultsLose3").currentSprite, 0.55);
		bonusGame.tiles[2].winBorder.scale.set(0.54);
		bonusGame.tiles[3].changeContainer(spineHelper.findSlot("BonusGameBaseResultsLose4").currentSprite, 0.55);
		bonusGame.tiles[3].winBorder.scale.set(0.54);
		bonusGame.tiles[4].changeContainer(spineHelper.findSlot("BonusGameBaseResultsLose5").currentSprite, 0.55);
		bonusGame.tiles[4].winBorder.scale.set(0.54);
		bonusGame.tiles[5].changeContainer(spineHelper.findSlot("BonusGameBaseResultsLose6").currentSprite, 0.55);
		bonusGame.tiles[5].winBorder.scale.set(0.54);

		spineHelper.hideSlot("bonusTitleClosed", 0.5, 0.5);
		spineHelper.hideSlot("skrapHerBonusTextClosed", 0.5, 0.5);

		spineHelper.showSlot("BonusGameBaseResultsLose1", 0.5, 1);
		spineHelper.showSlot("BonusGameBaseResultsLose2", 0.5, 1);
		spineHelper.showSlot("BonusGameBaseResultsLose3", 0.5, 1);
		spineHelper.showSlot("BonusGameBaseResultsLose4", 0.5, 1);
		spineHelper.showSlot("BonusGameBaseResultsLose5", 0.5, 1);
		spineHelper.showSlot("BonusGameBaseResultsLose6", 0.5, 1);
	}

	function transitionPurchase() {
		resetIntro();
		resetPopUps();

		spineHelper.showSlot("BackdropDiamond1");
		spineHelper.showSlot("PurchaseGame");
		spineHelper.showSlot("PriceDiamond");
		spineHelper.showSlot("PriceText");
		spineHelper.showSlot("LoaderFlaxLogo");

		spineHelper.hideSlot("BonusScratchFoil1");
		spineHelper.hideSlot("BonusScratchFoil2");
		spineHelper.hideSlot("BonusScratchFoil3");
		spineHelper.hideSlot("BonusScratchFoil4");
		spineHelper.hideSlot("BonusScratchFoil5");
		spineHelper.hideSlot("BonusScratchFoil6");
		spineHelper.hideSlot("BonusScratchFoil6");
		spineHelper.hideSlot("BonusDiamondSmall");
		spineHelper.hideSlot("ButtonClose");
		spineHelper.hideSlot("BonusFade");
		spineHelper.hideSlot("BonusGameBaseResultsLose1");
		spineHelper.hideSlot("BonusGameBaseResultsLose2");
		spineHelper.hideSlot("BonusGameBaseResultsLose3");
		spineHelper.hideSlot("BonusGameBaseResultsLose4");
		spineHelper.hideSlot("BonusGameBaseResultsLose5");
		spineHelper.hideSlot("BonusGameBaseResultsLose6");

		msgBus.publish("UI.updateButtons", {
			audioOn: {visible: true, enabled: true},
			audioOff: {visible: true, enabled: true},
			info: {visible: true, enabled: true}
		});
	}

	function transitionIntro(onComplete, ticketReady) {
		if(ticketReady) {
			msgBus.publish("UI.updateButtons", {
				audioOn: {visible: true, enabled: true},
				audioOff: {visible: true, enabled: true},
				info: {visible: true, enabled: true},
				left: {visible: false, enabled: false},
				right: {visible: false, enabled: false},
				hint: {visible: false, enabled: false},
				back: {visible: false, enabled: false},
				buy: {visible: false, enabled: false},
				try: {visible: false, enabled: false}
			});
		}
		if(typeof onComplete === "function") {
			spineHelper.spines["main"].state.addListener({
				complete: onComplete
			});
		}
		spineHelper.spines.main.state.setAnimation(0, "animation", false);
	}

	function transitionGame() {
		spineHelper.showSlot("GameTitle");
		spineHelper.showSlot("bonusPanelClosed");
		spineHelper.showSlot("bonusTitleClosed");
		spineHelper.showSlot("skrapHerBonusTextClosed");
		spineHelper.showSlot("skrapHerMainGameText");
		spineHelper.showSlot("MainGameScratchFoil1");
		spineHelper.showSlot("MainGameScratchFoil2");
		spineHelper.showSlot("MainGameScratchFoil3");
		spineHelper.showSlot("MainGameScratchFoil4");
		spineHelper.showSlot("MainGameScratchFoil5");
		spineHelper.showSlot("MainGameScratchFoil6");
		spineHelper.showSlot("MainGameScratchFoil7");
		spineHelper.showSlot("MainGameScratchFoil8");
		spineHelper.showSlot("MainGameScratchFoil9");
	}

	//Show/hide help plaque
	msgBus.subscribe("UI.showHelp", () => {
	});

	msgBus.subscribe("UI.hideHelp", () => {
	});

	return {
		init: init,
		transitionPurchase: transitionPurchase,
		transitionIntro: transitionIntro,
		transitionGame: transitionGame,
		showBonus: showBonus,
		hideBonus: hideBonus,
		showBonusPreview: showBonusPreview
	};
});
