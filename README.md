skeletonization.js library
=================

![](https://cdn.glitch.com/51dda229-d755-451b-a499-79a1285996fa%2Fsample.png?1550470920804)

GPU-powered image [skeletonization](https://en.wikipedia.org/wiki/Topological_skeleton) for the web.


Based on [orginal C++ code by Zhang-Suen](https://web.archive.org/web/20130313084711/http://opencv-code.com/quick-tips/implementation-of-thinning-algorithm-in-opencv/).

With GPU support from [gpu.js](https://gpu.rocks/).

Uses [OpenCV.js](https://docs.opencv.org/3.4/d5/d10/tutorial_js_root.html).

Checkout the live demo at [skeletonization-js.glitch.me](https://skeletonization-js.glitch.me).

## Usage

In your HTML file:

```html
<!-- Include OpenCV.js -->
<script src="https://docs.opencv.org/3.4/opencv.js"></script>

<!-- Include gpu.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gpu.js/1.10.4/gpu.min.js"></script>

<!-- Include skeletonization.js -->
<script src="https://skeletonization-js.glitch.me/skeletonization.js"></script>

```

In your Javascript file:

```javascript

// Usage with HTML Canvas:

// setup skeletonization:
skeletonization.setup(
  256, // output width
  256  // output height
);

// skeletonize a canvas element specified by its id:
skeletonization.skeletonize("inputCanvasId", {
  preprocess: true, // whether or not to preprocess the
                    // source image (blur, threshold, etc.)
    blur: 5,        // if preprocess, radius of blurring to apply
    threshold: 128, // if preprocess, binary threshold to apply
    invert: false,  // if preprocess, invert the image (foreground
                    // should be white, background should be black)
  outputCanvasId: "outputCanvasId", // id of canvas on which output
                                    // will be displayed
  bbox: [0,0,256,256], // bounding box (xmin,ymin,xmax,ymax) of
                       // the region to apply skeletonization,
                       // leave undefined to apply to whole image
})


```

You can also skeletonize `cv::Mat`, e.g. in an OpenCV.js project:

```javascript

// Usage with OpenCV.js:

// setup skeletonization
skeletonization.setup(
  256, // output width
  256  // output height
);

// read the image with OpenCV.js
var im = cv.imread("inputCanvasId");

// ... (custom preprocessing)

// skeletonize the cv::Mat
// skeletonize modifies the input cv::Mat,
// so save a copy if you still need the original
skeletonization.skeletonize(im, {
  preprocess: true, // whether or not to preprocess the
                    // source image (blur, threshold, etc.)
    blur: 5,        // if preprocess, radius of blurring to apply
    threshold: 128, // if preprocess, binary threshold to apply
    invert: false,  // if preprocess, invert the image (foreground
                    // should be white, background should be black)
  bbox: [0,0,256,256], // bounding box (xmin,ymin,xmax,ymax) of
                       // the region to apply skeletonization,
                       // leave undefined to apply to whole image
})

// ... (custom postprocessing)

// display the result
cv.imshow("outputCanvasId",im);


```