import React from "react";

const  BRAILLE = {
  "100000": "a",
  "110000": "b",
  "100100": "c",
  "100110": "d",
  "100010": "e",
  "110100": "f",
  "110110": "g",
  "110010": "h",
  "010100": "i",
  "010110": "j",
  "101000": "k",
  "111000": "l",
  "101100": "m",
  "101110": "n",
  "101010": "o",
  "111100": "p",
  "111110": "q",
  "111010": "r",
  "011100": "s",
  "011110": "t",
  "101001": "u",
  "111001": "v",
  "101101": "x",
  "101111": "y",
  "101011": "z",
  "001001": " ",
  "010010": "-",
};

let ctx = null;
let TOUCHES = [];
let timeoutid = null;

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
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); 
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

  /**
   * core part
   * when timeout expires, we have a bunch of touches stored.
   * we need to deduce what braille point are based on relative distances...
   * ideal approach: have a SETUP mode that let the user to decide
   * arbitrary position for each point.
   * easiest way: use fixed boxes!
  */
  function processTouches() {
    const pressed = [0, 0, 0, 0, 0, 0];
    const height=window.innerHeight; 
    const width=window.innerWidth;
    for(let i=0; i<TOUCHES.length; i+=1) {
      const touch = TOUCHES[i];
      if(touch.clientX < width*0.5) {
        // 1, 2 or 3
        if ((touch.clientY) < height * 0.33) {
          pressed[0] = 1;
        } else if ((touch.clientY) > height * 0.66) {
          pressed[2] = 1;
        } else {
          pressed[1] = 1;
        }
      } else {
        // 4, 5, or 6
        if (touch.clientY < height * 0.33) {
          pressed[3] = 1;
        } else if (touch.clientY > height * 0.66) {
          pressed[5] = 1;
        } else {
          pressed[4] = 1;
        }
      }
    }
    const braillekey = pressed.join('');
    const brailleval = BRAILLE[braillekey];
    console.log(braillekey, brailleval);

    onChange(brailleval, braillekey);
  }

  function onTimeout() {
    console.log("touches: ", TOUCHES.length);
    processTouches();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  function onTouchStart(ev) {
    console.log("start");
    ev.preventDefault();
    console.log(ev.targetTouches);
    clearTimeout(timeoutid);
    timeoutid = setTimeout(onTimeout, 1000);
    TOUCHES = ev.targetTouches;
    drawTouches();
    return false;
  }

  function onTouchEnd(ev) {
    ev.preventDefault();
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
