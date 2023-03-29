import { gameModes, gameCharacters } from '../enums/enums';

export default {
    setGame(game) {
        this.game = game;
    },
    resetRound(opponents: gameCharacters[]){
        this.opponents = opponents;
        this.roundStats = {
            score: 0,
            gemsDestroyed: 0,
            maxChain: 0
        }
    },
    increaseRoundStats(score: number, gemsDestroyed: number, maxChain: number) {
        this.roundStats.score += score * 2;
        this.roundStats.gemsDestroyed += gemsDestroyed;
        if (this.roundStats.maxChain < maxChain) {
            this.roundStats.maxChain = maxChain;
        }
    },
    getRoundStats() {
        return this.roundStats;
    },
    startArcadeGame(character: gameCharacters, arcadeFloor: number) {
        this.game.setState("gamePlay",
            {
                restart: false,
                newGame: true,
                gameMode: gameModes.arcade,
                p1Character: character,
                p2Character: this.opponents[arcadeFloor - 1],
                stage: 1, // TODO: Verify if this is desired or there's a different way of selecting
                level: 1, // TODO: Verify if this is desired or there's a different way of selecting
                arcadeFloor
            }
        );
    },
    hasNextFloor(arcadeFloor: number) {
        return arcadeFloor < this.opponents.length;
    },
}