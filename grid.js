
export let grid;

//global functions
export function createGrid(canvas, timeStamp=10, signalCount=10, dx=50, dy=30){
    grid = new Grid(canvas, timeStamp, signalCount, dx, dy);
    grid.render();
}

export function setTimeStamp(timeStamp){
    grid.timeStamp = timeStamp;
    grid.render();
}

export function setSignalCount(signalCount){
    grid.signalCount = signalCount;
    grid.render();
}

export function setdx(dx){
    grid.dx = dx;
    grid.render();
}

export function setdy(dy){
    grid.dy = dy;
    grid.render();
}

export class Grid{
    constructor(canvas, timeStamp=10, signalCount=1, dx=50, dy=30)
    {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.timeStamp = timeStamp;
        this.signalCount = signalCount;
        this.dx = dx;
        this.dy = dy;
        console.log(signalCount);
    }

    render(){
        var width = this.timeStamp * this.dx;
        var height = this.signalCount * this.dy;
        
        this.canvas.width = width+2;
        this.canvas.height = height+2;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "grey";
        console.log(this.signalCount);
        //horizontal lines
        for(var i = 0; i <= this.signalCount; i++){
            var y = i * this.dy;
            this.ctx.beginPath();
            this.ctx.setLineDash([5, 5])
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }

        //vertical lines
        for(var i = 0; i <= this.timeStamp; i++){
            var x = i * this.dx;
            this.ctx.beginPath();
            this.ctx.setLineDash([5, 5])
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
    }
}
