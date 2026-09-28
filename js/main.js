const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== [sec-hero] 말풍선 순차 등장 + 캐릭터(시선추적/깜빡임/패럴랙스) ===== */
(function hero(){
  $$('.hero__bubble-list .bubble').forEach((b,i)=>{b.style.cssText+=`;opacity:0;translate:0 10px;transition:opacity .4s steps(4) ${.5+i*.6}s,translate .4s steps(4) ${.5+i*.6}s`;});
  requestAnimationFrame(()=>$$('.hero__bubble-list .bubble').forEach(b=>{b.style.opacity=1;b.style.translate='none';}));
  const ch=$('.hero__character'); if(!ch||reduce) return;
  let fx=1,fy=1,t=0,busy=false;
  const set=()=>{ch.style.setProperty('--fx',fx);ch.style.setProperty('--fy',fy);};
  addEventListener('pointermove',e=>{
    const r=ch.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
    fx=dx<-r.width*.3?0:dx>r.width*.3?2:1; fy=dy<-r.height*.3?0:dy>r.height*.3?2:1;
    if(!t) t=requestAnimationFrame(()=>{t=0;set();
      ch.style.setProperty('--px',(e.clientX/innerWidth*2-1).toFixed(2));
      ch.style.setProperty('--py',(e.clientY/innerHeight*2-1).toFixed(2));});
  },{passive:true});
  (function blink(){setTimeout(()=>{ if(!document.hidden){const p=fy;ch.style.setProperty('--fy',3);setTimeout(()=>ch.style.setProperty('--fy',p),140);} blink();},4000+Math.random()*2500);})();
})();

/* ===== [sec-menubar] 스크롤 스파이 (sticky는 CSS) ===== */
(function menubar(){
  const links=$$('.menubar a'),map=new Map(links.map(a=>[a.hash.slice(1),a]));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){links.forEach(l=>l.classList.remove('is-active'));map.get(e.target.id)?.classList.add('is-active');}}),{rootMargin:'-40% 0px -55% 0px'});
  map.forEach((_,id)=>{const s=document.getElementById(id);s&&io.observe(s);});
})();

/* ===== [sec-projects] 대표작(JSON featured) 렌더 후 Swiper 초기화. 전체 목록은 project/list.html ===== */
(async function projects(){
  try{
    (await PF.load()).filter(p=>p.featured).sort((a,b)=>a.featured-b.featured).forEach(p=>{
      const li=PF.card(p,`project/view.html?id=${encodeURIComponent(p.id)}`);li.classList.add('swiper-slide');$('#featured-list').append(li);});
  }catch(e){console.warn('projects.json 로드 실패 (로컬은 서버로 실행)',e);}
  if(window.Swiper) new Swiper('.projects__slider',{slidesPerView:1.2,spaceBetween:16,breakpoints:{600:{slidesPerView:2},1000:{slidesPerView:3}},navigation:{prevEl:'.projects__prev',nextEl:'.projects__next'}});
})();

/* ===== [sec-history] 탭 필터 + 진행 라인 + 총 경력 자동 계산 ===== */
(function history(){
  const items=$$('.history__item');
  $$('.history__tabs button').forEach(b=>b.addEventListener('click',()=>{
    $$('.history__tabs button').forEach(x=>x.setAttribute('aria-selected',x===b));
    items.forEach(i=>i.hidden=b.dataset.filter!=='all'&&i.dataset.group!==b.dataset.filter);
  }));
  const ym=s=>{const[a,b]=s.split('.').map(Number);return a*12+b-1;},now=new Date(),cur=now.getFullYear()*12+now.getMonth();
  const iv=items.filter(i=>i.dataset.group==='work').map(i=>{const[s,e]=$('.history__period',i).textContent.split(' - ');return[ym(s),e==='현재'?cur:ym(e)];}).sort((a,b)=>a[0]-b[0]);
  let total=0,end=-1;iv.forEach(([s,e])=>{s=Math.max(s,end);if(e>s)total+=e-s;end=Math.max(end,e);});
  $('.history__total').textContent=`${Math.floor(total/12)}년 ${total%12}개월 (업력 ${Math.floor(total/12)+1}년차)`;
  const tl=$('.history__timeline'),bar=$('.history__progress');
  const upd=()=>{const r=tl.getBoundingClientRect();bar.style.height=Math.max(0,Math.min(r.height,innerHeight*.5-r.top))+'px';};
  addEventListener('scroll',upd,{passive:true});upd();
})();

/* ===== [common] 에셋 로드 + 스크롤 등장 ===== */
if(!reduce){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.1});
  $$('.about__intro .bubble,.about__card,.skills__card,.history__item,.contact__bubble').forEach(el=>{el.classList.add('rv');io.observe(el);});
}
