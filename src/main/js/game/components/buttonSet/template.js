define(function(require) {
	var msgBus = require("skbJet/component/gameMsgBus/GameMsgBus");
	var layoutEngine = require("skbJet/componentManchester/standardIW/layout/engine");
	var layout = require("skbJet/componentManchester/standardIW/layout");
	var orientation = require("skbJet/componentManchester/standardIW/orientation");
	var isMobileOrTablet = require("skbJet/componentLondon/utils/isMobileOrTablet");
	var buttonSetLayout = require("game/components/buttonSet/layout");
    var buttonSetComponent = require("game/components/buttonSet/component");
 
	layout.register(buttonSetLayout);

    return function buttonSetTemplate() {
        var displayList = layoutEngine.createFromTree(
            buttonSetLayout._BASE_PANEL,
            null,
			layout.layouts,
            isMobileOrTablet ? "portrait" : orientation.get()
        );

		function updateLayout() {
			layoutEngine.update(
				buttonSetLayout._BASE_PANEL,
				layout.layouts,
				isMobileOrTablet ? "portrait" : orientation.get()
			);
		}

		msgBus.subscribe("GameSize.OrientationChange", updateLayout);
        
        buttonSetComponent({
            background: displayList.buttonSet,
            audioOnButton: displayList.audioOnButton,
            audioOffButton: displayList.audioOffButton,
            infoButton: displayList.infoButton,
            buyButton: displayList.buyButton,
            tryButton: displayList.tryButton,
            leftButton: displayList.leftButton,
            rightButton: displayList.rightButton,
            backButton: displayList.backButton,
            dialogueOverlay: displayList.dialogueOverlay,
            scratchAllButton: displayList.scratchAllButton,
            scratchAllDialogue: displayList.scratchAllDialogue,
            scratchAllConfirmButton: displayList.scratchAllConfirmButton,
            scratchAllCancelButton: displayList.scratchAllCancelButton,
            hintButton: displayList.hintButton,
            playAgainButton: displayList.playAgainButton,
            gamePips: displayList.gamePips,
            pip1: displayList.pip1,
            pip2: displayList.pip2,
            pip3: displayList.pip3,
            pip4: displayList.pip4
        });

        return displayList.buttonSet;
    };
});
