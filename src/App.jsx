import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';

const socket = io("http://localhost:3000/");

const App = () => {
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
          socket.emit('draw', {x, y});
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }

      socket.on('on_draw', ({x, y}) => {
        ctx.lineTo(x, y);
        ctx.stroke();
      })


      return () => socket.off("receive_message");
    
  }, [])
  
  return (
    <div>
      <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    </div>
  )
}

export default App
