/*!
 * a-color-picker (https://github.com/narsenico/a-color-picker)
 *
 * Copyright (c) 2017-2018, Gianfranco Caldi.
 * Released under the MIT License.
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("AColorPicker",[],t):"object"==typeof exports?exports.AColorPicker=t():e.AColorPicker=t()}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function r(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,i){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(i,o,function(t){return e[t]}.bind(null,o));return i},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=1)}([function(e,t,r){"use strict";
/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */var i=r(3);function o(e){return!0===i(e)&&"[object Object]"===Object.prototype.toString.call(e)}e.exports=function(e){var t,r;return!1!==o(e)&&"function"==typeof(t=e.constructor)&&!1!==o(r=t.prototype)&&!1!==r.hasOwnProperty("isPrototypeOf")}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.VERSION=t.PALETTE_MATERIAL_CHROME=t.PALETTE_MATERIAL_500=t.COLOR_NAMES=t.getLuminance=t.intToRgb=t.rgbToInt=t.rgbToHsv=t.rgbToHsl=t.hslToRgb=t.rgbToHex=t.parseColor=t.parseColorToHsla=t.parseColorToHsl=t.parseColorToRgba=t.parseColorToRgb=t.from=t.createPicker=void 0;var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var i=t[r];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,r,i){return r&&e(t.prototype,r),i&&e(t,i),t}}(),o=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var r=[],i=!0,o=!1,s=void 0;try{for(var n,a=e[Symbol.iterator]();!(i=(n=a.next()).done)&&(r.push(n.value),!t||r.length!==t);i=!0);}catch(e){o=!0,s=e}finally{try{!i&&a.return&&a.return()}finally{if(o)throw s}}return r}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},s=r(2),n=l(r(0)),a=l(r(4));function l(e){return e&&e.__esModule?e:{default:e}}function c(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function h(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}
/*!
 * a-color-picker
 * https://github.com/narsenico/a-color-picker
 *
 * Copyright (c) 2017-2019, Gianfranco Caldi.
 * Released under the MIT License.
 */var u="undefined"!=typeof window&&window.navigator.userAgent.indexOf("Edge")>-1,p="undefined"!=typeof window&&window.navigator.userAgent.indexOf("rv:")>-1,d={id:null,attachTo:"body",showHSL:!0,showRGB:!0,showHEX:!0,showAlpha:!1,color:"#ff0000",palette:null,paletteEditable:!1,useAlphaInPalette:"auto",slBarSize:[232,150],hueBarSize:[150,11],alphaBarSize:[150,11]},f="COLOR",g="RGBA_USER",b="HSLA_USER";function v(e,t,r){return e?e instanceof HTMLElement?e:e instanceof NodeList?e[0]:"string"==typeof e?document.querySelector(e):e.jquery?e.get(0):r?t:null:t}function m(e){var t=e.getContext("2d"),r=+e.width,i=+e.height,n=t.createLinearGradient(1,1,1,i-1);return n.addColorStop(0,"white"),n.addColorStop(1,"black"),{setHue:function(e){var o=t.createLinearGradient(1,0,r-1,0);o.addColorStop(0,"hsla("+e+", 100%, 50%, 0)"),o.addColorStop(1,"hsla("+e+", 100%, 50%, 1)"),t.fillStyle=n,t.fillRect(0,0,r,i),t.fillStyle=o,t.globalCompositeOperation="multiply",t.fillRect(0,0,r,i),t.globalCompositeOperation="source-over"},grabColor:function(e,r){return t.getImageData(e,r,1,1).data},findColor:function(e,t,n){var a=(0,s.rgbToHsv)(e,t,n),l=o(a,3),c=l[1],h=l[2];return[c*r,i-h*i]}}}function A(e,t,r){return null===e?t:/^\s*$/.test(e)?r:!!/true|yes|1/i.test(e)||!/false|no|0/i.test(e)&&t}function y(e,t,r){if(null===e)return t;if(/^\s*$/.test(e))return r;var i=e.split(",").map(Number);return 2===i.length&&i[0]&&i[1]?i:t}var k=function(){function e(t,r){if(c(this,e),r?(t=v(t),this.options=Object.assign({},d,r)):t&&(0,n.default)(t)?(this.options=Object.assign({},d,t),t=v(this.options.attachTo)):(this.options=Object.assign({},d),t=v((0,s.nvl)(t,this.options.attachTo))),!t)throw new Error("Container not found: "+this.options.attachTo);!function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"acp-";if(t.hasAttribute(r+"show-hsl")&&(e.showHSL=A(t.getAttribute(r+"show-hsl"),d.showHSL,!0)),t.hasAttribute(r+"show-rgb")&&(e.showRGB=A(t.getAttribute(r+"show-rgb"),d.showRGB,!0)),t.hasAttribute(r+"show-hex")&&(e.showHEX=A(t.getAttribute(r+"show-hex"),d.showHEX,!0)),t.hasAttribute(r+"show-alpha")&&(e.showAlpha=A(t.getAttribute(r+"show-alpha"),d.showAlpha,!0)),t.hasAttribute(r+"palette-editable")&&(e.paletteEditable=A(t.getAttribute(r+"palette-editable"),d.paletteEditable,!0)),t.hasAttribute(r+"sl-bar-size")&&(e.slBarSize=y(t.getAttribute(r+"sl-bar-size"),d.slBarSize,[232,150])),t.hasAttribute(r+"hue-bar-size")&&(e.hueBarSize=y(t.getAttribute(r+"hue-bar-size"),d.hueBarSize,[150,11]),e.alphaBarSize=e.hueBarSize),t.hasAttribute(r+"palette")){var i=t.getAttribute(r+"palette");switch(i){case"PALETTE_MATERIAL_500":e.palette=s.PALETTE_MATERIAL_500;break;case"PALETTE_MATERIAL_CHROME":case"":e.palette=s.PALETTE_MATERIAL_CHROME;break;default:e.palette=i.split(/[;|]/)}}t.hasAttribute(r+"color")&&(e.color=t.getAttribute(r+"color"))}(this.options,t),this.H=0,this.S=0,this.L=0,this.R=0,this.G=0,this.B=0,this.A=1,this.palette={},this.element=document.createElement("div"),this.options.id&&(this.element.id=this.options.id),this.element.className="a-color-picker",this.element.innerHTML=a.default,t.appendChild(this.element);var i=this.element.querySelector(".a-color-picker-h");this.setupHueCanvas(i),this.hueBarHelper=m(i),this.huePointer=this.element.querySelector(".a-color-picker-h+.a-color-picker-dot");var o=this.element.querySelector(".a-color-picker-sl");this.setupSlCanvas(o),this.slBarHelper=m(o),this.slPointer=this.element.querySelector(".a-color-picker-sl+.a-color-picker-dot"),this.preview=this.element.querySelector(".a-color-picker-preview"),this.setupClipboard(this.preview.querySelector(".a-color-picker-clipbaord")),this.options.showHSL?(this.setupInput(this.inputH=this.element.querySelector(".a-color-picker-hsl>input[nameref=H]")),this.setupInput(this.inputS=this.element.querySelector(".a-color-picker-hsl>input[nameref=S]")),this.setupInput(this.inputL=this.element.querySelector(".a-color-picker-hsl>input[nameref=L]"))):this.element.querySelector(".a-color-picker-hsl").remove(),this.options.showRGB?(this.setupInput(this.inputR=this.element.querySelector(".a-color-picker-rgb>input[nameref=R]")),this.setupInput(this.inputG=this.element.querySelector(".a-color-picker-rgb>input[nameref=G]")),this.setupInput(this.inputB=this.element.querySelector(".a-color-picker-rgb>input[nameref=B]"))):this.element.querySelector(".a-color-picker-rgb").remove(),this.options.showHEX?this.setupInput(this.inputRGBHEX=this.element.querySelector("input[nameref=RGBHEX]")):this.element.querySelector(".a-color-picker-rgbhex").remove(),this.options.paletteEditable||this.options.palette&&this.options.palette.length>0?this.setPalette(this.paletteRow=this.element.querySelector(".a-color-picker-palette")):(this.paletteRow=this.element.querySelector(".a-color-picker-palette"),this.paletteRow.remove()),this.options.showAlpha?(this.setupAlphaCanvas(this.element.querySelector(".a-color-picker-a")),this.alphaPointer=this.element.querySelector(".a-color-picker-a+.a-color-picker-dot")):this.element.querySelector(".a-color-picker-alpha").remove(),this.element.style.width=this.options.slBarSize[0]+"px",this.onValueChanged(f,this.options.color)}return i(e,[{key:"setupHueCanvas",value:function(e){var t=this;e.width=this.options.hueBarSize[0],e.height=this.options.hueBarSize[1];for(var r=e.getContext("2d"),i=r.createLinearGradient(0,0,this.options.hueBarSize[0],0),o=0;o<=1;o+=1/360)i.addColorStop(o,"hsl("+360*o+", 100%, 50%)");r.fillStyle=i,r.fillRect(0,0,this.options.hueBarSize[0],this.options.hueBarSize[1]);var n=function(r){var i=(0,s.limit)(r.clientX-e.getBoundingClientRect().left,0,t.options.hueBarSize[0]),o=Math.round(360*i/t.options.hueBarSize[0]);t.huePointer.style.left=i-7+"px",t.onValueChanged("H",o)},a=function e(){document.removeEventListener("mousemove",n),document.removeEventListener("mouseup",e)};e.addEventListener("mousedown",function(e){n(e),document.addEventListener("mousemove",n),document.addEventListener("mouseup",a)})}},{key:"setupSlCanvas",value:function(e){var t=this;e.width=this.options.slBarSize[0],e.height=this.options.slBarSize[1];var r=function(r){var i=(0,s.limit)(r.clientX-e.getBoundingClientRect().left,0,t.options.slBarSize[0]-1),o=(0,s.limit)(r.clientY-e.getBoundingClientRect().top,0,t.options.slBarSize[1]-1),n=t.slBarHelper.grabColor(i,o);t.slPointer.style.left=i-7+"px",t.slPointer.style.top=o-7+"px",t.onValueChanged("RGB",n)},i=function e(){document.removeEventListener("mousemove",r),document.removeEventListener("mouseup",e)};e.addEventListener("mousedown",function(e){r(e),document.addEventListener("mousemove",r),document.addEventListener("mouseup",i)})}},{key:"setupAlphaCanvas",value:function(e){var t=this;e.width=this.options.alphaBarSize[0],e.height=this.options.alphaBarSize[1];var r=e.getContext("2d"),i=r.createLinearGradient(0,0,e.width-1,0);i.addColorStop(0,"hsla(0, 0%, 50%, 0)"),i.addColorStop(1,"hsla(0, 0%, 50%, 1)"),r.fillStyle=i,r.fillRect(0,0,this.options.alphaBarSize[0],this.options.alphaBarSize[1]);var o=function(r){var i=(0,s.limit)(r.clientX-e.getBoundingClientRect().left,0,t.options.alphaBarSize[0]),o=+(i/t.options.alphaBarSize[0]).toFixed(2);t.alphaPointer.style.left=i-7+"px",t.onValueChanged("ALPHA",o)},n=function e(){document.removeEventListener("mousemove",o),document.removeEventListener("mouseup",e)};e.addEventListener("mousedown",function(e){o(e),document.addEventListener("mousemove",o),document.addEventListener("mouseup",n)})}},{key:"setupInput",value:function(e){var t=this,r=+e.min,i=+e.max,o=e.getAttribute("nameref");e.hasAttribute("select-on-focus")&&e.addEventListener("focus",function(){e.select()}),"text"===e.type?e.addEventListener("change",function(){t.onValueChanged(o,e.value)}):((u||p)&&e.addEventListener("keydown",function(n){"Up"===n.key?(e.value=(0,s.limit)(+e.value+1,r,i),t.onValueChanged(o,e.value),n.returnValue=!1):"Down"===n.key&&(e.value=(0,s.limit)(+e.value-1,r,i),t.onValueChanged(o,e.value),n.returnValue=!1)}),e.addEventListener("change",function(){var n=+e.value;t.onValueChanged(o,(0,s.limit)(n,r,i))}))}},{key:"setupClipboard",value:function(e){var t=this;e.title="click to copy",e.addEventListener("click",function(){e.value=(0,s.parseColor)([t.R,t.G,t.B,t.A],"hexcss4"),e.select(),document.execCommand("copy")})}},{key:"setPalette",value:function(e){var t=this,r="auto"===this.options.useAlphaInPalette?this.options.showAlpha:this.options.useAlphaInPalette,i=null;switch(this.options.palette){case"PALETTE_MATERIAL_500":i=s.PALETTE_MATERIAL_500;break;case"PALETTE_MATERIAL_CHROME":i=s.PALETTE_MATERIAL_CHROME;break;default:i=(0,s.ensureArray)(this.options.palette)}if(this.options.paletteEditable||i.length>0){var o=function(r,i,o){var s=e.querySelector('.a-color-picker-palette-color[data-color="'+r+'"]')||document.createElement("div");s.className="a-color-picker-palette-color",s.style.backgroundColor=r,s.setAttribute("data-color",r),s.title=r,e.insertBefore(s,i),t.palette[r]=!0,o&&t.onPaletteColorAdd(r)},n=function(r,i){r?(e.removeChild(r),t.palette[r.getAttribute("data-color")]=!1,i&&t.onPaletteColorRemove(r.getAttribute("data-color"))):(e.querySelectorAll(".a-color-picker-palette-color[data-color]").forEach(function(t){e.removeChild(t)}),Object.keys(t.palette).forEach(function(e){t.palette[e]=!1}),i&&t.onPaletteColorRemove())};if(i.map(function(e){return(0,s.parseColor)(e,r?"rgbcss4":"hex")}).filter(function(e){return!!e}).forEach(function(e){return o(e)}),this.options.paletteEditable){var a=document.createElement("div");a.className="a-color-picker-palette-color a-color-picker-palette-add",a.innerHTML="+",e.appendChild(a),e.addEventListener("click",function(e){/a-color-picker-palette-add/.test(e.target.className)?e.shiftKey?n(null,!0):o(r?(0,s.parseColor)([t.R,t.G,t.B,t.A],"rgbcss4"):(0,s.rgbToHex)(t.R,t.G,t.B),e.target,!0):/a-color-picker-palette-color/.test(e.target.className)&&(e.shiftKey?n(e.target,!0):t.onValueChanged(f,e.target.getAttribute("data-color")))})}else e.addEventListener("click",function(e){/a-color-picker-palette-color/.test(e.target.className)&&t.onValueChanged(f,e.target.getAttribute("data-color"))})}else e.style.display="none"}},{key:"updatePalette",value:function(e){this.paletteRow.innerHTML="",this.palette={},this.paletteRow.parentElement||this.element.appendChild(this.paletteRow),this.options.palette=e,this.setPalette(this.paletteRow)}},{key:"onValueChanged",value:function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{silent:!1};switch(e){case"H":this.H=t;var i=(0,s.hslToRgb)(this.H,this.S,this.L),n=o(i,3);this.R=n[0],this.G=n[1],this.B=n[2],this.slBarHelper.setHue(t),this.updatePointerH(this.H),this.updateInputHSL(this.H,this.S,this.L),this.updateInputRGB(this.R,this.G,this.B),this.updateInputRGBHEX(this.R,this.G,this.B,this.A);break;case"S":this.S=t;var a=(0,s.hslToRgb)(this.H,this.S,this.L),l=o(a,3);this.R=l[0],this.G=l[1],this.B=l[2],this.updatePointerSL(this.H,this.S,this.L),this.updateInputHSL(this.H,this.S,this.L),this.updateInputRGB(this.R,this.G,this.B),this.updateInputRGBHEX(this.R,this.G,this.B,this.A);break;case"L":this.L=t;var c=(0,s.hslToRgb)(this.H,this.S,this.L),h=o(c,3);this.R=h[0],this.G=h[1],this.B=h[2],this.updatePointerSL(this.H,this.S,this.L),this.updateInputHSL(this.H,this.S,this.L),this.updateInputRGB(this.R,this.G,this.B),this.updateInputRGBHEX(this.R,this.G,this.B,this.A);break;case"R":this.R=t;var u=(0,s.rgbToHsl)(this.R,this.G,this.B),p=o(u,3);this.H=p[0],this.S=p[1],this.L=p[2],this.slBarHelper.setHue(this.H),this.updatePointerH(this.H),this.updatePointerSL(this.H,this.S,this.L),this.updateInputHSL(this.H,this.S,this.L),this.updateInputRGBHEX(this.R,this.G,this.B,this.A);break;case"G":this.G=t;var d=(0,s.rgbToHsl)(this.R,this.G,this.B),v=o(d,3);this.H=v[0],this.S=v[1],this.L=v[2],this.slBarHelper.setHue(this.H),this.updatePointerH(this.H),this.updatePointerSL(this.H,this.S,this.L),this.updateInputHSL(this.H,this.S,this.L),this.updateInputRGBHEX(this.R,this.G,this.B,this.A);break;case"B":this.B=t;var m=(0,s.rgbToHsl)(this.R,this.G,this.B),A=o(m,3);this.H=A[0],this.S=A[1],this.L=A[2],this.slBarHelper.setHue(this.H),this.updatePointerH(this.H),this.updatePointerSL(this.H,this.S,this.L),this.updateInputHSL(this.H,this.S,this.L),this.updateInputRGBHEX(this.R,this.G,this.B,this.A);break;case"RGB":var y=o(t,3);this.R=y[0],this.G=y[1],this.B=y[2];var k=(0,s.rgbToHsl)(this.R,this.G,this.B),F=o(k,3);this.H=F[0],this.S=F[1],this.L=F[2],this.updateInputHSL(this.H,this.S,this.L),this.updateInputRGB(this.R,this.G,this.B),this.updateInputRGBHEX(this.R,this.G,this.B,this.A);break;case g:var E=o(t,4);this.R=E[0],this.G=E[1],this.B=E[2],this.A=E[3];var B=(0,s.rgbToHsl)(this.R,this.G,this.B),H=o(B,3);this.H=H[0],this.S=H[1],this.L=H[2],this.slBarHelper.setHue(this.H),this.updatePointerH(this.H),this.updatePointerSL(this.H,this.S,this.L),this.updateInputHSL(this.H,this.S,this.L),this.updateInputRGB(this.R,this.G,this.B),this.updateInputRGBHEX(this.R,this.G,this.B,this.A),this.updatePointerA(this.A);break;case b:var R=o(t,4);this.H=R[0],this.S=R[1],this.L=R[2],this.A=R[3];var C=(0,s.hslToRgb)(this.H,this.S,this.L),S=o(C,3);this.R=S[0],this.G=S[1],this.B=S[2],this.slBarHelper.setHue(this.H),this.updatePointerH(this.H),this.updatePointerSL(this.H,this.S,this.L),this.updateInputHSL(this.H,this.S,this.L),this.updateInputRGB(this.R,this.G,this.B),this.updateInputRGBHEX(this.R,this.G,this.B,this.A),this.updatePointerA(this.A);break;case"RGBHEX":var L=(0,s.cssColorToRgba)(t)||[this.R,this.G,this.B,this.A],w=o(L,4);this.R=w[0],this.G=w[1],this.B=w[2],this.A=w[3];var T=(0,s.rgbToHsl)(this.R,this.G,this.B),x=o(T,3);this.H=x[0],this.S=x[1],this.L=x[2],this.slBarHelper.setHue(this.H),this.updatePointerH(this.H),this.updatePointerSL(this.H,this.S,this.L),this.updateInputHSL(this.H,this.S,this.L),this.updateInputRGB(this.R,this.G,this.B),this.updatePointerA(this.A);break;case f:var G=(0,s.parseColor)(t,"rgba")||[0,0,0,1],I=o(G,4);this.R=I[0],this.G=I[1],this.B=I[2],this.A=I[3];var P=(0,s.rgbToHsl)(this.R,this.G,this.B),D=o(P,3);this.H=D[0],this.S=D[1],this.L=D[2],this.slBarHelper.setHue(this.H),this.updatePointerH(this.H),this.updatePointerSL(this.H,this.S,this.L),this.updateInputHSL(this.H,this.S,this.L),this.updateInputRGB(this.R,this.G,this.B),this.updateInputRGBHEX(this.R,this.G,this.B,this.A),this.updatePointerA(this.A);break;case"ALPHA":this.A=t,this.updateInputRGBHEX(this.R,this.G,this.B,this.A)}1===this.A?this.preview.style.backgroundColor="rgb("+this.R+","+this.G+","+this.B+")":this.preview.style.backgroundColor="rgba("+this.R+","+this.G+","+this.B+","+this.A+")",r&&r.silent||this.onchange&&this.onchange(this.preview.style.backgroundColor)}},{key:"onPaletteColorAdd",value:function(e){this.oncoloradd&&this.oncoloradd(e)}},{key:"onPaletteColorRemove",value:function(e){this.oncolorremove&&this.oncolorremove(e)}},{key:"updateInputHSL",value:function(e,t,r){this.options.showHSL&&(this.inputH.value=e,this.inputS.value=t,this.inputL.value=r)}},{key:"updateInputRGB",value:function(e,t,r){this.options.showRGB&&(this.inputR.value=e,this.inputG.value=t,this.inputB.value=r)}},{key:"updateInputRGBHEX",value:function(e,t,r,i){this.options.showHEX&&(this.options.showAlpha?this.inputRGBHEX.value=(0,s.parseColor)([e,t,r,i],"hexcss4"):this.inputRGBHEX.value=(0,s.rgbToHex)(e,t,r))}},{key:"updatePointerH",value:function(e){var t=this.options.hueBarSize[0]*e/360;this.huePointer.style.left=t-7+"px"}},{key:"updatePointerSL",value:function(e,t,r){var i=(0,s.hslToRgb)(e,t,r),n=o(i,3),a=n[0],l=n[1],c=n[2],h=this.slBarHelper.findColor(a,l,c),u=o(h,2),p=u[0],d=u[1];p>=0&&(this.slPointer.style.left=p-7+"px",this.slPointer.style.top=d-7+"px")}},{key:"updatePointerA",value:function(e){if(this.options.showAlpha){var t=this.options.alphaBarSize[0]*e;this.alphaPointer.style.left=t-7+"px"}}}]),e}(),F=function(){function e(t){c(this,e),this.name=t,this.listeners=[]}return i(e,[{key:"on",value:function(e){e&&this.listeners.push(e)}},{key:"off",value:function(e){this.listeners=e?this.listeners.filter(function(t){return t!==e}):[]}},{key:"emit",value:function(e,t){for(var r=this.listeners.slice(0),i=0;i<r.length;i++)r[i].apply(t,e)}}]),e}();function E(e,t){var r=new k(e,t),i={change:new F("change"),coloradd:new F("coloradd"),colorremove:new F("colorremove")},n=!0,a={},l={get element(){return r.element},get rgb(){return[r.R,r.G,r.B]},set rgb(e){var t=o(e,3),i=t[0],n=t[1],a=t[2],l=[(0,s.limit)(i,0,255),(0,s.limit)(n,0,255),(0,s.limit)(a,0,255)];i=l[0],n=l[1],a=l[2],r.onValueChanged(g,[i,n,a,1])},get hsl(){return[r.H,r.S,r.L]},set hsl(e){var t=o(e,3),i=t[0],n=t[1],a=t[2],l=[(0,s.limit)(i,0,360),(0,s.limit)(n,0,100),(0,s.limit)(a,0,100)];i=l[0],n=l[1],a=l[2],r.onValueChanged(b,[i,n,a,1])},get rgbhex(){return this.all.hex},get rgba(){return[r.R,r.G,r.B,r.A]},set rgba(e){var t=o(e,4),i=t[0],n=t[1],a=t[2],l=t[3],c=[(0,s.limit)(i,0,255),(0,s.limit)(n,0,255),(0,s.limit)(a,0,255),(0,s.limit)(l,0,1)];i=c[0],n=c[1],a=c[2],l=c[3],r.onValueChanged(g,[i,n,a,l])},get hsla(){return[r.H,r.S,r.L,r.A]},set hsla(e){var t=o(e,4),i=t[0],n=t[1],a=t[2],l=t[3],c=[(0,s.limit)(i,0,360),(0,s.limit)(n,0,100),(0,s.limit)(a,0,100),(0,s.limit)(l,0,1)];i=c[0],n=c[1],a=c[2],l=c[3],r.onValueChanged(b,[i,n,a,l])},get color(){return this.all.toString()},set color(e){r.onValueChanged(f,e)},setColor:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];r.onValueChanged(f,e,{silent:t})},get all(){if(n){var e=[r.R,r.G,r.B,r.A],t=r.A<1?"rgba("+r.R+","+r.G+","+r.B+","+r.A+")":s.rgbToHex.apply(void 0,e);(a=(0,s.parseColor)(e,a)).toString=function(){return t},n=!1}return Object.assign({},a)},get onchange(){return i.change&&i.change.listeners[0]},set onchange(e){this.off("change").on("change",e)},get oncoloradd(){return i.coloradd&&i.coloradd.listeners[0]},set oncoloradd(e){this.off("coloradd").on("coloradd",e)},get oncolorremove(){return i.colorremove&&i.colorremove.listeners[0]},set oncolorremove(e){this.off("colorremove").on("colorremove",e)},get palette(){return Object.keys(r.palette).filter(function(e){return r.palette[e]})},set palette(e){r.updatePalette(e)},show:function(){r.element.classList.remove("hidden")},hide:function(){r.element.classList.add("hidden")},toggle:function(){r.element.classList.toggle("hidden")},on:function(e,t){return e&&i[e]&&i[e].on(t),this},off:function(e,t){return e&&i[e]&&i[e].off(t),this},destroy:function(){i.change.off(),i.coloradd.off(),i.colorremove.off(),r.element.remove(),i=null,r=null}};return r.onchange=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];n=!0,i.change.emit([l].concat(t),l)},r.oncoloradd=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];i.coloradd.emit([l].concat(t),l)},r.oncolorremove=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];i.colorremove.emit([l].concat(t),l)},r.element.ctrl=l,l}if("undefined"!=typeof window&&!document.querySelector('head>style[data-source="a-color-picker"]')){var B=r(5).toString(),H=document.createElement("style");H.setAttribute("type","text/css"),H.setAttribute("data-source","a-color-picker"),H.innerHTML=B,document.querySelector("head").appendChild(H)}t.createPicker=E,t.from=function(e,t){var r=function(e){return e?Array.isArray(e)?e:e instanceof HTMLElement?[e]:e instanceof NodeList?[].concat(h(e)):"string"==typeof e?[].concat(h(document.querySelectorAll(e))):e.jquery?e.get():[]:[]}(e).map(function(e,r){var i=E(e,t);return i.index=r,i});return r.on=function(e,t){return r.forEach(function(r){return r.on(e,t)}),this},r.off=function(e){return r.forEach(function(t){return t.off(e)}),this},r},t.parseColorToRgb=s.parseColorToRgb,t.parseColorToRgba=s.parseColorToRgba,t.parseColorToHsl=s.parseColorToHsl,t.parseColorToHsla=s.parseColorToHsla,t.parseColor=s.parseColor,t.rgbToHex=s.rgbToHex,t.hslToRgb=s.hslToRgb,t.rgbToHsl=s.rgbToHsl,t.rgbToHsv=s.rgbToHsv,t.rgbToInt=s.rgbToInt,t.intToRgb=s.intToRgb,t.getLuminance=s.getLuminance,t.COLOR_NAMES=s.COLOR_NAMES,t.PALETTE_MATERIAL_500=s.PALETTE_MATERIAL_500,t.PALETTE_MATERIAL_CHROME=s.PALETTE_MATERIAL_CHROME,t.VERSION="1.2.2"},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.nvl=t.ensureArray=t.limit=t.getLuminance=t.parseColor=t.parseColorToHsla=t.parseColorToHsl=t.cssHslaToHsla=t.cssHslToHsl=t.parseColorToRgba=t.parseColorToRgb=t.cssRgbaToRgba=t.cssRgbToRgb=t.cssColorToRgba=t.cssColorToRgb=t.intToRgb=t.rgbToInt=t.rgbToHsv=t.rgbToHsl=t.hslToRgb=t.rgbToHex=t.PALETTE_MATERIAL_CHROME=t.PALETTE_MATERIAL_500=t.COLOR_NAMES=void 0;var i=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var r=[],i=!0,o=!1,s=void 0;try{for(var n,a=e[Symbol.iterator]();!(i=(n=a.next()).done)&&(r.push(n.value),!t||r.length!==t);i=!0);}catch(e){o=!0,s=e}finally{try{!i&&a.return&&a.return()}finally{if(o)throw s}}return r}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},o=function(e){return e&&e.__esModule?e:{default:e}}(r(0));function s(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}var n={aliceblue:"#F0F8FF",antiquewhite:"#FAEBD7",aqua:"#00FFFF",aquamarine:"#7FFFD4",azure:"#F0FFFF",beige:"#F5F5DC",bisque:"#FFE4C4",black:"#000000",blanchedalmond:"#FFEBCD",blue:"#0000FF",blueviolet:"#8A2BE2",brown:"#A52A2A",burlywood:"#DEB887",cadetblue:"#5F9EA0",chartreuse:"#7FFF00",chocolate:"#D2691E",coral:"#FF7F50",cornflowerblue:"#6495ED",cornsilk:"#FFF8DC",crimson:"#DC143C",cyan:"#00FFFF",darkblue:"#00008B",darkcyan:"#008B8B",darkgoldenrod:"#B8860B",darkgray:"#A9A9A9",darkgrey:"#A9A9A9",darkgreen:"#006400",darkkhaki:"#BDB76B",darkmagenta:"#8B008B",darkolivegreen:"#556B2F",darkorange:"#FF8C00",darkorchid:"#9932CC",darkred:"#8B0000",darksalmon:"#E9967A",darkseagreen:"#8FBC8F",darkslateblue:"#483D8B",darkslategray:"#2F4F4F",darkslategrey:"#2F4F4F",darkturquoise:"#00CED1",darkviolet:"#9400D3",deeppink:"#FF1493",deepskyblue:"#00BFFF",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1E90FF",firebrick:"#B22222",floralwhite:"#FFFAF0",forestgreen:"#228B22",fuchsia:"#FF00FF",gainsboro:"#DCDCDC",ghostwhite:"#F8F8FF",gold:"#FFD700",goldenrod:"#DAA520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#ADFF2F",honeydew:"#F0FFF0",hotpink:"#FF69B4","indianred ":"#CD5C5C","indigo ":"#4B0082",ivory:"#FFFFF0",khaki:"#F0E68C",lavender:"#E6E6FA",lavenderblush:"#FFF0F5",lawngreen:"#7CFC00",lemonchiffon:"#FFFACD",lightblue:"#ADD8E6",lightcoral:"#F08080",lightcyan:"#E0FFFF",lightgoldenrodyellow:"#FAFAD2",lightgray:"#D3D3D3",lightgrey:"#D3D3D3",lightgreen:"#90EE90",lightpink:"#FFB6C1",lightsalmon:"#FFA07A",lightseagreen:"#20B2AA",lightskyblue:"#87CEFA",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#B0C4DE",lightyellow:"#FFFFE0",lime:"#00FF00",limegreen:"#32CD32",linen:"#FAF0E6",magenta:"#FF00FF",maroon:"#800000",mediumaquamarine:"#66CDAA",mediumblue:"#0000CD",mediumorchid:"#BA55D3",mediumpurple:"#9370DB",mediumseagreen:"#3CB371",mediumslateblue:"#7B68EE",mediumspringgreen:"#00FA9A",mediumturquoise:"#48D1CC",mediumvioletred:"#C71585",midnightblue:"#191970",mintcream:"#F5FFFA",mistyrose:"#FFE4E1",moccasin:"#FFE4B5",navajowhite:"#FFDEAD",navy:"#000080",oldlace:"#FDF5E6",olive:"#808000",olivedrab:"#6B8E23",orange:"#FFA500",orangered:"#FF4500",orchid:"#DA70D6",palegoldenrod:"#EEE8AA",palegreen:"#98FB98",paleturquoise:"#AFEEEE",palevioletred:"#DB7093",papayawhip:"#FFEFD5",peachpuff:"#FFDAB9",peru:"#CD853F",pink:"#FFC0CB",plum:"#DDA0DD",powderblue:"#B0E0E6",purple:"#800080",rebeccapurple:"#663399",red:"#FF0000",rosybrown:"#BC8F8F",royalblue:"#4169E1",saddlebrown:"#8B4513",salmon:"#FA8072",sandybrown:"#F4A460",seagreen:"#2E8B57",seashell:"#FFF5EE",sienna:"#A0522D",silver:"#C0C0C0",skyblue:"#87CEEB",slateblue:"#6A5ACD",slategray:"#708090",slategrey:"#708090",snow:"#FFFAFA",springgreen:"#00FF7F",steelblue:"#4682B4",tan:"#D2B48C",teal:"#008080",thistle:"#D8BFD8",tomato:"#FF6347",turquoise:"#40E0D0",violet:"#EE82EE",wheat:"#F5DEB3",white:"#FFFFFF",whitesmoke:"#F5F5F5",yellow:"#FFFF00",yellowgreen:"#9ACD32"};function a(e,t,r){return e=+e,isNaN(e)?t:e<t?t:e>r?r:e}function l(e,t){return null==e?t:e}function c(e,t,r){var i=[a(e,0,255),a(t,0,255),a(r,0,255)];return"#"+("000000"+((e=i[0])<<16|(t=i[1])<<8|(r=i[2])).toString(16)).slice(-6)}function h(e,t,r){var i=void 0,o=void 0,s=void 0,n=[a(e,0,360)/360,a(t,0,100)/100,a(r,0,100)/100];if(e=n[0],r=n[2],0==(t=n[1]))i=o=s=r;else{var l=function(e,t,r){return r<0&&(r+=1),r>1&&(r-=1),r<1/6?e+6*(t-e)*r:r<.5?t:r<2/3?e+(t-e)*(2/3-r)*6:e},c=r<.5?r*(1+t):r+t-r*t,h=2*r-c;i=l(h,c,e+1/3),o=l(h,c,e),s=l(h,c,e-1/3)}return[255*i,255*o,255*s].map(Math.round)}function u(e,t,r){var i=[a(e,0,255)/255,a(t,0,255)/255,a(r,0,255)/255];e=i[0],t=i[1],r=i[2];var o=Math.max(e,t,r),s=Math.min(e,t,r),n=void 0,l=void 0,c=(o+s)/2;if(o==s)n=l=0;else{var h=o-s;switch(l=c>.5?h/(2-o-s):h/(o+s),o){case e:n=(t-r)/h+(t<r?6:0);break;case t:n=(r-e)/h+2;break;case r:n=(e-t)/h+4}n/=6}return[360*n,100*l,100*c].map(Math.round)}function p(e,t,r){return e<<16|t<<8|r}function d(e){if(e){var t=n[e.toString().toLowerCase()],r=/^\s*#?((([0-9A-F])([0-9A-F])([0-9A-F]))|(([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})))\s*$/i.exec(t||e)||[],o=i(r,10),s=o[3],a=o[4],l=o[5],c=o[7],h=o[8],u=o[9];if(void 0!==s)return[parseInt(s+s,16),parseInt(a+a,16),parseInt(l+l,16)];if(void 0!==c)return[parseInt(c,16),parseInt(h,16),parseInt(u,16)]}}function f(e){if(e){var t=n[e.toString().toLowerCase()],r=/^\s*#?((([0-9A-F])([0-9A-F])([0-9A-F])([0-9A-F])?)|(([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})?))\s*$/i.exec(t||e)||[],o=i(r,12),s=o[3],a=o[4],l=o[5],c=o[6],h=o[8],u=o[9],p=o[10],d=o[11];if(void 0!==s)return[parseInt(s+s,16),parseInt(a+a,16),parseInt(l+l,16),c?+(parseInt(c+c,16)/255).toFixed(2):1];if(void 0!==h)return[parseInt(h,16),parseInt(u,16),parseInt(p,16),d?+(parseInt(d,16)/255).toFixed(2):1]}}function g(e){if(e){var t=/^rgb\((\d+)[\s,](\d+)[\s,](\d+)\)/i.exec(e)||[],r=i(t,4),o=r[0],s=r[1],n=r[2],l=r[3];return o?[a(s,0,255),a(n,0,255),a(l,0,255)]:void 0}}function b(e){if(e){var t=/^rgba?\((\d+)\s*[\s,]\s*(\d+)\s*[\s,]\s*(\d+)(\s*[\s,]\s*(\d*(.\d+)?))?\)/i.exec(e)||[],r=i(t,6),o=r[0],s=r[1],n=r[2],c=r[3],h=r[5];return o?[a(s,0,255),a(n,0,255),a(c,0,255),a(l(h,1),0,1)]:void 0}}function v(e){if(Array.isArray(e))return[a(e[0],0,255),a(e[1],0,255),a(e[2],0,255),a(l(e[3],1),0,1)];var t=f(e)||b(e);return t&&3===t.length&&t.push(1),t}function m(e){if(e){var t=/^hsl\((\d+)[\s,](\d+)[\s,](\d+)\)/i.exec(e)||[],r=i(t,4),o=r[0],s=r[1],n=r[2],l=r[3];return o?[a(s,0,360),a(n,0,100),a(l,0,100)]:void 0}}function A(e){if(e){var t=/^hsla?\((\d+)\s*[\s,]\s*(\d+)\s*[\s,]\s*(\d+)(\s*[\s,]\s*(\d*(.\d+)?))?\)/i.exec(e)||[],r=i(t,6),o=r[0],s=r[1],n=r[2],c=r[3],h=r[5];return o?[a(s,0,255),a(n,0,255),a(c,0,255),a(l(h,1),0,1)]:void 0}}function y(e){if(Array.isArray(e))return[a(e[0],0,360),a(e[1],0,100),a(e[2],0,100),a(l(e[3],1),0,1)];var t=A(e);return t&&3===t.length&&t.push(1),t}function k(e,t){switch(t){case"rgb":default:return e.slice(0,3);case"rgbcss":return"rgb("+e[0]+", "+e[1]+", "+e[2]+")";case"rgbcss4":return"rgb("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")";case"rgba":return e;case"rgbacss":return"rgba("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")";case"hsl":return u.apply(void 0,s(e));case"hslcss":return"hsl("+(e=u.apply(void 0,s(e)))[0]+", "+e[1]+", "+e[2]+")";case"hslcss4":var r=u.apply(void 0,s(e));return"hsl("+r[0]+", "+r[1]+", "+r[2]+", "+e[3]+")";case"hsla":return[].concat(s(u.apply(void 0,s(e))),[e[3]]);case"hslacss":var i=u.apply(void 0,s(e));return"hsla("+i[0]+", "+i[1]+", "+i[2]+", "+e[3]+")";case"hex":return c.apply(void 0,s(e));case"hexcss4":return c.apply(void 0,s(e))+("00"+parseInt(255*e[3]).toString(16)).slice(-2);case"int":return p.apply(void 0,s(e))}}t.COLOR_NAMES=n,t.PALETTE_MATERIAL_500=["#F44336","#E91E63","#E91E63","#9C27B0","#9C27B0","#673AB7","#673AB7","#3F51B5","#3F51B5","#2196F3","#2196F3","#03A9F4","#03A9F4","#00BCD4","#00BCD4","#009688","#009688","#4CAF50","#4CAF50","#8BC34A","#8BC34A","#CDDC39","#CDDC39","#FFEB3B","#FFEB3B","#FFC107","#FFC107","#FF9800","#FF9800","#FF5722","#FF5722","#795548","#795548","#9E9E9E","#9E9E9E","#607D8B","#607D8B"],t.PALETTE_MATERIAL_CHROME=["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#9e9e9e","#607d8b"],t.rgbToHex=c,t.hslToRgb=h,t.rgbToHsl=u,t.rgbToHsv=function(e,t,r){var i=[a(e,0,255)/255,a(t,0,255)/255,a(r,0,255)/255];e=i[0],t=i[1],r=i[2];var o,s=Math.max(e,t,r),n=Math.min(e,t,r),l=void 0,c=s,h=s-n;if(o=0===s?0:h/s,s==n)l=0;else{switch(s){case e:l=(t-r)/h+(t<r?6:0);break;case t:l=(r-e)/h+2;break;case r:l=(e-t)/h+4}l/=6}return[l,o,c]},t.rgbToInt=p,t.intToRgb=function(e){return[e>>16&255,e>>8&255,255&e]},t.cssColorToRgb=d,t.cssColorToRgba=f,t.cssRgbToRgb=g,t.cssRgbaToRgba=b,t.parseColorToRgb=function(e){return Array.isArray(e)?e=[a(e[0],0,255),a(e[1],0,255),a(e[2],0,255)]:d(e)||g(e)},t.parseColorToRgba=v,t.cssHslToHsl=m,t.cssHslaToHsla=A,t.parseColorToHsl=function(e){return Array.isArray(e)?e=[a(e[0],0,360),a(e[1],0,100),a(e[2],0,100)]:m(e)},t.parseColorToHsla=y,t.parseColor=function(e,t){if(t=t||"rgb",null!=e){var r=void 0;if((r=v(e))||(r=y(e))&&(r=[].concat(s(h.apply(void 0,s(r))),[r[3]])))return(0,o.default)(t)?["rgb","rgbcss","rgbcss4","rgba","rgbacss","hsl","hslcss","hslcss4","hsla","hslacss","hex","hexcss4","int"].reduce(function(e,t){return e[t]=k(r,t),e},t||{}):k(r,t.toString().toLowerCase())}},t.getLuminance=function(e,t,r){return.2126*(e=(e/=255)<.03928?e/12.92:Math.pow((e+.055)/1.055,2.4))+.7152*(t=(t/=255)<.03928?t/12.92:Math.pow((t+.055)/1.055,2.4))+.0722*((r/=255)<.03928?r/12.92:Math.pow((r+.055)/1.055,2.4))},t.limit=a,t.ensureArray=function(e){return e?Array.from(e):[]},t.nvl=l},function(e,t,r){"use strict";
/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */e.exports=function(e){return null!=e&&"object"==typeof e&&!1===Array.isArray(e)}},function(e,t){e.exports='<div class="a-color-picker-row a-color-picker-stack a-color-picker-row-top"> <canvas class="a-color-picker-sl a-color-picker-transparent"></canvas> <div class=a-color-picker-dot></div> </div> <div class=a-color-picker-row> <div class="a-color-picker-stack a-color-picker-transparent a-color-picker-circle"> <div class=a-color-picker-preview> <input class=a-color-picker-clipbaord type=text> </div> </div> <div class=a-color-picker-column> <div class="a-color-picker-cell a-color-picker-stack"> <canvas class=a-color-picker-h></canvas> <div class=a-color-picker-dot></div> </div> <div class="a-color-picker-cell a-color-picker-alpha a-color-picker-stack" show-on-alpha> <canvas class="a-color-picker-a a-color-picker-transparent"></canvas> <div class=a-color-picker-dot></div> </div> </div> </div> <div class="a-color-picker-row a-color-picker-hsl" show-on-hsl> <label>H</label> <input nameref=H type=number maxlength=3 min=0 max=360 value=0> <label>S</label> <input nameref=S type=number maxlength=3 min=0 max=100 value=0> <label>L</label> <input nameref=L type=number maxlength=3 min=0 max=100 value=0> </div> <div class="a-color-picker-row a-color-picker-rgb" show-on-rgb> <label>R</label> <input nameref=R type=number maxlength=3 min=0 max=255 value=0> <label>G</label> <input nameref=G type=number maxlength=3 min=0 max=255 value=0> <label>B</label> <input nameref=B type=number maxlength=3 min=0 max=255 value=0> </div> <div class="a-color-picker-row a-color-picker-rgbhex a-color-picker-single-input" show-on-single-input> <label>HEX</label> <input nameref=RGBHEX type=text select-on-focus> </div> <div class="a-color-picker-row a-color-picker-palette"></div>'},function(e,t,r){var i=r(6);e.exports="string"==typeof i?i:i.toString()},function(e,t,r){(e.exports=r(7)(!1)).push([e.i,"/*!\n * a-color-picker\n * https://github.com/narsenico/a-color-picker\n *\n * Copyright (c) 2017-2018, Gianfranco Caldi.\n * Released under the MIT License.\n */.a-color-picker{background-color:#fff;padding:0;display:inline-flex;flex-direction:column;user-select:none;width:232px;font:400 10px Helvetica,Arial,sans-serif;border-radius:3px;box-shadow:0 0 0 1px rgba(0,0,0,.05),0 2px 4px rgba(0,0,0,.25)}.a-color-picker,.a-color-picker-row,.a-color-picker input{box-sizing:border-box}.a-color-picker-row{padding:15px;display:flex;flex-direction:row;align-items:center;justify-content:space-between;user-select:none}.a-color-picker-row-top{padding:0}.a-color-picker-row:not(:first-child){border-top:1px solid #f5f5f5}.a-color-picker-column{display:flex;flex-direction:column}.a-color-picker-cell{flex:1 1 auto;margin-bottom:4px}.a-color-picker-cell:last-child{margin-bottom:0}.a-color-picker-stack{position:relative}.a-color-picker-dot{position:absolute;width:14px;height:14px;top:0;left:0;background:#fff;pointer-events:none;border-radius:50px;z-index:1000;box-shadow:0 1px 2px rgba(0,0,0,.75)}.a-color-picker-a,.a-color-picker-h,.a-color-picker-sl{cursor:cell}.a-color-picker-a+.a-color-picker-dot,.a-color-picker-h+.a-color-picker-dot{top:-2px}.a-color-picker-a,.a-color-picker-h{border-radius:2px}.a-color-picker-preview{box-sizing:border-box;width:30px;height:30px;user-select:none;border-radius:15px}.a-color-picker-circle{border-radius:50px;border:1px solid #eee}.a-color-picker-hsl,.a-color-picker-rgb,.a-color-picker-single-input{justify-content:space-evenly}.a-color-picker-hsl>label,.a-color-picker-rgb>label,.a-color-picker-single-input>label{padding:0 8px;flex:0 0 auto;color:#969696}.a-color-picker-hsl>input,.a-color-picker-rgb>input,.a-color-picker-single-input>input{text-align:center;padding:2px 0;width:0;flex:1 1 auto;border:1px solid #e0e0e0;line-height:20px}.a-color-picker-hsl>input::-webkit-inner-spin-button,.a-color-picker-rgb>input::-webkit-inner-spin-button,.a-color-picker-single-input>input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}.a-color-picker-hsl>input:focus,.a-color-picker-rgb>input:focus,.a-color-picker-single-input>input:focus{border-color:#04a9f4;outline:none}.a-color-picker-transparent{background-image:linear-gradient(-45deg,#cdcdcd 25%,transparent 0),linear-gradient(45deg,#cdcdcd 25%,transparent 0),linear-gradient(-45deg,transparent 75%,#cdcdcd 0),linear-gradient(45deg,transparent 75%,#cdcdcd 0);background-size:11px 11px;background-position:0 0,0 -5.5px,-5.5px 5.5px,5.5px 0}.a-color-picker-sl{border-radius:3px 3px 0 0}.a-color-picker.hide-alpha [show-on-alpha],.a-color-picker.hide-hsl [show-on-hsl],.a-color-picker.hide-rgb [show-on-rgb],.a-color-picker.hide-single-input [show-on-single-input]{display:none}.a-color-picker-clipbaord{width:100%;height:100%;opacity:0;cursor:pointer}.a-color-picker-palette{flex-flow:wrap;flex-direction:row;justify-content:flex-start;padding:10px}.a-color-picker-palette-color{width:15px;height:15px;flex:0 1 15px;margin:3px;box-sizing:border-box;cursor:pointer;border-radius:3px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}.a-color-picker-palette-add{text-align:center;line-height:13px;color:#607d8b}.a-color-picker.hidden{display:none}",""])},function(e,t){e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var r=function(e,t){var r=e[1]||"",i=e[3];if(!i)return r;if(t&&"function"==typeof btoa){var o=function(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}(i),s=i.sources.map(function(e){return"/*# sourceURL="+i.sourceRoot+e+" */"});return[r].concat(s).concat([o]).join("\n")}return[r].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r}).join("")},t.i=function(e,r){"string"==typeof e&&(e=[[null,e,""]]);for(var i={},o=0;o<this.length;o++){var s=this[o][0];"number"==typeof s&&(i[s]=!0)}for(o=0;o<e.length;o++){var n=e[o];"number"==typeof n[0]&&i[n[0]]||(r&&!n[2]?n[2]=r:r&&(n[2]="("+n[2]+") and ("+r+")"),t.push(n))}},t}}])});
const ColorLib = (function () {
  function get_random_int (min, max, exclude = undefined, random_function) {
    let num

    if (random_function) {
      num = Math.floor(random_function() * (max - min + 1) + min)
    }
    else {
      num = Math.floor(Math.random() * (max - min + 1) + min)
    }

    if (exclude) {
      if (num === exclude) {
        if (num + 1 <= max) {
          num = num + 1
        }
        else if (num - 1 >= min) {
          num = num - 1
        }
      }
    }

    return num
  }

  let num_instances = 0

  let factory = function () {
    let instance = {}
    num_instances += 1
    instance.id = num_instances

    instance.get_dominant = function (
      image,
      palette_size = 1,
      use_limits = false
    ) {
      if (palette_size === 0 || palette_size > 100) {
        console.error("Invalid argument")
        return
      }

      let size = 64

      const canvas = document.createElement("canvas")

      canvas.width = size
      canvas.height = size

      const context = canvas.getContext("2d")
      context.imageSmoothingEnabled = false

      context.drawImage(image, 0, 0, size, size)

      const pixels = context.getImageData(0, 0, size, size).data

      const pixelArray = []
      const palette = []

      for (let i = 0; i < pixels.length / 4; i++) {
        const offset = i * 4
        const red = pixels[offset]
        const green = pixels[offset + 1]
        const blue = pixels[offset + 2]
        const alpha = pixels[offset + 3]

        if (use_limits) {
          if (red < 10 && green < 10 && blue < 10) {
            continue
          }

          if (red > 245 && green > 245 && blue > 245) {
            continue
          }
        }

        let matchIndex = undefined

        if (alpha === 0) {
          continue
        }

        for (let j = 0; j < pixelArray.length; j++) {
          if (
            red === pixelArray[j][0] &&
            green === pixelArray[j][1] &&
            blue === pixelArray[j][2]
          ) {
            matchIndex = j
            break
          }
        }

        if (matchIndex === undefined) {
          pixelArray.push([red, green, blue, 1])
        }
        else {
          pixelArray[matchIndex][3]++
        }
      }

      pixelArray.sort(function (a, b) {
        return b[3] - a[3]
      })

      for (let i = 0; i < Math.min(palette_size, pixelArray.length); i++) {
        let arr = [pixelArray[i][0], pixelArray[i][1], pixelArray[i][2]]

        palette.push(instance.check_array(arr))
      }

      let last_p

      for (let i = 0; i < palette_size; i++) {
        if (palette[i] === undefined) {
          if (last_p === undefined) {
            palette[i] = [42, 42, 42]
          }
          else {
            palette[i] = last_p
          }
        }

        last_p = palette[i]
      }

      return instance.array_to_rgb(palette)
    }

    instance.get_lighter_or_darker = function (rgb, amount = 0.2) {
			let mode = "rgb"

			if (rgb.startsWith("#")) {
				mode = "hex"
				rgb = instance.hex_to_rgb(rgb)
			}

			let new_rgb

      if (instance.is_light(rgb)) {
        new_rgb = instance.shadeBlendConvert(-amount, rgb)
      }
      else {
        new_rgb = instance.shadeBlendConvert(amount, rgb)
      }

			if (mode === "rgb") {
				return new_rgb
			}
      else {
				return instance.rgb_to_hex(new_rgb)
			}
    }

    instance.get_darker = function (rgb, amount = 0.2) {
			let mode = "rgb"

			if (rgb.startsWith("#")) {
				mode = "hex"
				rgb = instance.hex_to_rgb(rgb)
			}

			let new_rgb = instance.shadeBlendConvert(-amount, rgb)

			if (mode === "rgb") {
				return new_rgb
			}
      else {
				return instance.rgb_to_hex(new_rgb)
			}
    }

    instance.get_lighter = function (rgb, amount = 0.2) {
			let mode = "rgb"

			if (rgb.startsWith("#")) {
				mode = "hex"
				rgb = instance.hex_to_rgb(rgb)
			}

			let new_rgb = instance.shadeBlendConvert(amount, rgb)

			if (mode === "rgb") {
				return new_rgb
			}
      else {
				return instance.rgb_to_hex(new_rgb)
			}
    }

    instance.is_light = function (rgb) {
      if (rgb.startsWith("#")) {
				rgb = instance.hex_to_rgb(rgb)
			}

      rgb = instance.check_rgb(rgb)

      let r = rgb[0]
      let g = rgb[1]
      let b = rgb[2]

      let uicolors = [r / 255, g / 255, b / 255]

      let c = uicolors.map(c => {
        if (c <= 0.03928) {
          return c / 12.92
        }
        else {
          return Math.pow((c + 0.055) / 1.055, 2.4)
        }
      })

      let L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

      return L > 0.179 ? true : false
    }

    instance.is_dark = function (rgb) {
      return !instance.is_light(rgb)
    }

    instance.get_proper_font = function (rgb) {
      if (instance.is_light(rgb)) {
        return "#000000"
      }
      else {
        return "#ffffff"
      }
    }

    instance.array_to_rgb = function (array) {
      let rgb

      if (Array.isArray(array[0])) {
        rgb = []

        for (let i = 0; i < array.length; i++) {
          rgb[i] = `rgb(${array[i][0]}, ${array[i][1]}, ${array[i][2]})`
        }
      }
      else {
        rgb = `rgb(${array[0]}, ${array[1]}, ${array[2]})`
      }

      return rgb
    }

    instance.rgb_to_array = function (rgb) {
      let array

      if (Array.isArray(rgb)) {
        array = []

        for (let i = 0; i < rgb.length; i++) {
          let split = rgb[i]
            .replace("rgb(", "")
            .replace(")", "")
            .split(",")
          array[i] = split.map(x => parseInt(x))
        }
      }
      else {
        let split = rgb
          .replace("rgb(", "")
          .replace(")", "")
          .split(",")
        array = split.map(x => parseInt(x))
      }

      return array
    }

    instance.rgb_to_rgba = function (rgb, alpha) {
      if (rgb.startsWith("rgba(")) {
        return rgb
      }

      let split = rgb
        .replace("rgb(", "")
        .replace(")", "")
        .split(",")

      return `rgba(${split[0].trim()}, ${split[1].trim()}, ${split[2].trim()}, ${alpha})`
    }

    instance.rgba_to_rgb = function (rgb) {
      if (rgb.startsWith("rgb(")) {
        return rgb
      }

      let split = rgb
        .replace("rgba(", "")
        .replace(")", "")
        .split(",")

      return `rgb(${split[0].trim()}, ${split[1].trim()}, ${split[2].trim()})`
    }

    instance.rgb_to_hex = function (rgb, hash = true) {
      if (typeof rgb === "string") {
        rgb = instance.rgb_to_array(rgb)
      }

      let code = ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
        .toString(16)
        .slice(1)

      if (hash) {
        code = "#" + code
      }

      return code
    }

    instance.hex_to_rgb_array = function (hex) {
      let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i

      hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b
      })

      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

      return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
          ]
        : null
    }

    instance.hex_to_rgb = function (hex) {
      return instance.array_to_rgb(instance.hex_to_rgb_array(hex))
    }

    instance.check_array = function (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] < 0) {
          array[i] = 0
        }
        else if (array[i] > 255) {
          array[i] = 255
        }
      }

      return array
    }

    instance.check_rgb = function (rgb) {
      if (!Array.isArray(rgb)) {
        rgb = instance.rgb_to_array(rgb)
      }

      return rgb
    }

    // This should be replaced with something easier to read
    instance.shadeBlendConvert = function (p, from, to) {
      if (
        typeof p != "number" ||
        p < -1 ||
        p > 1 ||
        typeof from != "string" ||
        (from[0] != "r" && from[0] != "#") ||
        (typeof to != "string" && typeof to != "undefined")
      )
        return null // ErrorCheck
      if (!this.sbcRip)
        this.sbcRip = d => {
          var l = d.length,
            RGB = new Object()
          if (l > 9) {
            d = d.split(",")
            if (d.length < 3 || d.length > 4) return null // ErrorCheck
            ;(RGB[0] = i(d[0].slice(4))),
              (RGB[1] = i(d[1])),
              (RGB[2] = i(d[2])),
              (RGB[3] = d[3] ? parseFloat(d[3]) : -1)
          }
          else {
            if (l == 8 || l == 6 || l < 4) return null // ErrorCheck
            if (l < 6)
              d =
                "#" +
                d[1] +
                d[1] +
                d[2] +
                d[2] +
                d[3] +
                d[3] +
                (l > 4 ? d[4] + "" + d[4] : "") // 3 digit
            ;(d = i(d.slice(1), 16)),
              (RGB[0] = (d >> 16) & 255),
              (RGB[1] = (d >> 8) & 255),
              (RGB[2] = d & 255),
              (RGB[3] =
                l == 9 || l == 5
                  ? r((((d >> 24) & 255) / 255) * 10000) / 10000
                  : -1)
          }
          return RGB
        }
      var i = parseInt,
        r = Math.round,
        h = from.length > 9,
        h =
          typeof to == "string"
            ? to.length > 9
              ? true
              : to == "c"
              ? !h
              : false
            : h,
        b = p < 0,
        p = b ? p * -1 : p,
        to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF",
        f = this.sbcRip(from),
        t = this.sbcRip(to)
      if (!f || !t) return null // ErrorCheck

      if (h) {
        return (
          "rgb(" +
          r((t[0] - f[0]) * p + f[0]) +
          "," +
          r((t[1] - f[1]) * p + f[1]) +
          "," +
          r((t[2] - f[2]) * p + f[2]) +
          (f[3] < 0 && t[3] < 0
            ? ")"
            : "," +
              (f[3] > -1 && t[3] > -1
                ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000
                : t[3] < 0
                ? f[3]
                : t[3]) +
              ")")
        )
      }
      else {
        return (
          "#" +
          (
            0x100000000 +
            (f[3] > -1 && t[3] > -1
              ? r(((t[3] - f[3]) * p + f[3]) * 255)
              : t[3] > -1
              ? r(t[3] * 255)
              : f[3] > -1
              ? r(f[3] * 255)
              : 255) *
              0x1000000 +
            r((t[0] - f[0]) * p + f[0]) * 0x10000 +
            r((t[1] - f[1]) * p + f[1]) * 0x100 +
            r((t[2] - f[2]) * p + f[2])
          )
            .toString(16)
            .slice(f[3] > -1 || t[3] > -1 ? 1 : 3)
        )
      }
    }

    instance.lab2rgb = function (lab) {
      let y = (lab[0] + 16) / 116,
        x = lab[1] / 500 + y,
        z = y - lab[2] / 200,
        r,
        g,
        b

      x = 0.95047 * (x * x * x > 0.008856 ? x * x * x : (x - 16 / 116) / 7.787)
      y = 1.0 * (y * y * y > 0.008856 ? y * y * y : (y - 16 / 116) / 7.787)
      z = 1.08883 * (z * z * z > 0.008856 ? z * z * z : (z - 16 / 116) / 7.787)

      r = x * 3.2406 + y * -1.5372 + z * -0.4986
      g = x * -0.9689 + y * 1.8758 + z * 0.0415
      b = x * 0.0557 + y * -0.204 + z * 1.057

      r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r
      g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g
      b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b

      return [
        Math.max(0, Math.min(1, r)) * 255,
        Math.max(0, Math.min(1, g)) * 255,
        Math.max(0, Math.min(1, b)) * 255
      ]
    }

    instance.rgb2lab = function (rgb) {
      let r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255,
        x,
        y,
        z

      r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
      g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
      b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92

      x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047
      y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0
      z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883

      x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116
      y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116
      z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116

      return [116 * y - 16, 500 * (x - y), 200 * (y - z)]
    }

    instance.deltaE = function (labA, labB) {
      let deltaL = labA[0] - labB[0]
      let deltaA = labA[1] - labB[1]
      let deltaB = labA[2] - labB[2]
      let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2])
      let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2])
      let deltaC = c1 - c2
      let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC
      deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH)
      let sc = 1.0 + 0.045 * c1
      let sh = 1.0 + 0.015 * c1
      let deltaLKlsl = deltaL / 1.0
      let deltaCkcsc = deltaC / sc
      let deltaHkhsh = deltaH / sh
      let i =
        deltaLKlsl * deltaLKlsl +
        deltaCkcsc * deltaCkcsc +
        deltaHkhsh * deltaHkhsh
      return i < 0 ? 0 : Math.sqrt(i)
    }

		instance.get_random_hex = function () {
			let r = get_random_int(0, 255)
			let g = get_random_int(0, 255)
			let b = get_random_int(0, 255)
			return instance.rgb_to_hex([r, g, b])
		}

    instance.get_rgb_distance = function (a, b) {
      return Math.sqrt(( (a[0] - b[0]) * (a[0] - b[0]) +
                         (a[1] - b[1]) * (a[1] - b[1]) +
                         (a[2] - b[2]) * (a[2] - b[2]) ) / ( 256 * Math.sqrt(3) ))
    }

    instance.get_rgba_distance = function (a, b) {
      return Math.sqrt(( (a[0] - b[0]) * (a[0] - b[0]) +
                         (a[1] - b[1]) * (a[1] - b[1]) +
                         (a[2] - b[2]) * (a[2] - b[2]) +
                         (a[3] - b[3]) * (a[3] - b[3]) ) / ( 256 * Math.sqrt(4) ))
    }

    instance.get_dark_color = function (rand) {
      let n = 55

      return instance.rgb_to_hex([
        get_random_int(0, n, undefined, rand),
        get_random_int(0, n, undefined, rand),
        get_random_int(0, n, undefined, rand),
      ])
    }

    instance.get_light_color = function (rand) {
      let n = 55

      return instance.rgb_to_hex([
        255 - get_random_int(0, n, undefined, rand),
        255 - get_random_int(0, n, undefined, rand),
        255 - get_random_int(0, n, undefined, rand),
      ])
    }

    return instance
  }

  return factory
})()
/*
* Date Format 1.2.3
* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
* MIT license
*
* Includes enhancements by Scott Trenda <scott.trenda.net>
* and Kris Kowal <cixar.com/~kris.kowal/>
*
* Accepts a date, a mask, or a date and a mask.
* Returns a formatted version of the given date.
* The date defaults to the current date/time.
* The mask defaults to dateFormat.masks.default.
*/

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
		    val = String(val);
		    len = len || 2;
		    while (val.length < len) val = "0" + val;
		    return val;
		};

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
			    d: d,
			    dd: pad(d),
			    ddd: dF.i18n.dayNames[D],
			    dddd: dF.i18n.dayNames[D + 7],
			    m: m + 1,
			    mm: pad(m + 1),
			    mmm: dF.i18n.monthNames[m],
			    mmmm: dF.i18n.monthNames[m + 12],
			    yy: String(y).slice(2),
			    yyyy: y,
			    h: H % 12 || 12,
			    hh: pad(H % 12 || 12),
			    H: H,
			    HH: pad(H),
			    M: M,
			    MM: pad(M),
			    s: s,
			    ss: pad(s),
			    l: pad(L, 3),
			    L: pad(L > 99 ? Math.round(L / 10) : L),
			    t: H < 12 ? "a" : "p",
			    tt: H < 12 ? "am" : "pm",
			    T: H < 12 ? "A" : "P",
			    TT: H < 12 ? "AM" : "PM",
			    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
} ();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
    monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

