import React from "react";

let ctx = null;
let TOUCHES = [];

const BrailleCanvas = ({ onChange }) => {
  const canvasRef = React.useRef();

  function draw() {
    const height=window.innerHeight; 
    const width=window.innerWidth;
    ctx.fillStyle = "rgb(200, 0, 0)";
    ctx.fillRect(10, 10, 50, 50);
    ctx.font = "30px Arial";
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 50, 50);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width, height);
    ctx.moveTo(width, 0);
    ctx.lineTo(0, height);
    ctx.stroke();
  }

  function drawTouches() {
    const radius = 30;
    for(let i=0; i<TOUCHES.length; i+=1) {
      const touch = TOUCHES[i];
      ctx.beginPath();
      ctx.arc(touch.clientX, touch.clientY, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#003300';
      ctx.stroke();
      ctx.fillStyle = 'black';
      ctx.fillText(`${i+1}`, touch.clientX - 10, touch.clientY + 10); 
    };
  }

  function onTouchStart(ev) {
    console.log("start");
    ev.preventDefault();
    console.log(ev.targetTouches);
    TOUCHES = ev.targetTouches;
    drawTouches();
    return false;
  }

  function onTouchEnd(ev) {
    ev.preventDefault();
    console.log("end");
    console.log(ev.targetTouches);
    return false;
  }

  React.useEffect(() => {
    const canvas = canvasRef.current;
    ctx = canvas.getContext("2d");
    canvas.ontouchstart = onTouchStart;
    canvas.ontouchend = onTouchEnd;
    canvas.ontouchcancel = onTouchEnd;
    draw();
  });

  return <canvas 
    ref={canvasRef} 
    height={window.innerHeight} 
    width={window.innerWidth} 
  style={{
    position:"absolute",
    top: 0,
    left: 0,
  }}
/>;
};

export default BrailleCanvas;
