
//This class holds the information regarding each signal
//Index on the grid, data, color, linewidth etc.
class Signal
{
    constructor(index){
        this.index = index;
        this.data = [];
        this.text = [];
    }

}

//Renderer of the signal
function renderSignal(ctx, data)
{
    for(var i = 0; i < data.length; i++){{
      if(i > 0)
      {
        var currentBit = data[i];
        var prevBit = data[i-1];
        
        if(currentBit == 0 && prevBit == 0)
        {

        }
        
      }
        
    }
}

var dx = 50;
var dy = 30;
var dx1 = dx/5;

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
  
  //
  class Grid{
    constructor(endTime=1, timeSpace=50, verticalSpace=30, scaleX = 1, scaleY = 1, numSignals = 1){
        this.endTime = endTime;
        this.timescale = timescale;
        this.numSignals = numSignals;
    }

    render(ctx) {
      var canvasXmax = this.endTime * this.timescale;
      var canvasYmax = this.numSignals * this.verticalSpace;

      ctx.clearRect(0, 0, canvasXmax, canvasYmax);
      ctx.fillStyle = "#fdf0ff";
      //draw horizontal lines
      
      for(var i = 0;i <= canvasXmax;i += this.verticalSpace){
          var p1 = new Coordinate(0, i);
          line(ctx, p1, p1.right(1200), color="grey");
      }
      
      //draw Vertical lines
      for(var i = 0;i <= canvasYmax;i += this.timeSpace){
          var p1 = new Coordinate(i, 0);
          line(ctx, p1, p1.up(800), color="grey");
      }
    }
  }