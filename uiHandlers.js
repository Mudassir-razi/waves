// uiHandlers.js
import { createGrid, renderGrid } from "./grid.js";
import { setupSignal, setupSignalCanvas, renderAllSignals, updateSignal, updateSignals, removeSignal } from "./signal.js";
import { settings } from "./config.js";

var selectedSignalIndex = -1;

export function setupUI(ctx) {

    //mouse position variables
    var prevX, prevY;
    var isdragging = false;

    //Taking in UI elements
    const timeScaleSlider  = document.getElementById("timeScaleSlider");
    const endTimeSlider     = document.getElementById("endTimeSlider");
    const demoButton       = document.getElementById("demoButton");
    const skewSlider       = document.getElementById("skewSlider");
    const signalSkewSlider = document.getElementById("signalSkewSlider");  
    const signalColorPicker = document.getElementById("signalColorpicker");
    const signalWidthSlider = document.getElementById("signalWidthSlider");

    const bgCanvas = document.getElementById("bgLayer");
    const mainCanvas = document.getElementById("mainLayer");
    const uiCanvas = document.getElementById("extraLayer");
    const nameDiv = document.getElementById("signal-names");

    createGrid(bgCanvas);
    setupSignalCanvas(mainCanvas);


    ///...................................UI ELEMENTS..............................
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
    
    //Signal skew slider functionality
    skewSlider.addEventListener('input', (event) =>
    {
        settings.skew = event.target.value;
        renderGrid();
        renderAllSignals();
    });
    
    //Add new signal button functionality
    demoButton.addEventListener('click', (event) =>
    {
        let data = document.getElementById("signalData").value;
        if(!data)data = '101011010';
        settings.signalCount += 1;
        setupSignal(data, signalColorPicker.value, signalSkewSlider.value, signalWidthSlider.value);
        renderGrid();
        renderAllSignals();
        
    });
    //..............................///////////////////////......................

    ////..........................MOUSE EVENTS HANDLERS..........................
    //mouse down functionality
    mainCanvas.addEventListener("mousedown", (event) =>
    {
        //for ignoring right click
        if(event.button === 2)return;
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
    //.......................///////////////////////////////...................

    //..........................KEYBOARD EVENTS HANDLERS.......................

    window.addEventListener('keydown', (event) =>
    {
        console.log("Key pressed: " + event.key);
        if(event.key === 'Delete' && selectedSignalIndex !== -1) {
            console.log("Deleting signal: " + selectedSignalIndex);
            nameDiv.removeChild(document.getElementById(selectedSignalIndex));
            removeSignal(selectedSignalIndex);
            selectedSignalIndex = -1;
        }
        renderGrid();
        renderAllSignals();
    });


    //.......................///////////////////////////////...................
}


//draws a rectangle on the UI for selected area
function drawSelectRectangle(ctx, x, y, x1, y1) {
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(x, y, x1 - x, y1 - y);
    ctx.setLineDash([]);
}

//Signals revoke it to pushs new signal names in the name tab
export function pushSignalName(name, index) {

     //pur the name on the name div 
     const nameDiv = document.getElementById("signal-names");
     const label = document.createElement("label");
     label.textContent = name;
     label.className = "signal-label";
     label.id = index;
     label.addEventListener("click", (event) =>
     {
        var labels = nameDiv.getElementsByClassName("signal-label-selected");
        for(var i = 0; i < labels.length; i++){
            var element = labels[i];
            element.className = "signal-label";
        }
        event.target.className = "signal-label-selected";
        console.log("Clicked on signal name: " + event.target.id);
        selectedSignalIndex = parseInt(event.target.id);
     });
     nameDiv.appendChild(label);

}
  
