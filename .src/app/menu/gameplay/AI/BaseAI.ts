import Board from "../Board";
import MathUtils from "../../../utils/MathUtils";
import { Buffer } from "pixi.js";
import GamePieceSpawner from "../GamePieceSpawner";
import GamePiece from "../gamePiece/GamePiece";
import { gamePieceColors, gameAIStates, gameAIMoveOptions, gamePieceTypes } from "../../../enums/enums";
import IDecisionMakingAIParams from "./IDecisionMakingAIParams";
import GamePieceComponent from "../gamePiece/GamePieceComponent";
import Debug from "../../../Debug";

/**
 * Base class for the game's A.I.
 */
export default class BaseAI {

    //#region Private Properties

    //#region A.I.'s Meters

    // Sets up a "reward system" for the A.I. to calculate the "best move" based on what
    // possible set of moves is most favorable given the points awarded for each possible move
    rateOfError: number; // How often the A.I. "Brainfarts" (A.K.A. Chooses a move at random)
    superGemPriority: number; // how ofter the A.I. uses it's character's special hability  (Range [0-10])
    specialAbilityPriority: number; // how ofter the A.I. uses it's character's special hability  (Range [0-10])
    chainScore: number; // how ofter the A.I. uses it's character's special hability  (Range [0-10])
    heightAversion: number;
    biasTowardsColor: gamePieceColors; //A.I.'s Favorite gem color (most likely to choose this color over all possible others)
    hasFutureSight: boolean;
    aggression: number; // Level from 0 to 10 (Range [0-10])
    dropPieceTimer: number; // How fast the AI Fast drops the game piece
    currentDropPieceTimer: number; // How fast the AI Fast drops the game piece
    reactionSpeed: number; //how fast the AI takes between move  (Range [0-10])
    specialAbilityUsageRate: number;

    //#endregion

    reactionSpeedTimer: number; //The current timer for the A.I.'s next reaction
    gameBoard: Board;
    currentGamePiece: GamePiece;
    pieceSpawner: GamePieceSpawner;

    availablePosibilities = [];
    bestMovePosition;
    bestMoveGamePieceIndex = 0;
    bestMoveGamePieceRotationAmount = 0;
    currentAIPlaySequence: gameAIMoveOptions;
    currentState: any;
    private actionForActivateSkill:Function;

    //#endregion

    constructor(params: IDecisionMakingAIParams, board: Board, pieceSpawner: GamePieceSpawner, skillFunction:Function) {

        this.gameBoard = board;
        this.pieceSpawner = pieceSpawner;
        this.hasFutureSight = params.hasFutureSight;
        this.rateOfError = params.rateOfError;
        this.superGemPriority = params.superGemPriority;
        this.specialAbilityPriority = params.specialAbilityPriority;
        this.chainScore = params.chainPriority;
        this.heightAversion = params.heightAversion;
        this.biasTowardsColor = params.biasTowardsColor;
        this.aggression = params.aggression;
        this.dropPieceTimer = params.dropPieceTimer;
        this.currentDropPieceTimer = params.dropPieceTimer;
        this.reactionSpeed = params.reactionSpeed;
        this.specialAbilityUsageRate = params.specialAbilityUsageRate;
        this.reactionSpeedTimer = this.reactionSpeed;        
        this.actionForActivateSkill = skillFunction;

        this.setState(gameAIStates.waiting);
    }

    //#region Decision Making


    // Look at the current block and the next block and simulate ALL possible combinations (positions and rotations) of the two blocks.
    simulatePossibilities()
    {
        this.availablePosibilities = [];

        // No pieces on the board yet ?
        if (!this.gameBoard.isBoardClean()) {
            //just place the piece at random
            // const minValue = 0;
            const maxValue = this.gameBoard.cols;
            // const randomCol = Math.floor(Math.random() * (maxValue));
            const randomCol = MathUtils.getNumberInRandomRange(0, maxValue);

            this.availablePosibilities.push([0, randomCol]);
            this.setState(gameAIStates.selectingMove);
            return;
        }
        else {
            // get all the top-most game pieces
            this.availablePosibilities = this.gameBoard.getTopmostBoardPositions().map(x => this.gameBoard.goBottom([x[0], x[1]]));
            this.setState(gameAIStates.selectingMove);
        }

    }

