import { Star } from "pixi.js";
import GamePieceComponent from "./gamePiece/GamePieceComponent";
import FusionGemsChecker from '../../utils/FusionGemsChecker';
import { gamePieceColors, gamePieceTypes, RectPart } from "../../enums/enums";
import Debug from "../../Debug";

/**
 * Defines a grid like board of a given size
 */
export default class Board {


    rows: number;// number of rows
    cols: number;// number of colums
    grid: GamePieceComponent[][]; //a matrix representing all the spaces currently ocupied by a gamepieces
    gridStars: any[] = []; //array containing all the stars currently on the grid
    gridFusionGems: any[][] = []; //array containing all the fusion gems currently on the grid
    gridFloatingPieces: any[] = []; //array containing all the floating pieces currently on the grid

    //Grid navigation helpers
    inBounds = ([x, y]) => x !== undefined && y !== undefined && x >= 0 && x < this.rows && y >= 0 && y < this.cols;
    gridValue = ([x, y]) => this.inBounds([x, y]) ? this.grid[x][y] : undefined;
    goTop = ([x, y]): [any, any] => [x - 1, y];
    goBottom = ([x, y]): [any, any] => [x + 1, y];
    goLeft = ([x, y]): [any, any] => [x, y - 1];
    goRight = ([x, y]): [any, any] => [x, y + 1];
    
    checker: FusionGemsChecker;
    /**
     * 
     * @param {number} rows The amount of rows
     * @param {number} cols The amount of colums
     * @param {Array} initialBoardConfiguration A given matrix n*m of the initial positions initially filled by trash (default empty)
     */
    constructor(rows: number, cols: number, initialBoardConfiguration = null) {
        this.rows = rows;
        this.cols = cols;
        this.initBoard();
        this.checker = new FusionGemsChecker(this.grid);        
        
        if (initialBoardConfiguration)
            this.setInitialBoarPieces(initialBoardConfiguration);

        
    }

    private setInitialBoarPieces(initialBoardConfiguration) {
        let ocupiedRows = initialBoardConfiguration ? initialBoardConfiguration.length : 0;
        if (ocupiedRows <= 0)
            return;

        //make room for the initial board elements
        for (let i = 0; i < ocupiedRows; i++) {
            this.grid.shift();
        }

        initialBoardConfiguration.forEach(row => {
            this.grid.push(row);
        });

        initialBoardConfiguration = [];
    }

    clearRects() {
        this.checker.clearRects();
    }
    
    // Get rects from current grid
    findRects()
    {
        var rects = this.checker.findRects(this.grid);        
        for (let i = 0; i < rects.length; i++) {
            let points = rects[i];
            this.UpdateRectPointsInsideGrid(points);
            /*for (let j = 0; j < points.length; j++) 
            {           
                var p = points[j];
                this.grid[p.row][p.col].rectId = p.parent;
                this.grid[p.row][p.col].rectPart = p.rectPart;
            }*/
               
        }
        return rects;
    }

    initBoard() {
        this.grid = [];

        for (let i = 0; i < this.rows; i++) {
            let row: GamePieceComponent[] = [];
            for (let j = 0; j < this.cols; j++) {
                row.push(new GamePieceComponent(gamePieceColors.none, gamePieceTypes.none, 0));
            }
            this.grid.push(row);
        }
    }


    isBoardClean(): boolean {
        return this.grid[this.rows - 1].some((element) => {
            return element.pieceType !== gamePieceTypes.none;
        })
    }


    /**
    * Test if any provided position is not empty
    * @param   {Array} positions list of positions in form [row, col]
    * @returns {boolean}  collision status
    */
    collides(positions) {
        let row:number, col:number;
        for (let i = 0; i < positions.length; ++i) {
            row = positions[i][0];
            col = positions[i][1];
            
            if (row < 0 || row >= this.rows || 
                col < 0 || col >= this.cols || 
                this.grid[row][col].pieceType !== gamePieceTypes.none
                ) {

                return true;
            }
        }
        return false;
    }

    /**
    * Checks if given point belong to any rect
    * @param   {number} row Pieces row
    * @param   {number} col Pieces col
    * @returns {number}  Return rectId
    */
    belongToRect(row:number, col:number):number 
    {      
        return this.grid[row][col].rectId;        
    }

