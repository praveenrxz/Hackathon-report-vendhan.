const M=[
{id:1,n:"Chicken Biryani",c:"Rice",p:240,e:"🍛",h:28,b:"Bestseller",d:"Basmati rice slow-cooked with spiced chicken."},
{id:2,n:"Veg Fried Rice",c:"Rice",p:150,e:"🍚",h:45,b:"Veg",d:"Wok-tossed rice with fresh vegetables."},
{id:3,n:"Masala Dosa",c:"Tiffin",p:90,e:"🥞",h:38,b:"Veg",d:"Crisp dosa filled with potato masala."},
{id:4,n:"Idli Sambar",c:"Tiffin",p:60,e:"🍥",h:60,b:"Veg",d:"Four soft idlis with sambar and chutney."},
{id:5,n:"Paneer Butter Masala",c:"Curries",p:200,e:"🍲",h:15,b:"Popular",d:"Paneer in a creamy tomato gravy."},
{id:6,n:"Chicken Chettinad",c:"Curries",p:260,e:"🍗",h:8,b:"Spicy",d:"Peppery Chettinad-style chicken curry."},
{id:7,n:"Gulab Jamun",c:"Desserts",p:70,e:"🍮",h:350,b:"Sweet",d:"Warm milk dumplings in rose syrup."},
{id:8,n:"Filter Coffee",c:"Drinks",p:40,e:"☕",h:30,b:"Hot",d:"Strong South Indian filter coffee."},
{id:9,n:"Mango Lassi",c:"Drinks",p:80,e:"🥭",h:48,b:"Refreshing",d:"Chilled yogurt drink with mango."},
{id:10,n:"Curd Rice",c:"Rice",p:80,e:"🍚",h:100,b:"Veg",d:"Cool curd rice with pomegranate and tempering."},
{id:11,n:"Parotta Salna",c:"Tiffin",p:110,e:"🫓",h:35,b:"Popular",d:"Flaky layered parotta with spicy salna."},
{id:12,n:"Semiya Payasam",c:"Desserts",p:75,e:"🥣",h:42,b:"Sweet",d:"Vermicelli kheer with cardamom and cashews."}];
const AR=[["T. Nagar",4],["Anna Nagar",6],["Adyar",7],["Velachery",10],["OMR",12],["Tambaram",16]];
const $=i=>document.getElementById(i),CK="spice_cart_v1",WK="spice_wish_v1",AK="spice_area_v1";
const rd=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??f}catch(e){return f}};
const wr=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let cart=rd(CK,{}),wish=rd(WK,[]),cat="All",term="",area=Number(rd(AK,0))||0,tk=0;
if(typeof cart!=="object"||Array.isArray(cart))cart={};if(!Array.isArray(wish))wish=[];if(!AR[area])area=0;
const im=m=>`<img src="images/${m.n.toLowerCase().replace(/[^a-z]+/g,"-")}.jpg" alt="" loading="lazy" onerror="this.remove()">`,by=id=>M.find(m=>m.id==id),inr=n=>"₹"+n.toFixed(2),esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
function pills(){$("pills").innerHTML=["All",...new Set(M.map(m=>m.c))].map(c=>`<button class="pill" data-c="${c}" aria-pressed="${c===cat}">${c}</button>`).join("");$("ttl").textContent=cat==="All"?"Popular Dishes":cat}
function grid(){const L=M.filter(m=>(cat==="All"||m.c===cat)&&m.n.toLowerCase().includes(term));
$("grid").innerHTML=L.length?L.map(m=>`<div class="card"><div class="pic" style="--h:${m.h}">${im(m)}<span class="tag ${m.b}">${m.b}</span><button class="heart" data-w="${m.id}" aria-pressed="${wish.includes(m.id)}" aria-label="Save ${m.n}">♥</button><span aria-hidden="true">${m.e}</span></div><div class="ci"><h3>${m.n}</h3><div class="meta"><b>★ ${(4.2+m.id*7%8/10).toFixed(1)}</b><span>${15+m.id*3%16} min</span></div><p>${m.d}</p><div class="pr">${inr(m.p)}</div><button class="add" data-a="${m.id}">+ Add to cart</button></div></div>`).join(""):'<div class="none">No dishes found. Try another name or category.</div>'}
function draw(){const ids=Object.keys(cart);let t=0,c=0;
$("lines").innerHTML=ids.length?ids.map(k=>{const m=by(k),q=cart[k];t+=m.p*q;c+=q;return `<div class="ln"><div class="th" style="--h:${m.h}">${m.e}${im(m)}</div><div><b>${m.n}</b><div class="q"><button data-d="${k}" aria-label="Decrease ${m.n}">−</button>${q}<button data-i="${k}" aria-label="Increase ${m.n}">+</button></div></div><div class="rt"><button class="del" data-r="${k}" aria-label="Remove ${m.n}">🗑</button><span>${inr(m.p*q)}</span></div></div>`}).join(""):'<div class="empty">Your cart is empty. Add a dish to get started.</div>';
const fee=t>=300||!t?0:30;$("tt").textContent=inr(t+fee);$("fd").innerHTML=t>=300?`🎉 Free delivery unlocked<div class="bar"><i style="width:100%"></i></div>`:`Delivery ${inr(30)} · add ${inr(300-t)} more for free delivery<div class="bar"><i style="width:${t/3}%"></i></div>`;$("b1").textContent=$("b2").textContent=c;$("co").style.display=ids.length?"block":"none"}
function chg(id,d){cart[id]=(cart[id]||0)+d;if(cart[id]<=0)delete cart[id];wr(CK,cart);draw();if(d>0){toast("Added "+by(id).n+" ✓");bump()}}
function place(){const nm=$("nm").value.trim(),ph=$("ph").value.replace(/\s/g,""),ad=$("ad").value.trim();let ok=true;
$("e1").textContent=nm.length<2?(ok=false,"Enter your full name."):"";
$("e2").textContent=/^[6-9]\d{9}$/.test(ph)?"":(ok=false,"Enter a valid 10-digit mobile number.");
$("e3").textContent=ad.length<10?(ok=false,"Enter a full delivery address (at least 10 characters)."):"";
if(!ok)return;
let t=0;const rows=Object.keys(cart).map(k=>{const m=by(k);t+=m.p*cart[k];return `${m.n} × ${cart[k]} — ${inr(m.p*cart[k])}`});
$("done").innerHTML=`<div class="ok"><h3>Order placed, ${esc(nm)}!</h3>${rows.join("<br>")}<br><b>Delivery: ${t>=300?"Free":inr(30)}</b><br><b>Total: ${inr(t+(t>=300?0:30))}</b></div>`;
cart={};wr(CK,cart);["nm","ph","ad"].forEach(i=>$(i).value="");draw();track(ad);confetti();$("cart").scrollIntoView()}
function track(ad){const [an,km]=AR[area],id=++tk;
$("track").innerHTML=`<div class="trk"><svg viewBox="0 0 300 140" role="img" aria-label="Delivery route"><path id="rt" d="M40 105 Q120 15 260 40" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="6 5" opacity=".5"/><text x="26" y="118" font-size="22">🏪</text><text x="246" y="36" font-size="22">🏠</text><text id="sc" x="32" y="110" font-size="20">🛵</text><text x="10" y="135" font-size="9" fill="currentColor">Spice Route Kitchen</text><text x="200" y="70" font-size="9" fill="currentColor">${an}</text></svg><div id="st" role="status">Preparing your food…</div><small>ETA ${15+km*2} min · ${esc(ad)}<br>Demo simulation, not live GPS.</small></div>`;
setTimeout(()=>{if(id!==tk)return;$("st").textContent="Out for delivery to "+an;const p=$("rt"),L=p.getTotalLength(),t0=Date.now(),sc=$("sc");
(function mv(){if(id!==tk)return;const f=Math.min(1,(Date.now()-t0)/10000),pt=p.getPointAtLength(L*f);sc.setAttribute("x",pt.x-10);sc.setAttribute("y",pt.y+6);f<1?requestAnimationFrame(mv):$("st").textContent="Delivered! Enjoy your meal."})()},6000)}
document.addEventListener("click",e=>{const t=e.target.closest("button");if(!t)return;const g=a=>t.getAttribute(a);
if(g("data-a")){chg(g("data-a"),1);$("done").innerHTML=""}
else if(g("data-i"))chg(g("data-i"),1);else if(g("data-d"))chg(g("data-d"),-1);
else if(g("data-r")){delete cart[g("data-r")];wr(CK,cart);draw()}
else if(g("data-w")){const id=+g("data-w");wish=wish.includes(id)?wish.filter(x=>x!==id):[...wish,id];wr(WK,wish);grid()}
else if(g("data-c")){cat=g("data-c");pills();grid()}});
$("q").addEventListener("input",e=>{term=e.target.value.trim().toLowerCase();grid()});
$("va").onclick=()=>{cat="All";term="";$("q").value="";pills();grid()};
$("on").onclick=()=>$("menu").scrollIntoView();
$("hs").onclick=()=>{$("q").scrollIntoView({block:"center"});$("q").focus()};
$("hc").onclick=()=>$("cart").scrollIntoView();
$("po").onclick=place;
$("cl").onclick=()=>{cart={};wr(CK,cart);draw()};
$("area").innerHTML=AR.map((a,i)=>`<option value="${i}">${a[0]}, Chennai (${a[1]} km)</option>`).join("");$("area").value=area;
$("area").onchange=e=>{area=+e.target.value;wr(AK,area);$("lm").textContent=""};
$("gps").onclick=()=>{const m=$("lm");if(!navigator.geolocation){m.textContent="Location is not supported here. Choose your area.";return}
m.textContent="Finding your location…";
navigator.geolocation.getCurrentPosition(p=>{const la=p.coords.latitude.toFixed(4),lo=p.coords.longitude.toFixed(4);$("ad").value=`Current location (${la}, ${lo})`;m.textContent="Location added. Pick the nearest area for the delivery estimate."},()=>m.textContent="Could not get your location. Allow access or choose your area.",{timeout:8000})};
const tz=document.createElement("div");tz.className="toast";tz.setAttribute("role","status");document.body.appendChild(tz);let tt0;
function toast(x){tz.textContent=x;tz.classList.add("on");clearTimeout(tt0);tt0=setTimeout(()=>tz.classList.remove("on"),1600)}
function bump(){["b1","b2"].forEach(i=>{const b=$(i);b.classList.remove("bump");void b.offsetWidth;b.classList.add("bump")})}
function confetti(){const E=["🎉","🍛","✨","🌶️","🥭","🍕"];for(let i=0;i<30;i++){const c=document.createElement("span");c.className="cf";c.textContent=E[i%E.length];c.style.left=Math.random()*100+"%";c.style.fontSize=16+Math.random()*18+"px";c.style.animationDelay=Math.random()*.8+"s";document.body.appendChild(c);setTimeout(()=>c.remove(),3500)}}
let dk=matchMedia("(prefers-color-scheme: dark)").matches;
const ap=()=>{document.documentElement.dataset.theme=dk?"dark":"light";$("th").textContent=dk?"☀️":"🌙"};
$("th").onclick=()=>{dk=!dk;ap()};ap();
const HS=[1,3,10,5,7,12];let hi=0;
function hero(){const m=by(HS[hi]);document.querySelector(".hero .em").innerHTML=m.e+im(m);$("dots").innerHTML=HS.map((_,i)=>`<i class="${i===hi?"on":""}"></i>`).join("")}
hero();setInterval(()=>{hi=(hi+1)%HS.length;hero()},3500);
pills();grid();draw();
