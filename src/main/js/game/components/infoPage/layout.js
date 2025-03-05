define({
    _BASE_INFO: {
        children: ["infoBase"]
    },
    infoBase: {
        type: "container",
        children: ["bgInfo", "scrollBar", "titleBar"]
    },

    /*
     * Background
     */
    titleBar: {
        type: "rectangle",
        children: ["titleBarTitle", "infoCloseButton"],
        fillAlpha: 1,
        fill: 0x1f348d,
        landscape: { width: 800 },
        portrait: { width: 900 },
        height: 70
    },
        titleBarTitle: {
            type: "text",
            style: "infoTitle",
            anchor: 0.5,
            landscape: { x: 400 },
            portrait: { x: 450 },
            y: 35,
            string: "infoTitle"
        },
        infoCloseButton: {
            type: "button",
            landscape:      { x: 765 },
            portrait:       { x: 865 },
            y: 35,
            textures: {
                enabled:    "infoClose",
                over:       "infoClose",
                pressed:    "infoClose",
                disabled:   "infoClose"
            }
        },
    scrollBar: {
        type: "rectangle",
        children: ["scrollPosition"],
        fillAlpha: 0.5,
        fill: 0x555555,
        landscape: {
            x: 785,
            width: 15,
            height: 550
        },
        portrait: {
            x: 885,
            width: 15,
            height: 1586,
			visible: false
        },
        y: 70
    },
        scrollPosition: {
            type: "rectangle",
            fillAlpha: 0.7,
            fill: 0xCCCCCC,
            x: 0,
            y: 0,
            width: 15,
            height: 100
        },



	bgInfo: {
        type: "rectangle",
        children: ["bgInfo0", "bgInfo1"],
        fillAlpha: 1,
        fill: 0x0d64a2,
        landscape: {
            width: 800,
            height: 600
        },
        portrait: {
            width: 900,
            height: 1600
        },
        x: 0,
        y: 0
    },

	bgInfo0: {
		type: "sprite",
		texture: "game2Panel",
		anchor: 0.5,
		landscape: { x: 400, y: 300 },
		portrait: { x: 450, y: 590 }
	},

	bgInfo1: {
		type: "container",
		children: ["gameVersion", "helpTitle", "help", "payTableTitle", "payTable", "oddsLabel0", "oddsLabel1", "oddsLabel2"]
	},
		gameVersion: {
			type: "text",
			style: "versionText",
				landscape: {
				x: 0,
				y: 71
			},
			portrait: {
				x: 0,
				y: 71
			},
			maxWidth: 60,
			alpha: 0.3
		},
        helpTitle: {
            type: "container",
            children: ["helpTitleIcon", "helpTitleText"],
            landscape:  { x: 280 },
            portrait:    { x: 345 },
            y: 95
        },
            helpTitleIcon: {
                type: "sprite",
                x: 0,
                y: 0,
                texture: "menu"
            },
            helpTitleText: {
                type: "text",
                style: "infoSubTitle",
                x: 55,
                y: 4,
                string: "helpTitle0"
            },
        help: {
            type: "rectangle",
            children: ["helpTitle0", "help0", "BMW0", "helpTitle1", "help1"],
            fillAlpha: 0.3,
            fill: 0x000000,
            lineWidth: 4,
            lineColor: 0xFFFFFF,
            radius: 6,
            landscape: {
                width: 764,
                height: 750
            },
            portrait: {
                width: 864,
                height: 1400
            },
            x: 18,
            y: 163
        },
            helpTitle0: {
                type: "text",
                style: "helpHeader",
                x: 18,
                y: 24,
                string: "helpTitle0"
            },
			help0: {
				type: "text",
				style: "helpText",
				x: 18,
				y: 88,
				wordWrap: true,
				landscape: {
					string: "help0_landscape",
					wordWrapWidth: 728
				},
				portrait: {
					string: "help0_portrait",
					wordWrapWidth: 828
				}
			},
			BMW0: {
				type: "sprite",
				texture: "BMWPrizeLogo",
				anchor: 0.5,
				landscape: {
					x: 228,
					y: 134,
					scale: 0.35
				},
				portrait: {
					x: 670,
					y: 102,
					scale: 0.5
				}
			},
            helpTitle1: {
                type: "text",
                style: "helpHeader",
                landscape: {
					x: 18,
					y: 496
				},
                portrait: {
					x: 18,
					y: 510
				},
                string: "helpTitle1"
            },
            help1: {
                type: "text",
                style: "helpText",
                wordWrap: true,
                landscape: {
					x: 18,
                    y: 560,
                    wordWrapWidth: 728,
                    string: "help1_landscape"
                },
                portrait: {
					x: 18,
                    y: 580,
                    wordWrapWidth: 828,
                    string: "help1_portrait"
                }
            },
        payTableTitle: {
            type: "container",
            children: ["payTableTitleIcon", "payTableTitleText"],
            landscape:  { x: 270, y: 960},
            portrait:    { x: 335, y: 850}
        },
            payTableTitleIcon: {
                type: "sprite",
                x: 0,
                y: 0,
                texture: "cup"
            },
            payTableTitleText: {
                type: "text",
                style: "infoSubTitle",
                x: 55,
                y: 4,
                string: "payTableTitle"
            },
        payTable: {
            type: "rectangle",
            children: [
                "payTableBar0",
                "payTableBar1",
                "payTableBar2",
                "payTableBar3",
                "payTableVerticalBar",
                "payTableTitle0",
                "payTableTitle1",
                "payTableP0",
				"BMW1",
                "payTableP1",
                "payTableP2",
                "payTableP3",
                "payTableP4",
                "payTableP5",
                "payTableP6",
                "payTableP7",
                "payTableV0",
                "payTableV1",
                "payTableV2",
                "payTableV3",
                "payTableV4",
                "payTableV5",
                "payTableV6",
                "payTableV7"
            ],
            fillAlpha: 0.3,
            fill: 0x000000,
            lineWidth: 4,
            lineColor: 0xFFFFFF,
            radius: 6,
            landscape: {
				x: 99,
                y: 1040,
                width: 764,
                height: 540,
				scale: 0.78
            },
            portrait: {
				x: 118,
                y: 914,
                width: 664,
                height: 540
            }
        },
            payTableBar0: {
                type: "rectangle",
                fillAlpha: 0.3,
                fill: 0x000000,
                x: 0,
                y: 60,
                landscape: { width: 764 },
                portrait: { width: 664 },
                height: 60
            },
            payTableBar1: {
                type: "rectangle",
                fillAlpha: 0.3,
                fill: 0x000000,
                x: 0,
                y: 180,
                landscape: { width: 764 },
                portrait: { width: 664 },
                height: 60
            },
            payTableBar2: {
                type: "rectangle",
                fillAlpha: 0.3,
                fill: 0x000000,
                x: 0,
                y: 300,
                landscape: { width: 764 },
                portrait: { width: 664 },
                height: 60
            },
            payTableBar3: {
                type: "rectangle",
                fillAlpha: 0.3,
                fill: 0x000000,
                x: 0,
                y: 420,
                landscape: { width: 764 },
                portrait: { width: 664 },
                height: 60
            },
            payTableBar4: {
                type: "rectangle",
                fillAlpha: 0.3,
                fill: 0x000000,
                x: 0,
                y: 540,
                landscape: { width: 764 },
                portrait: { width: 664 },
                height: 60
            },
            payTableVerticalBar: {
                type: "rectangle",
                fillAlpha: 0,
                fill: 0x000000,
                landscape: { x: 381 },
                portrait: { x: 301 },
                y: 0,
                width: 4,
                height: 480
            },
            payTableTitle0: {
                type: "text",
                style: "payTableHeader",
                anchor: 0.5,
                landscape: { x: 196 },
                portrait: { x: 194 },
                y: 30,
                string: "payTableHeader0"
            },
            payTableTitle1: {
                type: "text",
                style: "payTableHeader",
                anchor: 0.5,
                landscape: { x: 580 },
                portrait: { x: 496 },
                y: 30,
                string: "payTableHeader1"
            },
			BMW1: {
				type: "sprite",
				texture: "BMWPrizeLogo",
				scale: 0.5,
				anchor: 0.5,
				landscape: { x: 196 },
				portrait: { x: 194 },
				y: 90
			},
            payTableP0: {
                type: "text",
                style: "payTableText0",
                string: "payTableP0",
                anchor: 0.5,
                landscape: { x: 196 },
                portrait: { x: 194 },
                y: 90
            },
            payTableP1: {
                type: "text",
                style: "payTableText1",
                string: "payTableP1",
                anchor: 0.5,
                landscape: { x: 196 },
                portrait: { x: 194 },
                y: 150
            },
            payTableP2: {
                type: "text",
                style: "payTableText0",
                string: "payTableP2",
                anchor: 0.5,
                landscape: { x: 196 },
                portrait: { x: 194 },
                y: 210
            },
            payTableP3: {
                type: "text",
                style: "payTableText1",
                string: "payTableP3",
                anchor: 0.5,
                landscape: { x: 196 },
                portrait: { x: 194 },
                y: 270
            },
            payTableP4: {
                type: "text",
                style: "payTableText0",
                string: "payTableP4",
                anchor: 0.5,
                landscape: { x: 196 },
                portrait: { x: 194 },
                y: 330
            },
            payTableP5: {
                type: "text",
                style: "payTableText1",
                string: "payTableP5",
                anchor: 0.5,
                landscape: { x: 196 },
                portrait: { x: 194 },
                y: 390
            },
            payTableP6: {
                type: "text",
                style: "payTableText0",
                string: "payTableP6",
                anchor: 0.5,
                landscape: { x: 196 },
                portrait: { x: 194 },
                y: 450
            },
			payTableP7: {
				type: "text",
				style: "payTableText0",
				string: "payTableP7",
				anchor: 0.5,
				landscape: { x: 196 },
				portrait: { x: 194 },
				y: 510
			},
            payTableV0: {
                type: "text",
                style: "payTableText0",
                string: "payTableV0",
                anchor: 0.5,
                landscape: { x: 576 },
                portrait: { x: 496 },
                y: 90
            },
            payTableV1: {
                type: "text",
                style: "payTableText1",
                string: "payTableV1",
                anchor: 0.5,
                landscape: { x: 576 },
                portrait: { x: 496 },
                y: 150
            },
            payTableV2: {
                type: "text",
                style: "payTableText0",
                string: "payTableV2",
                anchor: 0.5,
                landscape: { x: 576 },
                portrait: { x: 496 },
                y: 210
            },
            payTableV3: {
                type: "text",
                style: "payTableText1",
                string: "payTableV3",
                anchor: 0.5,
                landscape: { x: 576 },
                portrait: { x: 496 },
                y: 270
            },
            payTableV4: {
                type: "text",
                style: "payTableText0",
                string: "payTableV4",
                anchor: 0.5,
                landscape: { x: 576 },
                portrait: { x: 496 },
                y: 330
            },
            payTableV5: {
                type: "text",
                style: "payTableText1",
                string: "payTableV5",
                anchor: 0.5,
                landscape: { x: 576 },
                portrait: { x: 496 },
                y: 390
            },
            payTableV6: {
                type: "text",
                style: "payTableText0",
                string: "payTableV6",
                anchor: 0.5,
                landscape: { x: 576 },
                portrait: { x: 496 },
                y: 450
            },
			payTableV7: {
				type: "text",
				style: "payTableText0",
				string: "payTableV7",
				anchor: 0.5,
				landscape: { x: 576 },
				portrait: { x: 496 },
				y: 510
			},
        oddsLabel0: {
            type: "text",
            style: "odds",
            string: "odds0",
            anchor: 0.5,
            landscape: { x: 400, y: 1498 },
            portrait: { x: 450, y: 1478 }
        },
        oddsLabel1: {
            type: "text",
            style: "odds",
            string: "odds1",
            anchor: 0.5,
            landscape: { x: 400, y: 1540 },
            portrait: { x: 450, y: 1510 }
        },
        oddsLabel2: {
            type: "text",
            style: "odds",
            string: "odds2",
            anchor: 0.5,
            landscape: { x: 400, y: 1582 },
            portrait: { x: 450, y: 1542 }
        }
});