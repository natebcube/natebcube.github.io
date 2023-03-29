export enum gameplayVictoryConditions {
    normalVictory, // Just win the game
    timedVictory, // win before the time runs out
    objectiveVictory, // win after bringing an objective game peice to the bottom of the board
    chainVictory,// win after performing X amount of chains
    defenseVictory,// win after recieving X amount of counters
}


export enum gameAITypes {
    minion, boss
}

export enum gameAdventureStages {
    stage1 = 1,
    stage2 = 2,
    stage3 = 3,
}

export enum gameAdventureLevels {
    level1 = 1,
    level2 = 2,
    level3 = 3,
    level4 = 4,
    level5 = 5,
}

export enum gameCharacters {
    steven, amethyst, garnet, pearl, peridot, jasper, y_diamond, p_minion, j_minion, y_minion
}

export enum gameModes {
    adventure, arcade, versusHuman, versusComputer
}

export enum gamePieceTypes {
    none,
    gem,
    star,
    trash,
    objective,
}

export enum gamePieceColors {
    none, // Nothing/ No color
    gem1, // White gem
    gem2, // Pink gem
    gem3, // Red gem
    gem4, // Purple gem
    gemR, // Rainbow gem
}

export enum RectPart
{
    UP, UP_LEFT, UP_RIGHT, DOWN_LEFT, DOWN_RIGHT, DOWN, LEFT, RIGHT, CENTER
}

export enum gameOverButtons {
    none, retry, backToMenu, backToMap, goToNextLevel
}

export enum gameplayBoard {
    player1Board, player2Board
}

export enum gameplayStates {
    initGamelplay, // reset or init the gameplay components to it's initial state
    pause, // the game is paused
    spawningGamePiece, // Spawn a new game piece to the board
    playingGamePieceOnField, // The gameplay piece is on the board, read te inputs and move it accordingly, check for colissions
    lockingPlayingGamePiece, // The game piece collided with something, set the game piece on the board
    droppingFloatingPieces,// check for any floating game piece
    decreaseTrashTimers,// decrease the trash timers, change trash to gems as necesery
    checkForObjectiveVictoryConditionMeet, // check if the objective piece has dropped to the bottom of the board
    animateActivatedObjectiveVictoryCondition, // animate the objective being collected
    activateSpecialAbility, // Stops the action and activates the current character's special abilty
    animateActivatedGems, // aniamate the collected gem with something that makes it clear they have been collected
    activateStars, // Now that all the game pieces are in place, and nothing's is floating, activate all stars and remove as many gems as possible
    checkForCombos, // go back to drop the floating pieces and follow down untill it's not possible for the player to exchange more game pieces 
    spawningTrashGamePiece, // once everthing is sttled down, spawn the trash/counter pieces
    trashOnField,// the trash is current on the field, free falling untill it colides with any piece on the board
    lockingTrashGamePiece,// the trash piece collided with somethign on the board, set the puieces on the board
    droppingFloatingTrashPiece,// the trash piece collided with somethign on the board, set the puieces on the board
    startGameOverTransition, // the game piece has been spawned but there's no longer room on the board, so start fading the gameplay screen
    gameOverTransition, // fade the gameplay screen
    gameOver //once the fade out transition has finished, move to the "game over" screen 
}

export enum characterGemTints {
    steven = 0XFF6D89,
    amethyst = 0X7B21D3,
    pearl = 0XD3B3AE,
    garnet = 0XD60038,
}

export enum gameAIStates {
    waiting, // waiting for a new game piece to get to the field
    idle, // Doing nothing, pretty much just "distracted" untill it's time to "react"
    thinking, // evaluating all possible game move
    selectingMove, // selecting the move based on the highest awarded score for the given A.I.'s params
    playingMove, // moving the pice to the destination
    moveMade, // moving the pice to the destination
}

export enum gameAIMoveOptions {
    none,
    useAbility,
    left,//Moves the game peice to the left
    right, // moves the game peice to the right
    rotate,// rotates the game peice
    fastDrop,// drops the game peice as fast as possible
}