// DOM v1.0.0
const DOM = {}
DOM.dataset_obj = {}
DOM.dataset_id = 0

// Select a single element
DOM.el = (query, root = document) => {
  return root.querySelector(query)
}

// Select an array of elements
DOM.els = (query, root = document) => {
  return Array.from(root.querySelectorAll(query))
}

// Select a single element or self
DOM.el_or_self = (query, root = document) => {
  let el = root.querySelector(query)

  if (!el) {
    if (root.classList.contains(query.replace(`.`, ``))) {
      el = root
    }
  }

  return el
}

// Select an array of elements or self
DOM.els_or_self = (query, root = document) => {
  let els = Array.from(root.querySelectorAll(query))

  if (els.length === 0) {
    if (root.classList.contains(query.replace(`.`, ``))) {
      els = [root]
    }
  }

  return els
}

// Clone element
DOM.clone = (el) => {
  return el.cloneNode(true)
}

// Clone element children
DOM.clone_children = (query) => {
  let items = []
  let children = Array.from(DOM.el(query).children)

  for (let c of children) {
    items.push(DOM.clone(c))
  }

  return items
}

// Data set manager
DOM.dataset = (el, value, setvalue) => {
  if (!el) {
    return
  }

  let id = el.dataset.dataset_id

  if (!id) {
    id = DOM.dataset_id
    DOM.dataset_id += 1
    el.dataset.dataset_id = id
    DOM.dataset_obj[id] = {}
  }

  if (setvalue !== undefined) {
    DOM.dataset_obj[id][value] = setvalue
  }
  else {
    return DOM.dataset_obj[id][value]
  }
}

