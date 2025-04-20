
let grid;

//global functions
function createGrid(canvas, timeStamp=10, signalCount=1, spaceX=50, spaceY=30){
    grid = new Grid(canvas, timeStamp, signalCount, spaceX, spaceY);
    grid.render();
}

function setTimeStamp(timeStamp){
    grid.timeStamp = timeStamp;
    grid.render();
}

function setSignalCount(signalCount){
    grid.signalCount = signalCount;
    grid.render();
}

function setSpaceX(spaceX){
    grid.spaceX = spaceX;
    grid.render();
}

function setSpaceY(spaceY){
    grid.spaceY = spaceY;
    grid.render();
}

class Grid{
    constructor(canvas, timeStamp=10, signalCount=1, spaceX=50, spaceY=30)
    {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.timeStamp = timeStamp;
        this.signalCount = signalCount;
        this.spaceX = spaceX;
        this.spaceY = spaceY;
        console.log(signalCount);
    }

    render(){
        var width = this.timeStamp * this.spaceX;
        var height = this.signalCount * this.spaceY;
        
        this.canvas.width = width+2;
        this.canvas.height = height+2;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "grey";
        console.log(this.signalCount);
        //horizontal lines
        for(var i = 0; i <= this.signalCount; i++){
            var y = i * this.spaceY;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }

        //vertical lines
        for(var i = 0; i <= this.timeStamp; i++){
            var x = i * this.spaceX;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
    }
}
