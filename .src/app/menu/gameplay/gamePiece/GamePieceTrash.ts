import BaseGamePiece from "./GamePieceBase";
import { gamePieceColors, gamePieceTypes, gameCharacters } from "../../../enums/enums";
import { stevenPattern, amethystPattern, garnetPattern, jasperPattern, pearlPattern, peridotPattern, yellowDiamondPattern } from "../GamePiece/gameCharacterPatterns";
import GamePieceComponent from "./GamePieceComponent";
import Debug from "../../../Debug";


export default class TrashGamePiece extends BaseGamePiece {


    currentTimerValue: number;
    initalTimerValue: number;
    trashAmount: number;

    constructor(amount, character: gameCharacters) {

        super();

        this.trashAmount = amount;
        this.gamePieceComponent = []
        this.currentPieceShape = this.getTrashPattern(character);

        this.row = 0;
        this.col = 0;
    }

    private getTrashPattern(character): any {
        let trash = [];
        let pattern;

        Debug.log("CHARACTER IS :", character);
        switch (character) {
            case gameCharacters.steven:
                pattern = stevenPattern;

                break;
            case gameCharacters.amethyst:
                pattern = amethystPattern;

                break;
            case gameCharacters.garnet:
                pattern = garnetPattern;

                break;
            case gameCharacters.pearl:
                pattern = pearlPattern;

                break;
            case gameCharacters.jasper || gameCharacters.j_minion:
                pattern = jasperPattern;

                break;
            case gameCharacters.peridot || gameCharacters.p_minion:
                pattern = peridotPattern;

                break;
            case gameCharacters.y_diamond || gameCharacters.y_minion:
                pattern = yellowDiamondPattern;
                break;

            default:
                pattern = yellowDiamondPattern;
                break;
        }


        Debug.log("PATERN IS ! : ", pattern);

        let patternCounter = 0;

        for (let i = 0; i < 13 && this.trashAmount > 0; i++) {
            for (let j = 0; j < 6 && this.trashAmount > 0; j++) {
                trash.push([i, j]);
                // this.gamePieceComponent.push(new GamePieceComponent(gamePieceColors.gem1, gamePieceTypes.trash));
                // this.gamePieceComponent.push(new GamePieceComponent(Math.min((Math.floor((Math.random()) * 4) + 1), 4), gamePieceTypes.trash, 5));

                // console.log(patternCounter)
                // console.log(i)
                // console.log(j)

                //Let's make absolutelly sure we never try to spawn a trash peice from an undefined pattern position
                if (pattern[patternCounter][j]) {
                    this.gamePieceComponent.push(new GamePieceComponent(pattern[patternCounter][j], gamePieceTypes.trash, 5));
                }
                this.trashAmount--;
            }
            patternCounter++;

            //Make sure we don´t overflow
            if (patternCounter > pattern.length - 1)
                patternCounter = 0;

        }
        return trash;
    }

    absolutePos(shiftRow = 0, shiftCol = 0, rotate = false) {

        let shape = this.currentPieceShape
        // console.log(shape);
        return shape.map((pos) => {

            // console.log(pos);
            return [this.row + shiftRow + pos[0], this.col + shiftCol + pos[1]];
        });
    }

}