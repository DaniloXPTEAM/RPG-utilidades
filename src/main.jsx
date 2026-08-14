import React, {useMemo, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {ArrowLeft, ArrowRight, Check, Compass, RotateCcw, Sparkles} from 'lucide-react'
import {questions} from './questions'
import {classes} from './classes'
import './index.css'

const traits=['melee','ranged','magic','faith','support','stealth','nature','craft','lead','companion','fury','precision','simple','complex','social','defense','unarmed','dark','sea','tactics']
const mergeScores=answers=>answers.reduce((all,answer)=>{if(answer) Object.entries(answer.score).forEach(([key,value])=>all[key]=(all[key]||0)+value);return all},{})
const dot=(a,b)=>traits.reduce((sum,t)=>sum+(a[t]||0)*(b[t]||0),0)
const cosine=(a,b)=>{const aa=Math.sqrt(dot(a,a)),bb=Math.sqrt(dot(b,b));return aa&&bb?dot(a,b)/(aa*bb):0}
const affinity=(raw,top)=>Math.min(97,Math.max(68,Math.round(raw/top*96)))
const incompatible={samurai:['cavaleiro'],cavaleiro:['samurai']}
function pickResults(answers){
 const user=mergeScores(answers); const ranked=classes.map(profile=>({...profile,raw:dot(user,profile.score)})).sort((a,b)=>b.raw-a.raw)
 const top=ranked[0], candidates=ranked.slice(1,7).filter(x=>!(incompatible[top.id]||[]).includes(x.id));
 const viable=candidates.filter(x=>x.raw/top.raw>=.58); const pool=viable.length?viable:candidates;
 const second=pool.map(x=>({...x,combined:(x.raw/top.raw)*.55+cosine(top.score,x.score)*.45})).sort((a,b)=>b.combined-a.combined)[0]||ranked[1]
 return {top:{...top,affinity:96},second:{...second,affinity:affinity(second.raw,top.raw)}}
}
function SamarBadge({variant='dark'}){return <div className={`samar-badge ${variant}`}><svg viewBox="0 0 82 52" aria-hidden="true"><g fill="#c9b080"><circle cx="10" cy="10" r="5"/><circle cx="72" cy="10" r="5"/><circle cx="10" cy="42" r="5"/><circle cx="72" cy="42" r="5"/></g><g fill="none" stroke="#c7b79a" strokeWidth="3"><path d="M10 3v14M3 10h14M72 3v14M65 10h14M10 35v14M3 42h14M72 35v14M65 42h14"/></g><rect x="19" y="8" width="44" height="36" rx="4" fill="url(#screen)" stroke="#c7b79a" strokeWidth="3"/><text x="41" y="34" textAnchor="middle" fill="#ffe44d" fontSize="25" fontFamily="Georgia" fontWeight="bold">C</text><defs><radialGradient id="screen"><stop stopColor="#6eff8a"/><stop offset="1" stopColor="#0f8a2e"/></radialGradient></defs></svg><span>CRIADO POR SAMAR</span></div>}
function Intro({start}){return <main className="intro-shell"><div className="intro-copy"><div className="eyebrow"><Compass size={15}/> TORRENTA20 · GUIA DE CLASSE</div><h1>Bússola<br/><em>de Arton</em></h1><h2>Seu herói começa aqui.</h2><p>Doze escolhas para encontrar a classe que transforma seu jeito de jogar em uma lenda digna de Arton.</p><button className="primary" onClick={start}>Encontrar meu caminho <ArrowRight size={18}/></button><div className="time-badge"><Sparkles size={15}/> 12 perguntas · cerca de 4 min</div></div><div className="compass-orbit"><div className="compass-core"><span>N</span><b>✦</b><i>S</i></div></div><footer><SamarBadge variant="light"/><span>Uma jornada de escolhas, não de respostas prontas.</span></footer></main>}
function Flow({step}){return <aside className="flow"><div className="flow-heading">SEU CAMINHO <span>{step}/12</span></div>{questions.map((q,i)=><div className={`flow-item ${i===step?'active':''} ${i<step?'done':''}`} key={q.id}><div className="flow-node">{i<step?<Check size={13}/>:String(i+1).padStart(2,'0')}</div><div><b>{q.short}</b><small>{i===step?'Agora':i<step?'Definido':'A seguir'}</small></div></div>)}<div className={`flow-item recommendation ${step===12?'active':''}`}><div className="flow-node"><Sparkles size={13}/></div><b>Recomendação</b></div></aside>}
function Quiz({answers,setAnswers,back,reveal,currentStep,setCurrentStep}){const question=questions[currentStep]; const selected=answers[currentStep]; const choose=option=>{const copy=[...answers];copy[currentStep]=option;setAnswers(copy)}; const next=()=>{if(currentStep===11){reveal()}else if(currentStep<11){setCurrentStep(step=>step+1)}}; const previous=()=>{if(currentStep>0) setCurrentStep(step=>step-1);else back()};return <main className="quiz-shell"><header className="quiz-top"><div><span>PASSO {String(currentStep+1).padStart(2,'0')} DE 12</span><strong>{Math.round((currentStep+1)/12*100)}%</strong></div><div className="progress"><i style={{width:`${(currentStep+1)/12*100}%`}}/></div></header><div className="quiz-layout"><Flow step={currentStep}/><section className="question-panel"><div className="question-number">{String(currentStep+1).padStart(2,'0')} <span>/ 12</span></div><h1>{question.prompt}</h1><p>{question.context}</p><div className="choices">{question.options.map((option,i)=><button key={option.title} className={`choice-button ${selected===option?'choice-button--selected':''}`} onClick={()=>choose(option)}><span>0{i+1}</span><b>{option.title}</b><small>{option.detail}</small>{selected===option&&<Check className="choice-check" size={17}/>}</button>)}</div><div className="quiz-actions"><button className="ghost" onClick={previous}><ArrowLeft size={17}/> Voltar</button><button className="primary" disabled={!selected} onClick={next}>{currentStep===11?'Revelar caminho':'Continuar'} <ArrowRight size={17}/></button></div></section></div></main>}
function Portrait({profile}){const [failed,setFailed]=useState(false);return <figure><div className="real-portrait">{!failed?<img src={profile.image} alt={profile.imageAlt} loading="lazy" onError={()=>setFailed(true)}/>:<div className="portrait-fallback">{profile.name}</div>}</div><figcaption>Retrato de inspiração · Pexels</figcaption></figure>}
function ResultCard({profile,main}){return <article className={`result-card ${main?'main-result':''}`}><Portrait profile={profile}/><div className="result-content"><div className="card-kicker">{main?'SEU NORTE':'SEGUNDA OPÇÃO'} <span>{profile.kind}</span></div><h2>{profile.name}</h2><div className="affinity"><b>{profile.affinity}%</b> de afinidade</div><p className="desc">{profile.description}</p><blockquote>{profile.scene}</blockquote><div className="why"><h3>Por que combina</h3>{profile.why.map(x=><div key={x}><Check size={15}/>{x}</div>)}</div><div className="profile-grid"><span><b>Perfil</b>{profile.role}</span><span><b>Atributo</b>{profile.attribute}</span><span><b>Complexidade</b>{profile.complexity}</span><span><b>Fonte</b>{profile.source}</span></div><p className="attention"><b>Antes de escolher:</b> {profile.attention}</p></div></article>}
function Results({answers,redo,back}){const {top,second}=useMemo(()=>pickResults(answers),[answers]);return <main className="results-shell"><header className="result-header"><div className="eyebrow"><Compass size={15}/> SUA BÚSSOLA APONTA PARA</div><h1>Um caminho <em>feito para você.</em></h1><p>Suas escolhas desenharam duas rotas coerentes para sua próxima aventura.</p></header><section className="results-list"><ResultCard profile={top} main/><ResultCard profile={second}/></section><div className="result-actions"><button className="ghost" onClick={back}><ArrowLeft size={17}/> Voltar às escolhas</button><button className="primary" onClick={redo}><RotateCcw size={17}/> Refazer jornada</button></div><footer><SamarBadge variant="dark"/><span>Que sua história encontre um bom começo.</span></footer></main>}
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
    await wait(400)
    click(btn('Encontrar meu caminho'));await wait(60)
    for(let i=0;i<12;i++){
      assert($('.question-number')?.textContent.includes(String(i+1).padStart(2,'0')),`pergunta ${i+1} exibida`)
      const choices=$$('.choice-button')
      click(choices[i%choices.length]);await wait(40)
      assert($$('.choice-button--selected').length===1,`pergunta ${i+1}: clicar na opção seleciona corretamente`)
      if(i===1){
        click(btn('Voltar'));await wait(40)
        assert($('.question-number')?.textContent.includes('01')&&$$('.choice-button--selected').length===1,'Voltar retorna à pergunta 1 com resposta preservada')
        click(btn('Continuar'));await wait(40)
        assert($('.question-number')?.textContent.includes('02')&&$$('.choice-button--selected').length===1,'Continuar retorna à pergunta 2 com resposta preservada')
      }
      click(btn(i===11?'Revelar caminho':'Continuar'));await wait(40)
    }
    assert(document.body.textContent.includes('SUA BÚSSOLA APONTA PARA'),'responder a pergunta 12 e clicar em Revelar caminho abre os resultados')
    assert($$('.result-card').length===2,'aparecem exatamente dois cards de classe')
    click(btn('Voltar às escolhas'));await wait(40)
    assert($('.question-number')?.textContent.includes('12')&&$$('.choice-button--selected').length===1,'Voltar às escolhas retorna à pergunta 12 preservando a resposta')
    click(btn('Revelar caminho'));await wait(40)
    click(btn('Refazer jornada'));await wait(40)
    assert($('.question-number')?.textContent.includes('01')&&$$('.choice-button--selected').length===0,'Refazer jornada retorna à pergunta 1 com todas as respostas limpas')
    assert(errors.length===0,'nenhum erro JavaScript durante o percurso'+(errors.length?': '+errors.join(' | '):''))
    const pre=document.createElement('pre')
    pre.id='selftest-report'
    pre.textContent='SELFTEST INICIO\n'+log.join('\n')+'\nRESUMO: '+log.filter(l=>l.startsWith('PASS')).length+' PASS / '+log.filter(l=>l.startsWith('FAIL')).length+' FAIL\nSELFTEST FIM'
    document.body.prepend(pre)
  })()
}
