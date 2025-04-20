// main.js

//Call handler functions to update elements on the page. 

window.onload = () => {
    const bg = document.getElementById("bgLayer").getContext("2d");
    const main = document.getElementById("mainLayer").getContext("2d");
    //const ui = document.getElementById("uiLayer").getContext("2d");
  

    // Setup UI interactions on the main drawing layer
    setupUI(main);

  };
  