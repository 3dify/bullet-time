import cv from 'opencv';

const LOW_THRESH = 0;
const HIGH_THRESH = 100;
const N_ITERS = 2;
const MIN_AREA = 10000;
const GREEN = [0, 255, 0];
const RED = [0, 0, 255];
const BLUE = [255, 0, 0];

export default function findMarker(color=70, file) {
  // (B)lue, (G)reen, (R)ed
  var lower_threshold = [color - 5, 100, 100];
  var upper_threshold = [color + 5, 255, 255];
  console.info('finding markers for', file.cyan);
  cv.readImage(file, function(err, im) {
    if (err) throw err;
    if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
    var paint = im.copy();
    im.convertHSVscale();
    im.inRange(lower_threshold, upper_threshold);
    im.canny(LOW_THRESH, HIGH_THRESH);
    im.dilate(N_ITERS);

    var contours = im.findContours();

    for(var i = 0; i < contours.size(); i++) {
      if(contours.area(i) > MIN_AREA) {
        var moments = contours.moments(i);
        var cgx = Math.round(moments.m10 / moments.m00);
        var cgy = Math.round(moments.m01 / moments.m00);
        paint.drawContour(contours, i, BLUE);
        paint.line([cgx - 5, cgy], [cgx + 5, cgy], RED);
        paint.line([cgx, cgy - 5], [cgx, cgy + 5], RED);
      }
    }
    paint.save('./tmp/contours.jpg');
    im.save('./tmp/coin_detected.jpg');
    console.log('Image saved to ./tmp/coin_detected.jpg');
  });
}