// Create an html element
DOM.create = (type, classes = ``, id = ``) => {
  let el = document.createElement(type)

  if (classes) {
    let classlist = classes.split(` `).filter(x => x != ``)

    for (let cls of classlist) {
      el.classList.add(cls)
    }
  }

  if (id) {
    el.id = id
  }

  return el
}

// Add an event listener
DOM.ev = (element, event, callback, extra) => {
  element.addEventListener(event, callback, extra)
}

// Add multiple event listeners
DOM.evs = (element, events, callback, extra) => {
  for (let event of events) {
    element.addEventListener(event, callback, extra)
  }
}

// Like jQuery's nextAll
DOM.next_all = function* (e, selector) {
  while (e = e.nextElementSibling) {
    if (e.matches(selector)) {
      yield e;
    }
  }
}

// Get item index
DOM.index = (el) => {
  return Array.from(el.parentNode.children).indexOf(el)
}
/**
 * Jdenticon 3.1.1
 * http://jdenticon.com
 *  
 * Built: 2021-08-14T17:50:52.207Z
 *
 * MIT License
 * 
 * Copyright (c) 2014-2020 Daniel Mester Pirttijärvi
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function (umdGlobal, factory) {
    var jdenticon = factory(umdGlobal);

    // Node.js
    if (typeof module !== "undefined" && "exports" in module) {
        module["exports"] = jdenticon;
    }
    // RequireJS
    else if (typeof define === "function" && define["amd"]) {
        define([], function () { return jdenticon; });
    }
    // No module loader
    else {
        umdGlobal["jdenticon"] = jdenticon;
    }
})(typeof self !== "undefined" ? self : this, function (umdGlobal) {
'use strict';

/**
 * Parses a substring of the hash as a number.
 * @param {number} startPosition 
 * @param {number=} octets
 */
