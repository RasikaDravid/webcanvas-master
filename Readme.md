To run the project type go inside root directory node server.js
To build project go to htmlcanvas directory and run
ember build --environment=production --output-path=../public/

The above command builds the ember project and responsible for assets compilation. If you make any changes in your ember directory say(index.html) then you need to rebuild it using the above command. If you have watchman then it will do it for you.


courtesy: http://code-and.coffee/post/2015/collaborative-drawing-canvas-node-websocket/
