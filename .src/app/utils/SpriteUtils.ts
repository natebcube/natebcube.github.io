import * as PIXI from 'pixi.js';

interface Props {
    centered?: boolean,
    xanchor?: string,
    yanchor?: string,
    scale?: number,
    flip?: boolean,
    action?: any,
    touch?: any,
    dragging?: any
 };

export default {
    texturesMap: {},
    setGame(game) {
        this.game = game;
    },
    setTexture(key: string, texture: PIXI.Texture) {
        this.texturesMap[key] = texture;
    },
    getTexture(key: string) {
        const textureTemp = this.game.loader.resources[key];
        const texture = textureTemp!==undefined ? this.game.loader.resources[key].texture : this.texturesMap[key];
        if (!texture) {
            throw new Error("Texture with key [" + key + "] not found");
        }
        return texture;
    },
    createAnimatedSprite(key: string, x: number, y: number, props: Props = {}): PIXI.AnimatedSprite {
        const sprite = PIXI.AnimatedSprite.fromFrames([key]);
        this.setupObject(sprite, x, y, props);
        return sprite;
    },
    createSprite(key: string, x: number, y: number, props: Props = {}) {
        const sprite = PIXI.Sprite.from(this.getTexture(key));
        this.setupObject(sprite, x, y, props);
        return sprite;
    },
    createText(contents: string, x: number, y: number, style?: PIXI.TextStyle, props: Props = {}) {
        const text = new PIXI.Text(contents, style);
        this.setupObject(text, x, y, props);
        return text;
    },
    createRoundedRectangle(x: number, y: number, w: number, h: number, radius:number, lineWidth: number, lineColor: number, lineAlpha: number, fillColor: number, fillAlpha: number, props: Props = {}) {
        const rectangle = new PIXI.Graphics();
        rectangle.lineStyle(lineWidth, lineColor, lineAlpha);
        rectangle.beginFill(fillColor, fillAlpha);
        rectangle.drawRoundedRect(0, 0, w, h, radius);
        rectangle.endFill();
        rectangle.width = w;
        rectangle.height = h;
        this.setupObject(rectangle, x, y, props);
        return rectangle;
    },
    swapTexture(sprite: PIXI.Sprite, key: string) {
        sprite.texture = this.getTexture(key);
    },
    realignText(text: PIXI.Text, props: Props) {
        this.setupObject(text, text.x, text.y, props);
    },
    alignObject(object: PIXI.Sprite, props: Props) {
        if (props.xanchor) {
            switch (props.xanchor) {
                case 'center':
                    object.anchor.x = 0.5;
                    break;
                case 'left':
                    object.anchor.x = 0;
                    break;
                case 'right':
                    object.anchor.x = 1;
                    break;
            }
        }
        if (props.yanchor) {
            switch (props.yanchor) {
                case 'center':
                    object.anchor.y = 0.5;
                    break;
                case 'top':
                    object.anchor.y = 0;
                    break;
                case 'bottom':
                    object.anchor.y = 1;
                    break;
            }
        }
        if (props.centered) {
            object.pivot.set(object.width / 2, object.height / 2);
        } 
    },
    setupObject(object: PIXI.Container, x: number, y: number, props: Props = {}) {
        this.alignObject(object, props);
        let xScale = 1;
        let yScale = 1;
        if (props.scale) {
            yScale = props.scale;
            xScale = props.scale * (props.flip ? -1 : 1);
        } else if (props.flip) {
            xScale = -1;
        }
        object.scale.set(xScale, yScale);
        if (props.action) {
            object.interactive = true;
            object.buttonMode = true;
            object.on('tap', props.action);
            object.on('click', props.action);
        }

        if (props.touch) {
            object.interactive = true;
            let dragStartPoint: PIXI.Point;
            object.on('touchstart', (event: PIXI.interaction.InteractionEvent) => {
                dragStartPoint = event.data.getLocalPosition(object.parent);
            });
            object.on('touchend', (event: PIXI.interaction.InteractionEvent) => {
                props.touch(dragStartPoint, event.data.getLocalPosition(object.parent));
            });
            if (props.dragging) {
                object.on('touchmove', (event: PIXI.interaction.InteractionEvent) => {
                    props.dragging(dragStartPoint, event.data.getLocalPosition(object.parent));
                });
            }
        }
        
        object.x = x;
        object.y = y;
    },

    setTextures(sprite: PIXI.AnimatedSprite, preffix: string, frames: number, yoyo:boolean = false) {
        sprite.stop();
        const textures = [];
        for (let i = 1; i <= frames; i++) {
            textures.push(this.getTexture(preffix + i));
        }
        if (yoyo) {
            for (let i = frames - 1; i >= 1; i--) {
                textures.push(this.getTexture(preffix + i));
            }
        }
        sprite.textures = textures;
        sprite.play();
    },

    setSingleTexture(sprite: PIXI.AnimatedSprite, textureId: string) {
        sprite.stop();
        const textures = [];
        textures.push(this.getTexture(textureId));
        sprite.textures = textures;
        sprite.play();
    }
}