function parseHex(hash, startPosition, octets) {
    return parseInt(hash.substr(startPosition, octets), 16);
}

function decToHex(v) {
    v |= 0; // Ensure integer value
    return v < 0 ? "00" :
        v < 16 ? "0" + v.toString(16) :
        v < 256 ? v.toString(16) :
        "ff";
}

function hueToRgb(m1, m2, h) {
    h = h < 0 ? h + 6 : h > 6 ? h - 6 : h;
    return decToHex(255 * (
        h < 1 ? m1 + (m2 - m1) * h :
        h < 3 ? m2 :
        h < 4 ? m1 + (m2 - m1) * (4 - h) :
        m1));
}

/**
 * @param {string} color  Color value to parse. Currently hexadecimal strings on the format #rgb[a] and #rrggbb[aa] are supported.
 * @returns {string}
 */
function parseColor(color) {
    if (/^#[0-9a-f]{3,8}$/i.test(color)) {
        var result;
        var colorLength = color.length;

        if (colorLength < 6) {
            var r = color[1],
                  g = color[2],
                  b = color[3],
                  a = color[4] || "";
            result = "#" + r + r + g + g + b + b + a + a;
        }
        if (colorLength == 7 || colorLength > 8) {
            result = color;
        }
        
        return result;
    }
}

