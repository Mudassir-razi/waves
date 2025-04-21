// uiHandlers.js
import { createGrid, setTimeStamp, setdx } from "./grid.js";
import { setupSignal, setupSignalCanvas, renderAllSignals, updateSignal } from "./signal.js";

export function setupUI(ctx) {
    const timeScaleSlider  = document.getElementById("timeSlider");
    const endTimeSlider     = document.getElementById("endTimeSlider");
    const demoButton       = document.getElementById("demoButton");

    const bgCanvas = document.getElementById("bgLayer");
    const mainCanvas = document.getElementById("mainLayer");

    createGrid(bgCanvas);
    setupSignalCanvas(mainCanvas);

    //Endtime slider functionality
    endTimeSlider.addEventListener('input', (event) =>
    {
        var val = event.target.value;
        setTimeStamp(val);
        renderAllSignals();
    });
    
    //Time scale slider functionality
    timeScaleSlider.addEventListener('input', (event) =>
    {
        var val = event.target.value;
        setdx(val);
        renderAllSignals();
    });

    //Add new signal button functionality
    demoButton.addEventListener('click', (event) =>
    {
        let data = document.getElementById("signalData").value;
        setupSignal(data);
        renderAllSignals();
    });

    //button click and mouse position functionality
    mainCanvas.addEventListener('click', (event) =>
    {
        const rect = mainCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        updateSignal(x, y);
        renderAllSignals();
    });
   
}
  
