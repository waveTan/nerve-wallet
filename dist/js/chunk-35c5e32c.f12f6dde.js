(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-35c5e32c"],{"0a49":function(e,t,n){var r=n("9b43"),i=n("626a"),o=n("4bf8"),a=n("9def"),s=n("cd1c");e.exports=function(e,t){var n=1==e,c=2==e,l=3==e,d=4==e,u=6==e,v=5==e||u,f=t||s;return function(t,s,m){for(var h,p,S=o(t),g=i(S),b=r(s,m,3),w=a(g.length),y=0,D=n?f(t,w):c?f(t,0):void 0;w>y;y++)if((v||y in g)&&(h=g[y],p=b(h,y,S),e))if(n)D[y]=p;else if(p)switch(e){case 3:return!0;case 5:return h;case 6:return y;case 2:D.push(h)}else if(d)return!1;return u?-1:l||d?d:D}}},"20d6":function(e,t,n){"use strict";var r=n("5ca1"),i=n("0a49")(6),o="findIndex",a=!0;o in[]&&Array(1)[o]((function(){a=!1})),r(r.P+r.F*a,"Array",{findIndex:function(e){return i(this,e,arguments.length>1?arguments[1]:void 0)}}),n("9c6c")(o)},2864:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"node_service bg-gray",attrs:{"element-loading-text":e.$t("nodeService.nodeService0")}},[n("h3",{staticClass:"title"},[e._v(e._s(e.$t("nodeService.nodeService1")))]),n("div",{directives:[{name:"loading",rawName:"v-loading",value:e.nodeServiceLoading,expression:"nodeServiceLoading"}],staticClass:"w1200 mt_20"},[n("div",{staticClass:"top_ico"},[n("i",{staticClass:"el-icon-plus click",on:{click:e.addNodeService}})]),n("el-table",{attrs:{data:e.nodeServiceData,stripe:"",border:""}},[n("el-table-column",{attrs:{prop:"chainName",label:e.$t("nodeService.nodeService23"),align:"center"}}),n("el-table-column",{attrs:{label:e.$t("nodeService.nodeService2"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return["Official"===t.row.name?n("span",[e._v(e._s(e.$t("nodeService.official")))]):n("span",[e._v(e._s(t.row.name))])]}}])}),n("el-table-column",{attrs:{prop:"urls",label:e.$t("nodeService.nodeService3"),align:"center","min-width":"180"}}),n("el-table-column",{attrs:{label:e.$t("nodeService.nodeService4"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[1e5===t.row.delay?n("span",[e._v(e._s(e.$t("nodeService.nodeService17")))]):2e5===t.row.delay?n("span",[e._v(e._s(e.$t("nodeService.nodeService18")))]):3e5===t.row.delay?n("span",[n("i",{staticClass:"el-icon-loading"})]):n("span",[e._v(e._s(t.row.delay)+" ms")])]}}])}),n("el-table-column",{attrs:{prop:"state",label:e.$t("nodeService.nodeService5"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",{on:{click:function(n){return e.editState(t.$index)}}},[n("i",{staticClass:"iconfont clicks",class:t.row.selection?"iconziyuan fCN":"iconduankailianjie flan"})])]}}])}),n("el-table-column",{attrs:{label:e.$t("nodeService.nodeService6"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.isDelete?n("div",[n("label",{staticClass:"click tab_bn",on:{click:function(n){return e.edit(t.$index)}}},[e._v(e._s(e.$t("nodeService.nodeService7")))]),n("span",{staticClass:"tab_line"},[e._v("|")]),n("label",{staticClass:"click tab_bn",on:{click:function(n){return e.removeUrl(t.$index)}}},[e._v(e._s(e.$t("nodeService.nodeService8")))])]):e._e()]}}])})],1)],1),n("el-dialog",{directives:[{name:"loading",rawName:"v-loading",value:e.nodeServiceDialogLoading,expression:"nodeServiceDialogLoading"}],attrs:{title:e.$t("nodeService.nodeService9"),width:"40%",visible:e.nodeServiceDialog,"close-on-click-modal":!1,"close-on-press-escape":!1},on:{"update:visible":function(t){e.nodeServiceDialog=t},close:function(t){return e.resetForm("nodeServiceForm")}}},[n("span",[e._v(e._s(e.$t("nodeService.nodeService10")))]),n("div",{staticClass:"bg-white"},[n("el-form",{ref:"nodeServiceForm",attrs:{model:e.nodeServiceForm,"status-icon":"",rules:e.nodeServiceRules}},[n("el-form-item",{attrs:{label:e.$t("nodeService.nodeService2"),prop:"name"}},[n("el-input",{attrs:{maxlength:"20"},model:{value:e.nodeServiceForm.name,callback:function(t){e.$set(e.nodeServiceForm,"name",e._n(t))},expression:"nodeServiceForm.name"}})],1),n("el-form-item",{attrs:{label:e.$t("nodeService.nodeService3"),prop:"urls"}},[n("el-input",{attrs:{type:"text",autocomplete:"off",maxlength:"50",placeholder:"http://192.168.1.108:18003"},on:{change:e.changeUrls},model:{value:e.nodeServiceForm.urls,callback:function(t){e.$set(e.nodeServiceForm,"urls",t)},expression:"nodeServiceForm.urls"}})],1),n("el-form-item",{staticClass:"btns tl",staticStyle:{"margin-top":"2.5rem"}},[n("el-button",{staticClass:"fl",attrs:{type:"success"},on:{click:function(t){return e.testSubmitForm("nodeServiceForm")}}},[e._v("\n            "+e._s(e.$t("nodeService.nodeService11"))+"\n          ")]),n("div",{directives:[{name:"show",rawName:"v-show",value:0!==e.testInfo.state,expression:"testInfo.state !==0"}],staticClass:"fl ml_50"},[n("i",{class:1===e.testInfo.state?"el-icon-circle-check fCN":"el-icon-circle-close fred"}),e._v(" \n            "),n("span",{directives:[{name:"show",rawName:"v-show",value:2===e.testInfo.state,expression:"testInfo.state ===2"}],staticClass:"fred font12"},[e._v(e._s(e.testInfo.result))])])],1),n("div",{directives:[{name:"show",rawName:"v-show",value:1===e.testInfo.state,expression:"testInfo.state ===1"}]},[n("el-form-item",[n("el-checkbox",{model:{value:e.nodeServiceForm.resource,callback:function(t){e.$set(e.nodeServiceForm,"resource",t)},expression:"nodeServiceForm.resource"}},[e._v(e._s(e.$t("nodeService.nodeService12")))])],1),n("el-form-item",{staticClass:"btns tc"},[n("el-button",{on:{click:function(t){return e.resetForm("nodeServiceForm")}}},[e._v(e._s(e.$t("password.password2")))]),n("el-button",{attrs:{type:"success"},on:{click:function(t){return e.submitForm("nodeServiceForm")}}},[e._v(e._s(e.$t("password.password3")))])],1)],1),n("div",{staticClass:"cb"})],1)],1)])],1)},i=[],o=(n("ac4d"),n("8a81"),n("5df3"),n("1c4c"),n("6b54"),n("7f7f"),n("ac6a"),n("c5f6"),n("96cf"),n("3b8d")),a=(n("20d6"),n("bc3a")),s=n.n(a),c=n("db49");function l(e){if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(e=d(e))){var t=0,n=function(){};return{s:n,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,i,o=!0,a=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return o=e.done,e},e:function(e){a=!0,i=e},f:function(){try{o||null==r.return||r.return()}finally{if(a)throw i}}}}function d(e,t){if(e){if("string"===typeof e)return u(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?u(e,t):void 0}}function u(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var v={data:function(){var e=this,t=function(t,n,r){if(!n)return r(new Error(e.$t("nodeService.nodeService13")));r()},n=function(t,n,r){var i=/(http|https):\/\/([\w.]+\/?)\S*/;""===n?r(new Error(e.$t("nodeService.nodeService14"))):i.exec(n)?r():r(new Error(e.$t("nodeService.nodeService15")))};return{loading:!1,urlName:c["d"]?"mainUrlData":"TestUrlData",nodeServiceData:[],nodeServiceLoading:!1,nodeServiceDialog:!1,nodeServiceDialogLoading:!1,nodeServiceForm:{name:"",urls:"",resource:!1},nodeServiceRules:{name:[{validator:t,trigger:"blur"}],urls:[{validator:n,trigger:"blur"}]},testInfo:{state:0,result:{}},editIndex:1e4}},created:function(){var e=this;this.loading=!0,setTimeout((function(){e.nodeServiceData=e.$store.getters.getUrlData;var t=sessionStorage.hasOwnProperty("info")?JSON.parse(sessionStorage.getItem("info")):"";if(t){var n=["https://wallet.nuls.io/public","https://public1.nuls.io","https://public1.nuls.io","https://beta.wallet.nuls.io/api","http://beta.public1.nuls.io/","http://beta.public2.nuls.io/"],r=e.$store.getters.getUrlData;if("NULS"!==t.defaultAsset.symbol){var i,o=l(n);try{var a=function(){var e=i.value;-1!==r.findIndex((function(t){return t.urls===e}))&&r.splice(r.findIndex((function(t){return t.urls===e})),1)};for(o.s();!(i=o.n()).done;)a()}catch(s){o.e(s)}finally{o.f()}e.nodeServiceData=r}}else e.nodeServiceData=e.$store.getters.getUrlData}),500)},mounted:function(){var e=this;setTimeout((function(){e.getDelay()}),500)},methods:{editState:function(e){var t=this;if(2e5===this.nodeServiceData[e].delay||3e5===this.nodeServiceData[e].delay)this.$message({message:this.$t("nodeService.nodeService16"),type:"error",duration:1e3});else if(!this.nodeServiceData[e].selection){this.loading=!0;var n,r=l(this.nodeServiceData);try{for(r.s();!(n=r.n()).done;){var i=n.value;i.selection=!1}}catch(o){r.e(o)}finally{r.f()}this.nodeServiceData[e].selection=!0,this.$store.commit("setUrlData",this.nodeServiceData),setTimeout((function(){t.loading=!1}),2e3)}},getDelay:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){var t,n,r,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t=[],n=l(this.nodeServiceData);try{for(n.s();!(r=n.n()).done;)i=r.value,i.delay=3e5,t.push(i)}catch(o){n.e(o)}finally{n.f()}this.nodeServiceData=t,this.nodeServiceLoading=!1,this.$store.commit("setUrlData",this.nodeServiceData),this.getDelays();case 7:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),getDelays:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(){var t,n,r,i,o,a,c,d;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t=[],n=l(this.nodeServiceData),e.prev=2,i=regeneratorRuntime.mark((function e(){var n,i,o,a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=r.value,i=(new Date).valueOf(),o=0,a={jsonrpc:"2.0",method:"getChainInfo",params:[],id:Math.floor(1e3*Math.random())},e.next=6,s.a.post(n.urls,a).then((function(e){e.data.hasOwnProperty("result")?(o=(new Date).valueOf(),n.delay=o-i,n.chainId=e.data.result.chainId,n.chainName=e.data.result.chainName):(n.delay=1e5,n.selection=!1,n.state=0)})).catch((function(e){n.delay=2e5,n.selection=!1,n.state=0,console.log(e)}));case 6:t.push(n);case 7:case"end":return e.stop()}}),e)})),n.s();case 5:if((r=n.n()).done){e.next=9;break}return e.delegateYield(i(),"t0",7);case 7:e.next=5;break;case 9:e.next=14;break;case 11:e.prev=11,e.t1=e["catch"](2),n.e(e.t1);case 14:return e.prev=14,n.f(),e.finish(14);case 17:if(this.nodeServiceData=t,this.nodeServiceLoading=!1,this.loading=!1,o=t.filter((function(e){return e.selection})),0===o.length)if(a=Math.min.apply(Math,t.map((function(e){return e.delay}))),2e5!==a)for(d in c=t.map((function(e){return e.delay})).findIndex((function(e){return e===a})),t)Number(d)===c&&(t[c].selection=!0);else this.$message({message:this.$t("public.checkNetwork"),type:"error",duration:3e3});this.$store.commit("setUrlData",this.nodeServiceData);case 23:case"end":return e.stop()}}),e,this,[[2,11,14,17]])})));function t(){return e.apply(this,arguments)}return t}(),getChainInfo:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t){var n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n={jsonrpc:"2.0",method:"getChainInfo",params:[],id:Math.floor(1e3*Math.random())},e.next=3,s.a.post(t,n).then((function(e){return e})).catch((function(e){console.log("getChainInfo:"+e)}));case 3:case"end":return e.stop()}}),e)})));function t(t){return e.apply(this,arguments)}return t}(),testSubmitForm:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t){var n,r=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:n=this,this.$refs[t].validate((function(e){if(!e)return!1;n.nodeServiceDialogLoading=!0;var t={jsonrpc:"2.0",method:"getChainInfo",params:[],id:Math.floor(1e3*Math.random())};s.a.post(r.nodeServiceForm.urls,t).then((function(e){e.data.hasOwnProperty("result")?(n.testInfo.state=1,n.testInfo.result=e.data.result,n.nodeServiceDialogLoading=!1):(n.testInfo.state=2e5,n.testInfo.result=e.data,n.nodeServiceDialogLoading=!1)})).catch((function(e){console.log(n.testInfo.success),n.testInfo.state=3e5,n.testInfo.result=e,console.log("getBestBlockHeader:"+e),n.nodeServiceDialogLoading=!1}))}));case 2:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),addNodeService:function(){this.nodeServiceDialog=!0,this.nodeServiceForm.name="",this.nodeServiceForm.urls=""},submitForm:function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t){var n=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:this.$refs[t].validate((function(e){if(!e)return!1;var r={name:n.nodeServiceForm.name,urls:n.nodeServiceForm.urls,delay:"",selection:!1,isDelete:!0,chainId:n.testInfo.result.chainId,assetId:n.testInfo.result.assetId,chainName:n.testInfo.result.chainName,decimals:n.testInfo.result.defaultAsset.decimals};if(n.nodeServiceForm.resource){for(var i in n.nodeServiceData)n.nodeServiceData[i].selection&&(n.nodeServiceData[i].selection=!1);r.selection=!0}1e4!==n.editIndex?(n.nodeServiceData[n.editIndex]=r,n.$store.commit("setUrlData",n.nodeServiceData)):(n.nodeServiceData.push(r),n.$store.commit("setUrlData",n.nodeServiceData)),n.getDelay(),n.nodeServiceDialog=!1,n.$refs[t].resetFields()}));case 1:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),changeUrls:function(e){console.log(e),this.testInfo.state=0,this.testInfo.result={}},resetForm:function(e){this.nodeServiceDialog=!1,this.testInfo.state=0,this.testInfo.result={},this.$refs[e].resetFields()},edit:function(e){this.editIndex=e,this.nodeServiceForm=this.nodeServiceData[e],this.nodeServiceDialog=!0},removeUrl:function(e){var t=this;this.$confirm(this.$t("nodeService.nodeService19")+this.nodeServiceData[e].urls+this.$t("nodeService.nodeService20"),this.$t("nodeService.nodeService21"),{confirmButtonText:this.$t("password.password3"),cancelButtonText:this.$t("password.password2"),type:"warning"}).then((function(){t.$message({type:"success",message:t.$t("nodeService.nodeService22")}),t.nodeServiceData.splice(e,1),t.getDelays(),t.$store.commit("setUrlData",t.nodeServiceData)})).catch((function(){}))},toUrl:function(e){this.$router.push({name:e})}}},f=v,m=(n("2fed"),n("2877")),h=Object(m["a"])(f,r,i,!1,null,null,null);t["default"]=h.exports},"2fed":function(e,t,n){"use strict";var r=n("d2ac"),i=n.n(r);i.a},cd1c:function(e,t,n){var r=n("e853");e.exports=function(e,t){return new(r(e))(t)}},d2ac:function(e,t,n){},e853:function(e,t,n){var r=n("d3f4"),i=n("1169"),o=n("2b4c")("species");e.exports=function(e){var t;return i(e)&&(t=e.constructor,"function"!=typeof t||t!==Array&&!i(t.prototype)||(t=void 0),r(t)&&(t=t[o],null===t&&(t=void 0))),void 0===t?Array:t}}}]);
//# sourceMappingURL=chunk-35c5e32c.f12f6dde.js.map