/**
 * Converts a hexadecimal color to a CSS3 compatible color.
 * @param {string} hexColor  Color on the format "#RRGGBB" or "#RRGGBBAA"
 * @returns {string}
 */
function toCss3Color(hexColor) {
    var a = parseHex(hexColor, 7, 2);
    var result;

    if (isNaN(a)) {
        result = hexColor;
    } else {
        var r = parseHex(hexColor, 1, 2),
            g = parseHex(hexColor, 3, 2),
            b = parseHex(hexColor, 5, 2);
        result = "rgba(" + r + "," + g + "," + b + "," + (a / 255).toFixed(2) + ")";
    }

    return result;
}

/**
 * Converts an HSL color to a hexadecimal RGB color.
 * @param {number} hue  Hue in range [0, 1]
 * @param {number} saturation  Saturation in range [0, 1]
 * @param {number} lightness  Lightness in range [0, 1]
 * @returns {string}
 */
function hsl(hue, saturation, lightness) {
    // Based on http://www.w3.org/TR/2011/REC-css3-color-20110607/#hsl-color
    var result;

    if (saturation == 0) {
        var partialHex = decToHex(lightness * 255);
        result = partialHex + partialHex + partialHex;
    }
    else {
        var m2 = lightness <= 0.5 ? lightness * (saturation + 1) : lightness + saturation - lightness * saturation,
              m1 = lightness * 2 - m2;
        result =
            hueToRgb(m1, m2, hue * 6 + 2) +
            hueToRgb(m1, m2, hue * 6) +
            hueToRgb(m1, m2, hue * 6 - 2);
    }

    return "#" + result;
}

/**
 * Converts an HSL color to a hexadecimal RGB color. This function will correct the lightness for the "dark" hues
 * @param {number} hue  Hue in range [0, 1]
 * @param {number} saturation  Saturation in range [0, 1]
 * @param {number} lightness  Lightness in range [0, 1]
 * @returns {string}
 */
function correctedHsl(hue, saturation, lightness) {
    // The corrector specifies the perceived middle lightness for each hue
    var correctors = [ 0.55, 0.5, 0.5, 0.46, 0.6, 0.55, 0.55 ],
          corrector = correctors[(hue * 6 + 0.5) | 0];
    
    // Adjust the input lightness relative to the corrector
    lightness = lightness < 0.5 ? lightness * corrector * 2 : corrector + (lightness - 0.5) * (1 - corrector) * 2;
    
    return hsl(hue, saturation, lightness);
}

/* global umdGlobal */

// In the future we can replace `GLOBAL` with `globalThis`, but for now use the old school global detection for
// backward compatibility.
var GLOBAL = umdGlobal;

/**
 * @typedef {Object} ParsedConfiguration
 * @property {number} colorSaturation
 * @property {number} grayscaleSaturation
 * @property {string} backColor
 * @property {number} iconPadding
 * @property {function(number):number} hue
 * @property {function(number):number} colorLightness
 * @property {function(number):number} grayscaleLightness
 */

var CONFIG_PROPERTIES = {
    G/*GLOBAL*/: "jdenticon_config",
    n/*MODULE*/: "config",
};

var rootConfigurationHolder = {};

/**
 * Defines the deprecated `config` property on the root Jdenticon object without printing a warning in the console
 * when it is being used.
 * @param {!Object} rootObject 
 */
function defineConfigProperty(rootObject) {
    rootConfigurationHolder = rootObject;
}

/**
 * Sets a new icon style configuration. The new configuration is not merged with the previous one. * 
 * @param {Object} newConfiguration - New configuration object.
 */
function configure(newConfiguration) {
    if (arguments.length) {
        rootConfigurationHolder[CONFIG_PROPERTIES.n/*MODULE*/] = newConfiguration;
    }
    return rootConfigurationHolder[CONFIG_PROPERTIES.n/*MODULE*/];
}

/**
 * Gets the normalized current Jdenticon color configuration. Missing fields have default values.
 * @param {Object|number|undefined} paddingOrLocalConfig - Configuration passed to the called API method. A
 *    local configuration overrides the global configuration in it entirety. This parameter can for backward
 *    compatibility also contain a padding value. A padding value only overrides the global padding, not the
 *    entire global configuration.
 * @param {number} defaultPadding - Padding used if no padding is specified in neither the configuration nor
 *    explicitly to the API method.
 * @returns {ParsedConfiguration}
 */
function getConfiguration(paddingOrLocalConfig, defaultPadding) {
    var configObject = 
            typeof paddingOrLocalConfig == "object" && paddingOrLocalConfig ||
            rootConfigurationHolder[CONFIG_PROPERTIES.n/*MODULE*/] ||
            GLOBAL[CONFIG_PROPERTIES.G/*GLOBAL*/] ||
            { },

        lightnessConfig = configObject["lightness"] || { },
        
        // In versions < 2.1.0 there was no grayscale saturation -
        // saturation was the color saturation.
        saturation = configObject["saturation"] || { },
        colorSaturation = "color" in saturation ? saturation["color"] : saturation,
        grayscaleSaturation = saturation["grayscale"],

        backColor = configObject["backColor"],
        padding = configObject["padding"];
    
    /**
     * Creates a lightness range.
     */
    function lightness(configName, defaultRange) {
        var range = lightnessConfig[configName];
        
        // Check if the lightness range is an array-like object. This way we ensure the
        // array contain two values at the same time.
        if (!(range && range.length > 1)) {
            range = defaultRange;
        }

        /**
         * Gets a lightness relative the specified value in the specified lightness range.
         */
        return function (value) {
            value = range[0] + value * (range[1] - range[0]);
            return value < 0 ? 0 : value > 1 ? 1 : value;
        };
    }

    /**
     * Gets a hue allowed by the configured hue restriction,
     * provided the originally computed hue.
     */
    function hueFunction(originalHue) {
        var hueConfig = configObject["hues"];
        var hue;
        
        // Check if 'hues' is an array-like object. This way we also ensure that
        // the array is not empty, which would mean no hue restriction.
        if (hueConfig && hueConfig.length > 0) {
            // originalHue is in the range [0, 1]
            // Multiply with 0.999 to change the range to [0, 1) and then truncate the index.
            hue = hueConfig[0 | (0.999 * originalHue * hueConfig.length)];
        }

        return typeof hue == "number" ?
            
            // A hue was specified. We need to convert the hue from
            // degrees on any turn - e.g. 746° is a perfectly valid hue -
            // to turns in the range [0, 1).
            ((((hue / 360) % 1) + 1) % 1) :

            // No hue configured => use original hue
            originalHue;
    }
        
    return {
        X/*hue*/: hueFunction,
        p/*colorSaturation*/: typeof colorSaturation == "number" ? colorSaturation : 0.5,
        H/*grayscaleSaturation*/: typeof grayscaleSaturation == "number" ? grayscaleSaturation : 0,
        q/*colorLightness*/: lightness("color", [0.4, 0.8]),
        I/*grayscaleLightness*/: lightness("grayscale", [0.3, 0.9]),
        J/*backColor*/: parseColor(backColor),
        Y/*iconPadding*/: 
            typeof paddingOrLocalConfig == "number" ? paddingOrLocalConfig : 
            typeof padding == "number" ? padding : 
            defaultPadding
    }
}

var ICON_TYPE_SVG = 1;

var ICON_TYPE_CANVAS = 2;

var ATTRIBUTES = {
    t/*HASH*/: "data-jdenticon-hash",
    o/*VALUE*/: "data-jdenticon-value"
};

var ICON_SELECTOR = "[" + ATTRIBUTES.t/*HASH*/ +"],[" + ATTRIBUTES.o/*VALUE*/ +"]";

var documentQuerySelectorAll = /** @type {!Function} */ (
    typeof document !== "undefined" && document.querySelectorAll.bind(document));

function getIdenticonType(el) {
    if (el) {
        var tagName = el["tagName"];

        if (/^svg$/i.test(tagName)) {
            return ICON_TYPE_SVG;
        }

        if (/^canvas$/i.test(tagName) && "getContext" in el) {
            return ICON_TYPE_CANVAS;
        }
    }
}

function observer(updateCallback) {
    if (typeof MutationObserver != "undefined") {
        var mutationObserver = new MutationObserver(function onmutation(mutations) {
            for (var mutationIndex = 0; mutationIndex < mutations.length; mutationIndex++) {
                var mutation = mutations[mutationIndex];
                var addedNodes = mutation.addedNodes;
        
                for (var addedNodeIndex = 0; addedNodes && addedNodeIndex < addedNodes.length; addedNodeIndex++) {
                    var addedNode = addedNodes[addedNodeIndex];
        
                    // Skip other types of nodes than element nodes, since they might not support
                    // the querySelectorAll method => runtime error.
                    if (addedNode.nodeType == 1) {
                        if (getIdenticonType(addedNode)) {
                            updateCallback(addedNode);
                        }
                        else {
                            var icons = /** @type {Element} */(addedNode).querySelectorAll(ICON_SELECTOR);
                            for (var iconIndex = 0; iconIndex < icons.length; iconIndex++) {
                                updateCallback(icons[iconIndex]);
                            }
                        }
                    }
                }
                
                if (mutation.type == "attributes" && getIdenticonType(mutation.target)) {
                    updateCallback(mutation.target);
                }
            }
        });

        mutationObserver.observe(document.body, {
            "childList": true,
            "attributes": true,
            "attributeFilter": [ATTRIBUTES.o/*VALUE*/, ATTRIBUTES.t/*HASH*/, "width", "height"],
            "subtree": true,
        });
    }
}

/**
 * Represents a point.
 */
function Point(x, y) {
    this.x = x;
    this.y = y;
}

/**
 * Translates and rotates a point before being passed on to the canvas context. This was previously done by the canvas context itself, 
 * but this caused a rendering issue in Chrome on sizes > 256 where the rotation transformation of inverted paths was not done properly.
 */
function Transform(x, y, size, rotation) {
    this.u/*_x*/ = x;
    this.v/*_y*/ = y;
    this.K/*_size*/ = size;
    this.Z/*_rotation*/ = rotation;
}

/**
 * Transforms the specified point based on the translation and rotation specification for this Transform.
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 * @param {number=} w The width of the transformed rectangle. If greater than 0, this will ensure the returned point is of the upper left corner of the transformed rectangle.
 * @param {number=} h The height of the transformed rectangle. If greater than 0, this will ensure the returned point is of the upper left corner of the transformed rectangle.
 */
Transform.prototype.L/*transformIconPoint*/ = function transformIconPoint (x, y, w, h) {
    var right = this.u/*_x*/ + this.K/*_size*/,
          bottom = this.v/*_y*/ + this.K/*_size*/,
          rotation = this.Z/*_rotation*/;
    return rotation === 1 ? new Point(right - y - (h || 0), this.v/*_y*/ + x) :
           rotation === 2 ? new Point(right - x - (w || 0), bottom - y - (h || 0)) :
           rotation === 3 ? new Point(this.u/*_x*/ + y, bottom - x - (w || 0)) :
           new Point(this.u/*_x*/ + x, this.v/*_y*/ + y);
};

var NO_TRANSFORM = new Transform(0, 0, 0, 0);



/**
 * Provides helper functions for rendering common basic shapes.
 */
function Graphics(renderer) {
    /**
     * @type {Renderer}
     * @private
     */
    this.M/*_renderer*/ = renderer;

    /**
     * @type {Transform}
     */
    this.A/*currentTransform*/ = NO_TRANSFORM;
}
var Graphics__prototype = Graphics.prototype;

/**
 * Adds a polygon to the underlying renderer.
 * @param {Array<number>} points The points of the polygon clockwise on the format [ x0, y0, x1, y1, ..., xn, yn ]
 * @param {boolean=} invert Specifies if the polygon will be inverted.
 */
Graphics__prototype.g/*addPolygon*/ = function addPolygon (points, invert) {
        var this$1 = this;

    var di = invert ? -2 : 2,
          transformedPoints = [];
        
    for (var i = invert ? points.length - 2 : 0; i < points.length && i >= 0; i += di) {
        transformedPoints.push(this$1.A/*currentTransform*/.L/*transformIconPoint*/(points[i], points[i + 1]));
    }
        
    this.M/*_renderer*/.g/*addPolygon*/(transformedPoints);
};
    
/**
 * Adds a polygon to the underlying renderer.
 * Source: http://stackoverflow.com/a/2173084
 * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the entire ellipse.
 * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the entire ellipse.
 * @param {number} size The size of the ellipse.
 * @param {boolean=} invert Specifies if the ellipse will be inverted.
 */
Graphics__prototype.h/*addCircle*/ = function addCircle (x, y, size, invert) {
    var p = this.A/*currentTransform*/.L/*transformIconPoint*/(x, y, size, size);
    this.M/*_renderer*/.h/*addCircle*/(p, size, invert);
};

/**
 * Adds a rectangle to the underlying renderer.
 * @param {number} x The x-coordinate of the upper left corner of the rectangle.
 * @param {number} y The y-coordinate of the upper left corner of the rectangle.
 * @param {number} w The width of the rectangle.
 * @param {number} h The height of the rectangle.
 * @param {boolean=} invert Specifies if the rectangle will be inverted.
 */
Graphics__prototype.i/*addRectangle*/ = function addRectangle (x, y, w, h, invert) {
    this.g/*addPolygon*/([
        x, y, 
        x + w, y,
        x + w, y + h,
        x, y + h
    ], invert);
};

/**
 * Adds a right triangle to the underlying renderer.
 * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the triangle.
 * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the triangle.
 * @param {number} w The width of the triangle.
 * @param {number} h The height of the triangle.
 * @param {number} r The rotation of the triangle (clockwise). 0 = right corner of the triangle in the lower left corner of the bounding rectangle.
 * @param {boolean=} invert Specifies if the triangle will be inverted.
 */
Graphics__prototype.j/*addTriangle*/ = function addTriangle (x, y, w, h, r, invert) {
    var points = [
        x + w, y, 
        x + w, y + h, 
        x, y + h,
        x, y
    ];
    points.splice(((r || 0) % 4) * 2, 2);
    this.g/*addPolygon*/(points, invert);
};

/**
 * Adds a rhombus to the underlying renderer.
 * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the rhombus.
 * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the rhombus.
 * @param {number} w The width of the rhombus.
 * @param {number} h The height of the rhombus.
 * @param {boolean=} invert Specifies if the rhombus will be inverted.
 */
Graphics__prototype.N/*addRhombus*/ = function addRhombus (x, y, w, h, invert) {
    this.g/*addPolygon*/([
        x + w / 2, y,
        x + w, y + h / 2,
        x + w / 2, y + h,
        x, y + h / 2
    ], invert);
};

/**
 * @param {number} index
 * @param {Graphics} g
 * @param {number} cell
 * @param {number} positionIndex
 */
