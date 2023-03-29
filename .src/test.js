var index = 0;
var squareList = [];
var cantidad = 0;
var color = 1;
var squares = [];
var matrix = [
    [1,1,0,0,1],
    [1,1,0,1,0],
    [1,1,0,1,0],
    [1,0,1,1,1],
    [1,1,0,1,1]
];

//FindRects();

function FindRects()
{
    
    var t0 = performance.now();
    for(var r=0; r<matrix.length; r++)
    {      
        for(var c=0; c<matrix[0].length; c++)
        {
            //console.log("Matrix i: "+r+"-- j: "+c+" = "+matrix[r][c]);
            var squares = [];
            index=0;
            if(r>=matrix.length || c>=matrix[0].length) {}
            else{
                if(c>=matrix[0].length || c+1>=matrix[0].length) continue;
                if(r>=matrix.length || r+1>=matrix.length) continue;

                if(matrix[r][c]==color && matrix[r][c+1]==color && matrix[r+1][c+1]==color && matrix[r+1][c]==color && !HasParent({row:r,col:c}))
                {
                    squares[index]= {row: r, col:c, isStart: true, hasParent: true};
                    index++;
                    squares[index]= {row: r, col:c+1, isStart: false, hasParent: true};
                    index++;
                    squares[index]= {row: r+1, col:c+1, isStart: false, hasParent: true};
                    index++;
                    squares[index]= {row: r+1, col:c, isStart: false, hasParent: true};
                    index++;

                    recorrerPuntos(matrix[0].length,matrix.length);
                    squareList[cantidad] = squares;
                    cantidad++;                
                    console.log("Encontro");
                }else{
                    //console.log("NO Encontro x: "+j+"-- y: "+i);
                }
            }

        }           
    }   
    var t1 = performance.now();
    console.log("Duration " + (t1 - t0) + " milliseconds.");

    for(var i=0; i< squareList.length; i++)
    {
        console.log("Squares: ",squareList[i]);
    }
}


//limRow = limite para las filas
//limCol = limite para las columnas
function recorrerPuntos(limCol,limRow)
{    
    var ind = 0;
    while(ind<squares.length)
    {
        if(squares[ind].isStart)
        {
            ind++;
            continue;
        }
        
        var r = squares[ind].row;
        var c = squares[ind].col;
        
        if(c>=matrix[0].length || c+1>=matrix[0].length || r>=matrix.length || r+1>=matrix.length) 
        {
            ind++;
            continue;
        }
      
            
        var right = matrix[r][c+1];
        var down = matrix[r+1][c];
        var downRight = matrix[r+1][c+1];
        
        if(down==color && r+1<limRow)
        {
            if(right==color && c+1<limCol)
            {
                if(downRight==color)
                {                    

                    if(!Contains(squares, {row: r, col: c+1}))
                    {
                        squares[index]= {row: r, col:c+1, isStart: false, hasParent: true};
                        index++;
                    }

                    if(!Contains(squares, {row: r+1, col: c+1}))
                    {
                        squares[index]= {row: r+1, col:c+1, isStart: false, hasParent: true};
                        index++;
                    }

                    if(!Contains(squares, {row: r+1, col: c}))
                    {
                        squares[index]= {row: r+1, col:c, isStart: false, hasParent: true};
                        index++;
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

function Contains(arr, element)
{
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].row == element.row && arr[i].col == element.col) {
            return true;
        }
    }
    return false;
}

//revisa si algun item ya esta dentro de una lista
function HasParent(element)
{
    for (var i = 0; i < squareList.length; i++) {
        for (var j = 0; j < squareList[i].length; j++)
        {
            if (squareList[i][j].hasParent && squareList[i][j].row == element.row && squareList[i][j].col == element.col) {
                return true;
            }
            
            if (squareList[i][j].hasParent && squareList[i][j].row == element.row+1 && squareList[i][j].col == element.col+1) {
                return true;
            }
            
            if (squareList[i][j].hasParent && squareList[i][j].row == element.row+1 && squareList[i][j].col == element.col) {
                return true;
            }
            
            if (squareList[i][j].hasParent && squareList[i][j].row == element.row && squareList[i][j].col == element.col+1) {
                return true;
            }
        }
    }
    return false;
}