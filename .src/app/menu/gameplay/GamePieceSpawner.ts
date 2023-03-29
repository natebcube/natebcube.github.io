import GamePiece from "./gamePiece/GamePiece";
import { gamePieceColors, gamePieceTypes } from "../../enums/enums";
import MathUtils from "../../utils/MathUtils";

export default class GamePieceSpawner {

    chanceToSpawnAStar = 25.5; // chance of a gem being spawned as a star (between 0 - 100)
    queue;// Queue containing all the pre shuffled gems to serve
    buffer;// the upcoming game pieces

    constructor(starProbability:number)
    {
        this.queue = [];
        this.buffer = [];
        this.refillQueue();
        this.chanceToSpawnAStar = starProbability;
    }

    public getBuffer() {
        return this.buffer;
    }

    /**
    * refill game pieces queue, with semi-random ordering
    */
    refillQueue() {
        let PIECE_COLOR = [gamePieceColors.gem1, gamePieceColors.gem2, gamePieceColors.gem3, gamePieceColors.gem4]; //represents 1 of the 4 types of gems available

        // Simulate a deck of multiple gems
        let a = (PIECE_COLOR.concat(PIECE_COLOR.concat(PIECE_COLOR).concat(PIECE_COLOR).concat(PIECE_COLOR))); 

        // shuffle the "deck" of possible gems pseudo randomly
        for (let i = a.length; i > 0; --i) {
            let j = Math.floor(Math.random() * i);
            let tmp = a[i - 1];
            a[i - 1] = a[j];
            a[j] = tmp;
        }

        let b = [];
        //Randomly decide if any of the pieces should be a star instead
        for (let i = a.length; i > 0; --i) {
            if (MathUtils.getChance(this.chanceToSpawnAStar)) {
                b.push(gamePieceTypes.star);
            }
            b.push(gamePieceTypes.gem);
        }

        // this.queue = a.concat(this.queue);
        this.queue = a.map(function (item, index) {
            return [item, b[index]];
        });

        if (this.buffer.length === 0) {
            this.buffer.push(this.queue.pop());
            this.buffer.push(this.queue.pop());
        }
        else if (this.buffer.length === 1) {
            this.buffer.push(this.queue.pop());
        }
    }

    spawn() {
        if (this.queue.length < 2) {
            this.refillQueue();
        }
        let piece1 = this.buffer.pop();
        let piece2 = this.buffer.pop();

        this.buffer.push(this.queue.pop());
        this.buffer.push(this.queue.pop());

        return new GamePiece(piece1[0], piece1[1], piece2[0], piece2[1]);
    }
}