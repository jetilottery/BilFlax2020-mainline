define(require => {
	const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
	const displayList = require("skbJet/componentManchester/standardIW/displayList");
	const meterData = require("skbJet/componentManchester/standardIW/meterData");
	const config = require("skbJet/componentManchester/standardIW/gameConfig");
	const BonusGameTile = require("./BonusGameTile");
	const audio = require("skbJet/componentManchester/standardIW/audio");
	//const gameState = require("game/state/gameState");

	require("com/gsap/TweenMax");
	const Tween = window.TweenMax;

	let tiles;
	let numbers;
	let _started = false;

	function init() {
		tiles = [
			BonusGameTile.fromContainer(displayList["BonusScratchFoil1"]),
			BonusGameTile.fromContainer(displayList["BonusScratchFoil2"]),
			BonusGameTile.fromContainer(displayList["BonusScratchFoil3"]),
			BonusGameTile.fromContainer(displayList["BonusScratchFoil4"]),
			BonusGameTile.fromContainer(displayList["BonusScratchFoil5"]),
			BonusGameTile.fromContainer(displayList["BonusScratchFoil6"])
		];
		window.bonusGameTiles = tiles; //DEBUG
	}

	function populate(data) {
		numbers = data;
	}

	function enable() {
		_started = true;

		// Return an array of promises for each tile's lifecycle
		return tiles.map(async tile => {
			// Get the next Winning Number
			const nextData = numbers.shift();
			// Populate the tile with the next Winning Number, ready to be uncovered
			tile.populate(nextData);
			// Enable the tile and wait for it to be revealed (manually or automatically)
			await tile.enable();
			// Play the Winning Number reveal audio
			audio.playSequential("playerNumber");
			// Wait for the uncover animation (if animated)
			await tile.scratch();
			msgBus.publish("Game.bonusGameTile", nextData);

			let matching = 0;
			tiles.forEach(function check(t){
				if(t._revealed && t.value === tile.value) {
					matching++;
				}
			});
			if(matching >= 3) {
				tiles.forEach(function check(t){
					if(!t.matched && t._revealed && t.value === tile.value) {
						t.match();
						t.presentWin();
						audio.playSequential("match");
					}
				});
				if(!config.mockData) {
					meterData.win += tile.value;
				}
			}
		});
	}

	function setActive(active) {
		tiles.forEach(function(tile) {
			tile.active = active;

			if(!tile._revealed) {
				tile.resultContainer.scale.set(Math.min(0.9, tile.foil.width / tile.valueSprite.width));
			}
		});
	}

	function revealAll() {
		// Get all the tiles yet to be revealed
		const unrevealed = tiles.filter(tile => !tile._revealed);
		// Return an array of tweens that calls reveal on each tile in turn
		return unrevealed.map((tile) => Tween.delayedCall(0, tile.reveal, null, tile).duration(tile.scratchDuration));
	}

	function reset() {
		tiles.forEach(tile => tile.reset());
		_started = false;
	}

	function started() {
		return _started;
	}

	function checkMatch() {
		//noop
	}
	msgBus.subscribe("Game.bonusGameTile", checkMatch);

/*	function updateLayout() {
		let alpha = 0;
		if(gameState.inGame) {
			alpha = 1;
		}

		displayList.bonusGameBG.alpha = alpha;
		displayList.bonusGameTagLine.alpha = alpha;
		displayList.bonusGameTitle.alpha = alpha;
	}
	msgBus.subscribe("GameSize.OrientationChange", updateLayout);
*/
	return {
		init,
		populate,
		enable,
		setActive,
		revealAll,
		reset,
		started,
		get scratchedOnce() {
			for(let i = 0; i < tiles.length; i++) {
				if(tiles[i].scratchedOnce) {
					return true;
				}
			}
			return false;
		},
		get tiles() {
			return tiles;
		}
	};
});
