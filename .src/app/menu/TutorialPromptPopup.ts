import * as PIXI from 'pixi.js';
import SpriteUtils from "../utils/SpriteUtils";
import Localization from '../controller/Localization';
import { tutorialPromptPromptStyle, tutorialPromptOptionStyle, tutorialPromptDontAskStyle, tutorialPromptSelectedOptionStyle } from '../textStyles/textStyles';
import PopUpOnHover from '../PopUpOnHover';
import Persistance from '../Persistance';
import { GameApp } from '../app';
import { gameCharacters } from '../enums/enums';
import config, { game } from '../config';

export default class TutorialPromptPopup {
    private container: PIXI.Container;
    private completeCallback: any;
    private game: GameApp;
    private dontAskAgain: boolean;
    private starCheck: PIXI.Sprite;

    constructor(game: GameApp, parent: PIXI.Container) {
        this.game = game;
        this.container = new PIXI.Container();

        const popupLocation = {
            x: 1920 / 2,
            y: 1080 / 2
        };

        var mask = this.container.addChild(SpriteUtils.createSprite('black', 0, 0));
        mask.alpha = 0.8;
        mask.width = config.viewport.width;
        mask.height = config.viewport.height;

        var popupBackground = SpriteUtils.createSprite('tutorialPromptPopup', popupLocation.x, popupLocation.y, { centered: true });
        this.container.addChild(popupBackground);
        this.dontAskAgain = false;
        this.starCheck = this.container.addChild(SpriteUtils.createSprite('tutorial-star', popupLocation.x + 235, popupLocation.y + 155, {
            centered: true,
            action: () => {
                this.toogleDontAsk();
            }
        }));
        this.starCheck.alpha = 0;

        this.container.addChild(SpriteUtils.createText(Localization.loc('tutorialPopupPrompt'), popupLocation.x, popupLocation.y - 160, tutorialPromptPromptStyle, { centered: true }));
        const option1Text = SpriteUtils.createText(Localization.loc('tutorialPopupOption1'), popupLocation.x, popupLocation.y - 60, tutorialPromptOptionStyle, {
            centered: true,
            action: () => {
                this.dismiss();
            }
        });
        const option2Text = SpriteUtils.createText(Localization.loc('tutorialPopupOption2'), popupLocation.x, popupLocation.y + 40, tutorialPromptOptionStyle, {
            centered: true,
            action: () => {
                this.showTutorial();
            }
        })
        const dontAskText = SpriteUtils.createText(Localization.loc('tutorialPopupDontAsk'), popupLocation.x + 90, popupLocation.y + 150, tutorialPromptDontAskStyle, { centered: true });
        this.container.addChild(dontAskText);
        this.container.addChild(option1Text);
        this.container.addChild(option2Text);
        new PopUpOnHover(option1Text, tutorialPromptOptionStyle, tutorialPromptSelectedOptionStyle);
        new PopUpOnHover(option2Text, tutorialPromptOptionStyle, tutorialPromptSelectedOptionStyle);
        parent.addChild(this.container);
    }

    toogleDontAsk() {
        this.dontAskAgain = !this.dontAskAgain;
        this.starCheck.alpha = this.dontAskAgain ? 1 : 0;
    }

    show() {
        return new Promise((resolve) => {
            this.completeCallback = resolve;
        });
    }

    dismiss() {
        if (this.dontAskAgain) {
            Persistance.saveSkipTutorial();
        }
        this.hide();
        this.completeCallback(false);
    }

    showTutorial() {
        if (this.dontAskAgain) {
            Persistance.saveSkipTutorial();
        }
        this.game.setState("dialogue", {
            character: gameCharacters.steven,
            opponent: gameCharacters.pearl,
            dialogue: TutorialPromptPopup.getTutorialDialogue(this.game.isMobile),
            stageNumber: 1,
            defeated: false,
            cb: () => {
                this.hide();
                this.completeCallback(true);
            }
        });

    }