    SpawnPiece(pieceSpawned:GamePiece,board:Board)
    {
        this.gameBoard = board;
        this.currentGamePiece = pieceSpawned;        
        this.setState(gameAIStates.thinking);
    }

    // Calculate a score for each of the positions.
    private scorePossibleMoves()
    {
        this.bestMovePosition = null;        
                
        var allScorePositions = [];
        for (let i = 0; i < 4; i++) 
        {   
            var isVertical = i == 0 || i == 2;
            var posIndex = {};
            if(i==0 || i==3)
            {
                posIndex = [0,1];
            }else {
                posIndex = [1,0];
            }
            // Debug.log("Current Color Piece: "+this.GetColorName(this.currentGamePiece.gamePieceComponent[0].pieceColor));
            // rotacion = 0 => gamePieceComponent[0] estara arriba de la pareja de piezas y [1] estara en la parte de abajo
            // rotacion = 1 => gamePieceComponent[0] estara a la derecha de la pareja de piezas y [1] estara en el izquierda
            // rotacion = 2 => gamePieceComponent[0] estara abajo de la pareja de piezas y [1] estara en el arriba
            // rotacion = 3 => gamePieceComponent[0] estara a la izquierda de la pareja de piezas y [1] estara a la derecha
            var firstPiece = this.currentGamePiece.gamePieceComponent[posIndex[0]];
            var secondPiece = this.currentGamePiece.gamePieceComponent[posIndex[1]];

            var resultsFirstPiece = this.GetResultPositions(firstPiece, this.availablePosibilities, isVertical, posIndex[0], i);
            var resultsSecondPiece = this.GetResultPositions(secondPiece, this.availablePosibilities, isVertical, posIndex[1], i);

            if(i==0 || i==2) //proceso normal
            {                
                //se combinan los resultados
                for (let index = 0; index < resultsSecondPiece.length; index++) 
                {
                    var tempTopScore = 0;
                    if(resultsFirstPiece[index] != null) tempTopScore = resultsFirstPiece[index].score;            
                    resultsSecondPiece[index].score += tempTopScore;            
                }
                allScorePositions = allScorePositions.concat(resultsSecondPiece);
            }else if(i==1) //proceso normal
            {
                // Se combinan los resultados
                // FirstPiece = derecha
                // SecondPiece = izquierda
                for (let index = 0; index < resultsFirstPiece.length; index++) 
                {
                    var tempTopScore = 1;
                    if(index == 0)
                    {
                        resultsFirstPiece[index].score = tempTopScore;   
                    }else{
                        if(resultsSecondPiece[index-1] != null) tempTopScore = resultsSecondPiece[index-1].score;            
                        resultsFirstPiece[index].score += tempTopScore;  
                    }    
                }
                allScorePositions = allScorePositions.concat(resultsFirstPiece);
            }else{
                //se combinan los resultados
                for (let index = 0; index < resultsFirstPiece.length; index++) 
                {
                    var tempTopScore = 1;
                    if(index == resultsFirstPiece.length-1)
                    {
                        resultsSecondPiece[index].score = tempTopScore;   
                    }else{
                        if(resultsFirstPiece[index+1] != null) tempTopScore = resultsFirstPiece[index+1].score;            
                        resultsSecondPiece[index].score += tempTopScore;  
                    }                               
                }
                allScorePositions = allScorePositions.concat(resultsSecondPiece);
            }            
        }

        //console.log("allScorePositions: ",allScorePositions);
        
        // buscar mejor score
        var scoreTemp = 0;
        for (let index = 0; index < allScorePositions.length; index++) {
            const element = allScorePositions[index];
            if(element.score > scoreTemp || (element.score == scoreTemp && this.bestMovePosition[0] > element.position))
            {
                scoreTemp = element.score;
                this.bestMovePosition = element.position;
                this.bestMoveGamePieceRotationAmount = element.rotation;
            }
        }

        // en caso de que no encontrara una posicion
        if(this.bestMovePosition == null)
        {
            var minTop = 0;
            for (let i = 0; i < this.availablePosibilities.length; i++)            
            {
                var pos = this.availablePosibilities[i];            
                var piece = this.gameBoard.gridValue(pos);
                if(piece == null)
                {
                    this.bestMovePosition = pos;
                    minTop = pos[0];  
                    //console.log("Encontro nulo: ",piece);
                    break;
                }
                if(piece.pieceType == gamePieceTypes.none || pos[0]>minTop)
                {
                    this.bestMovePosition = pos;
                    minTop = pos[0];                    
                }
            }
        }
        
        this.setState(gameAIStates.playingMove);
    } 

