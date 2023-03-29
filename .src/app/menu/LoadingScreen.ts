import * as PIXI from 'pixi.js';
import GameScene from './GameScene';
import { viewport } from '../config';
import SpriteUtils from '../utils/SpriteUtils';

/**
 * Displays Loading screen
 */
export default class LoadingScreen extends GameScene {
    loadedFiles: number = 0;
    totalFiles: number;
    barWidth: number;
    sprMask : PIXI.Sprite;
    
    constructor(game) {
        super(game, '', 'loadingBg');
        this.initLayout();
    }
    
    private initLayout() {
        const basePosition = { x: viewport.width / 2, y: 40 };

        const logo = SpriteUtils.createSprite('logo_intro1', basePosition.x, basePosition.y);
        logo.anchor.set(0.5, 0);
        this.addChild(logo);
        
        const bar = SpriteUtils.createSprite('loadingBar', basePosition.x, basePosition.y + 800);
        bar.anchor.set(0,0.5); 
        bar.position.x -= bar.width / 2;
        this.addChild(bar);
        this.barWidth = bar.width;

        //create and set up mask
        this.sprMask = this.createSpriteMask(bar);       
        this.sprMask.position.set(bar.x, bar.y);
        this.sprMask.anchor.set(0,0.5); 
        this.sprMask.width = 0; 
        this.addChild(this.sprMask);
                
        //put mask
        bar.mask = this.sprMask;
    }
    
    //create sprite 
    private createSpriteMask(bar:PIXI.Sprite) : PIXI.Sprite
    {
        var graphics = new PIXI.Graphics();          
        graphics.beginFill(0xFFFF11, 1);
        graphics.drawRect(0, 0, bar.width, bar.height);
        
        const renderTexture = PIXI.RenderTexture.create({ width: this.barWidth, height: bar.height });
        var sprTemp = new PIXI.Sprite(renderTexture);
        this.addChild(sprTemp);           
             
		var container = new PIXI.Container();
        container.addChild(graphics);
        this.game.app.renderer.render(container,renderTexture);  
        
        return sprTemp; 
    }
    
    enter(opts: { totalFiles: number }) {
        this.setTotalFiles(opts.totalFiles);
        this.game.loader.onProgress.add(() => this.progress());
    }

    setTotalFiles(totalFiles: number) {
        this.totalFiles = totalFiles;
    }

    progress() {
        this.loadedFiles++;
        const progress = this.loadedFiles / this.totalFiles;
        this.sprMask.width = this.barWidth * progress;        
    }
}