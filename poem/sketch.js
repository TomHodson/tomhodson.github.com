
let w = 200;
let stepsize = 1;
let Nwalkers = 300;
let fr = 30;
let beta = 0.1; //beta = 0 chooses infinite temperature, beta = inf forces the walkers to go only towards the gradient
let betaslider;

let radio;

let cw = 500;
let canvas, src, pg;

let walkerpos = []

let transparent;


function proposal(pos) {}

let img;
let distfield;
function preload() {
  img = loadImage('image.png');
  distfield = loadImage('distfield.png');
}

let dist, showdist, showtarget, showpaths, showwalkers;
let step;
let newpos;

function setup() {
  console.log('canvas has size: ', cw, cw);
  canvas = createCanvas(cw, cw);
  canvas.parent('sketch-holder');
  //pixelDensity(1);
  //let d = pixelDensity();
  frameRate(fr);
    
  betaslider = createSlider(0, 1, 0.5, 0.0001);
  //betaslider.position(10, 10);
  betaslider.style('width', '80px');
  
  showdist = createCheckbox('Show distance function', false);
  showtarget = createCheckbox('Show target image', false);
  showpaths = createCheckbox('Show paths', true);
  showwalkers = createCheckbox('Show walkers', true);
    
  overlay = createGraphics(windowWidth, windowHeight);
  overlay.pixelDensity(1);
  overlay.background(color(0,0,0,0));
    
  dist = function(pos) {
      return distfield.get(pos.x, pos.y)[0];
  }
  
  colorMode(HSL);

  walkers = [];
  for(let i = 0; i < Nwalkers; i += 1) {
    append(walkerpos, createVector(random(width), random(height)));
  }
    
  step = createVector(0,0);
}

let b;
function draw() {    
  background(255);
  if(showdist.checked()) image(distfield, 0, 0); //the min distance to the nearest non white pixel in the target image
  if(showtarget.checked()) image(img, 0, 0); //the target image
  if(showpaths.checked()) {
    //tint(255, 5e6 / frameCount / Nwalkers);
    image(overlay, 0, 0);
  }

  //text(dist(createVector(mouseX, mouseY)), width/2, height/2);
  //text(overlay.get(mouseX, mouseY), width/2, height/2);

  beta = betaslider.value();
  beta = beta / (1 - beta);
    
  overlay.loadPixels();  
  for(let i = 0; i < Nwalkers; i += 1) {
    //let debug = Math.sqrt((mouseX - walkerpos[i].x)**2 + (mouseY - walkerpos[i].y)**2) < 10;
    step.x = 2*stepsize*(random() - 0.5);
    step.y = 2*stepsize*(random() - 0.5);
    newpos = p5.Vector.add(walkerpos[i], step);
    let df = dist(newpos) - dist(walkerpos[i]);
    if(df > 0 | exp(beta * df) > random(1.0)) {
        walkerpos[i].add(step);
    }
    if(showwalkers.checked()) circle(walkerpos[i].x, walkerpos[i].y, 3);  
    
    // loop over
    index = 4 * (int(walkerpos[i].y) * overlay.width + int(walkerpos[i].x));
    b = overlay.pixels[index+3] + 5
    overlay.pixels[index+3] = b;
  }
  overlay.updatePixels();


}