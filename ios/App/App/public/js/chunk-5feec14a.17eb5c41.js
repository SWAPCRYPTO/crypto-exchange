(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5feec14a"],{bf34:function(e,t,a){},dd99:function(e,t,a){"use strict";a.r(t);a("b0c0");var n=a("7a23"),o={class:"authentication max-w-md md:max-w-xl mx-auto flex flex-col justify-between w-full h-full p-8"},c={key:0,class:"signUp"},r={class:"signUp__container flex flex-col w-full"},i=Object(n["h"])("header",{class:"flex flex-col items-center justify-start mb-4"},[Object(n["h"])("h1",{class:"h1 text-center"},"Create your account"),Object(n["h"])("p",{class:"mt-2 text-center"},"Join the platform and start managing your assets in the most comfortable way.")],-1),l=Object(n["g"])("Email"),s=Object(n["g"])("Provide your email"),d=Object(n["g"])("Provide a valid email"),u=Object(n["g"])("Password"),b=Object(n["g"])("Provide a password"),j=Object(n["g"])("Password must be at least 8 characters long"),O=Object(n["g"])("Accept our Terms and Conditions"),m=Object(n["g"])("Sign up"),f={key:1,class:"signIn"},p={class:"signIn__container flex flex-col w-full"},h=Object(n["h"])("header",{class:"flex flex-col items-center justify-start mb-4"},[Object(n["h"])("h1",{class:"h1 text-center"},"Welcome back"),Object(n["h"])("p",{class:"mt-2 text-center"},"Log in and start managing your assets.")],-1),g=Object(n["g"])("Email"),$=Object(n["g"])("Provide your email"),v=Object(n["g"])("Provide a valid email"),w=Object(n["g"])("Password"),y=Object(n["g"])("Provide a password"),x=Object(n["g"])("Password must be at least 8 characters long"),k=Object(n["g"])("Sign in"),_={class:"mb-4 flex items-center justify-center"},K={class:"flex items-center justify-center"},U={class:"ml-1"};function I(e,t,a,I,V,L){var D=Object(n["E"])("ion-label"),P=Object(n["E"])("ion-input"),E=Object(n["E"])("ion-item"),S=Object(n["E"])("ion-checkbox"),C=Object(n["E"])("ion-list"),q=Object(n["E"])("ion-button"),A=Object(n["E"])("ion-text"),H=Object(n["E"])("ion-content"),J=Object(n["E"])("ion-page");return Object(n["x"])(),Object(n["e"])(J,null,{default:Object(n["K"])((function(){return[Object(n["h"])(H,{"scroll-y":"false",fullscreen:""},{default:Object(n["K"])((function(){return[Object(n["h"])("section",o,[e.showSignUp?(Object(n["x"])(),Object(n["e"])("section",c,[Object(n["h"])("div",r,[i,Object(n["h"])(C,{lines:"full",class:"my-4"},{default:Object(n["K"])((function(){return[Object(n["h"])(E,null,{default:Object(n["K"])((function(){return[Object(n["h"])(D,{color:e.v$.name.$error?"danger":"",position:"stacked"},{default:Object(n["K"])((function(){return[Object(n["g"])(Object(n["H"])(e.v$.name.$error?"Provide your name":"Name"),1)]})),_:1},8,["color"]),Object(n["h"])(P,{mode:"ios",disabled:e.isLoading,color:e.v$.name.$error?"danger":"",autofocus:"",autocomplete:"on",placeholder:"Your name",type:"text",modelValue:e.authData.name,"onUpdate:modelValue":t[1]||(t[1]=function(t){return e.authData.name=t})},null,8,["disabled","color","modelValue"])]})),_:1}),Object(n["h"])(E,null,{default:Object(n["K"])((function(){return[e.v$.email.$dirty&&e.v$.email.$error?e.v$.email.required.$invalid?(Object(n["x"])(),Object(n["e"])(D,{key:1,color:"danger",position:"stacked"},{default:Object(n["K"])((function(){return[s]})),_:1})):e.v$.email.email.$invalid?(Object(n["x"])(),Object(n["e"])(D,{key:2,color:"danger",position:"stacked"},{default:Object(n["K"])((function(){return[d]})),_:1})):Object(n["f"])("",!0):(Object(n["x"])(),Object(n["e"])(D,{key:0,position:"stacked"},{default:Object(n["K"])((function(){return[l]})),_:1})),Object(n["h"])(P,{mode:"ios",disabled:e.isLoading,color:e.v$.email.$error?"danger":"",inputmode:"email",autocomplete:"on",placeholder:"Email address",type:"email",modelValue:e.authData.email,"onUpdate:modelValue":t[2]||(t[2]=function(t){return e.authData.email=t})},null,8,["disabled","color","modelValue"])]})),_:1}),Object(n["h"])(E,null,{default:Object(n["K"])((function(){return[e.v$.password.$dirty&&e.v$.password.$error?e.v$.password.required.$invalid?(Object(n["x"])(),Object(n["e"])(D,{key:1,color:"danger",position:"stacked"},{default:Object(n["K"])((function(){return[b]})),_:1})):e.v$.password.minLength.$invalid?(Object(n["x"])(),Object(n["e"])(D,{key:2,color:"danger",position:"stacked"},{default:Object(n["K"])((function(){return[j]})),_:1})):Object(n["f"])("",!0):(Object(n["x"])(),Object(n["e"])(D,{key:0,position:"stacked"},{default:Object(n["K"])((function(){return[u]})),_:1})),Object(n["h"])(P,{mode:"ios",disabled:e.isLoading,color:e.v$.password.$error?"danger":"",clearInput:"",autocomplete:"new-password",placeholder:"Password",type:"password",modelValue:e.authData.password,"onUpdate:modelValue":t[3]||(t[3]=function(t){return e.authData.password=t})},null,8,["disabled","color","modelValue"])]})),_:1}),Object(n["h"])(E,null,{default:Object(n["K"])((function(){return[Object(n["h"])(S,{mode:"ios",disabled:e.isLoading,modelValue:e.termsAccepted,"onUpdate:modelValue":t[4]||(t[4]=function(t){return e.termsAccepted=t})},null,8,["disabled","modelValue"]),Object(n["h"])(D,null,{default:Object(n["K"])((function(){return[O]})),_:1})]})),_:1})]})),_:1}),Object(n["h"])(q,{class:"mt-4",mode:"ios",disabled:e.isLoading||e.v$.$invalid||!e.termsAccepted,expand:"block",onClick:e.onSignUp},{default:Object(n["K"])((function(){return[m]})),_:1},8,["disabled","onClick"])])])):(Object(n["x"])(),Object(n["e"])("section",f,[Object(n["h"])("div",p,[h,Object(n["h"])(C,{lines:"full",class:"my-4"},{default:Object(n["K"])((function(){return[Object(n["h"])(E,null,{default:Object(n["K"])((function(){return[e.v$.email.$dirty&&e.v$.email.$error?e.v$.email.required.$invalid?(Object(n["x"])(),Object(n["e"])(D,{key:1,color:"danger",position:"stacked"},{default:Object(n["K"])((function(){return[$]})),_:1})):e.v$.email.email.$invalid?(Object(n["x"])(),Object(n["e"])(D,{key:2,color:"danger",position:"stacked"},{default:Object(n["K"])((function(){return[v]})),_:1})):Object(n["f"])("",!0):(Object(n["x"])(),Object(n["e"])(D,{key:0,position:"stacked"},{default:Object(n["K"])((function(){return[g]})),_:1})),Object(n["h"])(P,{mode:"ios",disabled:e.isLoading,color:e.v$.email.$error?"danger":"",inputmode:"email",autocomplete:"on",placeholder:"Email address",type:"email",modelValue:e.authData.email,"onUpdate:modelValue":t[5]||(t[5]=function(t){return e.authData.email=t})},null,8,["disabled","color","modelValue"])]})),_:1}),Object(n["h"])(E,null,{default:Object(n["K"])((function(){return[e.v$.password.$dirty&&e.v$.password.$error?e.v$.password.required.$invalid?(Object(n["x"])(),Object(n["e"])(D,{key:1,color:"danger",position:"stacked"},{default:Object(n["K"])((function(){return[y]})),_:1})):e.v$.password.minLength.$invalid?(Object(n["x"])(),Object(n["e"])(D,{key:2,color:"danger",position:"stacked"},{default:Object(n["K"])((function(){return[x]})),_:1})):Object(n["f"])("",!0):(Object(n["x"])(),Object(n["e"])(D,{key:0,position:"stacked"},{default:Object(n["K"])((function(){return[w]})),_:1})),Object(n["h"])(P,{mode:"ios",disabled:e.isLoading,color:e.v$.password.$error?"danger":"",clearInput:"",autocomplete:"current-password",placeholder:"Password",type:"password",modelValue:e.authData.password,"onUpdate:modelValue":t[6]||(t[6]=function(t){return e.authData.password=t})},null,8,["disabled","color","modelValue"])]})),_:1})]})),_:1}),Object(n["h"])(q,{class:"mt-4",mode:"ios",disabled:e.isLoading||e.v$.email.$invalid||e.v$.password.$invalid,expand:"block",onClick:e.onSignIn},{default:Object(n["K"])((function(){return[k]})),_:1},8,["disabled","onClick"])])])),Object(n["h"])("footer",_,[Object(n["h"])("p",K,Object(n["H"])(e.showSignUp?"Already have an account?":"Don't have an account?"),1),Object(n["h"])(A,{mode:"ios",color:"primary",class:"cursor-pointer",onClick:t[7]||(t[7]=function(t){return e.showSignUp=!e.showSignUp})},{default:Object(n["K"])((function(){return[Object(n["h"])("p",U,Object(n["H"])(e.showSignUp?"Log in":"Sign up"),1)]})),_:1})])])]})),_:1})]})),_:1})}var V=a("d867"),L=a("5502"),D=a("25a0"),P=a("e3e1"),E=Object(n["i"])({name:"Authentication",components:{IonPage:V["o"],IonContent:V["g"],IonButton:V["c"],IonList:V["m"],IonInput:V["j"],IonItem:V["k"],IonCheckbox:V["e"],IonLabel:V["l"],IonText:V["y"]},setup:function(){var e=Object(L["b"])(),t=Object(n["c"])((function(){return e.getters.isLoading})),a=Object(n["C"])(!0),o=Object(n["B"])({name:"",email:"",password:""}),c=Object(n["C"])(!1),r=8,i=Object(n["c"])((function(){return{name:{required:P["d"],$autoDirty:!0},email:{required:P["d"],email:P["b"],$autoDirty:!0},password:{required:P["d"],minLength:Object(P["c"])(r),$autoDirty:!0}}})),l=Object(D["b"])(i,o),s=function(){l.value.$touch(),l.value.$error||e.dispatch("signUserUp",o).then((function(){o.name="",o.email="",o.password="",l.value.$reset()}))},d=function(){o.email&&o.password&&e.dispatch("signUserIn",{email:o.email,password:o.password}).then((function(){o.email="",o.password="",l.value.$reset()}))};return{isLoading:t,showSignUp:a,authData:o,termsAccepted:c,onSignUp:s,onSignIn:d,v$:l}}});a("eb0f");E.render=I;t["default"]=E},eb0f:function(e,t,a){"use strict";a("bf34")}}]);
//# sourceMappingURL=chunk-5feec14a.17eb5c41.js.map