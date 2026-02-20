import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';


const App = () => {
  const socket = io("https://whiteboardbackend-1knc.onrender.com");
  const canvasRef = useRef(null);

  let x, y;
  let mousedown = false;
  
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    
      window.onmousedown = (e) => {
        ctx.moveTo(x, y)
        socket.emit('mousedown', {x, y});
        mousedown = true;
      }

      socket.on('on_mouse_down', ({x, y}) => {
        ctx.moveTo(x, y)
      })

      window.onmouseup = (e) => {
        mousedown = false;
      }

      window.onmousemove = (e)=> {
        x = e.x;
        y = e.y;

        if(mousedown) {
          socket.emit('draw', {
            x: e.offsetX,
            y: e.offsetY
          });
          
        }
      }

      socket.on('on_draw', ({x, y}) => {
        ctx.lineTo(x, y);
        ctx.stroke();
      })


      return () => {
        socket.off("on_draw");
        socket.off("on_mouse_down");
      };
    
  }, [])
  
  return (
    <div>
      <h1 className='z-20 font-bold text-5xl absolute top-[40px] left-[50%] translate-[-50%]'> WHITEBOARD</h1>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    </div>
  )
}

export default App