import * as PIXI from 'pixi.js';
import GameScene from './GameScene';
import { viewport } from '../config';

export default class SplashScreen extends GameScene {
    constructor(game) {
        super(game, '', 'loadingBg');
        this.initLayout();
    }

    videoCompletedCallback: any;

    public videoEnded() {
        const that = this;
        return new Promise((resolve) => {
            that.videoCompletedCallback = () => resolve();
        });
    }
    
    private initLayout() {
        const button = new PIXI.Graphics()
            .beginFill(0x0, 0.5)
            .drawRoundedRect(0, 0, 100, 100, 10)
            .endFill()
            .beginFill(0xffffff)
            .moveTo(36, 30)
            .lineTo(36, 70)
            .lineTo(70, 50);

        button.x = (viewport.width - button.width) / 2;
        button.y = (viewport.height - button.height) / 2;

        button.interactive = true;
        button.buttonMode = true;

        this.addChild(button);

        button.on('pointertap', onPlayVideo);

        const screen = this;
        onPlayVideo();
        function onPlayVideo() {
            button.destroy();
            const texture = PIXI.Texture.from('video/splash.mp4');
            texture.baseTexture.resource.source.muted = true;
            const videoSprite = new PIXI.Sprite(texture);
            videoSprite.width = viewport.width;
            videoSprite.height = viewport.height;
            screen.addChild(videoSprite);
            setTimeout(() => {
                screen.videoCompletedCallback();
            }, 5000);
        }
    }
}