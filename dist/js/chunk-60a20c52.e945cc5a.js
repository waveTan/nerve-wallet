(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-60a20c52"],{"033b":function(e,t,s){"use strict";var a=s("e0a2"),r=s.n(a);r.a},"2e64":function(e,t,s){"use strict";var a=s("ff03"),r=s.n(a);r.a},b301:function(e,t,s){"use strict";var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"back",attrs:{backUrl:e.backUrl}},[s("span",{staticClass:"back-box",on:{click:e.back}},[s("i",{staticClass:"el-icon-arrow-left"}),s("span",[e._v(e._s(e.backTitle))])])])},r=[],n={props:{backTitle:{type:String,default:""},backUrl:{type:String,default:"1"},backParams:{type:String,default:""}},methods:{back:function(){"1"===this.backUrl?this.$router.go(-1):this.$router.push({name:this.backUrl})}}},i=n,o=(s("2e64"),s("2877")),c=Object(o["a"])(i,a,r,!1,null,null,null);t["a"]=c.exports},e0a2:function(e,t,s){},eb26:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"new_address bg-gray"},[s("div",{staticClass:"bg-white"},[s("div",{staticClass:"w1200"},[s("BackBar",{attrs:{backTitle:e.$t("address.address0")}}),s("h3",{staticClass:"title"},[e._v(e._s(e.$t("setAlias.setAlias0")))])],1)]),s("div",{staticClass:"new w1200 mt_20 bg-white"},[s("div",{staticClass:"w630"},[s("h3",{staticClass:"tc mzt_20"},[e._v(e._s(this.$route.query.address))]),s("div",{staticClass:"tip bg-gray"},[s("p",[e._v("• "+e._s(e.$t("setAlias.setAlias1"))+e._s(e.symbol)+e._s(e.$t("setAlias.setAlias11")))]),s("p",[e._v("• "+e._s(e.$t("setAlias.setAlias2"))+e._s(e.symbol))])]),s("el-form",{ref:"aliasForm",staticClass:"mb_20",attrs:{model:e.aliasForm,"status-icon":"",rules:e.aliasRules}},[s("el-form-item",{attrs:{label:e.$t("public.alias"),prop:"alias"}},[s("span",{staticClass:"balance font12 fr"},[e._v(e._s(e.$t("public.usableBalance"))+"："+e._s(e.addressInfo.balance)+" "),s("font",{staticClass:"fCN"},[e._v(e._s(e.symbol))])],1),s("el-input",{attrs:{type:"text",maxlength:"20",autocomplete:"off"},model:{value:e.aliasForm.alias,callback:function(t){e.$set(e.aliasForm,"alias",t)},expression:"aliasForm.alias"}})],1),s("div",{staticClass:"div-data font14"},[e._v("\n          "+e._s(e.$t("public.fee"))+": "),s("label",[e._v("0.001 "),s("span",{staticClass:"fCN"},[e._v(e._s(e.symbol))])])]),s("el-form-item",{staticClass:"form-next"},[s("el-button",{attrs:{type:"success"},on:{click:function(t){return e.submitAliasForm("aliasForm")}}},[e._v(" "+e._s(e.$t("public.next")))])],1),s("div",{staticClass:"tc font18 mzt_20"},[e._v("\n          "+e._s(e.$t("setAlias.setAlias3"))+": 1.001 "),s("span",{staticClass:"fCN"},[e._v(e._s(e.symbol))])])],1)],1)]),s("Password",{ref:"password",on:{passwordSubmit:e.passSubmit}})],1)},r=[],n=(s("ac6a"),s("ac4d"),s("8a81"),s("5df3"),s("1c4c"),s("7f7f"),s("6b54"),s("96cf"),s("3b8d")),i=s("0ad0"),o=s.n(i),c=s("1959"),u=s("d1f0"),l=s("b301"),d=s("db49"),f=s("6ace");function b(e){if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(e=m(e))){var t=0,s=function(){};return{s:s,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){throw e},f:s}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var a,r,n=!0,i=!1;return{s:function(){a=e[Symbol.iterator]()},n:function(){var e=a.next();return n=e.done,e},e:function(e){i=!0,r=e},f:function(){try{n||null==a.return||a.return()}finally{if(i)throw r}}}}function m(e,t){if(e){if("string"===typeof e)return p(e,t);var s=Object.prototype.toString.call(e).slice(8,-1);return"Object"===s&&e.constructor&&(s=e.constructor.name),"Map"===s||"Set"===s?Array.from(s):"Arguments"===s||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?p(e,t):void 0}}function p(e,t){(null==t||t>e.length)&&(t=e.length);for(var s=0,a=new Array(t);s<t;s++)a[s]=e[s];return a}var h={data:function(){var e=this,t=function(t,s,a){var r=/^(?!_)(?!.*?_$)[a-z0-9_]+$/;""===s?a(new Error(e.$t("setAlias.setAlias4"))):r.exec(s)?a():a(new Error(e.$t("setAlias.setAlias5")))};return{aliasForm:{alias:""},aliasRules:{alias:[{validator:t,trigger:"blur"}]},addressInfo:"",balanceInfo:"",prefix:"",symbol:sessionStorage.hasOwnProperty("info")?JSON.parse(sessionStorage.getItem("info")).defaultAsset.symbol:"NULS",getSetAliasRandomString:"",sendSetAliasRandomString:""}},created:function(){var e=this;Object(c["f"])(Object(f["f"])()).then((function(t){e.prefix=t})).catch((function(t){console.log(t),e.prefix=""}));var t,s=b(Object(f["e"])(0));try{for(s.s();!(t=s.n()).done;){var a=t.value;a.address===this.$route.query.address&&(this.addressInfo=a)}}catch(r){s.e(r)}finally{s.f()}},mounted:function(){var e=this;setTimeout((function(){e.getNulsBalance(Object(f["f"])(),1,e.$route.query.address)}),600)},watch:{addressInfo:function(e,t){e.address!==t.address&&t.address&&(this.transferForm.fromAddress=this.addressInfo.address)}},components:{Password:u["a"],BackBar:l["a"]},methods:{submitAliasForm:function(e){var t=this;this.$refs[e].validate(function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(s){var a,r,n,i,o,u,l;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!s){e.next=48;break}if(!(t.balanceInfo.balance>1001e5)){e.next=45;break}a=t.$route.query.address,r=Object(f["e"])(0),n=b(r),e.prev=5,n.s();case 7:if((i=n.n()).done){e.next=35;break}if(o=i.value,o.address!==a){e.next=33;break}if(""!==o.aesPri){e.next=32;break}return e.next=13,Object(f["m"])(16);case 13:return t.getSetAliasRandomString=e.sent,e.next=16,Object(f["m"])(16);case 16:return t.sendSetAliasRandomString=e.sent,e.next=19,t.setAliasAssemble();case 19:if(u=e.sent,u.success){e.next=23;break}return t.$message({message:t.$t("tips.tips3"),type:"error",duration:3e3}),e.abrupt("return");case 23:return e.next=25,Object(c["b"])(t.getSetAliasRandomString,t.sendSetAliasRandomString,o.address,u.data);case 25:if(l=e.sent,l.success){e.next=29;break}return t.$message({message:t.$t("tips.tips4")+JSON.stringify(l.data),type:"error",duration:3e3}),e.abrupt("return");case 29:t.$refs.password.showScan(l.data.txInfo,l.data.assembleHex),e.next=33;break;case 32:t.$refs.password.showPassword(!0);case 33:e.next=7;break;case 35:e.next=40;break;case 37:e.prev=37,e.t0=e["catch"](5),n.e(e.t0);case 40:return e.prev=40,n.f(),e.finish(40);case 43:e.next=46;break;case 45:t.$message({message:t.$t("newConsensus.newConsensus7"),type:"error",duration:1e3});case 46:e.next=49;break;case 48:return e.abrupt("return",!1);case 49:case"end":return e.stop()}}),e,null,[[5,37,40,43]])})));return function(t){return e.apply(this,arguments)}}())},getNulsBalance:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t,s,a){var r=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$post("/","getAccountBalance",[t,s,a]).then((function(e){e.hasOwnProperty("result")?r.balanceInfo={balance:e.result.balance,nonce:e.result.nonce}:r.$message({message:r.$t("public.err2")+e,type:"error",duration:1e3})})).catch((function(e){r.$message({message:r.$t("public.err3")+e,type:"error",duration:1e3})}));case 2:case"end":return e.stop()}}),e,this)})));function t(t,s,a){return e.apply(this,arguments)}return t}(),passSubmit:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(t){var s,a,r,n,i,u,l,b,m=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(s=o.a.decrypteOfAES(this.addressInfo.aesPri,t),a=o.a.importByKey(Object(f["f"])(),s,t,this.prefix),a.address!==this.addressInfo.address){e.next=19;break}return r=o.a.getAddressByPub(Object(f["f"])(),1,d["a"],this.prefix),n={fromAddress:this.addressInfo.address,toAddress:r,assetsChainId:Object(f["f"])(),assetsId:1,amount:1e8,fee:1e5},e.next=7,Object(c["h"])(n,this.balanceInfo,3);case 7:return i=e.sent,u={fromAddress:this.addressInfo.address,alias:this.aliasForm.alias},e.next=11,o.a.transactionAssemble(i.data.inputs,i.data.outputs,"",3,u);case 11:return l=e.sent,e.next=14,o.a.transactionSerialize(o.a.decrypteOfAES(this.addressInfo.aesPri,t),this.addressInfo.pub,l);case 14:return b=e.sent,e.next=17,Object(c["i"])(b).then((function(e){e.success?m.toUrl("txList"):m.$message({message:m.$t("error."+e.data.code),type:"error",duration:3e3})})).catch((function(e){m.$message({message:m.$t("public.err0")+e,type:"error",duration:1e3})}));case 17:e.next=20;break;case 19:this.$message({message:this.$t("address.address13"),type:"error",duration:1e3});case 20:case"end":return e.stop()}}),e,this)})));function t(t){return e.apply(this,arguments)}return t}(),setAliasAssemble:function(){var e=Object(n["a"])(regeneratorRuntime.mark((function e(){var t,s,a,r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=o.a.getAddressByPub(Object(f["f"])(),1,d["a"],this.prefix),s={fromAddress:this.addressInfo.address,toAddress:t,assetsChainId:Object(f["f"])(),assetsId:1,amount:1e8,fee:1e5},e.next=4,Object(c["h"])(s,this.balanceInfo,3);case 4:return a=e.sent,r={fromAddress:this.addressInfo.address,alias:this.aliasForm.alias},e.next=8,o.a.transactionAssemble(a.data.inputs,a.data.outputs,"",3,r);case 8:return e.abrupt("return",e.sent);case 9:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}(),toUrl:function(e){this.$router.push({name:e})}}},v=h,g=(s("033b"),s("2877")),y=Object(g["a"])(v,a,r,!1,null,null,null);t["default"]=y.exports},ff03:function(e,t,s){}}]);
//# sourceMappingURL=chunk-60a20c52.e945cc5a.js.map