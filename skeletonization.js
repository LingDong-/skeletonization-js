/* global describe cv GPU */
// Orginal C++ code by Zhang-Suen:
// https://web.archive.org/web/20130313084711/http://opencv-code.com/quick-tips/implementation-of-thinning-algorithm-in-opencv/
// Adapted to JS with GPU support (from gpu.js) by Lingdong Huang;

/**
 * Code for thinning a binary image using Zhang-Suen algorithm.
 */

var skeletonization = {}

skeletonization.setup = function(width,height){
  skeletonization.KERNEL_WIDTH = width;
  skeletonization.KERNEL_HEIGHT = height;
  skeletonization.thinning_gpu = new GPU();
  skeletonization.thinning_iterKernel0 = skeletonization.thinning_gpu.createKernel(function(a,WIDTH,HEIGHT,bbox) {

    if (this.thread.x < bbox[1]*WIDTH || this.thread.x > bbox[3] * WIDTH || this.thread.x % WIDTH < bbox[0] || this.thread.x % WIDTH > bbox[2]){
      return 0;
    }

    var result = 0;
    var one = 255;
    var two = 510;
    var six = 1530;
    var p2 = a[this.thread.x-WIDTH];
    var p4 = a[this.thread.x+1];
    var p6 = a[this.thread.x+WIDTH];
    var p8 = a[this.thread.x-1];

    var m1 = (p2 * p4 * p6) 
    if (m1 == 0){
      var m2 = (p4 * p6 * p8)
      if (m2 == 0){
        var p3 = a[this.thread.x-WIDTH+1];
        var p5 = a[this.thread.x+WIDTH+1];
        var p7 = a[this.thread.x+WIDTH-1];
        var p9 = a[this.thread.x-WIDTH-1];

        var B  = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;

        if ((B >= two && B <= six)){
          var A0 = 0; var A1 = 0; var A2 = 0; var A3 = 0; var A4 = 0; var A5 = 0; var A6 = 0; var A7 = 0;
          if (p2 == 0 && p3 == one) {A0 = 1;}
          if (p3 == 0 && p4 == one) {A1 = 1;}
          if (p4 == 0 && p5 == one) {A2 = 1;} 
          if (p5 == 0 && p6 == one) {A3 = 1;} 
          if (p6 == 0 && p7 == one) {A4 = 1;}  
          if (p7 == 0 && p8 == one) {A5 = 1;}
          if (p8 == 0 && p9 == one) {A6 = 1;}  
          if (p9 == 0 && p2 == one) {A7 = 1;}  
          var A  = A0 + A1 + A2 + A3 + A4 + A5 + A6 + A7;
          if (A == 1){
            result = 255;
          }
        }
      }
    }
    return result;
  }).setOutput([skeletonization.KERNEL_WIDTH*skeletonization.KERNEL_HEIGHT]);


  skeletonization.thinning_iterKernel1 = skeletonization.thinning_gpu.createKernel(function(a,WIDTH,HEIGHT,bbox) {

    if (this.thread.x < bbox[1]*WIDTH || this.thread.x > bbox[3] * WIDTH || this.thread.x % WIDTH < bbox[0] || this.thread.x % WIDTH > bbox[2]){
      return 0;
    }


    var result = 0;
    var one = 255;
    var two = 510;
    var six = 1530;
    var p2 = a[this.thread.x-WIDTH];
    var p4 = a[this.thread.x+1];
    var p6 = a[this.thread.x+WIDTH];
    var p8 = a[this.thread.x-1];

    var m1 = (p2 * p4 * p8) 
    if (m1 == 0){
      var m2 = (p2 * p6 * p8)
      if (m2 == 0){
        var p3 = a[this.thread.x-WIDTH+1];
        var p5 = a[this.thread.x+WIDTH+1];
        var p7 = a[this.thread.x+WIDTH-1];
        var p9 = a[this.thread.x-WIDTH-1];

        var B  = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;

        if ((B >= two && B <= six)){
          var A0 = 0; var A1 = 0; var A2 = 0; var A3 = 0; var A4 = 0; var A5 = 0; var A6 = 0; var A7 = 0;
          if (p2 == 0 && p3 == one) {A0 = 1;}
          if (p3 == 0 && p4 == one) {A1 = 1;}
          if (p4 == 0 && p5 == one) {A2 = 1;} 
          if (p5 == 0 && p6 == one) {A3 = 1;} 
          if (p6 == 0 && p7 == one) {A4 = 1;}  
          if (p7 == 0 && p8 == one) {A5 = 1;}
          if (p8 == 0 && p9 == one) {A6 = 1;}  
          if (p9 == 0 && p2 == one) {A7 = 1;}  
          var A  = A0 + A1 + A2 + A3 + A4 + A5 + A6 + A7;
          if (A == 1){
            result = 255;
          }
        }
      }
    }
    return result;
  }).setOutput([skeletonization.KERNEL_WIDTH*skeletonization.KERNEL_HEIGHT]);
  
  
  /**
   * Perform one thinning iteration.
   * Normally you wouldn't call this function directly from your code.
   *
   * @param  im    Binary image with range = 0-1
   * @param  iter  0=even, 1=odd
   */


  skeletonization.thinningIteration = function(im,iter,bbox){

      var marker = cv.Mat.zeros(im.size(), cv.CV_8UC1);
      var d;
      if (iter == 0){
        d = skeletonization.thinning_iterKernel0(new Uint8Array( im.data), skeletonization.KERNEL_WIDTH,skeletonization.KERNEL_HEIGHT, bbox);
      }else{
        d = skeletonization.thinning_iterKernel1(new Uint8Array( im.data), skeletonization.KERNEL_WIDTH,skeletonization.KERNEL_HEIGHT, bbox);
      }
      marker.data.set(d);
      cv.bitwise_not(marker,marker);
      cv.bitwise_and(im,marker,im);
      marker.delete();
  }
  
  /**
   * Function for thinning the given binary image
   *
   * @param  im  Binary image with range = 0-255
   */
  skeletonization.skeletonize_mat = function(im, args){
    if (args == undefined){args = {}}
    if (args.bbox == undefined){args.bbox = [0,0,skeletonization.KERNEL_WIDTH,skeletonization.KERNEL_HEIGHT]}
    if (args.preprocess == undefined){args.preprocess = true}
    
    if (im.size().width != skeletonization.KERNEL_WIDTH || im.size().height != skeletonization.KERNEL_HEIGHT){
      cv.resize(im,im,new cv.Size(skeletonization.KERNEL_WIDTH , skeletonization.KERNEL_HEIGHT));
    }
    
    if (args.preprocess){
      skeletonization.preprocess(im,args)
    }
    if (im.rows != skeletonization.KERNEL_WIDTH || im.cols != skeletonization.KERNEL_HEIGHT){
      console.log(`ASSERTION FAILED: TEXTURE NEEDS TO BE ${skeletonization.KERNEL_WIDTH}x${skeletonization.KERNEL_HEIGHT};`)
      return;
    }

    var prev = cv.Mat.zeros(im.rows,im.cols, cv.CV_8UC1);
    var diff = new cv.Mat();


    do {
      skeletonization.thinningIteration(im, 0, args.bbox);
      skeletonization.thinningIteration(im, 1, args.bbox);
      cv.absdiff(im, prev, diff);
      im.copyTo(prev);
    } 
    while (cv.countNonZero(diff) > 0);

    prev.delete; diff.delete();
    return 0;
  }
  
  skeletonization.preprocess = function(src,args){
    if (args == undefined){args = {}}
    if (args.blur == undefined){args.blur = 5}
    if (args.threshold == undefined){args.threshold = 128}
    if (args.invert == undefined){args.invert = false}
    if (src.channels() > 1){
      cv.cvtColor(src, src, cv.COLOR_RGB2GRAY);
    }
    if (args.invert == true){
      cv.bitwise_not(src,src);
    }
    let ksize = new cv.Size(args.blur*2+1, args.blur*2+1);
    let anchor = new cv.Point(-args.blur, -args.blur);
    cv.blur(src, src, ksize, anchor, cv.BORDER_DEFAULT);
    cv.threshold(src, src, args.threshold, 255, cv.THRESH_BINARY);
  }
  
  skeletonization.skeletonize_canvas = function(canv_id,args){
    if (args == undefined){args = {}}
    try{
      var src = cv.imread(canv_id);
    }catch (e){
      console.log("OpenCV.js not ready yet or invalid canvas ID. Please try again. Below is original OpenCV error message:");
      console.log(e);
      return -1;
    }
    var success = skeletonization.skeletonize_mat(src,args);
    cv.imshow(args.outputCanvasId,src);
    src.delete();
    return success;
  }

  skeletonization.skeletonize = function(what,args){
    if (args == undefined){args = {}}
    if (typeof what == "string"){
      return skeletonization.skeletonize_canvas(what,args);
    }else{
      return skeletonization.skeletonize_mat(what,args);
    }
  }
  
}










