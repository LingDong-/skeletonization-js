function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL//.replace(/^data:image\/(png|jpg);base64,/, "");
}
function url2img(url,callback){
  var img = new Image();
  img.src = url;
  img.crossOrigin = "anonymous";
  
  var success = false;
  while (!success){
    try{
      img.src = url;
      img.crossOrigin = "anonymous";
      getBase64Image(img);
      success = true;
    }catch(e){
      console.log("retry")
    }
    
  }
  img.onload=function(){callback(img)};
}
