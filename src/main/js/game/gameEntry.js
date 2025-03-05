define(function (require) {
	require("polyfill");
	const app = require("skbJet/componentManchester/standardIW/app");
	const layout = require("skbJet/componentManchester/standardIW/layout");
	const gameFlow = require("skbJet/componentManchester/standardIW/gameFlow");
	const documents = require("skbJet/componentManchester/standardIW/documents");
	const scenarioData = require("skbJet/componentManchester/standardIW/scenarioData");

	const prizetableTransform = require("game/prizetableTransform");
	const scenarioTransform = require("game/scenarioTransform");

	// Require IW component templates
	let buttonBar = require("game/components/buttonSet/template");
	let errorPlaque = require("skbJet/componentManchester/standardIW/ui/errorPlaque/template");
	let ticketSelectBar = require("skbJet/componentManchester/standardIW/ui/ticketSelectBar/template");
	let footer = require("skbJet/componentManchester/standardIW/ui/footer/template");
	let networkActivity = require("skbJet/componentLondon/customIW/ui/networkActivity/template");
	let scratchBrush = require("skbJet/componentLondon/customIW/scratchBrush/template");
	
	// Require all game specific components that need initializing
	const gameController = require("game/gameController");
	const mainGame = require("game/components/mainGame");
	const bonusGame = require("game/components/bonusGame");
	let infoPage = require("game/components/infoPage/template");

	// Require game side state handlers.
	require("game/ticketAcquired");
	require("game/startReveal");
	require("game/resultScreen");
	require("game/gameReset");
	require("game/error");
	
	const msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
	const SKBeInstant = require("skbJet/component/SKBeInstant/SKBeInstant");

	function gameInit() {
		// Register a transform function that can be used to turn the prizetable data into structured
		// data representing the prizetables in the paytable document
		documents.registerPrizetableTransform(prizetableTransform);
		// Register a transform function that can be used to turn the scenario string into useable data
		scenarioData.registerTransform(scenarioTransform);

		// Init StandardIW UI templates
		errorPlaque = errorPlaque();
		buttonBar = buttonBar();
		ticketSelectBar = ticketSelectBar();
		footer = footer();
		networkActivity = networkActivity();

		//Initialise game controller
		gameController.init();

		// Inititialize all game components
		mainGame.init();
		bonusGame.init();
		infoPage = infoPage();
		scratchBrush = scratchBrush();

		buttonBar.children.forEach(child => child.alpha = 0);

		// Add everything to the stage
		app.stage.addChild(
			layout.container,
			scratchBrush,
			infoPage,
			errorPlaque,
			networkActivity
		);
		//Add buttonBar to the layout, behind the popups
		layout.container.children.find(child => child.name === "UI").addChild(buttonBar);
		
		msgBus.publish("UI.updateButtons", {
			audioOn: {visible: true, enabled: true},
			audioOff: {visible: true, enabled: true},
			info: {visible: true, enabled: true},
			back: {visible: false, enabled: false},
			buy: {visible: SKBeInstant.config.wagerType === "BUY", enabled: SKBeInstant.config.wagerType === "BUY"},
			try: {visible: SKBeInstant.config.wagerType === "TRY", enabled: SKBeInstant.config.wagerType === "TRY"},
			playAgain: {visible: false}
		});
		
		// Once everything is initialized continue to next state
		gameFlow.next();
	}

	gameFlow.handle(gameInit, "GAME_INIT");
});