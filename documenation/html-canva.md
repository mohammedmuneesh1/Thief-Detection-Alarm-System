The **HTML Canvas API** is a **powerful feature in HTML5** that allows you to **draw graphics, animations, and visual effects** directly in a web page using **JavaScript**.

It’s like a **digital drawing board** inside your webpage — you can paint shapes, text, images, and even create games or charts, all dynamically with code.

---

### 🧩 Basic Concept

* The `<canvas>` element in HTML provides an **area** (a blank rectangle) where you can draw using JavaScript.
* The **Canvas API** gives you methods to draw and manipulate that area.

Example:

```html
<canvas id="myCanvas" width="300" height="150" style="border:1px solid black;"></canvas>

<script>
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d"); // 2D drawing context

  // Draw a red rectangle
  ctx.fillStyle = "red";
  ctx.fillRect(20, 20, 100, 50);
</script>
```

---

### 🎨 Two Main Contexts

1. **2D Context (`"2d"`)**

   * Used for drawing **shapes, text, images, gradients, and patterns**.
   * Most common (used for charts, art, and games).

2. **WebGL Context (`"webgl"` or `"webgl2"`)**

   * Used for **3D graphics** using GPU acceleration.
   * More advanced (used for 3D games, simulations, etc.).

---

### 🧱 Common Canvas API Methods (2D)

| Action         | Method                                       | Example                         |
| -------------- | -------------------------------------------- | ------------------------------- |
| Draw rectangle | `fillRect(x, y, w, h)`                       | `ctx.fillRect(10, 10, 100, 50)` |
| Draw line      | `moveTo(x, y)` + `lineTo(x, y)` + `stroke()` |                                 |
| Draw circle    | `arc(x, y, radius, startAngle, endAngle)`    |                                 |
| Draw text      | `fillText(text, x, y)`                       | `ctx.fillText("Hello", 50, 50)` |
| Draw image     | `drawImage(img, x, y)`                       |                                 |
| Clear area     | `clearRect(x, y, w, h)`                      |                                 |

---

### ⚡ Use Cases

* **Games** (2D or 3D)
* **Data visualizations** (charts, graphs)
* **Image editing tools**
* **Custom animations**
* **Particle effects**
* **Signature pads**

---

### 🧠 Summary

| Feature         | Description                                      |
| --------------- | ------------------------------------------------ |
| Element         | `<canvas>`                                       |
| Accessed with   | JavaScript                                       |
| Rendering Types | 2D and WebGL (3D)                                |
| Advantage       | Dynamic, pixel-level control                     |
| Limitation      | No DOM elements inside — it’s a bitmap, not HTML |

---

