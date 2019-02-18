/* global describe skeletonization url2img */

var WIDTH = 256;
var HEIGHT = 256;

var stockIdx = 0;
var demo = document.getElementById("demo");

var stock = [
  {url:"https://cdn.glitch.com/51dda229-d755-451b-a499-79a1285996fa%2Fhorse.jpg?1550457913227", args:{invert:true, blur:5, threshold:132}},
  {url:"https://cdn.glitch.com/51dda229-d755-451b-a499-79a1285996fa%2Fhanzi.jpg?1550462271316", args:{invert:false, blur:5, threshold:90}},
  {url:"https://cdn.glitch.com/51dda229-d755-451b-a499-79a1285996fa%2Fcmuscs.jpg?1550464003459", args:{invert:true, blur:3, threshold:100}},
  {url:"https://cdn.glitch.com/51dda229-d755-451b-a499-79a1285996fa%2Fopencv.jpg?1550463543394", args:{invert:true, blur:1, threshold:10}},
  {url:"https://cdn.glitch.com/51dda229-d755-451b-a499-79a1285996fa%2Ffence.jpg?1550465936397", args:{invert:false, blur:2, threshold:80}},
  {url:"https://cdn.glitch.com/51dda229-d755-451b-a499-79a1285996fa%2Fmanuscript.jpg?1550466540959", args:{invert:true, blur:0, threshold:110}},
]

function loadStock(i){
  var c = stock[i];
  // inp.value = c.url;
  inparg.value = JSON.stringify(c.args);
  processImageFromUrl(c.url,c.args);
}

function loadReadme(){
  var client = new XMLHttpRequest();
  client.open('GET', 'README.md');
  client.onreadystatechange = function() {
    if (client.readyState == 4 && client.status == "200") {
      var converter = new showdown.Converter();
      var text = client.responseText.toString();
      var html = converter.makeHtml(text)//.replace("skeletonization.js","README");
      document.getElementById("readme").innerHTML = html;
    }
  }
  client.send();
}
loadReadme();



var inpdiv = document.createElement("div");
inpdiv.innerHTML += "Upload Image:&nbsp;";
var inp = document.createElement("input");
inp.type = "file";
inp.addEventListener('change', function(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canv0.getContext("2d").drawImage(img, 0, 0, WIDTH, HEIGHT);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}, false);
inpdiv.appendChild(inp);

var procbtn = document.createElement("button");
procbtn.innerHTML = "Skeletonize!";
procbtn.onclick = function(){attemptSkeletonization(JSON.parse(inparg.value));};
inpdiv.appendChild(procbtn);

var randbtn = document.createElement("button");
randbtn.innerHTML = "Random Image";
randbtn.onclick = function(){stockIdx++;loadStock(stockIdx%stock.length)};
inpdiv.appendChild(randbtn);


var inpargdiv = document.createElement("div");
inpargdiv.innerHTML += "Settings:&nbsp;";
var inparg = document.createElement("input");
inparg.type = "text";
inparg.style.width = "445px";
inparg.value = "{}";
inpargdiv.appendChild(inparg);

var statusdiv = document.createElement("div");
statusdiv.innerHTML += "[STATUS] Loading...";


demo.appendChild(inpdiv);
demo.appendChild(inpargdiv);

var canv0 = document.createElement("canvas");
canv0.width = WIDTH;
canv0.height = HEIGHT;
canv0.id = "canv0";
demo.appendChild(canv0);

var canv1 = document.createElement("canvas");
canv1.id = "canv1";
canv1.width = WIDTH;
canv1.height = HEIGHT;
demo.appendChild(canv1);

demo.appendChild(statusdiv);


skeletonization.setup(256,256);

var attemptSkeletonization = function(args){
  function f(){
    var success = skeletonization.skeletonize(canv0.id,Object.assign({},{outputCanvasId:"canv1"},args));
    
    if (success == -1){
      setTimeout(f, 200);
    }else{
      statusdiv.innerHTML = "[STATUS] OK.";
    }
  }
  f();
}

var processImageFromUrl = function (url,args) {
  url2img(url,function(img){
    canv0.getContext("2d").drawImage(img, 0, 0, WIDTH, HEIGHT);
    attemptSkeletonization(args);
  });
}

loadStock(0);