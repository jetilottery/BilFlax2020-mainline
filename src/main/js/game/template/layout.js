define({
	_BASE_APP: {
		children: ["gameContainer", "particleContainer", "UI", "resultPlaquesContainer", "balanceMeterNT"]
	},

	/*
	 * GAME CONTAINERS
	 */
	gameContainer: {
		type: "container",
		portrait: {
			x: 450,
			y: 800
		},
		landscape: {
			x: 400,
			y: 300
		}
	},

	particleContainer: {
		type: "container",
		x: 0,
		y: 0
	},

	resultPlaquesContainer: {
		type: "container",
		portrait: {
			x: 450,
			y: 800
		},
		landscape: {
			x: 400,
			y: 300
		}
	},

	/**
	 * UI COMPONENTS
	 */
	brushButton: {
		type: "button",
		landscape: {
			x: 547,
			y: 37
		},
		portrait: {
			x: 0,
			y: -100
		},
		textures: {
			enabled:    "brushButtonEnabled",
			over:       "brushButtonOver",
			pressed:    "brushButtonPressed",
			disabled:   "brushButtonEnabled"
		},
		children: ["menu", "selected"]
	},
	menu: {
		type: "sprite",
		texture: "brushMenu",
		anchor: {
			x: 0.5,
			y: 0
		},
		x: 0,
		y: -26,
		children: ["coinButton", "keyButton", "wandButton"]
	},
	coinButton: {
		type: "button",
		x: 0,
		y: 69,
		anchor: 0.5,
		textures: {
			enabled:    "brushMenuSelector",
			over:       "brushMenuSelectorOver",
			pressed:    "brushMenuSelectorPressed",
			disabled:   "brushMenuSelector"
		},
		children: ["coin"]
	},
	coin: {
		type: "sprite",
		texture: "coin",
		x: -34,
		y: -20
	},
	keyButton: {
		type: "button",
		x: 0,
		y: 118,
		anchor: 0.5,
		textures: {
			enabled:    "brushMenuSelector",
			over:       "brushMenuSelectorOver",
			pressed:    "brushMenuSelectorPressed",
			disabled:   "brushMenuSelector"
		},
		children: ["key"]
	},
	key: {
		type: "sprite",
		texture: "key",
		x: -34,
		y: -20
	},
	wandButton: {
		type: "button",
		x: 0,
		y: 164,
		anchor: 0.5,
		textures: {
			enabled:    "brushMenuSelectorBottom",
			over:       "brushMenuSelectorBottomOver",
			pressed:    "brushMenuSelectorBottomPressed",
			disabled:   "brushMenuSelectorBottom"
		},
		children: ["wand"]
	},
	wand: {
		type: "sprite",
		texture: "wand",
		x: -34,
		y: -21
	},
	selected: {
		name: "selected",
		type: "sprite",
		x: -15,
		y: -2,
		anchor: 0.5,
		texture: "coin"
	},

	UI: {
		type: "container",
		x: 0,
		y: 0
	},

	/*
	 * BALANCE
	 */
	balanceMeterNT: {
		type: "text",
		style: "balanceMeterStyle",
		string: "",
		anchor: { x: 1, y: 0 },
		landscape: { x: 794, y: 12, maxWidth: 200 },
		portrait: { x: 884, y: 60, maxWidth: 380 }
	},


	/*
	 * ERROR
	 */
	errorContainer: {
		type: "container",
		children: [
			"errorOverlay",
			"errorBackground",
			"errorTitle",
			"errorMessage",
			"errorExit",
			"timeoutExit",
			"timeoutContinue"
		],
	},
	errorOverlay: {
		type: "rectangle",
		fillAlpha: 0.5,
		fill: 0x000000,
		anchor: 0,
		x: 0,
		y: 0,
		landscape: {
			width: 800,
			height: 600,
		},
		portrait: {
			width: 640,
			height: 1136,
		}
	},
	errorBackground: {
		type: "rectangle",
		fill: 0xBBBBBB,
		lineWidth: 2,
		lineColor: 0x000000,
		radius: 4,
		landscape: {
			x: 50,
			y: 80,
			width: 700,
			height: 400
		},
		portrait: {
			x: 30,
			y: 234,
			width: 580,
			height: 700
		}
	},
	errorTitle: {
		type: "text",
		style: "messageText",
		anchor: 0.5,
		x: 0,
		y: -300
	},
	errorMessage: {
		type: "text",
		style: "messageText",
		anchor: 0.5,
		wordWrap: true,
		landscape: { x: 400, y: 260, wordWrapWidth: 650 },
		portrait: { x: 320, y: 528, wordWrapWidth: 500 }
	},
	errorExit: {
		type: "button",
		string: "button_exit",
		landscape: { x: 400, y: 480, scale: 0.8 },
		portrait: { x: 320, y: 934 },
		style: {
			enabled: "mainButtonEnabled",
			over: "mainButtonOver",
			pressed: "mainButtonPressed",
			disabled: "mainButtonDisabled"
		},
		textures: {
			enabled: "buttonBaseUp",
			over: "buttonBaseOver",
			pressed: "buttonBaseDown",
			disabled: "buttonBaseDisabled"
		}
	},
	timeoutExit: {
		type: "button",
		string: "button_exit",
		landscape: { x: 503, y: 480, scale: 0.8 },
		portrait: { x: 450, y: 934 },
		style: {
			enabled: "mainButtonEnabled",
			over: "mainButtonOver",
			pressed: "mainButtonPressed",
			disabled: "mainButtonDisabled"
		},
		textures: {
			enabled: "buttonBaseUp",
			over: "buttonBaseOver",
			pressed: "buttonBaseDown",
			disabled: "buttonBaseDisabled"
		}
	},
	timeoutContinue: {
		type: "button",
		string: "button_continue",
		landscape: { x: 297, y: 480, scale: 0.8 },
		portrait: { x: 190, y: 934 },
		style: {
			enabled: "mainButtonEnabled",
			over: "mainButtonOver",
			pressed: "mainButtonPressed",
			disabled: "mainButtonDisabled"
		},
		textures: {
			enabled: "buttonBaseUp",
			over: "buttonBaseOver",
			pressed: "buttonBaseDown",
			disabled: "buttonBaseDisabled"
		}
	},

	/*
	 * NETWORK / LOADER
	 */
	networkActivity: {
		type: "container",
		children: ["spinner"]
	},
	spinner: {
		type: "sprite",
		landscape: { x: 400, y: 300 },
		portrait: { x: 450, y: 800 },
		anchor: 0.5,
		texture: "networkActivity"
	}
});