function centerShape(index, g, cell, positionIndex) {
    index = index % 14;

    var k, m, w, h, inner, outer;

    !index ? (
        k = cell * 0.42,
        g.g/*addPolygon*/([
            0, 0,
            cell, 0,
            cell, cell - k * 2,
            cell - k, cell,
            0, cell
        ])) :

    index == 1 ? (
        w = 0 | (cell * 0.5), 
        h = 0 | (cell * 0.8),

        g.j/*addTriangle*/(cell - w, 0, w, h, 2)) :

    index == 2 ? (
        w = 0 | (cell / 3),
        g.i/*addRectangle*/(w, w, cell - w, cell - w)) :

    index == 3 ? (
        inner = cell * 0.1,
        // Use fixed outer border widths in small icons to ensure the border is drawn
        outer = 
            cell < 6 ? 1 :
            cell < 8 ? 2 :
            (0 | (cell * 0.25)),
        
        inner = 
            inner > 1 ? (0 | inner) : // large icon => truncate decimals
            inner > 0.5 ? 1 :         // medium size icon => fixed width
            inner,                    // small icon => anti-aliased border

        g.i/*addRectangle*/(outer, outer, cell - inner - outer, cell - inner - outer)) :

    index == 4 ? (
        m = 0 | (cell * 0.15),
        w = 0 | (cell * 0.5),
        g.h/*addCircle*/(cell - w - m, cell - w - m, w)) :

    index == 5 ? (
        inner = cell * 0.1,
        outer = inner * 4,

        // Align edge to nearest pixel in large icons
        outer > 3 && (outer = 0 | outer),
        
        g.i/*addRectangle*/(0, 0, cell, cell),
        g.g/*addPolygon*/([
            outer, outer,
            cell - inner, outer,
            outer + (cell - outer - inner) / 2, cell - inner
        ], true)) :

    index == 6 ? 
        g.g/*addPolygon*/([
            0, 0,
            cell, 0,
            cell, cell * 0.7,
            cell * 0.4, cell * 0.4,
            cell * 0.7, cell,
            0, cell
        ]) :

    index == 7 ? 
        g.j/*addTriangle*/(cell / 2, cell / 2, cell / 2, cell / 2, 3) :

    index == 8 ? (
        g.i/*addRectangle*/(0, 0, cell, cell / 2),
        g.i/*addRectangle*/(0, cell / 2, cell / 2, cell / 2),
        g.j/*addTriangle*/(cell / 2, cell / 2, cell / 2, cell / 2, 1)) :

    index == 9 ? (
        inner = cell * 0.14,
        // Use fixed outer border widths in small icons to ensure the border is drawn
        outer = 
            cell < 4 ? 1 :
            cell < 6 ? 2 :
            (0 | (cell * 0.35)),

        inner = 
            cell < 8 ? inner : // small icon => anti-aliased border
            (0 | inner),       // large icon => truncate decimals

        g.i/*addRectangle*/(0, 0, cell, cell),
        g.i/*addRectangle*/(outer, outer, cell - outer - inner, cell - outer - inner, true)) :

    index == 10 ? (
        inner = cell * 0.12,
        outer = inner * 3,

        g.i/*addRectangle*/(0, 0, cell, cell),
        g.h/*addCircle*/(outer, outer, cell - inner - outer, true)) :

    index == 11 ? 
        g.j/*addTriangle*/(cell / 2, cell / 2, cell / 2, cell / 2, 3) :

    index == 12 ? (
        m = cell * 0.25,
        g.i/*addRectangle*/(0, 0, cell, cell),
        g.N/*addRhombus*/(m, m, cell - m, cell - m, true)) :

    // 13
    (
        !positionIndex && (
            m = cell * 0.4, w = cell * 1.2,
            g.h/*addCircle*/(m, m, w)
        )
    );
}

/**
 * @param {number} index
 * @param {Graphics} g
 * @param {number} cell
 */
function outerShape(index, g, cell) {
    index = index % 4;

    var m;

    !index ?
        g.j/*addTriangle*/(0, 0, cell, cell, 0) :
        
    index == 1 ?
        g.j/*addTriangle*/(0, cell / 2, cell, cell / 2, 0) :

    index == 2 ?
        g.N/*addRhombus*/(0, 0, cell, cell) :

    // 3
    (
        m = cell / 6,
        g.h/*addCircle*/(m, m, cell - 2 * m)
    );
}

/**
 * Gets a set of identicon color candidates for a specified hue and config.
 * @param {number} hue
 * @param {ParsedConfiguration} config
 */
function colorTheme(hue, config) {
    hue = config.X/*hue*/(hue);
    return [
        // Dark gray
        correctedHsl(hue, config.H/*grayscaleSaturation*/, config.I/*grayscaleLightness*/(0)),
        // Mid color
        correctedHsl(hue, config.p/*colorSaturation*/, config.q/*colorLightness*/(0.5)),
        // Light gray
        correctedHsl(hue, config.H/*grayscaleSaturation*/, config.I/*grayscaleLightness*/(1)),
        // Light color
        correctedHsl(hue, config.p/*colorSaturation*/, config.q/*colorLightness*/(1)),
        // Dark color
        correctedHsl(hue, config.p/*colorSaturation*/, config.q/*colorLightness*/(0))
    ];
}

/**
 * Draws an identicon to a specified renderer.
 * @param {Renderer} renderer
 * @param {string} hash
 * @param {Object|number=} config
 */
function iconGenerator(renderer, hash, config) {
    var parsedConfig = getConfiguration(config, 0.08);

    // Set background color
    if (parsedConfig.J/*backColor*/) {
        renderer.m/*setBackground*/(parsedConfig.J/*backColor*/);
    }
    
    // Calculate padding and round to nearest integer
    var size = renderer.k/*iconSize*/;
    var padding = (0.5 + size * parsedConfig.Y/*iconPadding*/) | 0;
    size -= padding * 2;
    
    var graphics = new Graphics(renderer);
    
    // Calculate cell size and ensure it is an integer
    var cell = 0 | (size / 4);
    
    // Since the cell size is integer based, the actual icon will be slightly smaller than specified => center icon
    var x = 0 | (padding + size / 2 - cell * 2);
    var y = 0 | (padding + size / 2 - cell * 2);

    function renderShape(colorIndex, shapes, index, rotationIndex, positions) {
        var shapeIndex = parseHex(hash, index, 1);
        var r = rotationIndex ? parseHex(hash, rotationIndex, 1) : 0;
        
        renderer.O/*beginShape*/(availableColors[selectedColorIndexes[colorIndex]]);
        
        for (var i = 0; i < positions.length; i++) {
            graphics.A/*currentTransform*/ = new Transform(x + positions[i][0] * cell, y + positions[i][1] * cell, cell, r++ % 4);
            shapes(shapeIndex, graphics, cell, i);
        }
        
        renderer.P/*endShape*/();
    }

    // AVAILABLE COLORS
    var hue = parseHex(hash, -7) / 0xfffffff,
    
          // Available colors for this icon
          availableColors = colorTheme(hue, parsedConfig),

          // The index of the selected colors
          selectedColorIndexes = [];

    var index;

    function isDuplicate(values) {
        if (values.indexOf(index) >= 0) {
            for (var i = 0; i < values.length; i++) {
                if (selectedColorIndexes.indexOf(values[i]) >= 0) {
                    return true;
                }
            }
        }
    }

    for (var i = 0; i < 3; i++) {
        index = parseHex(hash, 8 + i, 1) % availableColors.length;
        if (isDuplicate([0, 4]) || // Disallow dark gray and dark color combo
            isDuplicate([2, 3])) { // Disallow light gray and light color combo
            index = 1;
        }
        selectedColorIndexes.push(index);
    }

    // ACTUAL RENDERING
    // Sides
    renderShape(0, outerShape, 2, 3, [[1, 0], [2, 0], [2, 3], [1, 3], [0, 1], [3, 1], [3, 2], [0, 2]]);
    // Corners
    renderShape(1, outerShape, 4, 5, [[0, 0], [3, 0], [3, 3], [0, 3]]);
    // Center
    renderShape(2, centerShape, 1, null, [[1, 1], [2, 1], [2, 2], [1, 2]]);
    
    renderer.finish();
}

/**
 * Computes a SHA1 hash for any value and returns it as a hexadecimal string.
 * 
 * This function is optimized for minimal code size and rather short messages.
 * 
 * @param {string} message 
 */
function sha1(message) {
    var HASH_SIZE_HALF_BYTES = 40;
    var BLOCK_SIZE_WORDS = 16;

    // Variables
    // `var` is used to be able to minimize the number of `var` keywords.
    var i = 0,
        f = 0,
    
        // Use `encodeURI` to UTF8 encode the message without any additional libraries
        // We could use `unescape` + `encodeURI` to minimize the code, but that would be slightly risky
        // since `unescape` is deprecated.
        urlEncodedMessage = encodeURI(message) + "%80", // trailing '1' bit padding
        
        // This can be changed to a preallocated Uint32Array array for greater performance and larger code size
        data = [],
        dataSize,
        
        hashBuffer = [],

        a = 0x67452301,
        b = 0xefcdab89,
        c = ~a,
        d = ~b,
        e = 0xc3d2e1f0,
        hash = [a, b, c, d, e],

        blockStartIndex = 0,
        hexHash = "";

    /**
     * Rotates the value a specified number of bits to the left.
     * @param {number} value  Value to rotate
     * @param {number} shift  Bit count to shift.
     */
    function rotl(value, shift) {
        return (value << shift) | (value >>> (32 - shift));
    }

    // Message data
    for ( ; i < urlEncodedMessage.length; f++) {
        data[f >> 2] = data[f >> 2] |
            (
                (
                    urlEncodedMessage[i] == "%"
                        // Percent encoded byte
                        ? parseInt(urlEncodedMessage.substring(i + 1, i += 3), 16)
                        // Unencoded byte
                        : urlEncodedMessage.charCodeAt(i++)
                )

                // Read bytes in reverse order (big endian words)
                << ((3 - (f & 3)) * 8)
            );
    }

    // f is now the length of the utf8 encoded message
    // 7 = 8 bytes (64 bit) for message size, -1 to round down
    // >> 6 = integer division with block size
    dataSize = (((f + 7) >> 6) + 1) * BLOCK_SIZE_WORDS;

    // Message size in bits.
    // SHA1 uses a 64 bit integer to represent the size, but since we only support short messages only the least
    // significant 32 bits are set. -8 is for the '1' bit padding byte.
    data[dataSize - 1] = f * 8 - 8;
    
    // Compute hash
    for ( ; blockStartIndex < dataSize; blockStartIndex += BLOCK_SIZE_WORDS) {
        for (i = 0; i < 80; i++) {
            f = rotl(a, 5) + e + (
                    // Ch
                    i < 20 ? ((b & c) ^ ((~b) & d)) + 0x5a827999 :
                    
                    // Parity
                    i < 40 ? (b ^ c ^ d) + 0x6ed9eba1 :
                    
                    // Maj
                    i < 60 ? ((b & c) ^ (b & d) ^ (c & d)) + 0x8f1bbcdc :
                    
                    // Parity
                    (b ^ c ^ d) + 0xca62c1d6
                ) + ( 
                    hashBuffer[i] = i < BLOCK_SIZE_WORDS
                        // Bitwise OR is used to coerse `undefined` to 0
                        ? (data[blockStartIndex + i] | 0)
                        : rotl(hashBuffer[i - 3] ^ hashBuffer[i - 8] ^ hashBuffer[i - 14] ^ hashBuffer[i - 16], 1)
                );

            e = d;
            d = c;
            c = rotl(b, 30);
            b = a;
            a = f;
        }

        hash[0] = a = ((hash[0] + a) | 0);
        hash[1] = b = ((hash[1] + b) | 0);
        hash[2] = c = ((hash[2] + c) | 0);
        hash[3] = d = ((hash[3] + d) | 0);
        hash[4] = e = ((hash[4] + e) | 0);
    }

    // Format hex hash
    for (i = 0; i < HASH_SIZE_HALF_BYTES; i++) {
        hexHash += (
            (
                // Get word (2^3 half-bytes per word)
                hash[i >> 3] >>>

                // Append half-bytes in reverse order
                ((7 - (i & 7)) * 4)
            ) 
            // Clamp to half-byte
            & 0xf
        ).toString(16);
    }

    return hexHash;
}

/**
 * Inputs a value that might be a valid hash string for Jdenticon and returns it 
 * if it is determined valid, otherwise a falsy value is returned.
 */
function isValidHash(hashCandidate) {
    return /^[0-9a-f]{11,}$/i.test(hashCandidate) && hashCandidate;
}

/**
 * Computes a hash for the specified value. Currently SHA1 is used. This function
 * always returns a valid hash.
 */
function computeHash(value) {
    return sha1(value == null ? "" : "" + value);
}



/**
 * Renderer redirecting drawing commands to a canvas context.
 * @implements {Renderer}
 */
function CanvasRenderer(ctx, iconSize) {
    var canvas = ctx.canvas; 
    var width = canvas.width;
    var height = canvas.height;
        
    ctx.save();
        
    if (!iconSize) {
        iconSize = Math.min(width, height);
            
        ctx.translate(
            ((width - iconSize) / 2) | 0,
            ((height - iconSize) / 2) | 0);
    }

    /**
     * @private
     */
    this.l/*_ctx*/ = ctx;
    this.k/*iconSize*/ = iconSize;
        
    ctx.clearRect(0, 0, iconSize, iconSize);
}
var CanvasRenderer__prototype = CanvasRenderer.prototype;

/**
 * Fills the background with the specified color.
 * @param {string} fillColor  Fill color on the format #rrggbb[aa].
 */
CanvasRenderer__prototype.m/*setBackground*/ = function setBackground (fillColor) {
    var ctx = this.l/*_ctx*/;
    var iconSize = this.k/*iconSize*/;

    ctx.fillStyle = toCss3Color(fillColor);
    ctx.fillRect(0, 0, iconSize, iconSize);
};

/**
 * Marks the beginning of a new shape of the specified color. Should be ended with a call to endShape.
 * @param {string} fillColor Fill color on format #rrggbb[aa].
 */
CanvasRenderer__prototype.O/*beginShape*/ = function beginShape (fillColor) {
    var ctx = this.l/*_ctx*/;
    ctx.fillStyle = toCss3Color(fillColor);
    ctx.beginPath();
};

/**
 * Marks the end of the currently drawn shape. This causes the queued paths to be rendered on the canvas.
 */
CanvasRenderer__prototype.P/*endShape*/ = function endShape () {
    this.l/*_ctx*/.fill();
};

/**
 * Adds a polygon to the rendering queue.
 * @param points An array of Point objects.
 */
CanvasRenderer__prototype.g/*addPolygon*/ = function addPolygon (points) {
    var ctx = this.l/*_ctx*/;
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
};

/**
 * Adds a circle to the rendering queue.
 * @param {Point} point The upper left corner of the circle bounding box.
 * @param {number} diameter The diameter of the circle.
 * @param {boolean} counterClockwise True if the circle is drawn counter-clockwise (will result in a hole if rendered on a clockwise path).
 */
CanvasRenderer__prototype.h/*addCircle*/ = function addCircle (point, diameter, counterClockwise) {
    var ctx = this.l/*_ctx*/,
          radius = diameter / 2;
    ctx.moveTo(point.x + radius, point.y + radius);
    ctx.arc(point.x + radius, point.y + radius, radius, 0, Math.PI * 2, counterClockwise);
    ctx.closePath();
};

/**
 * Called when the icon has been completely drawn.
 */
CanvasRenderer__prototype.finish = function finish () {
    this.l/*_ctx*/.restore();
};

/**
 * Draws an identicon to a context.
 * @param {CanvasRenderingContext2D} ctx - Canvas context on which the icon will be drawn at location (0, 0).
 * @param {*} hashOrValue - A hexadecimal hash string or any value that will be hashed by Jdenticon.
 * @param {number} size - Icon size in pixels.
 * @param {Object|number=} config - Optional configuration. If specified, this configuration object overrides any
 *    global configuration in its entirety. For backward compatibility a padding value in the range [0.0, 0.5) can be
 *    specified in place of a configuration object.
 */
function drawIcon(ctx, hashOrValue, size, config) {
    if (!ctx) {
        throw new Error("No canvas specified.");
    }
    
    iconGenerator(new CanvasRenderer(ctx, size), 
        isValidHash(hashOrValue) || computeHash(hashOrValue), 
        config);
}

/**
 * Prepares a measure to be used as a measure in an SVG path, by
 * rounding the measure to a single decimal. This reduces the file
 * size of the generated SVG with more than 50% in some cases.
 */
function svgValue(value) {
    return ((value * 10 + 0.5) | 0) / 10;
}

/**
 * Represents an SVG path element.
 */
function SvgPath() {
    /**
     * This property holds the data string (path.d) of the SVG path.
     * @type {string}
     */
    this.B/*dataString*/ = "";
}
var SvgPath__prototype = SvgPath.prototype;

/**
 * Adds a polygon with the current fill color to the SVG path.
 * @param points An array of Point objects.
 */
SvgPath__prototype.g/*addPolygon*/ = function addPolygon (points) {
    var dataString = "";
    for (var i = 0; i < points.length; i++) {
        dataString += (i ? "L" : "M") + svgValue(points[i].x) + " " + svgValue(points[i].y);
    }
    this.B/*dataString*/ += dataString + "Z";
};

/**
 * Adds a circle with the current fill color to the SVG path.
 * @param {Point} point The upper left corner of the circle bounding box.
 * @param {number} diameter The diameter of the circle.
 * @param {boolean} counterClockwise True if the circle is drawn counter-clockwise (will result in a hole if rendered on a clockwise path).
 */
