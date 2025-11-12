"use client"


import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Webcam from 'react-webcam';
import {load as cocoSSDLoad} from '@tensorflow-models/coco-ssd'
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';  //know it import essentail thing to load
import { renderPredictions } from '@/utils/render-predictions';
import { throttle } from 'lodash';
import { setupTF } from '@/utils/tf-setup';


 const ObjectDetection = () => {
    const webCamRef = useRef<Webcam>(null);
    const canvaRef = useRef<HTMLCanvasElement>(null);
    //eslint-disable-next-line;
    const [photo, setPhoto] = useState<string | null>(null);
    const [isLoading,setIsLoading]= useState<boolean>(true);
    const detectInterval = useRef<NodeJS.Timeout | null>(null);
    const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
    const alarmCooldown = useRef(false);



const capturePhoto = useCallback(() => {
  const imageSrc = webCamRef.current?.getScreenshot();
  if (!imageSrc) return;

  setPhoto(imageSrc);
  
  //to send to the backend, convert to the blob 
   // Convert base64 -> Blob
  // const blob = await (await fetch(imageSrc)).blob();
//   fetch(imageSrc) treats the Base64 string as if it’s a file URL.
// It downloads (decodes) that data URL into binary form.
// .blob() converts that binary stream into a real Blob object.
//Blob (Binary Large Object).
//FormData.append("file", ...) can only send real binary data, not a Base64 text.
  // Prepare data
  // const formData = new FormData();
  // formData.append('file', blob);



  // Trigger download
  const a = document.createElement('a');
  a.href = imageSrc;
  a.download = 'captured-photo.jpg';
  a.click();
}, []);




const capturePhotoThrottled = useMemo(() => {
  // eslint-disable-next-line react-hooks/refs
  return throttle(() => {
    capturePhoto();
  }, 5000, { trailing: false });
}, []);

// useEffect(() => {
//   return () => {
//     capturePhotoThrottled.cancel();
//   };
// }, [capturePhotoThrottled]);





    //
    const showMyVideo = ()=>{
      if(webCamRef.current !==null && 
        webCamRef.current.video?.readyState === 4
      ){

        const myVideoWidth = webCamRef.current.video.videoWidth;
        const myVideoHeight = webCamRef.current.video.videoHeight;

        webCamRef.current.video.width = myVideoWidth;
        webCamRef.current.video.height = myVideoHeight;



      }
    }







//-------------------- RUN OBJECT DETECTION START -------------------------------------------------
      const runObjectDetection = async (net:cocoSsd.ObjectDetection)=>{
        //So net is of type ObjectDetection.
     if(canvaRef.current  && 
      webCamRef.current !== null && 
      webCamRef.current.video?.readyState === 4 
     ){
        const myVideoWidth = webCamRef.current.video.videoWidth;
        const myVideoHeight = webCamRef.current.video.videoHeight;
        canvaRef.current.width = myVideoWidth;
        canvaRef.current.height = myVideoHeight;

        //find detected objects 
        const detectedObjects = await net.detect(webCamRef.current.video,
          undefined,
          0.6   //60% accuracy
        );
        //net.detect(videoElement, maxNumBoxes?, minScore?)
        // net.detect is a function that takes three arguements, first:video,
        //  second: max number of objects to detect once , 
        // third:how much accuracy it needed on showing 

    //  console.log('detectedObject',detectedObjects);

    // the output of the detectedObjects [{
//     bbox: [111.7, 230.3, 391.9, 248.1],
//           [x, y, width, height]
//     class: "person",
//class Detected object label "person"
//     score: 0.64
//   }
// ]

//score
//Confidence (0–1) 0.64 (≈64% sure)
//The model is saying: “There’s a person starting at pixel (111, 230), with width ≈ 391 px and height ≈ 248 px, with 64% confidence.”


const context = canvaRef.current.getContext('2d');
//you access the 2D rendering engine for your <canvas> element in HTML.
//To actually draw on it (lines, boxes, text, etc.),
//you need to get its “context” — the JavaScript object that provides drawing functions.
//it returns a CanvasRenderingContext2D object —
//which contains hundreds of methods you can use to draw things.

if(context){
  renderPredictions(detectedObjects,context,capturePhotoThrottled); //ALARAM TRIGGERING INSIDE THIS FUNCTION 
}
} 
    }



    //object detection function 
    const runCoco = async ()=>{
      if (modelRef.current) return;  // already loaded

      
      setIsLoading(true);
      if (typeof window === "undefined") return;

    // ✅ Initialize backend before loading model
        await setupTF();

    // 🧩 Only set backend if not already set
  // const currentBackend = tf.getBackend();
  // if (currentBackend !== "webgl") {
  //   await tf.setBackend("webgl");
  // }
    
    // or "cpu" if WebGL not supported
    // This line tells TensorFlow.js which computation engine to use.
    //  TensorFlow.js can run on different “backends” — think of them as execution engines that decide where the math happens.
//     | Backend   | Where computations run               | Notes                         |
// | --------- | ------------------------------------ | ----------------------------- |
// | `"webgl"` | GPU via WebGL                        | ⚡️ Fastest for browsers       |
// | `"cpu"`   | JavaScript CPU                       | ✅ Works everywhere but slower |
// | `"wasm"`  | WebAssembly                          | 🧠 Fast CPU alternative       |
// | `"node"`  | Node.js native backend (for servers) | 🚀 For server-side TFJS       |
// tells TensorFlow:
// “Use the GPU through WebGL for all matrix multiplications, convolutions, and tensor operations.”
    // await tf.ready();
// 2️⃣ await tf.ready()
// This line waits for TensorFlow to finish initializing the backend.
// Backends load asynchronously — they may need to:
// Compile WebGL shaders
// Initialize GPU buffers
// Set up computation contexts
// So tf.ready() ensures that TensorFlow is fully ready to perform computations before you load or use any model.
//“Wait until TensorFlow’s engine is warmed up and ready to process tensors.”
      const net = await cocoSSDLoad();
       modelRef.current = net;
     //It loads the pre-trained COCO-SSD (Single Shot MultiBox Detector) model into memory —
    //a deep learning model that can detect and label real-world objects in images or video frames.

      setIsLoading(false);

      //we are going to run setInterval 
      // every millisecond to detect whatever the object is 

      detectInterval.current = setInterval(()=>{
        if (modelRef.current) runObjectDetection(modelRef.current);
      }
      ,10)
    };

    

    useEffect(()=>{
      showMyVideo();
       const loadModel = async () => {
        await runCoco(); // safe async call
          };
         loadModel();

    return () => {
      // 🧹 Cleanup when unmounting
      if (detectInterval.current) clearInterval(detectInterval.current);
      tf.disposeVariables();
    };

    },[]);


  return (
    <div className='mt-8 min-h-screen w-full max-w-full '>
       
{isLoading && (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-gray-800 to-black z-50">
    {/* Animated circular loader */}
    <div className="relative mb-6">
      <div className="w-20 h-20 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-indigo-400 font-semibold animate-pulse">AI</span>
      </div>
    </div>

    {/* Glowing gradient title */}
    <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 animate-pulse drop-shadow-[0_0_8px_rgba(147,51,234,0.5)]">
      Loading Thief Detection Model...
    </h1>

    {/* Sub text */}
    <p className="mt-3 text-gray-400 text-sm sm:text-base animate-pulse">
      Please wait while the neural network powers up 🔒
    </p>
  </div>
)}


        <div className="relative flex justify-center items-center w-full rounded-md overflow-hidden bg-black">
  {/* Webcam */}
  <Webcam
    ref={webCamRef}
    className="rounded-md w-full  aspect-video md:aspect-16/7 object-cover"
    screenshotFormat="image/jpeg"
    muted
  />

  {/* Canvas overlay */}
  <canvas
    ref={canvaRef}
    className="absolute top-0 left-0 w-full h-full rounded-md"
  />
</div>

        <button
  type="button"
  onClick={capturePhoto}
  className="relative block mx-auto mt-6 px-7 py-3 rounded-lg bg-gray-900 text-gray-100 font-medium 
             border border-gray-700 overflow-hidden 
             transition-all duration-300 ease-in-out
             before:absolute before:inset-0 before:bg-linear-to-r from-gray-600 to-gray-400
             before:opacity-0 before:transition-opacity before:duration-300
             hover:before:opacity-20 hover:text-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]"
>
  <span className="relative z-10">Capture Photo</span>
</button>



               {/* <button
            type='button'
            className='px-4 py-3 rounded-md bg-green-400 text-white cursor-pointer
            '
            onClick={capturePhoto}
            >
              click me 

            </button> */}
            

          {/* {photo && (
        <div>
          <h3>Captured Photo:</h3>
          <img src={photo} alt="Captured" className="rounded-md mt-2" />
        </div>
      )} */}

    </div>
  )
}

export default ObjectDetection;
