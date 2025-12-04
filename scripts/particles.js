// particles.js - interactive neon particles
const canvas = document.getElementById('particles');
if(canvas){
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const colors = ['rgba(140,82,255,0.95)','rgba(110,48,255,0.6)','rgba(140,82,255,0.35)'];
  function rand(min,max){return Math.random()*(max-min)+min}
  class P{
    constructor(){
      this.x=rand(0,w);this.y=rand(0,h);
      this.vx=rand(-0.25,0.25);this.vy=rand(-0.25,0.25);
      this.r=rand(0.6,2.8);
      this.c=colors[Math.floor(rand(0,colors.length))];
    }
    update(){
      this.x+=this.vx;this.y+=this.vy;
      // simple mouse repulsion
      if(window._mouse){
        const dx=this.x-window._mouse.x, dy=this.y-window._mouse.y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          const ang=Math.atan2(dy,dx);
          this.x += Math.cos(ang)*2;
          this.y += Math.sin(ang)*2;
        }
      }
      if(this.x<0)this.x=w; if(this.x>w)this.x=0;
      if(this.y<0)this.y=h; if(this.y>h)this.y=0;
    }
    draw(){ctx.beginPath();ctx.fillStyle=this.c;ctx.globalCompositeOperation='lighter';ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill()}
  }
  function init(){particles.length=0;let count=Math.floor((w*h)/60000);count=Math.max(50,Math.min(220,count));for(let i=0;i<count;i++)particles.push(new P())}
  function loop(){ctx.clearRect(0,0,w,h);particles.forEach(p=>{p.update();p.draw()});requestAnimationFrame(loop)}
  addEventListener('resize',()=>{w=canvas.width=innerWidth;h=canvas.height=innerHeight;init()});
  addEventListener('mousemove', (e)=>{window._mouse={x:e.clientX,y:e.clientY}});
  init();loop();
}
