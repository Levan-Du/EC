!function(n){function t(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return n[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var e={};t.m=n,t.c=e,t.i=function(n){return n},t.d=function(n,e,o){t.o(n,e)||Object.defineProperty(n,e,{configurable:!1,enumerable:!0,get:o})},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="/",t(t.s=19)}({19:function(n,t,e){"use strict";var o=function(){var n=r();u(n<412?12:n<640?16:n<1e3?20:24)},r=function(){return document.body.clientWidth||document.documentElement.clientWidth},u=function(n){var t=document.getElementsByTagName("html")[0],e=t.style.fontSize=n+"px";console.log(e)};window.onload=function(n){o()}}});