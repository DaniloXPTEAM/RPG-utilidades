// Harness local do ?selftest — executa o site compilado em jsdom e imprime o relatório.
import {JSDOM} from 'jsdom'
import fs from 'fs'

let html = fs.readFileSync(process.argv[2] || 'dist/index.html', 'utf8')
let code = null
html = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/g, (_, inner) => { code = inner; return '' })

const dom = new JSDOM(html, {
  url: 'https://localhost/?selftest',
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  beforeParse(window){
    window.HTMLMediaElement.prototype.play = ()=>Promise.resolve()
    window.HTMLMediaElement.prototype.pause = ()=>{}
    window.HTMLMediaElement.prototype.load = ()=>{}
  }
})
const {window} = dom
if(!code) throw new Error('script inline não encontrado')
window.eval(code)
const deadline = Date.now() + 20000
const id = setInterval(()=>{
  const pre = window.document.querySelector('#selftest-report')
  if(pre){
    clearInterval(id)
    const text = pre.textContent
    console.log(text)
    process.exit(text.includes('RESUMO: 31 PASS / 0 FAIL') ? 0 : 2)
  } else if(Date.now() > deadline){
    clearInterval(id)
    console.log('TIMEOUT: relatório do selftest não apareceu em 20s')
    process.exit(3)
  }
}, 250)
