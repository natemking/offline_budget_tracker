(()=>{"use strict";let t;const e=indexedDB.open("budget",1);function a(){const e=t.transaction(["pending"],"readwrite").objectStore("pending").getAll();e.onsuccess=function(){e.result.length>0&&fetch("/api/transaction/bulk",{method:"POST",body:JSON.stringify(e.result),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}}).then((t=>t.json())).then((()=>{t.transaction(["pending"],"readwrite").objectStore("pending").clear()}))}}let n,o;e.onupgradeneeded=function(t){t.target.result.createObjectStore("pending",{autoIncrement:!0})},e.onsuccess=function(e){t=e.target.result,navigator.onLine&&a()},e.onerror=function(t){console.log("Oh NO! "+t.target.errorCode)},window.addEventListener("online",a);const c=t=>{let e=t.slice().reverse(),a=0,o=e.map((t=>{let e=new Date(t.date);return"".concat(e.getMonth()+1,"/").concat(e.getDate(),"/").concat(e.getFullYear())})),c=e.map((t=>(a+=parseInt(t.value),a)));n&&n.destroy();let r=document.getElementById("myChart").getContext("2d");n=new Chart(r,{type:"line",data:{labels:o,datasets:[{label:"Total Over Time",fill:!0,backgroundColor:"#e0afa0",data:c}]},options:{responsive:!0}})},r=t=>{let e=[];t.forEach((t=>{"income"!==t.category&&e.push({[t.category]:t.value})}));const a=e.reduce(((t,e)=>{for(const[a,n]of Object.entries(e))t[a]||(t[a]=0),t[a]+=n;return t}),{});o&&o.destroy();const n=document.getElementById("myDonut").getContext("2d");o=new Chart(n,{type:"doughnut",data:{labels:Object.keys(a).reverse(),datasets:[{label:"Total Spending by Category",backgroundColor:["#463f3a","#8a817c","#758b69","#bcb8b1","#4f0113","#b991c9","#e0afa0","#c6949a","#a27f93","#7a6c86","#525a72","#2f4858","#006796","#546fa7","#9177a9","#ba84a4","#d4979e","#aac19d","#e56d4b","#f4f3ee"],data:Object.values(a).reverse()}]},options:{title:{display:!0,text:"Total Spending by Category",responsive:!0}}})},i=t=>{let e=t.reduce(((t,e)=>t+parseInt(e.value)),0);document.querySelector("#total").textContent=e},d=document.getElementById("tbody");let s,l,u,p=[];const y=e=>{let a=document.querySelector("#t-name"),n=document.querySelector("#t-cat"),o=document.querySelector("#t-amount"),d=document.querySelector(".form .error");if(""===a.value||""===n.value||""===o.value)return void(d.textContent="Missing Information");d.textContent="";let s={name:a.value.trim(),category:n.value.trim().toLowerCase(),value:o.value,date:(new Date).toISOString()};e||(s.value*=-1),p.unshift(s),c(p),r(p),g(),i(p),(async()=>{try{const t=await fetch("/api/transaction",{method:"POST",body:JSON.stringify(s),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}});(await t.json()).errors?d.textContent="Missing Information":a.value="",n.value="",o.value=""}catch(c){e=s,t.transaction(["pending"],"readwrite").objectStore("pending").add(e),a.value="",n.value="",o.value=""}var e})(),navigator.onLine&&location.reload()};function g(){d.innerHTML="",p.forEach((t=>{let e=document.createElement("tr");e.setAttribute("class","table-row"),e.innerHTML="\n            <td id=".concat(t._id,' data-type="date" class="td-data">\n                ').concat(t.date.slice(5,7),"/").concat(t.date.slice(8,10),"/").concat(t.date.slice(2,4),"\n            </td>\n            <td id=").concat(t._id,' data-type="name" class="td-data">\n                ').concat(t.name,"\n            </td>\n            <td id=").concat(t._id,' data-type="category" class="td-data">\n                ').concat(t.category.replace(/(^\w{1})|(\s+\w{1})/g,(t=>t.toUpperCase())),"\n            </td>\n            <td id=").concat(t._id,' data-type="value" class="td-data">$').concat(t.value,"\n                <span id=").concat(t._id,' class="delete">\n                    <i class="fa fa-times" aria-hidden="true"></i>\n                </span>\n            </td>\n        '),d.appendChild(e)}))}(async()=>{try{const t=await fetch("/api/transaction");p=await t.json(),i(p),g(),c(p),r(p)}catch(t){}})(),document.querySelector("#add-btn").onclick=function(){y(!0)},document.querySelector("#sub-btn").onclick=function(){y(!1)},d.addEventListener("click",(t=>{navigator.onLine&&(t=>{const e=t.target.closest("td");if("date"===e.dataset.type)return;void 0!==s&&(s.parentElement.innerHTML=l);const a=e.innerHTML,n=e.parentElement,o='<input type="text" id="'.concat(n.rowIndex," ").concat(e.cellIndex,'" size="10"/>');l=a,e.innerHTML=o,u=document.getElementById("".concat(n.rowIndex," ").concat(e.cellIndex)),s=u,u.focus(),u.addEventListener("keypress",(function(t){if("Enter"===t.key){let t;switch(e.dataset.type){case"name":t={name:u.value.trim()};break;case"category":t={category:u.value.trim().toLowerCase()};break;case"value":t={value:u.value}}(async()=>{try{const a=await fetch("/api/transaction/".concat(e.id),{method:"PUT",body:JSON.stringify(t),headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}});await a.json()}catch(t){}})(),location.reload()}}))})(t)})),document.addEventListener("click",(t=>{(t=>{d.contains(t.target)||void 0===s||(u.parentElement.innerHTML=l,l=void 0,s=void 0)})(t)})),d.addEventListener("click",(t=>{(t=>{if("I"===t.target.tagName){let e=t.target.parentNode.id;(async()=>{try{const t=await fetch("/api/transaction/".concat(e),{method:"DELETE",headers:{Accept:"application/json, text/plain, */*","Content-Type":"application/json"}});await t.json()}catch(t){}})(),location.reload()}})(t)}))})();