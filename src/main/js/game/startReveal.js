define(function(require) {
	const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
	const gameFlow = require("skbJet/componentManchester/standardIW/gameFlow");

	const ScratchSymbol = require("game/components/ScratchSymbol");
	const mainGame = require("game/components/mainGame");
	const bonusGame = require("game/components/bonusGame");
	const revealAll = require("game/revealAll");
	const SKBeInstant = require("skbJet/component/SKBeInstant/SKBeInstant");
	const resources = require("skbJet/component/resourceLoader/resourceLib");
	const displayList = require("skbJet/componentManchester/standardIW/displayList");
	const meterData = require('skbJet/componentManchester/standardIW/meterData');
	const config = require("skbJet/componentManchester/standardIW/gameConfig");
	const gameController = require("game/gameController");

	require("com/gsap/TimelineLite");
	require("com/gsap/TweenMax");
	//const Timeline = window.TimelineLite;
	const Tween = window.TweenMax;

	function intro() {
		gameController.transitionIntro(() => {
			displayList.brushButton.interactive = true;
			mainGame.setActive(true);
			ScratchSymbol.enableIdle();
			msgBus.publish("UI.updateButtons", {
				audioOn: {visible: true, enabled: true},
				audioOff: {visible: true, enabled: true},
				info: {visible: true, enabled: true},
				scratchAll: {visible: true, enabled: true},
				buy: false,
				try: false,
				left: false,
				right: false,
				back: false,
				hint: false,
				scratchAllConfirm: false,
				scratchAllCancel: false,
				playAgain: false,
				gamePips: false
			});
			gameController.transitionGame();
		}, SKBeInstant.config.gameType === "ticketReady");
	}
	msgBus.subscribe("Game.Intro", intro);

	async function startReveal() {
		// Listen for autoplay activation which triggers the remaining cards to reveal automatically
		msgBus.subscribe("Game.AutoPlayStart", revealAll.start);

		// Listen for autoplay deactivation which cancels the revealAll timeline
		msgBus.subscribe("Game.AutoPlayStop", revealAll.stop);

		msgBus.publish("Game.Intro");

		// Enable all of the winning numbers and player numbers, wait until they are all revealed
		await Promise.all([...mainGame.enable(), ...bonusGame.enable()]);
		/*if(autoPlay.enabled && gameConfig.autoPlaySingleSound) {
			msgBus.publish("singlePrizeReveal.reveal", revealAll);
			await singlePrizeReveal.complete;
		}*/

		ScratchSymbol.disableIdle();

		msgBus.publish("UI.updateButtons", {
			audioOn: {visible: true, enabled: true},
			audioOff: {visible: true, enabled: true},
			info: {visible: true, enabled: true},
			back: {enabled: false},
			scratchAll: {enabled: false}
		});
		displayList.brushButton.interactive = false;
		Tween.to(displayList.brushButton, 0.25, {alpha: 0});


		if(config.mockData) {
			meterData.win = meterData.totalWin;
		}

		gameFlow.next("REVEAL_COMPLETE");
	}

	msgBus.subscribe("MeterData.Balance", (data) => {
		displayList.balanceMeterNT.text = resources.i18n.game.Game.balanceMeter + SKBeInstant.formatCurrency(data).formattedAmount;
	});

	gameFlow.handle(startReveal, "START_REVEAL");
});
