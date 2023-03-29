import * as PIXI from 'pixi.js';
import { viewport } from '../config';
import Debug from '../Debug';

export default class TouchController extends PIXI.Container {
    private game: any;
    //public isTapped:boolean;
    public leftAction: any;
    public rightAction: any;
    public centerAction: any;
    public swipeAction: any;
    private dragPosition: PIXI.Point;
    private doingSwipe: boolean = false;
    private SWIPE_X: number = 1000;
    private SWIPE_Y: number = 100;

    constructor(game) {
        super();
        this.game = game;

        var sprLeft = this.createRect(viewport.width / 4, viewport.height, 0xFFFFFF);
        sprLeft.alpha = 0;
        sprLeft.interactive = true;
        this.addChild(sprLeft);
        sprLeft.on('pointerup', (event) => {
            Debug.log("Left Tap: " + this.doingSwipe);
            this.OnDrawEnd(event);
            if (this.leftAction != null && !this.doingSwipe) {
                this.leftAction();
            }
        });


        var sprRight = this.createRect(viewport.width / 4, viewport.height, 0xFFFFFF);

        sprRight.position.x = (viewport.width - sprRight.width);
        sprRight.alpha = 0;
        sprRight.interactive = true;
        this.addChild(sprRight);
        sprRight.on('pointerup', (event) => {
            Debug.log("Right Tap: " + this.doingSwipe);
            this.OnDrawEnd(event);
            if (this.rightAction != null && !this.doingSwipe) {
                this.rightAction();
            }
        });

        var sprCenter = this.createRect(viewport.width / 2, viewport.height - viewport.height / 4, 0x673ab7);
        this.addChild(sprCenter);
        sprCenter.position.x = viewport.width / 2;
        sprCenter.anchor.set(0.5, 0);
        sprCenter.alpha = 0;
        sprCenter.interactive = true;
        sprCenter.on('pointerup', (event) => {
            Debug.log("Center Tap: " + this.doingSwipe);
            this.OnDrawEnd(event);
            if (this.centerAction != null && !this.doingSwipe) {
                this.centerAction();
            }
        });

        this.interactive = true;
        this.on('pointerdown', this.OnDrawStart);
        //this.on('pointerup', this.OnDrawEnd);
        this.on('pointerupoutside', this.OnDrawEnd);
        this.on('pointermove', this.OnDrawMove);
    }

    OnDrawStart(event) {
        this.dragPosition = event.data.getLocalPosition(this.parent);
    }

    OnDrawEnd(event) {
        var finalPos = event.data.getLocalPosition(this.parent);
        var deltaX: number = finalPos.x - this.dragPosition.x;
        var deltaY: number = finalPos.y - this.dragPosition.y;
        Debug.log("OnDrawEnd DeltaX: " + deltaX + " -- DeltaY: " + deltaY);
        console.log("OnDrawEnd DeltaX: " + deltaX + " -- DeltaY: " + deltaY);
        if (deltaY > this.SWIPE_Y && Math.abs(deltaX) < this.SWIPE_X) {
            if (this.swipeAction != null) {

                this.swipeAction();
            }
        } else
            this.doingSwipe = false;
    }

    OnDrawMove() {
        Debug.log("OnDrawMove");
        this.doingSwipe = true;
    }

    registerLeftTapAction(action: Function) {
        this.leftAction = action;
    }

    registerRightTapAction(action: Function) {
        this.rightAction = action;
    }

    registerCenterTapAction(action: Function) {
        this.centerAction = action;
    }

    registerSwipeAction(action: Function) {
        this.swipeAction = action;
    }

    createRect(width: number, height: number, color: any) {
        var bar = new PIXI.Graphics();
        bar.beginFill(color);
        bar.drawRect(0, 0, width, height);
        bar.endFill();

        const renderTexture = PIXI.RenderTexture.create(width, height);
        var sprTemp = new PIXI.Sprite(renderTexture);

        var container = new PIXI.Container();
        container.addChild(bar);
        this.game.app.renderer.render(container, renderTexture);
        return sprTemp;
    }

}