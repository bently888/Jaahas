(this["webpackJsonpjaahas-client"]=this["webpackJsonpjaahas-client"]||[]).push([[0],{21:function(e,t,n){e.exports=n(59)},26:function(e,t,n){},27:function(e,t,n){},59:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),i=n(19),o=n.n(i),c=(n(26),n(7)),l=n(20),s=n(2),u=(n(27),n(3)),m=n.n(u),f=n(6),d=n.n(f),p=[{name:"Blanko",url:"/blanko",lunchUrl:"https://blanko.net/lounas"},{name:"Di Trevi",url:"/ditrevi",lunchUrl:"https://ditrevi.fi/lounas/"},{name:"Fontana",url:"/fontana",lunchUrl:"https://www.fontana.fi/lunch/"},{name:"Tint\xe5",url:"/tinta",lunchUrl:"https://www.tinta.fi/lounas"}],h=["00","05","10","15","20","25","30","35","40","45","50","55"],v=["10","11","12","13"].map((function(e){return h.map((function(t){return e+":"+t}))})).flat(),b=new Date,g=5===b.getDay(),w=(b.getHours()+":"+b.getMinutes()+":"+b.getSeconds()).split(":"),E=60*+w[0]*60+60*+w[1]+ +w[2];var k=function(){var e=Object(a.useState)([]),t=Object(s.a)(e,2),n=t[0],i=t[1],o=Object(a.useState)(""),u=Object(s.a)(o,2),f=u[0],h=u[1],b=Object(a.useState)([]),w=Object(s.a)(b,2),k=w[0],j=w[1],O=Object(a.useState)(""),y=Object(s.a)(O,2),N=y[0],S=y[1],U=Object(a.useState)(),C=Object(s.a)(U,2),x=C[0],T=C[1],A=Object(a.useState)(!1),W=Object(s.a)(A,2),D=W[0],J=W[1];Object(a.useEffect)((function(){p.forEach((function(e){m.a.get(e.url).then((function(t){return i((function(n){return[].concat(Object(l.a)(n),[Object(c.a)(Object(c.a)({},t),{},{name:e.name,lunchUrl:e.lunchUrl})])}))}))})),m.a.get("/reservations").then((function(e){return j(e.data)}));var e=localStorage.getItem("userData");S(e||"")}),[]);var M=function(e){var t=e.split(":");return 60*+t[0]*60+60*+t[1]};return r.a.createElement("div",{className:"App"},r.a.createElement("h1",{className:"main-title"},"Jaahas App"),r.a.createElement("button",{className:"show-tomorrow",disabled:g,onClick:function(){return J(!D)}},D?"today":"tomorrow"),r.a.createElement("div",{className:"selectUserName"},r.a.createElement("h3",null,"Set Username"),r.a.createElement("div",{className:"name-input"},r.a.createElement("input",{type:"text",name:"name",value:N,onChange:function(e){localStorage.setItem("userData",e.target.value),S(e.target.value)}}))),r.a.createElement("div",{className:"times-chosen"},0!==k.length?k.map((function(e){return r.a.createElement("p",{key:e.time+e.resta},e.resta," at ",e.time,"-",r.a.createElement("button",{onClick:function(){return t=e,void(k.some((function(e){return e.participants.includes(N)}))?alert("You are already in another lunch train"):m.a.post("/join",{time:t.time,resta:t.resta,user:N}).then((function(e){return j(e.data)})));var t},disabled:N.length<1||k.some((function(e){return e.participants.indexOf(N)>-1}))},"join train"),e.participants.join(", "))})):"",r.a.createElement("button",{onClick:function(){return function(){if(k.some((function(e){return e.participants.indexOf(N)>-1})))var e=k.find((function(e){return e.participants.indexOf(N)>-1}));var t=e.participants.indexOf(N);e.participants.splice(t,1),m.a.post("/delete",{user:N}).then((function(e){return j(e.data)}))}()},disabled:!k.some((function(e){return e.participants.includes(N)}))},"delete")),r.a.createElement("div",{className:"alert-button"},r.a.createElement("button",{onClick:function(){if(x&&clearTimeout(x),k.some((function(e){return e.participants.includes(N)})))var e=k.find((function(e){return e.participants.includes(N)}));var t=e.time,n=M(t)-E;T(setTimeout((function(){d()({title:"Jaahas",subtitle:"jotain",message:"Ruokailu at "+e.resta,theme:"darkblue",tag:"Jaahas",requireInteraction:!0,native:!0}),alert("Sy\xf6m\xe4\xe4n!")}),1e3*n-18e4))},className:"button",disabled:!k.some((function(e){return e.participants.includes(N)}))},"Alert")),r.a.createElement("div",{className:"restaurants-container"},n&&n.map((function(e){return r.a.createElement("div",{className:"restaurant",key:e.name},r.a.createElement("h2",null,r.a.createElement("a",{href:e.lunchUrl,rel:"nofollow"},e.name)),r.a.createElement("div",{className:"Menu",id:"Menu"},function(e){var t=["su","ma","ti","ke","to","pe","la"],n=(new Date).getDay();return e[D&&!1===g?t[n+1]:t[n]]}(e.data).map((function(e){return r.a.createElement("p",{key:e.food},e.food," ",e.price)}))),r.a.createElement("button",{onClick:function(){return h(e.name)},disabled:N.length<1},"Select Time"),f===e.name&&r.a.createElement("div",{className:"selectModal"},r.a.createElement("h2",null,"Select Time"),r.a.createElement("div",{className:"time-buttons"},v.map((function(t){return r.a.createElement("button",{key:t,className:"time-button",id:t,disabled:M(t)<E,onClick:function(){return function(e,t){k.some((function(n){return n.resta===t&&n.time===e}))?alert("Trat lunch train already exists"):k.some((function(e){return e.participants.indexOf(N)>-1}))?alert("You are already in another lunch train"):m.a.post("/reservations",{time:e,resta:t,participants:[N]}).then((function(e){j(e.data),h("")})).catch((function(e){console.error(e)}))}(t,e.name)}},t)}))),r.a.createElement("button",{onClick:function(){return h("")}},"close")))}))))},j=Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));function O(e,t){navigator.serviceWorker.register(e).then((function(e){e.onupdatefound=function(){var n=e.installing;null!=n&&(n.onstatechange=function(){"installed"===n.state&&(navigator.serviceWorker.controller?(console.log("New content is available and will be used when all tabs for this page are closed. See https://bit.ly/CRA-PWA."),t&&t.onUpdate&&t.onUpdate(e)):(console.log("Content is cached for offline use."),t&&t.onSuccess&&t.onSuccess(e)))})}})).catch((function(e){console.error("Error during service worker registration:",e)}))}o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(f.Notifications,null),r.a.createElement(k,null)),document.getElementById("root")),function(e){if("serviceWorker"in navigator){if(new URL("",window.location.href).origin!==window.location.origin)return;window.addEventListener("load",(function(){var t="".concat("","/service-worker.js");j?(!function(e,t){fetch(e,{headers:{"Service-Worker":"script"}}).then((function(n){var a=n.headers.get("content-type");404===n.status||null!=a&&-1===a.indexOf("javascript")?navigator.serviceWorker.ready.then((function(e){e.unregister().then((function(){window.location.reload()}))})):O(e,t)})).catch((function(){console.log("No internet connection found. App is running in offline mode.")}))}(t,e),navigator.serviceWorker.ready.then((function(){console.log("This web app is being served cache-first by a service worker. To learn more, visit https://bit.ly/CRA-PWA")}))):O(t,e)}))}}()}},[[21,1,2]]]);
//# sourceMappingURL=main.5d0f9d91.chunk.js.map