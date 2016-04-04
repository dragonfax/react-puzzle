
npm install --save react react-dom babelify babel-preset-react

npm install -g browserify

browserify -t [ babelify --presets [ react ] ] main.js -o bundle.js

open index.html


