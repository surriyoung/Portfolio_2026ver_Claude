/* 공통(전 페이지): data-asset 이미지 로드 + 이력서 토스트 */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
$$('[data-asset]').forEach(el=>{
  const src=el.dataset.asset,im=new Image();
  im.onload=()=>{el.style.backgroundImage=`url("${src}")`;el.classList.remove('is-fallback');el.classList.add('has-img');};
  im.onerror=()=>el.classList.add('is-fallback');
  im.src=src;
});
/* 공용 헬퍼(window.PF): 데이터 로드 / 썸네일 / 카드 */
const root=document.body.dataset.root||'';
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const hue=id=>[...id].reduce((a,m)=>a+m.charCodeAt(0),0)%360;
const tryImg=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(src);i.onerror=()=>r(null);i.src=src;});
const findImg=base=>tryImg(`${root}${base}.webp`);
const load=()=>fetch(root+'data/projects.json').then(r=>r.json()).then(a=>a.filter(p=>!p.hidden));
function thumb(el,p){ // 썸네일: p.thumbnail > assets/projects/{id}.webp > 플레이스홀더
  el.style.setProperty('--h',hue(p.id));el.textContent=p.name.replace(/\s/g,'').slice(0,2);el.classList.add('is-fallback');
  (p.thumbnail?tryImg(root+p.thumbnail):findImg(`assets/projects/${p.id}`)).then(s=>{if(s){el.style.backgroundImage=`url("${s}")`;el.classList.remove('is-fallback');el.textContent='';}});
}
function card(p,href){
  const li=document.createElement('li');li.className='project-card';
  li.innerHTML=`<a href="${href}"><div class="ph"></div><strong>${esc(p.name)}</strong><span class="chip">${esc(p.type)}</span></a>`;
  thumb($('.ph',li),p);return li;
}
const M={D:'디자인',P:'퍼블리싱',A:'앱 개발'};
const roleLabel=r=>String(r||'').trim().split(/\s+/).filter(t=>M[t[0]]).map(t=>`${M[t[0]]} ${t.slice(1)}%`).join(' · ');
const stackOf=p=>{if(p.stack&&p.stack.length)return p.stack;const s=p.cat==='a'?['Flutter']:['HTML','CSS','JavaScript'];
  [['그누보드','그누보드5'],['아임웹','아임웹'],['퍼스트몰','퍼스트몰']].forEach(([k,v])=>{if(p.type.includes(k))s.push(v);});
  if(/D\d/.test(p.role||'')||p.figma)s.push('Figma');return s;};
window.PF={$,$$,root,esc,hue,tryImg,findImg,load,thumb,card,roleLabel,stackOf};
/* [resume-toast] 스크롤이 멈추면 하단에서 노출 */
const el=$('#resume-toast');if(!el)return;
let timer,gone=false;
try{gone=sessionStorage.getItem('resumeClosed')==='1';}catch(e){}
const hide=()=>{el.classList.remove('is-show');el.setAttribute('aria-hidden','true');};
$('.resume-toast__close').addEventListener('click',()=>{hide();gone=true;try{sessionStorage.setItem('resumeClosed','1');}catch(e){}});
addEventListener('scroll',()=>{hide();clearTimeout(timer);
  timer=setTimeout(()=>{if(!gone&&scrollY>innerHeight*.6){el.classList.add('is-show');el.setAttribute('aria-hidden','false');}},800);},{passive:true});
})();
