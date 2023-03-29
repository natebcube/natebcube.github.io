import { gamePieceColors, gamePieceTypes, RectPart } from "../enums/enums";
import GamePieceComponent from "../menu/gameplay/gamePiece/GamePieceComponent";
import Debug from "../Debug";

/**
 * Defines a grid like board of a given size
 */
export default class FusionGemsChecker
{

    index: number = 0;
    rectsList: any[] = [];
    cantidad: number = 0;
    color: number = 1;
    squares: any[] = [];
    matrix:GamePieceComponent[][];
    
    constructor(mat:GamePieceComponent[][])
    {
        this.matrix = mat;
    } 
    
    /**
     * Set variables like first time     
     */
    reset()
    {
        this.index = 0;
        //this.squareList = [];
        this.cantidad = 0;
        this.color = 0;
        this.squares = [];
    }

    clearRects() {
        this.rectsList = [];
    }
    
    /**
     * Check for each point in matrix to find squares out
     * @param(name="mat"): Matrix 
     */
    findRects(mat:GamePieceComponent[][])
    {
        this.reset();        
        this.matrix = mat;
        Debug.log("Matrix: ",this.matrix);
        
        if(this.rectsList.length > 0)
        {
            this.CheckFromPrevRects();    
        }
        
        this.cantidad = this.rectsList.length;

        var t0 = performance.now();

        // esto se podria mejorar adaptando la funcion CheckFromPrevRects
        for(var r=0; r<this.matrix.length; r++)
        {      
            for(var c=0; c<this.matrix[0].length; c++)
            {
                //console.log("Matrix i: "+r+"-- j: "+c+" = "+matrix[r][c]);
                this.squares = [];
                this.index = 0;
                if(r>=this.matrix.length || c>=this.matrix[0].length) {}
                else{
                    if(c>=this.matrix[0].length || c+1>=this.matrix[0].length) continue;
                    if(r>=this.matrix.length || r+1>=this.matrix.length) continue;
                    
                    var gem:GamePieceComponent = this.matrix[r][c];                    
                    if(gem.pieceType != gamePieceTypes.gem) continue;
                    
                    this.color = gem.pieceColor;                      
                    
                    
                    var right = this.matrix[r][c+1];
                    var downRight = this.matrix[r+1][c+1];
                    var down = this.matrix[r+1][c];
                    
                    var hasParent = this.HasParent({row:r,col:c});
                    var hasSameColor = this.HasSameColor(r,c,this.color);
                    //right.pieceColor==this.color && downRight.pieceColor==this.color && down.pieceColor==this.color;
                    var hasSameType = this.HasSameType(r,c,gamePieceTypes.gem);
                    //right.pieceType==gamePieceTypes.gem && downRight.pieceType==gamePieceTypes.gem && down.pieceType==gamePieceTypes.gem;
                    
                    if(hasSameColor && hasSameType && !hasParent)
                    {
                        //se agregan los puntos del cuadrado
                        this.squares[this.index]= {row: r, col:c, parent: this.cantidad};
                        this.index++;
                        this.squares[this.index]= {row: r, col:c+1, parent: this.cantidad};
                        this.index++;
                        this.squares[this.index]= {row: r+1, col:c+1, parent: this.cantidad};
                        this.index++;
                        this.squares[this.index]= {row: r+1, col:c, parent: this.cantidad};
                        this.index++;
                        
                        //se revisa si el cuadrado se puede extender
                        this.checkChildrenPoints(this.matrix[0].length,this.matrix.length);
                        this.rectsList[this.cantidad] = this.squares;
                        this.cantidad++;                
                        Debug.log("Encontro");
                    }else{
                        //console.log("NO Encontro x: "+j+"-- y: "+i);
                    }
                }

            }           
        }   
        
        this.SettingRectParts();
        var t1 = performance.now();
        Debug.log("Duration " + (t1 - t0) + " milliseconds.");

        for(var i=0; i< this.rectsList.length; i++)
        {
            Debug.log("Squares: ",this.rectsList[i]);
        }
        
        return this.rectsList;
    }
    
