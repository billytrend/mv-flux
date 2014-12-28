#!/bin/sh

jsx app.jsx > app.inter.js
browserify app.inter.js > app.js
