
//This class holds the information regarding each signal
//Index on the grid, data, color, linewidth etc.
import { settings } from "./config.js";

//list of all signals 
let signals = [];
let mainCanvas;
let dx, dy, dx1, offsetY; 

export function updateSignal(mousePosX, mousePosY)
{
  var {x, y} = getMouseXY(mousePosX, mousePosY);
  console.log("X: " + x + " Y: " + y);
  if(signals.length > y)signals[y].toggleSignal(x);
}

export function updateSignals(mousePosX, mousePosY, mousePosX1, mousePosY1)
{
  var {x: x2, y: y2} = getMouseXY(mousePosX, mousePosY);
  var {x : x1, y : y1} = getMouseXY(mousePosX1, mousePosY1);
  if( y2 != y1)return;
  else{
    console.log("Changing sequence");
    var max = Math.max(x2, x1);
    var min = Math.min(x2, x1);
    for(var i = min; i <= max; i++){
      if(signals.length > y1)
        {
          var bit = signals[y1].data[x2];
          console.log("Replacement bits with " + bit);
          signals[y1].replaceSignal(i, bit);
        }
    }
  }
}



//renders all the signals on the grid
export function renderAllSignals()
{
    offsetY = settings.offsetY;
    dx = settings.dx;
    dy = settings.dy;
    dx1 = dx/8;
    mainCanvas.height = settings.signalCount * settings.dy;
    mainCanvas.width  = settings.timeStamp * settings.dx;
    var ctx = mainCanvas.getContext("2d");

    for(var i = 0; i < signals.length; i++){
        var signal = signals[i];
        signal.renderSignal(ctx);
    }
} 

//creates a new signal and adds it to the list of signals
export function setupSignal(data='')
{
    var ctx = mainCanvas.getContext("2d");
    var signal = new Signal(signals.length);
    //console.log(grid.dx);
    //console.log(dx);
    signal.data = data
    signal.renderSignal(ctx);
    signals.push(signal);
}

export function setupSignalCanvas(canvas)
{
  mainCanvas = canvas;
}

class Signal
{
    constructor(index){
        this.index = index;
        this.data = '';
        this.text = [];
        this.name = 'Signal ' + index;
    }

    //Renderer of the signal
    renderSignal(ctx)
    {
        var posX = settings.dx;
        var posY = (this.index + 1)* (settings.dy + settings.offsetY);
        ctx.fillText(this.name, posX - settings.textOffset, posY-settings.dy/2);
        for(var i = 0; i < this.data.length; i++){
          var currentBit = this.data[i];
          var prevBit = i == 0 ? this.data[i] : this.data[i-1]; 
          if(currentBit == '0' && prevBit == '0')
          {
              solid0(ctx, posX, posY);
          }
          else if(currentBit == '1' && prevBit == '1')
          {
              solid1(ctx, posX, posY);
          }
          else if(currentBit == '.'){
            prevBit == '1' ? solid1(ctx, posX, posY) : solid0(ctx, posX, posY);
            this.replaceSignal(i, prevBit);
          }
          else if(currentBit == '0' && prevBit == '1')
          {
              fallingEdge(ctx, posX, posY);
          }
          else if(currentBit == '1' && prevBit == '0')
          {
              risingEdge(ctx, posX, posY);
          }
          posX += settings.dx;
          
        }
    }

    //Update signal data
    toggleSignal(x)
    {
      var splitData = this.data.split('');
      if(splitData[x] == '0') splitData[x] = '1';
      else if (splitData[x] == '1') splitData[x] = '0';
      this.data = splitData.join('');
    }

    //replace signal bit
    replaceSignal(x, bit)
    {
      if(!bit)return;
      var splitData = this.data.split('');
      splitData[x] = bit;
      this.data = splitData.join('');
    }

}


function getMouseXY(mouseX, mouseY)
{
    const x = Math.floor(mouseX / settings.dx) - 1;
    const y = Math.floor(mouseY / (settings.dy + settings.offsetY));
    return {x, y};
}

//Draws line between from and to coordinates. 
function line(ctx, from, to, color = "black", width = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

//solid 0
function solid0(ctx, x, y)
{
    var p1 = new Coordinate(x, y);
    var p2 = p1.right(settings.dx);
    line(ctx, p1, p2);
}
//solid 1
function solid1(ctx, x, y)
{
    var p1 = new Coordinate(x, y);
    p1     = p1.down(dy);
    var p2 = p1.right(settings.dx);
    line(ctx, p1, p2);
}


// Draws rising edge at (x,y)
function risingEdge(ctx, x, y)
{
    var p1 = new Coordinate(x, y);
    var p2 = p1.right(dx1);
    var p3 = p2.right(dx1).down(dy);
    var p4 = p3.right(settings.dx-2*dx1);

    line(ctx, p1, p2);
    line(ctx, p2, p3);
    line(ctx, p3, p4);
}

// Draws falling edge at (x,y)
function fallingEdge(ctx, x, y)
{   
    var p1 = new Coordinate(x, y-dy);
    var p2 = p1.right(dx1);
    var p3 = p2.right(dx1).up(dy);
    var p4 = p3.right(settings.dx-2*dx1);

    line(ctx, p1, p2);
    line(ctx, p2, p3);
    line(ctx, p3, p4);
}

// Draws __/# at (x,y)
function fanoutUp(ctx, x, y)
{
    var p1 = new Coordinate(x, y);
    risingEdge(ctx, x, y);
    line(ctx, p1, p1.right(settings.dx));
}

// Draws --\# at (x, y)
function fanoutDown(ctx, x, y)
{
    var p1 = new Coordinate(x, y-dy);
    fallingEdge(ctx, x, y);
    line(ctx, p1, p1.right(settings.dx));
}


class Coordinate {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
  
    up(step = 1) {
      return new Coordinate(this.x, this.y + step);
    }
  
    down(step = 1) {
      return new Coordinate(this.x, this.y - step);
    }
  
    right(step = 1) {
      return new Coordinate(this.x + step, this.y);
    }
  
    left(step = 1) {
      return new Coordinate(this.x - step, this.y);
    }
  
    toString() {
      return `(${this.x}, ${this.y})`;
    }
  
    distanceTo(other) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    equals(other) {
      return this.x === other.x && this.y === other.y;
    }
  }
  
