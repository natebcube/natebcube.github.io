import * as PIXI from 'pixi.js';
import GameScene from './GameScene';
import { GameApp } from '../app';
import SpriteUtils from '../utils/SpriteUtils';
import { viewport } from '../config';
import TutorialPromptPopup from './TutorialPromptPopup';
import Persistance from '../Persistance';

/**
 * Display Splash screen
 */
export default class GameMainMenu extends GameScene {

    mainMenuButton1: PIXI.Text;

    private navigationActive: boolean;

    constructor(game: GameApp) {
        super(game, '', 'sceneMainMenuBackground');
        this.initLayout();
    }

    private initLayout() {
        const logo = SpriteUtils.createSprite('logo_intro1', 650, 550, { centered: true });
        const logoCN = SpriteUtils.createSprite('logo_intro2', 100,100, { centered: true });
        const logoSteven = SpriteUtils.createSprite('logo_intro3', 650, 150, { centered: true });
        this.addChild(logo);
        this.addChild(logoCN);
        this.addChild(logoSteven);

        var playButton = SpriteUtils.createSprite('playButton', 650, 930, { centered: true });
        this.addChild(playButton);

        this.addChild(SpriteUtils.createSprite('titleScreen', viewport.width, viewport.height, { xanchor: "right", yanchor: "bottom" }));

        this.background.interactive = true;
        this.background.buttonMode = true;
        this.navigationActive = false;

        const startGame = () => {
            if (this.navigationActive) {
                this.game.setState('modeSelectMenu', { restart: true });
            }
        }

        this.background.on('tap', startGame);
        this.background.on('click', startGame);

        if (!Persistance.skipTutorial()) {
            const tutorialPromptPopup = new TutorialPromptPopup(this.game, this);
            tutorialPromptPopup.show().then((tutorialShown: boolean) => {
                this.navigationActive = true;
                if (tutorialShown) {
                    this.game.setState('modeSelectMenu', { restart: true });
                }
            })
        } else {
            this.navigationActive = true;
        }
        
    }

    enter() {
        this.game.soundManager.playBGXSound("mainTheme");
    }
}