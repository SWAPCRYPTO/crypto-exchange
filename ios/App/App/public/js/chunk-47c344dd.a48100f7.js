(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-47c344dd"],{"0ec4":function(e,t,r){"use strict";r("b0c0"),r("99af");var n=r("7a23"),c={key:0,class:"assetsList__items"},a={class:"currency__title"},i={class:"currency__icon"},o={class:"currency__name"},s={class:"symbol"},u=Object(n["h"])("div",{class:"sparkline"},null,-1),l={class:"currency__details"},b={key:0,class:"currency__value"},f={key:1,class:"currency__value"},d={key:2,class:"uppercase text-sm"},O={key:1,class:"assetsList__items"};function h(e,t,r,h,j,p){var v=Object(n["E"])("ion-skeleton-text");return Object(n["x"])(),Object(n["e"])("div",{class:["assetsList",{round:e.walletMode}]},[e.isLoading?(Object(n["x"])(),Object(n["e"])("ul",O,[(Object(n["x"])(!0),Object(n["e"])(n["a"],null,Object(n["D"])(e.SKELETON_ITEMS,(function(e){return Object(n["x"])(),Object(n["e"])("li",{class:"assetsList__item",key:e},[Object(n["h"])(v,{animated:"",style:{height:"100%",width:"100%","line-height":"2.5rem","min-height":"2.5rem"}})])})),128))])):(Object(n["x"])(),Object(n["e"])("ul",c,[(Object(n["x"])(!0),Object(n["e"])(n["a"],null,Object(n["D"])(e.filteredAssets,(function(t){return Object(n["x"])(),Object(n["e"])("li",{class:["assetsList__item",{selected:e.selectedAsset===t.symbol}],key:t.id,onClick:function(r){return e.selectAsset(t.symbol)}},[Object(n["h"])("div",a,[Object(n["h"])("div",i,[Object(n["h"])("img",{src:t.image,class:"currency__icon",alt:"currency icon"},null,8,["src"])]),Object(n["h"])("div",o,[Object(n["h"])("p",null,Object(n["H"])(t.name),1),Object(n["h"])("span",s,Object(n["H"])(t.symbol),1)])]),u,Object(n["h"])("div",l,[e.walletMode&&+e.ownedVolume(t.symbol,e.portfolio)>0?(Object(n["x"])(),Object(n["e"])("p",b,Object(n["H"])(e.isPrivacyModeActive?e.PRIVACY_MASK:"".concat(e.preferredCurrency," ").concat(e.currentAssetPrice(t))),1)):(Object(n["x"])(),Object(n["e"])("p",f,Object(n["H"])(e.preferredCurrency)+" "+Object(n["H"])(e.formatValue(e.convertCurrency(t.current_price,e.baseCurrencyRate,e.currencyRate),6)),1)),e.walletMode?(Object(n["x"])(),Object(n["e"])("p",d,Object(n["H"])(e.ownedVolume(t.symbol,e.portfolio)?e.isPrivacyModeActive?e.PRIVACY_MASK:e.formatValue(e.ownedVolume(t.symbol,e.portfolio),6):"")+" "+Object(n["H"])(e.isPrivacyModeActive?"":t.symbol),1)):(Object(n["x"])(),Object(n["e"])("p",{key:3,class:["currency__gain",t.price_change_percentage_24h_in_currency>0?"text-success":"text-error"]},Object(n["H"])(e.formatChange(t.price_change_percentage_24h_in_currency))+"%",3))])],10,["onClick"])})),128))]))],2)}r("b680"),r("7db0"),r("4de4");var j=r("5502"),p=r("6c02"),v=r("360b"),y=r("6a09"),g=r("bee9"),m=r("ed57"),_=r("d867"),x=Object(n["i"])({name:"AssetsList",components:{IonSkeletonText:_["r"]},props:{assets:{type:Array,required:!0},walletMode:{type:Boolean,required:!0},routableAssets:{type:Boolean,required:!0},searchQuery:{type:String,required:!1},allowHistory:{type:Boolean,required:!1},selectedAssetSymbol:{type:String,required:!1}},emits:["selectedAsset"],setup:function(e,t){var r=t.emit,c=Object(j["b"])(),a=Object(p["i"])(),i=Object(n["c"])((function(){return c.getters.isLoading})),o=Object(v["a"])(),s=o.preferredCurrency,u=o.currencyRate,l=o.baseCurrencyRate,b=Object(n["c"])((function(){return c.getters.user.account.portfolio})),f=function(e){return(e>0?"+":"")+e.toFixed(2)},d=function(e,t){var r;return null===(r=t.find((function(t){return t.symbol===e})))||void 0===r?void 0:r.quantity},O=Object(n["c"])((function(){return e.searchQuery?e.searchQuery.toLowerCase():""})),h=Object(n["c"])((function(){return e.assets.filter((function(e){return e.symbol.toLowerCase().indexOf(O.value)>-1||e.name.toLowerCase().indexOf(O.value)>-1}))})),_=h.value.length>1?5:1,x=function(e){return Object(m["b"])(Object(g["a"])(e.current_price*d(e.symbol,b.value),l.value,u.value),6)},C=Object(y["a"])(),k=C.PRIVACY_MASK,A=C.isPrivacyModeActive,S=Object(n["C"])(e.selectedAssetSymbol),w=function(t){e.routableAssets?a.push("/tabs/asset/".concat(t).concat(e.allowHistory?"/history":"")):(S.value=t,r("selectedAsset",S.value))};return{isLoading:i,SKELETON_ITEMS:_,preferredCurrency:s,formatChange:f,portfolio:b,ownedVolume:d,filteredAssets:h,currencyRate:u,convertCurrency:g["a"],displayOnlySignificatDigits:m["a"],baseCurrencyRate:l,currentAssetPrice:x,formatValue:m["b"],PRIVACY_MASK:k,isPrivacyModeActive:A,selectAsset:w,selectedAsset:S}}});r("ac84");x.render=h;t["a"]=x},"25f0":function(e,t,r){"use strict";var n=r("6eeb"),c=r("825a"),a=r("d039"),i=r("ad6d"),o="toString",s=RegExp.prototype,u=s[o],l=a((function(){return"/a/b"!=u.call({source:"a",flags:"b"})})),b=u.name!=o;(l||b)&&n(RegExp.prototype,o,(function(){var e=c(this),t=String(e.source),r=e.flags,n=String(void 0===r&&e instanceof RegExp&&!("flags"in s)?i.call(e):r);return"/"+t+"/"+n}),{unsafe:!0})},"360b":function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));var n=r("7a23"),c=r("5502");function a(){var e=Object(c["b"])(),t=Object(n["c"])((function(){return e.getters.preferredCurrency})),r=Object(n["c"])((function(){return e.getters.currencies})),a=Object(n["c"])((function(){return t.value in r.value?r.value[t.value]:1})),i=Object(n["c"])((function(){return e.getters.baseCurrencyRate}));return{preferredCurrency:t,currencies:r,currencyRate:a,baseCurrencyRate:i}}},5899:function(e,t){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(e,t,r){var n=r("1d80"),c=r("5899"),a="["+c+"]",i=RegExp("^"+a+a+"*"),o=RegExp(a+a+"*$"),s=function(e){return function(t){var r=String(n(t));return 1&e&&(r=r.replace(i,"")),2&e&&(r=r.replace(o,"")),r}};e.exports={start:s(1),end:s(2),trim:s(3)}},"5e89":function(e,t,r){var n=r("861d"),c=Math.floor;e.exports=function(e){return!n(e)&&isFinite(e)&&c(e)===e}},"6a09":function(e,t,r){"use strict";r.d(t,"a",(function(){return a}));var n=r("7a23"),c=r("5502");function a(){var e=Object(c["b"])(),t="••••••••",r=Object(n["c"])((function(){return e.getters.isPrivacyModeActive})),a=function(t){return e.commit("setPrivacyModeStatus",t)},i=function(){a(!r.value)};return{PRIVACY_MASK:t,isPrivacyModeActive:r,handlePrivacyMode:i}}},"6b93":function(e,t,r){var n=r("23e7"),c=Math.log,a=Math.LOG10E;n({target:"Math",stat:!0},{log10:function(e){return c(e)*a}})},7156:function(e,t,r){var n=r("861d"),c=r("d2bb");e.exports=function(e,t,r){var a,i;return c&&"function"==typeof(a=t.constructor)&&a!==r&&n(i=a.prototype)&&i!==r.prototype&&c(e,i),e}},"8ba4":function(e,t,r){var n=r("23e7"),c=r("5e89");n({target:"Number",stat:!0},{isInteger:c})},a9e3:function(e,t,r){"use strict";var n=r("83ab"),c=r("da84"),a=r("94ca"),i=r("6eeb"),o=r("5135"),s=r("c6b6"),u=r("7156"),l=r("c04e"),b=r("d039"),f=r("7c73"),d=r("241c").f,O=r("06cf").f,h=r("9bf2").f,j=r("58a8").trim,p="Number",v=c[p],y=v.prototype,g=s(f(y))==p,m=function(e){var t,r,n,c,a,i,o,s,u=l(e,!1);if("string"==typeof u&&u.length>2)if(u=j(u),t=u.charCodeAt(0),43===t||45===t){if(r=u.charCodeAt(2),88===r||120===r)return NaN}else if(48===t){switch(u.charCodeAt(1)){case 66:case 98:n=2,c=49;break;case 79:case 111:n=8,c=55;break;default:return+u}for(a=u.slice(2),i=a.length,o=0;o<i;o++)if(s=a.charCodeAt(o),s<48||s>c)return NaN;return parseInt(a,n)}return+u};if(a(p,!v(" 0o1")||!v("0b1")||v("+0x1"))){for(var _,x=function(e){var t=arguments.length<1?0:e,r=this;return r instanceof x&&(g?b((function(){y.valueOf.call(r)})):s(r)!=p)?u(new v(m(t)),r,x):m(t)},C=n?d(v):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,fromString,range".split(","),k=0;C.length>k;k++)o(v,_=C[k])&&!o(x,_)&&h(x,_,O(v,_));x.prototype=y,y.constructor=x,i(c,p,x)}},ac84:function(e,t,r){"use strict";r("bf06")},bf06:function(e,t,r){},e276:function(e,t,r){"use strict";r("e79c")},e79c:function(e,t,r){},ed57:function(e,t,r){"use strict";r.d(t,"b",(function(){return i})),r.d(t,"a",(function(){return o}));r("6b93"),r("8ba4"),r("a9e3"),r("b680"),r("d3b7"),r("25f0");var n=2,c=6,a=function(e){return Math.floor(Math.log10(e)+1)},i=function(e){var t=a(e);return e>-1&&0!=e&&e<1?e.toLocaleString(void 0,{minimumFractionDigits:c,maximumFractionDigits:t<c&&t>0?t:c+2}):e.toLocaleString(void 0,{minimumFractionDigits:n,maximumFractionDigits:n})},o=function(e,t){return Number.isInteger(e)?e.toFixed(2):(1*parseFloat(e.toPrecision(t))).toString()}},ee28:function(e,t,r){"use strict";r.r(t);var n=r("7a23"),c={class:"prices container md:max-w-screen-md"},a={class:"header__container flex flex-col lg:flex-row items-start justify-between"},i={key:0,class:"header__details flex flex-col"},o=Object(n["h"])("p",{class:"font-medium mb-2"},"In the past 24 hours",-1),s={class:"h1 balance"},u={key:1,class:"header__details flex flex-col w-full"},l=Object(n["h"])("p",{class:"font-medium mb-2"},"In the past 24 hours",-1),b={class:"search__wrapper mt-8 lg:mt-0 w-full md:max-w-xs"},f={class:"chips__container"},d=Object(n["g"])("Sort");function O(e,t,r,O,h,j){var p=Object(n["E"])("ion-title"),v=Object(n["E"])("ion-toolbar"),y=Object(n["E"])("ion-header"),g=Object(n["E"])("ion-skeleton-text"),m=Object(n["E"])("ion-searchbar"),_=Object(n["E"])("ion-label"),x=Object(n["E"])("ion-chip"),C=Object(n["E"])("ion-icon"),k=Object(n["E"])("AssetsList"),A=Object(n["E"])("ion-content"),S=Object(n["E"])("ion-page");return Object(n["x"])(),Object(n["e"])(S,null,{default:Object(n["K"])((function(){return[Object(n["h"])(y,{translucent:""},{default:Object(n["K"])((function(){return[Object(n["h"])(v,{mode:"ios"},{default:Object(n["K"])((function(){return[e.isLoading?Object(n["f"])("",!0):(Object(n["x"])(),Object(n["e"])(p,{key:0},{default:Object(n["K"])((function(){return[Object(n["g"])("Market is "+Object(n["H"])(e.marketChangeStatus)+" ",1),Object(n["h"])("span",{class:e.isMarketUp?"text-success":"text-error"},Object(n["H"])(e.marketChangePercentageText),3)]})),_:1}))]})),_:1})]})),_:1}),Object(n["h"])(A,{fullscreen:""},{default:Object(n["K"])((function(){return[Object(n["h"])("section",c,[Object(n["h"])(y,{class:"bg-transparent",collapse:"condense"},{default:Object(n["K"])((function(){return[Object(n["h"])(v,null,{default:Object(n["K"])((function(){return[Object(n["h"])("div",a,[e.isLoading?(Object(n["x"])(),Object(n["e"])("div",u,[l,Object(n["h"])(g,{style:{height:"100%",width:"100%","line-height":"2.5rem","min-height":"2.5rem"},animated:""})])):(Object(n["x"])(),Object(n["e"])("div",i,[o,Object(n["h"])("h1",s,[Object(n["g"])("Market is "+Object(n["H"])(e.marketChangeStatus)+" ",1),Object(n["h"])("span",{class:["text-2xl md:text-3xl",e.isMarketUp?"text-success":"text-error"]},Object(n["H"])(e.marketChangePercentageText),3)])])),Object(n["h"])("div",b,[e.isLoading?(Object(n["x"])(),Object(n["e"])(g,{key:1,style:{height:"100%",width:"100%","line-height":"2.5rem","min-height":"2.5rem"},animated:""})):(Object(n["x"])(),Object(n["e"])(m,{key:0,modelValue:e.searchQuery,"onUpdate:modelValue":t[1]||(t[1]=function(t){return e.searchQuery=t}),"show-cancel-button":"never",debounce:"500",placeholder:"Find your asset",animated:""},null,8,["modelValue"]))]),Object(n["h"])("div",f,[Object(n["h"])(x,{onClick:e.presentCurrencyActionSheet},{default:Object(n["K"])((function(){return[Object(n["h"])(_,null,{default:Object(n["K"])((function(){return[Object(n["g"])(Object(n["H"])(e.preferredCurrency),1)]})),_:1})]})),_:1},8,["onClick"]),Object(n["h"])(x,{onClick:e.presentSortActionSheet},{default:Object(n["K"])((function(){return[Object(n["h"])(_,null,{default:Object(n["K"])((function(){return[d]})),_:1})]})),_:1},8,["onClick"]),e.activeSorting?(Object(n["x"])(),Object(n["e"])(x,{key:0,color:"primary",onClick:t[2]||(t[2]=function(t){return e.sortAscending=!e.sortAscending})},{default:Object(n["K"])((function(){return[Object(n["h"])(_,null,{default:Object(n["K"])((function(){return[Object(n["g"])(Object(n["H"])(e.activeSorting),1)]})),_:1}),Object(n["h"])(C,{icon:e.sortAscending?e.arrowUpOutline:e.arrowDownOutline,color:"primary"},null,8,["icon"]),Object(n["h"])(C,{icon:e.close,onClick:e.removeSorting,color:"primary"},null,8,["icon","onClick"])]})),_:1})):Object(n["f"])("",!0)])])]})),_:1})]})),_:1}),Object(n["h"])(k,{assets:e.sortedAssets,searchQuery:e.searchQuery,walletMode:!1,allowHistory:!1,routableAssets:""},null,8,["assets","searchQuery"])])]})),_:1})]})),_:1})}var h=r("1da1"),j=r("5530"),p=(r("96cf"),r("99af"),r("b680"),r("fb6a"),r("7db0"),r("d867")),v=r("5502"),y=r("0ec4"),g=r("ff79"),m=r("360b"),_=function(e,t,r){return e.sort((function(e,n){return r?Math.abs(e[t])-Math.abs(n[t]):e[t]-n[t]}))},x=Object(n["i"])({name:"Prices",components:{AssetsList:y["a"],IonHeader:p["h"],IonToolbar:p["B"],IonTitle:p["z"],IonContent:p["g"],IonPage:p["o"],IonSearchbar:p["q"],IonSkeletonText:p["r"],IonChip:p["f"],IonLabel:p["l"],IonIcon:p["i"]},setup:function(){var e=Object(v["b"])(),t=Object(n["c"])((function(){return e.getters.isLoading})),r=Object(n["c"])((function(){return e.getters.assets})),c=Object(n["C"])(r.value),a=Object(n["c"])((function(){return e.getters.user})),i=Object(m["a"])(),o=i.preferredCurrency,s=i.currencies,u=i.baseCurrencyRate,l=function(t){return e.dispatch("updateUserAccount",Object(j["a"])(Object(j["a"])({},a.value.account),{},{preferredCurrency:t}))},b=Object(n["C"])(r.value.reduce((function(e,t){return e+t.market_cap_change_percentage_24h}),0)/r.value.length),f=Object(n["C"])(b.value>0),d=Object(n["C"])(f.value?"up":"down"),O=Object(n["C"])("".concat(f.value?"+":"").concat(b.value.toFixed(2),"%")),y=Object(n["C"])(""),x=Object(n["C"])(""),C=Object(n["C"])(!0),k=function(){c.value=r.value,x.value=""};Object(n["J"])(C,(function(e,t){e!=t&&x.value&&(c.value=c.value.reverse())}));var A=function(e,t,n,a){x.value=e,c.value=C.value&&!n?_(r.value.slice(),t,a):_(r.value.slice(),t,a).reverse(),C.value=!C.value},S=function(){var e=Object(h["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,p["D"].create({header:"Sort by",cssClass:"sort",buttons:[{text:"Rank",icon:g["v"],handler:function(){A("Rank","market_cap_rank",!1,!0)}},{text:"Change (24h) %",icon:C.value?g["e"]:g["c"],handler:function(){A("Change (24h) %","price_change_percentage_24h_in_currency",!1,!0)}},{text:"Market Cap Change (24h)",icon:g["D"],handler:function(){A("Market Cap (24h)","market_cap_change_24h",!1,!0)}},{text:"Total Volume",icon:g["w"],handler:function(){A("Total Volume","total_volume",!1,!1)}},{text:"Circulating Supply",icon:g["u"],handler:function(){A("Circulating Supply","circulating_supply",!1,!1)}},{text:"Price",icon:g["h"],handler:function(){A("Price","current_price",!1,!1)}},{text:"Cancel",icon:g["k"],role:"cancel",handler:function(){console.log("Cancel clicked")}}]});case 2:return t=e.sent,e.next=5,t.present();case 5:return e.next=7,t.onDidDismiss();case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),w=function(){var t=Object(h["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,p["D"].create({header:"Pick preferred currency",cssClass:"currenct",buttons:[{text:"USD",handler:function(){"USD"!==o.value&&l("USD")}},{text:"PLN",handler:function(){"PLN"!==o.value&&l("PLN")}},{text:"EUR",handler:function(){"EUR"!==o.value&&l("EUR")}},{text:"BTC",handler:function(){if("BTC"!==o.value){if(!s.value["BTC"]){var t="BTC",n=r.value.find((function(e){return e.symbol===t.toLowerCase()}));n&&e.commit("addNewCurrency",{currencyName:n.symbol.toUpperCase(),currencyRate:n.current_price*u.value})}l("BTC")}}},{text:"Cancel",icon:g["k"],role:"cancel"}]});case 2:return n=t.sent,t.next=5,n.present();case 5:return t.next=7,n.onDidDismiss();case 7:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return{isLoading:t,assets:r,sortedAssets:c,preferredCurrency:o,marketChangePercentageText:O,marketChangeStatus:d,isMarketUp:f,searchQuery:y,presentSortActionSheet:S,close:g["k"],activeSorting:x,removeSorting:k,arrowDownOutline:g["c"],arrowUpOutline:g["e"],sortAscending:C,presentCurrencyActionSheet:w}}});r("e276");x.render=O;t["default"]=x}}]);
//# sourceMappingURL=chunk-47c344dd.a48100f7.js.map