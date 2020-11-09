
let w = 200;
let stepsize = 10;
let Nwalkers = 1;
let fr = 1;

let cw = 400;
let canvas, src, pg;

function proposal(pos) {
  
}

class Walker {
  constructor() {
    this.pos = createVector(w/2, w/2);
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
      console.log('l, mouse:', l, mouse);
      return l + mouse;
    }
    
    console.log('l:', l);
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

function setup() {
  canvas = createCanvas(cw, cw);
  pixelDensity(1);
  let d = pixelDensity();
  frameRate(fr);
  
  src = createGraphics(w, w);
  src.pixelDensity(1);
  src.textAlign(CENTER, CENTER);
  src.background(255);
  src.textSize(6.5 * w/50);
  src.text("Happy Birthday\n Sophie!", w/2, w/2);
  src.loadPixels();
  
  dest = createGraphics(w, w);
  dest.pixelDensity(1);
  dest.background(255);
  
  pg = createGraphics(w, w);
  pg.pixelDensity(1);
  pg.background(255);
  
  colorMode(HSL);

  image(pg, 0, 0, cw, cw);

  walkers = [];
  for(let i = 0; i < Nwalkers; i += 1) {
    append(walkers, new Walker());
  }
}

function draw() {
  pg.reset();
  pg.background(255);
  
  walkers.forEach(function(w) {
    w.step(src);
    w.leaveFootstep(dest);
    w.draw(pg);
  });
  
  image(src, 0, 0, cw, cw)
  image(dest, 0, 0, cw, cw);
  image(pg, 0, 0, cw, cw);

}