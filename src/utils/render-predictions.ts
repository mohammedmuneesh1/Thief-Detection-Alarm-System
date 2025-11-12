import {throttle} from 'lodash';


export const renderPredictions = (
  detectedObjects: { bbox: [number, number, number, number]; class: string; score: number }[],
  context: CanvasRenderingContext2D,
  throttleCaptureImageFn: () => void,  
) => {


    context.clearRect(0,0,context.canvas.width,context.canvas.height);

    //It clears (erases) the entire canvas before drawing new stuff on it.
    //“Wipe the canvas clean before drawing the next frame.”


   //fonts 
   const font = "12px sans-serif";
   context.font = font;
   context.textBaseline = 'top';

   //It controls where the text will sit vertically in relation to the (x, y) coordinates you give when drawing text.”
  

   detectedObjects.forEach((prediction)=>{
    const [x, y, width, height] = prediction.bbox; //check below docunentation for the val
    const isPerson = prediction.class === "person";
    
    // 1️⃣ Fill semi-transparent background
    context.fillStyle = isPerson
  ? "rgba(255, 0, 0, 0.3)"   // red with 30% opacity
  : "rgba(0, 255, 0, 0.3)";  // green with 30% opacity 

    context.fillRect(x, y, width, height);

  // 2️⃣ Outline (stroke)
  context.strokeStyle = isPerson ? "red" : "green";
  context.lineWidth = 4;
  context.strokeRect(x, y, width, height);


  // 3️⃣ Solid color for text (full opacity)
    context.fillStyle = isPerson ? "red" : "green";



    

    //It sets the color or style used to fill shapes or text that you draw on the canvas.
    context.fillStyle = isPerson ? "red" : "green";  //ONCE CANVAS DRAWS SOMETHING, IT WILL BE DRAWN, IMMEDIATLY, THEREFORE ONCE 30% OPACITY END, IT WILL SET NEW COLOR WITH 100%
    context.fillText(prediction.class, x+4, y);  //“Write the object’s class name (like ‘person’ or ‘dog’) at position (x, y).”
    context.fillText(prediction.score.toFixed(2), x, y + 15);  //Adding +15 to the Y value moves the text downward from the original y position.
  

    if(isPerson){
        triggerAlaram();
        throttleCaptureImageFn();
    }
}) 


//x = 0 is the left edge.
//y = 0 is the top edge.
// As x increases → move right.
// As y increases → move down.


     // context.strokeStyle = isPerson ? "red" : "green";
    // context.lineWidth = 4; //4 widht of the stroke 
    // context.strokeRect(x, y, width, height);  //“Draw a rectangle outline starting at (x, y) with the given width and height.”


}


//documentation

//the clearRect() method sets the pixels in a rectangular area to transparent black (rgba(0,0,0,0)).
//the rectangles top-left corener is at (x,y) and its size is specified by width and height 

// the output of the detectedObjects [{
//     bbox: [111.7, 230.3, 391.9, 248.1],
//           [x, y, width, height]
//     class: "person",
//class Detected object label "person"
//     score: 0.64
//   }
// ]




//we detect every 10 milliseconds, this is an issue , so every 10 milliesconde, 
// it gonna play a new instance of the audio. we dont need that, we need new optimization, 
// if audio already playing, we dont need to play it , or play in 5 seconds 
//so we use throttling function

const triggerAlaram = throttle(()=>{
    const audio = new Audio('/alaram-trigger.m4a');
    audio.play(); 
},6000);