var canvas  = document.getElementById('drawing');
var context = canvas.getContext('2d');
var flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;

var x = "black",
    y = 2;

function erase() {
    alert("Hi I am here");
    var m = confirm("Want to clear");
    if (m) {

      context.clearRect(0, 0, canvas.width, canvas.height);
      document.getElementById("drawing").style.display = "none";
    }
}

//function save() {
  //    var canvas  = document.getElementById('drawing');
      //var context = canvas.getContext('2d');
  //    document.getElementById("drawing").style.border = "2px solid";
  //    var dataURL = canvas.toDataURL();
  //    document.getElementById("drawing").src = dataURL;
  //    document.getElementById("drawing").style.display = "inline";
  //}


  function findxy(res, e) {
      if (res == 'down') {
          prevX = currX;
          prevY = currY;
          currX = e.clientX - canvas.offsetLeft;
          currY = e.clientY - canvas.offsetTop;

          flag = true;
          dot_flag = true;
          if (dot_flag) {
              context.beginPath();
              context.fillStyle = x;
              context.fillRect(currX, currY, 2, 2);
              context.closePath();
              dot_flag = false;
          }
      }
      if (res == 'up' || res == "out") {
          flag = false;
      }
      if (res == 'move') {
          if (flag) {
              prevX = currX;
              prevY = currY;
              currX = e.clientX - canvas.offsetLeft;
              currY = e.clientY - canvas.offsetTop;
              draw();
          }
      }
  }

  function init() {
      //canvas = document.getElementById('drawing');
      //context = canvas.getContext("2d");
      //w = canvas.width;
      //h = canvas.height;

      canvas.addEventListener("mousemove", function (e) {
          findxy('move', e)
      }, false);
      canvas.addEventListener("mousedown", function (e) {
          findxy('down', e)
      }, false);
      canvas.addEventListener("mouseup", function (e) {
          findxy('up', e)
      }, false);
      canvas.addEventListener("mouseout", function (e) {
          findxy('out', e)
      }, false);
  }

  function color(obj) {
      switch (obj.id) {
          case "green":
              x = "green";
              break;
          case "blue":
              x = "blue";
              break;
          case "red":
              x = "red";
              break;
          case "yellow":
              x = "yellow";
              break;
          case "orange":
              x = "orange";
              break;
          case "black":
              x = "black";
              break;
          case "white":
              x = "white";
              break;
      }
      if (x == "white") y = 14;
      else y = 2;

  }

  function draw() {
      context.beginPath();
      context.moveTo(prevX, prevY);
      context.lineTo(currX, currY);
      context.strokeStyle = x;
      context.lineWidth = y;
      context.stroke();
      context.closePath();
  }

document.addEventListener("DOMContentLoaded", function() {
   var mouse = {
      click: false,
      move: false,
      pos: {x:0, y:0},
      pos_prev: false
   };
   // get canvas element and create context
   var canvas  = document.getElementById('drawing');
   var context = canvas.getContext('2d');
   var width   = window.innerWidth;
   var height  = window.innerHeight;
   var socket  = io.connect();

   // set canvas to full browser width/height
   canvas.width = width;
   //canvas.width = 600;
   //canvas.height = 600;
   canvas.height = height;

   // register mouse event handlers
   canvas.onmousedown = function(e){ mouse.click = true; };
   canvas.onmouseup = function(e){ mouse.click = false; };

   canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = e.clientX / width;
      mouse.pos.y = e.clientY / height;
      mouse.move = true;
   };


   // draw line received from server
	socket.on('draw_line', function (data) {
      var line = data.line;
      context.beginPath();
      context.moveTo(line[0].x * width, line[0].y * height);
      context.lineTo(line[1].x * width, line[1].y * height);
      //context.strokeStyle="#FF0000";
      context.stroke();
   });

   // main loop, running every 25ms
   function mainLoop() {
      // check if the user is drawing
      if (mouse.click && mouse.move && mouse.pos_prev) {
         // send line to to the server
         socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ] });
         mouse.move = false;
      }
      mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
      setTimeout(mainLoop, 25);
   }
   mainLoop();
});
