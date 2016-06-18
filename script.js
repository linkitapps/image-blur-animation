function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function blurAnimation(imageId, color) {
  var image = document.getElementById(imageId),
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    padding = 50,
    imageWidth = 120,
    imageHeight = 120,
    width = imageWidth + padding * 2,
    height = imageHeight + padding * 2,
    x = 0,
    y = 0;

  canvas.width = width;
  canvas.height = height;
  canvas.style.display = 'none';

  image.style.display = 'none';
  insertAfter(image, canvas);

  ctx.drawImage(image, x, y, imageWidth, imageHeight);

  var map = ctx.getImageData(x, y, imageWidth, imageHeight);
  var imdata = map.data;

  // convert image to grayscale
  var r,g,b,avg;
  for(var p = 0, len = imdata.length; p < len; p+=4) {
    r = imdata[p];
    g = imdata[p+1];
    b = imdata[p+2];

    avg = Math.floor((r+g+b)/3);

    //imdata[p] = imdata[p+1] = imdata[p+2] = avg;

    if (imageId === 'image1') {
      imdata[p] = 255;
      imdata[p+1] = imdata[p+2] = avg;
    } else if (imageId === 'image2') {
      imdata[p+1] = 255;
      imdata[p] = imdata[p+2] = avg;
    } else if (imageId === 'image3') {
      imdata[p+2] = 255;
      imdata[p] = imdata[p+1] = avg;
    }
  }

  ctx.putImageData(map, x, y);

  // overlay filled rectangle using lighter composition
  // ctx.globalCompositeOperation = "lighter";
  // ctx.globalAlpha = 1;
  // ctx.fillStyle = color;
  // ctx.fillRect(x, y, imageWidth, imageHeight);

  image.src = canvas.toDataURL();




  function draw(level) {
    ctx.clearRect(0, 0, width, height);

    ctx.shadowColor = color;
    ctx.shadowBlur = level;

    ctx.drawImage(image, x, y, imageWidth, imageHeight, x + padding, y + padding, imageWidth, imageHeight);
  }

  var count = 1,
    increase = true;

  setInterval(function() {
    if (canvas.style.display === 'none') {
      canvas.style.display = 'inline-block';
    }

    var level = count * 5;

    if (count == 0) {
      increase = true;
    } else if (count >= 10) {
      increase = false;
    }

    draw(level);

    if (increase) {
      count++;
    } else {
      count--;
    }
  }, 100);
}


window.onload = function() {
  blurAnimation('image1', '#ff0000');
  blurAnimation('image2', '#00ff00');
  blurAnimation('image3', '#0000ff');
};