    /**
     * Set CanMove property true for piece
     * @param   {number} rectId Rect id where search positions
     * @param   {number} row Pieces row
     * @param   {number} col Pieces column
     
    setCanMove(rectId:number, row:number, col:number)
    {
        this.checker.SetMoveRect(rectId, row, col);
    }*/

    /**
     * Set CanMove property true for piece
     * @param   {number} rectId Rect id where search positions
     * @param   {number} row Pieces row
     * @returns {boolean} Return true if rect can move otherwise false
     */
    rectBaseCanMove(rectId:number):boolean
    {
        return this.checker.RectBaseCanMove(rectId);        
    }

    //bajar rectangulo en la grilla
    GoDownRectPosition(rectId:number)
    {
        var rectInfo = this.checker.GetRectPoints(rectId);        
        if(rectInfo===null || rectInfo===undefined)
        {            
            rectInfo = this.checker.GetRectPoints(rectId);
            if(rectInfo===null || rectInfo===undefined) return;
        }

        var rectPoints = rectInfo.points;
        var piece = this.grid[rectPoints[0].row][rectPoints[0].col];

        //reset rectangle en grilla
        for(var j=0; j<rectPoints.length; j++)
        {
            var point = rectPoints[j];            
            this.grid[point.row][point.col] = new GamePieceComponent(gamePieceColors.none, gamePieceTypes.none, 0);                                                                       
        }

        //actualizar posicion del rectangulo 
        var rectInfo = this.checker.GetRectPoints(rectId);      
        rectPoints = rectInfo.points;
        
        //bajar posicion de rectangulo en la grilla
        for(var j=0; j<rectPoints.length; j++)
        {
            var p = rectPoints[j];
            if(p == null)
            {
                Debug.log("Puntos: "+p);
            }
            this.grid[p.row+1][p.col].rectId = p.parent;
            this.grid[p.row+1][p.col].rectPart = p.rectPart;
            this.grid[p.row+1][p.col].pieceColor = piece.pieceColor;
            this.grid[p.row+1][p.col].pieceType = piece.pieceType;
        }

        this.checker.GoDownPosition(rectId);
    }

    //aun no se ha usado esta funcion
    UpdateRectPointsInsideGrid(rectPoints:any[])
    {
        //rectPoints = this.checker.GoDownPosition(rectId);
        for(var j=0; j<rectPoints.length; j++)
        {
            var p = rectPoints[j];
            this.grid[p.row][p.col].rectId = p.parent;
            this.grid[p.row][p.col].rectPart = p.rectPart;
        }
    }

    /**
     * returns the top layer of board positions 
     */
    getTopmostBoardPositions(): number[][] {
        let topMost = [];

        for (let i = 0; i < this.cols; i++) {
            for (let j = this.rows - 1; j >= 0; j--) {

                if (this.inBounds([j, i]) && this.gridValue([j, i]).pieceType === gamePieceTypes.none) {
                    //add the position of the col's top-most element
                    topMost.push([j, i]);

                    //skip to next column
                    break;
                }
            }
        }
        return topMost;
    }

    /**
     * Activates all stars currently in the board
     */
    getBoardCollectablePieces() {

        let blowup = []

        this.getBoardStarsPositions();

        this.gridStars.forEach(posStar => {

            const result = this.isScorable(posStar, this.grid[posStar[0]][posStar[1]].pieceColor);
            if (result.length > 0)
                blowup.push(result);
        });

        return this.flatten(blowup);

    }

