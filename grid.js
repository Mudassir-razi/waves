
import { settings } from "./config.js";
var grid;
//global functions
export function createGrid(canvas){
    grid = new Grid(canvas);
    grid.render();
}

export function renderGrid(){grid.render();}

export class Grid{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.render();
        console.log("Grid created with width: " + this.canvas.width + " and height: " + this.canvas.height);
    }

    render(){

        //fetching all the settings from congifure file
        var width = settings.timeStamp * settings.dx;
        var height = settings.signalCount * settings.dy;
        var offsetY = settings.offsetY;
        var timeStamp = settings.timeStamp;
        var signalCount = settings.signalCount;
        var dx = settings.dx;
        var dy = settings.dy;

        //updating canvas and clearing
        this.canvas.width = width+2;
        this.canvas.height = height+2;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "grey";
        //horizontal lines
        for(var i = 0; i <= signalCount; i++){
            var y = i * ( dy + offsetY);
            this.ctx.beginPath();
            this.ctx.setLineDash([1, 5])
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }

        //vertical lines
        for(var i = 0; i <= timeStamp; i++){
            var x = i * dx;
            this.ctx.beginPath();
            this.ctx.setLineDash([2, 5])
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
    }
}