    // analiza cuantos puntos puede hacer la pieza ubicandola X cantidad de unidades 
    // simuladamente encima de cada pieza de la lista
    // pos indica el index de la gema dentro del componente
    private GetResultPositions(piece:GamePieceComponent, topGems: any[], isVertical:boolean, posIndex:number, rotationVal: number):any[]   
    {
        let i = 0;
        let rowUnits = 0;
        let colUnits = 0;
        var positions = [];
        let finalIndex = topGems.length;        
        let startIndex = 0;
        if(isVertical)
        {   
            rowUnits = posIndex == 0 ? 1 : 0;                     
        }/*else{
            if(posIndex == 0)
            {
                colUnits = 0;
                finalIndex = topGems.length-1;
                startIndex = 0;
            }else{
                //colUnits = 1;
                finalIndex = topGems.length;
                startIndex = 1;
            }
        }*/
        
        for (let i = 0; i < topGems.length; i++)        
        {
            var pos = topGems[i];
            var seudoPiece = this.gameBoard.gridValue([pos[0]-1-rowUnits,pos[1]+colUnits]);            
            if(seudoPiece == null) continue;                       
                
            //console.log("Color Piece: "+this.GetColorName(piece.pieceColor));

            //se ubica virtualmente la pieza encima de la primera ficha de la columna
            var visitedPoints = [];
            var scoreTemp = this.GetWeight(piece);
            scoreTemp += this.getGemsAllDirections(pos[0]-1-rowUnits,pos[1], piece.pieceColor, visitedPoints, false);            
                        
            positions.push({score: scoreTemp, position:pos, rotation:rotationVal}); 
            
        }

        return positions;
    }

    // se busca todas las gemas del color recibido q se encuentran unidas por la derecha, izquierda o abajo
    // de las coordenadas recibidas
    private getGemsAllDirections(row:number, col:number, color: number, visitedPoints:any[], ignoreHeight:boolean):number
    {   
        var amount = 0;

        if(this.Exist(visitedPoints, row,col))
        {
            return amount;
        }else{

            var tempPiece = this.gameBoard.gridValue([row, col]);          
            amount = this.GetWeight(tempPiece);
            
            //se le adiciona la altura a la q se encuentra
            if(!ignoreHeight) amount += row;
            visitedPoints.push([row,col]);
        }

        //console.log("Points row: "+row+" -- col: "+col);
        var leftPiece = this.gameBoard.gridValue([row, col-1]);
        if(leftPiece!==undefined && leftPiece.pieceColor == color)
        {              
            amount += this.getGemsAllDirections(row, col-1, color, visitedPoints, true);
        }

        var rightPiece = this.gameBoard.gridValue([row, col+1]);
        if(rightPiece!==undefined && rightPiece.pieceColor == color)
        {           
            amount += this.getGemsAllDirections(row, col+1, color, visitedPoints, true);
        }

        var downPiece = this.gameBoard.gridValue([row+1, col]);
        if(downPiece!==undefined && downPiece.pieceColor == color)
        {           
            amount += this.getGemsAllDirections(row+1, col, color, visitedPoints, true);
        }
        return amount;
    }

