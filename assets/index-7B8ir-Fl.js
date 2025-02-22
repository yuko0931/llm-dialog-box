import{d as m,r as x,j as y,c as l,a as n,B as _,w as k,t as u,x as B,o as r,_ as z,E as C}from"./index-CCyrc4BV.js";const M={class:"file-view"},F={key:0,class:"parsing-spinner"},S=["src"],E={class:"file-detail"},G={class:"file-name"},L={key:0,class:"file-size"},b={key:1,class:"file-size"},j=m({__name:"UploadFileView",props:{id:{type:String},name:{type:String},size:{type:String},isparsing:{type:Boolean}},emits:["delete-file"],setup(e,{emit:s}){const o=x(!1),t=y(()=>{var c,f,v;const p="/img/",i=["jpg","png","gif","webp","bmp","pcd","tiff"],d=((v=(f=(c=a.name)==null?void 0:c.toLowerCase())==null?void 0:f.split("."))==null?void 0:v.pop())||"",w=i.includes(d)?"img":"file";return p+w+".svg"}),a=e,g=s,h=()=>{g("delete-file",a.name)};return(p,i)=>(r(),l("div",{class:"file-item",onMouseenter:i[0]||(i[0]=d=>o.value=!0),onMouseleave:i[1]||(i[1]=d=>o.value=!1)},[n("div",M,[e.isparsing?(r(),l("img",{key:1,src:t.value,alt:"file"},null,8,S)):(r(),l("div",F,i[2]||(i[2]=[_('<svg viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-icon="spin" data-v-e2aaf144><defs data-v-e2aaf144><linearGradient x1="0%" y1="100%" x2="100%" y2="100%" id="linearGradient-1" data-v-e2aaf144><stop stop-color="currentColor" stop-opacity="0" offset="0%" data-v-e2aaf144></stop><stop stop-color="currentColor" stop-opacity="0.50" offset="39.9430698%" data-v-e2aaf144></stop><stop stop-color="currentColor" offset="100%" data-v-e2aaf144></stop></linearGradient></defs><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" data-v-e2aaf144><rect fill-opacity="0.01" fill="none" x="0" y="0" width="36" height="36" data-v-e2aaf144></rect><path d="M34,18 C34,9.163444 26.836556,2 18,2 C11.6597233,2 6.18078805,5.68784135 3.59122325,11.0354951" stroke="url(#linearGradient-1)" stroke-width="4" stroke-linecap="round" data-v-e2aaf144></path></g></svg>',1)])))]),n("div",E,[n("div",G,u(a.name),1),e.isparsing?(r(),l("div",L,u(a.size),1)):(r(),l("div",b,"解析中...")),k(n("div",{class:"file-delete",onClick:h},i[3]||(i[3]=[n("svg",{width:"8",height:"8",viewBox:"0 0 8 8",fill:"none",xmlns:"http://www.w3.org/2000/svg"},[n("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M7.45.549a.777.777 0 0 1 0 1.098L1.648 7.451A.776.776 0 1 1 .55 6.353L6.353.55a.776.776 0 0 1 1.098 0z",fill:"#868686"}),n("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M.55.548a.776.776 0 0 1 1.097 0l5.804 5.805A.777.777 0 0 1 6.353 7.45L.549 1.646a.777.777 0 0 1 0-1.098z",fill:"#868686"})],-1)]),512),[[B,o.value]])])],32))}}),U=z(j,[["__scopeId","data-v-e2aaf144"]]);async function A(e){return await C.files.upload({file:e})}const V=e=>{if(e===0)return"0 B";const s=1024,o=["B","KB","MB","GB"],t=Math.floor(Math.log(e)/Math.log(s));return parseFloat((e/Math.pow(s,t)).toFixed(2))+" "+o[t]},I=e=>{var t,a;const s=["jpg","png","gif","webp","bmp","pcd","tiff"],o=((a=(t=e==null?void 0:e.toLowerCase())==null?void 0:t.split("."))==null?void 0:a.pop())||"";return s.includes(o)},$=e=>{let s="";const o=[];return e.forEach(t=>{t.type==="text"?s+=t.text:o.push({id:t.file_id,name:t.name,size:V(t.size)})}),{role:"user",content:s,files:o,content_type:"object_string"}};export{U,V as f,I as i,$ as r,A as u};
