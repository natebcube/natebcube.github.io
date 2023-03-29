//Import the PIXI renderer
import * as PIXI from 'pixi.js';

//Load game assets
import { splashAssets, atlases } from '../assets/loader';

//Load Game "Scenes"
import GameMainMenu from './menu/GameMainMenu';
import GameCharacterSelect from './menu/GameCharacterSelect';
import GamePlay from './menu/GamePlay';

//Load Game utils
import Keyboard from './utils/Keyboard';
// import { game } from './config';
import GamePaused from './menu/gameplay/GamePaused';
import GameModeSelect from './menu/GameModeSelect';
import GameStageMapMenu from './menu/GameStageMapMenu';
import GameOver from './menu/gameplay/GameOver';
import GameCharacterSelectVersus from './menu/GameCharacterSelectVersus';
import SoundManager from './sound/SoundManager';
import SpriteUtils from './utils/SpriteUtils';
import Persistance from './Persistance';
import LoadingScreen from './menu/LoadingScreen';
import SplashScreen from './menu/SplashScreen';
import ArcadeTower from './menu/ArcadeTower';
import StoryController from './controller/StoryController';
import GameScene from './menu/GameScene';
import ArcadeController from './controller/ArcadeController';
import DialogueScene from './menu/DialogueScene';
import Localization from './controller/Localization';
import Debug from './Debug';

/*
//Uncomment this to activate PIXI dev tools for pixi5
PIXI.WebGLRenderer = PIXI.Renderer;
window.__PIXI_INSPECTOR_GLOBAL_HOOK__ &&
    window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
*/

/**
 * The main Game App
 */
export class GameApp {

    public app: PIXI.Application;
    public parent: HTMLElement;
    protected gameScenes = {};
    public scene = null;
    protected totalPlayerScore = 0;
    public key: Keyboard;
    public loader: PIXI.Loader;
    public soundManager: SoundManager;
    public mainCointainer: PIXI.Container;
    private filesToLoad: number = 0;
    private keptState: GameScene;
    public isMobile:boolean;

    constructor(parent: HTMLElement, width: number, height: number) {

        var ua = window.navigator.userAgent.toLowerCase();
        this.isMobile = ua.indexOf('mobile') !== -1 || ua.indexOf('android') !== -1  || PIXI.utils.isMobile.any; 
        
       // console.log(this.isMobile);
        this.app = new PIXI.Application({
            width: width,
            height: height,
            resolution: this.isMobile ? window.devicePixelRatio : 1,
            backgroundColor: 0x000000,
            clearBeforeRender: true,
            forceCanvas: true,
            autoDensity: true
        });

        //PIXI.settings.SCALE_MODE = 1;
        this.parent = parent;
        this.app.renderer.autoDensity = true;
        this.mainCointainer = new PIXI.Container();
        this.mainCointainer.width = this.app.renderer.width;
        this.mainCointainer.height = this.app.renderer.height;
        this.app.stage.addChild(this.mainCointainer);

        this.gameScenes = {};
        this.scene = null;

        SpriteUtils.setGame(this);
        StoryController.setGame(this);
        ArcadeController.setGame(this);
        Persistance.init();

               

        this.loadLoadingScreenAssets()
            .then(() => this.initLoader())
            .then(() => this.showLoadingScreen())
            .then(() => this.preloadAssets());
    }

    private showLoadingScreen() {
        const splash = new SplashScreen(this);
        this.addState('splashScreen', splash);
        this.addState('loadingScreen', new LoadingScreen(this));
        this.parent.appendChild(this.app.view);
        this.setState('splashScreen');
        return splash.videoEnded().then(() => this.setState('loadingScreen', { totalFiles: this.filesToLoad }));
    }

    /**
     * Load loading screen assets (Including main menu background)
     */
    private loadLoadingScreenAssets() {
        this.loader = new PIXI.Loader();
        this.loader.reset();

        Object.keys(splashAssets).forEach((key: string) => {
            this.loader.add(key, splashAssets[key]);
        });

        this.loader.add('localization', 'locale.json');
        this.loader.add('config', 'config.json');

        return new Promise(resolve => {
            this.loader.load(resolve);
        });
    }

    private addToLoadQueue(key: string, url: string | string[]) {
        this.filesToLoad++;
        if (Array.isArray(url)) {
            this.loader.add(key, url[0]);
        } else {
            this.loader.add(key, url);
        }
    }

    private addAllToLoadQueue(object: {}) {
        Object.keys(object).forEach(key => {
            this.addToLoadQueue(key, object[key]);
        });
    }

