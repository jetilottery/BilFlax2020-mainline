/* jshint esnext: true */
define(function(require) {
	var gameData = require("skbJet/componentManchester/standardIW/gameData");
	var msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
	var SKBeInstant = require("skbJet/component/SKBeInstant/SKBeInstant");
	var machine = require("skbJet/componentManchester/standardIW/stateMachine/machine");
	var audioController = require("skbJet/componentManchester/standardIW/audio");
	var PIXI = require("com/pixijs/pixi");
	var app = require("skbJet/componentManchester/standardIW/app");
	var isMobileOrTablet = require("skbJet/componentLondon/utils/isMobileOrTablet");
	var autoPlay = require("skbJet/componentManchester/standardIW/autoPlay");
	var config = require("skbJet/componentManchester/standardIW/gameConfig");

	require("com/gsap/TweenMax");

	var Tween = window.TweenMax;

	return function buttonSetComponent(parts) {
		var buttons = {
			audioOn: parts.audioOnButton,
			audioOff: parts.audioOffButton,
			info: parts.infoButton,
			buy: parts.buyButton,
			try: parts.tryButton,
			left: parts.leftButton,
			right: parts.rightButton,
			back: parts.backButton,
			hint: parts.hintButton,
			scratchAll: parts.scratchAllButton,
			scratchAllConfirm: parts.scratchAllConfirmButton,
			scratchAllCancel: parts.scratchAllCancelButton,
			playAgain: parts.playAgainButton,
			gamePips: parts.gamePips
		};

		var gameIndex = 0;
		var gamePips = [parts.pip1, parts.pip2, parts.pip3, parts.pip4];
		var newGameCalled = true;
		var gameFinished = false;

		//Helper functions
		function hide(part) {
			part.enabled = false;
			Tween.to(part, 0.3, {alpha: 0, visible: 0});
		}
		function show(part) {
			Tween.to(part, 0.3, {alpha: 1, visible: 1});
		}

		// Hide everything initially
		buttons.audioOn.visible = false;
		buttons.audioOn.enabled = false;
		buttons.audioOff.visible = false;
		buttons.audioOff.enabled = false;
		buttons.info.visible = false;
		buttons.info.enabled = false;
		buttons.buy.visible = false;
		buttons.buy.enabled = false;
		buttons.try.visible = false;
		buttons.try.enabled = false;
		buttons.left.visible = false;
		buttons.left.enabled = false;
		buttons.right.visible = false;
		buttons.right.enabled = false;
		buttons.back.visible = false;
		buttons.back.enabled = false;
		buttons.hint.visible = false;
		buttons.hint.enabled = false;
		buttons.scratchAll.visible = false;
		buttons.scratchAll.enabled = false;
		buttons.playAgain.visible = false;
		buttons.playAgain.enabled = false;
		buttons.gamePips.visible = false;
		buttons.gamePips.enabled = false;

		function updateGamePips() {
			buttons.left.enabled = false;
			buttons.right.enabled = false;
			buttons.scratchAll.enabled = false;
			buttons.playAgain.enabled = false;
			buttons.hint.enabled = false;
			buttons.back.enabled = false;
			for(var i = 0; i < gamePips.length; i++) {
				if(i === gameIndex) {
					gamePips[i].texture = PIXI.Texture.fromFrame("pipSelected");
				} else {
					gamePips[i].texture = PIXI.Texture.fromFrame("pipUnselected");
				}
			}
		}
		function updateButtons(buttonConf) {
			/*
			 // Time for a horrible hack. This exists because NT has set their TRY mode to be anonymous,
			 // which the standardIW framework can't handle correctly as it sends an updateButtons signal to hide the TRY button when demosB4move2MoneyButton == -1.
			 // The standardIW "modules" are so tightly coupled that I can't just replace the buyScreen.js.
			 */
			var buttonConfCopy = JSON.parse(JSON.stringify(buttonConf));

			if(Object.keys(buttonConfCopy).indexOf("moveToMoney") > -1) {
				return; //disregard any updateButton call that thinks we have a moveToMoney button
			}

			if(!newGameCalled) {
				var prop = ["playAgain"];
				for(var i = 0; i < prop.length; i++) {
					buttonConfCopy[prop[i]] = {enabled: buttons[prop[i]].enabled, visible: buttons[prop[i]].visible};
				}
				buttonConfCopy.buy = {enabled: false, visible: (SKBeInstant.config.wagerType === "BUY" && gameFinished)};
				buttonConfCopy.try = {enabled: false, visible: (SKBeInstant.config.wagerType === "TRY" && gameFinished)};
			}

			Object.keys(buttonConfCopy).forEach(function updateButton(buttonName) {
				// Skip if not a named button
				if (buttons[buttonName] === undefined) {
					return;
				}

				// Update button visibility/enablement
				if(typeof buttonConfCopy[buttonName] === typeof true && buttonConfCopy[buttonName]) {
					show(buttons[buttonName]);
				} else if(typeof buttonConfCopy[buttonName] === typeof {}) {
					if(typeof buttonConfCopy[buttonName].visible !== typeof undefined) {
						if(buttonConfCopy[buttonName].visible) {
							show(buttons[buttonName]);
						} else {
							hide(buttons[buttonName]);
						}
					}
					if(typeof buttonConfCopy[buttonName].enabled !== typeof undefined) {
						buttons[buttonName].enabled = buttonConfCopy[buttonName].enabled;
					}
				} else {
					hide(buttons[buttonName]);
				}
			});
		}
		msgBus.subscribe("UI.updateButtons", updateButtons);

		/* Attach event listeners */

		/*
		 //Scratch All
		 */
		buttons.scratchAll.on("press", function onScratchAllPress() {
			if (audioController.exists("click")) {
				audioController.play("click");
			}
			if(config.skipScratchAllConfirmation) {
				//Just start autoplaying
				autoPlay._enabled = true;
				buttons.scratchAll.enabled = false;
				return;
			}

			if(autoPlay._enabled) {
				autoPlay._enabled = false; //Stop scratching all
				arrangeButtons(gameIndex, "fadeToGame");
				buttons.scratchAll.enabled = true;
				buttons.hint.enabled = true;
				buttons.back.enabled = true;
				buttons.left.enabled = true;
				buttons.right.enabled = true;
			} else {
				//Show confirm dialogue
				buttons.scratchAll.enabled = false;
				buttons.hint.enabled = false;
				buttons.back.enabled = false;
				buttons.left.enabled = false;
				buttons.right.enabled = false;
				Tween.to(parts.dialogueOverlay, 0.3, {alpha: 1, visible: 1});
				Tween.to(parts.scratchAllDialogue, 0.3, {alpha: 1, visible: 1, onComplete: function() {parts.scratchAllDialogue.interactiveChildren = true;}});
			}
		});

		buttons.scratchAllConfirm.on("press", function () {
			autoPlay._enabled = true;
			buttons.scratchAll.enabled = true;
			buttons.hint.enabled = false;
			buttons.back.enabled = false;
			buttons.left.enabled = false;
			buttons.right.enabled = false;
			parts.scratchAllDialogue.interactiveChildren = false;
			Tween.to(parts.dialogueOverlay, 0.3, {alpha: 0, visible: 0});
			Tween.to(parts.scratchAllDialogue, 0.3, {alpha: 0, visible: 0});
		});

		buttons.scratchAllCancel.on("press", function() {
			buttons.scratchAll.enabled = true;
			buttons.hint.enabled = true;
			buttons.back.enabled = true;
			buttons.left.enabled = gameIndex > 0;
			buttons.right.enabled = gameIndex < buttons.gamePips.children.length - 1;
			parts.scratchAllDialogue.interactiveChildren = false;
			Tween.to(parts.dialogueOverlay, 0.3, {alpha: 0, visible: 0});
			Tween.to(parts.scratchAllDialogue, 0.3, {alpha: 0, visible: 0});
		});


		// Block click-through on scratch-all dialogue
		parts.scratchAllDialogue.visible = false;
		parts.scratchAllDialogue.alpha = 0;
		parts.scratchAllDialogue.interactive = true;
		parts.scratchAllDialogue.interactiveChildren = false;
		parts.scratchAllDialogue.on("pointertap",function(event) { event.stopPropagation(); });
		parts.scratchAllDialogue.on("pointerdown",function(event) { event.stopPropagation(); });
		parts.scratchAllDialogue.on("pointerup",function(event) { event.stopPropagation(); });
		parts.scratchAllDialogue.on("pointermove",function(event) { event.stopPropagation(); });

		parts.dialogueOverlay.visible = false;
		parts.dialogueOverlay.alpha = 0;
		parts.dialogueOverlay.interactive = true;
		parts.dialogueOverlay.interactiveChildren = false;
		parts.dialogueOverlay.on("pointertap",function(event) { event.stopPropagation(); });
		parts.dialogueOverlay.on("pointerdown",function(event) { event.stopPropagation(); });
		parts.dialogueOverlay.on("pointerup",function(event) { event.stopPropagation(); });
		parts.dialogueOverlay.on("pointermove",function(event) { event.stopPropagation(); });



		// Audio

		function toggleOn() {
			buttons.audioOff.parent.swapChildren(buttons.audioOff, buttons.audioOn);
			buttons.audioOff.visible = false;
			buttons.audioOn.visible = true;
		}
		msgBus.subscribe("Game.AudioOn", toggleOn);

		function toggleOff() {
			buttons.audioOff.parent.swapChildren(buttons.audioOff, buttons.audioOn);
			buttons.audioOff.visible = true;
			buttons.audioOn.visible = false;
		}
		msgBus.subscribe("Game.AudioOff", toggleOff);

		if(SKBeInstant.config.soundStartDisabled || isMobileOrTablet) {
			toggleOff();
		} else {
			toggleOn();
		}

		buttons.audioOn.on("press", function onPress() {
			audioController.activate(false);
			audioController.disable();
		});
		buttons.audioOff.on("press", function onPress() {
			audioController.activate(true);
			audioController.enable();
		});

		// Info
		buttons.info.on("press", function onHelpOpen() {
			msgBus.publish("UI.toggleHelp");
			autoPlay._enabled = false; //cancel autoplay
			if (audioController.exists("click")) {
				audioController.play("click");
			}
		});

		//Hints (Crossword)
		buttons.hint.on("press", function onPress() {
			msgBus.publish("Game.toggleHints");
			if (audioController.exists("click")) {
				audioController.play("click");
			}
		});

		// Buy/Try
		function onBuyPress() {
			hide(buttons.buy);
			hide(buttons.try);
			buttons.playAgain.visible = false;
			newGameCalled = false;
			gameFinished = false;

			if (audioController.exists("buy")) {
				audioController.play("buy");
			} else if (audioController.exists("click")) {
				audioController.play("click");
			}

			machine.next(gameData.timeoutTriggered ? "TIMEOUT" : "TICKET_REQUEST");
		}
		buttons.buy.on("press", onBuyPress);
		buttons.try.on("press", onBuyPress);

		/*
		 //Left/Right
		 */
		buttons.left.on("press", function onLeftPress() {
			gameIndex = (gameIndex === 0 ? gamePips.length - 1: gameIndex - 1);
			msgBus.publish("Game.Change", {gameIndex: gameIndex, transition: "slideLeft"});
		});
		buttons.right.on("press", function onRightPress() {
			gameIndex = (gameIndex === gamePips.length - 1 ? 0: gameIndex + 1);
			msgBus.publish("Game.Change", {gameIndex: gameIndex, transition: "slideRight"});
		});

		/*
		 //Back
		 */
		buttons.back.on("press", function onBackPress() {
			msgBus.publish("Game.Change", {gameIndex: 99, transition: "fadeToMenu"});
		});

		/*
		 //Button visibility on game changes
		 */
		function onGameReady() {
			buttons.left.enabled = (gameIndex !== 0) && !autoPlay._enabled;
			buttons.right.enabled = (gameIndex !== gamePips.length - 1) && !autoPlay._enabled;
			/*eslint-disable */
			buttons.scratchAll.enabled = !Boolean(Number(buttons.playAgain.visible));
			buttons.playAgain.enabled = !Boolean(Number(buttons.scratchAll.enabled));
			buttons.hint.enabled = !autoPlay._enabled && Boolean(Number(buttons.scratchAll.visible));
			/*eslint-enable */
			buttons.back.enabled = !autoPlay._enabled;
		}
		msgBus.subscribe("UI.GameReady", onGameReady);

		function arrangeButtons(gameIndex, transition) {
			/*eslint-disable */
			if(!autoPlay._enabled && isMobileOrTablet) {
				if(gameIndex === 1 && Boolean(Number(buttons.scratchAll.visible))) {
					Tween.to(buttons.hint, 0.6, {alpha: 1, visible: 1, x: 200});
					Tween.to(buttons.scratchAll, 0.6, {x: 440});
				} else {
					Tween.to(buttons.hint, 0.6, {alpha: 0, visible: 0, x: 320});
					Tween.to(buttons.scratchAll, 0.6, {x: 320});
				}
				buttons.back.visible = buttons.back.enabled = false;
			} else {
				if(autoPlay._enabled || transition === "fadeToMenu") {
					Tween.to(buttons.scratchAll, 0.6, {x: app.renderer.width / 2});
					Tween.to(buttons.playAgain, 0.6, {x: app.renderer.width / 2});
					Tween.to(buttons.hint, 0.6, {alpha: 0, visible: 0, x: app.renderer.width / 2});
					Tween.to(buttons.back, 0.6, {alpha: 0, visible: 0, x: app.renderer.width / 2});
				} else {
					if(gameIndex === 1) {
						if(Boolean(Number(buttons.scratchAll.visible))) {
							Tween.to(buttons.scratchAll, 0.6, {x: (app.renderer.width / 2) - 180});
							Tween.to(buttons.hint, 0.6, {alpha: 1, visible: 1, x: app.renderer.width / 2});
							Tween.to(buttons.back, 0.6, {alpha: 1, visible: 1, x: (app.renderer.width / 2) + 180});
						}  else {
							Tween.to(buttons.playAgain, 0.6, {x: (app.renderer.width / 2) - 100});
							Tween.to(buttons.back, 0.6, {alpha: 1, visible: 1, x: (app.renderer.width / 2) + 100});
						}
					} else {
						Tween.to(buttons.scratchAll, 0.6, {x: (app.renderer.width / 2) - 100});
						Tween.to(buttons.hint, 0.6, {alpha: 0, visible: 0, x: app.renderer.width / 2});
						Tween.to(buttons.playAgain, 0.6, {x: (app.renderer.width / 2) - 100});
						if(gameIndex !== 99) {
							Tween.to(buttons.back, 0.6, {alpha: 1, visible: 1, x: (app.renderer.width / 2) + 100});
						}
					}
				}
			}
			/*eslint-enable */
		}

		function onGameChange(data) {
			gameIndex = data.gameIndex;

			//show/hide hintbutton
			arrangeButtons(data.gameIndex, data.transition);
			updateGamePips();
		}
		msgBus.subscribe("Game.Change", onGameChange);

		if (audioController.exists("revealAll")) {
			msgBus.subscribe("Game.AutoPlayStart", function() {
				audioController.play("revealAll");
			});
		}

		//Alter button when scrathch-all is running
		msgBus.subscribe("Game.AutoPlayStart", function() {
			buttons.scratchAll.children[0].texture = PIXI.Texture.fromFrame("buttonBaseOver");
		});
		msgBus.subscribe("Game.AutoPlayStop", function() {
			buttons.scratchAll.children[0].texture = PIXI.Texture.fromFrame("buttonBaseUp");
		});

		/*
		 //Play again
		 */
		function onPlayAgainPress() {
			if (audioController.exists("click")) {
				audioController.play("click");
			}
			msgBus.publish("Game.Finish");
		}
		buttons.playAgain.on("press", onPlayAgainPress);

		msgBus.subscribe("Game.Finish", function() {
			hide(buttons.gamePips);
			buttons.scratchAll.children[0].texture = PIXI.Texture.fromFrame("buttonBaseUp");
			if(newGameCalled) {
				machine.next();
			}
			gameFinished = true;
		});

		msgBus.subscribe("jLottery.beginNewGame", function() {
			newGameCalled = true;
			if(gameFinished) {
				machine.next();
			}
		});

		msgBus.subscribe("Game.viewResult", function() {
			show(buttons.playAgain);
			buttons.playAgain.enabled = true;
		});
	};
});