    decreaseTrashCounters(amount) {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.inBounds([j, i]) && this.gridValue([j, i]).pieceType === gamePieceTypes.trash) {
                    this.gridValue([j, i]).decreaseTimer(amount);
                }
            }
        }
    }

	hasTrash() {
		for (let i = 0; i < this.cols; i++) {
			for (let j = 0; j < this.rows; j++) {
				if (this.inBounds([j, i]) && this.gridValue([j, i]).pieceType === gamePieceTypes.trash) {
					return true;
				}
			}
		}
		return false;
	}

    lookForActivatableStars() {
        const activatableStars = this.gridStars.some(star => {

            return (
                (this.inBounds(this.goTop(star))
                    && ((this.gridValue(this.goTop(star)).pieceColor === this.gridValue(star).pieceColor)) || this.gridValue(star).pieceColor === gamePieceColors.gemR) && (this.gridValue(this.goTop(star)).pieceType != gamePieceTypes.trash && this.gridValue(this.goTop(star)).pieceType != gamePieceTypes.objective) ||
                (this.inBounds(this.goBottom(star))
                    && ((this.gridValue(this.goBottom(star)).pieceColor === this.gridValue(star).pieceColor)) || this.gridValue(star).pieceColor === gamePieceColors.gemR) && (this.gridValue(this.goBottom(star)).pieceType != gamePieceTypes.trash && this.gridValue(this.goBottom(star)).pieceType != gamePieceTypes.objective) ||
                (this.inBounds(this.goLeft(star))
                    && ((this.gridValue(this.goLeft(star)).pieceColor === this.gridValue(star).pieceColor)) || this.gridValue(star).pieceColor === gamePieceColors.gemR) && (this.gridValue(this.goLeft(star)).pieceType != gamePieceTypes.trash && this.gridValue(this.goLeft(star)).pieceType != gamePieceTypes.objective) ||
                (this.inBounds(this.goRight(star))
                    && ((this.gridValue(this.goRight(star)).pieceColor === this.gridValue(star).pieceColor)) || this.gridValue(star).pieceColor === gamePieceColors.gemR) && (this.gridValue(this.goRight(star)).pieceType != gamePieceTypes.trash && this.gridValue(this.goRight(star)).pieceType != gamePieceTypes.objective)
            );
        });

        return activatableStars;

    }
  
    /**
     * Remueve el rectangulo fusionado al que pertenece cada punto 
     * @param piecesToClean Puntos de piezas en la grilla
     */
    cleanFusionPositions(piecesToClean)
    {
        this.checker.RemoveRectPositions(piecesToClean);
        Debug.log("Clean: ", this.grid);
    }

    flatten = <T>(arrays: T[][]) => arrays.reduce((a, b) => a.concat(b), []);

    /**
     * Cleans the rows from gems that have been turned into points (by using a star)
     */
    cleanGridPositions(rows: any) {
        if (rows.length > 0) {
            rows.forEach(element => {
                this.grid[element[0]][element[1]] = new GamePieceComponent(gamePieceColors.none, gamePieceTypes.none, 0);
            });
        }
    }

    setAll(positions: any, gamePiece: GamePieceComponent[]) {

        for (let i = 0; i < positions.length; ++i) {
            this.grid[positions[i][0]][positions[i][1]].pieceColor = gamePiece[i].pieceColor;
            this.grid[positions[i][0]][positions[i][1]].pieceType = gamePiece[i].pieceType;
            this.grid[positions[i][0]][positions[i][1]].timer = gamePiece[i].timer;

        }
    }


    isScorable(rows, colors) {

        let positionsToClean = [];
        let positionsToCheck = [];
        positionsToCheck.push(rows);
        let color = colors;

        if (positionsToCheck.length < 1)
            return positionsToClean;

        do {

            let currentPositions = positionsToCheck;
            positionsToCheck = [];

            for (let i = 0; i < currentPositions.length; i++) {

                const skip = positionsToClean.some(val => val[0] === currentPositions[i][0] && val[1] === currentPositions[i][1]);

                if (skip)
                    continue;

                const position = currentPositions[i];
                const starColor = color;
                const y = position[0];
                const x = position[1];

                if (
                    this.inBounds(this.goTop([y, x]))
                    && (this.gridValue(this.goTop([y, x])).pieceColor === starColor || starColor === gamePieceColors.gemR)
                    && (this.gridValue(this.goTop([y, x])).pieceType === gamePieceTypes.gem || this.gridValue(this.goTop([y, x])).pieceType === gamePieceTypes.star)
                ) {
                    positionsToCheck.push(this.goTop([y, x]));
                }

                if (
                    this.inBounds(this.goBottom([y, x]))
                    && (this.gridValue(this.goBottom([y, x])).pieceColor === starColor || starColor === gamePieceColors.gemR)
                    && (this.gridValue(this.goBottom([y, x])).pieceType === gamePieceTypes.gem || this.gridValue(this.goBottom([y, x])).pieceType === gamePieceTypes.star)
                ) {
                    positionsToCheck.push(this.goBottom([y, x]));
                }

                if (
                    this.inBounds(this.goLeft([y, x]))
                    && (this.gridValue(this.goLeft([y, x])).pieceColor === starColor || starColor === gamePieceColors.gemR)
                    && (this.gridValue(this.goLeft([y, x])).pieceType === gamePieceTypes.gem || this.gridValue(this.goLeft([y, x])).pieceType === gamePieceTypes.star)
                ) {
                    positionsToCheck.push(this.goLeft([y, x]));
                }

                if (
                    this.inBounds(this.goRight([y, x]))
                    && (this.gridValue(this.goRight([y, x])).pieceColor === starColor || starColor === gamePieceColors.gemR)
                    && (this.gridValue(this.goRight([y, x])).pieceType === gamePieceTypes.gem || this.gridValue(this.goRight([y, x])).pieceType === gamePieceTypes.star)
                ) {
                    positionsToCheck.push(this.goRight([y, x]));
                }

                positionsToClean.push(position);
            }


        } while (positionsToCheck.length > 0)

        if (positionsToClean.length > 1) {
            return positionsToClean;
        }
        return [];
    }

    getBoardGamepiceByType(pieceType: gamePieceTypes): GamePieceComponent[] {

        const gamePieces = new Set<GamePieceComponent>();

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.grid[j][i].pieceType === pieceType) {
                    gamePieces.add(this.grid[j][i]); //Store
                }
            }
        }

        return Array.from(gamePieces);
    }

    getBoardGamepiceTypePositions(pieceType: gamePieceTypes): number[][] {

        const gamePieces = new Set<number[]>();

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.grid[j][i].pieceType === pieceType) {
                    gamePieces.add([j, i]); //Store
                }
            }
        }

        return Array.from(gamePieces);
    }

    getBoardStarsPositions() 
    {
        this.gridStars = this.getBoardGamepiceTypePositions(gamePieceTypes.star);
    } 

    hasFloatingPieces(): boolean {
        let tempFloatingPieces = new Set();

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (
                    (this.inBounds(this.goBottom([i, j])))
                    && (this.gridValue([i, j]).pieceType !== gamePieceTypes.none)
                    && (this.gridValue(this.goBottom([i, j])).pieceType === gamePieceTypes.none)
                ) {
                    tempFloatingPieces.add([i, j]); //Store
                }
            }
        }

        var floatingPieces = Array.from(tempFloatingPieces);
        var floatingPiecesFiltered = [];
        for (let ind = 0; ind < floatingPieces.length; ind++) {
            const point = floatingPieces[ind];
            var row = point[0];
            var col = point[1];
            var rectId = this.grid[row][col].rectId;
            var rectPart = this.grid[row][col].rectPart; // de 3-5 son partes de abajo del rect

            if(this.existRect(floatingPiecesFiltered,rectId))
            {
                continue;
            }

            if(rectId<0 || rectPart<3 || rectPart>5)
            {
                floatingPiecesFiltered.push(point);
                continue;
            }else{
                var rectInfo = this.checker.GetRectPoints(rectId);
                
                if(rectInfo==null || rectInfo==undefined )
                {
                    Debug.log("rectInfo: ",rectInfo);
                    rectInfo = this.checker.GetRectPoints(rectId);
                }
                
                var rectPoints = rectInfo.points;
                var canMove = true;
                //es necesario actualizar las posiciones de los rectangulos                
                for (let j = 0; j < rectPoints.length; j++) {
                    const element = rectPoints[j];
                    if(element.rectPart==RectPart.DOWN || element.rectPart==RectPart.DOWN_RIGHT || element.rectPart==RectPart.DOWN_LEFT)
                    {
                        if(!this.inBounds(this.goBottom([element.row,element.col])) || 
                        this.gridValue(this.goBottom([element.row, element.col])).pieceType !== gamePieceTypes.none)
                        {
                            canMove = false;
                        }
                    }
                }
                if(canMove)
                {
                    floatingPiecesFiltered.push(point);
                }
            }
        }
        this.gridFloatingPieces = Array.from(floatingPiecesFiltered);
        return this.gridFloatingPieces.length > 0;        
    }

    private existRect(floatingPieces:any[], rectId:number)
    {
        for (let index = 0; index < floatingPieces.length; index++) {
            const point = floatingPieces[index];
            var row = point[0];
            var col = point[1];
            var piece = this.grid[row][col];
            if(piece.rectId == rectId && piece.rectPart>2 && piece.rectPart<6)
            {
                return true;
            }            
        }
        return false;
    }

    get(row:number, col:number) {

        return this.gridValue([row, col]);
    }
}