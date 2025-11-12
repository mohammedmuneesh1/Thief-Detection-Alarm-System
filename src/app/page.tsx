import ObjectDetection from "@/components/ObjectDetection";

export default function Home() {
  return (
<main
 className="flex min-h-screen flex-col items-center p-8 bg-linear-to-br from-gray-900 via-gray-800 to-black"
 >
  <h1
  className="font-extrabold text-3xl md:text-6xl 
  lg:text-8xl tracking-tighter md:px-6 text-center gradient-title text-balance underline"
  >
Thief Detection System
  </h1>
  <ObjectDetection/>
</main>
  );
}