SvgPath__prototype.h/*addCircle*/ = function addCircle (point, diameter, counterClockwise) {
    var sweepFlag = counterClockwise ? 0 : 1,
          svgRadius = svgValue(diameter / 2),
          svgDiameter = svgValue(diameter),
          svgArc = "a" + svgRadius + "," + svgRadius + " 0 1," + sweepFlag + " ";
            
    this.B/*dataString*/ += 
        "M" + svgValue(point.x) + " " + svgValue(point.y + diameter / 2) +
        svgArc + svgDiameter + ",0" + 
        svgArc + (-svgDiameter) + ",0";
};



/**
 * Renderer producing SVG output.
 * @implements {Renderer}
 */
function SvgRenderer(target) {
    /**
     * @type {SvgPath}
     * @private
     */
    this.C/*_path*/;

    /**
     * @type {Object.<string,SvgPath>}
     * @private
     */
    this.D/*_pathsByColor*/ = { };

    /**
     * @type {SvgElement|SvgWriter}
     * @private
     */
    this.R/*_target*/ = target;

    /**
     * @type {number}
     */
    this.k/*iconSize*/ = target.k/*iconSize*/;
}
var SvgRenderer__prototype = SvgRenderer.prototype;

/**
 * Fills the background with the specified color.
 * @param {string} fillColor  Fill color on the format #rrggbb[aa].
 */
SvgRenderer__prototype.m/*setBackground*/ = function setBackground (fillColor) {
    var match = /^(#......)(..)?/.exec(fillColor),
          opacity = match[2] ? parseHex(match[2], 0) / 255 : 1;
    this.R/*_target*/.m/*setBackground*/(match[1], opacity);
};

/**
 * Marks the beginning of a new shape of the specified color. Should be ended with a call to endShape.
 * @param {string} color Fill color on format #xxxxxx.
 */
SvgRenderer__prototype.O/*beginShape*/ = function beginShape (color) {
    this.C/*_path*/ = this.D/*_pathsByColor*/[color] || (this.D/*_pathsByColor*/[color] = new SvgPath());
};

/**
 * Marks the end of the currently drawn shape.
 */
SvgRenderer__prototype.P/*endShape*/ = function endShape () { };

/**
 * Adds a polygon with the current fill color to the SVG.
 * @param points An array of Point objects.
 */
SvgRenderer__prototype.g/*addPolygon*/ = function addPolygon (points) {
    this.C/*_path*/.g/*addPolygon*/(points);
};

/**
 * Adds a circle with the current fill color to the SVG.
 * @param {Point} point The upper left corner of the circle bounding box.
 * @param {number} diameter The diameter of the circle.
 * @param {boolean} counterClockwise True if the circle is drawn counter-clockwise (will result in a hole if rendered on a clockwise path).
 */
SvgRenderer__prototype.h/*addCircle*/ = function addCircle (point, diameter, counterClockwise) {
    this.C/*_path*/.h/*addCircle*/(point, diameter, counterClockwise);
};

/**
 * Called when the icon has been completely drawn.
 */
SvgRenderer__prototype.finish = function finish () {
        var this$1 = this;
 
    var pathsByColor = this.D/*_pathsByColor*/;
    for (var color in pathsByColor) {
        // hasOwnProperty cannot be shadowed in pathsByColor
        // eslint-disable-next-line no-prototype-builtins
        if (pathsByColor.hasOwnProperty(color)) {
            this$1.R/*_target*/.S/*appendPath*/(color, pathsByColor[color].B/*dataString*/);
        }
    }
};

var SVG_CONSTANTS = {
    T/*XMLNS*/: "http://www.w3.org/2000/svg",
    U/*WIDTH*/: "width",
    V/*HEIGHT*/: "height",
};

/**
 * Renderer producing SVG output.
 */
function SvgWriter(iconSize) {
    /**
     * @type {number}
     */
    this.k/*iconSize*/ = iconSize;

    /**
     * @type {string}
     * @private
     */
    this.F/*_s*/ =
        '<svg xmlns="' + SVG_CONSTANTS.T/*XMLNS*/ + '" width="' + 
        iconSize + '" height="' + iconSize + '" viewBox="0 0 ' + 
        iconSize + ' ' + iconSize + '">';
}
var SvgWriter__prototype = SvgWriter.prototype;

/**
 * Fills the background with the specified color.
 * @param {string} fillColor  Fill color on the format #rrggbb.
 * @param {number} opacity  Opacity in the range [0.0, 1.0].
 */
SvgWriter__prototype.m/*setBackground*/ = function setBackground (fillColor, opacity) {
    if (opacity) {
        this.F/*_s*/ += '<rect width="100%" height="100%" fill="' + 
            fillColor + '" opacity="' + opacity.toFixed(2) + '"/>';
    }
};

/**
 * Writes a path to the SVG string.
 * @param {string} color Fill color on format #rrggbb.
 * @param {string} dataString The SVG path data string.
 */
SvgWriter__prototype.S/*appendPath*/ = function appendPath (color, dataString) {
    this.F/*_s*/ += '<path fill="' + color + '" d="' + dataString + '"/>';
};

/**
 * Gets the rendered image as an SVG string.
 */
SvgWriter__prototype.toString = function toString () {
    return this.F/*_s*/ + "</svg>";
};

/**
 * Draws an identicon as an SVG string.
 * @param {*} hashOrValue - A hexadecimal hash string or any value that will be hashed by Jdenticon.
 * @param {number} size - Icon size in pixels.
 * @param {Object|number=} config - Optional configuration. If specified, this configuration object overrides any
 *    global configuration in its entirety. For backward compatibility a padding value in the range [0.0, 0.5) can be
 *    specified in place of a configuration object.
 * @returns {string} SVG string
 */
function toSvg(hashOrValue, size, config) {
    var writer = new SvgWriter(size);
    iconGenerator(new SvgRenderer(writer), 
        isValidHash(hashOrValue) || computeHash(hashOrValue),
        config);
    return writer.toString();
}

/**
 * Creates a new element and adds it to the specified parent.
 * @param {Element} parentNode
 * @param {string} name
 * @param {...(string|number)} keyValuePairs
 */
function SvgElement_append(parentNode, name) {
    var keyValuePairs = [], len = arguments.length - 2;
    while ( len-- > 0 ) keyValuePairs[ len ] = arguments[ len + 2 ];

    var el = document.createElementNS(SVG_CONSTANTS.T/*XMLNS*/, name);
    
    for (var i = 0; i + 1 < keyValuePairs.length; i += 2) {
        el.setAttribute(
            /** @type {string} */(keyValuePairs[i]),
            /** @type {string} */(keyValuePairs[i + 1])
            );
    }

    parentNode.appendChild(el);
}


/**
 * Renderer producing SVG output.
 */
function SvgElement(element) {
    // Don't use the clientWidth and clientHeight properties on SVG elements
    // since Firefox won't serve a proper value of these properties on SVG
    // elements (https://bugzilla.mozilla.org/show_bug.cgi?id=874811)
    // Instead use 100px as a hardcoded size (the svg viewBox will rescale 
    // the icon to the correct dimensions)
    var iconSize = this.k/*iconSize*/ = Math.min(
        (Number(element.getAttribute(SVG_CONSTANTS.U/*WIDTH*/)) || 100),
        (Number(element.getAttribute(SVG_CONSTANTS.V/*HEIGHT*/)) || 100)
        );
        
    /**
     * @type {Element}
     * @private
     */
    this.W/*_el*/ = element;
        
    // Clear current SVG child elements
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
        
    // Set viewBox attribute to ensure the svg scales nicely.
    element.setAttribute("viewBox", "0 0 " + iconSize + " " + iconSize);
    element.setAttribute("preserveAspectRatio", "xMidYMid meet");
}
var SvgElement__prototype = SvgElement.prototype;

/**
 * Fills the background with the specified color.
 * @param {string} fillColor  Fill color on the format #rrggbb.
 * @param {number} opacity  Opacity in the range [0.0, 1.0].
 */
SvgElement__prototype.m/*setBackground*/ = function setBackground (fillColor, opacity) {
    if (opacity) {
        SvgElement_append(this.W/*_el*/, "rect",
            SVG_CONSTANTS.U/*WIDTH*/, "100%",
            SVG_CONSTANTS.V/*HEIGHT*/, "100%",
            "fill", fillColor,
            "opacity", opacity);
    }
};

/**
 * Appends a path to the SVG element.
 * @param {string} color Fill color on format #xxxxxx.
 * @param {string} dataString The SVG path data string.
 */
SvgElement__prototype.S/*appendPath*/ = function appendPath (color, dataString) {
    SvgElement_append(this.W/*_el*/, "path",
        "fill", color,
        "d", dataString);
};

/**
 * Updates all canvas elements with the `data-jdenticon-hash` or `data-jdenticon-value` attribute.
 */
function updateAll() {
    if (documentQuerySelectorAll) {
        update(ICON_SELECTOR);
    }
}

/**
 * Updates the identicon in the specified `<canvas>` or `<svg>` elements.
 * @param {(string|Element)} el - Specifies the container in which the icon is rendered as a DOM element of the type
 *    `<svg>` or `<canvas>`, or a CSS selector to such an element.
 * @param {*=} hashOrValue - Optional hash or value to be rendered. If not specified, the `data-jdenticon-hash` or
 *    `data-jdenticon-value` attribute will be evaluated.
 * @param {Object|number=} config - Optional configuration. If specified, this configuration object overrides any
 *    global configuration in its entirety. For backward compability a padding value in the range [0.0, 0.5) can be
 *    specified in place of a configuration object.
 */
function update(el, hashOrValue, config) {
    renderDomElement(el, hashOrValue, config, function (el, iconType) {
        if (iconType) {
            return iconType == ICON_TYPE_SVG ? 
                new SvgRenderer(new SvgElement(el)) : 
                new CanvasRenderer(/** @type {HTMLCanvasElement} */(el).getContext("2d"));
        }
    });
}

/**
 * Updates the identicon in the specified canvas or svg elements.
 * @param {(string|Element)} el - Specifies the container in which the icon is rendered as a DOM element of the type
 *    `<svg>` or `<canvas>`, or a CSS selector to such an element.
 * @param {*} hashOrValue - Optional hash or value to be rendered. If not specified, the `data-jdenticon-hash` or
 *    `data-jdenticon-value` attribute will be evaluated.
 * @param {Object|number|undefined} config
 * @param {function(Element,number):Renderer} rendererFactory - Factory function for creating an icon renderer.
 */
function renderDomElement(el, hashOrValue, config, rendererFactory) {
    if (typeof el === "string") {
        if (documentQuerySelectorAll) {
            var elements = documentQuerySelectorAll(el);
            for (var i = 0; i < elements.length; i++) {
                renderDomElement(elements[i], hashOrValue, config, rendererFactory);
            }
        }
        return;
    }
    
    // Hash selection. The result from getValidHash or computeHash is 
    // accepted as a valid hash.
    var hash = 
        // 1. Explicit valid hash
        isValidHash(hashOrValue) ||
        
        // 2. Explicit value (`!= null` catches both null and undefined)
        hashOrValue != null && computeHash(hashOrValue) ||
        
        // 3. `data-jdenticon-hash` attribute
        isValidHash(el.getAttribute(ATTRIBUTES.t/*HASH*/)) ||
        
        // 4. `data-jdenticon-value` attribute. 
        // We want to treat an empty attribute as an empty value. 
        // Some browsers return empty string even if the attribute 
        // is not specified, so use hasAttribute to determine if 
        // the attribute is specified.
        el.hasAttribute(ATTRIBUTES.o/*VALUE*/) && computeHash(el.getAttribute(ATTRIBUTES.o/*VALUE*/));
    
    if (!hash) {
        // No hash specified. Don't render an icon.
        return;
    }
    
    var renderer = rendererFactory(el, getIdenticonType(el));
    if (renderer) {
        // Draw icon
        iconGenerator(renderer, hash, config);
    }
}

/**
 * Renders an identicon for all matching supported elements.
 * 
 * @param {*} hashOrValue - A hexadecimal hash string or any value that will be hashed by Jdenticon. If not 
 * specified the `data-jdenticon-hash` and `data-jdenticon-value` attributes of each element will be
 * evaluated.
 * @param {Object|number=} config - Optional configuration. If specified, this configuration object overrides any global
 * configuration in its entirety. For backward compatibility a padding value in the range [0.0, 0.5) can be
 * specified in place of a configuration object.
 */
function jdenticonJqueryPlugin(hashOrValue, config) {
    this["each"](function (index, el) {
        update(el, hashOrValue, config);
    });
    return this;
}

// This file is compiled to dist/jdenticon.js and dist/jdenticon.min.js

var jdenticon = updateAll;

defineConfigProperty(jdenticon);

// Export public API
jdenticon["configure"] = configure;
jdenticon["drawIcon"] = drawIcon;
jdenticon["toSvg"] = toSvg;
jdenticon["update"] = update;
jdenticon["updateCanvas"] = update;
jdenticon["updateSvg"] = update;

/**
 * Specifies the version of the Jdenticon package in use.
 * @type {string}
 */
jdenticon["version"] = "3.1.1";

/**
 * Specifies which bundle of Jdenticon that is used.
 * @type {string}
 */
jdenticon["bundle"] = "browser-umd";

// Basic jQuery plugin
var jQuery = GLOBAL["jQuery"];
if (jQuery) {
    jQuery["fn"]["jdenticon"] = jdenticonJqueryPlugin;
}

/**
 * This function is called once upon page load.
 */
function jdenticonStartup() {
    var replaceMode = (
        jdenticon[CONFIG_PROPERTIES.n/*MODULE*/] ||
        GLOBAL[CONFIG_PROPERTIES.G/*GLOBAL*/] ||
        { }
    )["replaceMode"];
    
    if (replaceMode != "never") {
        updateAll();
        
        if (replaceMode == "observe") {
            observer(update);
        }
    }
}

// Schedule to render all identicons on the page once it has been loaded.
if (typeof setTimeout === "function") {
    setTimeout(jdenticonStartup, 0);
}

return jdenticon;

});
// NeedContext v3.0

// Main object
const NeedContext = {}
NeedContext.created = false

// Overridable function to perform after show
NeedContext.after_show = () => {}

// Overridable function to perform after hide
NeedContext.after_hide = () => {}

// Minimum menu width and height
NeedContext.min_width = `25px`
NeedContext.min_height = `25px`
NeedContext.back_icon = `⬅️`
NeedContext.back_text = `Back`
NeedContext.clear_text = `Clear`
NeedContext.item_sep = `4px`
NeedContext.layers = {}
NeedContext.level = 0
NeedContext.gap = `0.45rem`
NeedContext.center_top = `50%`

// Set defaults
NeedContext.set_defaults = () => {
  NeedContext.open = false
  NeedContext.mousedown = false
  NeedContext.first_mousedown = false
  NeedContext.keydown = false
  NeedContext.filtered = false
  NeedContext.last_x = 0
  NeedContext.last_y = 0
  NeedContext.layers = {}
}

// Clear the filter
NeedContext.clear_filter = () => {
  NeedContext.filter.value = ``
  NeedContext.do_filter()
  NeedContext.filter.focus()
}

// Filter from keyboard input
NeedContext.do_filter = () => {
  let value = NeedContext.filter.value
  let cleaned = NeedContext.remove_spaces(value).toLowerCase()
  let selected = false

  for (let el of document.querySelectorAll(`.needcontext-separator`)) {
    if (cleaned) {
      el.classList.add(`needcontext-hidden`)
    }
    else {
      el.classList.remove(`needcontext-hidden`)
    }
  }

  for (let text_el of document.querySelectorAll(`.needcontext-text`)) {
    let el = text_el.closest(`.needcontext-item`)
    let text = text_el.textContent.toLowerCase()
    text = NeedContext.remove_spaces(text)

    if (text.includes(cleaned)) {
      el.classList.remove(`needcontext-hidden`)

      if (!selected) {
        NeedContext.select_item(parseInt(el.dataset.index))
        selected = true
      }
    }
    else {
      el.classList.add(`needcontext-hidden`)
    }
  }

  let back = document.querySelector(`#needcontext-back`)
  let clear = document.querySelector(`#needcontext-clear`)
  NeedContext.filtered = cleaned !== ``

  if (NeedContext.filtered) {
    let text = document.querySelector(`#needcontext-clear-text`)
    text.textContent = value
    clear.classList.remove(`needcontext-hidden`)

    if (back) {
      back.classList.add(`needcontext-hidden`)
    }
  }
  else {
    clear.classList.add(`needcontext-hidden`)

    if (back) {
      back.classList.remove(`needcontext-hidden`)
    }
  }
}

// Show based on an element
NeedContext.show_on_element = (el, items, expand = false, margin = 0) => {
  let rect = el.getBoundingClientRect()
  NeedContext.show(rect.left, rect.top + margin, items)

  if (expand) {
    document.querySelector(`#needcontext-container`).style.minWidth = `${el.clientWidth}px`
  }
}

