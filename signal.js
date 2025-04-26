
//This class holds the information regarding each signal
//Index on the grid, data, color, linewidth etc.
import { settings } from "./config.js";

//list of all signals 
let signals = [];
let mainCanvas;
let nameDiv;
let dx, dy, dx1, offsetY;

export function updateSignal(mousePosX, mousePosY)
{
  var {x, y} = getMouseXY(mousePosX, mousePosY);
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
    offsetY =  parseInt(settings.offsetY);
    dx = parseInt(settings.dx);
    dy = parseInt(settings.dy);
    dx1 = dx*parseFloat(settings.skew);

    console.log("Rendering signals with Settings: dx: " + dx + " dy: " + dy);
    mainCanvas.height = settings.signalCount * dy;
    mainCanvas.width  = settings.timeStamp * dx;
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

    //pur the name on the name div
    const label = document.createElement("label");
    label.textContent = signal.name;
    label.className = "signal-label";
    nameDiv.appendChild(label);
}

export function setupSignalCanvas(canvas)
{
  mainCanvas = canvas;
  nameDiv = document.getElementById("signal-names");
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
        var posX = 0;
        var posY = (this.index + 1)* (dy + offsetY);
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
          posX += dx;
          
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

//returns the position of the mouse on the grid
function getMouseXY(mouseX, mouseY)
{
    const x = Math.floor(mouseX / dx);
    const y = Math.floor(mouseY / (dy + offsetY));
    return {x, y};
}

//Draws line between from and to coordinates. 
function line(ctx, from, to, color = settings.signalColor, width = 1) {
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
    var p2 = p1.right(dx);
    line(ctx, p1, p2);
}
//solid 1
function solid1(ctx, x, y)
{
    var p1 = new Coordinate(x, y);
    p1     = p1.down(dy);
    var p2 = p1.right(dx);
    line(ctx, p1, p2);
}


// Draws rising edge at (x,y)
function risingEdge(ctx, x, y)
{
    var p1 = new Coordinate(x, y);
    var p2 = p1.right(dx1);
    var p3 = p2.right(dx1).down(dy);
    var p4 = p3.right(dx-2*dx1);

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
    var p4 = p3.right(dx-2*dx1);

    line(ctx, p1, p2);
    line(ctx, p2, p3);
    line(ctx, p3, p4);
}

// Draws __/# at (x,y)
function fanoutUp(ctx, x, y)
{
    var p1 = new Coordinate(x, y);
    risingEdge(ctx, x, y);
    line(ctx, p1, p1.right(dx));
}

// Draws --\# at (x, y)
function fanoutDown(ctx, x, y)
{
    var p1 = new Coordinate(x, y-dy);
    fallingEdge(ctx, x, y);
    line(ctx, p1, p1.right(dx));
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
  
