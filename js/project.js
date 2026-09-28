/* project/list.html + project/view.html 렌더링 (data/projects.json) */
(()=>{
const {$,esc,root,hue,tryImg,findImg,load,card,roleLabel,stackOf}=PF;
const list=document.getElementById('project-list'),view=document.getElementById('project-view'),q=new URLSearchParams(location.search);
load().then(all=>list?renderList(all):renderView(all)).catch(()=>(list||view).insertAdjacentHTML('beforeend','<p>데이터를 불러오지 못했습니다. (로컬에서는 서버로 실행해 주세요)</p>'));

function renderList(all){
  const tabs=[['all','전체'],['publishing','퍼블리싱'],['app','앱개발']],f=k=>k==='all'?all:all.filter(p=>p.cat===(k==='app'?'a':'p'));
  const cur=tabs.some(t=>t[0]===q.get('cat'))?q.get('cat'):'all';
  $('.plist__filter').innerHTML=tabs.map(([k,v])=>`<a href="?cat=${k}"${k===cur?' aria-current="true"':''}>${v} (${f(k).length})</a>`).join('');
  f(cur).forEach(p=>$('.plist__grid').append(card(p,`view.html?id=${encodeURIComponent(p.id)}`)));
}
function renderView(all){
  const p=all.find(x=>x.id===q.get('id'));
  if(!p){view.innerHTML='<h1>프로젝트를 찾을 수 없습니다.</h1><a class="chip" href="list.html">← LIST</a>';return;}
  document.title=`${p.name} | PROJECT`;
  const chips=a=>a.map(s=>`<span class="chip">${esc(s)}</span>`).join('');
  const shot=(k,l)=>`<div data-shot="${k}" data-label="${l}"><div class="ph-box" style="--h:${hue(p.id)}"><span>${l}<small>assets/projects/${esc(p.id)}/${k}.webp</small></span></div></div>`;
  const role=roleLabel(p.role),ok=/^https?:\/\//.test(p.link||'');
  view.innerHTML=`
  <a class="chip pview__back" href="list.html">← LIST</a>
  <header class="pview__head"><h1>${esc(p.name)}</h1>${p.desc?`<p>${esc(p.desc)}</p>`:''}</header>
  <section class="pview__shot">${shot('main','메인 화면 (1920×1080)')}</section>
  <section class="pview__meta">
    <div class="card"><h2>카테고리</h2>
      <p class="row">${chips([p.cat==='a'?'앱개발':'퍼블리싱',p.type].concat(role?[role]:[]))}</p>
      <p class="row">${chips(stackOf(p))}</p></div>
    <div class="card"><h2>바로가기 링크</h2>${ok?`<a class="pview__go" href="${esc(p.link)}" target="_blank" rel="noopener">사이트 바로가기 🔗</a>`:'<p class="pview__empty">등록된 링크가 없습니다.</p>'}</div>
  </section>
  <section class="card pview__system"><h2>디자인 시스템</h2><div class="pview__system-grid">
    <div><h3>Font</h3>${(p.fonts||[]).length?`<ul>${p.fonts.map(f=>`<li style="font-family:'${esc(f)}',sans-serif"><b>Aa 가나다</b> ${esc(f)}</li>`).join('')}</ul>`:'<p class="pview__empty">준비 중 (data/projects.json → fonts)</p>'}</div>
    <div><h3>Color</h3>${(p.colors||[]).length?`<ul class="pview__colors">${p.colors.map(c=>`<li><i style="background:${esc(c)}"></i>${esc(c)}</li>`).join('')}</ul>`:'<p class="pview__empty">준비 중 (data/projects.json → colors)</p>'}</div>
  </div></section>
  <section class="pview__block"><h2>메인 디자인 전체</h2><div class="pview__full">${shot('full','메인 디자인 전체')}</div></section>
  <section class="pview__block"><h2>서브 디자인</h2><div class="pview__subs"><div>${shot('sub1','서브 디자인 1')}</div><div>${shot('sub2','서브 디자인 2')}</div></div></section>`;
  view.querySelectorAll('[data-shot]').forEach(el=>{
    const k=el.dataset.shot,o=p.images&&p.images[k];
    (o?tryImg(root+o):findImg(`assets/projects/${p.id}/${k}`)).then(s=>{if(s)el.innerHTML=`<img src="${s}" alt="${esc(p.name+' '+el.dataset.label)}" loading="lazy">`;});
  });
}
})();
