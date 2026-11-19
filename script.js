(()=>{
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id);
let W=innerWidth,H=innerHeight,dpr=1;
function resize(){W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener('resize',resize);resize();
const WORLD=2600,FOOD_MAX=260;
let foods=[],worms=[],player=null,running=false,paused=false,score=0,best=Number(localStorage.getItem('snakeWormsBest')||0),last=0,mouse={x:W/2+100,y:H/2},boost=false,sound=false,audio=null;
$('best').textContent=best;
const rand=(a,b)=>Math.random()*(b-a)+a;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const colors=['#ff5d73','#45d7ff','#c27bff','#ffd34e','#62e69c','#ff9c45','#ed70d1'];
function food(){return {x:rand(40,WORLD-40),y:rand(40,WORLD-40),r:rand(4,8),c:colors[Math.floor(Math.random()*colors.length)]}}
function makeWorm(x,y,color,isPlayer=false){
 let pts=[];for(let i=0;i<26;i++)pts.push({x:x-i*9,y});
 return {x,y,angle:rand(0,Math.PI*2),color,pts,target:rand(0,Math.PI*2),turn:0,alive:true,isPlayer,boost:false,aiTimer:0};
}
function reset(){
 foods=Array.from({length:FOOD_MAX},food);player=makeWorm(WORLD/2,WORLD/2,'#48e0a4',true);
 worms=[];for(let i=0;i<9;i++)worms.push(makeWorm(rand(200,WORLD-200),rand(200,WORLD-200),colors[i%colors.length]));
 score=0;running=true;paused=false;$('score').textContent='0';$('length').textContent='10';
 $('startScreen').classList.add('hidden');$('overScreen').classList.add('hidden');$('pauseScreen').classList.add('hidden');last=performance.now();requestAnimationFrame(loop);
}
function endGame(){running=false;let n=Math.max(best,score);best=n;localStorage.setItem('snakeWormsBest',best);$('best').textContent=best;$('finalScore').textContent=score;$('finalBest').textContent=best;$('overScreen').classList.remove('hidden')}
function angleDiff(a,b){return Math.atan2(Math.sin(b-a),Math.cos(b-a))}
function steer(w,dt){
 let desired=w.isPlayer?Math.atan2(mouse.y-H/2,mouse.x-W/2):w.target;
 if(!w.isPlayer){
   w.aiTimer-=dt;
   if(w.aiTimer<=0){w.aiTimer=rand(.8,2.4);let nearest=foods.reduce((m,f)=>dist(w,f)<dist(w,m)?f:m,foods[0]);w.target=nearest?Math.atan2(nearest.y-w.y,nearest.x-w.x):rand(0,Math.PI*2);
     if(w.x<130)w.target=0;if(w.x>WORLD-130)w.target=Math.PI;if(w.y<130)w.target=Math.PI/2;if(w.y>WORLD-130)w.target=-Math.PI/2;
   }
 }
 let diff=angleDiff(w.angle,desired);w.angle+=Math.max(-2.7*dt,Math.min(2.7*dt,diff));
 let fast=w.isPlayer?(boost||keys.has(' ')):false;
 let speed=fast?230:150;
 w.x=Math.max(24,Math.min(WORLD-24,w.x+Math.cos(w.angle)*speed*dt));
 w.y=Math.max(24,Math.min(WORLD-24,w.y+Math.sin(w.angle)*speed*dt));
 w.pts.unshift({x:w.x,y:w.y});
 let spacing=fast?10:8.5;
 while(w.pts.length>(w.isPlayer?26+Math.floor(score/2):26))w.pts.pop();
}
function eat(w){
 for(let i=foods.length-1;i>=0;i--){if(Math.hypot(w.x-foods[i].x,w.y-foods[i].y)<18+foods[i].r){let f=foods[i];foods.splice(i,1);if(w.isPlayer){score+=Math.ceil(f.r);$('score').textContent=score;$('length').textContent=10+Math.floor(score/2)}else if(w.pts.length<70)w.pts.push({...w.pts[w.pts.length-1]});}}
 while(foods.length<FOOD_MAX)foods.push(food());
}
function drawFood(camX,camY){
 for(const f of foods){let x=f.x-camX+W/2,y=f.y-camY+H/2;if(x<-20||x>W+20||y<-20||y>H+20)continue;
 ctx.shadowBlur=13;ctx.shadowColor=f.c;ctx.fillStyle=f.c;ctx.beginPath();ctx.arc(x,y,f.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 ctx.fillStyle='#ffffffaa';ctx.beginPath();ctx.arc(x-f.r*.3,y-f.r*.3,Math.max(1,f.r*.22),0,Math.PI*2);ctx.fill();}
}
function drawWorm(w,camX,camY){
 let p=w.pts;if(p.length<2)return;
 ctx.lineCap='round';ctx.lineJoin='round';
 for(let i=p.length-1;i>=0;i--){let q=p[i],x=q.x-camX+W/2,y=q.y-camY+H/2;let r=Math.max(4,12-i*.18);
 ctx.fillStyle=w.color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
 if(i%4===0){ctx.fillStyle='#ffffff22';ctx.beginPath();ctx.arc(x-r*.25,y-r*.35,r*.28,0,Math.PI*2);ctx.fill();}}
 let h=p[0],hx=h.x-camX+W/2,hy=h.y-camY+H/2;
 ctx.fillStyle=w.color;ctx.beginPath();ctx.arc(hx,hy,13,0,Math.PI*2);ctx.fill();
 let ex=hx+Math.cos(w.angle)*5,ey=hy+Math.sin(w.angle)*5;
 for(let s of [-1,1]){let ox=Math.cos(w.angle+Math.PI/2)*5*s,oy=Math.sin(w.angle+Math.PI/2)*5*s;ctx.fillStyle='white';ctx.beginPath();ctx.arc(ex+ox,ey+oy,3.4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#142235';ctx.beginPath();ctx.arc(ex+ox+Math.cos(w.angle),ey+oy+Math.sin(w.angle),1.7,0,Math.PI*2);ctx.fill();}
}
function drawArena(camX,camY){
 ctx.fillStyle='#080d16';ctx.fillRect(0,0,W,H);
 const step=48,ox=((W/2-camX)%step+step)%step,oy=((H/2-camY)%step+step)%step;
 ctx.strokeStyle='#18263a';ctx.lineWidth=1;
 for(let x=ox;x<W;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
 for(let y=oy;y<H;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
 let bx=24-camX+W/2,by=24-camY+H/2;
 ctx.strokeStyle='#314b68';ctx.lineWidth=5;ctx.strokeRect(bx,by,WORLD-48,WORLD-48);
}
function loop(t){
 if(!running||paused)return;let dt=Math.min((t-last)/1000,.04);last=t;
 steer(player,dt);for(const w of worms)steer(w,dt);
 eat(player);for(const w of worms)eat(w);
 // collision with other worm bodies; safe distance from own trailing body
 for(const w of worms){for(let i=5;i<w.pts.length;i+=2){if(Math.hypot(player.x-w.pts[i].x,player.y-w.pts[i].y)<13){endGame();return}}}
 // bots respawn when they bump into the player or arena edge
 for(let wi=0;wi<worms.length;wi++){let w=worms[wi];let hit=false;for(let i=5;i<player.pts.length;i+=3){if(Math.hypot(w.x-player.pts[i].x,w.y-player.pts[i].y)<13){hit=true;break}}
 if(hit||w.x<35||w.y<35||w.x>WORLD-35||w.y>WORLD-35)worms[wi]=makeWorm(rand(180,WORLD-180),rand(180,WORLD-180),colors[wi%colors.length]);}
 let camX=player.x,camY=player.y;drawArena(camX,camY);drawFood(camX,camY);for(const w of worms)drawWorm(w,camX,camY);drawWorm(player,camX,camY);
 requestAnimationFrame(loop);
}
const keys=new Set();addEventListener('keydown',e=>{keys.add(e.key.toLowerCase());if(e.key===' ')e.preventDefault()});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
canvas.addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY});
canvas.addEventListener('pointerdown',()=>{boost=true});addEventListener('pointerup',()=>boost=false);
$('boost').addEventListener('pointerdown',e=>{e.preventDefault();boost=true});$('boost').addEventListener('pointerup',()=>boost=false);$('boost').addEventListener('pointerleave',()=>boost=false);
let joy=$('joystick'),stick=$('stick'),joyActive=false;
joy.addEventListener('pointerdown',e=>{joyActive=true;joy.setPointerCapture(e.pointerId);moveJoy(e)});
joy.addEventListener('pointermove',e=>{if(joyActive)moveJoy(e)});joy.addEventListener('pointerup',()=>{joyActive=false;stick.style.transform='translate(0,0)';mouse.x=W/2+80;mouse.y=H/2});
function moveJoy(e){let r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy),k=Math.min(1,42/(len||1));dx*=k;dy*=k;stick.style.transform=`translate(${dx}px,${dy}px)`;mouse.x=W/2+dx*3;mouse.y=H/2+dy*3}
$('startBtn').onclick=reset;$('restartBtn').onclick=reset;
$('pauseBtn').onclick=()=>{if(!running)return;paused=true;$('pauseScreen').classList.remove('hidden')};
$('resumeBtn').onclick=()=>{paused=false;$('pauseScreen').classList.add('hidden');last=performance.now();requestAnimationFrame(loop)};
$('homeBtn').onclick=$('pauseHomeBtn').onclick=()=>{running=false;paused=false;$('overScreen').classList.add('hidden');$('pauseScreen').classList.add('hidden');$('startScreen').classList.remove('hidden')};
$('soundBtn').onclick=()=>{$('soundBtn').textContent=sound?'♫ Suara: Mati':'♫ Suara: Belum tersedia';sound=!sound};
})();
