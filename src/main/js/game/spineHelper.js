define((require) => {
	// spineHelper.js
	// helper functions for adding Spine sprites and running their animations

	const PIXI = require("com/pixijs/pixi");
	const layoutText = require("skbJet/componentManchester/standardIW/layout/text");
	const layoutButton = require("skbJet/componentManchester/standardIW/layout/button");
	const textStyles = require("skbJet/componentManchester/standardIW/textStyles");
	const displayList = require("skbJet/componentManchester/standardIW/displayList");
	const dynamicText = require("skbJet/componentManchester/standardIW/layout/dynamicText");
	const resLib = require("skbJet/component/resourceLoader/resourceLib");

	let _spines = {};

	require("com/gsap/TweenMax");
	const Tween = window.TweenMax;
	
	/**
	 * Adds a new spine skeleton to the game
	 * @param skeletonName name of the skeleton to add
	 * @param [spineName] (optional) name to give the property in the spines
	 * @param [container="gameContainer"] (optional) name of the layout container to add the spine to.
	 */
	function addSpine(skeletonName, spineName, container) {
		let name = spineName || skeletonName;
		if(_spines[name]) {
			throw new Error("non-unique spine name: " + skeletonName);
		}

		try {
			//Create the spine
			let newSpine = new PIXI.spine.Spine(resLib.spine[skeletonName].spineData);
			_spines[name] = newSpine;
			newSpine.update(0);

			displayList[container || "gameContainer"].addChild(newSpine);

			return newSpine;
		} catch(e) {
			console.error("Failed to add spine: " + skeletonName);
		}
	}

	/**
	 * Attach a text sprite to an existing spine slot
	 * @param slotName Unique name of the slot. If not unique, adds to the first slot it finds with this name.
	 * @param styleName Text style name
	 * @param stringName String resource name
	 */
	function addTextSprite(slotName, styleName, stringName) {
		let slot = findSlot(slotName);

		if(slot && textStyles[styleName]) {
			let textSprite = layoutText.create();
			layoutText.update(textSprite, textStyles[styleName]);
			textSprite.anchor.set(0.5);
			if(stringName) {
				dynamicText.setText(textSprite, stringName);
			}

			textSprite.name = slotName + "_dynamicText";
			slot.currentSprite.addChild(textSprite);

			if(displayList[textSprite.name] !== undefined) {
				throw new Error('Duplicate display object in displayList: ' + textSprite.name);
			}
			displayList[textSprite.name] = textSprite;

		} else {
			throw new Error("Missing slot \"" + slotName + "\" and/or textStyle \"" + styleName + "\"!");
		}
	}

	/**
	 * Attach a bitmap text sprite to an existing spine slot
	 * @param slotName Unique name of the slot. If not unique, adds to the first slot it finds with this name.
	 * @param fontName Bitmap font name
	 * @param stringName String resource name
	 */
	function addBitmapTextSprite(slotName, fontName, stringName) {
		let slot = findSlot(slotName);
		if(slot && resLib.bitmapFonts[fontName]) {
			let bmText = new PIXI.extras.BitmapText("", {font: fontName, align: "center", tint: 0xFFFFFF});
			bmText.anchor.set(0.5);
			if(stringName) {
				bmText.text = resLib.i18n.game[stringName];
			}

			bmText.name = slotName + "_dynamicText";
			slot.currentSprite.addChild(bmText);

			if(displayList[bmText.name] !== undefined) {
				throw new Error('Duplicate display object in displayList: ' + bmText.name);
			}
			displayList[bmText.name] = bmText;

		} else {
			throw new Error("Missing slot \"" + slotName + "\" and/or textStyle \"" + fontName + "\"!");
		}
	}

	/**
	 * Attach a button to an existing spine slot
	 * @param slotName Unique name of the slot. If not unique, adds to the first slot it finds with this name.
	 * @param layoutObj Layout engine object describing button, e.g.
	 *              {
	 *               string:         "button_viewResult",
     *				 textures: {
	 *							enabled:    "buttonBaseUp",
	 *							over:       "buttonBaseOver",
	 *							pressed:    "buttonBaseDown",
	 *							disabled:   "buttonBaseDisabled"
	 *						},
	 *				 style: {
	 *							enabled:    "mainButtonEnabled",
	 *							over:       "mainButtonOver",
	 *							pressed:    "mainButtonPressed",
	 *							disabled:   "mainButtonDisabled"
	 *						}
	 *				}
	 */
	function addButton(slotName, layoutObj) {
		let slot = findSlot(slotName);

		if(slot) {
			let button = layoutButton.create();
			layoutButton.update(button, layoutObj);
			button.name = slotName + "_button";
			slot.currentSprite.addChild(button);

			if(displayList[button.name] !== undefined) {
				throw new Error('Duplicate display object in displayList: ' + button.name);
			}
			displayList[button.name] = button;
		} else {
			throw new Error("Missing slot \"" + slotName + "\"!");
		}
	}

	/**
	 * 	Takes a spine slot and adds its currentSprite to the displayList as if it was a container
	 */
	function slotToContainer(slotName) {
		let slot = findSlot(slotName);
		if(slot && slot.currentSprite) {
			if (displayList[slotName] !== undefined) {
				throw new Error('Duplicate display object in displayList: ' + slotName);
			}
			displayList[slotName] = slot.currentSprite;
		}
	}

	/**
	 * Searches all known spines and returns the first slot it finds with the given name
	 * @param name Name to search for
	 * @returns {Slot}
	 */
	function findSlot(name) {
		let slot;
		let keys = Object.keys(_spines);

		for(let i = 0; i < keys.length; i++) {
			if(_spines.hasOwnProperty(keys[i])) {
				slot = _spines[keys[i]].skeleton.findSlot(name);
				if(slot) {
					return slot;
				}
			}
		}
		return null;
	}

	/**
	 * Make a Slot's currentSprite visible.
	 * @param name Slot name
	 * @param [duration] Fade duration
	 * @param [delay] Fade delay
	 */
	function showSlot(name, duration, delay) {
		let slot = findSlot(name);
		if(slot) {
			slot.currentSprite.visible = true;
			if(duration || delay) {
				slot.currentSprite.alpha = 0;
				Tween.to(slot.currentSprite, duration || 0, {alpha: 1, delay: delay || 0});
			} else {
				slot.currentSprite.alpha = 1;
			}
		}
	}

	/**
	 * Make a Slot's currentSprite invisible
	 * @param name
	 * @param [duration] Fade duration
	 * @param [delay] Fade delay
	 */
	function hideSlot(name, duration, delay) {
		let slot = findSlot(name);
		if(slot) {
			if(duration || delay) {
				slot.currentSprite.alpha = 1;
				Tween.to(slot.currentSprite, duration || 0, {alpha: 0, delay: delay || 0, onComplete: function() {
					slot.currentSprite.visible = false;
				}});
			} else {
				slot.currentSprite.visible = false;
			}
		}
	}

	/**
	 * Move a display object from its current parent to a new slot
	 * @param displayObjName Name of display object (e.g. Sprite) to move
	 * @param slotName Slot name
	 * @param [spineName] Optional specify spine name (use in case of duplicate slotnames)
	 */
	function moveToSlot(displayObjName, slotName, spineName) {
		let obj = displayList[displayObjName];
		let slot;
		if(spineName) {
			slot = _spines[spineName].skeleton.findSlot(slotName);
		} else {
			slot = findSlot(slotName);
		}
		obj.parent.removeChild(obj);
		slot.currentSprite.addChild(obj);
	}

	function setSkin(skinName, spineNames) {
		for(let i = 0; i < spineNames.length; i++) {
			let spi = _spines[spineNames[i]];
			spi.skeleton.setSkin(null);
			spi.skeleton.setSkinByName(skinName);
			spi.update(0);
		}
	}

	return {
		addSpine: addSpine,
		addTextSprite: addTextSprite,
		addBitmapTextSprite: addBitmapTextSprite,
		addButton: addButton,
		slotToContainer: slotToContainer,
		showSlot: showSlot,
		hideSlot: hideSlot,
		findSlot: findSlot,
		moveToSlot: moveToSlot,
		setSkin: setSkin,
		get spines() {
			return _spines;
		}
	};
});
