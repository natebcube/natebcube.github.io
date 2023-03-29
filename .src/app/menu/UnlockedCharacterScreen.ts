import * as PIXI from 'pixi.js';
import SpriteUtils from '../utils/SpriteUtils';
import Characters from '../Characters';
import { versusCharacterSelectNameTextUIStyle } from '../textStyles/textStyles';
import Localization from '../controller/Localization';
import { gameCharacters } from '../enums/enums';
import { viewport } from '../config';

export default class UnlockedCharacterScreen extends PIXI.Container{

    private img:PIXI.Sprite;
    constructor()
    {
        super();
        const popupLocation = {
            x: 1920 / 2,
            y: 1080 / 2
        };
        
        var bg = SpriteUtils.createSprite('black', popupLocation.x, popupLocation.y, { centered: true });
        bg.width = 1920;
        bg.height = 1080;
        bg.alpha = 0.5;
        bg.buttonMode = true;
        bg.interactive = true;
        this.addChild(bg);
        
        var container = new PIXI.Container();
        //container.position.set(popupLocation.x, popupLocation.y);
        this.addChild(container);

        var popupBackground = SpriteUtils.createSprite('unlockedPopup', popupLocation.x, popupLocation.y, { centered: true });
        popupBackground.width = 1920;
        popupBackground.height = 1080;       
        container.addChild(popupBackground);

        this.img = SpriteUtils.createSprite(Characters[gameCharacters.steven].selectionPreviewImage, 0, 1080);
        this.img.anchor.set(0,1);
        this.img.scale.set(1.5);
        this.img.height-=90;
        this.img.width-=90;
        this.img.y-=46;
        this.img.x+=70;
        container.addChild(this.img);

        var txt = SpriteUtils.createText(Localization.loc('UNLOCKED'), popupLocation.x, popupLocation.y, versusCharacterSelectNameTextUIStyle, { centered: true });
        //txt.anchor.set(1,0.5);
        txt.x = viewport.width-400;        
        container.addChild(txt);

        container.scale.set(0.6);
        container.position.set(popupLocation.x - container.width/2,popupLocation.y-container.height/2);

        //se inicia oculta
        this.visible = false;

        bg.on('click',()=>{
            this.hide();
        });

        bg.on('tap',()=>{
            this.hide();
        })
    }

    show(character:gameCharacters)
    {        
        this.img.texture = SpriteUtils.getTexture(Characters[character].selectionPreviewImage)
        this.visible = true;
    }

    hide()
    {
        this.visible = false;
    }
}