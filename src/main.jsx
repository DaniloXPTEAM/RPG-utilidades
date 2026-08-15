import React, {useEffect, useMemo, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {ArrowLeft, ArrowRight, BookOpen, Check, Compass, Gem, RotateCcw, Sparkles, Swords, X} from 'lucide-react'
import {questions} from './questions'
import {classes} from './classes'
import '@fontsource/cinzel/400.css'
import '@fontsource/cinzel/600.css'
import '@fontsource/cinzel/700.css'
import '@fontsource/cinzel/800.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/500-italic.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/600-italic.css'
import './index.css'

const fundoUrl='./oraculo-taverna.mp4'
const posterUrl='./oraculo-taverna-poster.jpg'
const menuUrl='./oraculo-menu.jpg'
const cenaUrl='./oraculo-cena.mp4'

const traits=['melee','ranged','magic','faith','support','stealth','nature','craft','lead','companion','fury','precision','simple','complex','social','defense','unarmed','dark','sea','tactics']
const mergeScores=answers=>answers.reduce((all,answer)=>{if(answer) Object.entries(answer.score).forEach(([key,value])=>all[key]=(all[key]||0)+value);return all},{})
const dot=(a,b)=>traits.reduce((sum,t)=>sum+(a[t]||0)*(b[t]||0),0)
const cosine=(a,b)=>{const aa=Math.sqrt(dot(a,a)),bb=Math.sqrt(dot(b,b));return aa&&bb?dot(a,b)/(aa*bb):0}
const affinity=(raw,top)=>Math.min(97,Math.max(68,Math.round(raw/top*96)))
const incompatible={samurai:['cavaleiro'],cavaleiro:['samurai'],necromante:['paladino','clerigo','santo','frade'],paladino:['necromante'],clerigo:['necromante','usurpador'],santo:['necromante'],frade:['necromante'],usurpador:['clerigo']}
function pickResults(answers){
 const user=mergeScores(answers); const ranked=classes.map(profile=>({...profile,raw:dot(user,profile.score)})).sort((a,b)=>b.raw-a.raw)
 const top=ranked[0], candidates=ranked.slice(1,7).filter(x=>!(incompatible[top.id]||[]).includes(x.id));
 const viable=candidates.filter(x=>x.raw/top.raw>=.58); const pool=viable.length?viable:candidates;
 const second=pool.map(x=>({...x,combined:(x.raw/top.raw)*.55+cosine(top.score,x.score)*.45})).sort((a,b)=>b.combined-a.combined)[0]||ranked[1]
 return {top:{...top,affinity:96},second:{...second,affinity:affinity(second.raw,top.raw)}}
}

const WISDOMS=[
 'O amanhã pertence àqueles que compreendem o hoje.',
 'Todo herói é, antes de tudo, uma escolha bem feita.',
 'Em Arton, destino é o encontro entre coragem e propósito.',
 'Até os deuses já foram uma pergunta esperando resposta.'
]
const MOTES=Array.from({length:18},(_,i)=>({left:`${(i*53)%97+1}%`,top:`${(i*37)%92+3}%`,'--delay':`${-(i*1.9)}s`,'--dur':`${10+(i%5)*2.6}s`,'--size':`${2+(i%3)*1.7}px`}))

function SamarBadge({variant='dark'}){return <div className={`samar-badge ${variant}`}><svg viewBox="0 0 82 52" aria-hidden="true"><g fill="#c9b080"><circle cx="10" cy="10" r="5"/><circle cx="72" cy="10" r="5"/><circle cx="10" cy="42" r="5"/><circle cx="72" cy="42" r="5"/></g><g fill="none" stroke="#c7b79a" strokeWidth="3"><path d="M10 3v14M3 10h14M72 3v14M65 10h14M10 35v14M3 42h14M72 35v14M65 42h14"/></g><rect x="19" y="8" width="44" height="36" rx="4" fill="url(#screen)" stroke="#c7b79a" strokeWidth="3"/><text x="41" y="34" textAnchor="middle" fill="#ffe44d" fontSize="25" fontFamily="Georgia" fontWeight="bold">C</text><defs><radialGradient id="screen"><stop stopColor="#6eff8a"/><stop offset="1" stopColor="#0f8a2e"/></radialGradient></defs></svg><span>CRIADO POR SAMAR</span></div>}

function Ornament(){return <div className="ornament" aria-hidden="true"><i/><b/><i/></div>}
function SceneBg({soft}){return <>{soft
 ?<div className="scene-bg scene-bg--soft" aria-hidden="true"><img src={posterUrl} alt=""/></div>
 :<div className="scene-bg" aria-hidden="true"><video src={fundoUrl} poster={posterUrl} autoPlay muted loop playsInline preload="auto"/></div>}<div className="scene-shade" aria-hidden="true"/></>}

function Veil({label,close,wide,children}){
 return <div className="veil" role="dialog" aria-modal="true" aria-label={label} onClick={event=>{if(event.target===event.currentTarget) close()}}>
  <div className={`veil-panel ${wide?'veil-panel--wide':''}`}><div className="veil-body">
   <button className="veil-close" onClick={close} aria-label="Fechar painel"><X size={16}/></button>
   {children}
  </div></div>
 </div>
}
function AboutVeil({close,start,watch}){
 return <Veil label="Sobre a Bússola de Arton" close={close}>
  <div className="about-grid">
   <figure className="about-figure"><img src={menuUrl} alt="A visão original do Oráculo de Vectora"/><figcaption>A visão original do oráculo</figcaption><button className="about-toggle" onClick={watch}>Assistir à cena original</button></figure>
   <div className="about-copy">
    <div className="eyebrow"><BookOpen size={13}/> SOBRE A BÚSSOLA</div>
    <h3>O oráculo que aponta o seu caminho</h3>
    <Ornament/>
    <p>A Bússola de Arton é um oráculo de <b>doze escolhas</b>. Cada resposta acende traços do seu jeito de jogar — aço, fé, astúcia, mistério — como estrelas num céu particular.</p>
    <p>Ao final, o oráculo compara a sua constelação com as <b>43 classes e variantes de Tormenta20</b> e revela as duas rotas de maior afinidade, com pontos fortes e cuidados para a sua mesa.</p>
    <p className="about-note">É um norte, não uma sentença: a palavra final pertence à sua lenda.</p>
    <div className="veil-actions"><button className="primary" onClick={start}>Iniciar jornada <ArrowRight size={17}/></button><button className="ghost" onClick={close}>Voltar ao oráculo</button></div>
   </div>
  </div>
 </Veil>
}
function CenaVeil({close}){
 return <Veil label="A cena original do Oráculo" close={close} wide>
  <div className="eyebrow"><Sparkles size={13}/> A CENA ORIGINAL</div>
  <h3 className="grimoire-title">O Oráculo de Vectora em movimento</h3>
  <Ornament/>
  <figure className="cena-figure"><video src={cenaUrl} controls autoPlay loop playsInline/><figcaption>O menu original que inspirou esta bússola — arte e animação do Oráculo de Vectora</figcaption></figure>
 </Veil>
}
function ClassesVeil({close,start}){
 return <Veil label="As classes de Arton" close={close} wide>
  <div className="eyebrow"><Swords size={13}/> GRIMÓRIO DE CAMINHOS</div>
  <h3 className="grimoire-title">Os 43 caminhos de Arton</h3>
  <Ornament/>
  <p className="grimoire-lead">Classes do Jogo do Ano, de Heróis de Arton e da Dragão Brasil — cada retrato é uma porta esperando uma escolha.</p>
  <div className="grimoire">
   {classes.map(profile=><figure className="grimoire-tile" key={profile.id}><img src={profile.image} alt={profile.imageAlt} loading="lazy"/><figcaption><b>{profile.name}</b><small>{profile.kind}</small></figcaption></figure>)}
  </div>
  <div className="veil-actions veil-actions--center"><button className="primary" onClick={start}>Descobrir meu caminho <ArrowRight size={17}/></button></div>
 </Veil>
}

function Intro({start}){
 const [panel,setPanel]=useState(null)
 const [wisdom,setWisdom]=useState(0)
 useEffect(()=>{const timer=setInterval(()=>setWisdom(current=>(current+1)%WISDOMS.length),7000);return()=>clearInterval(timer)},[])
 useEffect(()=>{if(!panel) return; const onKey=event=>{if(event.key==='Escape') setPanel(null)}; addEventListener('keydown',onKey); return()=>removeEventListener('keydown',onKey)},[panel])
 return <main className="intro-shell">
  <SceneBg/>
  <div className="motes" aria-hidden="true">{MOTES.map((mote,i)=><span key={i} style={mote}/>)}</div>
  <div className="oracle-frame" aria-hidden="true"><i className="c tl"/><i className="c tr"/><i className="c bl"/><i className="c br"/></div>

  <header className="crest">
   <div className="eyebrow"><Compass size={14}/> TORMENTA20 · ORÁCULO DE CLASSES</div>
   <Ornament/>
   <h1>Bússola de Arton</h1>
   <Ornament/>
   <p className="tagline"><strong>O destino está em suas mãos.</strong><span>Prove seu valor em doze escolhas e descubra a classe que o aguarda em Arton.</span></p>
  </header>

  <div className="menu-col">
   <nav className="oracle-menu" aria-label="Jornada">
    <button className="omen" onClick={()=>setPanel('about')}><span className="omen-gem"><BookOpen size={18}/></span><span className="omen-text"><b>Sobre a bússola</b><small>Como o oráculo guia você</small></span></button>
    <button className="omen" onClick={()=>setPanel('classes')}><span className="omen-gem"><Swords size={18}/></span><span className="omen-text"><b>Conheça as classes</b><small>Os 43 caminhos de Arton</small></span></button>
   </nav>
   <div className="time-badge"><Sparkles size={14}/> 12 escolhas · cerca de 4 min</div>
  </div>

  <aside className="wisdom">
   <h3><Gem size={13}/> SABEDORIA DO ORÁCULO</h3>
   <blockquote key={wisdom}>“{WISDOMS[wisdom]}”</blockquote>
   <Ornament/>
  </aside>

  <button type="button" className="legend-banner legend-cta" onClick={start}><span>Sua lenda começa aqui<ArrowRight size={16} aria-hidden="true"/></span></button>

  <footer className="intro-footer"><SamarBadge variant="light"/><span>Uma jornada de escolhas, não de respostas prontas.</span></footer>

  {panel==='about'&&<AboutVeil close={()=>setPanel(null)} start={start} watch={()=>setPanel('cena')}/>}
  {panel==='classes'&&<ClassesVeil close={()=>setPanel(null)} start={start}/>}
  {panel==='cena'&&<CenaVeil close={()=>setPanel(null)}/>}
 </main>
}

function Flow({step}){return <aside className="flow"><div className="flow-heading">SEU CAMINHO <span>{step}/12</span></div>{questions.map((q,i)=><div className={`flow-item ${i===step?'active':''} ${i<step?'done':''}`} key={q.id}><div className="flow-node">{i<step?<Check size={12}/>:String(i+1).padStart(2,'0')}</div><div><b>{q.short}</b><small>{i===step?'Agora':i<step?'Definido':'A seguir'}</small></div></div>)}<div className={`flow-item recommendation ${step===12?'active':''}`}><div className="flow-node"><Sparkles size={12}/></div><b>Recomendação</b></div></aside>}
function Quiz({answers,setAnswers,back,reveal,currentStep,setCurrentStep}){const question=questions[currentStep]; const selected=answers[currentStep]; const choose=option=>{const copy=[...answers];copy[currentStep]=option;setAnswers(copy)}; const next=()=>{if(currentStep===11){reveal()}else if(currentStep<11){setCurrentStep(step=>step+1)}}; const previous=()=>{if(currentStep>0) setCurrentStep(step=>step-1);else back()};return <main className="quiz-shell"><SceneBg soft/><header className="quiz-top"><div><span>PASSO {String(currentStep+1).padStart(2,'0')} DE 12</span><strong>{Math.round((currentStep+1)/12*100)}%</strong></div><div className="progress"><i style={{width:`${(currentStep+1)/12*100}%`}}/></div></header><div className="quiz-layout"><Flow step={currentStep}/><section className="question-panel"><div className="question-number">{String(currentStep+1).padStart(2,'0')} <span>/ 12</span></div><h1>{question.prompt}</h1><p>{question.context}</p><div className="choices">{question.options.map((option,i)=><button key={option.title} className={`choice-button ${selected===option?'choice-button--selected':''}`} onClick={()=>choose(option)}><span>0{i+1}</span><b>{option.title}</b><small>{option.detail}</small>{selected===option&&<Check className="choice-check" size={17}/>}</button>)}</div><div className="quiz-actions"><button className="ghost" onClick={previous}><ArrowLeft size={17}/> Voltar</button><button className="primary" disabled={!selected} onClick={next}>{currentStep===11?'Revelar caminho':'Continuar'} <ArrowRight size={17}/></button></div></section></div></main>}
function Portrait({profile}){const [failed,setFailed]=useState(false);return <figure><div className="real-portrait">{!failed?<img src={profile.image} alt={profile.imageAlt} loading="lazy" onError={()=>setFailed(true)}/>:<div className="portrait-fallback">{profile.name}</div>}</div><figcaption>Retrato de inspiração</figcaption></figure>}
function ResultCard({profile,main}){return <article className={`result-card ${main?'main-result':''}`}><Portrait profile={profile}/><div className="result-content"><div className="card-kicker">{main?'SEU NORTE':'SEGUNDA OPÇÃO'} <span>{profile.kind}</span></div><h2>{profile.name}</h2><div className="affinity"><Gem size={14}/> <b>{profile.affinity}%</b> de afinidade</div><p className="desc">{profile.description}</p><blockquote>{profile.scene}</blockquote><div className="why"><h3>Por que combina</h3>{profile.why.map(x=><div key={x}><Check size={15}/>{x}</div>)}</div><div className="profile-grid"><span><b>Perfil</b>{profile.role}</span><span><b>Atributo</b>{profile.attribute}</span><span><b>Complexidade</b>{profile.complexity}</span><span><b>Fonte</b>{profile.source}</span></div><p className="attention"><b>Antes de escolher:</b> {profile.attention}</p></div></article>}
function Results({answers,redo,back}){const {top,second}=useMemo(()=>pickResults(answers),[answers]);return <main className="results-shell"><SceneBg soft/><header className="result-header"><div className="eyebrow"><Compass size={15}/> SUA BÚSSOLA APONTA PARA</div><h1>Um caminho <em>feito para você.</em></h1><Ornament/><p>Suas escolhas desenharam duas rotas coerentes para sua próxima aventura.</p></header><section className="results-list"><ResultCard profile={top} main/><ResultCard profile={second}/></section><div className="result-actions"><button className="ghost" onClick={back}><ArrowLeft size={17}/> Voltar às escolhas</button><button className="primary" onClick={redo}><RotateCcw size={17}/> Refazer jornada</button></div><footer><SamarBadge variant="dark"/><span>Que sua história encontre um bom começo.</span></footer></main>}
function App(){const [screen,setScreen]=useState('intro');const [answers,setAnswers]=useState(Array(12).fill(null));const [currentStep,setCurrentStep]=useState(0);return screen==='intro'?<Intro start={()=>setScreen('quiz')}/>:screen==='quiz'?<Quiz answers={answers} setAnswers={setAnswers} currentStep={currentStep} setCurrentStep={setCurrentStep} back={()=>setScreen('intro')} reveal={()=>setScreen('results')}/>:<Results answers={answers} redo={()=>{setAnswers(Array(12).fill(null));setCurrentStep(0);setScreen('quiz')}} back={()=>setScreen('quiz')}/>}
createRoot(document.getElementById('root')).render(<App/>)

// Verificação automática do fluxo (somente com ?selftest na URL; não afeta o uso normal).
if(new URLSearchParams(location.search).has('selftest')){
  (async()=>{
    const log=[],errors=[]
    window.addEventListener('error',e=>errors.push(e.message))
    const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)]
    const click=el=>el&&el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}))
    const btn=t=>$$('button').find(b=>b.textContent.includes(t))
    const wait=ms=>new Promise(r=>setTimeout(r,ms))
    const assert=(cond,msg)=>log.push((cond?'PASS':'FAIL')+' :: '+msg)
    await wait(150)
    click(btn('Sua lenda começa aqui'));await wait(0)
    for(let i=0;i<12;i++){
      assert($('.question-number')?.textContent.includes(String(i+1).padStart(2,'0')),`pergunta ${i+1} exibida`)
      const choices=$$('.choice-button')
      click(choices[i%choices.length]);await wait(0)
      assert($$('.choice-button--selected').length===1,`pergunta ${i+1}: clicar na opção seleciona corretamente`)
      if(i===1){
        click(btn('Voltar'));await wait(0)
        assert($('.question-number')?.textContent.includes('01')&&$$('.choice-button--selected').length===1,'Voltar retorna à pergunta 1 com resposta preservada')
        click(btn('Continuar'));await wait(0)
        assert($('.question-number')?.textContent.includes('02')&&$$('.choice-button--selected').length===1,'Continuar retorna à pergunta 2 com resposta preservada')
      }
      click(btn(i===11?'Revelar caminho':'Continuar'));await wait(0)
    }
    assert(document.body.textContent.includes('SUA BÚSSOLA APONTA PARA'),'responder a pergunta 12 e clicar em Revelar caminho abre os resultados')
    assert($$('.result-card').length===2,'aparecem exatamente dois cards de classe')
    click(btn('Voltar às escolhas'));await wait(0)
    assert($('.question-number')?.textContent.includes('12')&&$$('.choice-button--selected').length===1,'Voltar às escolhas retorna à pergunta 12 preservando a resposta')
    click(btn('Revelar caminho'));await wait(0)
    click(btn('Refazer jornada'));await wait(0)
    assert($('.question-number')?.textContent.includes('01')&&$$('.choice-button--selected').length===0,'Refazer jornada retorna à pergunta 1 com todas as respostas limpas')
    assert(errors.length===0,'nenhum erro JavaScript durante o percurso'+(errors.length?': '+errors.join(' | '):''))
    const pre=document.createElement('pre')
    pre.id='selftest-report'
    pre.textContent='SELFTEST INICIO\n'+log.join('\n')+'\nRESUMO: '+log.filter(l=>l.startsWith('PASS')).length+' PASS / '+log.filter(l=>l.startsWith('FAIL')).length+' FAIL\nSELFTEST FIM'
    document.body.prepend(pre)
  })()
}
