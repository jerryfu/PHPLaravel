webpackJsonp([0],{"0iPh":function(t,e){t.exports=jQuery},"3dlF":function(module,exports,__webpack_require__){"use strict";function guid(){function t(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}function obj_prop_list(t){for(var e in t)t.hasOwnProperty(e)&&console.log(e+" :"+t[e])}function isValidJSONDate(t,e){var e=e||"yyyy-mm-dd",n=/[^mdy]/.exec(e)[0],o=e.split(n),r=t.split("T");if(1==r.length)return!1;var i=r[0].split(n);return function(t,e){for(var n,o,r,i=0,a=e.length;i<a;i++)/m/.test(e[i])&&(n=t[i]),/d/.test(e[i])&&(o=t[i]),/y/.test(e[i])&&(r=t[i]);return n>0&&n<13&&r&&4===r.length&&o>0&&o<=new Date(r,n,0).getDate()}(i,o)}function stdTime(t){return t&&isValidJSONDate(t,null)?Moment(t).format("HH:mm"):null}function stdDate(t){return t&&isValidJSONDate(t,null)?Moment(t).format("YYYY-MM-DD"):null}function stdNumber(t,e){return void 0==t||null==t?"":fmtMoney(floatSpot(t,e))}function stdNumberFloat(t,e){return void 0==t||null==t?"":floatSpot(t,e).toFixed(e)}function fmtMoney(t,e){if(void 0==t||null==t)return"";for(var n="string"==typeof e&&null!=e&&void 0!=e?e:",",o=t.toString().split("."),r=/(-?\d+)(\d{3})/;r.test(o[0]);)o[0]=o[0].replace(r,"$1"+n+"$2");return o.join(".")}function getOptByVal(t,e){var n=t.filter(function(t){return t.value===e});return n.length>0?n[0]:null}function getNowDate(){var t=new Date;return new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0)}function monthFirstDay(){var t=new Date;return new Date(t.getFullYear(),t.getMonth(),1)}function monthLastDay(){var t=new Date;return new Date(t.getFullYear(),t.getMonth()+1,0)}function tim(){var t=new Date;return t.toUTCString()+"."+t.getMilliseconds().toString()}function pad(t,e,n,o){var r;if(void 0===e)var e=0;if(void 0===n)var n=" ";if(void 0===o)var o=3;if(e+1>=t.length)switch(o){case 1:t=Array(e+1-t.length).join(n)+t;break;case 2:t+=Array(e+1-t.length).join(n);break;case 3:var i=Math.ceil((r=e-t.length)/2),a=r-i;t=Array(a+1).join(n)+t+Array(i+1).join(n)}return t}function tosMessage(t,e,n){toastr.options.closeButton=!0,n==ToastrType.info&&toastr.info(e,t),n==ToastrType.success&&toastr.success(e,t),n==ToastrType.error&&toastr.error(e,t),n==ToastrType.warning&&toastr.warning(e,t)}function formatFileSize(t){var e=t;if(e<=1024)return e+"Byte";if(e>1024&&e<=1048576){var n=e/1024,o=Math.ceil(n);return o+"KB"}var n=e/1048576,o=Math.ceil(n);return o+"MB"}function clone(t){if(null==t||"object"!=(void 0===t?"undefined":_typeof(t)))return t;var e=t.constructor();for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}function floatSpot(t,e){var n=Math.pow(10,e);return Math.round(t*n)/n}function divisor(t,e,n){return null!==t&&void 0!=t?null!=n?floatSpot(t/e,n):t/e:null}function ifrmDown(t){$("#file_down").remove();var e=($(this).attr("item"),t),n=$('<iframe id="file_down" style="display:none">');n.attr("src",e),$(document.body).append(n)}function isNumeric(t){parseFloat(t);return!isNaN(parseFloat(t))&&isFinite(t)}function getBrower(){var t,e={},n=navigator.userAgent.toLowerCase();return(t=n.match(/rv:([\d.]+)\) like gecko/))?e.ie=t[1]:(t=n.match(/msie ([\d.]+)/))?e.ie=t[1]:(t=n.match(/firefox\/([\d.]+)/))?e.firefox=t[1]:(t=n.match(/chrome\/([\d.]+)/))?e.chrome=t[1]:(t=n.match(/opera.([\d.]+)/))?e.opera=t[1]:(t=n.match(/version\/([\d.]+).*safari/))&&(e.safari=t[1]),e.ie?"IE: "+e.ie:e.firefox?"Firefox: "+e.firefox:e.chrome?"Chrome: "+e.chrome:e.opera?"Opera: "+e.opera:e.safari?"Safari: "+e.safari:void 0}function checkTwID(id){if(null!=id&&""!=id){var city=new Array(1,10,19,28,37,46,55,64,39,73,82,2,11,20,48,29,38,47,56,65,74,83,21,3,12,30);if(id=id.toUpperCase(),-1==id.search(/^[A-Z](1|2)\d{8}$/i))return!1;id=id.split("");for(var total=city[id[0].charCodeAt(0)-65],i=1;i<=8;i++)total+=eval(id[i])*(9-i);return(total+=eval(id[9]))%10==0}return!0}function DiffDate(t,e){if(null!=t&&null!=e){var n=new Date(t),o=new Date(e);if(n<=o){return{result:1,diff_day:Math.abs(o.getTime()-n.getTime())/1e3/60/60/24+1}}return{result:-1,diff_day:0}}return{result:-2,diff_day:0}}function MntV(t){return null===t||void 0===t?null:Moment(t)}function formatNumber(t){if(void 0==t||null==t)return"";for(var e=t.toFixed(2)+"",n=e.split("."),o=n[0],r=(n.length>1&&n[1],/(\d+)(\d{3})/);r.test(o);)o=o.replace(r,"$1,$2");return o}function queryString(t,e){e||(e=window.location.href),t=t.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+t+"(=([^&#]*)|&|#|$)"),o=n.exec(e);return o?o[2]?decodeURIComponent(o[2].replace(/\+/g," ")):"":null}function makeInputValue(t){var e=t.target;return"true"==e.value||"false"!=e.value&&e.value}function getTwDate(t){if(null==t||void 0==t)return"";var e=(new Date(t),Moment(t)),n=e.year(),o=e.month()+1,r=e.date();e.hours(),e.minutes(),e.seconds();return n-1911+"年"+o+"月"+r+"日 "}function mkTpl(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return function(){for(var n=[],o=0;o<arguments.length;o++)n[o]=arguments[o];var r=n[n.length-1]||{},i=[t[0]];return e.forEach(function(e,o){var a=Number.isInteger(e)?n[e]:r[e];i.push(a,t[o+1])}),i.join("")}}function isOK(t){return void 0!==t&&null!==t&&""!==t}function testZH(t){for(var e=0;e<t.length;e++)if(t.charCodeAt(e)<19968||t.charCodeAt(e)>40869)return!1;return!0}function foAdd(t,e){var n,o,r;try{n=t.toString().split(".")[1].length}catch(t){n=0}try{o=e.toString().split(".")[1].length}catch(t){o=0}return r=Math.pow(10,Math.max(n,o)),(foMul(t,r)+foMul(e,r))/r}function foSubtraction(t,e){var n,o,r,i;try{n=t.toString().split(".")[1].length}catch(t){n=0}try{o=e.toString().split(".")[1].length}catch(t){o=0}return r=Math.pow(10,Math.max(n,o)),i=n>=o?n:o,((t*r-e*r)/r).toFixed(i)}function foMul(t,e){var n=0,o=t.toString(),r=e.toString();try{n+=o.split(".")[1].length}catch(t){}try{n+=r.split(".")[1].length}catch(t){}return Number(o.replace(".",""))*Number(r.replace(".",""))/Math.pow(10,n)}function foDiv(t,e){var n,o,r=0,i=0;try{r=t.toString().split(".")[1].length}catch(t){}try{i=e.toString().split(".")[1].length}catch(t){}return n=Number(t.toString().replace(".","")),o=Number(e.toString().replace(".","")),n/o*Math.pow(10,i-r)}function getMenuName(t){var e=t.filter(function(t){return 1==t.use}),n=e&&e.length>0?e[0].sub.filter(function(t){return 1==t.use}):null;return{m1:e&&e.length>0?e[0].menu_name:null,m2:n&&n.length>0?n[0].menu_name:""}}function pickLang(t,e,n,o,r){return void 0===n&&(n=null),void 0===o&&(o=null),void 0===r&&(r=null),""}function pv(t){var e=null;return paramjs.forEach(function(n,o){n.key==t&&(e=n.value)}),e}function getOptionName(t,e){var n=e.filter(function(e){return e.value==t}),o="";return n.length>0&&(o=n[0].label),o}function fnTg(t){var e=0,n="0",o=0,r="0";if(0!=t){var i=t.toString().split(".");e=parseInt(i[0]),n=i.length>1?i[1]:"0",o="1"==n?10:parseInt(n),r=(0!=e?e+"斤":"")+("0"!=n?o+"兩":"")}return r}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};Object.defineProperty(exports,"__esModule",{value:!0});var $=__webpack_require__("0iPh"),toastr=__webpack_require__("vQJi"),Moment=__webpack_require__("PJh5");exports.guid=guid,exports.isValidJSONDate=isValidJSONDate,exports.stdTime=stdTime,exports.stdDate=stdDate,exports.stdNumber=stdNumber,exports.stdNumberFloat=stdNumberFloat,exports.fmtMoney=fmtMoney,exports.getOptByVal=getOptByVal,exports.tim=tim,exports.pad=pad,exports.tosMessage=tosMessage,exports.formatFileSize=formatFileSize,exports.clone=clone,exports.floatSpot=floatSpot,exports.divisor=divisor,exports.ifrmDown=ifrmDown,exports.isNumeric=isNumeric,exports.MntV=MntV,exports.formatNumber=formatNumber,exports.queryString=queryString,exports.makeInputValue=makeInputValue,exports.getTwDate=getTwDate,exports.packegeErrList=function(t){var e=[];return t&&t.length>0&&t.forEach(function(t,n){t.err.forEach(function(n,o){e.push(t.field+":"+n.message)})}),e.join("<br />")},exports.showErrList=function(t,e){tosMessage(t,exports.packegeErrList(e),ToastrType.error)},exports.mkTpl=mkTpl,exports.isOK=isOK,exports.testZH=testZH,exports.foAdd=foAdd,exports.foSubtraction=foSubtraction,exports.foMul=foMul,exports.foDiv=foDiv,exports.getMenuName=getMenuName,exports.pickLang=pickLang,exports.pv=pv,exports.getOptionName=getOptionName,exports.fnTg=fnTg,exports.OpenWinFunc=function(t){var e=[];e.push("demand_sn="+t);var n=e.join("&"),o=gb_approot+"Active/Func/PackingList?"+n,r="width=960";r+=", height=600",r+=", top=0, left=0",r+=", fullscreen=no",r+=", resizable=yes",r+=", toolbar=no,menubar=no,location=no,status=no",window.open(o,"PackingList",r).focus()}},"5FKN":function(t,e,n){"use strict";var o,r=n("3dlF");!function(t){var e="mask_unique_"+r.guid();t.mask_show=function(t){void 0===t&&(t="資料讀取中……");var n=document.getElementsByTagName("BODY")[0],o=document.createElement("div");o.id=e,o.className="loading",o.innerHTML='<div class="loader" data-loader="circle-side"></div><p>'+t+"</p>",n.appendChild(o)},t.mask_off=function(){var t=document.getElementsByTagName("BODY")[0];if(t){var n=document.getElementById(e);n&&t.removeChild(n)}}}(o||(o={})),t.exports=o},LGuY:function(t,e){t.exports=function(){throw new Error("define cannot be used indirect")}},OhPk:function(t,e,n){"use strict";function o(){$("#validate_img").attr("src",gb_approot+"Ah/VC.ashx?vn="+ValidateCode+"&t"+(new Date).getTime())}Object.defineProperty(e,"__esModule",{value:!0});var r=n("5FKN");$(document).ready(function(){$("#frmx").submit(function(t){t.preventDefault();$("#account").val(),$("#password").val(),$("#validate").val();r.mask_show("登錄中..."),$.ajax({type:"POST",url:gb_approot+"_SysAdm/loginCheck",data:{},dataType:"json",headers:{"X-CSRF-TOKEN":$('meta[name="_token"]').attr("content")}}).done(function(t,e,n){0==t.state?document.location.href=t.url:1==t.state?(o(),$("#password").val(""),alert(t.message),r.mask_off()):2==t.state?(o(),$("#password").val(""),alert(t.message),r.mask_off()):3==t.state?(o(),$("#password").val(""),alert(t.message),r.mask_off()):(o(),alert("請按“F5”重新更新畫面後再登入，如仍無法登錄請聯絡管理員。"),r.mask_off())}).fail(function(t,e,n){r.mask_off(),alert(n)})})})},vQJi:function(t,e,n){var o,r;!function(i){o=[n("0iPh")],void 0!==(r=function(t){return function(){function e(t,e,n){return m({type:b.error,iconClass:g().iconClasses.error,message:t,optionsOverride:n,title:e})}function n(e,n){return e||(e=g()),h=t("#"+e.containerId),h.length?h:(n&&(h=f(e)),h)}function o(t,e,n){return m({type:b.info,iconClass:g().iconClasses.info,message:t,optionsOverride:n,title:e})}function r(t){w=t}function i(t,e,n){return m({type:b.success,iconClass:g().iconClasses.success,message:t,optionsOverride:n,title:e})}function a(t,e,n){return m({type:b.warning,iconClass:g().iconClasses.warning,message:t,optionsOverride:n,title:e})}function s(t,e){var o=g();h||n(o),c(t,o,e)||l(o)}function u(e){var o=g();if(h||n(o),e&&0===t(":focus",e).length)return void v(e);h.children().length&&h.remove()}function l(e){for(var n=h.children(),o=n.length-1;o>=0;o--)c(t(n[o]),e)}function c(e,n,o){var r=!(!o||!o.force)&&o.force;return!(!e||!r&&0!==t(":focus",e).length)&&(e[n.hideMethod]({duration:n.hideDuration,easing:n.hideEasing,complete:function(){v(e)}}),!0)}function f(e){return h=t("<div/>").attr("id",e.containerId).addClass(e.positionClass),h.appendTo(t(e.target)),h}function d(){return{tapToDismiss:!0,toastClass:"toast",containerId:"toast-container",debug:!1,showMethod:"fadeIn",showDuration:300,showEasing:"swing",onShown:void 0,hideMethod:"fadeOut",hideDuration:1e3,hideEasing:"swing",onHidden:void 0,closeMethod:!1,closeDuration:!1,closeEasing:!1,closeOnHover:!0,extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},iconClass:"toast-info",positionClass:"toast-top-right",timeOut:5e3,titleClass:"toast-title",messageClass:"toast-message",escapeHtml:!1,target:"body",closeHtml:'<button type="button">&times;</button>',closeClass:"toast-close-button",newestOnTop:!0,preventDuplicates:!1,progressBar:!1,progressClass:"toast-progress",rtl:!1}}function p(t){w&&w(t)}function m(e){function o(t){return null==t&&(t=""),t.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function r(){var t="";switch(e.iconClass){case"toast-success":case"toast-info":t="polite";break;default:t="assertive"}C.attr("aria-live",t)}function i(){e.iconClass&&C.addClass(D.toastClass).addClass(T)}function a(){D.newestOnTop?h.prepend(C):h.append(C)}function s(){if(e.title){var t=e.title;D.escapeHtml&&(t=o(e.title)),_.append(t).addClass(D.titleClass),C.append(_)}}function u(){if(e.message){var t=e.message;D.escapeHtml&&(t=o(e.message)),O.append(t).addClass(D.messageClass),C.append(O)}}function l(){D.closeButton&&(S.addClass(D.closeClass).attr("role","button"),C.prepend(S))}function c(){D.progressBar&&(k.addClass(D.progressClass),C.prepend(k))}function f(){D.rtl&&C.addClass("rtl")}function d(e){var n=e&&!1!==D.closeMethod?D.closeMethod:D.hideMethod,o=e&&!1!==D.closeDuration?D.closeDuration:D.hideDuration,r=e&&!1!==D.closeEasing?D.closeEasing:D.hideEasing;if(!t(":focus",C).length||e)return clearTimeout(N.intervalId),C[n]({duration:o,easing:r,complete:function(){v(C),clearTimeout(M),D.onHidden&&"hidden"!==E.state&&D.onHidden(),E.state="hidden",E.endTime=new Date,p(E)}})}function m(){(D.timeOut>0||D.extendedTimeOut>0)&&(M=setTimeout(d,D.extendedTimeOut),N.maxHideTime=parseFloat(D.extendedTimeOut),N.hideEta=(new Date).getTime()+N.maxHideTime)}function w(){clearTimeout(M),N.hideEta=0,C.stop(!0,!0)[D.showMethod]({duration:D.showDuration,easing:D.showEasing})}function b(){var t=(N.hideEta-(new Date).getTime())/N.maxHideTime*100;k.width(t+"%")}var D=g(),T=e.iconClass||D.iconClass;if(void 0!==e.optionsOverride&&(D=t.extend(D,e.optionsOverride),T=e.optionsOverride.iconClass||T),!function(t,e){if(t.preventDuplicates){if(e.message===y)return!0;y=e.message}return!1}(D,e)){x++,h=n(D,!0);var M=null,C=t("<div/>"),_=t("<div/>"),O=t("<div/>"),k=t("<div/>"),S=t(D.closeHtml),N={intervalId:null,hideEta:null,maxHideTime:null},E={toastId:x,state:"visible",startTime:new Date,options:D,map:e};return function(){i(),s(),u(),l(),c(),f(),a(),r()}(),function(){C.hide(),C[D.showMethod]({duration:D.showDuration,easing:D.showEasing,complete:D.onShown}),D.timeOut>0&&(M=setTimeout(d,D.timeOut),N.maxHideTime=parseFloat(D.timeOut),N.hideEta=(new Date).getTime()+N.maxHideTime,D.progressBar&&(N.intervalId=setInterval(b,10)))}(),function(){D.closeOnHover&&C.hover(w,m),!D.onclick&&D.tapToDismiss&&C.click(d),D.closeButton&&S&&S.click(function(t){t.stopPropagation?t.stopPropagation():void 0!==t.cancelBubble&&!0!==t.cancelBubble&&(t.cancelBubble=!0),D.onCloseClick&&D.onCloseClick(t),d(!0)}),D.onclick&&C.click(function(t){D.onclick(t),d()})}(),p(E),D.debug&&console&&console.log(E),C}}function g(){return t.extend({},d(),D.options)}function v(t){h||(h=n()),t.is(":visible")||(t.remove(),t=null,0===h.children().length&&(h.remove(),y=void 0))}var h,w,y,x=0,b={error:"error",info:"info",success:"success",warning:"warning"},D={clear:s,remove:u,error:e,getContainer:n,info:o,options:{},subscribe:r,success:i,version:"2.1.4",warning:a};return D}()}.apply(e,o))&&(t.exports=r)}(n("LGuY"))}},["OhPk"]);