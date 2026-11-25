let enterFlag=false,asgSpec='',asgLevel=1,asgCat='g',asgSel=new Set(),pubTab='matrix',pubLevel=1,pubScope='ok';
const ICONS={dashboard:'◈',setup:'⚙',assign:'⇄',tracking:'◔',review:'✓',published:'▦',users:'☺',rooms:'▣',logs:'≡',tasks:'✎'};
const _render=render;
render=function(){_render();
$$('#nav button').forEach(b=>{let k=(b.getAttribute('onclick')||'').match(/go\('(\w+)'\)/);let t=b.textContent;b.innerHTML=`<span class="ic">${ICONS[k&&k[1]]||'•'}\uFE0E</span><span>${t}</span>`});
let av=document.getElementById('av');if(av&&me)av.textContent=(me.name||'؟').trim().charAt(0);
let c=$('#content');c.classList.remove('leaving','entering');
if(enterFlag){enterFlag=false;[...c.children].forEach((el,i)=>el.style.setProperty('--i',i));c.classList.add('entering');countUp(c);window.scrollTo({top:0})}
};
function countUp(root){root.querySelectorAll('[data-count]').forEach(el=>{let n=+el.dataset.count,t0=performance.now();let f=t=>{let p=Math.min(1,(t-t0)/800);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)})}
go=function(p){if(p===page&&!taskKey){return}let c=$('#content');c.classList.add('leaving');setTimeout(()=>{page=p;taskKey=null;enterFlag=true;render()},170)};
const _login=login;login=function(){enterFlag=true;_login()};
const SICON=['◧','☺','⇄','➤','✓','○'];let _si=0;
stat=function(t,n){let i=_si++%6;return `<div class="stat"><div class="si">${SICON[i]}</div><span>${t}</span><strong data-count="${n}">${n}</strong></div>`};
const _dash=dashboard;
dashboard=function(){_si=0;let e=active(),tk=e?Object.values(e.tasks):[],all=programs().length,ok=tk.filter(t=>['معتمد','منشور'].includes(t.status)).length,asg=e?Object.keys(e.assign).length:0,p=all?Math.round(ok/all*100):0;
let hero=`<div class="hero"><i class="orb o1"></i><i class="orb o3"></i><div><small>${e?esc(e.year)+' • '+esc(e.semester):'لا يوجد إصدار نشط'}</small><h2>أهلاً ${esc(me.name)} • ${e?esc(e.name):'ابدأ بإنشاء إصدار امتحانات'}</h2><p>${e?`${asg} من ${all} برنامجاً مسنداً لمختصين، و${ok} جدول معتمد.`:'أنشئ إصداراً ثم وزّع المسؤوليات على المختصين.'}</p></div><div class="ringwrap"><div class="ring" style="--p:${p}"><b>${p}%</b></div><small>الجداول المعتمدة</small></div></div>`;
return hero+_dash()};
function asgCatList(){return asgCat==='s'?SP:(asgLevel===1?G1:P2)}
function asgKeys(){return asgCatList().map(n=>asgLevel+'|'+n)}
function aPick(id){asgSpec=asgSpec===id?'':id;asgSel=new Set();render()}
function aLevel(l){asgLevel=l;asgSel=new Set();render()}
function aCat(c){asgCat=c;asgSel=new Set();render()}
function aTog(k){asgSel.has(k)?asgSel.delete(k):asgSel.add(k);render()}
function aAll(){let ks=asgKeys();asgSel=asgSel.size===ks.length?new Set():new Set(ks);render()}
function aPlan(e){let rows=[...asgSel].map(k=>{let o=e.assign[k],t=e.tasks[k];let [l,...n]=k.split('|');return{k,l:+l,n:n.join('|'),o,kind:!o?'new':o===asgSpec?'same':'over',st:t&&t.courses&&t.courses.length?t.status:''}});return rows}
function aReview(unassign){let e=active(),rows=aPlan(e);if(!asgSpec&&!unassign)return;
let who=userName(asgSpec);
if(unassign){rows=rows.filter(r=>r.o);if(!rows.length)return toast('لا توجد إسنادات في المحدد',true);
modal('تأكيد إلغاء الإسناد',`<div class="notice warning">سيتم إلغاء إسناد ${rows.length} برنامج. لن تُحذف الجداول المُدخلة.</div>`+rows.map(r=>`<div class="ovrow"><span>${esc(r.n)} (المستوى ${LV[r.l-1]})</span><i class="no">${esc(userName(r.o))} ← بدون</i></div>`).join(''),`<button class="danger" onclick="aApply(true)">تأكيد الإلغاء</button>`);return}
let ov=rows.filter(r=>r.kind==='over'),nw=rows.filter(r=>r.kind==='new'),sm=rows.filter(r=>r.kind==='same');
if(!ov.length&&!nw.length)return toast('كل البرامج المحددة مسندة لهذا المختص بالفعل');
modal('تأكيد الإسناد',`<p>المختص: <b>${esc(who)}</b> • المستوى ${LV[asgLevel-1]} • ${asgCat==='s'?'برامج خاصة':'برامج عامة'}</p>`+
(nw.length?`<div class="ovgroup">إسناد جديد (${nw.length})</div>`+nw.map(r=>`<div class="ovrow"><span>${esc(r.n)}</span><i>← ${esc(who)}</i></div>`).join(''):'')+
(ov.length?`<div class="notice warning" style="margin-top:12px"><b>سيتم استبدال ${ov.length} إسناد موجود:</b></div>`+ov.map(r=>`<div class="ovrow"><span>${esc(r.n)}${r.st?` <span class="badge amber">يوجد جدول: ${esc(r.st)}</span>`:''}</span><i class="no">${esc(userName(r.o))} ← ${esc(who)}</i></div>`).join('')+`<small class="muted">الجداول المُدخلة سابقاً تبقى كما هي وتنتقل مسؤوليتها للمختص الجديد.</small>`:'')+
(sm.length?`<div class="ovgroup">بدون تغيير (${sm.length})</div>`:''),`<button onclick="aApply(false)">${ov.length?'أفهم، استبدل وأسند':'تأكيد الإسناد'}</button>`)}
function aApply(un){let e=active(),n=0;closeModal();let rows=aPlan(e);rows.forEach(r=>{if(un){if(e.assign[r.k]){delete e.assign[r.k];n++}}else if(e.assign[r.k]!==asgSpec){e.assign[r.k]=asgSpec;n++}});save();log(un?'إلغاء إسناد '+n+' برنامج':'إسناد '+n+' برنامج إلى '+userName(asgSpec));asgSel=new Set();render();toast(un?`تم إلغاء ${n} إسناد`:`تم إسناد ${n} برنامج`)}
assign=function(){let e=active();if(!e)return head('توزيع المسؤوليات','أنشئ إصدارًا أولًا.')+`<section class="panel empty">لا يوجد إصدار نشط.</section>`;
let specs=db.users.filter(u=>u.role==='specialist'&&u.active);
if(asgSpec&&!specs.find(u=>u.id===asgSpec))asgSpec='';
let cnt=id=>Object.values(e.assign).filter(x=>x===id).length,ks=asgKeys(),allOn=ks.length&&asgSel.size===ks.length;
let s1=`<section class="panel stepcard"><span class="num">1</span><h3>اختر المختص</h3><div class="sub">الشخص المسؤول عن مجموعة البرامج</div>${specs.length?`<div class="people">${specs.map(u=>`<button class="person ${asgSpec===u.id?'on':''}" onclick="aPick('${u.id}')"><span class="pav">${esc(u.name.trim().charAt(0))}</span><span><b>${esc(u.name)}</b><small>${cnt(u.id)} برنامج مسند</small></span></button>`).join('')}</div>`:'<div class="notice warning">أنشئ حسابات مختصين أولًا من إدارة المستخدمين.</div>'}</section>`;
let off=asgSpec?'':'style="opacity:.45;pointer-events:none"';
let s2=`<section class="panel stepcard" ${off}><span class="num">2</span><h3>اختر مستوى واحدًا</h3><div class="sub">الإسناد يتم لمستوى واحد في كل مرة</div><div class="seg">${LV.map((n,i)=>`<button class="${asgLevel===i+1?'on':''}" onclick="aLevel(${i+1})">المستوى ${n}</button>`).join('')}</div></section>`;
let s3=`<section class="panel stepcard" ${off}><span class="num">3</span><h3>نوع البرامج</h3><div class="sub">${asgLevel===1?'في المستوى الأول: الشعب العامة (يتفرع منها المستوى الثاني فما فوق)':'برامج عامة (تتفرع من الشعب) أو برامج خاصة مستقلة'}</div><div class="seg"><button class="${asgCat==='g'?'on':''}" onclick="aCat('g')">${asgLevel===1?'الشعب العامة':'برامج عامة'} (${(asgLevel===1?G1:P2).length})</button><button class="${asgCat==='s'?'on':''}" onclick="aCat('s')">برامج خاصة (${SP.length})</button></div></section>`;
let s4=`<section class="panel stepcard" ${off}><span class="num">4</span><h3>اختر البرامج</h3><div class="sub">حدد الكل أو اختر برامج بعينها</div><div class="proglist"><div class="progrow ${allOn?'on':''}" onclick="aAll()"><span class="box">✓</span><span class="nm">تحديد كل برامج هذه الفئة</span><span class="owner">${ks.length} برنامج</span></div>${ks.map(k=>{let o=e.assign[k],n=k.split('|').slice(1).join('|');return `<div class="progrow ${asgSel.has(k)?'on':''}" onclick="aTog('${esc(k).replace(/'/g,"\\'")}')"><span class="box">✓</span><span class="nm">${esc(n)}</span><span class="owner">${o?(o===asgSpec?'<span class="badge green">لهذا المختص</span>':'<span class="badge amber">مسند: '+esc(userName(o))+'</span>'):'<span class="badge">غير مسند</span>'}</span></div>`}).join('')}</div></section>`;
let bar=`<div class="bar"><div>${asgSpec?`<b>${asgSel.size}</b> برنامج محدد للمختص <b>${esc(userName(asgSpec))}</b>`:'اختر مختصًا للبدء'}</div><div class="actions"><button class="ghost" ${asgSel.size?'':'disabled'} onclick="aReview(true)">إلغاء إسناد المحدد</button><button ${asgSpec&&asgSel.size?'':'disabled'} onclick="aReview(false)">مراجعة وتأكيد الإسناد</button></div></div>`;
let ov=[1,2,3,4].map(l=>{let g=(l===1?G1:P2).map(n=>l+'|'+n),s=SP.map(n=>l+'|'+n),row=k=>`<div class="ovrow"><span>${esc(k.split('|').slice(1).join('|'))}</span>${e.assign[k]?`<i>${esc(userName(e.assign[k]))}</i>`:'<i class="no">غير مسند</i>'}</div>`;let done=g.concat(s).filter(k=>e.assign[k]).length;return `<div class="ovlevel"><h4>المستوى ${LV[l-1]} <span class="badge ${done===g.length+s.length?'green':'amber'}">${done}/${g.length+s.length}</span></h4><div class="ovgroup">${l===1?'الشعب العامة':'برامج عامة'}</div>${g.map(row).join('')}<div class="ovgroup">برامج خاصة</div>${s.map(row).join('')}</div>`}).join('');
return head('توزيع المسؤوليات','اختر المختص ثم المستوى ثم نوع البرامج، وحدد البرامج التي يتولاها.')+`<div class="notice">البرامج والمقررات من الخطط الدراسية المعتمدة المرفوعة، ولا يتم تغيير أي إسناد قبل مراجعته وتأكيده.</div><div class="asg"><div>${s1}${s2}${s3}${s4}${bar}</div><aside class="panel"><h2>نظرة عامة على الإسنادات</h2>${ov}</aside></div>`};
const _pub=published;
pubSet=function(k,v){if(k==='t')pubTab=v;if(k==='l')pubLevel=v;if(k==='s')pubScope=v;render()};
published=function(){let e=active();if(!e)return _pub();
let okSt=['معتمد','منشور'],progs=programs();
let cells={},dates=new Set(),cols=progs.filter(p=>p.level===pubLevel),has=new Set();
Object.entries(e.tasks).forEach(([k,t])=>{let p=progs.find(x=>x.key===k);if(!p||p.level!==pubLevel)return;if(pubScope==='ok'&&!okSt.includes(t.status))return;(t.courses||[]).filter(c=>c.slot).forEach(c=>{let [d,pid]=c.slot.split('|');dates.add(d);has.add(k);(cells[d+'|'+pid+'|'+k]=cells[d+'|'+pid+'|'+k]||[]).push({...c,st:t.status})})});
let ds=[...dates].sort(),cs=cols.filter(p=>has.has(p.key));
let dn=d=>{try{return DAYS[new Date(d+'T12:00:00').getDay()]}catch(x){return''}};
let mx=cs.length?`<div class="mxwrap"><table class="matrix"><tr><th class="d">اليوم / الفترة</th>${cs.map(p=>`<th>${esc(p.name)}</th>`).join('')}</tr>${ds.map(d=>e.periods.map((p,pi)=>`<tr><td class="d">${pi===0?`${dn(d)}<small>${d}</small>`:''}<small>${esc(p.name)} ${p.from}–${p.to}</small></td>${cs.map(c=>{let a=cells[d+'|'+p.id+'|'+c.key]||[];return `<td>${a.map(x=>`<div class="mx ${okSt.includes(x.st)?'':'pre'}"><b>${esc(x.name)}</b><small>${esc(x.code)}${x.students?' • '+x.students+' طالب':''}</small>${x.pair?'<small>⚑ استثناء: طلاب مختلفون</small>':''}</div>`).join('')}</td>`}).join('')}</tr>`).join('')).join('')}</table></div><div class="legend"><span><i style="background:#d5efec"></i>معتمد</span>${pubScope==='all'?'<span><i style="background:#f6e9c6"></i>غير معتمد بعد (مبدئي)</span>':''}</div>`:`<div class="empty"><b>لا توجد جداول ${pubScope==='ok'?'معتمدة ':''}للمستوى ${LV[pubLevel-1]}</b>${pubScope==='ok'?'<br>يمكنك عرض كل الجداول المُدخلة بتغيير النطاق.':''}</div>`;
let base=_pub();let seg=(items,cur,fn)=>`<div class="seg">${items.map(([v,t])=>`<button class="${cur===v?'on':''}" onclick="pubSet('${fn}',${typeof v==='number'?v:`'${v}'`})">${t}</button>`).join('')}</div>`;
let ctl=`<div class="panel" style="margin-bottom:16px;display:flex;gap:14px;flex-wrap:wrap;align-items:center;justify-content:space-between">${seg([['matrix','جدول مصفوفة'],['list','قائمة']],pubTab,'t')}${pubTab==='matrix'?seg(LV.map((n,i)=>[i+1,'المستوى '+n]),pubLevel,'l'):''}${seg([['ok','المعتمد فقط'],['all','كل المُدخل']],pubScope,'s')}</div>`;
if(pubTab==='list')return base.replace(/<div style="text-align:center"><h2>[\s\S]*?<\/div><\/div>/,offHead('جميع المستويات')).replace('<section class="panel">',ctl+'<section class="panel">');
let hidden=base.replace('<section class="panel">','<section class="panel" style="display:none">');
let headBlock=base.match(/^<div class="head">[\s\S]*?<\/div><\/div>/)[0];
let title=offHead('المستوى '+LV[pubLevel-1]);let sigs='<div class="sigs">'+offSigs(active()).map(s=>'<div>'+esc(s[0])+(s[1]?'<br><small style="font-weight:400">'+esc(s[1])+'</small>':'')+'</div>').join('')+'</div>';
return headBlock+ctl+title+mx+sigs+hidden.replace(headBlock,'')};
const tdy=()=>{let d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const nowS=()=>new Date().toLocaleString('ar-EG');
const OPEN_ST=['مسودة','قيد الإعداد','يحتاج تعديل'];
const PAGE_ADD=[['observers','الملاحظون والمراقبون'],['roadmap','خارطة التطوير']];
(()=>{let i=PAGES.findIndex(x=>x[0]==='rooms')+1;PAGES.splice(i,0,...PAGE_ADD);ROLE_PERMS.admin=PAGES.map(x=>x[0]).filter(k=>k!=='tasks').concat('approve')})();
Object.assign(ICONS,{observers:'☷',roadmap:'⌖'});
let _force=false,_pairPending=false;
const _clash=slotClash;slotClash=function(t,c,g,s){return _force?undefined:_clash(t,c,g,s)};
const _scs=setCourseSlot;
function progName(k){return k.split('|').slice(1).join('|')}
setCourseSlot=function(k,code,slot){let e=active();
if(e&&slot){let t=e.tasks[k];if(t&&!isLocked(t)){let it=planItems(e,k).find(i=>i.courses.some(c=>c.code===code));if(it){let cl=_clash(t,code,it.gid,slot);if(cl){_pairPending=true;let c=it.courses.find(c=>c.code===code);
modal('مقرران في نفس اليوم',`<div class="notice warning">هذا المستوى لديه بالفعل مقرر <b>${esc(cl.name)}</b> (${esc(cl.code)}) في نفس اليوم.</div><p>القاعدة الأصلية: مقرر واحد لكل مستوى في اليوم. يمكن وضع مقررين في اليوم نفسه كاستثناء <b>فقط إذا كان الطلاب المسجلون في المقررين مختلفين</b>. اختلاف كود المقرر أو البرنامج وحده لا يثبت ذلك.</p><p>المقرر: <b>${esc(c.name)}</b> (${esc(code)})</p><label class="check"><input type="checkbox" id="pairok"> أؤكد أن طلاب المقررين مختلفون وأن هذا استثناء مقصود</label>`,
`<button onclick="pairGo('${esc(k).replace(/'/g,"\\'")}','${esc(code)}','${esc(slot)}','${esc(cl.code)}')">تأكيد الاستثناء</button>`);return}}}}
_scs(k,code,slot);
if(e&&slot){let t=e.tasks[k],en=t&&planEntry(t,code);if(en&&en.slot===slot)log(`تحديد موعد ${code} في ${progName(k)}: ${en.label}`)}};
function pairGo(k,code,slot,other){if(!$('#pairok').checked)return toast('أكّد أولاً أن طلاب المقررين مختلفون',true);_pairPending=false;closeModal();_force=true;try{_scs(k,code,slot)}finally{_force=false}
let t=active().tasks[k],a=planEntry(t,code),b=planEntry(t,other);if(a&&a.slot===slot){a.pair=true;if(b)b.pair=true;log(`استثناء مقررين في اليوم نفسه (طلاب مختلفون): ${code} و ${other} في ${progName(k)}`);save();render();toast('تم تسجيل الاستثناء')}}
const _cm=closeModal;closeModal=function(){_cm();if(_pairPending){_pairPending=false;render()}};
const _ac=addCourse;addCourse=function(k){let e=active(),t=e&&e.tasks[k],code=($('#ccode')||{}).value,slot=($('#cslot')||{}).value;
if(t&&code&&slot){let cl=_clash(t,code.trim(),'m:'+code.trim(),slot);if(cl){if(!confirm(`يوجد مقرر (${cl.name}) في نفس اليوم لهذا المستوى.\nيُسمح بمقررين في اليوم فقط إذا كان طلاب المقررين مختلفين. هل تؤكد الاستثناء؟`))return;_force=true;try{_ac(k)}finally{_force=false}let en=planEntry(t,code.trim());if(en&&en.slot===slot){en.pair=true;cl.pair=true;log(`استثناء مقررين في اليوم نفسه: ${code} و ${cl.code} في ${progName(k)}`);save();render()}return}}
_ac(k)};
const _rc=removeCourse;removeCourse=function(k,i){let c=active().tasks[k]?.courses[i];_rc(k,i);if(c)log(`حذف مقرر ${c.code} ${c.name} من ${progName(k)}`)};
const _ce=createEdition;createEdition=function(){let e=active()||draftEdition;
if(e&&db.editions.some(x=>!x.archived&&x.id!==e.id&&x.year===e.year&&x.semester===e.semester))return toast(`يوجد إصدار مفتوح لنفس الفصل (${e.semester} ${e.year}). أغلق إصدار الموسم أولاً (أرشفة) قبل إنشاء آخر.`,true);_ce()};
const _ar=archive;archive=function(){let e=active();if(!e)return;if(me.role!=='admin')return toast('إغلاق الإصدار من صلاحية مدير النظام فقط',true);
let open=Object.values(e.tasks).filter(t=>!['معتمد','منشور'].includes(t.status)).length;
if(open&&!confirm(`يوجد ${open} جدول غير معتمد. إغلاق الإصدار يجب أن يكون بعد اعتماد النتائج. هل تريد الإغلاق والأرشفة رغم ذلك؟`))return;_ar()};
function isLate(t){return !!(t&&t.due&&t.due<tdy()&&OPEN_ST.includes(t.status))}
function stageOf(t){return({'مسودة':'1) بداية الإعداد','قيد الإعداد':'2) إعداد وتوزيع المقررات','مرسل للمراجعة':'3) عند المراجع','يحتاج تعديل':'3) أُعيد للمختص','معتمد':'4) معتمد','منشور':'5) منشور'})[t.status]||t.status}
function setDue(k,v){let e=active(),t=e.tasks[k]||(e.tasks[k]={courses:[],status:'مسودة',note:''});t.due=v;save();log(`تحديد موعد تسليم ${progName(k)}: ${v||'بدون'}`);render()}
function setDueAll(){let v=$('#dueall').value;if(!v)return toast('اختر تاريخاً',true);let e=active(),n=0;Object.keys(e.assign).forEach(k=>{let t=e.tasks[k]||(e.tasks[k]={courses:[],status:'مسودة',note:''});if(OPEN_ST.includes(t.status)){t.due=v;n++}});save();log(`تحديد موعد تسليم ${v} لـ ${n} جدول`);render();toast(`تم تحديد الموعد لـ ${n} جدول`)}
let trackF='all';
tracking=function(){let e=active();if(!e)return head('متابعة الجداول','لا يوجد إصدار نشط.');
let ps=programs().filter(p=>e.assign[p.key]||e.tasks[p.key]);
let rows=ps.map(p=>({p,t:e.tasks[p.key]||{courses:[],status:'مسودة'}}));
let sent=rows.filter(r=>['مرسل للمراجعة','معتمد','منشور'].includes(r.t.status)),late=rows.filter(r=>isLate(r.t)),notSent=rows.filter(r=>!['مرسل للمراجعة','معتمد','منشور'].includes(r.t.status));
let show=trackF==='late'?late:trackF==='notsent'?notSent:trackF==='sent'?sent:rows;
let seg=[['all','الكل'],['notsent','لم تُرسل'],['sent','أُرسلت'],['late','متأخرة']].map(([v,t])=>`<button class="${trackF===v?'on':''}" onclick="trackF='${v}';render()">${t}</button>`).join('');
let admin=me.role==='admin'||can('setup');
return head('متابعة الجداول','حالة كل جدول ومرحلته وموعد تسليمه والمتأخرين.')+
`<div class="stats">${stat('مكلّفة',rows.length)}${stat('أُرسلت',sent.length)}${stat('لم تُرسل',notSent.length)}${stat('متأخرة',late.length)}</div>
<div class="panel" style="margin-bottom:14px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between"><div class="seg">${seg}</div>${admin?`<div style="display:flex;gap:8px;align-items:center"><input type="date" id="dueall" style="width:auto"><button class="sm" onclick="setDueAll()">تحديد موعد تسليم لكل الجداول غير المرسلة</button></div>`:''}</div>
<section class="panel"><div class="tablewrap"><table><tr><th>المستوى</th><th>البرنامج</th><th>المختص</th><th>المرحلة</th><th>الحالة</th><th>أُرسل في</th><th>موعد التسليم</th><th>آخر تحديث</th><th>النسخ</th></tr>${show.map(({p,t})=>`<tr><td>${LV[p.level-1]}</td><td>${esc(p.name)}</td><td>${esc(userName(e.assign[p.key]))}</td><td>${stageOf(t)}${planTotalText(e,p.key,t)}</td><td>${badge(t.status)}${isLate(t)?' <span class="badge redtag">متأخر</span>':''}</td><td>${t.sent||'—'}</td><td>${admin?`<input type="date" value="${t.due||''}" style="width:auto;padding:5px" onchange="setDue('${esc(p.key).replace(/'/g,"\\'")}',this.value)">`:(t.due||'—')}</td><td>${t.updated||'—'}</td><td>${(t.versions||[]).length?`<button class="sm light" onclick="versModal('${esc(p.key).replace(/'/g,"\\'")}')">${t.versions.length} نسخة</button>`:'—'}</td></tr>`).join('')||'<tr><td colspan="9" class="empty">لا توجد جداول في هذا التصنيف.</td></tr>'}</table></div></section>`};
function snap(k,why){let t=active().tasks[k];if(!t)return;t.versions=t.versions||[];t.versions.push({n:t.versions.length+1,at:nowS(),by:me.name,why,status:t.status,courses:(t.courses||[]).map(c=>({code:c.code,name:c.name,students:c.students,slot:c.slot,label:c.label,pair:!!c.pair}))});if(t.versions.length>40)t.versions.shift();save()}
const _sub=submitTask;submitTask=function(k){let t0=active().tasks[k],s0=t0&&t0.status;_sub(k);let t=active().tasks[k];if(t&&t.status==='مرسل للمراجعة'&&s0!=='مرسل للمراجعة')snap(k,'إرسال للمراجعة')};
const _ra=reviewAction;reviewAction=function(k,s){let t=active().tasks[k],s0=t&&t.status;_ra(k,s);let t2=active().tasks[k];if(t2&&t2.status!==s0)snap(k,s==='يحتاج تعديل'?'إعادة للمختص: '+(t2.note||''):s)};
function verDiff(a,b){let A=Object.fromEntries(a.map(c=>[c.code,c])),B=Object.fromEntries(b.map(c=>[c.code,c])),out=[];
Object.keys(B).forEach(k=>{if(!A[k])out.push(['+',`أُضيف: ${B[k].code} ${B[k].name} (${B[k].label||'بدون موعد'})`]);else{if(A[k].slot!==B[k].slot)out.push(['~',`تغيّر موعد ${k}: ${A[k].label||'—'} ← ${B[k].label||'—'}`]);if((A[k].students||0)!==(B[k].students||0))out.push(['~',`تغيّر عدد طلاب ${k}: ${A[k].students||0} ← ${B[k].students||0}`])}});
Object.keys(A).forEach(k=>{if(!B[k])out.push(['-',`حُذف: ${A[k].code} ${A[k].name}`])});return out}
let verSel={a:0,b:-1};
function versModal(k){let t=active().tasks[k],v=t.versions||[];verSel={a:Math.max(0,v.length-2),b:-1};window._vk=k;versRender()}
function versRender(){let k=window._vk,t=active().tasks[k],v=t.versions||[];let get=i=>i<0?{n:'الحالي',courses:t.courses||[]}:v[i];let opt=(sel)=>v.map((x,i)=>`<option value="${i}" ${sel===i?'selected':''}>نسخة ${x.n} • ${esc(x.at)} • ${esc(x.why)}</option>`).join('')+`<option value="-1" ${sel===-1?'selected':''}>الحالي</option>`;
let d=verDiff(get(verSel.a).courses,get(verSel.b).courses);
modal('نسخ جدول '+progName(k),`<div class="formgrid"><div class="field"><label>من</label><select onchange="verSel.a=+this.value;versRender()">${opt(verSel.a)}</select></div><div class="field"><label>إلى</label><select onchange="verSel.b=+this.value;versRender()">${opt(verSel.b)}</select></div></div>${d.length?d.map(([s,x])=>`<div class="ovrow"><span>${esc(x)}</span><i class="${s==='-'?'no':''}">${s==='+'?'جديد':s==='-'?'محذوف':'معدّل'}</i></div>`).join(''):'<div class="notice">لا توجد فروق بين النسختين.</div>'}`,'')}
function notices(){let e=active(),out=[];if(!e||!me)return out;let soon=new Date(Date.now()+3*864e5).toISOString().slice(0,10);
Object.keys(e.assign).forEach(k=>{let t=e.tasks[k]||{status:'مسودة',courses:[]};
if(e.assign[k]===me.id){if(t.status==='مسودة')out.push(['كُلّفت بجدول',`${progName(k)} • المستوى ${LV[+k[0]-1]}`]);if(t.status==='يحتاج تعديل')out.push(['أُعيد إليك بملاحظات',`${progName(k)}: ${t.note||''}`]);if(t.due&&OPEN_ST.includes(t.status)&&t.due<=soon)out.push([t.due<tdy()?'تجاوز موعد التسليم':'اقترب موعد التسليم',`${progName(k)} • ${t.due}`])}
if(t.status==='مرسل للمراجعة'&&can('approve'))out.push(['جدول ينتظر المراجعة',`${progName(k)} • ${userName(e.assign[k])}`]);
if(me.role==='admin'&&isLate(t))out.push(['مستخدم متأخر',`${userName(e.assign[k])} • ${progName(k)} • الموعد ${t.due}`])});
return out}
function bellModal(){let n=notices();modal('التنبيهات',(n.length?n.map(([a,b])=>`<div class="ovrow"><span><b>${esc(a)}</b><br><small class="muted">${esc(b)}</small></span></div>`).join(''):'<div class="notice">لا توجد تنبيهات حالياً.</div>')+'<small class="muted">التنبيهات تظهر داخل المنصة فقط ولا تُرسل بريداً أو رسائل.</small>','')}
const OB_ROLES=['ملاحظ','مراقب','رئيس لجنة'],OB_COLS=['الاسم','الدور الوظيفي','القسم / الجهة','الهاتف'];
let obF={q:'',r:''};
const esc2=s=>esc(String(s==null?'':s));
function observersPage(){db.observers=db.observers||[];let L=db.observers.filter(o=>(!obF.r||o.role===obF.r)&&(!obF.q||(o.name+o.dept+o.phone).includes(obF.q)));
let cnt=r=>db.observers.filter(o=>o.role===r).length;
return head('الملاحظون والمراقبون','رفع بيانات الملاحظين والمراقبين ورؤساء اللجان من ملف Excel بنموذج موحّد، وتبقى محفوظة للإصدارات التالية.',`<button onclick="obTemplate()">تنزيل نموذج Excel</button><label class="check light" style="cursor:pointer;margin:0">رفع ملف Excel / CSV<input type="file" accept=".xlsx,.csv" style="display:none" onchange="obImport(this)"></label><button class="light" onclick="obExport()">تصدير CSV</button>`)+
`<div class="stats">${stat('الإجمالي',db.observers.length)}${OB_ROLES.map(r=>stat(r,cnt(r))).join('')}</div>
<div class="notice">البيانات محفوظة في قاعدة بيانات هذا المتصفح وتدخل في النسخ الاحتياطي، ولا تُحذف عند إنشاء إصدار جديد. توزيعهم على اللجان يدوياً من صفحة «توزيع اللجان».</div>
<div class="panel" style="margin-bottom:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center"><input placeholder="بحث بالاسم أو الجهة أو الهاتف" value="${esc(obF.q)}" style="max-width:300px" onchange="obF.q=this.value;render()"><div class="seg"><button class="${obF.r?'':'on'}" onclick="obF.r='';render()">الكل</button>${OB_ROLES.map(r=>`<button class="${obF.r===r?'on':''}" onclick="obF.r='${r}';render()">${r}</button>`).join('')}</div></div>
<section class="panel"><h2>إضافة يدوية</h2><div class="formgrid"><div class="field"><label>الاسم</label><input id="obn"></div><div class="field"><label>الدور</label><select id="obr">${OB_ROLES.map(r=>`<option>${r}</option>`).join('')}</select></div><div class="field"><label>القسم / الجهة</label><input id="obd"></div><div class="field"><label>الهاتف</label><input id="obp"></div></div><div class="actions"><button onclick="obAdd()">＋ إضافة</button></div></section>
<section class="panel"><div class="tablewrap"><table><tr><th>الاسم</th><th>الدور</th><th>القسم / الجهة</th><th>الهاتف</th><th></th></tr>${L.map(o=>`<tr><td>${esc2(o.name)}</td><td><span class="badge ${o.role==='رئيس لجنة'?'amber':o.role==='مراقب'?'blue':'green'}">${esc2(o.role)}</span></td><td>${esc2(o.dept)||'—'}</td><td>${esc2(o.phone)||'—'}</td><td><button class="sm light" onclick="obDel('${o.id}')">حذف</button></td></tr>`).join('')||'<tr><td colspan="5" class="empty">لا توجد بيانات. نزّل النموذج وارفعه بعد تعبئته.</td></tr>'}</table></div></section>`}
function obAdd(){let n=$('#obn').value.trim(),r=$('#obr').value,d=$('#obd').value.trim(),p=$('#obp').value.trim();if(!n)return toast('اكتب الاسم',true);if(db.observers.some(o=>o.name===n&&o.role===r))return toast('الاسم مكرر بنفس الدور',true);db.observers.push({id:id(),name:n,role:r,dept:d,phone:p});save();log(`إضافة ${r}: ${n}`);render()}
function obDel(i){if(!confirm('حذف هذا السجل؟'))return;let o=db.observers.find(x=>x.id===i);db.observers=db.observers.filter(x=>x.id!==i);save();log('حذف '+(o?o.role+': '+o.name:'سجل'));render()}
function dl(name,blob){let a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function obExport(){let q=v=>'"'+String(v||'').replace(/"/g,'""')+'"';dl('observers.csv',new Blob(['\ufeff'+[OB_COLS.join(',')].concat(db.observers.map(o=>[o.name,o.role,o.dept,o.phone].map(q).join(','))).join('\n')],{type:'text/csv;charset=utf-8'}))}
const CRC=(()=>{let t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=t[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}})();
function zipStore(files){let enc=new TextEncoder(),parts=[],cen=[],off=0;const u32=n=>[n&255,n>>>8&255,n>>>16&255,n>>>24&255],u16=n=>[n&255,n>>>8&255];
files.forEach(([name,txt])=>{let nb=enc.encode(name),d=enc.encode(txt),c=CRC(d);let lh=new Uint8Array([0x50,0x4b,3,4,20,0,0,8,0,0,0,0,0,0,...u32(c),...u32(d.length),...u32(d.length),...u16(nb.length),0,0]);parts.push(lh,nb,d);
cen.push(new Uint8Array([0x50,0x4b,1,2,20,0,20,0,0,8,0,0,0,0,0,0,...u32(c),...u32(d.length),...u32(d.length),...u16(nb.length),0,0,0,0,0,0,0,0,0,0,0,0,...u32(off)]),nb);off+=lh.length+nb.length+d.length});
let cl=cen.reduce((n,x)=>n+x.length,0);let end=new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(cl),...u32(off),0,0]);return new Blob([...parts,...cen,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
function obTemplate(){let rows=[OB_COLS,['مثال: اسم الملاحظ','ملاحظ','قسم الكيمياء','01000000000'],['مثال: اسم المراقب','مراقب','قسم الفيزياء',''],['مثال: اسم رئيس اللجنة','رئيس لجنة','قسم الرياضيات','']];
let col=i=>String.fromCharCode(65+i),x=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
let sheet='<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetViews><sheetView rightToLeft="1" workbookViewId="0"/></sheetViews><cols><col min="1" max="4" width="28" customWidth="1"/></cols><sheetData>'+rows.map((r,i)=>`<row r="${i+1}">`+r.map((v,j)=>`<c r="${col(j)}${i+1}" t="inlineStr"><is><t>${x(v)}</t></is></c>`).join('')+'</row>').join('')+'</sheetData></worksheet>';
dl('نموذج-الملاحظين-والمراقبين.xlsx',zipStore([['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'],['_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],['xl/workbook.xml','<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="البيانات" sheetId="1" r:id="rId1"/></sheets></workbook>'],['xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'],['xl/worksheets/sheet1.xml',sheet]]));log('تنزيل نموذج الملاحظين والمراقبين')}
async function readXlsx(buf){let dv=new DataView(buf),u8=new Uint8Array(buf),eo=-1;for(let i=u8.length-22;i>=0;i--)if(dv.getUint32(i,true)===0x06054b50){eo=i;break}if(eo<0)throw 0;
let n=dv.getUint16(eo+10,true),off=dv.getUint32(eo+16,true),F={},td=new TextDecoder();
for(let k=0;k<n;k++){let m=dv.getUint16(off+10,true),cs=dv.getUint32(off+20,true),nl=dv.getUint16(off+28,true),el=dv.getUint16(off+30,true),cl=dv.getUint16(off+32,true),lo=dv.getUint32(off+42,true),nm=td.decode(u8.slice(off+46,off+46+nl)),ds=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true);F[nm]={m,d:u8.slice(ds,ds+cs)};off+=46+nl+el+cl}
let get=async nm=>{let f=F[nm];if(!f)return null;let b=f.d;if(f.m===8)b=new Uint8Array(await new Response(new Blob([b]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());return td.decode(b)};
let P=s=>new DOMParser().parseFromString(s,'application/xml'),ss=[],sx=await get('xl/sharedStrings.xml');if(sx)P(sx).querySelectorAll('si').forEach(si=>ss.push([...si.querySelectorAll('t')].map(t=>t.textContent).join('')));
let sheetName=Object.keys(F).filter(x=>/^xl\/worksheets\/sheet\d+\.xml$/.test(x)).sort()[0];let doc=P(await get(sheetName)),rows=[];
doc.querySelectorAll('row').forEach(r=>{let row=[];r.querySelectorAll('c').forEach(c=>{let ref=c.getAttribute('r')||'',L=ref.replace(/\d+/,''),ci=[...L].reduce((a,ch)=>a*26+ch.charCodeAt(0)-64,0)-1,t=c.getAttribute('t'),v;if(t==='inlineStr')v=[...c.querySelectorAll('t')].map(x=>x.textContent).join('');else{let vv=c.querySelector('v');v=vv?vv.textContent:'';if(t==='s')v=ss[+v]}row[ci]=v});rows.push(row)});return rows}
function parseCsv(s){let rows=[],r=[],c='',q=false;s=s.replace(/^\ufeff/,'');for(let i=0;i<s.length;i++){let ch=s[i];if(q){if(ch==='"'){if(s[i+1]==='"'){c+='"';i++}else q=false}else c+=ch}else if(ch==='"')q=true;else if(ch===','){r.push(c);c=''}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&s[i+1]==='\n')i++;r.push(c);rows.push(r);r=[];c=''}else c+=ch}if(c||r.length){r.push(c);rows.push(r)}return rows}
async function obImport(inp){let f=inp.files[0];if(!f)return;inp.value='';let rows;try{rows=/\.xlsx$/i.test(f.name)?await readXlsx(await f.arrayBuffer()):parseCsv(await f.text())}catch(e){return toast('تعذر قراءة الملف. استخدم النموذج المنزّل (xlsx أو csv)',true)}
rows=rows.filter(r=>r&&r.some(x=>String(x||'').trim()));if(!rows.length)return toast('الملف فارغ',true);
let h=rows[0].map(x=>String(x||'').trim()),ix=n=>h.indexOf(n);if(ix('الاسم')<0||ix('الدور الوظيفي')<0)return toast('الصف الأول يجب أن يحتوي العمودين: الاسم، الدور الوظيفي (استخدم النموذج)',true);
db.observers=db.observers||[];let good=[],dup=0,bad=[],seen=new Set(db.observers.map(o=>o.name+'|'+o.role));
rows.slice(1).forEach((r,i)=>{let g=n=>String(r[ix(n)]||'').trim(),name=g('الاسم'),role=g('الدور الوظيفي');if(/^مثال/.test(name))return;if(!name||!OB_ROLES.includes(role)){bad.push(i+2);return}let key=name+'|'+role;if(seen.has(key)){dup++;return}seen.add(key);good.push({id:id(),name,role,dept:g('القسم / الجهة'),phone:g('الهاتف')})});
window._obGood=good;modal('معاينة الاستيراد',`<div class="stats"><div class="stat"><span>سيُضاف</span><strong>${good.length}</strong></div><div class="stat"><span>مكرر (يُتجاهل)</span><strong>${dup}</strong></div><div class="stat"><span>غير صالح</span><strong>${bad.length}</strong></div></div>${bad.length?`<div class="notice warning">صفوف غير صالحة (اسم فارغ أو دور غير: ${OB_ROLES.join('، ')}): ${bad.slice(0,15).join('، ')}</div>`:''}${good.slice(0,8).map(o=>`<div class="ovrow"><span>${esc2(o.name)}</span><i>${esc2(o.role)}</i></div>`).join('')}`,good.length?`<button onclick="obCommit()">استيراد ${good.length} سجل</button>`:'')}
function obCommit(){let g=window._obGood||[];db.observers.push(...g);save();log(`استيراد ${g.length} ملاحظ/مراقب من ملف`);closeModal();render();toast(`تم استيراد ${g.length} سجل`)}
const _rooms=rooms;rooms=function(){return _rooms()+`<section class="panel"><h2>نسخة احتياطية للقاعات فقط</h2><p class="muted">تصدير القاعات وسعتها كملف، واستيرادها لاحقاً دون إعادة الإدخال. الاستيراد يضيف القاعات الجديدة ولا يحذف الموجود.</p><div class="actions"><button onclick="roomsExport()">تصدير القاعات</button><label class="check light" style="cursor:pointer;margin:0">استيراد قاعات<input type="file" accept=".json" style="display:none" onchange="roomsImport(this)"></label></div></section>`};
function roomsExport(){dl('rooms-backup.json',new Blob([JSON.stringify({type:'rooms',at:nowS(),rooms:db.rooms},null,2)],{type:'application/json'}));log('تصدير القاعات')}
function roomsImport(inp){let f=inp.files[0];if(!f)return;inp.value='';f.text().then(t=>{try{let o=JSON.parse(t),a=(o&&o.rooms)||o;if(!Array.isArray(a))throw 0;let ok=a.filter(r=>r&&r.name&&+r.cap>=1),add=ok.filter(r=>!db.rooms.some(x=>x.name===r.name));if(!confirm(`سيتم إضافة ${add.length} قاعة جديدة وتجاهل ${ok.length-add.length} مكررة. متابعة؟`))return;add.forEach(r=>db.rooms.push({id:id(),name:String(r.name),cap:+r.cap}));save();log(`استيراد ${add.length} قاعة`);render();toast(`تمت إضافة ${add.length} قاعة`)}catch(e){toast('ملف القاعات غير صالح',true)}})}
let _saveFail=false,_dirty=false;
persistDb=function(){try{localStorage.setItem('sohag_exam_demo',JSON.stringify(db));_saveFail=false;let n=Date.now();if(n-(window._lastBackup||0)>30000){window._lastBackup=n;localStorage.setItem('sohag_exam_demo_backup',JSON.stringify({at:nowS(),db}))}let c=document.getElementById('savechip');if(c){c.textContent='✓ تم الحفظ '+new Date().toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'});c.className='badge green'}_dirty=false}catch(err){_saveFail=true;let c=document.getElementById('savechip');if(c){c.textContent='⚠ تعذر الحفظ';c.className='badge redtag'}toast('تعذر الحفظ في المتصفح: '+err.message+'. صدّر نسخة احتياطية الآن.',true)}};
addEventListener('beforeunload',ev=>{if(_saveFail||_dirty){ev.preventDefault();ev.returnValue=''}});
document.addEventListener('input',ev=>{if(ev.target.closest&&(ev.target.closest('#modalroot')||(page==='setup'&&ev.target.closest('#content'))))_dirty=true});
function offHead(extra){let e=active();return `<div class="offhead"><img src="${LOGO_F}" alt=""><div class="oh-c"><b>جامعة سوهاج</b><b>كلية العلوم</b><span>${esc(e.name)} • ${esc(e.type||'الامتحانات الكتابية')}</span><span>${esc(e.year)} – ${esc(e.semester)}${extra?' • '+extra:''}</span></div><img src="${LOGO_U}" alt=""></div>`}
function flat(src){let c=src.cloneNode(true);c.removeAttribute('class');c.setAttribute('border','1');c.setAttribute('dir','rtl');c.querySelectorAll('td').forEach(td=>{let m=[...td.querySelectorAll('.mx')];if(m.length)td.innerHTML=m.map(x=>[...x.children].map(y=>y.textContent).join(' - ')).join('<br>');td.removeAttribute('class');td.removeAttribute('style')});c.querySelectorAll('td small').forEach(x=>x.insertAdjacentText('beforebegin',' '));c.querySelectorAll('th').forEach(th=>{th.removeAttribute('class');th.removeAttribute('style')});return c.outerHTML}
exportPub=function(kind){let e=active();if(!e)return;let src=(pubTab==='matrix'&&document.querySelector('table.matrix'))?document.querySelector('table.matrix'):$('#pubtable');if(!src)return toast('لا يوجد جدول للتصدير',true);
let sig=['توقيع المختص','مدير إدارة شؤون الطلاب','وكيل الكلية لشؤون التعليم والطلاب','عميد الكلية'];let lv=pubTab==='matrix'?'المستوى '+LV[pubLevel-1]:'جميع المستويات';
let html=`<html dir="rtl" lang="ar"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>الجدول</x:Name><x:WorksheetOptions><x:DisplayRightToLeft/><x:FitToPage/><x:Print><x:FitWidth>1</x:FitWidth><x:FitHeight>0</x:FitHeight><x:ValidPrinterInfo/><x:PaperSizeIndex>9</x:PaperSizeIndex></x:Print></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><style>@page{size:A4 landscape;mso-page-orientation:landscape;margin:.5cm}body{font-family:Tahoma;direction:rtl}table{border-collapse:collapse;width:100%}td,th{border:1px solid #000;padding:5px;text-align:center}.hd td{border:0}.sig td{border:0;padding-top:30px}</style></head><body><table class="hd"><tr><td style="width:18%"><img src="${LOGO_F}" width="70"></td><td><h2>جامعة سوهاج – كلية العلوم</h2><b>${esc(e.name)}</b><br>${esc(e.year)} – ${esc(e.semester)} • ${lv}<br>${esc(e.type||'')}</td><td style="width:18%"><img src="${LOGO_U}" width="60"></td></tr></table>${flat(src)}<table class="sig"><tr>${sig.map(s=>`<td>${s}<br>........................</td>`).join('')}</tr></table></body></html>`;
let mime=kind==='xls'?'application/vnd.ms-excel':'application/msword';dl('exam-schedule.'+kind,new Blob(['\ufeff'+html],{type:mime+';charset=utf-8'}));log('تصدير الجدول المجمّع '+kind+' ('+lv+')')};
const RM=[
['إدارة النظام والصلاحيات','1-4','موجود','الصلاحيات تُمنح لكل مستخدم من شاشة الصلاحيات وتُحفظ مع حسابه. الصلاحيات الافتراضية لكل دور ما زالت مكتوبة في الكود. منع تكرار اسم المستخدم موجود.'],
['الإصدارات كمواسم (أول/ثاني/صيفي)','5','تم تحسينه الآن','أضيف منع فتح إصدار ثانٍ لنفس العام والفصل قبل أرشفة الأول، والإغلاق لمدير النظام فقط مع تحذير إذا بقيت جداول غير معتمدة.'],
['الفترات وأيام الامتحانات والإجازات يدوياً','6, 9','موجود','لا توجد قيم افتراضية مفروضة. جميعها تُدخل وتُعدّل وتُحذف.'],
['مقرر واحد لكل مستوى في اليوم + مستوى واحد في الفترة','7, 8','موجود','القاعدتان مطبقتان في توزيع الفترات وتحديد مواعيد المقررات.'],
['مقرران في اليوم كاستثناء مؤكد','12','جديد (نُفّذ الآن)','عند وضع مقرر ثانٍ في يوم مشغول يظهر تأكيد صريح أن الطلاب مختلفون، ويُسجَّل الاستثناء في السجل ويُعلَّم في الجدول. لا يُستنتج من اختلاف الأكواد.'],
['ترتيب المقررات (أعلى/أسفل، سحب وإفلات، حذف)','12','موجود','مع تسجيل الحذف وتغيير الموعد في سجل العمليات (أضيف الآن).'],
['استقلال البرامج وعدم دمج المقررات المتشابهة بالكود','10, 13','موجود','كل برنامج ومستوى وفصل مستقل. لم يُغيَّر شيء في الخطط.'],
['عدد الطلاب يدوي','14','موجود','يدخله المختص عند إعداد كل جدول.'],
['إلغاء برنامج جيولوجيا المياه','15','منفّذ (غير موجود أصلاً)','برنامج «جيولوجيا المياه» غير موجود في قائمة البرامج بالمنصة: البرامج الخاصة ستة فقط، ولم تُرفع له خطة معتمدة. لم يُحذف أي شيء. المقرر GEOL364 «جيولوجيا المياه» (اختياري داخل خطط الجيولوجيا) وكل المقررات باقية كما هي.'],
['الامتحانات التحريرية فقط','16','موجود','لا توجد جدولة عملي أو شفوي.'],
['إدارة القاعات (إضافة/تعديل/حذف/سعة/حفظ)','17','موجود','تُحفظ في المتصفح. أضيف الآن تصدير واستيراد القاعات وحدها.'],
['الملاحظون والمراقبون ورؤساء اللجان بملف Excel','18','جديد (نُفّذ الآن)','نموذج xlsx موحد، استيراد xlsx/csv مع معاينة وكشف التكرار والصفوف الخاطئة، وحفظ للإصدارات التالية. التوزيع على اللجان لم يُبنَ.'],
['التصدير PDF/Excel/Word','19','موجود + تحسين','يعمل من الجدول المجمّع (مصفوفة أو قائمة).'],
['الترويسة الرسمية والتوقيعات','20','تم تحسينه الآن','شعار الكلية وشعار الجامعة واسم الإصدار والفصل والمستوى وأماكن التوقيعات الأربعة بالترتيب المطلوب. شعارات Word/Excel قد لا تظهر في بعض الإصدارات.'],
['لوحة متابعة التأخر','21','تم تحسينه الآن','مرحلة كل جدول، تاريخ الإرسال، موعد تسليم لكل جدول أو للكل، وإبراز المتأخرين.'],
['ملاحظات المراجع على مستوى الجدول','22','موجود','تظهر للمختص مع إمكانية التعديل وإعادة الإرسال.'],
['التشغيل المحلي على جهاز واحد','23','موجود','يعمل من ملف HTML. أي متصفح يحفظ بياناته منفصلة عن الآخر.'],
['النسخ الاحتياطي والاستعادة','24','موجود + تحسين','نسخة تلقائية، يدوية، تصدير واستعادة. تشمل الآن الملاحظين. مؤشر حفظ وتحذير عند فشل الحفظ.'],
['سجل العمليات مع بحث وتصفية','25','موجود + تحسين','بحث بالمستخدم والتاريخ والنص. أضيف تسجيل الحذف وتحديد المواعيد والاستثناءات والاستيراد.'],
['نسخ الجداول والمقارنة','إضافي 4','جديد (نُفّذ الآن)','نسخة تُحفظ عند الإرسال وعند قرار المراجع، ومقارنة بين أي نسختين أو مع الحالي.'],
['التنبيهات','إضافي 6','جديد (داخل المنصة فقط)','تكليف، إعادة بملاحظات، اقتراب التسليم، انتظار المراجعة. لا بريد ولا رسائل.'],
['الحماية من فقدان البيانات','إضافي 5','جزئي','الحفظ فوري عند كل عملية. تحذير الخروج عند فشل الحفظ أو وجود نموذج مفتوح غير محفوظ.'],
['الأرشفة','إضافي 7','موجود','الإصدار المغلق يبقى محفوظاً دون التأثير على الجديد.'],
['حماية حقيقية وقاعدة بيانات مشتركة','تشغيل فعلي','يحتاج خادماً','النسخة العامة ثابتة: الحسابات التجريبية معروفة والحماية على الواجهة فقط، والبيانات داخل كل متصفح. التشغيل الفعلي يحتاج خادماً وقاعدة بيانات ودخول آمن. لا يوجد خادم للكلية حالياً.'],
['توزيع اللجان والملاحظين (يدوي)','17, 18','جديد (نُفّذ الآن)','اللجنة قاعة في يوم وفترة، والمقرر يمكن أن يتوزع على أكثر من لجنة. تعيين الملاحظين والمراقبين ورؤساء اللجان يدوياً، تحذيرات للمراجعة فقط، تصدير CSV، ويدخل في النسخ الاحتياطي. سياسة اشتراك مقررين في القاعة والفترة نفسهما وعدد الملاحظين لكل لجنة لم تُحدد بعد.'],
['اقتراح المواعيد تلقائياً (للمقررات الإجبارية)','منفّذ (جزئي)','جزئي','يقترح مواعيد المقررات الإجبارية غير المجدولة بقواعدك (مقرر واحد باليوم للبرنامج، مستوى واحد في الفترة، أيام وفترات المستوى)، بمعاينة ثم تطبيق وتراجع، دون تغيير ما حددته يدوياً. قراءة متحفظة: موعد واحد للمستوى في اليوم عبر برامجه، وقد تترك مقررات لقرار يدوي حتى يحسم المستخدم ذلك. المجموعات الاختيارية تُحدد يدوياً.'],['تكليف الملاحظين واللجان تلقائياً','غير منفّذ','غير منفّذ','لم يُبنَ. التوزيع يدوي. يحتاج قواعد يحددها المستخدم.']
];
function roadmapPage(){let cl=s=>/جديد|تم تحسينه|منفّذ \(/.test(s)?'green':/يحتاج|جزئي|قرارك/.test(s)?'amber':/غير منفّذ|مؤجل/.test(s)?'red':'blue';
return head('خارطة التطوير','كل بند في وثيقة المتطلبات مقابل ما هو موجود وما أُصلح وما أُضيف وما يحتاج قراراً أو خادماً.')+`<section class="panel"><div class="tablewrap"><table><tr><th>الوحدة</th><th>البند</th><th>الحالة</th><th>ملاحظات</th></tr>${RM.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td><span class="badge ${cl(r[2])}">${esc(r[2])}</span></td><td style="white-space:normal;min-width:320px">${esc(r[3])}</td></tr>`).join('')}</table></div></section>`}
const _dash2=dashboard;dashboard=function(){if(page==='observers')return observersPage();if(page==='roadmap')return roadmapPage();let h=_dash2(),e=active(),late=e?Object.values(e.tasks).filter(isLate).length:0;return late?h.replace('<div class="stats">',`<div class="notice warning">يوجد ${late} جدول متأخر عن موعد التسليم. <button class="text-btn sm" onclick="go('tracking')">عرض المتابعة</button></div><div class="stats">`):h};
const _render2=render;render=function(){db.observers=db.observers||[];_render2();
let top=document.querySelector('.top');if(top&&me){if(!document.getElementById('bell')){let b=document.createElement('div');b.style.cssText='display:flex;gap:8px;align-items:center';b.innerHTML='<span id="savechip" class="badge green">✓ محفوظ</span><button id="bell" class="light" onclick="bellModal()">تنبيهات <span id="bellc" class="badge amber"></span></button>';top.insertBefore(b,top.lastElementChild)}
let n=notices().length,c=document.getElementById('bellc');if(c){c.textContent=n?n:'';c.style.display=n?'':'none'}}};
function fixPairs(t){if(!t||!t.courses)return;let day=c=>String(c.slot||'').split('|')[0];t.courses.forEach(c=>{if(c.pair&&!(c.slot&&t.courses.some(o=>o!==c&&o.slot&&day(o)===day(c))))delete c.pair})}
const _scs2=setCourseSlot;setCourseSlot=function(k,code,slot){_scs2(k,code,slot);let e=active();if(e&&e.tasks[k]){let before=JSON.stringify(e.tasks[k].courses.map(c=>!!c.pair));fixPairs(e.tasks[k]);if(before!==JSON.stringify(e.tasks[k].courses.map(c=>!!c.pair))){save();render()}}};
const _rc2=removeCourse;removeCourse=function(k,i){_rc2(k,i);let e=active();if(e&&e.tasks[k]){fixPairs(e.tasks[k]);save();render()}};
const _ro=reviewOne;reviewOne=function(k){_ro(k);let t=active().tasks[k],pc=(t.courses||[]).filter(c=>c.pair);if(pc.length){let m=document.querySelector('.modal .actions');if(m)m.insertAdjacentHTML('beforebegin',`<div class="notice warning"><b>⚑ استثناء مقررين في اليوم نفسه:</b> ${pc.map(c=>esc(c.code)+' ('+esc(c.label||'')+')').join('، ')}<br>أكّد المختص أن طلاب المقررين مختلفون. راجع ذلك قبل الاعتماد.</div>`)}};
(function(){
const CT=(()=>{let t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc(b){let c=~0;for(let i=0;i<b.length;i++)c=CT[(c^b[i])&255]^(c>>>8);return ~c>>>0}
function zip(files){const enc=new TextEncoder();let parts=[],cd=[],off=0;
const u16=v=>[v&255,v>>8&255],u32=v=>[v&255,v>>8&255,v>>16&255,v>>>24&255];
files.forEach(([n,s])=>{const nb=enc.encode(n),d=(typeof s==='string'?enc.encode(s):s),c=crc(d);
const h=[0x50,0x4b,3,4,...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0x21),...u32(c),...u32(d.length),...u32(d.length),...u16(nb.length),...u16(0)];
parts.push(new Uint8Array(h),nb,d);
cd.push(new Uint8Array([0x50,0x4b,1,2,...u16(20),...u16(20),...u16(0x800),...u16(0),...u16(0),...u16(0x21),...u32(c),...u32(d.length),...u32(d.length),...u16(nb.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(off)]),nb);
off+=h.length+nb.length+d.length});
let cs=0;cd.forEach(x=>cs+=x.length);
const end=new Uint8Array([0x50,0x4b,5,6,0,0,0,0,...u16(files.length),...u16(files.length),...u32(cs),...u32(off),0,0]);
return new Blob([...parts,...cd,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
const X=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const colL=i=>String.fromCharCode(65+i);
window._zip=zip;const oldExp=exportPub;
exportPub=function(kind){if(kind!=='xls')return oldExp(kind);
let e=active();if(!e)return;
let src=(pubTab==='matrix'&&document.querySelector('table.matrix'))?document.querySelector('table.matrix'):$('#pubtable');if(!src)return toast('لا يوجد جدول للتصدير',true);
let rows=[...src.querySelectorAll('tr')].map(tr=>[...tr.children].map(c=>{let m=[...c.querySelectorAll('.mx')];if(m.length)return m.map(x=>[...x.children].map(y=>y.textContent.trim()).join(' - ')).join('\n');return c.innerText.replace(/\s*\n\s*/g,'\n').trim()}));
let nt=Math.max(...rows.map(r=>r.length),2),nc=Math.max(nt,4);
let lv=pubTab==='matrix'?'المستوى '+LV[pubLevel-1]:'جميع المستويات';
let sig=['توقيع المختص','مدير إدارة شؤون الطلاب','وكيل الكلية لشؤون التعليم والطلاب','عميد الكلية'];
let R=[],M=[];
const add=(cells,s,h)=>{R.push({cells,s,h})};
add(['جامعة سوهاج – كلية العلوم'],1,30);M.push(1);
add([e.name],1,22);M.push(2);
add([e.semester+' - '+lv],1,24);M.push(3);
add([(e.type||'')+' - '+e.year],1,24);M.push(4);
add([],0,8);
rows.forEach((r,i)=>{let hdr=i===0;let long=r.some(x=>x.length>30||x.includes('\n'));add(r.map(x=>x),hdr?2:3,hdr?20:(long?42:22))});
add([],0,12);
let sigRow=R.length+1;
add(sig.map(s=>s+'\n........................'),4,60);
let cell=(v,ci,ri,s)=>`<c r="${colL(ci)}${ri}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${X(v)}</t></is></c>`;
let gcd=(a,b)=>b?gcd(b,a%b):a;let G=nt*4/gcd(nt,4);let cw=(nt>=4?nt*30:120)/G;let lastCol=colL(G-1);
let cell2=(v,ci,ri,st)=>cell(v,ci,ri,st);
let MG=[];
let sd=R.map((r,i)=>{let ri=i+1,tt=r.cells,st=r.s;let isT=M.includes(ri);let cs='';
if(isT){cs=cell(tt[0],0,ri,1);for(let c=1;c<G;c++)cs+=`<c r="${colL(c)}${ri}" s="1"/>`;MG.push(`A${ri}:${lastCol}${ri}`)}
else if(st===4){let w=G/4;sig.forEach((x,q)=>{cs+=cell(tt[q],q*w,ri,4);for(let c=1;c<w;c++)cs+=`<c r="${colL(q*w+c)}${ri}" s="4"/>`;if(w>1)MG.push(`${colL(q*w)}${ri}:${colL(q*w+w-1)}${ri}`)})}
else if(tt.length){let w=G/nt;for(let q=0;q<nt;q++){cs+=cell(tt[q]||'',q*w,ri,st);for(let c=1;c<w;c++)cs+=`<c r="${colL(q*w+c)}${ri}" s="${st}"/>`;if(w>1)MG.push(`${colL(q*w)}${ri}:${colL(q*w+w-1)}${ri}`)}}
return `<row r="${ri}" ht="${r.h}" customHeight="1">${cs}</row>`}).join('');
let merges=MG.map(x=>`<mergeCell ref="${x}"/>`).join('');
let cols=Array.from({length:G},(_,i)=>`<col min="${i+1}" max="${i+1}" width="${cw.toFixed(1)}" customWidth="1"/>`).join('');
let lk=Math.min(G-1,Math.ceil(14/cw));
let b64=u=>Uint8Array.from(atob(u.split(',')[1]),c=>c.charCodeAt(0));
let anc=(col,id,rid,nm)=>`<xdr:oneCellAnchor><xdr:from><xdr:col>${col}</xdr:col><xdr:colOff>60000</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>30000</xdr:rowOff></xdr:from><xdr:ext cx="900000" cy="900000"/><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="${id}" name="${nm}"/><xdr:cNvPicPr/></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="900000" cy="900000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:oneCellAnchor>`;
let drw=`<?xml version="1.0" encoding="UTF-8"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">${anc(G-lk,2,'rId1','logo1')}${anc(0,3,'rId2','logo2')}</xdr:wsDr>`;
let sheet=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView rightToLeft="1" workbookViewId="0"/></sheetViews><cols>${cols}</cols><sheetData>${sd}</sheetData><mergeCells count="${MG.length}">${merges}</mergeCells><pageMargins left="0.4" right="0.4" top="0.5" bottom="0.5" header="0.3" footer="0.3"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/><drawing r:id="rId1"/></worksheet>`;
let styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Tahoma"/></font><font><b/><sz val="13"/><name val="Tahoma"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9E2F3"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"/><right style="thin"/><top style="thin"/><bottom style="thin"/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment horizontal="center" vertical="top" wrapText="1"/></xf></cellXfs></styleSheet>`;
let files=[['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
['_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
['xl/workbook.xml','<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="الجدول" sheetId="1" r:id="rId1"/></sheets></workbook>'],
['xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
['xl/styles.xml',styles],['xl/worksheets/sheet1.xml',sheet],['xl/worksheets/_rels/sheet1.xml.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/></Relationships>'],['xl/drawings/drawing1.xml',drw],['xl/drawings/_rels/drawing1.xml.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/logo1.png"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/logo2.png"/></Relationships>'],['xl/media/logo1.png',b64(LOGO_F)],['xl/media/logo2.png',b64(LOGO_U)]];
dl('exam-schedule.xlsx',zip(files));log('تصدير الجدول المجمّع xlsx ('+lv+')')};
})();
(()=>{let i=PAGES.findIndex(x=>x[0]==='observers')+1;PAGES.splice(i,0,['alloc','توزيع اللجان']);ROLE_PERMS.admin=PAGES.map(x=>x[0]).filter(k=>k!=='tasks').concat('approve');ICONS.alloc='▦'})();
const dayOf=s=>String(s).split('|')[0];
function allocCourses(e){let o=[],P=programs();Object.entries(e.tasks).forEach(([k,t])=>{let p=P.find(x=>x.key===k);(t.courses||[]).filter(c=>c.slot).forEach(c=>o.push({k,code:c.code,name:c.name,n:+c.students||0,slot:c.slot,prog:p?p.name:k,lv:p?p.level:0}))});return o.sort((a,b)=>a.slot.localeCompare(b.slot)||a.lv-b.lv)}
function allocGet(e,c){e.alloc=e.alloc||{};return e.alloc[c.k+'|'+c.code]}
function allocWarn(e,c,A){let w=[],L=A?A.list:[],room=id=>(db.rooms.find(r=>r.id===id)||{});
if(A&&A.slot!==c.slot)w.push('موعد المقرر تغيّر منذ حفظ اللجان، راجعها');
if(L.length){let s=L.reduce((a,x)=>a+(+x.n||0),0);if(c.n&&s!==c.n)w.push(`الموزع ${s} من ${c.n} طالب`)}
let seen={};L.forEach(x=>{let r=room(x.room);if(!r.id)w.push('قاعة محذوفة من القاعات');else{if(+x.n>r.cap)w.push(`${r.name}: العدد ${x.n} أكبر من السعة ${r.cap}`);if(seen[x.room])w.push(`${r.name} مكررة في نفس المقرر`);seen[x.room]=1}});
Object.entries(e.alloc||{}).forEach(([key,B])=>{if(B===A||B.slot!==c.slot)return;(B.list||[]).forEach(y=>{if(L.some(x=>x.room===y.room))w.push(`${room(y.room).name||'قاعة'} مستخدمة أيضاً لمقرر آخر في نفس اليوم والفترة (${key.split('|').slice(-1)[0]}). راجع إن كان مقصوداً`)})});
L.forEach(x=>(x.staff||[]).forEach(sid=>{let o=db.observers.find(z=>z.id===sid);if(!o)return w.push('شخص محذوف من قائمة الملاحظين');if(o.role!=='ملاحظ')return;Object.entries(e.alloc||{}).forEach(([key,B])=>{if(B.slot!==c.slot)return;(B.list||[]).forEach(y=>{if(y!==x&&(y.staff||[]).includes(sid))w.push(`الملاحظ ${o.name} في لجنتين في نفس اليوم والفترة`)})})}));
return [...new Set(w)]}
function allocPage(){let e=active();if(!e)return head('توزيع اللجان','لا يوجد إصدار نشط.');db.observers=db.observers||[];let cs=allocCourses(e),per=pid=>(e.periods.find(p=>p.id===pid)||{name:pid}),bad=0;
let rows=cs.map(c=>{let A=allocGet(e,c),W=allocWarn(e,c,A),L=A?A.list:[];bad+=W.length?1:0;let [d,pid]=c.slot.split('|'),rm=id=>(db.rooms.find(r=>r.id===id)||{name:'؟'}).name;
let nm=ids=>(ids||[]).map(i=>(db.observers.find(o=>o.id===i)||{name:'؟'}).name).join('، ')||'—';
return `<tr><td>${esc2(d)}<small>${esc2(per(pid).name)}</small></td><td>${esc2(c.prog)}</td><td><b>${esc2(c.name)}</b><small>${esc2(c.code)} • ${c.n||'؟'} طالب</small></td><td>${L.map((x,q)=>`<div>${esc2(rm(x.room))}: ${x.n}<small>${esc2(nm(x.staff))}</small></div>`).join('')||'<span class="muted">لا لجان</span>'}${W.map(x=>`<div class="notice warning" style="margin:4px 0;padding:6px">⚠ ${esc2(x)}</div>`).join('')}</td><td><button class="sm" onclick="allocEdit('${esc(c.k).replace(/'/g,"\\'")}','${esc(c.code)}')">تحرير اللجان</button></td></tr>`}).join('')||'<tr><td colspan="5">لا توجد مقررات لها موعد بعد.</td></tr>';
return head('توزيع اللجان','اللجنة هي قاعة في يوم وفترة محددين، ويمكن توزيع المقرر الواحد على أكثر من لجنة. التوزيع يدوي بالكامل ولا يوجد توليد تلقائي.',`<button onclick="allocCsv()">تصدير CSV</button>`)+
`<div class="stats">${stat('مقررات بموعد',cs.length)}${stat('لها لجان',cs.filter(c=>allocGet(e,c)&&allocGet(e,c).list.length).length)}${stat('بها تحذيرات',bad)}</div><div class="notice">التحذيرات للمراجعة فقط ولا تمنع الحفظ. عدد الملاحظين في كل لجنة يحدده المستخدم يدوياً. المراقب ورئيس اللجنة يمكن أن يشرف كل منهما على أكثر من لجنة، فلا يُعدّ ذلك تعارضاً. سياسة وجود أكثر من مقرر في القاعة نفسها بالفترة نفسها لم تُحدد بعد، لذلك تظهر كتنبيه فقط. تُحفظ البيانات في هذا المتصفح وتدخل في النسخة الاحتياطية.</div><section class="panel"><div class="tablewrap"><table><tr><th>اليوم / الفترة</th><th>البرنامج</th><th>المقرر</th><th>اللجان والموزَّعون</th><th></th></tr>${rows}</table></div></section>${allocOrphans(e,cs)}`}
function allocOrphans(e,cs){let ks=new Set(cs.map(c=>c.k+'|'+c.code)),o=Object.keys(e.alloc||{}).filter(x=>!ks.has(x)&&(e.alloc[x].list||[]).length);return o.length?`<section class="panel"><h2>لجان محفوظة لمقررات بلا موعد أو محذوفة</h2><p class="muted">لم تُحذف تلقائياً. أعد جدولة المقرر ليظهر توزيعه، أو احذفها هنا.</p>${o.map(x=>`<div>${esc2(x)} <button class="sm light" onclick="allocDrop(this.dataset.k)" data-k="${esc(x)}">حذف</button></div>`).join('')}</section>`:''}
function allocDrop(x){if(!confirm('حذف لجان هذا المقرر المحفوظة؟'))return;delete active().alloc[x];save();log('حذف لجان محفوظة '+x);render()}
let _ae=null;
function allocEdit(k,code){let e=active(),c=allocCourses(e).find(x=>x.k===k&&x.code===code);if(!c)return;let A=allocGet(e,c);let cr=e.tasks[k].courses.find(x=>x.code===code)||{};_ae={k,code,slot:c.slot,lect:cr.lect||'',carry:cr.carry||'',list:A?JSON.parse(JSON.stringify(A.list)):[]};allocDraw(c)}
function allocDraw(c){let e=active();c=c||allocCourses(e).find(x=>x.k===_ae.k&&x.code===_ae.code);let L=_ae.list;
let body=`<p class="muted">${esc2(c.name)} • ${esc2(c.code)} • ${c.n||'؟'} طالب</p><div class="formgrid"><div class="field"><label>المحاضر (اختياري، يظهر في الجدول المطبوع)</label><input value="${esc2(_ae.lect)}" onchange="_ae.lect=this.value"></div><div class="field"><label>عدد المتخلفين (اختياري)</label><input type="number" min="0" value="${esc2(_ae.carry)}" onchange="_ae.carry=this.value"></div></div>${L.map((x,q)=>`<div class="panel" style="padding:8px;margin:6px 0"><div class="formgrid"><div class="field"><label>القاعة</label><select onchange="_ae.list[${q}].room=this.value">${db.rooms.map(r=>`<option value="${r.id}" ${r.id===x.room?'selected':''}>${esc2(r.name)} (${r.cap})</option>`).join('')}</select></div><div class="field"><label>عدد الطلاب</label><input type="number" min="1" value="${x.n}" onchange="_ae.list[${q}].n=+this.value"></div></div>${OB_ROLES.map(r=>`<details><summary>${r} (${(x.staff||[]).filter(s=>(db.observers.find(o=>o.id===s)||{}).role===r).length})</summary>${db.observers.filter(o=>o.role===r).map(o=>`<label class="check" style="display:block"><input type="checkbox" ${(x.staff||[]).includes(o.id)?'checked':''} onchange="allocStaff(${q},'${o.id}',this.checked)"> ${esc2(o.name)}</label>`).join('')||'<span class="muted">لا أحد مضاف</span>'}</details>`).join('')}<button class="sm light" onclick="_ae.list.splice(${q},1);allocDraw()">حذف اللجنة</button></div>`).join('')||'<p class="muted">لا لجان بعد.</p>'}<button class="light" ${db.rooms.length?'':'disabled'} onclick="_ae.list.push({room:db.rooms[0].id,n:${c.n||1},staff:[]});allocDraw()">＋ إضافة لجنة</button>`;
modal('لجان وبيانات المقرر',body,`<button onclick="allocSave()">حفظ</button>`)}
function allocStaff(q,sid,on){let s=_ae.list[q].staff=_ae.list[q].staff||[];let i=s.indexOf(sid);if(on&&i<0)s.push(sid);if(!on&&i>=0)s.splice(i,1)}
function allocSave(){let e=active();let cr=e.tasks[_ae.k].courses.find(x=>x.code===_ae.code);if(cr){cr.lect=_ae.lect.trim();cr.carry=+_ae.carry>0?+_ae.carry:0}e.alloc=e.alloc||{};e.alloc[_ae.k+'|'+_ae.code]={slot:_ae.slot,list:_ae.list.filter(x=>+x.n>=1)};save();log('تحديد لجان المقرر '+_ae.code);closeModal();render();toast('تم حفظ اللجان')}
function allocCsv(){let e=active(),q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"',nm=(ids,r)=>(ids||[]).map(i=>db.observers.find(o=>o.id===i)).filter(o=>o&&o.role===r).map(o=>o.name).join('، ');let R=[['التاريخ','الفترة','البرنامج','المقرر','الكود','القاعة','عدد الطلاب','ملاحظون','مراقبون','رئيس لجنة']];allocCourses(e).forEach(c=>{let A=allocGet(e,c);(A?A.list:[]).forEach(x=>{let [d,pid]=c.slot.split('|');R.push([d,(e.periods.find(p=>p.id===pid)||{}).name,c.prog,c.name,c.code,(db.rooms.find(r=>r.id===x.room)||{}).name,x.n,nm(x.staff,'ملاحظ'),nm(x.staff,'مراقب'),nm(x.staff,'رئيس لجنة')])})});dl('committees.csv',new Blob(['\ufeff'+R.map(r=>r.map(q).join(',')).join('\n')],{type:'text/csv;charset=utf-8'}));log('تصدير اللجان')}
const _dash3=dashboard;dashboard=function(){return page==='alloc'?allocPage():_dash3()};
const _te3=taskEditor;taskEditor=function(e,k){let h=_te3(e,k);if(typeof h!=='string')return h;let t=e.tasks[k]||{courses:[]},cs=(t.courses||[]).filter(c=>c.slot);if(!cs.length)return h;let lk=isLocked(t);
return h+`<section class="panel" style="margin-top:14px"><h3>بيانات الطباعة للمقررات (اختيارية)</h3><p class="muted">المحاضر وعدد المتخلفين يظهران في الجدول الرسمي المطبوع. تُحفظ مع مقررات هذا البرنامج.${lk?' التعديل متوقف لأن الجدول مُرسل أو معتمد.':''}</p><div class="tablewrap"><table><tr><th>الكود</th><th>المقرر</th><th>المحاضر</th><th>عدد المتخلفين</th></tr>${cs.map(c=>`<tr><td>${esc(c.code)}</td><td>${esc(c.name)}</td><td><input value="${esc(c.lect||'')}" ${lk?'disabled':''} onchange="setCourseExtra('${esc(k)}','${esc(c.code)}','lect',this.value)"></td><td><input type="number" min="0" style="width:90px" value="${c.carry||''}" ${lk?'disabled':''} onchange="setCourseExtra('${esc(k)}','${esc(c.code)}','carry',this.value)"></td></tr>`).join('')}</table></div></section>`};
function setCourseExtra(k,code,f,v){let e=active();if(!e)return;let t=e.tasks[k];if(!t||isLocked(t))return toast('التعديل متوقف',true);if(!(me.role==='admin'||e.assign[k]===me.id))return toast('غير مصرح',true);let c=(t.courses||[]).find(x=>x.code===code);if(!c)return;if(f==='carry')c.carry=+v>0?Math.floor(+v):0;else c.lect=String(v).trim();save();log('تحديث بيانات الطباعة للمقرر '+code)}
const LVC=[['#1b7f6b','#d6efe8'],['#1f5fa8','#d9e7f7'],['#b5650d','#fbe6c8'],['#7b3fa0','#ead9f4']];
const Q_TXT='حاصلة على شهادة الاعتماد من الهيئة القومية لضمان جودة التعليم والاعتماد منذ يوليو عام ٢٠١٢';
function prn(e){e.print=e.print||{};return e.print}
function offModel(){let e=active(),ok=['معتمد','منشور'],P=programs(),out=[];
[1,2,3,4].forEach(l=>{let cols=P.filter(p=>p.level===l),cells={},keys=new Set(),has=new Set();
cols.forEach(p=>{let t=e.tasks[p.key];if(!t||(pubScope==='ok'&&!ok.includes(t.status)))return;(t.courses||[]).filter(c=>c.slot).forEach(c=>{let [d,pid]=c.slot.split('|'),k=d+'|'+pid;keys.add(k);has.add(p.key);(cells[k+'|'+p.key]=cells[k+'|'+p.key]||[]).push(c)})});
let cs=cols.filter(p=>has.has(p.key));if(!cs.length)return;
let rows=[...keys].sort().map(k=>{let [d,pid]=k.split('|'),per=e.periods.find(x=>x.id===pid)||{name:pid,from:'',to:''};let dn='';try{dn=DAYS[new Date(d+'T12:00:00').getDay()]}catch(x){}
return {day:dn,date:d.replace(/-/g,'/'),per:per.name+' '+per.from+'–'+per.to,cells:cs.map(p=>(cells[k+'|'+p.key]||[]).map(c=>({a:c.name+' ('+c.code+')'+(c.students?' ('+c.students+(c.carry?' + '+c.carry+' تخلف':'')+')':''),b:c.lect||'',n:c.name,cd:c.code,st:c.students?(c.students+' طالب'+(c.carry?' + '+c.carry+' تخلف':'')):''})))}});
out.push({lv:l,cols:cs.map(p=>p.name),rows})});
let BM=6,res=[];out.forEach(m=>{let n=m.cols.length,nb=Math.ceil(n/BM);if(nb<=1){res.push(m);return}let sz=Math.ceil(n/nb);for(let b=0;b<nb;b++){let a=b*sz,z=Math.min(n,a+sz);let rows=m.rows.map(r=>({...r,cells:r.cells.slice(a,z)})).filter(r=>r.cells.some(c=>c.length));res.push({lv:m.lv,cols:m.cols.slice(a,z),rows,bt:' (الجزء '+(b+1)+' من '+nb+')',bn:(b+1)+'-'+nb})}});return res}
function offSigs(e){let N=prn(e).names||[];return [['توقيع المختص',N[0]],['مدير إدارة شؤون الطلاب',N[1]],['وكيل الكلية لشؤون التعليم والطلاب',N[2]],['عميد الكلية',N[3]]]}
function offHtml(M,e){let P=prn(e),qt=P.qOn===false?'':(P.q||Q_TXT),ft=[P.formNo&&'نموذج رقم '+P.formNo,P.formIssue&&'إصدار رقم ('+P.formIssue+')',P.formDate&&'تاريخ الإصدار '+P.formDate].filter(Boolean).join('  ');
const cell=x=>`<div class="cc"><div class="cn">${esc(x.n||x.a)}</div>${(x.cd||x.st)?`<div class="cm">${x.cd?`<span dir="ltr">${esc(x.cd)}</span>`:''}${x.cd&&x.st?' &nbsp;•&nbsp; ':''}${x.st?`<span>${esc(x.st)}</span>`:''}</div>`:''}${x.b?`<div class="cl">${esc(x.b)}</div>`:''}</div>`;
let pages=M.map((m,i)=>{let [c1,c2]=LVC[m.lv-1],w=Math.round(84/m.cols.length*10)/10;
let th=m.cols.map(n=>`<th style="width:${w}%">${esc(n)}</th>`).join('');
let body=m.rows.map((r,ri)=>`<tr class="${ri%2?'z':''}"><td class="d"><div class="dn">${esc(r.day)}</div><div class="dd">${esc(r.date)}</div><div class="dp">${esc(r.per)}</div></td>${r.cells.map(a=>`<td>${a.map(cell).join('<div class="sp"></div>')}</td>`).join('')}</tr>`).join('');
return `<section class="pg" style="--c1:${c1};--c2:${c2};${i<M.length-1?'page-break-after:always':''}"><table class="h"><tr><td class="hs hr"><img src="${LOGO_U}" height="56"></td><td class="hc">${qt?`<img src="${LOGO_Q}" height="30"><div class="q">${esc(qt)}</div>`:''}</td><td class="hs hl"><img src="${LOGO_F}" height="56"></td></tr></table>
<div class="rule"></div>
<div class="t"><b>الجدول النهائي لطلاب المستوى ${LV[m.lv-1]}${m.bt||''}</b><span>${esc(e.semester)} &nbsp;•&nbsp; ${esc(e.type||'')} &nbsp;•&nbsp; العام الدراسي ${esc(e.year)}</span></div>
<table class="m"><thead><tr><th class="d0" style="width:16%">اليوم / التاريخ</th>${th}</tr></thead><tbody>${body}</tbody></table>
<table class="s"><tr>${offSigs(e).map(s=>`<td><div class="sl">${s[0]}</div><div class="sn">${esc(s[1]||'')||'&nbsp;'}</div><div class="sg"></div><div class="sc">التوقيع</div></td>`).join('')}</tr></table>${ft?`<div class="f">${esc(ft)}</div>`:''}</section>`}).join('');
return `<html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>@page{size:A4 landscape;margin:7mm}*{box-sizing:border-box}body{font-family:"Segoe UI",Tahoma,Arial,sans-serif;direction:rtl;font-size:10pt;margin:0;color:#1d2733;-webkit-print-color-adjust:exact;print-color-adjust:exact}table{border-collapse:collapse;width:100%}
.h td{text-align:center;vertical-align:middle;padding:0}.hs{width:20%}.hc{width:60%}.hs.hr{text-align:right}.hs.hl{text-align:left}.hc img{display:block;margin:0 auto 2px}.q{display:inline-block;border:1.2px solid #14233a;border-radius:5px;padding:2px 10px;font-weight:700;font-size:8.8pt;line-height:1.45;color:#14233a}
.rule{height:2px;margin:5px 0 7px;border-radius:2px;background:linear-gradient(90deg,var(--c1),var(--c2))}
.t{background:var(--c1);color:#fff;border-radius:7px;padding:6px 14px;display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.t b{font-size:13pt;font-weight:800}.t span{font-size:9.5pt;opacity:.95}
.m{border:1.4px solid var(--c1);border-spacing:0;border-collapse:separate;border-radius:8px;overflow:hidden}.m thead{display:table-header-group}.m tr{page-break-inside:avoid}
.m th{background:var(--c1);color:#fff;padding:7px 5px;font-size:9.5pt;font-weight:700;text-align:center;border-inline-start:1px solid #ffffff55}.m th.d0{border-inline-start:0}
.m td{padding:4px 7px;text-align:center;vertical-align:middle;border-top:1px solid #d3d8df;border-inline-start:1px solid #d3d8df;font-size:9.5pt;line-height:1.45}.m td:first-child{border-inline-start:0}.m tr.z td{background:#f6f8fa}
.m td.d{background:var(--c2)!important;border-top-color:#fff}.dn{font-weight:800;font-size:11pt;color:var(--c1)}.dd{font-size:9.5pt;font-weight:600;margin-top:1px}.dp{display:inline-block;margin-top:3px;background:#fff;color:var(--c1);border:1px solid var(--c1);border-radius:10px;padding:0 7px;font-size:7.8pt;font-weight:700}
.cn{font-weight:700;font-size:9.8pt;color:#0f1c2e}.cm{font-size:8pt;color:#5a6676;margin-top:1px}.cl{font-size:8.6pt;font-weight:600;color:var(--c1);margin-top:2px}.sp{border-top:1px dashed #b9c1cc;margin:5px 14%}
.s{margin-top:10px}.s td{text-align:center;padding:0 10px;vertical-align:top;width:25%}.sl{font-weight:800;font-size:9.8pt;color:var(--c1)}.sn{font-size:9pt;color:#44505f;min-height:13px;margin-top:2px}.sg{border-top:1px solid #9aa5b3;margin:26px 18% 3px}.sc{font-size:7.5pt;color:#9aa5b3}.wm{position:fixed;top:50%;left:50%;width:118mm;transform:translate(-50%,-50%);opacity:.05;z-index:0}.pg{position:relative;z-index:1}
.f{margin-top:7px;border:1px solid #9aa5b3;border-radius:6px;text-align:center;font-weight:700;font-size:8.5pt;padding:3px;color:#33404f}</style></head><body><img class="wm" src="${LOGO_F}" alt="">${pages}</body></html>`}
function offXlsx(M,e){let P=prn(e),X=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),L=i=>{let t='';i++;while(i>0){let r=(i-1)%26;t=String.fromCharCode(65+r)+t;i=Math.floor((i-1)/26)}return t},enc=u=>Uint8Array.from(atob(u.split(',')[1]),c=>c.charCodeAt(0)),qt=P.qOn===false?'':(P.q||Q_TXT);
let ft=[P.formNo&&'نموذج رقم '+P.formNo,P.formIssue&&'إصدار رقم ('+P.formIssue+')',P.formDate&&'تاريخ الإصدار '+P.formDate].filter(Boolean).join('  ');
let gcd=(a,b)=>b?gcd(b,a%b):a,sheets=[],sig=offSigs(e);
M.forEach((m,si)=>{let nt=m.cols.length+1,G=nt>=8?nt:nt*Math.ceil(8/nt),w=G/nt,cw=(nt>=4?nt*(nt>8?22:34):136)/G,MG=[],R=[],lk=Math.max(1,Math.min(Math.floor(G/4),Math.ceil(15/cw)));
const RP=o=>`<rPr>${o.b?'<b/>':''}<sz val="${o.z||10}"/><color rgb="FF${o.c||'1D2733'}"/><rFont val="Tahoma"/></rPr>`;const cel=(v,c,r,s)=>`<c r="${L(c)}${r}" s="${s}" t="inlineStr"><is>${Array.isArray(v)?v.map(p=>`<r>${RP(p[1]||{})}<t xml:space="preserve">${X(p[0])}</t></r>`).join(''):`<t xml:space="preserve">${X(v)}</t>`}</is></c>`;
const span=(arr,r,st0,n)=>{let bq=q=>Math.round(q*G/n),s='',stf=typeof st0==='function'?st0:()=>st0;for(let q=0;q<n;q++){let st=stf(q),c0=bq(q),c1=bq(q+1);s+=cel(arr[q]||'',c0,r,st);for(let c=c0+1;c<c1;c++)s+=`<c r="${L(c)}${r}" s="${st}"/>`;if(c1-c0>1)MG.push(`${L(c0)}${r}:${L(c1-1)}${r}`)}return s};
const row=(r,h,cs)=>R.push(`<row r="${r}" ht="${h}" customHeight="1">${cs}</row>`);
let r=1,base=si*5;let cx=(v,st)=>span([v],r,st,1);let mid=Math.max(0,G-2*lk-lk),m0=lk,m1=Math.max(lk,G-2*lk-1);const cm=(v,st,mx)=>{let a=m0,b=m1;if(mx){let n=Math.min(m1-m0+1,Math.max(1,Math.ceil(mx/cw)));a=m0+Math.floor((m1-m0+1-n)/2);b=a+n-1}let q=cel(v,a,r,st);for(let c=a+1;c<=b;c++)q+=`<c r="${L(c)}${r}" s="${st}"/>`;if(b>a)MG.push(`${L(a)}${r}:${L(b)}${r}`);return q};
row(r,26,cm('',0));r++;
row(r,qt?Math.max(52,Math.ceil(qt.length/(60*0.9))*17+14):6,cm(qt,qt?2:0,qt?60:0));r++;
row(r,30,cx(`الجدول النهائي لطلاب المستوى ${LV[m.lv-1]}${m.bt||''} - ${e.semester} - ${e.type||''} للعام الدراسي ${e.year}`,3+m.lv-1));r++;
row(r,6,'');r++;
row(r,24,span(['اليوم / التاريخ'].concat(m.cols),r,7+m.lv-1,nt));r++;
m.rows.forEach((rw,ri)=>{let lines=Math.max(1,...rw.cells.map(a=>a.reduce((n,x)=>n+Math.ceil((x.n||x.a).length/Math.max(8,cw*w*0.8))+((x.cd||x.st)?1:0)+(x.b?Math.ceil(x.b.length/Math.max(8,cw*w*0.9)):0),0)));
let c1h=LVC[m.lv-1][0].slice(1),zb=ri%2?18:19,day=[[rw.day+'\n',{b:1,z:11,c:c1h}],[rw.date+'\n',{b:1,z:9}],[rw.per,{z:8,c:c1h,b:1}]];
let cellRich=a=>{let out=[];a.forEach((x,j)=>{if(j>0)out.push(['\n\u2500\u2500\u2500\u2500\u2500\n',{z:7,c:'B9C1CC'}]);out.push([x.n||x.a,{b:1,z:10,c:'0F1C2E'}]);let l2=[x.cd,x.st].filter(Boolean).join('  \u2022  ');if(l2)out.push(['\n'+l2,{z:8,c:'5A6676'}]);if(x.b)out.push(['\n'+x.b,{b:1,z:9,c:c1h}])});return out.length?out:''};
row(r,Math.max(50,lines*14+14),span([day].concat(rw.cells.map(cellRich)),r,q=>q===0?14+m.lv-1:zb,nt));r++});
row(r,12,'');r++;
row(r,64,span(sig.map(s=>[[s[0]+'\n',{b:1,z:10,c:'14233A'}],[(s[1]||' ')+'\n\n',{z:9,c:'44505F'}],['______________\n',{z:10,c:'9AA5B3'}],['التوقيع',{z:8,c:'9AA5B3'}]]),r,12,4));r++;
if(ft){row(r,28,span([ft],r,13,1))}
[1,2,3].forEach(k=>{});
MG.push(`A3:${L(G-1)}3`);if(ft)MG.push(`A${r}:${L(G-1)}${r}`);
let cols=Array.from({length:G},(_,i)=>`<col min="${i+1}" max="${i+1}" width="${cw.toFixed(1)}" customWidth="1"/>`).join('');
let an=(c,id,rid,cxx,cyy)=>`<xdr:oneCellAnchor><xdr:from><xdr:col>${c}</xdr:col><xdr:colOff>40000</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>20000</xdr:rowOff></xdr:from><xdr:ext cx="${cxx}" cy="${cyy}"/><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="${id}" name="i${id}"/><xdr:cNvPicPr/></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cxx}" cy="${cyy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:oneCellAnchor>`;
let drw=`<?xml version="1.0" encoding="UTF-8"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">${an(0,2,'rId1',800000,800000)}${an(G-lk,3,'rId2',800000,800000)}${an(Math.floor(G/2)-1,4,'rId3',720000,405000)}</xdr:wsDr>`;
let sh=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><sheetViews><sheetView rightToLeft="1" workbookViewId="0"/></sheetViews><cols>${cols}</cols><sheetData>${R.join('')}</sheetData><mergeCells count="${MG.length}">${MG.map(x=>`<mergeCell ref="${x}"/>`).join('')}</mergeCells><pageMargins left="0.3" right="0.3" top="0.4" bottom="0.4" header="0.2" footer="0.2"/><pageSetup paperSize="9" orientation="landscape" fitToWidth="1" fitToHeight="0"/><drawing r:id="rId1"/></worksheet>`;
sheets.push({sh,drw})});
const xf=(font,fill,border,al)=>`<xf numFmtId="0" fontId="${font}" fillId="${fill}" borderId="${border}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1" readingOrder="2"/></xf>`;
let fonts='<font><sz val="10"/><name val="Tahoma"/></font><font><b/><sz val="13"/><name val="Tahoma"/></font><font><b/><sz val="10"/><name val="Tahoma"/></font>'+LVC.map(c=>`<font><b/><sz val="12"/><color rgb="FF${c[0].slice(1)}"/><name val="Tahoma"/></font>`).join('')+'<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Tahoma"/></font><font><b/><sz val="10"/><color rgb="FF14233A"/><name val="Tahoma"/></font><font><b/><sz val="13"/><color rgb="FFFFFFFF"/><name val="Tahoma"/></font>';
let fills='<fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'+LVC.map(c=>`<fill><patternFill patternType="solid"><fgColor rgb="FF${c[0].slice(1)}"/></patternFill></fill>`).join('')+LVC.map(c=>`<fill><patternFill patternType="solid"><fgColor rgb="FF${c[1].slice(1)}"/></patternFill></fill>`).join('')+'<fill><patternFill patternType="solid"><fgColor rgb="FFF6F8FA"/></patternFill></fill>';
let borders='<border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"/><right style="thin"/><top style="thin"/><bottom style="thin"/><diagonal/></border><border><left style="medium"/><right style="medium"/><top style="medium"/><bottom style="medium"/><diagonal/></border><border><left style="thin"><color rgb="FFC9CFD8"/></left><right style="thin"><color rgb="FFC9CFD8"/></right><top style="thin"><color rgb="FFC9CFD8"/></top><bottom style="thin"><color rgb="FFC9CFD8"/></bottom><diagonal/></border>';
let xfsAdj=[xf(0,0,0),xf(1,0,0),xf(2,0,2)];for(let i=0;i<4;i++)xfsAdj.push(xf(9,2+i,0));for(let i=0;i<4;i++)xfsAdj.push(xf(7,2+i,3));xfsAdj.push(xf(0,0,3),xf(8,0,0),xf(2,0,2));for(let i=0;i<4;i++)xfsAdj.push(xf(0,6+i,3));xfsAdj.push(xf(0,10,3),xf(0,0,3));
let styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="10">${fonts}</fonts><fills count="11">${fills}</fills><borders count="4">${borders}</borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${xfsAdj.length}">${xfsAdj.join('')}</cellXfs></styleSheet>`;
let n=sheets.length,ct='<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+sheets.map((s,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/drawings/drawing${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>`).join('')+'</Types>';
let rel=t=>'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+t+'</Relationships>',RT='http://schemas.openxmlformats.org/officeDocument/2006/relationships/';
let files=[['[Content_Types].xml',ct],['_rels/.rels',rel(`<Relationship Id="rId1" Type="${RT}officeDocument" Target="xl/workbook.xml"/>`)],
['xl/workbook.xml','<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+M.map((m,i)=>`<sheet name="المستوى ${LV[m.lv-1]}${m.bn?' ('+m.bn+')':''}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets><definedNames>'+M.map((m,i)=>`<definedName name="_xlnm.Print_Titles" localSheetId="${i}">'المستوى ${LV[m.lv-1]}${m.bn?' ('+m.bn+')':''}'!$5:$5</definedName>`).join('')+'</definedNames></workbook>'],
['xl/_rels/workbook.xml.rels',rel(sheets.map((s,i)=>`<Relationship Id="rId${i+1}" Type="${RT}worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')+`<Relationship Id="rId${n+1}" Type="${RT}styles" Target="styles.xml"/>`)],['xl/styles.xml',styles],
['xl/media/u.png',enc(LOGO_U)],['xl/media/f.png',enc(LOGO_F)],['xl/media/q.jpeg',enc(LOGO_Q)]];
sheets.forEach((s,i)=>{files.push([`xl/worksheets/sheet${i+1}.xml`,s.sh],[`xl/worksheets/_rels/sheet${i+1}.xml.rels`,rel(`<Relationship Id="rId1" Type="${RT}drawing" Target="../drawings/drawing${i+1}.xml"/>`)],[`xl/drawings/drawing${i+1}.xml`,s.drw],[`xl/drawings/_rels/drawing${i+1}.xml.rels`,rel(`<Relationship Id="rId1" Type="${RT}image" Target="../media/u.png"/><Relationship Id="rId2" Type="${RT}image" Target="../media/f.png"/><Relationship Id="rId3" Type="${RT}image" Target="../media/q.jpeg"/>`)])});
return window._zip(files)}
function offDocx(M,e){let P=prn(e),X=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),enc=u=>Uint8Array.from(atob(u.split(',')[1]),c=>c.charCodeAt(0)),qt=P.qOn===false?'':(P.q||Q_TXT);
let ft=[P.formNo&&'نموذج رقم '+P.formNo,P.formIssue&&'إصدار رقم ('+P.formIssue+')',P.formDate&&'تاريخ الإصدار '+P.formDate].filter(Boolean).join('  '),sig=offSigs(e),pid=0;
const rn=(t,o)=>{o=o||{};let z=o.sz||20;return `<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/>${o.b?'<w:b/><w:bCs/>':''}${o.c?`<w:color w:val="${o.c}"/>`:''}<w:sz w:val="${z}"/><w:szCs w:val="${z}"/><w:rtl/></w:rPr><w:t xml:space="preserve">${X(t)}</w:t></w:r>`};
const bd=(c,s,sp)=>['top','left','bottom','right'].map(k=>`<w:${k} w:val="single" w:sz="${s}" w:space="${sp||3}" w:color="${c}"/>`).join('');
const pa=(r,o)=>{o=o||{};return `<w:p><w:pPr>${o.pb?'<w:pageBreakBefore/>':''}${o.box?`<w:pBdr>${bd(o.box[0],o.box[1])}</w:pBdr>`:''}${o.top?`<w:pBdr><w:top w:val="single" w:sz="4" w:space="2" w:color="A6ADB8"/></w:pBdr>`:''}<w:bidi/><w:spacing w:before="${o.sb||0}" w:after="${o.sa||0}"/><w:jc w:val="center"/></w:pPr>${r}</w:p>`};
const im=(rid,cx,cy)=>{pid++;return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="36000" distR="36000"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${pid}" name="img${pid}"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${pid}" name="img${pid}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`};
const tc=(w,c,o)=>{o=o||{};return `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${o.bd?`<w:tcBorders>${['top','left','bottom','right'].map(k=>`<w:${k} w:val="single" w:sz="4" w:space="0" w:color="D3D8DF"/>`).join('')}</w:tcBorders>`:''}${o.sh?`<w:shd w:val="clear" w:color="auto" w:fill="${o.sh}"/>`:''}<w:vAlign w:val="center"/></w:tcPr>${c||pa('')}</w:tc>`};
const tr=(cs,o)=>`<w:tr><w:trPr><w:cantSplit/>${o&&o.h?'<w:tblHeader/>':''}</w:trPr>${cs}</w:tr>`;
const tb=(ws,rows,bc)=>`<w:tbl><w:tblPr><w:bidiVisual/><w:tblW w:w="${ws.reduce((a,b)=>a+b,0)}" w:type="dxa"/><w:jc w:val="center"/><w:tblBorders>${['top','left','bottom','right','insideH','insideV'].map(k=>`<w:${k} w:val="${bc?'single':'nil'}" w:sz="8" w:space="0" w:color="${bc||'auto'}"/>`).join('')}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="70" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="70" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${ws.map(w=>`<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${rows}</w:tbl>`;
let WMR='<w:r><w:pict><v:shapetype id="_x0000_t75" coordsize="21600,21600" o:spt="75" o:preferrelative="t" path="m@4@5l@4@11@9@11@9@5xe" filled="f" stroked="f"><v:stroke joinstyle="miter"/><v:path o:extrusionok="f" gradientshapeok="t" o:connecttype="rect"/><o:lock v:ext="edit" aspectratio="t"/></v:shapetype><v:shape id="wm1" o:spid="_x0000_s2049" type="#_x0000_t75" style="position:absolute;margin-left:0;margin-top:0;width:340pt;height:440pt;z-index:-251654144;mso-position-horizontal:center;mso-position-horizontal-relative:page;mso-position-vertical:center;mso-position-vertical-relative:page" o:allowincell="f"><v:imagedata r:id="rId4" o:title=""/></v:shape></w:pict></w:r>'; let body=M.map((m,i)=>{let [c1,c2]=LVC[m.lv-1].map(x=>x.slice(1)),n=m.cols.length,FS=n>10?13:n>6?15:18,W=15600,fw=2100,cw=Math.floor((W-fw)/n),ws=[fw].concat(m.cols.map(()=>cw));
let hd=tb([3800,8000,3800],tr(tc(3800,pa(im('rId1',520000,650000)))+tc(8000,qt?pa(im('rId3',800000,451000),{sa:20})+pa(rn(qt,{b:1,sz:19}),{box:['14233A',8],sb:30,sa:30}):pa(rn(' ',{sz:8})))+tc(3800,pa(im('rId2',500000,647000)))));
let ti=tb([15600],tr(tc(15600,pa(rn(`الجدول النهائي لطلاب المستوى ${LV[m.lv-1]}${m.bt||''} - ${e.semester} - ${e.type||''} للعام الدراسي ${e.year}`,{b:1,sz:26,c:'FFFFFF'}),{sb:60,sa:60}),{sh:c1})))+pa(rn('',{sz:8}),{sa:0});
let h=tr(tc(fw,pa(WMR+rn('اليوم / التاريخ',{b:1,sz:20,c:'FFFFFF'})),{sh:c1,bd:1})+m.cols.map(nm=>tc(cw,pa(rn(nm,{b:1,sz:20,c:'FFFFFF'})),{sh:c1,bd:1})).join(''),{h:1});
let rows=m.rows.map((r,ri)=>{let zb=ri%2?'F6F8FA':'FFFFFF';return tr(tc(fw,pa(rn(r.day,{b:1,sz:22,c:c1}))+pa(rn(r.date,{b:1,sz:18,c:'1D2733'}))+pa(rn(r.per,{b:1,sz:15,c:c1})),{sh:c2,bd:1})+r.cells.map(a=>tc(cw,a.length?a.map((x,j)=>pa(rn(x.n||x.a,{b:1,sz:FS,c:'0F1C2E'}),{top:j>0,sb:j>0?50:0})+((x.cd||x.st)?pa(rn([x.cd,x.st].filter(Boolean).join('  \u2022  '),{sz:Math.max(14,FS-4),c:'5A6676'})):'')+(x.b?pa(rn(x.b,{b:1,sz:Math.max(14,FS-2),c:c1})):'')).join(''):pa(''),{bd:1,sh:zb})).join(''))}).join('');
let sg=tb([3900,3900,3900,3900],tr(sig.map(s=>tc(3900,pa(rn(s[0],{b:1,sz:20,c:c1}),{sb:120})+pa(rn(s[1]||' ',{sz:18,c:'44505F'}),{sb:40,sa:260})+pa(rn('',{sz:10}),{top:1})+pa(rn('التوقيع',{sz:12,c:'9AA5B3'}),{sb:10}))).join('')));
return pa('',{pb:i>0,sa:0})+hd+ti+tb(ws,h+rows,'D3D8DF')+sg+(ft?pa(rn(ft,{b:1,sz:22}),{box:['000000',12],sb:120}):'')}).join('');
let doc=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><w:body>${body}<w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="567" w:right="567" w:bottom="567" w:left="567" w:header="300" w:footer="300" w:gutter="0"/><w:bidi/></w:sectPr></w:body></w:document>`;
let RT='http://schemas.openxmlformats.org/officeDocument/2006/relationships/',rel=t=>'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+t+'</Relationships>';
return window._zip([['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],['_rels/.rels',rel(`<Relationship Id="rId1" Type="${RT}officeDocument" Target="word/document.xml"/>`)],['word/document.xml',doc],['word/_rels/document.xml.rels',rel(`<Relationship Id="rId1" Type="${RT}image" Target="media/u.png"/><Relationship Id="rId2" Type="${RT}image" Target="media/f.png"/><Relationship Id="rId3" Type="${RT}image" Target="media/q.jpeg"/><Relationship Id="rId4" Type="${RT}image" Target="media/wm.png"/>`)],['word/media/u.png',enc(LOGO_U)],['word/media/f.png',enc(LOGO_F)],['word/media/q.jpeg',enc(LOGO_Q)],['word/media/wm.png',enc(LOGO_WM)]])}
const _oe=exportPub;
exportPub=function(kind){let e=active();if(!e)return;let M=offModel();if(!M.length)return toast('لا توجد مقررات بمواعيد للتصدير',true);
if(kind==='xls'){dl('exam-schedule.xlsx',offXlsx(M,e));return log('تصدير الجدول الرسمي xlsx')}
if(kind==='doc'){dl('exam-schedule.docx',offDocx(M,e));return log('تصدير الجدول الرسمي Word')}
return _oe(kind)};
printPub=function(){let e=active();if(!e)return;let M=offModel();if(!M.length)return toast('لا توجد مقررات بمواعيد للطباعة',true);let f=document.createElement('iframe');f.style.cssText='position:fixed;right:-9999px;width:1200px;height:800px';document.body.appendChild(f);f.srcdoc=offHtml(M,e);f.onload=()=>{setTimeout(()=>{f.contentWindow.focus();f.contentWindow.print();setTimeout(()=>f.remove(),2000)},400)};log('طباعة الجدول الرسمي')};
const _pp=published;published=function(){let h=_pp();if(typeof h!=='string')return h;let e=active();if(!e)return h;let P=prn(e),N=P.names||[];
let f=(k,l,v,ph)=>`<div class="field"><label>${l}</label><input value="${esc(v||'')}" placeholder="${ph||''}" onchange="prSet('${k}',this.value)"></div>`;
let panel=`<details class="panel" style="margin-top:14px"><summary><b>بيانات الطباعة الرسمية</b> (اختيارية، تُحفظ مع الإصدار)</summary><p class="muted">نص الجودة منقول من الجدول المرجعي ويمكن تعديله أو إلغاؤه، ولا تتحقق المنصة من صلاحية الاعتماد. رقم النموذج والإصدار والتاريخ والأسماء تبقى فارغة حتى تُدخلها أنت.</p><label class="check"><input type="checkbox" ${P.qOn===false?'':'checked'} onchange="prSet('qOn',this.checked)"> إظهار نص الجودة وشعارات الاعتماد</label><div class="formgrid">${f('q','نص الجودة',P.q||Q_TXT)}${f('formNo','نموذج رقم',P.formNo)}${f('formIssue','إصدار رقم',P.formIssue)}${f('formDate','تاريخ الإصدار',P.formDate)}${['المختص','مدير شئون الطلاب','وكيل الكلية','عميد الكلية'].map((n,i)=>f('n'+i,'اسم '+n,N[i])).join('')}</div></details>`;
return h.replace('onclick="window.print()"','onclick="printPub()"')+panel};
function prSet(k,v){let e=active(),P=prn(e);if(/^n\d$/.test(k)){P.names=P.names||['','','',''];P.names[+k[1]]=v}else P[k]=v;save()}
function genRun(e,keys){let P=programs(),used=[],res={props:[],left:[]},dayOf=s=>String(s).split('|')[0],dn=d=>Math.round(new Date(d+'T12:00:00').getTime()/864e5);
Object.entries(e.tasks||{}).forEach(([k,t])=>{let p=P.find(x=>x.key===k);if(p)(t.courses||[]).filter(c=>c.slot).forEach(c=>used.push({level:p.level,slot:c.slot,k,code:c.code}))});
keys.forEach(k=>{let p=P.find(x=>x.key===k);if(!p)return;let t=e.tasks[k]||{courses:[],status:'مسودة'};
if(isLocked(t)){res.left.push({k,pn:p.name,code:'',name:'كل المقررات',why:'الجدول مُرسل أو معتمد ولا يُعدَّل'});return}
let slots=levelSlots(e,p.level);if(!slots.length){res.left.push({k,pn:p.name,code:'',name:'كل المقررات',why:'لم تُحدَّد أيام وفترات لهذا المستوى'});return}
planItems(e,k).forEach(it=>{
if(it.elective){if(!it.courses.some(c=>{let x=planEntry(t,c.code);return x&&x.slot}))res.left.push({k,pn:p.name,code:'',name:it.title,why:'مجموعة اختيارية: اختر المقرر يدويًا'});return}
let c=it.courses[0];if(c.pass)return;let x=planEntry(t,c.code);if(x&&x.slot)return;
let mine=used.filter(u=>u.k===k).map(u=>dayOf(u.slot));
let cand=slots.filter(s=>!mine.includes(dayOf(s.key))&&!used.some(u=>u.level!==p.level&&u.slot===s.key)&&!used.some(u=>u.level===p.level&&dayOf(u.slot)===dayOf(s.key)&&u.slot!==s.key));
if(!cand.length){res.left.push({k,pn:p.name,code:c.code,name:c.name,why:'لا يوجد موعد يحقق: مقرر واحد للمستوى في اليوم، ومستوى واحد في الفترة'});return}
let best=cand[0];
used.push({level:p.level,slot:best.key,k,code:c.code});res.props.push({k,pn:p.name,code:c.code,name:c.name,slot:best.key,label:best.label})})});
return res}
function genKeysFor(scope){let e=active();return programs().filter(p=>scope==='all'?true:p.key===scope).map(p=>p.key).filter(k=>me.role==='admin'||e.assign[k]===me.id)}
let _gp=null;
function genPreview(scope){let e=active();if(!e)return;let keys=genKeysFor(scope);if(!keys.length)return toast('غير مصرح',true);_gp=genRun(e,keys);_gp.keys=keys;
let r=_gp,rows=r.props.map(x=>`<tr><td>${esc(x.pn)}</td><td>${esc(x.code)}</td><td>${esc(x.name)}</td><td>${esc(x.label)}</td></tr>`).join(''),lf=r.left.map(x=>`<tr><td>${esc(x.pn)}</td><td>${esc(x.code)}</td><td>${esc(x.name)}</td><td>${esc(x.why)}</td></tr>`).join('');
modal('اقتراح مواعيد تلقائي',`<div class="notice">يقترح المواعيد للمقررات الإجبارية غير المجدولة فقط. لا يغيّر أي مقرر محدد مسبقًا ولا يلمس الجداول المُرسلة أو المعتمدة، ولا يضع للمستوى أكثر من موعد (فترة) واحد في اليوم، ولا مقررين في يوم واحد لنفس البرنامج، ولا يستخدم فترة محجوزة لمستوى آخر. يختار أول موعد متاح دون أي تباعد مفروض. تنبيه: هذه قراءة متحفظة لقاعدة «مقرر واحد للمستوى في اليوم» (موعد واحد للمستوى في اليوم عبر كل برامجه)، وقد تترك مقررات قابلة للجدولة بدون موعد، وستظهر في قائمة «يحتاج قرارًا يدويًا». الإدخال اليدوي لا يتقيد بهذه القراءة. الطلاب والخطة لا تتغير. راجع ثم اضغط تطبيق.</div><h4>مقترح (${r.props.length})</h4><div class="tablewrap" style="max-height:34vh;overflow:auto"><table><tr><th>البرنامج</th><th>الكود</th><th>المقرر</th><th>الموعد</th></tr>${rows||'<tr><td colspan="4">لا يوجد ما يُقترح</td></tr>'}</table></div>${r.left.length?`<h4>يحتاج قرارًا يدويًا (${r.left.length})</h4><div class="tablewrap" style="max-height:34vh;overflow:auto"><table><tr><th>البرنامج</th><th>الكود</th><th>المقرر</th><th>السبب</th></tr>${lf}</table></div>`:''}`,r.props.length?`<button onclick="genApply()">تطبيق الاقتراح</button>`:'')}
function genApply(){let e=active(),r=_gp;if(!e||!r)return;let items=[];r.props.forEach(x=>{let t=e.tasks[x.k]||(e.tasks[x.k]={courses:[],status:'مسودة',note:''});if(t&&isLocked(t))return;if(t&&planEntry(t,x.code)&&planEntry(t,x.code).slot)return;setCourseSlot(x.k,x.code,x.slot);let en=e.tasks[x.k]&&planEntry(e.tasks[x.k],x.code);if(en&&en.slot===x.slot)items.push({k:x.k,code:x.code,slot:x.slot})});
e.genLast={at:new Date().toLocaleString('ar-EG'),by:me.name,items};save();log('تطبيق اقتراح المواعيد التلقائي: '+items.length+' مقرر');closeModal();render();toast('تم تطبيق '+items.length+' موعد')}
function genUndo(){let e=active();if(!e||!e.genLast)return;let n=0;e.genLast.items.forEach(x=>{let t=e.tasks[x.k];if(!t||isLocked(t)||!(me.role==='admin'||e.assign[x.k]===me.id))return;let en=planEntry(t,x.code);if(en&&en.slot===x.slot){setCourseSlot(x.k,x.code,'');n++}});e.genLast=null;save();log('تراجع عن اقتراح المواعيد التلقائي: '+n);render();toast('تم التراجع عن '+n+' موعد (المعدّل يدويًا بعد التطبيق لم يُلمس)')}
document.head.insertAdjacentHTML('beforeend','<style>.modal .actions{position:sticky;bottom:-22px;background:#fff;padding:10px 0 2px;z-index:2}</style>');
const _te5=taskEditor;taskEditor=function(e,k){let h=_te5(e,k);if(typeof h!=='string')return h;let t=e.tasks[k]||{courses:[]};if(isLocked(t))return h;
return h.replace('<div class="actions"><button class="light" onclick="saveTask','<div class="actions"><button class="light" onclick="genPreview(\''+esc(k)+'\')">اقتراح مواعيد تلقائي</button>'+(e.genLast&&e.genLast.items.some(x=>x.k===k)?'<button class="light" onclick="genUndo()">تراجع عن آخر اقتراح</button>':'')+'<button class="light" onclick="saveTask')};
const _tr5=tracking;tracking=function(){let h=_tr5();if(typeof h!=='string'||me.role!=='admin')return h;let e=active();return h+`<section class="panel" style="margin-top:14px"><h3>اقتراح المواعيد تلقائيًا</h3><p class="muted">للمقررات الإجبارية غير المجدولة في كل البرامج غير المُرسلة. لا يغيّر ما حددته يدويًا.</p><div class="actions"><button onclick="genPreview('all')">اقتراح لكل البرامج</button>${e&&e.genLast?'<button class="light" onclick="genUndo()">تراجع عن آخر اقتراح</button>':''}</div></section>`};
(function(){
const names=['addCourse','removeCourse','allocSave','allocDrop','allocEdit','allocCourses','allocStaff','allocCsv','genApply','genUndo','moveItem','applyOrder','clearDist','reviewAction','saveAssign','saveDays','saveDetails','saveDistribution','saveTask','setCourseExtra','setCourseSlot','setCourseStudents','setDue','setDueAll','submitTask','addHoliday','delHoliday','addPeriod','delPeriod','addRoom','delRoom','applyDays'];
names.forEach(n=>{let f;try{f=eval('typeof '+n+"==='function'?"+n+':null')}catch(x){}
if(!f)return;
const w=function(){let e=null;try{e=active()}catch(x){}
if(e&&e.archived){try{toast('هذا الإصدار مؤرشف وللعرض فقط. لا يمكن تعديله.',true)}catch(x){}return}
return f.apply(this,arguments)};
try{eval(n+'=w')}catch(x){}
});
})();
const SAMPLE_LECT=['د. أحمد محمود','د. منى عبد الله','أ.د. خالد إبراهيم','د. هبة سعيد','د. محمد عادل','أ.د. سامية فوزي'];
function sampleFill(e,k,all,status){let slots=levelSlots(e,+k[0]),n=0,now=new Date().toLocaleString('ar-EG');let t=e.tasks[k]={courses:[],status,note:'',updated:now,sent:status==='قيد الإعداد'?'':now};
planItems(e,k).forEach(it=>{let c=it.courses.find(x=>!x.pass),sl=slots[n];if(!c||!sl||(!all&&n>=3))return;n++;t.courses.push({code:c.code,name:c.name,gid:it.gid,students:40+n*7,slot:sl.key,label:sl.label,lect:SAMPLE_LECT[(n+k.length)%SAMPLE_LECT.length],carry:n%4===0?3+n:0})})}
async function loadSample(){
if(!db)return;
if(!confirm('تحميل البيانات التجريبية الكاملة؟\nسيحلّ إصدار تجريبي يضم كل برامج الكلية محل الإصدارات الحالية في هذا المتصفح فقط. تُحفظ نسخة من بياناتك الحالية تلقائيًا قبل الاستبدال.'))return;
try{localStorage.setItem('sohag_exam_demo_before_sample',JSON.stringify({at:new Date().toLocaleString('ar-EG'),db}))}catch(x){}
const pw=await hash('1234');
[['s1','sp1','أ. مختص الكيمياء','specialist'],['s2','sp2','أ. مختص الفيزياء','specialist'],['r1','rev','د. المراجع','reviewer'],['v1','view','مشاهد','viewer']].forEach(([i,u,n,r])=>{if(!db.users.some(x=>x.username===u))db.users.push({id:i,username:u,password:pw,name:n,role:r,active:true})});
const sp=db.users.filter(u=>u.role==='specialist'&&u.active).map(u=>u.id);
let p1=id(),p2=id();
let e={id:id(),name:'امتحانات الفصل الدراسي الأول (بيانات تجريبية كاملة)',year:`${startYear()}–${startYear()+1}`,semester:'الفصل الدراسي الأول',type:'الامتحانات النهائية',start:today(),archived:false,
periods:[{id:p1,name:'الفترة الأولى',from:'09:00',to:'11:00'},{id:p2,name:'الفترة الثانية',from:'12:00',to:'14:00'}],days:[0,1,2,3,4],holidays:[],
levelPlans:{1:{days:[0,2],periods:[p1]},2:{days:[0,2],periods:[p2]},3:{days:[1,3],periods:[p1]},4:{days:[1,3],periods:[p2]}},assign:{},tasks:{}};
db.editions=[e];db.active=e.id;draftEdition=null;delete db.draftEdition;
db.rooms=[['مدرج (1)',300],['مدرج (2)',250],['قاعة 101',80],['قاعة 102',80],['قاعة 201',60],['معمل الحاسب',40]].map(([n,c])=>({id:id(),name:n,cap:c}));
programs().forEach((p,i)=>{e.assign[p.key]=sp[i%sp.length];sampleFill(e,p.key,i%5!==0,i%5===0?'قيد الإعداد':(i%5===1?'مرسل للمراجعة':'معتمد'))});
db.demoSeeded=true;
save();
if(typeof me!=='undefined'&&me){try{log('تحميل البيانات التجريبية الكاملة')}catch(x){}try{render()}catch(x){}}
try{toast('تم تحميل البيانات التجريبية الكاملة. سجّل الدخول بحساب admin أو view لتجربتها.')}catch(x){}
}
(function(){
const mk=()=>{let b=document.createElement('button');b.type='button';b.id='loadSampleBtn';b.style.cssText='margin-top:10px;width:100%;background:#fff;color:#0b4a52;border:2px solid #118a86;border-radius:12px;padding:12px;font-weight:700;cursor:pointer;box-shadow:none';b.textContent='تحميل البيانات التجريبية الكاملة (كل برامج الكلية)';b.onclick=loadSample;return b};
const put=()=>{let L=document.getElementById('login');if(!L||document.getElementById('loadSampleBtn'))return;let w=document.createTreeWalker(L,NodeFilter.SHOW_TEXT),n,t=null;while(n=w.nextNode()){if(n.nodeValue.includes('حسابات تجريبية: اضغط')){t=n.parentElement;break}}
if(t){t.insertAdjacentElement('afterend',mk());let h=document.createElement('small');h.id='loadSampleHint';h.style.cssText='display:block;margin-top:6px;opacity:.75';h.textContent='يملأ المنصة بإصدار كامل لتجربتها فورًا. البيانات تُحفظ في متصفحك فقط.';document.getElementById('loadSampleBtn').insertAdjacentElement('afterend',h)}};
put();document.addEventListener('DOMContentLoaded',put);setTimeout(put,500);
const _r6=rooms;rooms=function(){return _r6()+`<section class="panel"><h2>البيانات التجريبية</h2><p class="muted">يحمّل إصدارًا تجريبيًا كاملًا لكل برامج الكلية. تُحفظ نسخة من الوضع الحالي قبل الاستبدال.</p><div class="actions"><button onclick="loadSample()">تحميل البيانات التجريبية الكاملة</button></div></section>`};
})();
(function(){
const D=document,body=D.body;
const side=()=>D.getElementById('side');
function setOpen(o){let s=side();if(!s)return;s.classList.toggle('open',o);body.classList.toggle('side-open',o);D.querySelectorAll('.mobile').forEach(b=>b.setAttribute('aria-expanded',o?'true':'false'));s.setAttribute('aria-hidden',o||innerWidth>900?'false':'true')}
window.toggleSide=function(){setOpen(!side().classList.contains('open'))};
window.closeSide=function(){setOpen(false)};
function build(){let s=side();if(!s)return;
if(!D.getElementById('sideBackdrop')){let b=D.createElement('div');b.id='sideBackdrop';b.className='side-backdrop';b.onclick=closeSide;(D.getElementById('app')||D.body).insertBefore(b,s)}
if(!s.querySelector('.side-close')){let c=D.createElement('button');c.type='button';c.className='side-close';c.setAttribute('aria-label','إغلاق القائمة');c.textContent='✕';c.onclick=closeSide;s.appendChild(c)}
D.querySelectorAll('.mobile').forEach(b=>{b.setAttribute('aria-label','فتح القائمة');b.setAttribute('aria-controls','side');b.setAttribute('aria-expanded','false')});
let top=D.querySelector('.top');if(top&&!D.getElementById('themeBtn')){let t=D.createElement('button');t.type='button';t.id='themeBtn';t.className='light';t.onclick=()=>setTheme(cur()==='dark'?'light':'dark');let anchor=top.querySelector(':scope>button.light');top.insertBefore(t,anchor||null);}
paint()}
const cur=()=>D.documentElement.dataset.theme==='dark'?'dark':'light';
function paint(){let d=cur()==='dark';[D.getElementById('themeBtn'),D.getElementById('loginTheme')].forEach(b=>{if(!b)return;b.textContent=d?'☀':'☾';b.title=d?'الوضع الفاتح':'الوضع الداكن';b.setAttribute('aria-label',d?'التبديل إلى الوضع الفاتح':'التبديل إلى الوضع الداكن');b.setAttribute('aria-pressed',d?'true':'false')});
let m=D.querySelector('meta[name=theme-color]');if(m)m.content=d?'#0b0b0b':'#0b2540'}
window.setTheme=function(m){D.documentElement.dataset.theme=m==='dark'?'dark':'light';try{localStorage.setItem('sohag_theme',m==='dark'?'dark':'light')}catch(x){}paint()};
let saved=null;try{saved=localStorage.getItem('sohag_theme')}catch(x){}
if(!saved&&matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)saved='dark';
D.documentElement.dataset.theme=saved==='dark'?'dark':'light';
if(!D.getElementById('loginTheme')){let l=D.createElement('button');l.type='button';l.id='loginTheme';l.onclick=()=>setTheme(cur()==='dark'?'light':'dark');D.body.appendChild(l)}
const hideLT=()=>{let l=D.getElementById('loginTheme'),lg=D.getElementById('login');if(l&&lg)l.style.display=lg.classList.contains('hidden')?'none':''};
const _r7=render;render=function(){let r=_r7.apply(this,arguments);build();closeSide();hideLT();return r};
const _lg=login;login=function(){let r=_lg.apply(this,arguments);setTimeout(()=>{build();hideLT()},900);return r};
D.addEventListener('keydown',e=>{if(e.key==='Escape')closeSide()});
addEventListener('resize',()=>{if(innerWidth>900)closeSide()});
let tx=null;D.addEventListener('touchstart',e=>{tx={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});
D.addEventListener('touchend',e=>{if(!tx||innerWidth>900)return;let dx=e.changedTouches[0].clientX-tx.x,dy=Math.abs(e.changedTouches[0].clientY-tx.y);let open=side()&&side().classList.contains('open');
if(Math.abs(dx)>60&&dy<50){if(open&&dx>0)closeSide();else if(!open&&dx<0&&tx.x>innerWidth-24&&D.getElementById('app')&&!D.getElementById('app').classList.contains('hidden'))setOpen(true)}tx=null},{passive:true});
D.addEventListener('DOMContentLoaded',()=>{paint();hideLT()});paint();hideLT();
})();
(function(){const D=document;
const ICONS={dashboard:'◼',setup:'⚙',assign:'⇄',tracking:'◎',review:'✔',published:'▦',users:'●',rooms:'▤',logs:'☰',tasks:'☐',observers:'◉',roadmap:'✦'};
const MAXTABS=99; // 21:57 Mohamed: no hidden المزيد — all nav items visible, wrapping allowed
function counts(){let e=active&&active(),c={review:0,tracking:0,tasks:0};
if(!e||!me)return c;
Object.keys(e.assign||{}).forEach(k=>{let t=e.tasks[k]||{status:'مسودة'};
if(t.status==='مرسل للمراجعة'&&can('approve'))c.review++;
if(typeof isLate==='function'&&isLate(t))c.tracking++;
if(e.assign[k]===me.id&&['مسودة','قيد الإعداد','يحتاج تعديل'].includes(t.status))c.tasks++});
return c}
function badgeFor(k,c){let n=c[k]||0;return n?`<span class="tbadge">${n}</span>`:''}
function buildTabs(){let nav=D.getElementById('nav'),top=D.querySelector('.top');if(!nav||!top)return;if(!nav._home)nav._home=nav.parentElement;
if(innerWidth>900){if(nav.parentElement.id!=='topbarTabs'){let tb=D.getElementById('topbarTabs');if(!tb){tb=D.createElement('div');tb.id='topbarTabs';top.appendChild(tb)}tb.appendChild(nav)}}
else{if(nav._home&&nav.parentElement!==nav._home)nav._home.appendChild(nav);return}
let btns=[...nav.querySelectorAll('button')];if(!btns.length)return;
let c=counts();
btns.forEach((b,i)=>{b.style.display=i<MAXTABS?'':'none';
let key=keyOf(b);let old=b.querySelector('.tbadge');if(old)old.remove();
let bd=badgeFor(key,c);if(i<MAXTABS&&bd)b.insertAdjacentHTML('beforeend',bd)});
let mw=D.getElementById('tabMoreWrap');
if(btns.length>MAXTABS){if(!mw){mw=D.createElement('div');mw.id='tabMoreWrap';mw.innerHTML=`<button type="button" id="tabMoreBtn">المزيد ▾</button><div id="tabMoreMenu" hidden></div>`;nav.parentElement.appendChild(mw);
mw.querySelector('#tabMoreBtn').onclick=ev=>{ev.stopPropagation();let m2=mw.querySelector('#tabMoreMenu');m2.hidden=!m2.hidden};
D.addEventListener('click',()=>{let m2=mw.querySelector('#tabMoreMenu');if(m2)m2.hidden=true})}
let menu=mw.querySelector('#tabMoreMenu');menu.innerHTML=btns.slice(MAXTABS).map(b=>{let key=keyOf(b);return `<button type="button" data-go="${key}" class="${b.classList.contains('active')?'active':''}">${ICONS[key]||'\u2022'}\uFE0E ${b.textContent.trim()} ${badgeFor(key,c)}</button>`}).join('');
menu.querySelectorAll('button').forEach(x=>x.onclick=()=>{menu.hidden=true;go(x.dataset.go)});
mw.style.display=''}
else if(mw)mw.style.display='none';
hl()}
function keyOf(b){let oc=b.getAttribute('onclick')||'';let m=/go\('([^']+)'\)/.exec(oc);return m?m[1]:''}
function hl(){let nav=D.getElementById('nav');if(!nav||nav.parentElement.id!=='topbarTabs')return;
let tb=nav.parentElement,el=tb.querySelector('.tab-hl');
if(!el){el=D.createElement('div');el.className='tab-hl';tb.prepend(el)}
let a=nav.querySelector('button.active')||[...nav.querySelectorAll('button')].find(b=>b.style.display!=='none');
if(!a){el.style.width='0';return}
el.style.width=a.offsetWidth+'px';el.style.height=a.offsetHeight+'px';el.style.top=a.offsetTop+'px';el.style.bottom='auto';el.style.transform=`translateX(${a.offsetLeft}px)`}
function buildBrand(){let top=D.querySelector('.top');if(!top||D.getElementById('topBrand'))return;
let first=top.firstElementChild;if(!first)return;
let b=D.createElement('div');b.id='topBrand';b.innerHTML=`<img data-lg alt=""><div>إدارة جداول الامتحانات<small>كلية العلوم – جامعة سوهاج</small></div>`;
first.prepend(b);
let img=b.querySelector('img');if(typeof LOGO_U!=='undefined')img.src=LOGO_U;
let ed=D.getElementById('editionlabel');if(ed)first.appendChild(ed);
let bd=top.querySelector('.badge.amber');if(bd&&bd.parentElement===first)bd.remove()}
function buildAvatar(){let top=D.querySelector('.top');if(!top||!me)return;
let ex=D.getElementById('avWrap');
if(ex){let b=ex.querySelector('.avx');if(b)b.textContent=(me.name||'م').trim()[0]||'م';let n=ex.querySelector('.avn');if(n)n.textContent=me.name||'';let r=ex.querySelector('.avr');if(r)r.textContent=roleName(me.role);return}
let w=D.createElement('div');w.id='avWrap';
w.innerHTML=`<button type="button" id="avBtn"><span class="avx">${esc((me.name||'م').trim()[0]||'م')}</span><span><span class="avn">${esc(me.name||'')}</span><br><span class="avr">${esc(roleName(me.role))}</span></span></button>
<div id="avMenu" hidden><button type="button" onclick="changePassword()">تغيير كلمة المرور</button><button type="button" onclick="backup()">تصدير نسخة احتياطية</button><button type="button" onclick="logout()">تسجيل الخروج</button></div>`;
top.appendChild(w);
w.querySelector('#avBtn').onclick=ev=>{ev.stopPropagation();let m=w.querySelector('#avMenu');m.hidden=!m.hidden};
D.addEventListener('click',()=>{let m=w.querySelector('#avMenu');if(m)m.hidden=true})}
function courseName(code){try{for(let p of programs()){let c=(p.courses||[]).find(x=>x.code===code);if(c)return c.name}}catch(e){}return code}
function nextExam(){let e=active&&active();if(!e)return null;let today=tdy(),best=null;
Object.entries(e.tasks||{}).forEach(([k,t])=>{if(!['معتمد','منشور'].includes(t.status))return;
(t.courses||[]).forEach(c=>{if(!c.slot)return;let[d,pid]=String(c.slot).split('|');if(!d||d<today)return;
if(!best||d<best.d||(d===best.d&&String(pid)<String(best.pid)))best={d,pid,c,k}})});
if(!best)return null;
let per=(e.periods||[]).find(p=>String(p.id)===String(best.pid));
let pname=best.k.split('|').slice(1).join('|');
let lv=LV&&LV[+best.k[0]-1]||best.k[0];
return{n:best.c.name||best.c.code,code:best.c.code,d:best.d,per:per?((per.name||'')+(per.from?` • ${per.from}–${per.to||''}`:'')):'',pname,lv}}
function heroNext(){let nx=nextExam();
if(!nx)return `<div class="nx"><div class="nx-cap">الامتحان القادم</div><div class="nx-name">لا توجد مواعيد قادمة بعد</div><div class="nx-meta">اعتمد الجداول لتظهر أقرب موعد هنا</div></div>`;
let dd=new Date(nx.d+'T12:00:00');
let ds=dd.toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long'});
return `<div class="nx"><div class="nx-cap">الامتحان القادم</div><div class="nx-name">${esc(nx.n)}</div><div class="nx-meta">${esc(nx.pname)} • المستوى ${esc(String(nx.lv))}${nx.per?' • '+esc(nx.per):''}</div><span class="nx-date">${ds}</span></div>`}
const _dash6=dashboard;
dashboard=function(){let h=_dash6();
if(page!=='dashboard')return h;
let n=(typeof notices==='function'?notices():[]).slice(0,6);
let rows=n.map(([a,b])=>{let rev=/مراجعة/.test(a),late=/تجاوز|متأخر/.test(a);
let cls=late?'redtag':rev?'amber':'blue';
let target=rev?'review':(can('tracking')?'tracking':'tasks');
let act=rev?'مراجعة':'عرض';
return `<div class="arow"><span class="badge ${cls}">${esc(a)}</span><span class="ti"><b>${esc(b)}</b></span><button type="button" class="sm light" onclick="go('${target}')">${act}</button></div>`}).join('');
let panel=`<section class="panel atn"><h2>يحتاج انتباهك</h2>${rows||'<div class="empty">لا توجد عناصر معلّقة. كل شيء على ما يرام.</div>'}</section>`;
let i=h.indexOf('<div class="cols">');
h= h.replace('<div class="ringwrap>', '<div class="ringwrap>');
if(i>-1)h=h.slice(0,i)+panel+h.slice(i);else h+=panel;
return h};
function buildClock(){let top=D.querySelector('.top');if(!top||D.getElementById('clock'))return;
let c=D.createElement('div');c.id='clock';c.innerHTML='<b id="clkT"></b><small id="clkD"></small>';
let av=D.getElementById('avWrap');top.insertBefore(c,av||null);
let tick=()=>{let n=new Date(),t=D.getElementById('clkT'),d=D.getElementById('clkD');if(!t)return;
t.textContent=n.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'});
if(d)d.textContent=n.toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long',year:'numeric'})};
tick();setInterval(tick,1000)}
function nStore(){if(typeof db==='undefined'||!db)return[];if(!db.notifs)db.notifs=[];return db.notifs}
function nPush(o){if(typeof db==='undefined'||!db||!me)return;db.notifs=nStore();db.notifs.unshift(Object.assign({id:Math.random().toString(36).slice(2),by:me.id,at:new Date().toISOString(),read:[]},o));db.notifs=db.notifs.slice(0,60);save()}
function nFromLog(a){let e=typeof active==='function'?active():null;if(!e||!me)return;let m,pn=typeof progName==='function'?progName:x=>x;
if(m=/^إرسال جدول (.+)$/.exec(a))nPush({type:'review',t:'جدول بانتظار المراجعة',b:`أرسل ${me.name} جدول ${pn(m[1])} للمراجعة والاعتماد`,go:'review',roles:['admin','reviewer']});
else if(m=/^معتمد (.+)$/.exec(a))nPush({type:'ok',t:'تم اعتماد الجدول',b:`اعتُمد جدول ${pn(m[1])} وأصبح جاهزًا للتجميع`,go:'tasks',user:(e.assign||{})[m[1]]});
else if(m=/^يحتاج تعديل (.+)$/.exec(a)){let nt=(e.tasks||{})[m[1]];nPush({type:'warn',t:'أُعيد الجدول للتعديل',b:`${pn(m[1])}${nt&&nt.note?': '+nt.note:''}`,go:'tasks',user:(e.assign||{})[m[1]]})}
else if(m=/^إنشاء إصدار (.+)$/.exec(a))nPush({type:'info',t:'إصدار جديد',b:`أنشأ ${me.name} ${m[1]}`,go:'setup',roles:['admin','specialist','reviewer','viewer']});
else if(m=/^أرشفة إصدار (.+)$/.exec(a))nPush({type:'info',t:'أرشفة إصدار',b:`أُرشف ${m[1]} وأصبح للاطلاع فقط`,go:'setup',roles:['admin','specialist','reviewer','viewer']})}
if(typeof log==='function'){const _logN=log;log=function(a){_logN(a);try{nFromLog(a)}catch(e){console.warn('notif',e)}}}
function myNotifs(){if(!me||typeof db==='undefined'||!db)return[];return nStore().filter(n=>n.by!==me.id&&((n.roles&&n.roles.includes(me.role))||(n.user&&n.user===me.id)))}
function ago(iso){let s=(Date.now()-new Date(iso).getTime())/1000;if(s<90)return'الآن';let m=Math.floor(s/60);if(m<60)return`منذ ${m} د`;let h=Math.floor(m/60);if(h<24)return h===1?'منذ ساعة':h===2?'منذ ساعتين':`منذ ${h} ساعات`;let d=Math.floor(h/24);return d===1?'أمس':`منذ ${d} أيام`}
function buildNotif(){let top=D.querySelector('.top');if(!top||!me)return;let w=D.getElementById('ntWrap');
if(!w){w=D.createElement('div');w.id='ntWrap';w.innerHTML='<button type="button" id="ntBtn" title="الإشعارات"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg><span id="ntBadge" hidden></span></button><div id="ntMenu" hidden></div>';
let av=D.getElementById('avWrap');top.insertBefore(w,av||null);
w.querySelector('#ntBtn').onclick=ev=>{ev.stopPropagation();let m2=w.querySelector('#ntMenu');m2.hidden=!m2.hidden;if(!m2.hidden)paintNotif()};
D.addEventListener('click',()=>{let m2=w.querySelector('#ntMenu');if(m2)m2.hidden=true})}
let list=myNotifs(),un=list.filter(n=>!n.read.includes(me.id)).length,bd=w.querySelector('#ntBadge');
bd.hidden=!un;if(un)bd.textContent=un>9?'9+':un}
window._nt={list:()=>myNotifs(),store:()=>nStore()};
function paintNotif(){let m2=D.getElementById('ntMenu');if(!m2||!me)return;let list=myNotifs().slice(0,15);
m2.innerHTML=`<div class="ntHead"><span>الإشعارات</span>${list.length?'<button type="button" class="text-btn" id="ntAll">تحديد الكل كمقروء</button>':''}</div>`
+(list.map(n=>{let un=!n.read.includes(me.id);return `<button type="button" class="ntItem ${un?'un':''}" data-id="${n.id}"><i class="dot ${n.type||'info'}"></i><span class="ntTx"><b>${esc(n.t)}</b><small>${esc(n.b||'')}</small><em>${ago(n.at)}</em></span></button>`}).join('')||'<div class="ntEmpty">لا توجد إشعارات بعد. ستظهر هنا طلبات المراجعة والاعتمادات والتنبيهات.</div>');
m2.querySelectorAll('.ntItem').forEach(x=>x.onclick=()=>{let n=nStore().find(y=>y.id===x.dataset.id);
if(n&&!n.read.includes(me.id)){n.read.push(me.id);save()}
m2.hidden=true;if(n&&n.go&&typeof go==='function')go(n.go);buildNotif()});
let all=m2.querySelector('#ntAll');
if(all)all.onclick=ev=>{ev.stopPropagation();myNotifs().forEach(n=>{if(!n.read.includes(me.id))n.read.push(me.id)});save();paintNotif();buildNotif()}}
const _render6=render;
render=function(){_render6();
try{buildBrand();buildTabs();buildAvatar();buildClock();buildNotif();
// 21:57 Mohamed: next-exam card removed from dashboard (parallel department exams make it wrong)
}catch(e){console.warn('shell',e)}};
D.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{buildBrand();buildTabs()},400)});
window.addEventListener('resize',()=>{try{buildTabs();hl()}catch(e){}});
})();
/* ext7: facility hierarchy (building>floor>room,type,hours), staff academic ranks + observer auto-distribution,
cross-term carry-over courses, generator core-first ordering */
const OB_RANKS = ['أستاذ', 'أستاذ مساعد', 'مدرس', 'مدرس مساعد', 'معيد'];
const OB_DOC = ['أستاذ', 'أستاذ مساعد', 'مدرس'];
const OB_JUNIOR = ['مدرس مساعد', 'معيد'];
const ROOM_TYPES = ['قاعة', 'مدرج', 'معمل'];
function mig7() {
db.rooms = db.rooms || [];
db.rooms.forEach(r => { r.bldg = r.bldg || ''; r.floor = r.floor || ''; r.type = ROOM_TYPES.includes(r.type) ? r.type : 'قاعة'; r.hours = r.hours || ''; });
db.observers = db.observers || [];
db.observers.forEach(o => { o.rank = o.rank || ''; });
}
try { mig7(); } catch (e) {}
function roomLabel(r) { return r.name + (r.bldg ? ' — ' + r.bldg + (r.floor ? '، ' + r.floor : '') : ''); }
rooms = function () {
mig7();
let rows = db.rooms.slice().sort((a, b) => (a.bldg + a.floor + a.name).localeCompare(b.bldg + b.floor + b.name, 'ar'));
return head('القاعات والمباني', 'نظّم القاعات في مبانٍ وأدوار، وحدد نوع كل قاعة (قاعة، مدرج، معمل) وسعتها وساعات تشغيلها. تُحفظ في هذا المتصفح وتدخل في النسخة الاحتياطية.',
`<button onclick="roomsExport()">تصدير القاعات</button><label class="check light" style="cursor:pointer;margin:0">استيراد قاعات<input type="file" accept=".json" style="display:none" onchange="roomsImport(this)"></label>`) +
`<div class="stats">${stat('إجمالي القاعات', db.rooms.length)}${stat('المباني', new Set(db.rooms.map(r => r.bldg).filter(x => x)).size)}${ROOM_TYPES.map(t => stat(t, db.rooms.filter(r => r.type === t).length)).join('')}</div>
<section class="panel"><h2>القاعات</h2><div class="tablewrap"><table><tr><th>المبنى</th><th>الدور</th><th>اسم القاعة</th><th>النوع</th><th>السعة</th><th>ساعات التشغيل</th><th></th></tr>${rows.map(r => `<tr><td>${esc(r.bldg) || '—'}</td><td>${esc(r.floor) || '—'}</td><td><b>${esc(r.name)}</b></td><td><span class="badge ${r.type === 'مدرج' ? 'blue' : r.type === 'معمل' ? 'amber' : ''}">${esc(r.type)}</span></td><td>${r.cap}</td><td>${esc(r.hours) || '—'}</td><td><button class="sm light" onclick="editRoom('${r.id}')">تعديل</button> <button class="sm danger" onclick="delRoom('${r.id}')">حذف</button></td></tr>`).join('') || '<tr><td colspan="7" class="empty">لا توجد قاعات.</td></tr>'}</table></div></section>
<section class="panel"><h2>إضافة قاعة</h2><div class="formgrid"><div class="field"><label>المبنى</label><input id="rbldg" placeholder="مثال: مبنى أ"></div><div class="field"><label>الدور</label><input id="rfloor" placeholder="مثال: الدور الأول"></div><div class="field"><label>اسم القاعة</label><input id="rname"></div><div class="field"><label>النوع</label><select id="rtype">${ROOM_TYPES.map(t => `<option>${t}</option>`).join('')}</select></div><div class="field"><label>السعة (عدد الطلاب)</label><input id="rcap" type="number" min="1"></div><div class="field"><label>ساعات التشغيل (تُدخل يدويًا)</label><input id="rhours" placeholder="مثال: 9ص–5م"></div></div><div class="actions"><button onclick="addRoom()">＋ إضافة قاعة</button></div></section>`;
};
function addRoom() {
mig7();
let name = $('#rname').value.trim(), cap = +$('#rcap').value, bldg = $('#rbldg').value.trim(), floor = $('#rfloor').value.trim(), type = $('#rtype').value, hours = $('#rhours').value.trim();
if (!name || cap < 1) return toast('أدخل اسم القاعة وسعتها', true);
if (db.rooms.some(r => r.name === name)) return toast('اسم القاعة مكرر', true);
db.rooms.push({ id: id(), name, cap, bldg, floor, type, hours }); save(); log('إضافة قاعة ' + name); render();
}
function editRoom(rid) {
let r = db.rooms.find(x => x.id === rid); if (!r) return;
window._er = rid;
modal('تعديل القاعة', `<div class="formgrid"><div class="field"><label>المبنى</label><input id="ef-bldg" value="${esc(r.bldg)}"></div><div class="field"><label>الدور</label><input id="ef-floor" value="${esc(r.floor)}"></div><div class="field"><label>اسم القاعة</label><input id="ef-name" value="${esc(r.name)}"></div><div class="field"><label>النوع</label><select id="ef-type">${ROOM_TYPES.map(t => `<option ${r.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div><div class="field"><label>السعة</label><input id="ef-cap" type="number" min="1" value="${r.cap}"></div><div class="field"><label>ساعات التشغيل</label><input id="ef-hours" value="${esc(r.hours)}"></div></div>`, `<button onclick="roomSave()">حفظ</button>`);
}
function roomSave() {
let r = db.rooms.find(x => x.id === window._er); if (!r) return;
let name = $('#ef-name').value.trim(), cap = +$('#ef-cap').value;
if (!name || cap < 1) return toast('أدخل اسم القاعة وسعتها', true);
if (db.rooms.some(x => x.id !== r.id && x.name === name)) return toast('اسم القاعة مكرر', true);
Object.assign(r, { name, cap, bldg: $('#ef-bldg').value.trim(), floor: $('#ef-floor').value.trim(), type: $('#ef-type').value, hours: $('#ef-hours').value.trim() });
save(); log('تعديل قاعة ' + name); closeModal(); render();
}
roomsImport = function (inp) {
let f = inp.files[0]; if (!f) return; inp.value = '';
f.text().then(t => {
try {
let o = JSON.parse(t), a = (o && o.rooms) || o; if (!Array.isArray(a)) throw 0;
let ok = a.filter(r => r && r.name && +r.cap >= 1), add = ok.filter(r => !db.rooms.some(x => x.name === r.name));
if (!confirm(`سيتم إضافة ${add.length} قاعة جديدة وتجاهل ${ok.length - add.length} مكررة. متابعة؟`)) return;
add.forEach(r => db.rooms.push({ id: id(), name: String(r.name), cap: +r.cap, bldg: String(r.bldg || ''), floor: String(r.floor || ''), type: ROOM_TYPES.includes(r.type) ? r.type : 'قاعة', hours: String(r.hours || '') }));
save(); log(`استيراد ${add.length} قاعة`); render(); toast(`تمت إضافة ${add.length} قاعة`);
} catch (e) { toast('ملف القاعات غير صالح', true); }
});
};
function obRankOK(role, rank) {
if (!rank) return true; // سجلات قديمة بلا رتبة
if (role === 'ملاحظ') return OB_JUNIOR.includes(rank);
return OB_DOC.includes(rank);
}
observersPage = function () {
mig7();
let L = db.observers.filter(o => (!obF.r || o.role === obF.r) && (!obF.q || (o.name + o.dept + o.phone + o.rank).includes(obF.q)));
let cnt = r => db.observers.filter(o => o.role === r).length;
return head('الملاحظون والمراقبون', 'رفع بيانات هيئة التدريس والمعيدين بالرتبة العلمية من ملف Excel بنموذج موحّد، وتبقى محفوظة للإصدارات التالية.', `<button onclick="obTemplate()">تنزيل نموذج Excel</button><label class="check light" style="cursor:pointer;margin:0">رفع ملف Excel / CSV<input type="file" accept=".xlsx,.csv" style="display:none" onchange="obImport(this)"></label><button class="light" onclick="obExport()">تصدير CSV</button>`) +
`<div class="stats">${stat('الإجمالي', db.observers.length)}${OB_ROLES.map(r => stat(r, cnt(r))).join('')}</div>
<div class="notice">القواعد: الملاحظ يكون معيدًا أو مدرسًا مساعدًا ويوزَّع تلقائيًا من صفحة «توزيع اللجان». المراقب ورئيس اللجنة من هيئة التدريس (أستاذ، أستاذ مساعد، مدرس) ويُعيَّنان يدويًا. البيانات محفوظة في قاعدة بيانات هذا المتصفح وتدخل في النسخ الاحتياطي.</div>
<div class="panel" style="margin-bottom:14px;display:flex;gap:10px;flex-wrap:wrap;align-items:center"><input placeholder="بحث بالاسم أو الجهة أو الرتبة أو الهاتف" value="${esc(obF.q)}" style="max-width:300px" onchange="obF.q=this.value;render()"><div class="seg"><button class="${obF.r ? '' : 'on'}" onclick="obF.r='';render()">الكل</button>${OB_ROLES.map(r => `<button class="${obF.r === r ? 'on' : ''}" onclick="obF.r='${r}';render()">${r}</button>`).join('')}</div></div>
<section class="panel"><h2>إضافة يدوية</h2><div class="formgrid"><div class="field"><label>الاسم</label><input id="obn"></div><div class="field"><label>الدور في اللجان</label><select id="obr">${OB_ROLES.map(r => `<option>${r}</option>`).join('')}</select></div><div class="field"><label>الرتبة العلمية</label><select id="obk">${OB_RANKS.map(r => `<option>${r}</option>`).join('')}</select></div><div class="field"><label>القسم / الجهة</label><input id="obd"></div><div class="field"><label>الهاتف</label><input id="obp"></div></div><div class="actions"><button onclick="obAdd()">＋ إضافة</button></div></section>
<section class="panel"><div class="tablewrap"><table><tr><th>الاسم</th><th>الدور</th><th>الرتبة</th><th>القسم / الجهة</th><th>الهاتف</th><th></th></tr>${L.map(o => `<tr><td>${esc2(o.name)}</td><td><span class="badge ${o.role === 'رئيس لجنة' ? 'amber' : o.role === 'مراقب' ? 'blue' : 'green'}">${esc2(o.role)}</span></td><td>${esc2(o.rank) || '—'}</td><td>${esc2(o.dept) || '—'}</td><td>${esc2(o.phone) || '—'}</td><td><button class="sm light" onclick="obDel('${o.id}')">حذف</button></td></tr>`).join('') || '<tr><td colspan="6" class="empty">لا توجد بيانات. نزّل النموذج وارفعه بعد تعبئته.</td></tr>'}</table></div></section>`;
};
obAdd = function () {
let n = $('#obn').value.trim(), r = $('#obr').value, k = $('#obk').value, d = $('#obd').value.trim(), p = $('#obp').value.trim();
if (!n) return toast('اكتب الاسم', true);
if (!obRankOK(r, k)) return toast(r === 'ملاحظ' ? 'الملاحظ يجب أن يكون معيدًا أو مدرسًا مساعدًا' : 'المراقب ورئيس اللجنة يجب أن يكونا من هيئة التدريس', true);
if (db.observers.some(o => o.name === n && o.role === r)) return toast('الاسم مكرر بنفس الدور', true);
db.observers.push({ id: id(), name: n, role: r, rank: k, dept: d, phone: p }); save(); log(`إضافة ${r}: ${n}`); render();
};
obExport = function () {
let q = v => '"' + String(v || '').replace(/"/g, '""') + '"';
dl('observers.csv', new Blob(['\ufeff' + [['الاسم', 'الدور الوظيفي', 'الرتبة', 'القسم / الجهة', 'الهاتف'].join(',')].concat(db.observers.map(o => [o.name, o.role, o.rank, o.dept, o.phone].map(q).join(','))).join('\n')], { type: 'text/csv;charset=utf-8' }));
};
obTemplate = function () {
let cols = ['الاسم', 'الدور الوظيفي', 'الرتبة', 'القسم / الجهة', 'الهاتف'];
let rows = [cols, ['مثال: اسم الملاحظ', 'ملاحظ', 'معيد', 'قسم الكيمياء', '01000000000'], ['مثال: اسم المراقب', 'مراقب', 'مدرس', 'قسم الفيزياء', ''], ['مثال: اسم رئيس اللجنة', 'رئيس لجنة', 'أستاذ', 'قسم الرياضيات', '']];
let col = i => String.fromCharCode(65 + i), x = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
let sheet = '<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetViews><sheetView rightToLeft="1" workbookViewId="0"/></sheetViews><cols><col min="1" max="5" width="28" customWidth="1"/></cols><sheetData>' + rows.map((r, i) => `<row r="${i + 1}">` + r.map((v, j) => `<c r="${col(j)}${i + 1}" t="inlineStr"><is><t>${x(v)}</t></is></c>`).join('') + '</row>').join('') + '</sheetData></worksheet>';
dl('نموذج-الملاحظين-والمراقبين.xlsx', zipStore([['[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'], ['_rels/.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'], ['xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="البيانات" sheetId="1" r:id="rId1"/></sheets></workbook>'], ['xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'], ['xl/worksheets/sheet1.xml', sheet]]));
log('تنزيل نموذج الملاحظين والمراقبين');
};
obImport = async function (inp) {
let f = inp.files[0]; if (!f) return; inp.value = '';
let rows; try { rows = /\.xlsx$/i.test(f.name) ? await readXlsx(await f.arrayBuffer()) : parseCsv(await f.text()); } catch (e) { return toast('تعذر قراءة الملف. استخدم النموذج المنزّل (xlsx أو csv)', true); }
rows = rows.filter(r => r && r.some(x => String(x || '').trim())); if (!rows.length) return toast('الملف فارغ', true);
let h = rows[0].map(x => String(x || '').trim()), ix = n => h.indexOf(n);
if (ix('الاسم') < 0 || ix('الدور الوظيفي') < 0) return toast('الصف الأول يجب أن يحتوي العمودين: الاسم، الدور الوظيفي (استخدم النموذج)', true);
mig7();
let good = [], dup = 0, bad = [], seen = new Set(db.observers.map(o => o.name + '|' + o.role));
rows.slice(1).forEach((r, i) => {
let g = n => ix(n) < 0 ? '' : String(r[ix(n)] || '').trim(), name = g('الاسم'), role = g('الدور الوظيفي'), rank = g('الرتبة');
if (/^مثال/.test(name)) return;
if (!name || !OB_ROLES.includes(role) || (rank && !OB_RANKS.includes(rank)) || !obRankOK(role, rank)) { bad.push(i + 2); return; }
let key = name + '|' + role; if (seen.has(key)) { dup++; return; } seen.add(key);
good.push({ id: id(), name, role, rank, dept: g('القسم / الجهة'), phone: g('الهاتف') });
});
window._obGood = good;
modal('معاينة الاستيراد', `<div class="stats"><div class="stat"><span>سيُضاف</span><strong>${good.length}</strong></div><div class="stat"><span>مكرر (يُتجاهل)</span><strong>${dup}</strong></div><div class="stat"><span>غير صالح</span><strong>${bad.length}</strong></div></div>${bad.length ? `<div class="notice warning">صفوف غير صالحة (اسم فارغ، أو دور/رتبة لا يحققان القاعدة: الملاحظ معيد أو مدرس مساعد، والمراقب ورئيس اللجنة من هيئة التدريس): ${bad.slice(0, 15).join('، ')}</div>` : ''}${good.slice(0, 8).map(o => `<div class="ovrow"><span>${esc2(o.name)}</span><i>${esc2(o.role)}${o.rank ? ' • ' + esc2(o.rank) : ''}</i></div>`).join('')}`, good.length ? `<button onclick="obCommit()">استيراد ${good.length} سجل</button>` : '');
};
function allocAuto() {
let e = active(); if (!e) return toast('لا يوجد إصدار نشط', true);
mig7();
let pool = db.observers.filter(o => o.role === 'ملاحظ' && (OB_JUNIOR.includes(o.rank) || !o.rank));
if (!pool.length) return toast('لا يوجد ملاحظون مؤهلون (معيد أو مدرس مساعد) في بيانات الملاحظين', true);
let cs = allocCourses(e), comms = [];
cs.forEach(c => { let A = allocGet(e, c); (A ? A.list : []).forEach(x => comms.push({ c, x })); });
if (!comms.length) return toast('أنشئ اللجان أولًا من زر «تحرير اللجان» ثم أعد التوزيع', true);
if (!comms.some(({ x }) => +x.obs > 0)) return toast('حدد «عدد الملاحظين المطلوب» لكل لجنة من «تحرير اللجان» أولًا', true);
if (!confirm(`سيوزّع النظام ${pool.length} ملاحظًا مؤهلًا على اللجان بالعدد الذي حددته لكل لجنة، دون تعيين نفس الشخص في موعدين متزامنين، ودون تغيير أي تعيين يدوي قائم. متابعة؟`)) return;
let busy = {};
comms.forEach(({ c, x }) => (x.staff || []).forEach(s => (busy[c.slot] = busy[c.slot] || new Set()).add(s)));
let qi = 0, added = 0;
comms.forEach(({ c, x }) => {
x.staff = x.staff || [];
let cur = x.staff.filter(s => { let o = db.observers.find(o => o.id === s); return o && o.role === 'ملاحظ'; }).length;
let target = +x.obs || 0;
for (let i = cur; i < target; i++) {
let pick = null;
for (let t = 0; t < pool.length; t++) { let cand = pool[(qi + t) % pool.length]; if (!busy[c.slot] || !busy[c.slot].has(cand.id)) { pick = cand; qi = (qi + t + 1) % pool.length; break; } }
if (!pick) break;
x.staff.push(pick.id); (busy[c.slot] = busy[c.slot] || new Set()).add(pick.id); added++;
}
});
save(); log('توزيع الملاحظين تلقائيًا: ' + added + ' تعيين'); render();
toast(added ? 'تم توزيع ' + added + ' ملاحظًا. راجع اللجان وعدّل يدويًا عند الحاجة.' : 'كل اللجان مكتملة بالعدد المحدد بالفعل');
}
const _ap7 = allocPage;
allocPage = function () {
let h = _ap7(); if (typeof h !== 'string') return h;
h = h.replace('التوزيع يدوي بالكامل ولا يوجد توليد تلقائي.', 'المراقبون ورؤساء اللجان يُعيَّنون يدويًا، والملاحظون يمكن توزيعهم تلقائيًا بالزر المجاور ثم تعديلهم يدويًا.');
if (me.role === 'admin') h = h.replace('<button onclick="allocCsv()">', '<button onclick="allocAuto()">توزيع الملاحظين تلقائيًا</button><button onclick="allocCsv()">');
return h;
};
function xCourses(e, k) {
let sem = semCode(e), cat = CATALOG[k]; if (!cat) return [];
let sems = sem ? [sem === '1' ? '2' : '1'] : ['1', '2'], out = [];
sems.forEach(s => (cat[s] || []).forEach(c => {
if (c.g) c.o.forEach(o => { if (o[3] !== 'p') out.push({ code: o[0], name: o[1], sem: s }); });
else if (c[3] !== 'p') out.push({ code: c[0], name: c[1], sem: s });
}));
return out;
}
function xOptions(e, k) {
let xs = xCourses(e, k);
if (!xs.length) return '<option value="">لا توجد مقررات في الفصل الآخر</option>';
return '<option value="">اختر المقرر المنقول…</option>' + xs.map(c => `<option value="${esc(c.code)}|${esc(c.name)}">[${c.sem === '1' ? 'الفصل الأول' : 'الفصل الثاني'}] ${esc(c.code)} — ${esc(c.name)}</option>`).join('');
}
function pickXCourse() {
let v = $('#xsel').value; if (!v) return toast('اختر مقررًا من القائمة أولًا', true);
let [code, name] = v.split('|');
$('#ccode').value = code; $('#cname').value = name; window._xcarry = true;
toast('تمت تعبئة المقرر المنقول. أكمل عدد الطلاب والموعد ثم اضغط «إضافة المقرر»');
}
genRun = function (e, keys) {
let P = programs(), used = [], res = { props: [], left: [] }, dayOf = s => String(s).split('|')[0];
Object.entries(e.tasks || {}).forEach(([k, t]) => { let p = P.find(x => x.key === k); if (p) (t.courses || []).filter(c => c.slot).forEach(c => used.push({ level: p.level, slot: c.slot, k, code: c.code })); });
keys.forEach(k => {
let p = P.find(x => x.key === k); if (!p) return;
let t = e.tasks[k] || { courses: [], status: 'مسودة' };
if (isLocked(t)) { res.left.push({ k, pn: p.name, code: '', name: 'كل المقررات', why: 'الجدول مُرسل أو معتمد ولا يُعدَّل' }); return; }
let slots = levelSlots(e, p.level);
if (!slots.length) { res.left.push({ k, pn: p.name, code: '', name: 'كل المقررات', why: 'لم تُحدَّد أيام وفترات لهذا المستوى' }); return; }
let core = [], carries = [];
planItems(e, k).forEach(it => {
if (it.elective) { if (!it.courses.some(c => { let x = planEntry(t, c.code); return x && x.slot; })) res.left.push({ k, pn: p.name, code: '', name: it.title, why: 'مجموعة اختيارية: اختر المقرر يدويًا' }); return; }
let c = it.courses[0]; if (c.pass) return;
let x = planEntry(t, c.code); if (x && x.slot) return;
core.push(c);
});
(t.courses || []).filter(c => c.manual && !c.slot).forEach(c => carries.push(c));
let trySched = (c, carry) => {
let mine = used.filter(u => u.k === k).map(u => dayOf(u.slot));
let cand = slots.filter(s => !mine.includes(dayOf(s.key)) && !used.some(u => u.level !== p.level && u.slot === s.key) && !used.some(u => u.level === p.level && dayOf(u.slot) === dayOf(s.key) && u.slot !== s.key));
if (!cand.length) { res.left.push({ k, pn: p.name, code: c.code, name: c.name, why: carry ? 'مقرر منقول/يدوي: لا موعد متاح' : 'لا يوجد موعد يحقق: مقرر واحد للمستوى في اليوم، ومستوى واحد في الفترة' }); return; }
let best = cand[0];
used.push({ level: p.level, slot: best.key, k, code: c.code });
res.props.push({ k, pn: p.name, code: c.code, name: c.name + (carry ? ' (منقول)' : ''), slot: best.key, label: best.label, carry: !!carry });
};
let ci = 0, mi = 0;
while (ci < core.length || mi < carries.length) {
if (ci < core.length) trySched(core[ci++], false);
if (mi < carries.length) trySched(carries[mi++], true);
}
});
return res;
};
genApply = function () {
let e = active(), r = _gp; if (!e || !r) return;
let items = [];
r.props.forEach(x => {
let t = e.tasks[x.k] || (e.tasks[x.k] = { courses: [], status: 'مسودة', note: '' });
if (t && isLocked(t)) return;
if (x.carry) {
let c = (t.courses || []).find(c => c.manual && c.code === x.code);
if (!c || c.slot || slotClash(t, c.code, 'm:' + c.code, x.slot)) return;
let [date, pid] = x.slot.split('|'), pp = e.periods.find(z => z.id === pid), day = DAYS[new Date(date + 'T12:00:00').getDay()];
c.slot = x.slot; c.label = `${day} ${date} – ${pp.name} (${pp.from}–${pp.to})`;
items.push({ k: x.k, code: x.code, slot: x.slot, carry: true });
} else {
if (t && planEntry(t, x.code) && planEntry(t, x.code).slot) return;
setCourseSlot(x.k, x.code, x.slot);
let en = e.tasks[x.k] && planEntry(e.tasks[x.k], x.code);
if (en && en.slot === x.slot) items.push({ k: x.k, code: x.code, slot: x.slot });
}
});
e.genLast = { at: new Date().toLocaleString('ar-EG'), by: me.name, items };
save(); log('تطبيق اقتراح المواعيد التلقائي: ' + items.length + ' مقرر'); closeModal(); render(); toast('تم تطبيق ' + items.length + ' موعد');
};
genUndo = function () {
let e = active(); if (!e || !e.genLast) return;
let n = 0;
e.genLast.items.forEach(x => {
let t = e.tasks[x.k]; if (!t || isLocked(t) || !(me.role === 'admin' || e.assign[x.k] === me.id)) return;
if (x.carry) {
let c = (t.courses || []).find(c => c.manual && c.code === x.code);
if (c && c.slot === x.slot) { c.slot = ''; c.label = ''; n++; }
} else {
let en = planEntry(t, x.code); if (en && en.slot === x.slot) { setCourseSlot(x.k, x.code, ''); n++; }
}
});
e.genLast = null; save(); log('تراجع عن اقتراح المواعيد التلقائي: ' + n); render(); toast('تم التراجع عن ' + n + ' موعد (المعدّل يدويًا بعد التطبيق لم يُلمس)');
};
allocDraw = function (c) {
let e = active(); c = c || allocCourses(e).find(x => x.k === _ae.k && x.code === _ae.code); let L = _ae.list;
let body = `<p class="muted">${esc2(c.name)} • ${esc2(c.code)} • ${c.n || '؟'} طالب</p><div class="formgrid"><div class="field"><label>المحاضر (اختياري، يظهر في الجدول المطبوع)</label><input value="${esc2(_ae.lect)}" onchange="_ae.lect=this.value"></div><div class="field"><label>عدد المتخلفين (اختياري)</label><input type="number" min="0" value="${esc2(_ae.carry)}" onchange="_ae.carry=this.value"></div></div>${L.map((x, q) => `<div class="panel" style="padding:8px;margin:6px 0"><div class="formgrid"><div class="field"><label>القاعة</label><select onchange="_ae.list[${q}].room=this.value">${db.rooms.map(r => `<option value="${r.id}" ${r.id === x.room ? 'selected' : ''}>${esc2(roomLabel(r))} (${r.cap})</option>`).join('')}</select></div><div class="field"><label>عدد الطلاب</label><input type="number" min="1" value="${x.n}" onchange="_ae.list[${q}].n=+this.value"></div><div class="field"><label>عدد الملاحظين المطلوب (تحدده أنت)</label><input type="number" min="0" value="${x.obs != null ? x.obs : ''}" placeholder="0" onchange="_ae.list[${q}].obs=+this.value"></div></div>${OB_ROLES.map(r => `<details><summary>${r} (${(x.staff || []).filter(s => (db.observers.find(o => o.id === s) || {}).role === r).length}${r === 'ملاحظ' ? ' / ' + (+x.obs || 0) : ''})</summary>${db.observers.filter(o => o.role === r).map(o => `<label class="check" style="display:block"><input type="checkbox" ${(x.staff || []).includes(o.id) ? 'checked' : ''} onchange="allocStaff(${q},'${o.id}',this.checked)"> ${esc2(o.name)}</label>`).join('') || '<span class="muted">لا أحد مضاف</span>'}</details>`).join('')}<button class="sm light" onclick="_ae.list.splice(${q},1);allocDraw()">حذف اللجنة</button></div>`).join('') || '<p class="muted">لا لجان بعد.</p>'}<button class="light" ${db.rooms.length ? '' : 'disabled'} onclick="_ae.list.push({room:db.rooms[0].id,n:${c.n || 1},obs:0,staff:[]});allocDraw()">＋ إضافة لجنة</button>`;
modal('لجان وبيانات المقرر', body, `<button onclick="allocSave()">حفظ</button>`);
};
/* ext8: summer-term wizard - pick open courses, set per-course inputs, then generate.
Shows inside the task editor for editions whose semester has no ready plan (الفصل الصيفي). */
window._swStep = window._swStep || {};
function swAllCourses(k) {
let cat = CATALOG[k], out = [];
if (!cat) return out;
['1', '2'].forEach(s => (cat[s] || []).forEach(c => {
if (c.g) c.o.forEach(o => { if (o[3] !== 'p') out.push({ code: o[0], name: o[1], sem: s }); });
else if (c[3] !== 'p') out.push({ code: c[0], name: c[1], sem: s });
}));
return out;
}
function swStep(k) { return window._swStep[k] || 1; }
function swSetStep(k, n) { window._swStep[k] = n; render(); }
function summerWizard(e, k, t, locked) {
let p = programs().find(x => x.key === k) || { name: k, level: 0 };
let st = swStep(k);
let steps = ['اختيار المقررات المفتوحة', 'مدخلات كل مقرر', 'التوليد'];
let head3 = `<h3 style="margin-top:20px">معالج الفصل الصيفي</h3>
<div class="notice">البرنامج: <b>${esc(p.name)}</b> — المستوى ${LV[p.level - 1] || p.level} • الفصل الحالي: <b>${esc(e.semester)}</b>. لا خطة جاهزة للفصل الصيفي: حدّد المقررات المفتوحة هذا الفصل، ثم مدخلات كل مقرر، ثم ولّد المواعيد.</div>
<div class="steps" style="margin-bottom:14px">${steps.map((n, i) => `<div class="step ${st === i + 1 ? 'active' : st > i + 1 ? 'done' : ''}"><b>${String(i + 1).padStart(2, '0')}</b>${n}</div>`).join('')}</div>`;
if (locked) return head3 + '<div class="notice warning">الجدول مُرسل أو معتمد؛ المعالج للقراءة فقط.</div>';
let manual = (t.courses || []).filter(c => c.manual);
if (st === 1) {
let bySem = s => swAllCourses(k).filter(c => c.sem === s);
let grp = (s, label) => {
let cs = bySem(s);
if (!cs.length) return '';
return `<h4>${label}</h4>${cs.map(c => {
let on = manual.some(m => m.code === c.code);
return `<label class="check" style="display:block;padding:4px 0"><input type="checkbox" ${on ? 'checked' : ''} onchange="swToggle('${esc(k)}','${esc(c.code)}','${esc(c.name).replace(/'/g, "\\'")}',this.checked)"> <b>${esc(c.code)}</b> ${esc(c.name)}</label>`;
}).join('')}`;
};
return head3 + `<section class="panel"><h2>الخطوة 1: المقررات المفتوحة هذا الفصل</h2>
<p class="muted">علّم على المقررات التي ستُفتح في الفصل الصيفي لهذا البرنامج (من خطتي الفصلين الأول والثاني). العدد المختار: <b>${manual.length}</b></p>
${grp('1', 'مقررات الفصل الدراسي الأول')}${grp('2', 'مقررات الفصل الدراسي الثاني')}
<div class="actions"><button class="teal" ${manual.length ? '' : 'disabled'} onclick="swSetStep('${esc(k)}',2)">التالي: مدخلات المقررات</button></div></section>`;
}
if (st === 2) {
if (!manual.length) { window._swStep[k] = 1; return summerWizard(e, k, t, locked); }
return head3 + `<section class="panel"><h2>الخطوة 2: مدخلات كل مقرر</h2>
<p class="muted">عدد الطلاب والمحاضر لكل مقرر مفتوح. المحاضر يظهر في الجدول المطبوع.</p>
<div class="tablewrap"><table><tr><th>الكود</th><th>المقرر</th><th>عدد الطلاب</th><th>المحاضر</th></tr>${manual.map((c, i) => `<tr><td>${esc(c.code)}</td><td>${esc(c.name)}</td><td><input type="number" min="1" value="${c.students || ''}" id="sws${i}" style="max-width:110px"></td><td><input value="${esc(c.lect || '')}" id="swl${i}" placeholder="اسم المحاضر"></td></tr>`).join('')}</table></div>
<div class="actions"><button class="light" onclick="swSetStep('${esc(k)}',1)">السابق</button><button class="teal" onclick="swSaveInputs('${esc(k)}')">حفظ المدخلات والانتقال للتوليد</button></div></section>`;
}
return head3 + `<section class="panel"><h2>الخطوة 3: التوليد</h2>
<p class="muted">سيولّد النظام المواعيد بالتبادل (أساسي ثم منقول بالتناوب) للمقررات غير المجدولة، دون تغيير ما حددته يدويًا. راجع المعاينة ثم طبّق.</p>
<div class="tablewrap"><table><tr><th>الكود</th><th>المقرر</th><th>الطلاب</th><th>المحاضر</th><th>الموعد</th></tr>${manual.map(c => `<tr><td>${esc(c.code)}</td><td>${esc(c.name)}</td><td>${c.students || '—'}</td><td>${esc(c.lect || '—')}</td><td>${c.slot ? esc(c.label || c.slot) + ' <span class="badge green">✓</span>' : '<span class="badge amber">لم يُجدول</span>'}</td></tr>`).join('')}</table></div>
<div class="actions"><button class="light" onclick="swSetStep('${esc(k)}',2)">السابق</button><button onclick="genPreview('${esc(k)}')">اقتراح المواعيد تلقائيًا</button></div></section>`;
}
function swToggle(k, code, name, on) {
let e = active(), t = e.tasks[k] || (e.tasks[k] = { courses: [], status: 'مسودة', note: '' });
if (isLocked(t)) return;
let i = (t.courses || []).findIndex(c => c.manual && c.code === code);
if (on && i < 0) { t.courses.push({ code, name, students: 0, slot: '', manual: true, summer: true, label: '' }); t.status = t.status === 'مسودة' ? 'قيد الإعداد' : t.status; t.updated = new Date().toLocaleString('ar-EG'); save(); log('فتح مقرر صيفي ' + code); }
if (!on && i >= 0) {
if (t.courses[i].slot) return toast('ألغِ موعد المقرر أولًا', true);
t.courses.splice(i, 1); save(); log('إغلاق مقرر صيفي ' + code);
}
render();
}
function swSaveInputs(k) {
let e = active(), t = e.tasks[k]; if (!t || isLocked(t)) return;
let manual = (t.courses || []).filter(c => c.manual), bad = 0;
manual.forEach((c, i) => {
let s = +($('#sws' + i) ? $('#sws' + i).value : 0), l = $('#swl' + i) ? $('#swl' + i).value.trim() : '';
if (s >= 1) { c.students = s; } else bad++;
c.lect = l;
});
if (bad) return toast('أدخل عدد الطلاب لكل مقرر (1 على الأقل)', true);
save(); log('حفظ مدخلات مقررات الصيفي'); swSetStep(k, 3);
}
/* ext9: settings page - proctoring mode (وضع المراقبة) master switch + safe faculty settings.
Toggling never deletes data; it only shows/hides the committees layer. */
function mig9() {
db.settings = db.settings || {};
if (db.settings.invig == null) db.settings.invig = true;
if (db.settings.defObs == null) db.settings.defObs = 0;
if (db.settings.autoLock == null) db.settings.autoLock = 30;
db.sec = db.sec || { fails: 0, until: 0 };
}
try { mig9(); } catch (e) {}
function invigOn() { mig9(); return !!db.settings.invig; }
function setInvig(v) { mig9(); db.settings.invig = !!v; save(); log(v ? 'تفعيل وضع المراقبة' : 'إيقاف وضع المراقبة'); render(); toast(v ? 'وضع المراقبة مفعّل: صفحتا الملاحظين وتوزيع اللجان ظاهرتان' : 'وضع المراقبة موقوف: أُخفيت صفحات اللجان ولم يُحذف أي بيان'); }
function setDefObs(v) { mig9(); db.settings.defObs = Math.max(0, +v || 0); save(); log('تعيين العدد الافتراضي للملاحظين: ' + db.settings.defObs); render(); }
(function () {
PAGES.push(['settings', 'الإعدادات']);
ROLE_PERMS.admin = PAGES.map(x => x[0]).filter(k => k !== 'tasks').concat('approve');
ICONS.settings = '⚙';
})();
const _m9 = menu;
menu = function () { return _m9().filter(([k]) => invigOn() || (k !== 'observers' && k !== 'alloc')); };
const _d9 = dashboard;
dashboard = function () {
if (page === 'settings') return settingsPage();
if (!invigOn() && (page === 'observers' || page === 'alloc')) page = 'dashboard';
return _d9();
};
function setRow(title, desc, control) {
return `<div class="panel" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap"><div style="flex:1;min-width:240px"><b>${title}</b><p class="muted" style="margin:4px 0 0">${desc}</p></div><div>${control}</div></div>`;
}
function settingsPage() {
mig9();
let on = invigOn();
return head('الإعدادات', 'إعدادات عامة للمنصة. التغيير يحفظ فورًا في هذا المتصفح ويدخل في النسخة الاحتياطية، ولا يحذف أي بيانات.') +
`<h2>اللجان والمراقبة</h2>` +
setRow('وضع المراقبة (تفعيل وضع المراقبة)', 'عند التفعيل تظهر كل أدوات اللجان: إعداد اللجان، إدخال أسماء السادة الأساتذة، الملاحظون والمراقبون ورؤساء اللجان وتوزيعهم. عند الإيقاف تعمل المنصة بدون هذه الطبقة — مع بقاء كل البيانات محفوظة كما هي.',
`<span class="badge ${on ? 'green' : ''}" style="margin-inline-end:8px">${on ? 'مفعّل' : 'موقوف'}</span><button class="${on ? 'light' : 'teal'}" onclick="setInvig(${on ? 0 : 1})">${on ? 'إيقاف' : 'تفعيل'}</button>`) +
setRow('العدد الافتراضي للملاحظين في اللجنة الجديدة', 'عند إنشاء لجنة جديدة يُملأ حقل «عدد الملاحظين المطلوب» بهذا العدد، ويمكن تغييره لكل لجنة على حدة. صفر يعني بلا قيمة افتراضية.',
`<input type="number" min="0" max="20" value="${db.settings.defObs}" style="max-width:90px" onchange="setDefObs(this.value)">`) +
`<h2 style="margin-top:18px">التوقيعات على الجداول المطبوعة</h2>` +
`<section class="panel"><p class="muted">تُطبع تحت كل جدول: اسم الدور وتحته الاسم. اسم المختص يُملأ تلقائيًا من حساب منشئ الجدول، وأي اسم يُدخل في «بيانات الطباعة الرسمية» لإصدار معيّن يقدَّم على المدخل هنا.</p><div class="formgrid"><div class="field"><label>مدير شئون الطلاب</label><input id="sig-sa" value="${esc((db.settings.sig||{}).sa||'')}"></div><div class="field"><label>وكيل الكلية</label><input id="sig-vice" value="${esc((db.settings.sig||{}).vice||'')}"></div><div class="field"><label>عميد الكلية</label><input id="sig-dean" value="${esc((db.settings.sig||{}).dean||'')}"></div></div><div class="actions"><button onclick="saveSigNames()">حفظ أسماء التوقيعات</button></div></section>` +
`<h2 style="margin-top:18px">الأمان</h2>` +
setRow('تسجيل الخروج التلقائي عند عدم النشاط', 'عدد الدقائق بلا نشاط قبل تسجيل الخروج تلقائيًا. صفر يعني إيقاف الميزة. (حماية على مستوى هذا المتصفح)',
`<input type="number" min="0" max="240" value="${db.settings.autoLock}" style="max-width:90px" onchange="setAutoLock(this.value)">`) +
setRow('قفل محاولات الدخول', 'بعد 5 محاولات دخول فاشلة يُقفل تسجيل الدخول 5 دقائق على هذا المتصفح. حماية محلية رادعة — الحماية الحقيقية من التخمين تحتاج خادمًا.', `<span class="badge green">مفعّل دائمًا</span>`) +
setRow('تشفير كلمات المرور المخزنة', 'تُحفظ كلمات المرور مبعثرة بخوارزمية PBKDF2-SHA256 بعدد 150 ألف تكرار وملح عشوائي مستقل لكل حساب، وتُرقّى الحسابات القديمة تلقائيًا عند أول دخول ناجح. لا تُحفظ كلمة المرور نصًا في أي مكان.', `<span class="badge green">مفعّل</span>`) +
`<h2 style="margin-top:18px">إعدادات أخرى</h2>` +
setRow('المظهر الداكن', 'متاح من زر الهلال في الشريط العلوي لكل مستخدم، ويُحفظ لكل متصفح.', `<span class="badge blue">موجود بالفعل</span>`) +
setRow('النسخ الاحتياطي والاستعادة', 'من قائمة الحساب (الصورة الرمزية أعلى الصفحة): تصدير نسخة احتياطية كاملة تشمل الإعدادات والقاعات والملاحظين والإصدارات.', `<span class="badge blue">موجود بالفعل</span>`) +
`<section class="panel" style="margin-top:14px"><h2>مقترحات إعدادات قادمة (بانتظار اختياركم)</h2><p class="muted">لم تُنفّذ بعد — بانتظار تأكيد إدارة الكلية:</p><ul style="margin:8px 0;padding-inline-start:20px;line-height:2">
<li>إخفاء شارة «بيانات تجريبية» عند العرض الرسمي أمام القيادات.</li>
<li>منع (بدل التنبيه فقط) وجود مقررين في القاعة نفسها بالفترة نفسها.</li>
<li>قاعدة تباعد تلقائية: يوم راحة بين امتحانين لنفس المستوى.</li>
<li>تخصيص اسم الكلية والشعار في الترويسة والمطبوعات.</li>
<li>مدة السماح قبل اعتبار جدول المختص «متأخرًا» في صفحة المتابعة.</li></ul></section>`;
}
login = function () {
(async () => {
if (!db) return;
mig9();
let now = Date.now();
if (db.sec.until > now) {
let m = Math.ceil((db.sec.until - now) / 60000);
$('#loginerr').textContent = `محاولات كثيرة فاشلة. حاول بعد ${m} دقيقة.`;
$('#loginerr').classList.remove('hidden');
return;
}
let u = $('#lu').value.trim(), p = await hash($('#lp').value), x = db.users.find(a => a.username === u && a.password === p && a.active);
if (!x) {
db.sec.fails++;
if (db.sec.fails >= 5) { db.sec.until = Date.now() + 5 * 60000; db.sec.fails = 0; log('قفل تسجيل الدخول مؤقتًا بعد محاولات فاشلة'); }
save();
$('#loginerr').textContent = db.sec.until > Date.now() ? 'تم قفل تسجيل الدخول 5 دقائق بعد 5 محاولات فاشلة.' : 'بيانات الدخول غير صحيحة أو الحساب غير نشط';
$('#loginerr').classList.remove('hidden');
return;
}
db.sec.fails = 0; db.sec.until = 0;
me = x; x.last = new Date().toLocaleString('ar-EG');
log('تسجيل الدخول');
$('#login').classList.add('hidden'); $('#app').classList.remove('hidden');
$('#who').textContent = me.name; $('#role').textContent = roleName(me.role);
page = menu()[0] ? menu()[0][0] : 'published';
save(); render();
})();
};
function setAutoLock(v) { mig9(); db.settings.autoLock = Math.max(0, +v || 0); save(); log('تعيين الخروج التلقائي: ' + db.settings.autoLock + ' دقيقة'); render(); }
let _lastAct = Date.now();
['click', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, () => { _lastAct = Date.now(); }, { passive: true }));
setInterval(() => {
try {
mig9();
if (me && db.settings.autoLock > 0 && Date.now() - _lastAct >= db.settings.autoLock * 60000) {
logout();
let e2 = $('#loginerr'); if (e2) { e2.textContent = 'تم تسجيل الخروج تلقائيًا بسبب عدم النشاط.'; e2.classList.remove('hidden'); }
}
} catch (e) {}
}, 30000);
function spAutoName(e) {
let ids = new Set();
Object.entries(e.tasks || {}).forEach(([k, t]) => { if ((t.courses || []).some(c => c.slot) && e.assign && e.assign[k]) ids.add(e.assign[k]); });
return ids.size ? [...ids].map(userName).join('، ') : '';
}
offSigs = function (e) {
mig9();
let N = (typeof prn === 'function' ? (prn(e).names || []) : []);
let S = db.settings.sig || {};
return [
['توقيع المختص', N[0] || spAutoName(e)],
['مدير إدارة شؤون الطلاب', N[1] || S.sa || ''],
['وكيل الكلية لشؤون التعليم والطلاب', N[2] || S.vice || ''],
['عميد الكلية', N[3] || S.dean || '']
];
};
function saveSigNames() {
mig9();
db.settings.sig = { sa: $('#sig-sa').value.trim(), vice: $('#sig-vice').value.trim(), dean: $('#sig-dean').value.trim() };
save(); log('حفظ أسماء التوقيعات'); toast('تم حفظ أسماء التوقيعات');
}
/* ext10: campus photo layer - login slideshow + hero photo band.
Images arrive as data URIs in campus1.js..campus4.js (CAMPUS1..CAMPUS4). */
(function(){
const SRCS=[typeof CAMPUS1!=='undefined'&&CAMPUS1,typeof CAMPUS2!=='undefined'&&CAMPUS2,typeof CAMPUS3!=='undefined'&&CAMPUS3,typeof CAMPUS4!=='undefined'&&CAMPUS4].filter(Boolean);
if(!SRCS.length)return;
function buildLogin(){
let lg=document.getElementById('login');
if(!lg||lg.querySelector('.bgslides'))return;
let d=document.createElement('div');d.className='bgslides';d.setAttribute('aria-hidden','true');
SRCS.forEach((s,i)=>{let im=document.createElement('img');im.src=s;im.alt='';im.style.setProperty('--d',(i*9)+'s');d.appendChild(im)});
let sh=document.createElement('i');sh.className='bgshade';d.appendChild(sh);
lg.prepend(d);
}
function buildHero(){
let h=document.querySelector('.hero');
if(!h||h.querySelector('.hero-bg'))return;
let im=document.createElement('img');im.className='hero-bg';im.alt='';im.src=SRCS[SRCS.length-1];
h.prepend(im);
}
buildLogin();
const _r10=render;
render=function(){_r10();if(typeof page!=='undefined'&&page==='dashboard')buildHero()};
buildHero();
})();
// ext11: level-pair distribution (زوجان من المستويات: أيام مشتركة لكل زوج، فترة واحدة لكل مستوى)
// Faculty rule (Mohamed, 2026-11-23): 6 exam days; levels pair up (default 1+3, 2+4);
// each pair owns 3 days; within a pair one level takes the morning period, the other the evening.
// Data stays in e.levelPlans (backwards compatible); pair membership stored in e.pairCfg.
function pqDefault(){return {a:[1,3],b:[2,4]}}
function pqDerive(e){
if(e.pairCfg&&e.pairCfg.a&&e.pairCfg.b)return e.pairCfg;
let groups={};
for(let l=1;l<=4;l++){let k=((e.levelPlans[l]||{}).days||[]).slice().sort((x,y)=>x-y).join(',');(groups[k]=groups[k]||[]).push(l)}
let gs=Object.values(groups).filter(g=>g.length===2);
if(gs.length===2&&gs.flat().sort().join('')==='1234')return {a:gs[0].slice(),b:gs[1].slice()};
return pqDefault();
}
function pqState(e){
let cfg=pqDerive(e),st={cfg,days:{a:[],b:[]},per:{}};
['a','b'].forEach(k=>{let ds=new Set();cfg[k].forEach(l=>((e.levelPlans[l]||{}).days||[]).forEach(d=>ds.add(d)));st.days[k]=[...ds].sort((x,y)=>x-y)});
for(let l=1;l<=4;l++){let ps=(e.levelPlans[l]||{}).periods||[];st.per[l]=ps[0]||''}
return st;
}
function pqSuggestState(e){
let cfg=pqDefault(),half=3;
let da=e.days.slice(0,half),db2=e.days.slice(half);
let p0=e.periods[0]?e.periods[0].id:'',p1=(e.periods[1]||e.periods[0]||{}).id||'';
return {cfg,days:{a:da,b:db2},per:{1:p0,2:p0,3:p1,4:p1}};
}
function pqEmpty(e){return [1,2,3,4].every(l=>!((e.levelPlans[l]||{}).days||[]).length&&!((e.levelPlans[l]||{}).periods||[]).length)}
distribution=function(e){
if(!e.periods.length)return '<div class="notice warning">أضف الفترات أولًا.</div>';
if(!e.days.length)return '<div class="notice warning">حدد أيام الأسبوع المسموح بها أولًا.</div>';
ensureEditionShape(e);
let st=pqEmpty(e)?pqSuggestState(e):pqState(e);
let lvOpts=sel=>[1,2,3,4].map(l=>`<option value="${l}" ${sel===l?'selected':''}>المستوى ${LV[l-1]}</option>`).join('');
let perOpts=sel=>`<option value="">— اختر الفترة —</option>`+e.periods.map(p=>`<option value="${p.id}" ${sel===p.id?'selected':''}>${esc(p.name)} (${p.from}–${p.to})</option>`).join('');
let card=(k,title,desc)=>{
let [l1,l2]=st.cfg[k];
let dayBoxes=e.days.map(d=>`<label class="check"><input type="checkbox" class="lday pday" data-pair="${k}" value="${d}" ${st.days[k].includes(d)?'checked':''} onchange="liveCheckDistribution()">${DAYS[d]}</label>`).join('');
return `<div class="panel level-card pair-card" data-pair-box="${k}">
<div class="lc-head"><h3>${title}</h3><span class="badge blue" id="pair-badge-${k}"></span></div>
<p class="muted" style="margin:0 0 10px">${desc}</p>
<div class="pq-row"><b class="lc-label" style="margin:0">مستويا الزوج</b>
<select class="pairlv" data-pair="${k}" data-slot="0" onchange="liveCheckDistribution()">${lvOpts(l1)}</select>
<select class="pairlv" data-pair="${k}" data-slot="1" onchange="liveCheckDistribution()">${lvOpts(l2)}</select>
</div>
<b class="lc-label">أيام هذا الزوج (من أيام الامتحانات المحددة في الخطوة السابقة)</b>
<div class="checks lc-days">${dayBoxes}</div>
<b class="lc-label">فترة كل مستوى (فترة واحدة فقط لكل مستوى)</b>
<div class="pq-row pq-pers" data-pair-pers="${k}"></div>
</div>`;
};
let html=`
<h2>توزيع المستويات على الأيام والفترات</h2>
<p class="muted">نظام الكلية: ستة أيام امتحانات مقسومة على زوجين من المستويات، كل زوج يمتحن في أيامه الخاصة، وكل مستوى له فترة واحدة ثابتة (صباحية أو مسائية) حتى لا يتقابل مستويان في نفس الفترة أبدًا.</p>
<div id="live-conflict-alert" class="conflict-alert hidden" role="alert"></div>
<div class="level-grid">${card('a','الزوج الأول','مستويان يمتحنان في نفس الأيام، أحدهما صباحًا والآخر مساءً.')}${card('b','الزوج الثاني','يمتحن في الأيام المتبقية، وبنفس القاعدة: فترة لكل مستوى.')}</div>
<div class="actions">
<button onclick="saveDistribution(true)" id="save-dist-btn" class="teal">حفظ توزيع المستويات مؤقتًا</button>
<button class="light" onclick="pqSuggest()">الاقتراح الافتراضي (١+٣ / ٢+٤)</button>
<button class="light" onclick="clearDist()">مسح الكل</button>
</div>
<div class="notice">يتم حساب تواريخ الامتحانات الفعلية تلقائيًا من أيام الزوج وفترة المستوى مع استبعاد الإجازات. لن يُنشئ المولّد أي موعد لمستوى خارج أيام زوجه أو خارج فترته.</div>`;
window._pqInit=st.per;
return html;
};
// render per-level period selects after the view mounts (needs current pair membership)
function pqRenderPers(){
let e=active()||draftEdition;if(!e)return;
['a','b'].forEach(k=>{
let box=document.querySelector(`[data-pair-pers="${k}"]`);if(!box)return;
let lv=$$(`.pairlv[data-pair="${k}"]`).map(s=>+s.value);
let cur={};box.querySelectorAll('select.lperiod-s').forEach(s=>cur[+s.dataset.level]=s.value);
box.innerHTML=lv.map(l=>{
let opts=`<option value="">— اختر الفترة —</option>`+e.periods.map(p=>`<option value="${p.id}">${esc(p.name)} (${p.from}–${p.to})</option>`).join('');
return `<span class="pq-per"><span>المستوى ${LV[l-1]}</span><select class="lperiod-s" id="pper-l-${l}" data-level="${l}" onchange="liveCheckDistribution()">${opts}</select></span>`;
}).join('');
box.querySelectorAll('select.lperiod-s').forEach(s=>{let l=+s.dataset.level;let v=cur[l]||(window._pqInit||{})[l]||((e.levelPlans[l]||{}).periods||[])[0]||'';if(v)s.value=v});
});
}
// read the pair UI into canonical levelPlans; also persist pairCfg on the edition
readLevelPlans=function(){
let plans=emptyPlans(),cfg={a:[],b:[]};
['a','b'].forEach(k=>{
cfg[k]=$$(`.pairlv[data-pair="${k}"]`).map(s=>+s.value);
let days=$$(`.pday[data-pair="${k}"]:checked`).map(x=>+x.value);
cfg[k].forEach(l=>{plans[l]={days:days.slice(),periods:[]}});
});
$$('select.lperiod-s').forEach(s=>{let l=+s.dataset.level;if(plans[l]&&s.value)plans[l].periods=[s.value]});
let e=active()||draftEdition;if(e)e.pairCfg=cfg;
return plans;
};
pqSuggest=function(){
let e=active()||draftEdition;if(!e)return;
let st=pqSuggestState(e);
['a','b'].forEach(k=>{
$$(`.pairlv[data-pair="${k}"]`).forEach((s,i)=>s.value=st.cfg[k][i]);
$$(`.pday[data-pair="${k}"]`).forEach(c=>c.checked=st.days[k].includes(+c.value));
});
pqRenderPers();
for(let l=1;l<=4;l++){let s=document.getElementById('pper-l-'+l);if(s)s.value=st.per[l]||''}
liveCheckDistribution();
toast('تمت تعبئة الاقتراح الافتراضي — راجعه ثم احفظ');
};
function pqProblems(e,plans,cfg){
let probs=[];
let all=cfg.a.concat(cfg.b);
if(new Set(all).size!==4||!all.every(l=>l>=1&&l<=4))probs.push('يجب أن يضم الزوجان المستويات الأربعة كلًّا مرة واحدة.');
if(cfg.a.length===2&&cfg.b.length===2){
let da=new Set();cfg.a.forEach(l=>(plans[l].days||[]).forEach(d=>da.add(d)));
cfg.b.forEach(l=>(plans[l].days||[]).forEach(d=>{if(da.has(d))probs.push(`يوم ${DAYS[d]} محجوز للزوج الأول ولا يمكن اختياره للزوج الثاني.`)}));
['a','b'].forEach(k=>{
let [x,y]=cfg[k],px=(plans[x]||{}).periods||[],py=(plans[y]||{}).periods||[];
if(px.length&&py.length&&px[0]===py[0]){
let per=e.periods.find(p=>p.id===px[0]);
probs.push(`المستوى ${LV[x-1]} والمستوى ${LV[y-1]} في نفس الزوج ويجب أن تختلف فترتاهما (صباحية/مسائية) — كلاهما الآن «${per?esc(per.name):''}».`);
}
});
}
for(let l=1;l<=4;l++){let ps=(plans[l]||{}).periods||[];if(ps.length>1)probs.push(`المستوى ${LV[l-1]}: يجب اختيار فترة واحدة فقط.`)}
return [...new Set(probs)];
}
liveCheckDistribution=function(){
let e=active()||draftEdition;
let alertBox=$('#live-conflict-alert');
if(!e||!alertBox)return;
pqRenderPers();
let plans=readLevelPlans();
let cfg=e.pairCfg||pqDefault();
// disable days claimed by the other pair
let taken={a:new Set($$('.pday[data-pair="b"]:checked').map(c=>+c.value)),b:new Set($$('.pday[data-pair="a"]:checked').map(c=>+c.value))};
['a','b'].forEach(k=>{$$(`.pday[data-pair="${k}"]`).forEach(c=>{c.disabled=taken[k].has(+c.value);c.closest('label').classList.toggle('pq-taken',taken[k].has(+c.value))})});
// badges + card states
['a','b'].forEach(k=>{
let b=document.getElementById('pair-badge-'+k);
if(b){let n=$$(`.pday[data-pair="${k}"]:checked`).length;b.textContent=n+(n===1?' يوم':' أيام')}
});
$$('.level-card .check').forEach(label=>{let input=label.querySelector('input');label.classList.toggle('on',!!(input&&input.checked))});
let problems=pqProblems(e,plans,cfg);
// per-level completeness shown softly (does not block until save/next)
let conflicts=levelConflicts({levelPlans:plans});
conflicts.forEach(c=>{let per=e.periods.find(x=>x.id===c.p);problems.push(`تعارض: المستوى ${LV[c.a-1]} والمستوى ${LV[c.b-1]} يتشاركان ${DAYS[c.d]} – ${per?esc(per.name):''}`)});
problems=[...new Set(problems)];
let saveBtn=$('#save-dist-btn'),nextBtn=$('#wizard-next-btn');
if(problems.length){
alertBox.innerHTML=`<div>راجع التالي قبل الحفظ:</div><ul>${problems.slice(0,6).map(p=>`<li>⚠️ ${p}</li>`).join('')}${problems.length>6?`<li>و ${problems.length-6} ملاحظات أخرى…</li>`:''}</ul>`;
alertBox.classList.remove('hidden');
}else{alertBox.innerHTML='';alertBox.classList.add('hidden')}
if(saveBtn)saveBtn.disabled=problems.length>0;
if(nextBtn&&step===4)nextBtn.disabled=problems.length>0;
};
saveDistribution=function(showToast=true){
let e=active()||draftEdition;
if(!e)return false;
if(!$$('.pday').length)return true; // step not rendered (no periods/days yet)
pqRenderPers();
let plans=readLevelPlans();
let cfg=e.pairCfg||pqDefault();
let problems=pqProblems(e,plans,cfg);
if(problems.length){liveCheckDistribution();toast(problems[0].replace(/<[^>]+>/g,''),true);return false}
let incomplete=[1,2,3,4].filter(l=>!plans[l].days.length||!plans[l].periods.length);
if(incomplete.length){toast('أكمل أيام وفترة كل مستوى قبل الحفظ',true);return false}
for(let l=1;l<=4;l++)e.levelPlans[l]=plans[l];
save();
if(showToast)toast('تم حفظ وتحديث توزيع المستويات بنجاح');
return true;
};
clearDist=function(){
if(!confirm('مسح جميع اختيارات توزيع المستويات؟'))return;
let e=active()||draftEdition;
for(let l=1;l<=4;l++)e.levelPlans[l]={days:[],periods:[]};
e.pairCfg=pqDefault();
save();render();
};
// edition summary: show the pair structure explicitly
const _pqSummary=editionSummary;
editionSummary=function(e){
let h=_pqSummary(e);
try{
let cfg=pqDerive(e);
let nm=l=>'المستوى '+LV[l-1];
let per=l=>{let idp=(e.levelPlans[l]||{}).periods[0];let p=e.periods.find(x=>x.id===idp);return p?esc(p.name)+' ('+p.from+'–'+p.to+')':'—'};
let block=`<div class="panel"><h3>أزواج المستويات</h3><p>الزوج الأول: ${nm(cfg.a[0])} (${per(cfg.a[0])}) + ${nm(cfg.a[1])} (${per(cfg.a[1])})<br>الزوج الثاني: ${nm(cfg.b[0])} (${per(cfg.b[0])}) + ${nm(cfg.b[1])} (${per(cfg.b[1])})</p></div>`;
h=h.replace('<div class="panel"><h3>توزيع المستويات</h3>',block+'<div class="panel"><h3>توزيع المستويات</h3>');
}catch(x){}
return h;
};
// after the distribution view renders, mount period selects + run the live check
const _pqRender=render;
render=function(){_pqRender();if(typeof page!=='undefined'&&page==='setup'&&step===4){pqRenderPers();liveCheckDistribution()}};
// ===== ext12: مركز التقارير — student-facing vs internal reports =====
(function(){
PAGES.push(['reports','مركز التقارير']);
if(!ROLE_PERMS.admin.includes('reports'))ROLE_PERMS.admin.push('reports');
// slot label helper: "الأحد، ٢ نوفمبر • الفترة الأولى 09:00–11:00"
function rpSlotLabel(e,key,short){
let[d,pid]=key.split('|'),p=e.periods.find(x=>x.id===pid)||{name:'فترة'};
let dt=new Date(d+'T12:00:00');
let ds=dt.toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long'});
let tm=(p.from&&p.to)?` (${p.from}–${p.to})`:'';
return short?`${ds}`:`${ds} • ${p.name}${tm}`;
}
function rpCourses(e,okOnly){
let ok=['معتمد','منشور'],P=programs(),out=[];
Object.entries(e.tasks).forEach(([k,t])=>{
let p=P.find(x=>x.key===k);if(!p)return;
if(okOnly&&!ok.includes(t.status))return;
(t.courses||[]).filter(c=>c.slot).forEach(c=>out.push({k,code:c.code,name:c.name,n:+c.students||0,slot:c.slot,prog:p.name,lv:p.level}));
});
return out.sort((a,b)=>a.slot.localeCompare(b.slot)||a.lv-b.lv);
}
function rpRoomName(id){let r=db.rooms.find(x=>x.id===id);return r?esc(r.name):'؟'}
function rpStaff(ids,role){return (ids||[]).map(i=>db.observers.find(o=>o.id===i)).filter(o=>o&&(!role||o.role===role)).map(o=>esc(o.name)).join('، ')||'—'}
// ---- report bodies ----
function rpBodyStudent(e){
let out='';
[1,2,3,4].forEach(l=>{
let rows=rpCourses(e,true).filter(c=>c.lv===l);
out+=`<h3 style="color:var(--navy);margin:18px 0 8px">${LV[l-1]}</h3>`;
if(!rows.length){out+='<p class="muted">لا توجد مقررات معتمدة لهذا المستوى بعد.</p>';return}
out+=`<table class="rep"><tr><th>التاريخ</th><th>الفترة</th><th>المقرر</th><th>البرنامج / الشعبة</th></tr>`+
rows.map(c=>`<tr><td>${rpSlotLabel(e,c.slot,true)}</td><td>${esc((e.periods.find(p=>p.id===c.slot.split('|')[1])||{}).name||'')}</td><td>${esc(c.name)}<br><small>${esc(c.code)}</small></td><td>${esc(c.prog)}</td></tr>`).join('')+'</table>';
});
return out;
}
function rpBodyCommittees(e){
let cs=rpCourses(e,false),rows='',noComm=[];
cs.forEach(c=>{
let A=allocGet(e,c);
if(!A||!A.list||!A.list.length){noComm.push(c);return}
A.list.forEach((x,q)=>{
rows+=`<tr>${q===0?`<td rowspan="${A.list.length}">${rpSlotLabel(e,c.slot,true)}<br><small>${esc((e.periods.find(p=>p.id===c.slot.split('|')[1])||{}).name||'')}</small></td><td rowspan="${A.list.length}">${esc(c.name)}<br><small>${esc(c.code)} • ${esc(c.prog)} • ${LV[c.lv-1]}</small></td>`:''}<td>${rpRoomName(x.room)}</td><td>${x.n||c.n||'—'}</td><td>${rpStaff(x.staff,'رئيس لجنة')}</td><td>${rpStaff(x.staff,'مراقب')}</td><td>${rpStaff(x.staff,'ملاحظ')}</td></tr>`;
});
});
let html=`<table class="rep"><tr><th>التاريخ / الفترة</th><th>المقرر</th><th>القاعة (اللجنة)</th><th>عدد الطلاب</th><th>رئيس اللجنة</th><th>المراقب</th><th>الملاحظون</th></tr>${rows||'<tr><td colspan="7">لم توزَّع لجان بعد من صفحة توزيع اللجان.</td></tr>'}</table>`;
if(noComm.length)html+=`<p class="notice warning">مقررات لها مواعيد ولم توزَّع لها لجان بعد (${noComm.length}): ${noComm.map(c=>esc(c.name)).join('، ')}</p>`;
return html;
}
function rpBodyInvig(e){
let per={};
Object.entries(e.alloc||{}).forEach(([ck,A])=>{
let [k,code]=ck.split('|'),t=e.tasks[k],c=t&&(t.courses||[]).find(x=>x.code===code);
let p=programs().find(x=>x.key===k);
(A.list||[]).forEach(x=>(x.staff||[]).forEach(si=>{
let o=db.observers.find(z=>z.id===si);if(!o)return;
(per[o.id]=per[o.id]||{o,rows:[]}).rows.push({slot:A.slot,room:x.room,course:c?c.name:code,prog:p?p.name:k,role:o.role});
}));
});
let ids=Object.keys(per);
if(!ids.length)return '<p class="muted">لم تُسند مهام ملاحظة بعد من صفحة توزيع اللجان.</p>';
return ids.map(i=>{
let g=per[i];g.rows.sort((a,b)=>a.slot.localeCompare(b.slot));
return `<h3 style="color:var(--navy);margin:18px 0 8px">${esc(g.o.name)} <small>(${esc(g.o.role)}${g.o.dept?' • '+esc(g.o.dept):''})</small></h3>`+
`<table class="rep"><tr><th>التاريخ</th><th>الفترة</th><th>القاعة</th><th>المقرر</th><th>البرنامج</th><th>الدور</th></tr>`+
g.rows.map(r=>`<tr><td>${rpSlotLabel(e,r.slot,true)}</td><td>${esc((e.periods.find(p=>p.id===r.slot.split('|')[1])||{}).name||'')}</td><td>${rpRoomName(r.room)}</td><td>${esc(r.course)}</td><td>${esc(r.prog)}</td><td>${esc(r.role)}</td></tr>`).join('')+'</table>';
}).join('');
}
// ---- per-person duty sheets (individual distribution) ----
function rpPer(e){
let per={};
Object.entries(e.alloc||{}).forEach(([ck,A])=>{
let [k,code]=ck.split('|'),t=e.tasks[k],c=t&&(t.courses||[]).find(x=>x.code===code);
let p=programs().find(x=>x.key===k);
(A.list||[]).forEach(x=>(x.staff||[]).forEach(si=>{
let o=db.observers.find(z=>z.id===si);if(!o)return;
(per[o.id]=per[o.id]||{o,rows:[]}).rows.push({slot:A.slot,room:x.room,course:c?c.name:code,prog:p?p.name:k,role:o.role});
}));
});
Object.values(per).forEach(g=>g.rows.sort((a,b)=>a.slot.localeCompare(b.slot)));
return per;
}
function rpSheetRows(e,g){return g.rows.map(r=>`<tr><td>${rpSlotLabel(e,r.slot,true)}</td><td>${esc((e.periods.find(p=>p.id===r.slot.split('|')[1])||{}).name||'')}</td><td>${rpRoomName(r.room)}</td><td>${esc(r.course)}</td><td>${esc(r.prog)}</td><td>${esc(r.role)}</td></tr>`).join('')}
function rpBodySheetsPrev(e){
let per=rpPer(e),ids=Object.keys(per);
if(!ids.length)return '<p class="muted">لم تُسند مهام ملاحظة بعد من صفحة توزيع اللجان.</p>';
return '<div class="setgrid">'+ids.map(i=>{
let g=per[i];
return `<section class="panel" style="margin:0"><h2 style="font-size:15px;margin:0 0 2px">${esc(g.o.name)}</h2><p class="muted" style="margin:0 0 8px">${esc(g.o.role)}${g.o.dept?' • '+esc(g.o.dept):''} • ${g.rows.length} ${g.rows.length===1?'مهمة':'مهام'}</p><div class="tablewrap"><table><tr><th>التاريخ</th><th>الفترة</th><th>القاعة</th><th>المقرر</th></tr>`+g.rows.map(r=>`<tr><td>${rpSlotLabel(e,r.slot,true)}</td><td>${esc((e.periods.find(p=>p.id===r.slot.split('|')[1])||{}).name||'')}</td><td>${rpRoomName(r.room)}</td><td>${esc(r.course)}</td></tr>`).join('')+'</table></div></section>';
}).join('')+'</div>';
}
function rpBodySheetsPrint(e){
let per=rpPer(e),ids=Object.keys(per);
if(!ids.length)return '<p>لم تُسند مهام ملاحظة بعد.</p>';
return ids.map(i=>{
let g=per[i];
return `<div style="page-break-after:always">${offHead('كشف مهام فردي')}<h2 style="text-align:center;margin:10px 0">كشف مهام الملاحظة</h2><p style="text-align:center;margin:0 0 12px"><b>${esc(g.o.name)}</b> — ${esc(g.o.role)}${g.o.dept?' • '+esc(g.o.dept):''}</p><table border="1" cellspacing="0" style="width:100%;border-collapse:collapse"><tr><th>التاريخ</th><th>الفترة</th><th>القاعة</th><th>المقرر</th><th>البرنامج</th><th>الدور</th></tr>${rpSheetRows(e,g)}</table><p style="margin-top:26px">استلمت مهامي كما هي موضحة أعلاه. &nbsp;&nbsp; التوقيع: ..............................</p></div>`;
}).join('');
}
const RP_DEFS=[
{id:'students',title:'جدول الامتحانات — نسخة الطلاب',aud:'للطلاب',cls:'green',desc:'المواعيد المعتمدة لكل مستوى: التاريخ والفترة والمقرر والبرنامج. صالح للنشر للطلاب.',body:rpBodyStudent,extra:'نسخة مخصصة للطلاب'},
{id:'committees',title:'كشوف اللجان بالملاحظين',aud:'داخلي',cls:'amber',desc:'كل لجنة: القاعة والمقرر وعدد الطلاب ورئيس اللجنة والمراقب والملاحظون. للاستخدام الداخلي.',body:rpBodyCommittees,extra:'تقرير داخلي — لا يُنشر للطلاب'},
{id:'invig',title:'جدول مهام الملاحظين',aud:'داخلي',cls:'amber',desc:'لكل ملاحظ أو مراقب أو رئيس لجنة: مواعيده وقاعاته ومقرراته. للاستخدام الداخلي.',body:rpBodyInvig,extra:'تقرير داخلي — لا يُنشر للطلاب'},
{id:'sheets',title:'كشوف المهام الفردية',aud:'للتوزيع',cls:'green',desc:'صفحة مستقلة بترويسة رسمية لكل معيد أو دكتور: مهامه بالتاريخ والفترة والقاعة والمقرر، مع سطر استلام وتوقيع. تُطبع صفحة لكل شخص وتُوزَّع عليه.',body:rpBodySheetsPrev,printBody:rpBodySheetsPrint,extra:'كشف مهام فردي'}
];
let rpCur=null;
window.reportsPage=function(){
let e=active();
if(!e)return head('مركز التقارير','لا يوجد إصدار نشط.')+'<section class="panel empty">أنشئ إصدارًا أولًا.</section>';
db.pubs=db.pubs||{};
let cards=RP_DEFS.map(r=>{let pub=db.pubs[r.id];
let pubBd=pub?` <span class="badge green">منشور • ${new Date(pub.at).toLocaleDateString('ar-EG',{day:'numeric',month:'long'})} • ${esc(pub.by||'')}</span>`:'';
return `<section class="panel" style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap"><div><h2 style="margin:0 0 4px">${r.title} <span class="badge ${r.cls}">${r.aud}</span>${pubBd}</h2><p class="muted" style="margin:0">${r.desc}</p></div><div class="actions no-print" style="margin-top:0"><button class="light sm" onclick="rpView('${r.id}')">معاينة</button><button class="sm" onclick="rpExp('${r.id}','print')">طباعة / PDF</button><button class="sm light" onclick="rpExp('${r.id}','doc')">Word</button><button class="sm light" onclick="rpExp('${r.id}','xls')">Excel</button><button class="sm ${pub?'danger':'teal'}" onclick="rpPub('${r.id}')">${pub?'إلغاء النشر':'نشر للتوزيع'}</button></div></div></section>`}).join('');
let prev=rpCur?`<section class="panel"><h2>معاينة: ${RP_DEFS.find(r=>r.id===rpCur).title}</h2><div class="tablewrap">${RP_DEFS.find(r=>r.id===rpCur).body(e)}</div></section>`:'';
return head('مركز التقارير','كل تقرير يُطبع أو يُصدَّر Word وExcel بالترويسة الرسمية. «نشر للتوزيع» يعلّم التقرير معتمدًا وجاهزًا داخل المنصة مع تاريخ النشر، والتوزيع الفعلي يكون بطباعة الملف أو مشاركته.')+cards+prev;
};
window.rpView=function(id){if(!RP_DEFS.some(r=>r.id===id))return;rpCur=rpCur===id?null:id;render()};
window.rpPub=function(id){
db.pubs=db.pubs||{};let r=RP_DEFS.find(x=>x.id===id);if(!r)return;
if(db.pubs[id]){delete db.pubs[id];save();log('إلغاء نشر تقرير: '+r.title);toast('أُلغي نشر «'+r.title+'»');render();return}
db.pubs[id]={at:new Date().toISOString(),by:me?me.name:''};
save();log('نشر تقرير للتوزيع: '+r.title);toast('نُشر «'+r.title+'» — جاهز للطباعة والتوزيع');render();
};
window.rpExp=function(id,kind){
let e=active(),r=RP_DEFS.find(x=>x.id===id);if(!e||!r)return;
let body=r.printBody?r.printBody(e):r.body(e).replace(/class="rep"/g,'border="1" cellspacing="0" style="width:100%;border-collapse:collapse"').replace(/class="[^"]*"/g,'').replace(/var\(--navy\)/g,'#173451');
let pg=r.printBody?'portrait':'landscape';
let doc=`<html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>@page{size:A4 ${pg};margin:8mm}body{font-family:Tahoma,"Segoe UI",Arial,sans-serif;direction:rtl;font-size:11pt;color:#1d2733}table{border-collapse:collapse;width:100%}td,th{border:1px solid #444;padding:6px 8px;text-align:right;font-size:10pt;vertical-align:top}th{background:#eee}h3{margin:14px 0 6px}.offhead{display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:12px}.oh-c{text-align:center;flex:1}.oh-c b{display:block;font-size:14pt}.oh-c span{display:block;font-size:10pt}</style></head><body>${r.printBody?'':offHead(r.extra)+'<h2 style="text-align:center;margin:10px 0">'+r.title+'</h2>'}${body}</body></html>`;
if(kind==='print'){let w=window.open('','_blank');w.document.write(doc);w.document.close();w.focus();setTimeout(()=>w.print(),400);log('طباعة تقرير: '+r.title);return}
let mime=kind==='doc'?'application/msword':'application/vnd.ms-excel';
dl(`report-${r.id}.${kind}`,new Blob(['﻿'+doc],{type:mime}));
log('تصدير تقرير '+r.title+' ('+kind+')');
toast('تم تجهيز ملف التقرير');
};
// wire in: unknown pages fall back to dashboard() in render's page map
const _d12=dashboard;
dashboard=function(){if(page==='reports')return reportsPage();return _d12()};
})();
// ===== ext13: functional gains on the restored shell — unified notifications + settings hub =====
// No layout/navigation changes in this file: the original top-nav shell stays as it was.
// No global search (removed per Mohamed, 21:38).
// ---------- unified notifications ----------
function paintNotif13() {
let m2 = document.getElementById('ntMenu'); if (!m2 || !me) return;
let list = (window._nt ? _nt.list() : []).slice(0, 12);
let alerts = typeof notices === 'function' ? notices() : [];
let h = `<div class="ntHead"><span>الإشعارات والتنبيهات</span>${list.length ? '<button type="button" class="text-btn" id="ntAll13">تحديد الكل كمقروء</button>' : ''}</div>`;
if (alerts.length) h += `<div class="ntSec">تنبيهات تحتاج انتباهك</div>` + alerts.map(([a, b]) =>
`<div class="ntItem alert"><i class="dot warn"></i><span class="ntTx"><b>${esc(a)}</b><small>${esc(b)}</small></span></div>`).join('');
h += `<div class="ntSec">آخر التحديثات</div>`;
h += list.length ? list.map(n => {
let un = !n.read.includes(me.id);
return `<button type="button" class="ntItem ${un ? 'un' : ''}" data-id="${n.id}"><i class="dot ${n.type || 'info'}"></i><span class="ntTx"><b>${esc(n.t)}</b><small>${esc(n.b || '')}</small><em>${ago(n.at)}</em></span></button>`;
}).join('') : '<div class="ntEmpty">لا توجد إشعارات بعد. ستظهر هنا طلبات المراجعة والاعتمادات.</div>';
m2.innerHTML = h;
m2.querySelectorAll('button.ntItem').forEach(x => x.onclick = () => {
let n = _nt.store().find(y => y.id === x.dataset.id);
if (n && !n.read.includes(me.id)) { n.read.push(me.id); save(); }
m2.hidden = true; if (n && n.go && typeof go === 'function') go(n.go);
});
let all = m2.querySelector('#ntAll13');
if (all) all.onclick = ev => {
ev.stopPropagation();
_nt.list().forEach(n => { if (!n.read.includes(me.id)) n.read.push(me.id); });
save(); paintNotif13(); badge13();
};
}
function badge13() {
let bd = document.getElementById('ntBadge'); if (!bd || !me) return;
let un = window._nt ? _nt.list().filter(n => !n.read.includes(me.id)).length : 0;
let al = typeof notices === 'function' ? notices().length : 0;
let t = un + al;
bd.hidden = !t; if (t) bd.textContent = t > 9 ? '9+' : t;
}
function wireNotif13() {
let btn = document.getElementById('ntBtn'); if (!btn) return;
btn.onclick = ev => {
ev.stopPropagation();
let m2 = document.getElementById('ntMenu'); if (!m2) return;
m2.hidden = !m2.hidden; if (!m2.hidden) paintNotif13();
};
}
// ---------- settings hub ----------
settingsPage = function () {
mig9();
let on = invigOn();
let dark = document.documentElement.dataset.theme === 'dark';
return head('الإعدادات', 'كل إعدادات المنصة في مكان واحد. التغيير يُحفظ فورًا في هذا المتصفح ويدخل في النسخة الاحتياطية، ولا يحذف أي بيانات.') +
`<div class="setgrid">` +
`<section class="panel"><h2>✦ الحساب والأمان</h2>` +
setRow('تغيير كلمة المرور', 'تغيير كلمة مرور حسابك الحالي. استخدم كلمة قوية لا تقل عن 4 أحرف.', `<button class="light" onclick="changePassword()">تغيير كلمة المرور</button>`) +
setRow('تسجيل الخروج التلقائي عند عدم النشاط', 'عدد الدقائق بلا نشاط قبل تسجيل الخروج تلقائيًا. صفر يعني إيقاف الميزة.', `<input type="number" min="0" max="240" value="${db.settings.autoLock}" style="max-width:90px" onchange="setAutoLock(this.value)">`) +
setRow('قفل محاولات الدخول', 'بعد 5 محاولات دخول فاشلة يُقفل تسجيل الدخول 5 دقائق على هذا المتصفح.', `<span class="badge green">مفعّل دائمًا</span>`) +
`</section>` +
`<section class="panel"><h2>☾ المظهر</h2>` +
setRow('الوضع الداكن', 'التبديل بين الوضع الفاتح والداكن. يُحفظ لكل متصفح، ويمكن أيضًا من زر الهلال في الشريط العلوي.', `<button class="light" onclick="setTheme('${dark ? 'light' : 'dark'}');render()">${dark ? 'التحويل إلى الفاتح ☀' : 'التحويل إلى الداكن ☾'}</button>`) +
`</section>` +
`<section class="panel"><h2>◉ اللجان والمراقبة</h2>` +
setRow('وضع المراقبة', 'عند التفعيل تظهر كل أدوات اللجان: الملاحظون والمراقبون ورؤساء اللجان وتوزيعهم. عند الإيقاف تعمل المنصة بدون هذه الطبقة مع بقاء كل البيانات محفوظة.',
`<span class="badge ${on ? 'green' : ''}" style="margin-inline-end:8px">${on ? 'مفعّل' : 'موقوف'}</span><button class="${on ? 'light' : 'teal'}" onclick="setInvig(${on ? 0 : 1})">${on ? 'إيقاف' : 'تفعيل'}</button>`) +
setRow('العدد الافتراضي للملاحظين في اللجنة الجديدة', 'يُملأ حقل «عدد الملاحظين المطلوب» بهذا العدد عند إنشاء لجنة، ويمكن تغييره لكل لجنة على حدة. صفر يعني بلا قيمة افتراضية.',
`<input type="number" min="0" max="20" value="${db.settings.defObs}" style="max-width:90px" onchange="setDefObs(this.value)">`) +
`</section>` +
`<section class="panel"><h2>▤ النسخ الاحتياطي والاستعادة</h2>` +
setRow('تصدير نسخة احتياطية', 'ملف JSON كامل يشمل الإعدادات والقاعات والملاحظين والإصدارات والجداول.', `<button class="light" onclick="backup()">تصدير الآن</button>`) +
setRow('استعادة من ملف', 'اختر ملف نسخة احتياطية سابقة لاستعادته. تُستبدل البيانات الحالية بمحتوى الملف.', `<label class="light" style="display:inline-block;padding:9px 14px;border-radius:9px;cursor:pointer">اختيار ملف<input type="file" accept=".json" style="display:none" onchange="restoreFile(this)"></label>`) +
setRow('النسخة التلقائية', 'استعادة آخر نسخة تلقائية محفوظة في هذا المتصفح.', `<button class="light" onclick="restoreAuto()">استعادة</button>`) +
`</section>` +
`</div>` +
`<h2 style="margin-top:6px">التوقيعات على الجداول المطبوعة</h2>` +
`<section class="panel"><p class="muted">تُطبع تحت كل جدول: اسم الدور وتحته الاسم. اسم المختص يُملأ تلقائيًا من حساب منشئ الجدول، وأي اسم يُدخل في «بيانات الطباعة الرسمية» لإصدار معيّن يقدَّم على المدخل هنا.</p><div class="formgrid"><div class="field"><label>مدير شئون الطلاب</label><input id="sig-sa" value="${esc((db.settings.sig || {}).sa || '')}"></div><div class="field"><label>وكيل الكلية</label><input id="sig-vice" value="${esc((db.settings.sig || {}).vice || '')}"></div><div class="field"><label>عميد الكلية</label><input id="sig-dean" value="${esc((db.settings.sig || {}).dean || '')}"></div></div><div class="actions"><button onclick="saveSigNames()">حفظ أسماء التوقيعات</button></div></section>`;
};
// ---------- shell fixup after every render (no nav changes) ----------
function fixShell13() {
try {
wireNotif13();
badge13();
// retire the old scattered alerts pill (ext2) — hide it (removing makes ext2 re-add its wrap)
let old = document.getElementById('bell'); if (old) old.style.display = 'none';
// dedupe the save chips that accumulated from earlier re-renders
let chips = document.querySelectorAll('#savechip');
chips.forEach((c, i) => { if (i > 0) { let p = c.parentElement; if (p && p.parentElement === document.querySelector('.top')) p.remove(); else c.remove(); } });
} catch (e) { console.warn('ext13', e); }
}
const _r13 = render;
render = function () { _r13(); fixShell13(); };
// ===== ext14: per-page filter bars (Zad-style) above data tables =====
// Visual-only row filtering on the main list pages; no data, export, print or backup changes.
// One bar per page, above the first table; it filters every table on the page (multi-level report sheets).
// Pages that already ship their own search (e.g. observers) keep it - we never duplicate a search box.
const FLT_PAGES = ['tracking', 'review', 'published', 'tasks', 'observers', 'alloc', 'users', 'rooms', 'reports'];
function fltApply14(inp) {
let q = (inp.value || '').trim();
let bar = inp.closest('.fltbar');
let cnt = bar ? bar.querySelector('.fltCnt') : null;
let shown = 0, total = 0;
document.querySelectorAll('#content .tablewrap table').forEach(table => {
let rows = [...table.querySelectorAll('tr')].filter(tr => !tr.querySelector('th'));
let empty = null;
rows.forEach(tr => {
if (tr.classList.contains('fltEmpty14')) { empty = tr; return; }
total++;
let show = !q || tr.textContent.includes(q);
tr.style.display = show ? '' : 'none';
if (show) shown++;
});
// empty state row per table
if (!empty && table.querySelector('tr')) {
empty = document.createElement('tr');
empty.className = 'fltEmpty14';
empty.style.display = 'none';
empty.innerHTML = `<td colspan="12" class="empty">لا نتائج مطابقة للتصفية</td>`;
table.appendChild(empty);
}
if (empty) {
let vis = rows.some(tr => tr !== empty && tr.style.display !== 'none');
empty.style.display = (q && !vis) ? '' : 'none';
}
});
if (cnt) cnt.textContent = q ? `${shown} نتيجة` : '';
}
window.fltApply14 = fltApply14;
function addFilters14() {
try {
if (!document.getElementById('content')) return;
if (!FLT_PAGES.includes(page)) return;
if (document.querySelector('#content input[placeholder^="بحث"]')) return;
if (document.querySelector('#content .fltbar')) return;
let wraps = document.querySelectorAll('#content .tablewrap');
if (!wraps.length) return;
let bar = document.createElement('div');
bar.className = 'fltbar';
bar.innerHTML = `<span class="fico">⌕</span><input class="fltIn" placeholder="تصفية القائمة… اكتب أي جزء من الاسم أو البيانات" oninput="fltApply14(this)"><span class="fltCnt"></span>`;
wraps[0].parentNode.insertBefore(bar, wraps[0]);
} catch (e) {}
}
const _r14 = render;
render = function () { _r14(); addFilters14(); };
// ===== ext15: polish round 21:57 — topbar layout, notifications you can clear, dashboard status, setup saved-state =====
// No structure change: same first-look shell, same pages, same navigation.
// ---------- 1) topbar: one neat aligned cluster (clock, theme, bell, avatar) ----------
function layoutTop15() {
try {
let top = document.querySelector('.top'); if (!top || !me) return;
let acts = document.getElementById('topActs');
if (!acts) { acts = document.createElement('div'); acts.id = 'topActs'; top.appendChild(acts); }
// save chip (kept, subtle, first in the cluster)
let chip = document.getElementById('savechip');
if (chip && chip.parentElement !== acts) acts.appendChild(chip);
// clock: rebuild once with clean formatting (no ticking seconds, explicit Arabic date)
let clk = document.getElementById('clock');
if (clk && clk.parentElement !== acts) acts.appendChild(clk);
// theme toggle into the cluster, styled like the bell
let tb = document.getElementById('themeBtn');
if (tb && tb.parentElement !== acts) acts.appendChild(tb);
let nt = document.getElementById('ntWrap');
if (nt && nt.parentElement !== acts) acts.appendChild(nt);
let av = document.getElementById('avWrap');
if (av && av.parentElement !== acts) acts.appendChild(av);
} catch (e) { console.warn('top15', e); }
}
// ---------- 2) notifications: everything can be marked as read / dismissed ----------
function seenStore15() { if (!db.alertSeen) db.alertSeen = {}; if (!db.alertSeen[me.id]) db.alertSeen[me.id] = []; return db.alertSeen[me.id]; }
function paintNotif15() {
let m2 = document.getElementById('ntMenu'); if (!m2 || !me) return;
let list = (window._nt ? _nt.list() : []).slice(0, 12);
let seen = seenStore15();
let alerts = (typeof notices === 'function' ? notices() : []).filter(([a, b]) => !seen.includes(a + '|' + b));
let h = `<div class="ntHead"><span>الإشعارات والتنبيهات</span><button type="button" class="text-btn" id="ntAll15">تعيين الكل كمقروء ✓</button></div>`;
if (alerts.length) h += `<div class="ntSec">تنبيهات تحتاج انتباهك</div>` + alerts.map(([a, b]) =>
`<div class="ntItem alert"><i class="dot warn"></i><span class="ntTx"><b>${esc(a)}</b><small>${esc(b)}</small></span><button type="button" class="ntX" data-k="${esc(a)}|${esc(b)}" title="تمت الرؤية">✓</button></div>`).join('');
h += `<div class="ntSec">آخر التحديثات</div>`;
h += list.length ? list.map(n => {
let un = !n.read.includes(me.id);
return `<button type="button" class="ntItem ${un ? 'un' : ''}" data-id="${n.id}"><i class="dot ${n.type || 'info'}"></i><span class="ntTx"><b>${esc(n.t)}</b><small>${esc(n.b || '')}</small><em>${ago(n.at)}</em></span></button>`;
}).join('') : '<div class="ntEmpty">لا توجد إشعارات بعد. ستظهر هنا طلبات المراجعة والاعتمادات.</div>';
m2.innerHTML = h;
m2.querySelectorAll('button.ntItem').forEach(x => x.onclick = () => {
let n = _nt.store().find(y => y.id === x.dataset.id);
if (n && !n.read.includes(me.id)) { n.read.push(me.id); save(); }
m2.hidden = true; if (n && n.go && typeof go === 'function') go(n.go);
});
m2.querySelectorAll('.ntX').forEach(x => x.onclick = ev => {
ev.stopPropagation();
let s = seenStore15(); if (!s.includes(x.dataset.k)) s.push(x.dataset.k);
save(); paintNotif15(); badge15();
});
let all = m2.querySelector('#ntAll15');
if (all) all.onclick = ev => {
ev.stopPropagation();
_nt.list().forEach(n => { if (!n.read.includes(me.id)) n.read.push(me.id); });
let s = seenStore15();
(typeof notices === 'function' ? notices() : []).forEach(([a, b]) => { let k = a + '|' + b; if (!s.includes(k)) s.push(k); });
save(); paintNotif15(); badge15();
};
}
function badge15() {
let bd = document.getElementById('ntBadge'); if (!bd || !me) return;
let un = window._nt ? _nt.list().filter(n => !n.read.includes(me.id)).length : 0;
let seen = seenStore15();
let al = (typeof notices === 'function' ? notices() : []).filter(([a, b]) => !seen.includes(a + '|' + b)).length;
let t = un + al;
bd.hidden = !t; if (t) bd.textContent = t > 9 ? '9+' : t;
}
function wireNotif15() {
let btn = document.getElementById('ntBtn'); if (!btn) return;
btn.onclick = ev => {
ev.stopPropagation();
let m2 = document.getElementById('ntMenu'); if (!m2) return;
m2.hidden = !m2.hidden; if (!m2.hidden) paintNotif15();
};
}
// ---------- 3) dashboard: concise status strip instead of the next-exam card ----------
const _dash15 = dashboard;
dashboard = function () {
let h = _dash15();
if (page !== 'dashboard') return h;
try {
let e = active(); if (!e) return h;
let all = programs().length;
let tk = Object.values(e.tasks || {});
let ok = tk.filter(t => ['معتمد', 'منشور'].includes(t.status)).length;
let p = all ? Math.round(ok / all * 100) : 0;
let rev = tk.filter(t => t.status === 'مرسل للمراجعة').length;
let pending = programs().filter(x => { let t = (e.tasks || {})[x.key]; return !t || !['معتمد', 'منشور'].includes(t.status); });
let miss = pending.length ? `متبقٍ ${pending.length}: ${pending.slice(0, 3).map(x => esc(x.name)).join('، ')}${pending.length > 3 ? ' وغيرها' : ''}` : 'اكتمل اعتماد كل البرامج';
let strip = `<div class="dstatus no-print"><span class="ds-it"><b>${all}</b> جدولاً مطلوباً</span><span class="ds-it"><b>${tk.length}</b> أُنشئ</span><span class="ds-it ok"><b>${ok} (${p}%)</b> معتمد</span>${rev ? `<span class="ds-it warn"><b>${rev}</b> بانتظار المراجعة</span>` : ''}<span class="ds-it ${pending.length ? 'warn' : 'ok'}">${miss}</span></div>`;
let i = h.indexOf('</div>', h.indexOf('class="hero"'));
let j = h.indexOf('<div class="stats"');
if (j > -1) h = h.slice(0, j) + strip + h.slice(j);
} catch (e2) { console.warn('dstatus', e2); }
return h;
};
// ---------- 4) release settings: clear saved state with an edit option ----------
let _setupEdit15 = false;
const _setup15 = setup;
setup = function () {
let e = typeof active === 'function' ? active() : null;
if (!e || _setupEdit15) return _setup15();
let planned = Object.values(e.levelPlans || {}).reduce((n, x) => n + ((x.days || []).length) * ((x.periods || []).length), 0);
let row = (k, v) => `<div class="svrow"><span>${k}</span><b>${esc(String(v == null ? '—' : v))}</b></div>`;
return head('إعداد الإصدار', 'إعدادات الإصدار الحالي محفوظة وتعمل. عدّلها فقط عند الحاجة.', `<button onclick="setupEdit15()">تعديل الإعدادات</button><button class="light" onclick="newEdition()">＋ إصدار جديد</button><button class="light" onclick="archive()">أرشفة الإصدار</button>`) +
`<section class="panel savedstate"><div class="svhead"><span class="svok">✓ محفوظ</span><div><h2 style="margin:0">${esc(e.name)}</h2><p class="muted" style="margin:2px 0 0">${esc(e.year)} • ${esc(e.semester)} • ${esc(e.type || '')}</p></div></div>
<div class="svgrid">${row('تاريخ البداية', e.start)}${row('أيام الامتحانات المختارة', (e.days || []).length + ' أيام')}${row('الفترات اليومية', (e.periods || []).length)}${row('الإجازات الرسمية', (e.holidays || []).length)}${row('مواعيد المستويات الأسبوعية', planned)}${row('المهام المسندة', Object.keys(e.assign || {}).length + ' من ' + programs().length)}</div>
<div class="notice" style="margin-top:14px">أي تعديل هنا يسري على الإصدار الحالي فور حفظه، وتبقى الجداول المعتمدة كما هي ما لم تتغير الأيام أو الفترات المرتبطة بها.</div></section>`;
};
function setupEdit15() { _setupEdit15 = true; step = 1; render(); }
window.setupEdit15 = setupEdit15;
const _ns15 = nextStep;
nextStep = function () { let was = step; _ns15(); if (was === 5) { _setupEdit15 = false; } };
// ---------- hook ----------
const _r15 = render;
render = function () {
_r15();
try { layoutTop15(); wireNotif15(); badge15(); } catch (e) { console.warn('ext15', e); }
};
// ext16: FOS-portal style login screens + PBKDF2 verification with transparent migration.
// lpShowAuth/lpShowHome live in the base page so they exist even when this file is cached-stale.
// login: per-browser lockout (unchanged) + PBKDF2 verify + legacy hash migration.
// a failed username costs one PBKDF2 derive too, so timing does not reveal which usernames exist.
login = function () {
(async () => {
if (!db) return;
mig9();
var auth = document.getElementById('lp-auth');
if (auth && auth.classList.contains('hidden')) { lpShowAuth(); return; }
let now = Date.now();
if (db.sec.until > now) {
let m = Math.ceil((db.sec.until - now) / 60000);
$('#loginerr').textContent = 'محاولات كثيرة فاشلة. حاول بعد ' + m + ' دقيقة.';
$('#loginerr').classList.remove('hidden');
return;
}
let u = $('#lu').value.trim(), plain = $('#lp').value;
let x = db.users.find(a => a.username === u && a.active);
let ok = false;
if (x) { try { ok = await verifyPass(x.password, plain); } catch (e) { ok = false; } }
else { try { await pbkdf2Bits(plain, crypto.getRandomValues(new Uint8Array(16)), 150000); } catch (e) {} }
if (!x || !ok) {
db.sec.fails++;
if (db.sec.fails >= 5) { db.sec.until = Date.now() + 5 * 60000; db.sec.fails = 0; log('قفل تسجيل الدخول مؤقتًا بعد محاولات فاشلة'); }
save();
$('#loginerr').textContent = db.sec.until > Date.now() ? 'تم قفل تسجيل الدخول 5 دقائق بعد 5 محاولات فاشلة.' : 'بيانات الدخول غير صحيحة أو الحساب غير نشط';
$('#loginerr').classList.remove('hidden');
return;
}
if (typeof x.password === 'string' && x.password.indexOf('pbkdf2$') !== 0) { try { x.password = await hash(plain); log('ترقية تخزين كلمة المرور إلى PBKDF2'); } catch (e) {} }
db.sec.fails = 0; db.sec.until = 0;
me = x; x.last = new Date().toLocaleString('ar-EG');
log('تسجيل الدخول');
$('#login').classList.add('hidden'); $('#app').classList.remove('hidden');
$('#who').textContent = me.name; $('#role').textContent = roleName(me.role);
page = menu()[0] ? menu()[0][0] : 'published';
save(); render();
})();
};
// ===== FOS advising-platform parity: welcome & farewell glass screens (Nov 25 v2) =====
function showGreeting(kind, name, done) {
  const old = document.getElementById('greet-overlay');
  if (old) old.remove();
  const ov = document.createElement('div');
  ov.id = 'greet-overlay';
  ov.className = 'greet-overlay';
  ov.setAttribute('role', 'status');
  const bg = (typeof CAMPUS1 !== 'undefined' && CAMPUS1) ? CAMPUS1 : '';
  if (bg) ov.style.background = "url('" + bg + "') center / cover no-repeat, linear-gradient(135deg,#0c1e36 0%,#123250 60%,#0f766e 130%)";
  else ov.style.background = 'linear-gradient(135deg,#0c1e36 0%,#123250 60%,#0f766e 130%)';
  const lu = (typeof LOGO_U !== 'undefined') ? LOGO_U : '';
  const lf = (typeof LOGO_F !== 'undefined') ? LOGO_F : '';
  ov.innerHTML = '<div class="greet-box"><div class="greet-brand"><img class="greet-logo" src="' + lu + '" alt="" /><div class="greet-brand-titles"><div class="greet-brand-title">منصة إدارة جداول الامتحانات</div><div class="greet-brand-sub">كلية العلوم · جامعة سوهاج</div></div><img class="greet-logo" src="' + lf + '" alt="" /></div><div class="greet-word">' + (kind === 'bye' ? 'وداعاً' : 'أهلاً') + '</div>' + (name ? '<div class="greet-name">' + esc(name) + '</div>' : '') + '</div>';
  document.body.appendChild(ov);
  requestAnimationFrame(() => ov.classList.add('show'));
  window.setTimeout(() => {
    ov.classList.remove('show');
    window.setTimeout(() => ov.remove(), 400);
    if (typeof done === 'function') done();
  }, kind === 'bye' ? 1500 : 1800);
}
function fosCurrentName() { const w = document.getElementById('who'); return w ? (w.textContent || '').trim() : ''; }
login = (function (_l) {
  return function () {
    const r = _l.apply(this, arguments);
    let n = 0;
    const t = setInterval(() => {
      n++;
      const le = document.getElementById('login'), ap = document.getElementById('app');
      if (le && ap && le.classList.contains('hidden') && !ap.classList.contains('hidden')) {
        clearInterval(t);
        showGreeting('hi', fosCurrentName());
      } else if (n > 60) clearInterval(t);
    }, 100);
    return r;
  };
})(login);
logout = (function (_g) {
  return function () {
    showGreeting('bye', fosCurrentName());
    return _g.apply(this, arguments);
  };
})(logout);

// ===== Advising-style grouped sidebar (Nov 25 v7e) =====
const FOS_GROUPS = [
  ['الرئيسية', ['dashboard']],
  ['الإصدار والتوزيع', ['setup', 'assign', 'alloc', 'observers', 'rooms']],
  ['الجداول والاعتماد', ['tracking', 'review', 'published', 'reports']],
  ['النظام', ['users', 'settings', 'logs', 'roadmap']]
];
function fosKeyOf(b) { const oc = b.getAttribute('onclick') || ''; const m = /go\('([^']+)'\)/.exec(oc); return m ? m[1] : ''; }
buildTabs = function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const side = document.querySelector('.side');
  if (side && getComputedStyle(side).display === 'none') side.style.display = 'flex';
  const nt = side ? side.querySelector('.navtitle') : null;
  const host = nt ? nt.parentElement : null;
  if (host && nav.parentElement !== host) host.appendChild(nav);
  if (nt) nt.style.display = 'none';
  const mw = document.getElementById('tabMoreWrap');
  if (mw) mw.style.display = 'none';
  const btns = [...nav.querySelectorAll('button')];
  if (!btns.length) return;
  const c = (typeof counts === 'function') ? counts() : {};
  btns.forEach(b => {
    b.style.display = '';
    const old = b.querySelector('.tbadge'); if (old) old.remove();
    const bd = (typeof badgeFor === 'function') ? badgeFor(fosKeyOf(b), c) : '';
    if (bd) b.insertAdjacentHTML('beforeend', bd);
  });
  nav.querySelectorAll('.side-grp-title').forEach(t => t.remove());
  const byKey = {};
  btns.forEach(b => { const k = fosKeyOf(b); if (k && !byKey[k]) byKey[k] = b; });
  const placed = new Set();
  for (const [title, keys] of FOS_GROUPS) {
    const present = keys.map(k => byKey[k]).filter(Boolean);
    if (!present.length) continue;
    const h = document.createElement('div');
    h.className = 'side-grp-title';
    h.textContent = title;
    nav.appendChild(h);
    present.forEach(b => { nav.appendChild(b); placed.add(fosKeyOf(b)); });
  }
  const rest = btns.filter(b => { const k = fosKeyOf(b); return k && !placed.has(k); });
  if (rest.length) {
    const h = document.createElement('div');
    h.className = 'side-grp-title';
    h.textContent = 'أخرى';
    nav.appendChild(h);
    rest.forEach(b => nav.appendChild(b));
  }
};
function fosWireSidebar() {
  const side = document.querySelector('.side');
  if (!side || side._fosWired) return;
  side._fosWired = true;
  const bd = document.getElementById('sideBackdrop');
  const setOpen = (open) => { side.classList.toggle('open', open); if (bd) bd.style.display = open ? 'block' : 'none'; };
  const burger = [...document.querySelectorAll('.top button')].find(b => b.textContent.indexOf('☰') >= 0);
  if (burger) burger.onclick = () => setOpen(!side.classList.contains('open'));
  if (bd) bd.onclick = () => setOpen(false);
  const sc = side.querySelector('.side-close');
  if (sc) sc.onclick = () => setOpen(false);
}
if (typeof window.buildBrand === 'undefined') { window.buildBrand = function () {}; }
try { layoutTop15 = function () {}; } catch (e) {}
fosWireSidebar();
const _fosRenderFinal = render;
render = function () {
  const r = _fosRenderFinal.apply(this, arguments);
  try { buildTabs(); } catch (e) {}
  return r;
};
try { buildTabs(); } catch (e) {}

// ===== v9b: advising-identical topbar + sidebar (non-destructive rebuild) =====
// Fixes v9 bugs: never wipes .top; neutralizes buildBrand (topBrand), the
// desktop tabs-in-topbar mover, and the #topActs cluster by relocating, not deleting.
try { buildAvatar = function () {}; } catch (e) {}
try { buildBrand = function () {}; } catch (e) {}
(function () {
  const AR_DAYS = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const toArD = s => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);
  function tick() {
    const t = document.getElementById('v9-clock-time'), d = document.getElementById('v9-clock-date');
    if (!t || !d) return;
    const n = new Date();
    d.textContent = AR_DAYS[n.getDay()] + '، ' + toArD(n.getDate()) + ' ' + AR_MONTHS[n.getMonth()] + ' ' + toArD(n.getFullYear());
    d.title = d.textContent;
    let h = n.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    const p2 = x => String(x).padStart(2, '0');
    t.textContent = p2(h) + ':' + p2(n.getMinutes()) + ':' + p2(n.getSeconds()) + ' ' + ap;
    t.setAttribute('datetime', n.toISOString());
  }
  setInterval(tick, 1000);
  function paintTheme() {
    const d = document.documentElement.dataset.theme === 'dark';
    const b = document.getElementById('themeBtn');
    if (b) { b.innerHTML = '<i class="fas ' + (d ? 'fa-sun' : 'fa-moon') + '"></i>'; b.title = d ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'; b.setAttribute('aria-pressed', String(d)); }
  }
  new MutationObserver(paintTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function fix() {
    const top = document.querySelector('.top'), side = document.querySelector('.side');
    if (!top || !side) return;
    const whoEl0 = document.getElementById('who');
    if (!whoEl0 || !whoEl0.textContent.trim()) return;
    // 1. advising topbar has no brand block
    const tb = document.getElementById('topBrand'); if (tb) tb.remove();
    const avw = document.getElementById('avWrap'); if (avw) avw.remove();
    // 2. nav lives in the sidebar
    const nav = document.getElementById('nav');
    const footer = side.querySelector('.sidebar-footer');
    if (nav) {
      let home = side.querySelector('.v9-nav-home');
      if (!home) { home = document.createElement('div'); home.className = 'v9-nav-home'; side.insertBefore(home, footer || null); }
      if (nav.parentElement !== home) home.appendChild(nav);
    }
    const tt = document.getElementById('topbarTabs'); if (tt) tt.remove();
    // 3. topbar: [start: menu-btn + title] + [tools: clock + savechip + theme + bell]
    let start = top.querySelector('.v9-top-start');
    if (!start) {
      start = document.createElement('div'); start.className = 'v9-top-start';
      const menuBtn = document.createElement('button');
      menuBtn.type = 'button'; menuBtn.id = 'menu-btn'; menuBtn.className = 'v9-icon-btn';
      menuBtn.title = 'طي قائمة التنقل'; menuBtn.setAttribute('aria-label', 'طي قائمة التنقل');
      menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      menuBtn.onclick = () => {
        if (innerWidth <= 900) { side.classList.toggle('open'); const bd = document.getElementById('sideBackdrop'); if (bd) bd.style.display = side.classList.contains('open') ? 'block' : 'none'; }
        else document.body.classList.toggle('v9-side-collapsed');
      };
      start.appendChild(menuBtn);
      const tw0 = document.createElement('div'); tw0.className = 'v9-title-wrap';
      start.appendChild(tw0);
    }
    const tw = start.querySelector('.v9-title-wrap');
    const pt = document.getElementById('pagetitle');
    if (pt && pt.parentElement !== tw) { pt.classList.add('topbar-title'); pt.style.display = ''; tw.appendChild(pt); }
    const ed = document.getElementById('editionlabel');
    if (ed && ed.parentElement !== tw) { ed.classList.add('v9-topsub'); tw.appendChild(ed); }
    let tools = top.querySelector('.topbar-tools');
    if (!tools) {
      tools = document.createElement('div'); tools.className = 'topbar-tools';
      const clock = document.createElement('div'); clock.className = 'portal-clock';
      clock.setAttribute('role', 'group'); clock.setAttribute('aria-label', 'التاريخ والوقت بالتقويم الميلادي');
      clock.innerHTML = '<span class="portal-clock-date-wrap"><i class="fas fa-calendar-days" aria-hidden="true"></i><span class="portal-clock-date" id="v9-clock-date"></span><span class="portal-clock-calendar">ميلادي</span></span><span class="portal-clock-divider" aria-hidden="true"></span><span class="portal-clock-time-wrap"><i class="fas fa-clock" aria-hidden="true"></i><time class="portal-clock-time" id="v9-clock-time" dir="ltr"></time></span>';
      tools.appendChild(clock);
    }
    const chip = document.getElementById('savechip'); if (chip && chip.parentElement !== tools) tools.appendChild(chip);
    let tbtn = document.getElementById('themeBtn');
    if (!tbtn) { tbtn = document.createElement('button'); tbtn.type = 'button'; tbtn.id = 'themeBtn'; tbtn.onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); }
    tbtn.className = 'theme-toggle-btn';
    if (tbtn.parentElement !== tools) tools.appendChild(tbtn);
    const nt = document.getElementById('ntWrap');
    if (nt && nt.parentElement !== tools) tools.appendChild(nt);
    const ntb = document.getElementById('ntBtn'); if (ntb) ntb.classList.add('notif-bell-btn');
    // 4. leftover .top children (old buttons etc.): keep dropdown panels, hide the rest
    [...top.children].forEach(c => {
      if (c === start || c === tools) return;
      if (c.id === 'topActs') { c.remove(); return; }
      if (/panel|menu|dropdown/i.test(c.id || '') || /panel|menu|dropdown/i.test(String(c.className))) { if (c.parentElement !== tools) tools.appendChild(c); return; }
      if (c.tagName === 'BUTTON' || c.tagName === 'DIV' || c.tagName === 'SPAN') c.style.display = 'none';
    });
    if (start.parentElement !== top) top.insertBefore(start, top.firstChild);
    if (tools.parentElement !== top) top.appendChild(tools);
    // 5. sidebar footer: account card + actions
    const prof = side.querySelector('.profile');
    if (prof && !side.querySelector('.sidebar-footer')) {
      const f = document.createElement('div'); f.className = 'sidebar-footer';
      const acc = document.createElement('div'); acc.className = 'sidebar-account';
      const av = prof.querySelector('#av');
      const meta = document.createElement('div'); meta.className = 'sidebar-account-meta';
      const wEl = prof.querySelector('#who'), rEl = prof.querySelector('#role');
      if (av) { av.classList.add('sidebar-avatar'); acc.appendChild(av); }
      if (wEl) meta.appendChild(wEl);
      if (rEl) meta.appendChild(rEl);
      acc.appendChild(meta); f.appendChild(acc);
      const mk = (cls, icon, label, fn) => { const b = document.createElement('button'); b.type = 'button'; b.className = cls; b.innerHTML = '<i class="fas ' + icon + '"></i> ' + label; b.onclick = fn; return b; };
      f.appendChild(mk('sidebar-profile-action', 'fa-box-archive', 'تصدير نسخة احتياطية', () => backup()));
      f.appendChild(mk('sidebar-profile-action', 'fa-key', 'تغيير كلمة المرور', () => changePassword()));
      f.appendChild(mk('sidebar-logout', 'fa-sign-out-alt', 'تسجيل الخروج', () => logout()));
      side.appendChild(f);
      prof.remove();
      const bottom = side.querySelector('.sidebottom'); if (bottom) bottom.remove();
    }
    // 6. sidebar nav groups (advising style, collapsible)
    if (nav) {
      nav.querySelectorAll('.nav-group').forEach(g => { const it = g.querySelector('.nav-group-items'); if (it) [...it.children].forEach(b => nav.appendChild(b)); g.remove(); });
      const titles = [...nav.querySelectorAll('.side-grp-title')];
      for (const t of titles) {
        const g = document.createElement('div'); g.className = 'nav-group';
        const items = document.createElement('div'); items.className = 'nav-group-items';
        const moved = []; let n = t.nextElementSibling;
        while (n && !n.classList.contains('side-grp-title')) { moved.push(n); n = n.nextElementSibling; }
        moved.forEach(b => items.appendChild(b));
        const tgl = document.createElement('button'); tgl.type = 'button'; tgl.className = 'nav-group-toggle'; tgl.setAttribute('aria-expanded', 'false');
        tgl.innerHTML = '<span class="nav-group-title"></span><span class="nav-group-count">' + moved.length + '</span><i class="fas fa-chevron-down nav-group-chevron"></i>';
        tgl.querySelector('.nav-group-title').textContent = t.textContent;
        tgl.onclick = () => { const ex = g.classList.toggle('expanded'); tgl.setAttribute('aria-expanded', String(ex)); };
        t.replaceWith(g); g.appendChild(tgl); g.appendChild(items);
        if (items.querySelector('button.active')) { g.classList.add('expanded'); tgl.setAttribute('aria-expanded', 'true'); }
      }
      if (!nav.querySelector('.nav-group.expanded')) { const g = nav.querySelector('.nav-group'); if (g) { g.classList.add('expanded'); g.querySelector('.nav-group-toggle').setAttribute('aria-expanded', 'true'); } }
      nav.querySelectorAll('button:not(.nav-group-toggle)').forEach(b => b.classList.add('nav-item'));
    }
    tick(); paintTheme();
  }
  const _r9b = render;
  render = function () { const r = _r9b.apply(this, arguments); try { fix(); } catch (e) { console.warn('v9b', e); } return r; };
  try { fix(); } catch (e) {}
})();