    private SettingRectParts()
    {
        for (let index = 0; index < this.rectsList.length; index++) {
            var topRow = 1000;
            var leftCol = 1000;
            var bottomRow = -1;        
            var rightCol = -1;
            const rect:any[] = this.rectsList[index];

            for (let j = 0; j < rect.length; j++) {
                const point = rect[j];
                if(point.row<topRow) topRow = point.row;
                if(point.row>bottomRow) bottomRow = point.row;
                if(point.col<leftCol) leftCol = point.col;
                if(point.col>rightCol) rightCol = point.col;
            } 
            
            for (let k = 0; k < rect.length; k++) {
                const point = rect[k];
                if(point.row == topRow && point.col == leftCol) 
                    this.rectsList[index][k].rectPart = RectPart.UP_LEFT;

                if(point.row == topRow && point.col == rightCol) 
                    this.rectsList[index][k].rectPart = RectPart.UP_RIGHT;

                if(point.row == bottomRow && point.col == leftCol) 
                    this.rectsList[index][k].rectPart = RectPart.DOWN_LEFT;
                
                if(point.row == bottomRow && point.col == rightCol) 
                    this.rectsList[index][k].rectPart = RectPart.DOWN_RIGHT;
                    
                if(point.row == topRow && point.col>leftCol && point.col<rightCol) 
                    this.rectsList[index][k].rectPart = RectPart.UP;
                    
                if(point.row == bottomRow && point.col>leftCol && point.col<rightCol) 
                    this.rectsList[index][k].rectPart = RectPart.DOWN;

                if(point.row > topRow && point.row < bottomRow && point.col==leftCol) 
                    this.rectsList[index][k].rectPart = RectPart.LEFT;

                if(point.row > topRow && point.row < bottomRow && point.col==rightCol) 
                    this.rectsList[index][k].rectPart = RectPart.RIGHT;

                if(point.row > topRow && point.row < bottomRow && point.col>leftCol && point.col<rightCol) 
                    this.rectsList[index][k].rectPart = RectPart.CENTER;
            }
        }
    }
    
    /**
     * Check each point at right, down right and down positions if they are same color
     * @param(name="row"): Row number 
     * @param(name="col"): Column number
     * @param(name="color"): Color number     
     */
    private HasSameColor(row, col, color):boolean
    {
        var right = this.matrix[row][col+1];
        var downRight = this.matrix[row+1][col+1];
        var down = this.matrix[row+1][col];

        return right.pieceColor==color && downRight.pieceColor==color && down.pieceColor==color;                   
    }
    
    /**
     * Check each point at right, down right and down positions if they are same type
     * @param(name="row"): Row number 
     * @param(name="col"): Column number
     * @param(name="color"): Color number     
     */
    private HasSameType(row:number, col:number, gemType):boolean
    {
        var right = this.matrix[row][col+1];
        var downRight = this.matrix[row+1][col+1];
        var down = this.matrix[row+1][col];

        return right.pieceType==gemType && downRight.pieceType==gemType && down.pieceType==gemType;
    }
    
    /**
     * Check each point from rectangle stored and search points to continue growing
     * @param(name="limRow"): Row limit number 
     * @param(name="limCol"): Column limit number         
     */  
    private checkChildrenPoints(limCol:number,limRow:number)
    {    
        var ind = 0;
        Debug.log("Square: ",this.squares);
        while(ind<this.squares.length)
        {
            /*if(this.squares[ind].isStart)
            {
                ind++;
                continue;
            }*/

            var r = this.squares[ind].row;
            var c = this.squares[ind].col;

            if(c>=this.matrix[0].length || c+1>=this.matrix[0].length || r>=this.matrix.length || r+1>=this.matrix.length) 
            {
                ind++;
                continue;
            }

            
            var right = this.matrix[r][c+1];
            var down = this.matrix[r+1][c];
            var downRight = this.matrix[r+1][c+1];

            if(down.pieceColor==this.color && down.pieceType==gamePieceTypes.gem && r+1<limRow && down.rectId<0)
            {
                if(right.pieceColor==this.color && right.pieceType==gamePieceTypes.gem && c+1<limCol && right.rectId<0)
                {
                    if(downRight.pieceColor==this.color && downRight.pieceType==gamePieceTypes.gem && downRight.rectId<0)
                    {                    

                        if(!this.Contains(this.squares, {row: r, col: c+1}))
                        {
                            this.squares[this.index]= {row: r, col:c+1, parent: this.cantidad};
                            this.index++;
                        }

                        if(!this.Contains(this.squares, {row: r+1, col: c+1}))
                        {
                            this.squares[this.index]= {row: r+1, col:c+1, parent: this.cantidad};
                            this.index++;
                        }

                        if(!this.Contains(this.squares, {row: r+1, col: c}))
                        {
                            this.squares[this.index]= {row: r+1, col:c, parent: this.cantidad};
                            this.index++;
                        }                                        
                    } 
                }else{
                    if(c+1<limCol) limCol = c+1;
                }

            }else{
                if(r+1<limRow) limRow = r+1;
            }  

            ind++;
        }    
    }
    