// Show on center of window
NeedContext.show_on_center = (items) => {
  NeedContext.show(undefined, undefined, items)
}

// Show the menu
NeedContext.show = (x, y, items, root = true) => {
  if (!NeedContext.created) {
    NeedContext.create()
  }

  if (root) {
    NeedContext.level = 0
  }

  let center

  if (x === undefined && y === undefined) {
    center = true
  }
  else {
    center = false
  }

  items = items.slice(0)
  let selected_index
  let layer = NeedContext.get_layer()

  if (layer) {
    selected_index = layer.last_index
  }
  else {
    selected_index = 0
  }

  for (let [i, item] of items.entries()) {
    if (i === selected_index) {
      item.selected = true
    }
    else {
      item.selected = false
    }
  }

  let c = NeedContext.container
  c.innerHTML = ``
  let index = 0

  if (!root) {
    c.append(NeedContext.back_button())
  }

  c.append(NeedContext.clear_button())
  let normal_items = []

  for (let item of items) {
    let el = document.createElement(`div`)
    el.classList.add(`needcontext-item`)

    if (item.separator) {
      el.classList.add(`needcontext-separator`)
    }
    else {
      el.classList.add(`needcontext-normal`)

      if (item.image) {
        let image = document.createElement(`img`)
        image.loading = `lazy`

        image.addEventListener(`error`, (e) => {
          e.target.classList.add(`needcontext-hidden`)
        })

        image.classList.add(`needcontext-image`)
        image.src = item.image
        el.append(image)
      }

      if (item.icon) {
        let icon = document.createElement(`div`)
        icon.append(item.icon)
        el.append(icon)
      }

      if (item.text) {
        let text = document.createElement(`div`)
        text.classList.add(`needcontext-text`)
        text.textContent = item.text
        el.append(text)
      }

      if (item.info) {
        el.title = item.info
      }

      el.dataset.index = index
      item.index = index

      if (item.title) {
        el.title = item.title
      }

      el.addEventListener(`mousemove`, () => {
        let index = parseInt(el.dataset.index)

        if (NeedContext.index !== index) {
          NeedContext.select_item(index)
        }
      })

      index += 1
      normal_items.push(item)
    }

    item.element = el
    c.append(el)
  }

  NeedContext.layers[NeedContext.level] = {
    root: root,
    items: items,
    normal_items: normal_items,
    last_index: selected_index,
    x: x,
    y: y,
  }

  NeedContext.main.classList.remove(`needcontext-hidden`)

  if (center) {
    c.style.left = `50%`
    c.style.top = NeedContext.center_top
    c.style.transform = `translate(-50%, -50%)`
  }
  else {
    if (y < 5) {
      y = 5
    }

    if (x < 5) {
      x = 5
    }

    if ((y + c.offsetHeight) + 5 > window.innerHeight) {
      y = window.innerHeight - c.offsetHeight - 5
    }

    if ((x + c.offsetWidth) + 5 > window.innerWidth) {
      x = window.innerWidth - c.offsetWidth - 5
    }

    NeedContext.last_x = x
    NeedContext.last_y = y

    x = Math.max(x, 0)
    y = Math.max(y, 0)

    c.style.left = `${x}px`
    c.style.top = `${y}px`
    c.style.transform = `unset`
  }

  NeedContext.filter.value = ``
  NeedContext.filter.focus()
  let container = document.querySelector(`#needcontext-container`)
  container.style.minWidth = NeedContext.min_width
  container.style.minHeight = NeedContext.min_height
  NeedContext.select_item(selected_index)
  NeedContext.open = true
  NeedContext.after_show()
}

// Hide the menu
NeedContext.hide = () => {
  if (NeedContext.open) {
    NeedContext.main.classList.add(`needcontext-hidden`)
    NeedContext.set_defaults()
    NeedContext.after_hide()
  }
}

// Select an item by index
NeedContext.select_item = (index) => {
  let els = Array.from(document.querySelectorAll(`.needcontext-normal`))

  for (let [i, el] of els.entries()) {
    if (i === index) {
      el.classList.add(`needcontext-item-selected`)
    }
    else {
      el.classList.remove(`needcontext-item-selected`)
    }
  }

  NeedContext.index = index
}

// Select an item above
NeedContext.select_up = () => {
  let waypoint = false
  let first_visible
  let items = NeedContext.get_layer().normal_items.slice(0).reverse()

  for (let item of items) {
    if (!NeedContext.is_visible(item.element)) {
      continue
    }

    if (first_visible === undefined) {
      first_visible = item.index
    }

    if (waypoint) {
      NeedContext.select_item(item.index)
      return
    }

    if (item.index === NeedContext.index) {
      waypoint = true
    }
  }

  NeedContext.select_item(first_visible)
}

// Select an item below
NeedContext.select_down = () => {
  let waypoint = false
  let first_visible
  let items = NeedContext.get_layer().normal_items

  for (let item of items) {
    if (!NeedContext.is_visible(item.element)) {
      continue
    }

    if (first_visible === undefined) {
      first_visible = item.index
    }

    if (waypoint) {
      NeedContext.select_item(item.index)
      return
    }

    if (item.index === NeedContext.index) {
      waypoint = true
    }
  }

  NeedContext.select_item(first_visible)
}

// Do the selected action
NeedContext.select_action = async (e, index = NeedContext.index, mode = `mouse`) => {
  if (mode === `mouse`) {
    if (!e.target.closest(`.needcontext-normal`)) {
      return
    }
  }

  let x = NeedContext.last_x
  let y = NeedContext.last_y
  let item = NeedContext.get_layer().normal_items[index]

  function show_below (items) {
    NeedContext.get_layer().last_index = index
    NeedContext.level += 1

    if (e.clientY) {
      y = e.clientY
    }

    NeedContext.show(x, y, items, false)
  }

  function do_items (items) {
    if (items.length === 1 && item.direct) {
      NeedContext.hide()
      items[0].action(e)
    }
    else {
      show_below(items)
    }

    return
  }

  async function check_item () {
    if (item.action) {
      NeedContext.hide()
      item.action(e)
      return
    }
    else if (item.items) {
      do_items(item.items)
    }
    else if (item.get_items) {
      let items = await item.get_items()
      do_items(items)
    }
  }

  if (mode === `keyboard`) {
    check_item()
    return
  }

  if (e.button === 0) {
    check_item()
  }
  else if (e.button === 1) {
    if (item.alt_action) {
      NeedContext.hide()
      item.alt_action(e)
    }
  }
}

// Check if item is hidden
NeedContext.is_visible = (el) => {
  return !el.classList.contains(`needcontext-hidden`)
}

// Remove all spaces from text
NeedContext.remove_spaces = (text) => {
  return text.replace(/[\s-]+/g, ``)
}

// Prepare css and events
NeedContext.init = () => {
  let style = document.createElement(`style`)

  let css = `
    #needcontext-main {
      position: fixed;
      z-index: 999999999;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }

    .needcontext-hidden {
      display: none !important;
    }

    #needcontext-container {
      z-index: 2;
      position: absolute;
      background-color: white;
      color: black;
      font-size: 16px;
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      user-select: none;
      border: 1px solid #2B2F39;
      border-radius: 5px;
      padding-top: 6px;
      padding-bottom: 6px;
      max-height: 80vh;
      overflow: auto;
      text-align: left;
      max-width: 98%;
    }

    #needcontext-filter {
      opacity: 0;
    }

    .needcontext-item {
      white-space: nowrap;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${NeedContext.gap};
    }

    .needcontext-normal {
      padding-left: 10px;
      padding-right: 10px;
      padding-top: ${NeedContext.item_sep};
      padding-bottom: ${NeedContext.item_sep};
      cursor: pointer;
    }

    .needcontext-button {
      padding-left: 10px;
      padding-right: 10px;
      padding-top: ${NeedContext.item_sep};
      padding-bottom: ${NeedContext.item_sep};
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${NeedContext.gap};
      cursor: pointer;
    }

    .needcontext-button:hover {
      text-shadow: 0 0 1rem currentColor;
    }

    .needcontext-separator {
      border-top: 1px solid currentColor;
      margin-left: 10px;
      margin-right: 10px;
      margin-top: ${NeedContext.item_sep};
      margin-bottom: ${NeedContext.item_sep};
      opacity: 0.7;
    }

    .needcontext-item-selected {
      background-color: rgba(0, 0, 0, 0.18);
    }

    .needcontext-image {
      width: 1.25rem;
      height: 1.25rem;
      object-fit: contain;
    }
  `

  style.innerText = css
  document.head.appendChild(style)

  document.addEventListener(`mousedown`, (e) => {
    if (!NeedContext.open || !e.target) {
      return
    }

    NeedContext.first_mousedown = true

    if (e.target.closest(`#needcontext-container`)) {
      NeedContext.mousedown = true
    }
  })

  document.addEventListener(`mouseup`, (e) => {
    if (!NeedContext.open || !e.target) {
      return
    }

    if (!e.target.closest(`#needcontext-container`)) {
      if (NeedContext.first_mousedown) {
        NeedContext.hide()
      }
    }
    else if (e.target.closest(`.needcontext-back`)) {
      if (e.button === 0) {
        NeedContext.go_back()
      }
    }
    else if (e.target.closest(`.needcontext-clear`)) {
      if (e.button === 0) {
        NeedContext.clear_filter()
      }
    }
    else if (NeedContext.mousedown) {
      NeedContext.select_action(e)
    }

    NeedContext.mousedown = false
  })

  document.addEventListener(`keydown`, (e) => {
    if (!NeedContext.open) {
      return
    }

    if (NeedContext.modkey(e)) {
      return
    }

    NeedContext.keydown = true

    if (e.key === `ArrowUp`) {
      NeedContext.select_up()
      e.preventDefault()
    }
    else if (e.key === `ArrowDown`) {
      NeedContext.select_down()
      e.preventDefault()
    }
    else if (e.key === `Backspace`) {
      if (!NeedContext.filtered) {
        NeedContext.go_back()
        e.preventDefault()
      }
    }
  })

  document.addEventListener(`keyup`, (e) => {
    if (!NeedContext.open) {
      return
    }

    if (!NeedContext.keydown) {
      return
    }

    if (NeedContext.modkey(e)) {
      return
    }

    NeedContext.keydown = false

    if (e.key === `Escape`) {
      NeedContext.hide()
      e.preventDefault()
    }
    else if (e.key === `Enter`) {
      NeedContext.select_action(e, undefined, `keyboard`)
      e.preventDefault()
    }
  })

  NeedContext.set_defaults()
}

// Create elements
NeedContext.create = () => {
  NeedContext.main = document.createElement(`div`)
  NeedContext.main.id = `needcontext-main`
  NeedContext.main.classList.add(`needcontext-hidden`)
  NeedContext.container = document.createElement(`div`)
  NeedContext.container.id = `needcontext-container`
  NeedContext.filter = document.createElement(`input`)
  NeedContext.filter.id = `needcontext-filter`
  NeedContext.filter.type = `text`
  NeedContext.filter.autocomplete = `off`
  NeedContext.filter.spellcheck = false
  NeedContext.filter.placeholder = `Filter`

  NeedContext.filter.addEventListener(`input`, (e) => {
    NeedContext.do_filter()
  })

  NeedContext.main.addEventListener(`contextmenu`, (e) => {
    e.preventDefault()
  })

  NeedContext.main.append(NeedContext.filter)
  NeedContext.main.append(NeedContext.container)
  document.body.appendChild(NeedContext.main)
  NeedContext.created = true
}

// Current layer
NeedContext.get_layer = () => {
  return NeedContext.layers[NeedContext.level]
}

// Previous layer
NeedContext.prev_layer = () => {
  return NeedContext.layers[NeedContext.level - 1]
}

// Go back to previous layer
NeedContext.go_back = () => {
  if (NeedContext.level === 0) {
    return
  }

  let layer = NeedContext.prev_layer()
  NeedContext.level -= 1
  NeedContext.show(layer.x, layer.y, layer.items, layer.root)
}

// Create back button
NeedContext.back_button = () => {
  let el = document.createElement(`div`)
  el.id = `needcontext-back`
  el.classList.add(`needcontext-back`)
  el.classList.add(`needcontext-button`)
  let icon = document.createElement(`div`)
  icon.append(NeedContext.back_icon)
  let text = document.createElement(`div`)
  text.textContent = NeedContext.back_text
  el.append(icon)
  el.append(text)
  el.title = `Shortcut: Backspace`
  return el
}

// Create clear button
NeedContext.clear_button = () => {
  let el = document.createElement(`div`)
  el.id = `needcontext-clear`
  el.classList.add(`needcontext-clear`)
  el.classList.add(`needcontext-button`)
  el.classList.add(`needcontext-hidden`)
  let icon = document.createElement(`div`)
  icon.append(NeedContext.back_icon)
  let text = document.createElement(`div`)
  text.id = `needcontext-clear-text`
  text.textContent = NeedContext.clear_text
  el.append(icon)
  el.append(text)
  el.title = `Type to filter. Click to clear`
  return el
}

// Return true if a mod key is pressed
NeedContext.modkey = (e) => {
  return e.ctrlKey || e.altKey || e.shiftKey || e.metaKey
}

// Start
NeedContext.init()
const NiceGesture = {}
NiceGesture.enabled = true
NiceGesture.button = 1
NiceGesture.threshold = 10

NiceGesture.start = (container, actions) => {
  container.addEventListener(`mousedown`, (e) => {
    if (!NiceGesture.enabled) {
      return
    }

    NiceGesture.reset()

    if (e.button === NiceGesture.button) {
      NiceGesture.active = true
      NiceGesture.first_y = e.clientY
      NiceGesture.first_x = e.clientX
    }
  })

  container.addEventListener(`mousemove`, (e) => {
    if (!NiceGesture.enabled || !NiceGesture.active || NiceGesture.coords.length > 1000) {
      return
    }

    let coord = {
      x: e.clientX,
      y: e.clientY,
    }

    NiceGesture.coords.push(coord)
  })

  container.addEventListener(`mouseup`, (e) => {
    if (e.button !== NiceGesture.button) {
      return
    }

    if (!NiceGesture.enabled || !NiceGesture.active) {
      actions.default(e)
      return
    }

    NiceGesture.check(e, actions)
  })

  NiceGesture.reset()
}

NiceGesture.reset = () => {
  NiceGesture.active = false
  NiceGesture.first_y = 0
  NiceGesture.first_x = 0
  NiceGesture.last_y = 0
  NiceGesture.last_x = 0
  NiceGesture.coords = []
}

NiceGesture.check = (e, actions) => {
  NiceGesture.last_x = e.clientX
  NiceGesture.last_y = e.clientY

  if (NiceGesture.action(e, actions)) {
    e.preventDefault()
  }
  else if (actions.default) {
    actions.default(e)
  }

  NiceGesture.reset(actions)
}

NiceGesture.action = (e, actions) => {
  if (NiceGesture.coords.length === 0) {
    return false
  }

  let ys = NiceGesture.coords.map(c => c.y)
  let max_y = Math.max(...ys)
  let min_y = Math.min(...ys)

  let xs = NiceGesture.coords.map(c => c.x)
  let max_x = Math.max(...xs)
  let min_x = Math.min(...xs)

  if (Math.abs(max_y - min_y) < NiceGesture.threshold &&
    Math.abs(max_x - min_x) < NiceGesture.threshold) {
    return false
  }

  let gt = NiceGesture.threshold
  let path_y, path_x

  if (min_y < NiceGesture.first_y - gt) {
    path_y = `up`
  }
  else if (max_y > NiceGesture.first_y + gt) {
    path_y = `down`
  }

  if (path_y === `up`) {
    if ((Math.abs(NiceGesture.last_y - min_y) > gt) || (max_y > NiceGesture.first_y + gt)) {
      path_y = `up_and_down`
    }
  }

  if (path_y === `down`) {
    if ((Math.abs(NiceGesture.last_y - max_y) > gt) || (min_y < NiceGesture.first_y - gt)) {
      path_y = `up_and_down`
    }
  }

  if (max_x > NiceGesture.first_x + gt) {
    path_x = `right`
  }
  else if (min_x < NiceGesture.first_x - gt) {
    path_x = `left`
  }

  if (path_x === `left`) {
    if ((Math.abs(NiceGesture.last_x - min_x) > gt) || (max_x > NiceGesture.first_x + gt)) {
      path_x = `left_and_right`
    }
  }

  if (path_x === `right`) {
    if ((Math.abs(NiceGesture.last_x - max_x) > gt) || (min_x < NiceGesture.first_x - gt)) {
      path_x = `left_and_right`
    }
  }

  let path

  if (max_y - min_y > max_x - min_x) {
    path = path_y
  }
  else {
    path = path_x
  }

  if (actions[path]) {
    actions[path](e)
  }

  return true
}