    static getTutorialDialogue(isMobile) {
        var dialogue = null;

        if (isMobile) {
            dialogue = {
                type: 'scripted',
                script: [
                    { "character": "image", "feeling": "", "contentId": "1-gem" },
                    { "character": "steven", "feeling": "happy", "contentId": "1" },
                    { "character": "steven", "feeling": "happy", "contentId": "2" },
                    { "character": "steven", "feeling": "impressed", "contentId": "3" },
                    { "character": "steven", "feeling": "serious", "contentId": "4" },
                    { "character": "steven", "feeling": "serious", "contentId": "5" },
                    { "character": "responsiveAnimation", "feeling": "", "contentId": "2-gemRotate-,3" },
                    { "character": "instruction", "feeling": "", "contentId": "TAP" },
                    { "character": "steven", "feeling": "serious", "contentId": "6" },
                    { "character": "steven", "feeling": "serious", "contentId": "7" },
                    { "character": "responsiveAnimation", "feeling": "", "contentId": "3-gemDrop-,2" },
                    { "character": "instruction", "feeling": "", "contentId": "Swipe" },
                    { "character": "steven", "feeling": "embarrased", "contentId": "8" },
                    { "character": "steven", "feeling": "embarrased", "contentId": "9" },
                    { "character": "image", "feeling": "", "contentId": "4-star" },
                    { "character": "animation", "feeling": "", "contentId": "5-gemBlast-,3" },
                    { "character": "steven", "feeling": "embarrased", "contentId": "10" },
                    { "character": "steven", "feeling": "serious", "contentId": "11" },
                    { "character": "animation", "feeling": "", "contentId": "6-bubbleGems-,3" },
                    { "character": "steven", "feeling": "serious", "contentId": "12" },
                    { "character": "steven", "feeling": "happy", "contentId": "13" },
                    { "character": "steven", "feeling": "serious", "contentId": "14" },
                    { "character": "steven", "feeling": "serious", "contentId": "15" },
                    { "character": "animation", "feeling": "", "contentId": "7-powerMeter-,2 " },
                    { "character": "steven", "feeling": "serious", "contentId": "16" },
                    { "character": "steven", "feeling": "serious", "contentId": "17" },
                    { "character": "steven", "feeling": "impressed", "contentId": "18" },
                    { "character": "steven", "feeling": "impressed", "contentId": "19" },
                    { "character": "steven", "feeling": "impressed", "contentId": "20" },
                    { "character": "steven", "feeling": "impressed", "contentId": "21" },
                    { "character": "pearl", "feeling": "mad", "contentId": "22" },
                    { "character": "steven", "feeling": "happy", "contentId": "23" },
                ]
            };
        }
        else
            dialogue = {
                type: 'scripted',
                script: [
                    { "character": "image", "feeling": "", "contentId": "1-gem" },
                    { "character": "steven", "feeling": "happy", "contentId": "1" },
                    { "character": "steven", "feeling": "happy", "contentId": "2" },
                    { "character": "steven", "feeling": "impressed", "contentId": "3" },
                    { "character": "steven", "feeling": "serious", "contentId": "4" },
                    { "character": "steven", "feeling": "serious", "contentId": "5" },
                    { "character": "responsiveAnimation", "feeling": "", "contentId": "2-gemRotate-,3" },
                    { "character": "instruction", "feeling": "", "contentId": "Tutorial_Rotate" },
                    { "character": "steven", "feeling": "serious", "contentId": "25" },
                    { "character": "steven", "feeling": "serious", "contentId": "7" },
                    { "character": "responsiveAnimation", "feeling": "", "contentId": "3-gemDrop-,2" },
                    { "character": "instruction", "feeling": "", "contentId": "Tutorial_Drop" },
                    { "character": "steven", "feeling": "embarrased", "contentId": "26" },
                    { "character": "steven", "feeling": "embarrased", "contentId": "9" },
                    { "character": "image", "feeling": "", "contentId": "4-star" },
                    { "character": "animation", "feeling": "", "contentId": "5-gemBlast-,3" },
                    { "character": "steven", "feeling": "embarrased", "contentId": "10" },
                    { "character": "steven", "feeling": "serious", "contentId": "11" },
                    { "character": "animation", "feeling": "", "contentId": "6-bubbleGems-,3" },
                    { "character": "steven", "feeling": "serious", "contentId": "12" },
                    { "character": "steven", "feeling": "happy", "contentId": "13" },
                    { "character": "steven", "feeling": "serious", "contentId": "14" },
                    { "character": "steven", "feeling": "serious", "contentId": "15" },
                    { "character": "animation", "feeling": "", "contentId": "7-powerMeter-,2 " },
                    { "character": "steven", "feeling": "serious", "contentId": "16" },
                    { "character": "steven", "feeling": "serious", "contentId": "17" },
                    { "character": "steven", "feeling": "impressed", "contentId": "27" },
                    { "character": "steven", "feeling": "impressed", "contentId": "19" },
                    { "character": "steven", "feeling": "impressed", "contentId": "20" },
                    { "character": "steven", "feeling": "impressed", "contentId": "21" },
                    { "character": "pearl", "feeling": "mad", "contentId": "22" },
                    { "character": "steven", "feeling": "happy", "contentId": "23" },

                ]
            };
        return dialogue;
    }

    hide() {
        this.container.destroy();
    }
}