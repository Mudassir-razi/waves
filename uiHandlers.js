// uiHandlers.js

function setupUI(ctx) {
    const timeScaleSlider  = document.getElementById("timeSlider");
    const endTimeSlider     = document.getElementById("endTimeSlider");

    const bgCanvas = document.getElementById("bgLayer");
    const mainCanvas = document.getElementById("mainLayer");

    createGrid(bgCanvas);
    endTimeSlider.addEventListener('input', (event) =>
    {
        var val = event.target.value;
        setTimeStamp(val);
    });
    
    timeScaleSlider.addEventListener('input', (event) =>
    {
        var val = event.target.value;
        setSpaceX(val);
    });
   
}
  
