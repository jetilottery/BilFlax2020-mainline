define((require) => {
	const FittedText = require("skbJet/componentManchester/standardIW/components/fittedText");
	const TextStyles = require("skbJet/componentManchester/standardIW/textStyles");
	const PIXI = require("com/pixijs/pixi");
	const nokFormat = require("skbJet/componentLondon/utils/nokFormat");
	const utils = require("skbJet/componentManchester/standardIW/layout/utils");
	const displayList = require("skbJet/componentManchester/standardIW/displayList");
	const ScratchMask = require("./ScratchMask");
	
	require("com/gsap/TweenMax");
	require("com/gsap/TimelineLite");

	const Tween = window.TweenMax;

	//const ScratchSymbol = require("skbJet/componentLondon/customIW/components/ScratchSymbol");
	const ScratchSymbol = require("./ScratchSymbol");

	class BonusGameTile extends ScratchSymbol {
		constructor() {
			super(260, 134, {
				background: "BonusGamebaseLose",
				win: "BonusGamebaseWin",
				lose: "none",
				foil: "BonusScratchFoil",
				gutter: 10
			});
			this.valueSprite = new FittedText("XXX XXX,-");
			this.valueSprite.anchor.set(0.5);
			this.valueSprite.style = TextStyles.parse("bonusPrizeValueNoWin");
			this.resultContainer.addChild(this.valueSprite);

			this.winBorder = PIXI.Sprite.fromFrame("BonusGameborderWin");
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
			this.idleSprite.animationSpeed = 0.5;
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

		populate(value) {
			this.value = value;
			this.valueSprite.text = nokFormat(value);
		}

		reset() {
			super.reset();
			this.value = -1;
			this.valueSprite.text = "XXX XXX,-";
			this.valueSprite.style = TextStyles.parse("bonusPrizeValueNoWin");
			this.win.alpha = 0;
			this.win.visible = 0;
			this.winParticles0.alpha = 0;
			this.winParticles1.alpha = 0;
			this.scratchedOnce = false;
			this.winBorder.alpha = 0;
		}

		match() {
			this.matched = true;
			Tween.fromTo(this.win, 0.25, {alpha: 0, visible: 0}, {alpha: 1, visible: 1});
			this.valueSprite.style = TextStyles.parse("bonusPrizeValueWin");
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

		changeContainer(newContainer, scale) {
			if(!this._revealed && (this.resultContainer.width + 10 > this.foil.width || this.resultContainer.height + 10 > this.foil.height)) {
				this.resultContainer.scale.set(this.foil.width / (this.resultContainer.width + 10));
			}

			this.container.removeChild(this.background);
			this.container.removeChild(this.resultContainer);
			this.container.removeChild(this.foil);
			this.container.removeChild(this.antiFoil);
			this.container.removeChild(this.antiResult);

			this.container = newContainer;
			newContainer.addChild(this.background);
			newContainer.addChild(this.resultContainer);
			newContainer.addChild(this.foil);
			newContainer.addChild(this.antiFoil);
			newContainer.addChild(this.antiResult);

			this.background.scale.set(scale || 1);
			this.valueSprite.scale.set(scale || 1);
			this.winBorder.scale.set(scale || 1);
			this.foil.scale.set(scale || 1);
			this.antiFoil.scale.set(scale || 1);
			this.antiResult.scale.set(scale || 1);
			this.idleSprite.scale.set(scale || 1);

			if(this.scratchMask === null) {
				this.scratchMask = new ScratchMask(this.foil);
				this.scratchMask.cloneTransparent(ScratchSymbol.maskMap);
				this.clearScratches();
			}

			let b = this.foil.getBounds();
			this.scratchMask.x = b.x;
			this.scratchMask.y = b.y;

			this.winParticles0.scale.set(scale || 1);
			this.winParticles1.scale.set(scale || 1);
		}

		static fromContainer(main) {
			const tile = new BonusGameTile();
			tile.container = main;

			main.addChild(tile.background, tile.resultContainer, tile.foil, tile.idleSprite);

			displayList.particleContainer.addChild(tile.winParticles0);
			displayList.particleContainer.addChild(tile.winParticles1);

			return tile;
		}
	}

	return BonusGameTile;
});