if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let o={};const t=e=>i(e,l),c={module:{uri:l},exports:o,require:t};s[l]=Promise.all(n.map((e=>c[e]||t(e)))).then((e=>(r(...e),o)))}}define(["./workbox-87098c68"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.69025434.js",revision:null},{url:"assets/index.6ab03930.css",revision:null},{url:"assets/picx-config.8df2877f.js",revision:null},{url:"assets/picx-config.f71816f7.css",revision:null},{url:"assets/vendor.91ab84e9.css",revision:null},{url:"assets/vendor.9cd0ebcb.js",revision:null},{url:"index.html",revision:"5080cb0d87b6affa1caa161a4793d5ac"},{url:"pluginWebUpdateNotice/webUpdateNoticeInjectScript.global.59ee15dc.js",revision:null},{url:"pluginWebUpdateNotice/webUpdateNoticeInjectStyle.efdbdf2b.css",revision:null},{url:"registerSW.js",revision:"402b66900e731ca748771b6fc5e7a068"},{url:"./logo@192x192.png",revision:"04b357520a0d52eeef26e65170bac83f"},{url:"./logo@512x512.png",revision:"5830f0d36bc66261c4059e289d46ae44"},{url:"manifest.webmanifest",revision:"3b28338b24629573ffcd2975cee28680"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
