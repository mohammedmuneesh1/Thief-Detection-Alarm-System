// tf-setup.ts
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

let initialized = false;

export async function setupTF() {
  if (initialized) return;
  await tf.setBackend("webgl");
  await tf.ready();
  initialized = true;
  console.log("✅ TensorFlow.js backend ready");
}



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