    /**
     * Load main graphical assets
     */
    private initLoader() {
        // Load game logo
        Object.keys(this.loader.resources.splashAtlas.textures).forEach(textureKey => {
            SpriteUtils.setTexture(textureKey, this.loader.resources.splashAtlas.textures[textureKey]);
        });
        // Load Cartoon Network logo
        Object.keys(this.loader.resources.cnAtlas.textures).forEach(textureKey => {
            SpriteUtils.setTexture(textureKey, this.loader.resources.cnAtlas.textures[textureKey]);
        });
        //Load Steven Universe logo
        Object.keys(this.loader.resources.stevenAtlas.textures).forEach(textureKey => {
            SpriteUtils.setTexture(textureKey, this.loader.resources.stevenAtlas.textures[textureKey]);
        });
        //Load game Loading Bar
        Object.keys(this.loader.resources.loadingBarAtlas.textures).forEach(textureKey => {
            SpriteUtils.setTexture(textureKey, this.loader.resources.loadingBarAtlas.textures[textureKey]);
        });
        
        const gameTexts = this.loader.resources.localization.data;
        const config = this.loader.resources.config.data;
        Localization.setTexts(gameTexts);
        Localization.setLanguage(config.language);
        

        this.soundManager = new SoundManager();

        const groupsToLoad = [ atlases ];
        groupsToLoad.forEach(group => this.addAllToLoadQueue(group));

    }

    private preloadAssets() {
        this.loader.load(() => this.onAssetsLoaded());
    }

    /**
     * Runs after all graphical assets have been preloded
     */
    private onAssetsLoaded() {
        // Add all textures from atlases to the textures map
        Object.keys(atlases).forEach(atlasKey => {
            Object.keys(this.loader.resources[atlasKey].textures).forEach(textureKey => {
                SpriteUtils.setTexture(textureKey, this.loader.resources[atlasKey].textures[textureKey]);
            });
        });

        this.key = new Keyboard();
        // this.scores = new ScoreTable();

        // define available game states
        this.addState('mainMenu', new GameMainMenu(this));
        this.addState('modeSelectMenu', new GameModeSelect(this));
        this.addState('characterSelectVersusMenu', new GameCharacterSelectVersus(this));
        this.addState('characterSelectMenu', new GameCharacterSelect(this));
        this.addState('stageMapMenu', new GameStageMapMenu(this));
        this.addState('gamePlay', new GamePlay(this));
        this.addState('gameOver', new GameOver(this));
        this.addState('arcadeTower', new ArcadeTower(this));
        this.addState('dialogue', new DialogueScene(this));

        //this.app.resizeTo = this.parent; @slashie_: Had to disable this, was causing issues with scenes setup. Game seems to be working fine without it.
        this.setState('mainMenu', {});

        // start the updates
        this.app.ticker.add(this.update, this);
    }

    /**
     * Add new state
     * @param {String} stateName
     * @param {State} state     new state instance
     */
    addState(stateName, state) {
        this.gameScenes[stateName] = state;
        // this.gameScenes[stateName].pivot.set(0.5)
        this.mainCointainer.addChild(this.gameScenes[stateName]);

        // this.gameScenes[stateName].position.set(1240 / 8, 720 / 8);
        // this.gameScenes[stateName].scale.set(1);
        // this.gameScenes[stateName].width = 1240 * 1.2;
        // this.gameScenes[stateName].height = 720 * 1.2;

        /*this.gameScenes[stateName].width = window.innerWidth;
        this.gameScenes[stateName].height = window.innerHeight;
        this.gameScenes[stateName].resizeTo = this.parent;*/
    }

    /**
     * Handle game update
     * @param {Number} dt PIXI timer deltaTime
     */
    update(dt) {
        if (this.scene) {
            this.scene.update(dt);
        }
    }

    /**
     * changes current state
     * @param {String} stateName
     * @param {Object} opts additional options passed by previous state
     */
    setState(stateName: string, opts: any = null) 
    {
        Debug.log("Escena: "+stateName);
        let oldState = this.scene;

        this.scene = null;

        if (this.keptState) {
            this.keptState.visible = false;
            delete this.keptState;
        }

        if (oldState) {
            if (opts.keepVisible) {
                this.keptState = oldState;
            } else {
                oldState.visible = false;
            }
            oldState.exit(opts);
        }

        let newState = this.gameScenes[stateName];
        newState.enter(opts);
        newState.visible = true;
        this.scene = newState;
    }

}