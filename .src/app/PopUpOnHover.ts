import * as PIXI from 'pixi.js';
import SpriteUtils from "./utils/SpriteUtils";

export default class PopUpOnHover {
    constructor (element:PIXI.Text, normalStyle: PIXI.TextStyle, hoverStyle: PIXI.TextStyle) {
        element.interactive = true;
        element.on("mouseover", () => {
            element.style = hoverStyle;
            SpriteUtils.realignText(element, { centered: true });
        });
        element.on("mouseout", () => {
            element.style = normalStyle;
            SpriteUtils.realignText(element, { centered: true });
        });
    }
}