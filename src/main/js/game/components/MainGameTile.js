define((require) => {
	const FittedText = require("skbJet/componentManchester/standardIW/components/fittedText");
	const TextStyles = require("skbJet/componentManchester/standardIW/textStyles");
	const PIXI = require("com/pixijs/pixi");
	const nokFormat = require("skbJet/componentLondon/utils/nokFormat");
	const utils = require("skbJet/componentManchester/standardIW/layout/utils");
	const displayList = require("skbJet/componentManchester/standardIW/displayList");
	
	require("com/gsap/TweenMax");
	require("com/gsap/TimelineLite");

	const Tween = window.TweenMax;
	//const Timeline = window.TimelineLite;

	//const ScratchSymbol = require("skbJet/componentLondon/customIW/components/ScratchSymbol");
	const ScratchSymbol = require("./ScratchSymbol");

	class MainGameTile extends ScratchSymbol {
		constructor() {
			super(260, 134, {
				background: "MainGameBaseLose",
				win: "MainGameBaseWin",
				lose: "none",
				foil: "MainGameScratchFoil",
				gutter: 50
			});
			this.valueSprite = new FittedText("XXX XXX,-");
			this.valueSprite.anchor.set(0.5);
			this.valueSprite.style = TextStyles.parse("prizeValueNoWin");
			this.resultContainer.addChild(this.valueSprite);

			this.merchSprite = PIXI.Sprite.fromFrame("BMWPrizeLogo");
			this.merchSprite.anchor.set(0.5);
			this.resultContainer.addChild(this.merchSprite);

			this.winBorder = PIXI.Sprite.fromFrame("MainGameBorderWin");
			this.winBorder.anchor.set(0.5);
			this.resultContainer.addChild(this.winBorder);
			this.winBorder.alpha = 0;

			this.winParticles0 = new PIXI.extras.AnimatedSprite(utils.findFrameSequence("explosionParticles/explosion").map(frame => {return PIXI.Texture.fromFrame(frame);}));
			this.winParticles0.loop = false;
			this.winParticles0.alpha = 0;
			this.winParticles0.anchor.set(0.5);

			this.winParticles1 = new PIXI.extras.AnimatedSprite(utils.findFrameSequence("diamondParticles/diamond00").map(frame => {return PIXI.Texture.fromFrame(frame);}));
			this.winParticles1.loop = false;
			this.winParticles1.alpha = 0;
			this.winParticles1.anchor.set(0.5);

			this.idleSprite = new PIXI.extras.AnimatedSprite(utils.findFrameSequence("wipeFrames/wipe").map(frame => {return PIXI.Texture.fromFrame(frame);}));
			this.idleSprite.loop = false;
			this.idleSprite.alpha = 0;
			this.idleSprite.anchor.set(0.5);

			this.reset();
		}

		idle() {
			this.idleSprite.alpha = 1;
			this.idleSprite.onComplete = () => {
				this.idleSprite.alpha = 0;
			};
			this.idleSprite.gotoAndPlay(0);
		}

		populate(value, nonCash) {
			this.value = value;
			if(nonCash) {
				//merch prize
				this.nonCash = true;
				this.valueSprite.visible = false;
				this.merchSprite.visible = true;
			} else {
				this.nonCash = false;
				this.valueSprite.text = nokFormat(value);
				this.valueSprite.visible = true;
				this.merchSprite.visible = false;
			}
		}

		reset() {
			super.reset();
			this.value = -1;
			this.valueSprite.text = "XXX XXX,-";
			this.valueSprite.style = TextStyles.parse("prizeValueNoWin");
			this.win.alpha = 0;
			this.win.visible = 0;
			this.winParticles0.alpha = 0;
			this.winParticles1.alpha = 0;
			this.winBorder.alpha = 0;
			this.scratchedOnce = false;
		}

		match() {
			this.matched = true;
			Tween.fromTo(this.win, 0.25, {alpha: 0, visible: 0}, {alpha: 1, visible: 1});
			this.valueSprite.style = TextStyles.parse("prizeValueWin");
		}

		presentWin() {
			this.winBorder.alpha = 1;

			let pos = this.container.getGlobalPosition();
			this.winParticles0.position.set(pos.x, pos.y);
			this.winParticles1.position.set(pos.x, pos.y);

			this.winParticles0.onComplete = () => {
				this.winParticles0.alpha = 0;
			};
			this.winParticles1.onComplete = () => {
				this.winParticles1.alpha = 0;
				this.reveal(); //The diamonds take a few frames longer than the explosion
			};
			this.winParticles0.alpha = 1;
			this.winParticles0.animationSpeed = 0.5;
			this.winParticles0.gotoAndPlay(0);
			this.winParticles1.alpha = 1;
			this.winParticles1.animationSpeed = 0.5;
			this.winParticles1.gotoAndPlay(0);

			return new Promise(resolve => this.reveal = resolve);
		}

		static fromContainer(main) {
			const tile = new MainGameTile();
			tile.container = main;

			main.addChild(tile.background, tile.resultContainer, tile.foil, tile.idleSprite);

			displayList.particleContainer.addChild(tile.winParticles0);
			displayList.particleContainer.addChild(tile.winParticles1);

			return tile;
		}
	}

	return MainGameTile;
});