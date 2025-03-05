define((require) => {
	const scenarioData = require("skbJet/componentManchester/standardIW/scenarioData");
	const config = require("skbJet/componentManchester/standardIW/gameConfig");

	let scenarioCounter = 0;
	let debugData = [{
		scenario: {
			prizes0: [
				{value: 1000000, nonCash: false},
				{value: 100000, nonCash: false},
				{value: 10000, nonCash: true},
				{value: 10000, nonCash: true},
				{value: 10000, nonCash: true},
				{value: 40000, nonCash: false},
				{value: 50000, nonCash: false},
				{value: 60000, nonCash: false},
				{value: 70000, nonCash: false}
			],
			prizes1: [
				100000,
				10000,
				2000,
				3300,
				4000,
				5000
			],
			win: 10000,
			nonCash: true
		}
	}, {
		scenario: {
			prizes0: [
				{value: 1000000},
				{value: 100000},
				{value: 10000},
				{value: 20000},
				{value: 1000000},
				{value: 40000},
				{value: 50000},
				{value: 1000000},
				{value: 70000}
			],
			prizes1: [
				100000,
				2000,
				2000,
				2000,
				4000,
				5000
			],
			win: 1002000
		}
	}, {
		scenario: {
			prizes0: [
				{value: 1000000},
				{value: 100000},
				{value: 10000},
				{value: 20000},
				{value: 30000},
				{value: 40000},
				{value: 50000},
				{value: 60000},
				{value: 70000}
			],
			prizes1: [
				100000,
				2000,
				1000,
				2000,
				4000,
				5000
			],
			win: 0
		}
	}];

	const gameFlow = require("skbJet/componentManchester/standardIW/gameFlow");
	const audio = require("skbJet/componentManchester/standardIW/audio");
	const mainGame = require("game/components/mainGame");
	const bonusGame = require("game/components/bonusGame");

	function ticketAcquired() {
		if(config.mockData) {
			let dd = JSON.parse(JSON.stringify(debugData));
			scenarioCounter %= dd.length;
			mainGame.populate(dd[scenarioCounter].scenario.prizes0);
			bonusGame.populate(dd[scenarioCounter].scenario.prizes1);
			window.fakeMeterWin = dd[scenarioCounter].scenario.win;
			window.fakeMeterNonCash = dd[scenarioCounter].scenario.nonCash;
			scenarioCounter++;
		} else {
			mainGame.populate(scenarioData.scenario.prizes0);
			bonusGame.populate(scenarioData.scenario.prizes1);
		}

		if (!audio.isPlaying("music")) {
			audio.fadeIn("music", 0.5, true);
		}
		
		gameFlow.next("START_REVEAL");
	}

	gameFlow.handle(ticketAcquired, "TICKET_ACQUIRED");
});
