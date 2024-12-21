var O=Object.defineProperty;var h=(d,t,e)=>t in d?O(d,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[t]=e;var n=(d,t,e)=>h(d,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function e(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=e(r);fetch(r.href,a)}})();const o=class o{constructor(){n(this,"hasError",!1);n(this,"digitsBuffer",[]);n(this,"operandsBuffer",[]);n(this,"lastCommand",null)}getDisplayValue(){if(this.digitsBuffer.length===0)return"0";const t=this.convertDigitsBuffer();return!this.isNumber(t)||this.hasError?o.ERROR_MESSAGE:String(t)}handleCommand(t){switch(!0){case this.isUnaryOperator(t):this.handleUnaryOperator(t);break;case this.isBinaryOperator(t):this.handleBinaryOperator(t);break;case this.isControl(t):this.handleControl(t);break;case this.isDigit(t):this.handleDigit(t);break;case this.isDecimal(t):this.digitsBuffer.includes(".")||this.digitsBuffer.push(".");break;default:throw new Error("Not supported command")}}isUnaryOperator(t){return Object.keys(o.UNARY_OPERATIONS).includes(t)}isBinaryOperator(t){return Object.keys(o.BINARY_OPERATIONS).includes(t)}isControl(t){return t==="clear-all"||t==="equals"}isDigit(t){return Object.keys(o.DIGITS_MAP).includes(t)}isDecimal(t){return t==="decimal"}isNumber(t){return typeof t=="number"&&Number.isFinite(t)}clearOperandsBuffer(){this.operandsBuffer.length=0}updateDigitsBuffer(t){this.digitsBuffer=t.toString().split("")}clearDigitsBuffer(){this.digitsBuffer.length=0}convertDigitsBuffer(){return Number.parseFloat(this.digitsBuffer.join(""))}addOperand(t){return this.operandsBuffer.length>=2&&this.operandsBuffer.shift(),this.operandsBuffer.push(t),t}reset(){this.clearDigitsBuffer(),this.clearOperandsBuffer(),this.hasError=!1}logCommand(t,e){this.lastCommand={command:t,result:e}}handleDigit(t){this.digitsBuffer.push(o.DIGITS_MAP[t])}handleControl(t){switch(t){case"clear-all":this.reset(),this.logCommand(t,0);break;case"equals":if(this.lastCommand!==null&&this.isBinaryOperator(this.lastCommand.command)){this.addOperand(this.convertDigitsBuffer());const e=o.BINARY_OPERATIONS[this.lastCommand.command](this.operandsBuffer[0],this.operandsBuffer[1]);this.clearOperandsBuffer(),this.updateDigitsBuffer(e),this.logCommand(t,e)}break;default:throw new Error("Not supported command")}}handleBinaryOperator(t){if(t==="subtract"&&this.digitsBuffer.length===0){this.digitsBuffer.unshift("-");return}if(this.operandsBuffer.length>0&&this.digitsBuffer.length>0&&this.lastCommand!==null){const e=o.BINARY_OPERATIONS[this.lastCommand.command](this.operandsBuffer.at(-1),this.convertDigitsBuffer());this.clearOperandsBuffer(),this.isNumber(e)||(this.hasError=!0),this.addOperand(e),this.logCommand(t,e),this.clearDigitsBuffer();return}this.logCommand(t,this.addOperand(this.convertDigitsBuffer())),this.clearDigitsBuffer()}handleUnaryOperator(t){const e=o.UNARY_OPERATIONS[t](this.convertDigitsBuffer());this.updateDigitsBuffer(e),this.logCommand(t,e)}};n(o,"ERROR_MESSAGE","ERROR"),n(o,"DIGITS_MAP",{one:"1",two:"2",three:"3",four:"4",five:"5",six:"6",seven:"7",eight:"8",nine:"9",zero:"0"}),n(o,"UNARY_OPERATIONS",{half:t=>t/2,square:t=>t**2,sqrt:t=>Math.sqrt(t),ln:t=>Math.log(t)}),n(o,"BINARY_OPERATIONS",{add:(t,e)=>t+e,subtract:(t,e)=>t-e,multiply:(t,e)=>t*e,divide:(t,e)=>t/e,power:(t,e)=>t**e,mod:(t,e)=>t%e,percent:(t,e)=>t*e/100,log:(t,e)=>Math.log(t)/Math.log(e)});let l=o;const s=class s{constructor(t,e){n(this,"calculator");this.calculator=e,this.render(t),this.addEventListeners()}render(t){t.innerHTML=`
            <div class="calculator-container">
                <div class="calculator">
                    <input
                        class="calculator-display"
                        type="text"
                        value="0"
                        readonly
                        data-testid="calculator-display"
                    />
                    ${this.renderButtons(s.BUTTONS)}
                    ${this.renderShortcuts(s.KEYBOARD_SHORTCUTS_DATA)}
                </div>
			</div>
        `}renderButtons(t){return"".concat('<div class="calculator-buttons">',t.map(e=>`<button class="${e.type}${e.id==="clear-all"?" clear":""}${e.id==="equals"?" equals":""}" data-testid="button-${e.id}">${e.content}</button>`).join(`
`),"</div>")}renderShortcuts(t){return"".concat('<div class="shortcuts-panel">',"<h3>Keyboard Shortcuts</h3>",'<div class="shortcuts-list">',t.map(({key:e,description:i})=>`
                            <div class="shortcut-item">
                                <span class="shortcut-item__key">${e}</span>
                                <span class="shortcut-item__description">${i}</span>
                            </div>
                    `).join(`
`),"</div>","</div>")}addEventListeners(){document.addEventListener("keydown",this.handleKeyDown.bind(this)),document.addEventListener("keyup",this.handleKeyUp.bind(this)),document.querySelectorAll('button[data-testid^="button-"]').forEach(this.bindButtonEvents.bind(this))}bindButtonEvents(t){t.onclick=()=>this.handleButtonClick(t),t.onmousedown=()=>this.addButtonPressedClass(t),t.onmouseup=()=>this.removeButtonPressedClass(t),t.onmouseleave=()=>this.removeButtonPressedClass(t)}handleButtonClick(t){const e=t.getAttribute("data-testid");if(!e){console.error("Button has no data-testid attribute");return}const i=e==null?void 0:e.replace("button-","");i&&(this.calculator.handleCommand(i),this.updateDisplay())}updateDisplay(){const t=document.querySelector('.calculator [data-testid="calculator-display"]');t&&(t.value=this.calculator.getDisplayValue())}addButtonPressedClass(t){t.classList.add("button-pressed")}removeButtonPressedClass(t){t.classList.remove("button-pressed")}handleKeyDown(t){const e=t.key;this.pressButton(e),Object.keys(s.KEY_TO_BUTTON_ID_MAP).includes(e)&&t.preventDefault(),(t.ctrlKey&&(e==="3"||t.shiftKey&&e==="3")||t.ctrlKey&&(e==="5"||t.shiftKey&&e==="5")||t.ctrlKey&&(e==="6"||t.shiftKey&&e==="6")||t.ctrlKey&&(e==="7"||t.shiftKey&&e==="7"))&&t.preventDefault()}handleKeyUp(t){const e=t.key;this.releaseButton(e)}pressButton(t){const e=s.KEY_TO_BUTTON_ID_MAP[t];if(e){const i=document.querySelector(`[data-testid="button-${e}"]`);i&&(i.classList.add("button-pressed"),i.click())}}releaseButton(t){const e=s.KEY_TO_BUTTON_ID_MAP[t];if(e){const i=document.querySelector(`[data-testid="button-${e}"]`);i&&i.classList.remove("button-pressed")}}};n(s,"KEYBOARD_SHORTCUTS",{CLEAR:"c",ENTER:"Enter",BACKSPACE:"Backspace",DECIMAL:".",EQUALS:"=",ADD:"+",SUBTRACT:"-",MULTIPLY:"*",DIVIDE:"/",PERCENT:"%",MODULO:"&",POWER:"^",SQUARE_ROOT:"#",ZERO:"0",ONE:"1",TWO:"2",THREE:"3",FOUR:"4",FIVE:"5",SIX:"6",SEVEN:"7",EIGHT:"8",NINE:"9"}),n(s,"KEYBOARD_SHORTCUTS_DATA",[{key:`${s.KEYBOARD_SHORTCUTS.ZERO}-${s.KEYBOARD_SHORTCUTS.NINE}`,description:"Digits"},{key:s.KEYBOARD_SHORTCUTS.DECIMAL,description:"Decimal"},{key:`${s.KEYBOARD_SHORTCUTS.ADD} ${s.KEYBOARD_SHORTCUTS.SUBTRACT} ${s.KEYBOARD_SHORTCUTS.MULTIPLY} ${s.KEYBOARD_SHORTCUTS.DIVIDE}`,description:"Basic operations"},{key:s.KEYBOARD_SHORTCUTS.PERCENT,description:"Percent"},{key:s.KEYBOARD_SHORTCUTS.MODULO,description:"Modulo"},{key:s.KEYBOARD_SHORTCUTS.POWER,description:"Power"},{key:s.KEYBOARD_SHORTCUTS.SQUARE_ROOT,description:"Square root"},{key:s.KEYBOARD_SHORTCUTS.EQUALS,description:"Equals"},{key:s.KEYBOARD_SHORTCUTS.ENTER,description:"Equals"},{key:s.KEYBOARD_SHORTCUTS.CLEAR,description:"Clear"},{key:s.KEYBOARD_SHORTCUTS.BACKSPACE,description:"Clear"}]),n(s,"BUTTONS",[{type:"operator",id:"log",keys:[],content:"log"},{type:"operator",id:"ln",keys:[],content:"ln"},{type:"operator",id:"power",keys:[s.KEYBOARD_SHORTCUTS.POWER],content:"x<sup>n</sup>"},{type:"operator",id:"square",keys:[],content:"x²"},{type:"operator",id:"sqrt",keys:[s.KEYBOARD_SHORTCUTS.SQUARE_ROOT],content:"√"},{type:"digit",id:"seven",keys:[s.KEYBOARD_SHORTCUTS.SEVEN],content:"7"},{type:"digit",id:"eight",keys:[s.KEYBOARD_SHORTCUTS.EIGHT],content:"8"},{type:"digit",id:"nine",keys:[s.KEYBOARD_SHORTCUTS.NINE],content:"9"},{type:"operator",id:"mod",keys:[s.KEYBOARD_SHORTCUTS.MODULO],content:"mod"},{type:"operator",id:"percent",keys:[s.KEYBOARD_SHORTCUTS.PERCENT],content:"%"},{type:"digit",id:"four",keys:[s.KEYBOARD_SHORTCUTS.FOUR],content:"4"},{type:"digit",id:"five",keys:[s.KEYBOARD_SHORTCUTS.FIVE],content:"5"},{type:"digit",id:"six",keys:[s.KEYBOARD_SHORTCUTS.SIX],content:"6"},{type:"operator",id:"half",keys:[],content:"½"},{type:"operator",id:"divide",keys:[s.KEYBOARD_SHORTCUTS.DIVIDE],content:"÷"},{type:"digit",id:"one",keys:[s.KEYBOARD_SHORTCUTS.ONE],content:"1"},{type:"digit",id:"two",keys:[s.KEYBOARD_SHORTCUTS.TWO],content:"2"},{type:"digit",id:"three",keys:[s.KEYBOARD_SHORTCUTS.THREE],content:"3"},{type:"operator",id:"subtract",keys:[s.KEYBOARD_SHORTCUTS.SUBTRACT],content:"-"},{type:"operator",id:"multiply",keys:[s.KEYBOARD_SHORTCUTS.MULTIPLY],content:"×"},{type:"control",id:"clear-all",keys:[s.KEYBOARD_SHORTCUTS.CLEAR,s.KEYBOARD_SHORTCUTS.BACKSPACE],content:"C"},{type:"digit",id:"zero",keys:[s.KEYBOARD_SHORTCUTS.ZERO],content:"0"},{type:"control",id:"decimal",keys:[s.KEYBOARD_SHORTCUTS.DECIMAL],content:"."},{type:"operator",id:"add",keys:[s.KEYBOARD_SHORTCUTS.ADD],content:"+"},{type:"control",id:"equals",keys:[s.KEYBOARD_SHORTCUTS.EQUALS,s.KEYBOARD_SHORTCUTS.ENTER],content:"="}]),n(s,"CONTENT_TO_BUTTON_ID_MAP",{...s.BUTTONS.reduce((t,e)=>(t[e.content]=e.id,t),{})}),n(s,"KEY_TO_BUTTON_ID_MAP",{...s.BUTTONS.reduce((t,e)=>(e.keys.length>0&&e.keys.forEach(i=>{t[i]=e.id}),t),{})});let u=s;const p=document.querySelector("#app");new u(p,new l);
