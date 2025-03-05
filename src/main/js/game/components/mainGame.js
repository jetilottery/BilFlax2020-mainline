define(require => {
    const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
    const displayList = require("skbJet/componentManchester/standardIW/displayList");
    const meterData = require("skbJet/componentManchester/standardIW/meterData");
	const config = require("skbJet/componentManchester/standardIW/gameConfig");

	const MainGameTile = require("./MainGameTile");
    const audio = require("skbJet/componentManchester/standardIW/audio");

	require("com/gsap/TweenMax");
	const Tween = window.TweenMax;

    let tiles;
    let numbers;
	let _started = false;

    function init() {
        tiles = [
            MainGameTile.fromContainer(displayList["MainGameScratchFoil1"]),
            MainGameTile.fromContainer(displayList["MainGameScratchFoil2"]),
            MainGameTile.fromContainer(displayList["MainGameScratchFoil3"]),
            MainGameTile.fromContainer(displayList["MainGameScratchFoil4"]),
            MainGameTile.fromContainer(displayList["MainGameScratchFoil5"]),
            MainGameTile.fromContainer(displayList["MainGameScratchFoil6"]),
            MainGameTile.fromContainer(displayList["MainGameScratchFoil7"]),
            MainGameTile.fromContainer(displayList["MainGameScratchFoil8"]),
            MainGameTile.fromContainer(displayList["MainGameScratchFoil9"])
        ];
		window.mainGameTiles = tiles; //DEBUG
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
            tile.populate(nextData.value, nextData.nonCash);
            // Enable the tile and wait for it to be revealed (manually or automatically)
            await tile.enable();
            // Play the Winning Number reveal audio
            audio.playSequential("playerNumber");
            // Wait for the uncover animation (if animated)
            await tile.scratch();
            msgBus.publish("Game.mainGameTile", nextData);

			window.lastTile = tile;
            let matching = 0;
            tiles.forEach(function check(t){
                if(t._revealed && t.value === tile.value) {
                    matching++;
                }
            });
			window.lastMatching = matching;
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
					if(tile.nonCash) {
						//Merch win. Let's just hack the flag onto meterdata
						meterData.nonCash = true;
					}
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
		meterData.nonCash = false;
    }

    function checkMatch() {
        //noop
    }
    msgBus.subscribe("Game.mainGameTile", checkMatch);

    return {
        init,
        populate,
        enable,
        setActive,
        revealAll,
        reset,
		get started() {
			return _started;
		},
		get tiles() {
			return tiles;
		}
    };
});
