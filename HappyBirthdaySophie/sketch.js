
let w = 200;
let stepsize = 1;
let Nwalkers = 100;
let fr = 100;

let cw = 500;
let canvas, src, pg;

let walkerpos = []

let transparent;


function proposal(pos) {}

let img;
function preload() {
  img = loadImage('birthday.png');
}

/*
class Walker {
  constructor() {
    this.pos = createVector(width, height);
  }
  //draw the walker
  draw(ctx) {
    ctx.circle(this.pos.x, this.pos.y, 1);
    ctx.line(this.newpos.x, this.newpos.y, this.pos.x, this.pos.y);
  }
  //calculate dBH
  get_dBH(landscape, prop) {
    let l = lightness(landscape.get(this.newpos.x, this.newpos.y)) - lightness(landscape.get(this.pos.x, this.pos.y));
    
    if (mouseIsPressed) {
      let tomouse = createVector(this.pos.x - mouseX, this.pos.y - mouseY);
      let mouse = p5.Vector.dot(tomouse, prop) / prop.mag() / tomouse.mag()
      //console.log('l, mouse:', l, mouse);
      return l + mouse;
    }
    
    //console.log('l:', l);
    return l;
  }
  
  //move the walker
  step(landscape) {
    this.prop = p5.Vector.random2D();
    this.newpos = p5.Vector.add(this.pos, this.prop);
    this.prop.mult(stepsize);
    let dBH = this.get_dBH(landscape, this.prop);
    
    let n = this.newpos;
    let withinBounds = (0 <= n.x) && (n.x <= w) && (0 <= n.y) && (n.y < w);
    
    if(withinBounds && (dBH <= 0 || exp(-dBH) > random(1))) {
      this.pos = n;
    }
    
  }
  //leave behing a trail in the landscape
  leaveFootstep(landscape) {
    landscape.loadPixels();
    let o = landscape.get(this.pos.x, this.pos.y);
    let n = color(hue(o), saturation(o), lightness(o) * 0.9);
    landscape.set(this.pos.x, this.pos.y, n);
    landscape.updatePixels();
  }
}

*/

function setup() {
  console.log('canvas has size: ', cw, cw);
  canvas = createCanvas(cw, cw);
  canvas.parent('sketch-holder');
  //pixelDensity(1);
  //let d = pixelDensity();
  frameRate(fr);
  
  overlay = createGraphics(windowWidth, windowHeight);
  overlay.pixelDensity(1);
  overlay.background(255);
  
  colorMode(HSL);
  transparent = color(1,1,1,0);

  walkers = [];
  for(let i = 0; i < Nwalkers; i += 1) {
    append(walkerpos, createVector(random(width), random(height)));
  }
}

function draw() {    
  background(255);
  image(img, 0, 0);
  image(overlay, 0, 0)
    

  for(let i = 0; i < Nwalkers; i += 1) {
    walkerpos[i].add(p5.Vector.random2D().mult(stepsize));
    circle(walkerpos[i].x, walkerpos[i].y, 5);
    overlay.set(walkerpos[i].x, walkerpos[i].y, transparent);
  }
  overlay.updatePixels();

}