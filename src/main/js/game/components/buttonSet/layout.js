define({
    _BASE_PANEL: {
        children: ["buttonSet"]
    },

    /*
    * UI Panel
    */
    buttonSet: {
        type:           "container",
        landscape:      { x: 0, y: 510 },
        portrait:       { x: 0, y: 1500 },
        children: [
            "audioOnButton",
            "audioOffButton",
            "infoButton",
            "gamePips",
            "leftButton",
            "rightButton",
			"hintButton",
            "backButton",
            "scratchAllButton",
            "dialogueOverlay",
            "scratchAllDialogue",
            "playAgainButton",
            "buyButton",
            "tryButton"
        ]
    },
    audioOnButton: {
        type:           "button",
        landscape:      {x: 28, y: 7, scale: 0.64},
        portrait:       { x: 66, y: -140 },
        textures: {
            enabled:    "soundOnIconUp",
            over:       "soundOnIconOver",
            pressed:    "soundOnIconDown",
            disabled:   "soundOnIconDisabled"
        }
    },
    audioOffButton: {
        type:           "button",
        landscape:      {x: 28, y: 7, scale: 0.64 },
        portrait:       { x: 66, y: -140 },
        textures: {
            enabled:    "soundOffIconUp",
            over:       "soundOffIconOver",
            pressed:    "soundOffIconDown",
            disabled:   "soundOffIconDisabled"
        }
    },
    infoButton: {
        type:           "button",
        landscape:      { x: 80, y: 7, scale: 0.64 },
        portrait:       { x: 172, y: -56 },
        textures: {
            enabled:    "infoUp",
            over:       "infoOver",
            pressed:    "infoDown",
            disabled:   "infoDisabled"
        }
    },
    buyButton: {
        type:           "button",
        landscape:      { x: 400, y: 2, scale: 0.66 },
        portrait:       { x: 450, y: 2 },
        string:         "button_buy",
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
    },
    tryButton: {
        type:           "button",
        landscape:      { x: 400, y: 2, scale: 0.66 },
        portrait:       { x: 450, y: 2 },
        string:         "button_try",
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
    },
    gamePips: {
        type:           "container",
        children:       ["pip1", "pip2", "pip3", "pip4"]
    },
        pip1: {
            type:           "sprite",
            anchor:         0.5,
            landscape:      { x: -100, y: 46 },
            portrait:       { x: 294, y: 46 },
            texture:        "pipUnselected"
        },
        pip2: {
            type:           "sprite",
            anchor:         0.5,
            landscape:      { x: -100, y: 46 },
            portrait:       { x: 312, y: 46 },
            texture:        "pipUnselected"
        },
        pip3: {
            type:           "sprite",
            anchor:         0.5,
            landscape:      { x: -100, y: 46 },
            portrait:       { x: 330, y: 46 },
            texture:        "pipUnselected"
        },
        pip4: {
            type:           "sprite",
            anchor:         0.5,
            landscape:      { x: -100, y: 46 },
            portrait:       { x: 348, y: 46 },
            texture:        "pipUnselected"
        },
    leftButton: {
        type:           "button",
        landscape:      { x: -100, y: 90 },
        portrait:       { x: 276, y: 90 },
        textures: {
            enabled:    "leftButtonUp",
            over:       "leftButtonOver",
            pressed:    "leftButtonDown",
            disabled:   "leftButtonDisabled"
        }
    },
    rightButton: {
        type:           "button",
        landscape:      { x: -100, y: 90 },
        portrait:       { x: 362, y: 90 },
        textures: {
            enabled:    "rightButtonUp",
            over:       "rightButtonOver",
            pressed:    "rightButtonDown",
            disabled:   "rightButtonDisabled"
        }
    },
    backButton: {
        type:           "button",
        landscape:      { x: 500, y: 2, scale: 0.66, visible: false },
        portrait:       { x: 450, y: 2 },
        string:         "button_back",
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
    },
    hintButton: {
        type:           "button",
        landscape:      { x: 720, y: 2, scale: 0.66, visible: false },
        portrait:       { x: 450, y: 2 },
        string:         "button_hint",
        textures: {
            enabled:    "buttonBaseSmallUp",
            over:       "buttonBaseSmallOver",
            pressed:    "buttonBaseSmallDown",
            disabled:   "buttonBaseSmallDisabled"
        },
        style: {
            enabled:    "mainButtonEnabled",
            over:       "mainButtonOver",
            pressed:    "mainButtonPressed",
            disabled:   "mainButtonDisabled"
        }
    },
    scratchAllButton: {
        type:           "button",
        landscape:      { x: 400, y: 2, scale: 0.66 },
        portrait:       { x: 450, y: 2 },
        string:         "button_scratchAll",
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
    },
    dialogueOverlay: {
        type:           "rectangle",
        fillAlpha: 0.5,
        fill: 0x000000,
        anchor: 0,
        alpha: 0,
        x: 0,
        landscape: {
            width: 800,
            height: 600,
            y: -518,
        },
        portrait: {
            width: 640,
            height: 1136,
            y: -900,
        }
    },
    scratchAllDialogue: {
        type:           "sprite",
        texture:        "promptBase",
        landscape:  { x: 400, y: -410 },
        portrait:   { x: 450, y: -588 },
        anchor:     { x: 0.5, y: 0 },
        children: [
            "scratchAllMessage",
            "scratchAllConfirmButton",
            "scratchAllCancelButton"
        ]
    },
        scratchAllMessage: {
            type: "text",
            style: "message",
            string: "scratchAllMessage",
            anchor:     { x: 0.5, y: 0 },
            x: 0,
            y: 66,
            wordWrap: true,
            wordWrapWidth: 514
        },
        scratchAllConfirmButton: {
            type:           "button",
            x: -103,
            y: 334,
            string:         "button_yes",
            landscape: {
                scale: 0.66
            },
            textures: {
                enabled:    "buttonBaseSmallUp",
                over:       "buttonBaseSmallOver",
                pressed:    "buttonBaseSmallDown",
                disabled:   "buttonBaseSmallDisabled"
            },
            style: {
                enabled:    "mainButtonEnabled",
                over:       "mainButtonOver",
                pressed:    "mainButtonPressed",
                disabled:   "mainButtonDisabled"
            }
        },
        scratchAllCancelButton: {
            type:           "button",
            x: 103,
            y: 334,
            string:         "button_no",
            landscape: {
                scale: 0.66
            },
            textures: {
                enabled:    "buttonBaseSmallUp",
                over:       "buttonBaseSmallOver",
                pressed:    "buttonBaseSmallDown",
                disabled:   "buttonBaseSmallDisabled"
            },
            style: {
                enabled:    "mainButtonEnabled",
                over:       "mainButtonOver",
                pressed:    "mainButtonPressed",
                disabled:   "mainButtonDisabled"
            }
        },
    playAgainButton: {
        type:           "button",
        landscape:      { x: 400, y: 2, scale: 0.66 },
        portrait:       { x: 450, y: 2 },
        string:         "button_playAgain",
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
    }
});