    /**
     * Check if array contains element same point
     * @param(name="arr"): Array of points     
     * @param(name="element"): Row limit number       
     */     
    private Contains(arr, element)
    {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].row == element.row && arr[i].col == element.col) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Check if element has parent or belong another rectangle
     * @param(name="element"): Row limit number       
     */  
    private HasParent(element)
    {
        for (var i = 0; i < this.rectsList.length; i++) {
            for (var j = 0; j < this.rectsList[i].length; j++)
            {
                if (this.rectsList[i][j].parent>-1 && this.rectsList[i][j].row == element.row && this.rectsList[i][j].col == element.col) {
                    return true;
                }

                if (this.rectsList[i][j].parent>-1 && this.rectsList[i][j].row == element.row+1 && this.rectsList[i][j].col == element.col+1) {
                    return true;
                }

                if (this.rectsList[i][j].parent>-1 && this.rectsList[i][j].row == element.row+1 && this.rectsList[i][j].col == element.col) {
                    return true;
                }

                if (this.rectsList[i][j].parent>-1 && this.rectsList[i][j].row == element.row && this.rectsList[i][j].col == element.col+1) {
                    return true;
                }
            }
        }
        return false;
    }
    
    /*
    * Busca en los rectangulos existentes si es posible ser mas grande y lo aplica
    */
    private CheckFromPrevRects()
    {           
        
        for (var i = 0; i < this.rectsList.length; i++) 
        {
            var topRow = 1000;
            var leftCol = 1000;
            var bottomRow = -1;        
            var rightCol = -1;
            
            for (var j = 0; j < this.rectsList[i].length; j++)
            {
                Debug.log("Current Squares",this.rectsList[i][j]);
                var point = this.rectsList[i][j];                
                if(point.row<topRow) topRow = point.row;
                if(point.row>bottomRow) bottomRow = point.row;
                if(point.col<leftCol) leftCol = point.col;
                if(point.col>rightCol) rightCol = point.col;
            }
            
            
            // se revisa si se puede extender el rectangulo existente hacia alguna direccion
            var canExtend = this.CheckTop(topRow,leftCol,rightCol);
            while(canExtend)
            {
                for(var k=leftCol; k<=rightCol; k++)
                {
                    var len = this.rectsList[i].length;
                    this.rectsList[i][len]= {row: topRow-1, col:k, parent: i};
                }
                topRow -= 1; 
                canExtend = this.CheckTop(topRow,leftCol,rightCol);
            }      
         
            // revisa si puede extenderse hacia abajo         
            canExtend = this.CheckBottom(bottomRow,leftCol,rightCol);
            while(canExtend)
            {
                for(var k=leftCol; k<=rightCol; k++)
                {
                    var len = this.rectsList[i].length;
                    this.rectsList[i][len]= {row: bottomRow+1, col:k, parent: i};
                }
                bottomRow += 1;
                canExtend = this.CheckBottom(bottomRow,leftCol,rightCol);
            }
            
            // revisa si puede extenderse hacia la izquierda
            canExtend = this.CheckLeft(leftCol,topRow,bottomRow);
            while(canExtend)
            {
                for(var k=topRow; k<=bottomRow; k++)
                {
                    var len = this.rectsList[i].length;
                    this.rectsList[i][len]= {row: k, col:leftCol-1, parent: i};
                }
                leftCol -= 1;
                canExtend = this.CheckLeft(leftCol,topRow,bottomRow);
            }
            
            // revisa si puede extenderse hacia la derecha
            canExtend = this.CheckRight(rightCol,topRow,bottomRow);
            while(canExtend)
            {
                for(var k=topRow; k<=bottomRow; k++)
                {
                    var len = this.rectsList[i].length;
                    this.rectsList[i][len]= {row: k, col:rightCol+1, parent: i};
                }
                rightCol += 1;
                canExtend = this.CheckRight(rightCol,topRow,bottomRow);
            }
        }
    }
    
    private CheckTop(row:number, left:number, right:number):boolean
    {
        for(var i=left; i<=right; i++)
        {
            var piece:GamePieceComponent = this.matrix[row][i];
            if(row>0)
            {
                var pieceTop:GamePieceComponent = this.matrix[row-1][i];                
                if(piece.pieceColor != pieceTop.pieceColor || piece.pieceType != pieceTop.pieceType || pieceTop.rectId >= 0)
                {                    
                    return false;
                }
            }else{
                return false;
            }            
        }
        return true;
    }
    
    private CheckBottom(row:number, left:number, right:number):boolean
    {
        for(var i=left; i<=right; i++)
        {
            var piece:GamePieceComponent = this.matrix[row][i];
            if(row<this.matrix.length-1)
            {
                var pieceBottom:GamePieceComponent = this.matrix[row+1][i];
                if(piece.pieceColor != pieceBottom.pieceColor || piece.pieceType != pieceBottom.pieceType || pieceBottom.rectId >= 0)
                {                    
                    return false;
                }
            }else{
                return false;
            }            
        }
        return true;
    }
    
    private CheckLeft(col:number, top:number, bottom:number):boolean
    {
        for(var i=top; i<=bottom; i++)
        {
            var piece:GamePieceComponent = this.matrix[i][col];
            if(col>0)
            {
                var pieceLeft:GamePieceComponent = this.matrix[i][col-1];
                if(piece.pieceColor != pieceLeft.pieceColor || piece.pieceType != pieceLeft.pieceType || pieceLeft.rectId >= 0)
                {                    
                    return false;
                }
            }else{
                return false;
            }            
        }
        return true;
    }
    
    private CheckRight(col:number, top:number, bottom:number):boolean
    {
        for(var i=top; i<=bottom; i++)
        {
            var piece:GamePieceComponent = this.matrix[i][col];
            if(col<this.matrix[i].length-1)
            {
                var pieceRight:GamePieceComponent = this.matrix[i][col+1];
                if(piece.pieceColor != pieceRight.pieceColor || piece.pieceType != pieceRight.pieceType || pieceRight.rectId >= 0)
                {                    
                    return false;
                }
            }else{
                return false;
            }            
        }
        return true;
    }
    
    /** 
    * Cada punto recibido es buscado en la lista de rectangulos, si pertenece a uno de ellos, quita el rectangulo de la lista
    */    
    RemoveRectPositions(rectPositions:any[])
    {
        var rectListTemp = [];        
        for(var i=0; i< this.rectsList.length; i++)
        {       
            var canAdd = true;     
            for(var j=0; j< this.rectsList[i].length; j++)
            {                   
                for(var k=0; k<rectPositions.length; k++)
                {
                    var row = rectPositions[k][0];
                    var col = rectPositions[k][1];
                    if(this.rectsList[i][j].col == col && this.rectsList[i][j].row == row )
                    {     
                        canAdd = false;
                    }                    
                }  
            }

            if(canAdd)
            {
                rectListTemp.push(this.rectsList[i]);
            }            
        }        
        
        this.rectsList = rectListTemp;
    }

    /*SetMoveRect(rectId:number, row:number, col:number)
    {           
        var rectPoints = this.GetRectPoints(rectId);
        for(var j=0; j<rectPoints.points.length; j++)
        {
            var piece = rectPoints[j];
            if(piece.rectPart == RectPart.DOWN || piece.rectPart == RectPart.DOWN_LEFT || piece.rectPart == RectPart.DOWN_RIGHT)
            {
                if(piece.row == row && piece.col==col)
                {
                    piece.canMove=true;                    
                }                
            }
        }
    }*/

    /**
     * Revisa si la base del rectangulo no tiene nada debajo de ella para permitir su desplazamiento hacia abajo
     * @param rectId Id del rectangulo
     */
    RectBaseCanMove(rectId:number):boolean
    {
        var rectInfo = this.GetRectPoints(rectId);
        for(var j=0; j<rectInfo.points.length; j++)
        {
            var piece = rectInfo[j];
            if(piece.rectPart == RectPart.DOWN || piece.rectPart == RectPart.DOWN_LEFT || piece.rectPart == RectPart.DOWN_RIGHT)
            {
                if(!piece.canMove)
                {
                    return false;               
                }                
            }
        }
        return true;
    }    

    /**
     * Retorna lo puntos que conforman un rectangulo
     * @param rectId Id del rectangulo
     */
    GetRectPoints(rectId:number)
    {
        if(this.rectsList.length>0)
        {
            for (let index = 0; index < this.rectsList.length; index++) {
                const points = this.rectsList[index];
                if(points[0].parent == rectId)
                {
                    return {"index":index, "points":points};
                }
            }
        }
        console.log("No existe rectId: "+rectId+ " en RectList: ",this.rectsList);
        return null;
    }

    GoDownPosition(rectId:number)
    {        
        var rectInfo = this.GetRectPoints(rectId);
        var points = rectInfo.points;
        for (let index = 0; index < points.length; index++) {
            points[index].row += 1;           
        }
        return this.ReplaceRect(points, rectInfo.index);
    }

    private ReplaceRect(points:any[], index:number)
    {
        if(this.rectsList.length>0)
        {
            this.rectsList[index] = points;
        }

        return this.rectsList[index];
    }
}