    // busca en la lista la posicion
    private Exist(list:any[], row:number, col:number)
    {
        for (let index = 0; index < list.length; index++) {
            var element = list[index];            
            if(element[0]==row && element[1]==col)
            {
                return true;
            }
        }
        return false;
    }

    // valor designado para cada tipo de gema
    private GetWeight(piece:GamePieceComponent)
    {
        if(piece.pieceType == gamePieceTypes.star)
        {
            return 100; 
        }else if(piece.pieceType == gamePieceTypes.trash){
            return 5;
        }else if(piece.pieceType == gamePieceTypes.gem){
            return 3;
        }else{
            return 0;
        }
    }

    private TryToActivateSpecialSkill()
    {
        
        const randomValue = Math.random();
        Debug.log("Activate Skill Random: "+randomValue+" -- Priority: "+this.specialAbilityPriority);
        if(this.specialAbilityPriority > randomValue)
        {
            //activate skill
            if(this.actionForActivateSkill !=null) this.actionForActivateSkill();
        }
    }

    // solo se usa para debug de las gemas
    private GetColorName(id:number)
    {
        switch(id)
        {
            case gamePieceColors.gem1:
                return "White";

            case gamePieceColors.gem2:
                return "Pink";

            case gamePieceColors.gem3:
                return "Red";

            case gamePieceColors.gem4:
                return "Purple";            
        }
    }
    //#endregion

    //#region A.I. State Machine Handling

    handleCurrentState() {
       
        switch (this.currentState) {
            case gameAIStates.waiting:
                this.currentDropPieceTimer = this.dropPieceTimer;

                if (this.currentGamePiece === null) {
                    this.availablePosibilities = [];
                    return; // just wait
                }
                else {
                    this.setState(gameAIStates.idle)// There's a game pice on the field, now "react to it after a given period of time"
                }
                break;

            case gameAIStates.idle:
                // console.log("Idle");
                if ((this.reactionSpeedTimer -= 0.01) <= 0) {
                    this.setState(gameAIStates.thinking);
                    this.reactionSpeedTimer = this.reactionSpeed;
                }
                break;

            case gameAIStates.thinking:
                this.simulatePossibilities();
                break;

            case gameAIStates.selectingMove:                
                this.TryToActivateSpecialSkill();
                this.scorePossibleMoves();                
                break;

            case gameAIStates.playingMove:
                if ((this.reactionSpeedTimer -= 0.01) <= 0) 
                {                    
                    if(this.bestMovePosition == null) return;

                    if (this.currentGamePiece.absolutePos()[1][1] > this.bestMovePosition[1])
                    {
                        // this.currentGamePiece.col--;
                        this.currentAIPlaySequence = gameAIMoveOptions.left;
                    }
                    else if (this.currentGamePiece.absolutePos()[1][1] < this.bestMovePosition[1]) 
                    {
                        // this.currentGamePiece.col++;
                        this.currentAIPlaySequence = gameAIMoveOptions.right;
                    }
                    else 
                    {
                        this.currentDropPieceTimer -= this.reactionSpeed;
                    }

                    if (this.bestMoveGamePieceRotationAmount > 0) 
                    {
                        this.currentGamePiece.rotate();
                        this.bestMoveGamePieceRotationAmount--;
                    }

                    this.reactionSpeedTimer = this.reactionSpeed;
                }                
                break;

            case gameAIStates.moveMade:
                this.currentAIPlaySequence = gameAIMoveOptions.none;
                this.setState(gameAIStates.playingMove);
                break;

            default:
                break;
        }
    }

    setState(state: gameAIStates) {
        this.currentState = state;
    }
    //#endregion
}