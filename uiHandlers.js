// uiHandlers.js
import { createGrid, renderGrid } from "./grid.js";
import { setupSignal, setupSignalCanvas, renderAllSignals, updateSignal, updateSignals } from "./signal.js";
import { settings } from "./config.js";

export function setupUI(ctx) {

    //mouse position variables
    var prevX, prevY;
    var isdragging = false;

    const timeScaleSlider  = document.getElementById("timeSlider");
    const endTimeSlider     = document.getElementById("endTimeSlider");
    const demoButton       = document.getElementById("demoButton");

    const bgCanvas = document.getElementById("bgLayer");
    const mainCanvas = document.getElementById("mainLayer");
    const uiCanvas = document.getElementById("extraLayer");

    createGrid(bgCanvas);
    setupSignalCanvas(mainCanvas);

    //Endtime slider functionality
    endTimeSlider.addEventListener('input', (event) =>
    {
        settings.timeStamp = event.target.value;
        uiCanvas.width = settings.timeStamp * settings.dx;
        renderGrid();
        renderAllSignals();

    });
    
    //Time scale slider functionality
    timeScaleSlider.addEventListener('input', (event) =>
    {
        settings.dx = event.target.value;
        renderGrid();
        renderAllSignals();
    });

    //Add new signal button functionality
    demoButton.addEventListener('click', (event) =>
    {
        let data = document.getElementById("signalData").value;
        if(!data)data = '101011010';
        settings.signalCount += 1;
        setupSignal(data);
        renderGrid();
        renderAllSignals();
        
    });

    //mouse down functionality
    mainCanvas.addEventListener("mousedown", (event) =>
    {
        //console.log("Mouse down");
        //console.log(settings.timeStamp);
        const rect = mainCanvas.getBoundingClientRect();
        prevX = event.clientX - rect.left;
        prevY = event.clientY - rect.top;
        isdragging = ~isdragging
    });

    mainCanvas.addEventListener('mousemove', (event) =>
    {
        if(isdragging){
            //console.log("Mouse move");
            var uiContext = uiCanvas.getContext("2d");
            const rect = mainCanvas.getBoundingClientRect();
            const curX = event.clientX - rect.left;
            const curY = event.clientY - rect.top;
            uiContext.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
            drawSelectRectangle(uiContext, prevX, prevY, curX, curY);
            console.log( prevX, prevY, curX, curY);
        }
        
    });

    //mouse up functionality
    mainCanvas.addEventListener('mouseup', (event) =>
    {

        const rect = mainCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const uiContext = uiCanvas.getContext("2d");
        console.log("Mouse up");
        isdragging = false;
        uiContext.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

        if(Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2)) < 5)
        {
            console.log("Click detected");
            updateSignal(x, y);
        }
        else {
            updateSignals(prevX, prevY, x, y);
            console.log("Drag detected");
        }
        renderAllSignals();
    });

}


function drawSelectRectangle(ctx, x, y, x1, y1) {
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x, y, x1 - x, y1 - y);
    ctx.setLineDash([]);
}
  
