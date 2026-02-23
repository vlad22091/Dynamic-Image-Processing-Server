Dynamic Image Processing Server (Node.js + Sharp)
This project is a lightweight local web server that generates images of the desired size on the fly.
Instead of saving hundreds of cropped photos to the hard drive, the server creates them in RAM (as a Buffer) and instantly serves them directly to the user's browser.

 Features
URL-based size generation: Change the width and height of an image directly in the browser's address bar (e.g., /image/300/200).

Automatic optimization: All images are converted to JPEG format with 80% quality and cropped (fit: 'cover') to avoid distorting proportions.

Favicon generation: The server automatically creates a 32x32 PNG icon for the browser tab.

 How to Install and Run
Step 1: Prepare the files
Create a new folder for your project (e.g., Workspace) and make sure it contains two files:

server.mjs — copy our server code here. (Important: the extension must be exactly .mjs, not .js!)

source.jpg — any photo or image of yours. This is the base image from which the server will generate all other sizes.

Step 2: Install dependencies
Open a terminal (PowerShell or Command Prompt) in your project folder and run these two commands one by one:

Bash
# 1. Initialize the project (this will create a package.json file)
npm init -y

# 2. Install the sharp library for image processing
npm install sharp
Step 3: Start the server
Once the library is installed, start the server with the command:

Bash
node server.mjs
If everything is done correctly, a message will appear in the console: 🚀 Server is running! Open in your browser: http://127.0.0.1:3000.

 How to Use
Open your browser and go to the following addresses:

http://127.0.0.1:3000/ — The main page with a welcome message and test links.

http://127.0.0.1:3000/image/100/100 — Get a 100x100 pixel square image.

http://127.0.0.1:3000/image/800/400 — Get an 800x400 pixel rectangular image.
(You can type any numbers instead of 800 and 400!)
