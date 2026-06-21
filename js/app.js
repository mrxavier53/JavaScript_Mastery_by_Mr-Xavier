
(() => {
  const chapters = window.CHAPTERS || [];
  const state = JSON.parse(localStorage.getItem("jmx-state-v3") || '{"read":[],"tasks":{},"quizzes":{},"xp":0}');
  const view = document.querySelector("#view");
  const sidebar = document.querySelector("#sidebar");
  const scrim = document.querySelector("#scrim");
  const nav = document.querySelector("#nav");
  const esc = value => String(value).replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  const save = () => localStorage.setItem("jmx-state-v3", JSON.stringify(state));
  const level = () => Math.max(1, Math.floor(state.xp / 250) + 1);
  const openMenu = () => { sidebar.classList.add("open"); scrim.classList.add("show"); };
  const closeMenu = () => { sidebar.classList.remove("open"); scrim.classList.remove("show"); };
  document.querySelector("#menu-button").addEventListener("click", openMenu);
  document.querySelectorAll("[data-close-sidebar]").forEach(x => x.addEventListener("click", closeMenu));

  function updateStats(){
    document.querySelector("#side-xp").textContent = `${state.xp} XP`;
    document.querySelector("#side-read").textContent = `${state.read.length}/53 read`;
    document.querySelector("#header-xp").textContent = `${state.xp} XP`;
    document.querySelector("#header-level").textContent = `Level ${level()}`;
  }
  function markNav(name){
    nav.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.view === name));
  }
  function addXp(amount){
    state.xp += amount; save(); updateStats();
  }
  function words(chapter){return chapter.words.toLocaleString();}
  function renderMarkdown(text){
    let out = esc(text);
    out = out.replace(/```js\n([\s\S]*?)```/g, (_,code) => `<pre><code>${code}</code></pre>`);
    out = out.replace(/^### (.*)$/gm, "<h3>$1</h3>");
    out = out.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/\*(.*?)\*/g, "<em>$1</em>");
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    out = out.split(/\n{2,}/).map(part => part.startsWith("<h3") || part.startsWith("<pre") ? part : `<p>${part.replace(/\n/g,"<br>")}</p>`).join("");
    return out;
  }
  function setView(name, id){
    closeMenu(); markNav(name);
    if(name === "home") return home();
    if(name === "learn") return learn();
    if(name === "chapter") return chapterPage(id);
    if(name === "tasks") return taskList();
    if(name === "quizzes") return quizList();
    if(name === "lab") return lab();
    if(name === "progress") return progress();
    if(name === "badges") return badges();
    if(name === "settings") return settings();
  }
  nav.addEventListener("click", e => { const b=e.target.closest("button"); if(b) setView(b.dataset.view); });

  function home(){
    const done = state.read.length, taskCount = Object.keys(state.tasks).length, quizCount = Object.keys(state.quizzes).length;
    view.innerHTML = `
      <section class="hero">
        <span class="pill">53 chapters • 81,000+ words • browser-based practice</span>
        <h1>Learn JavaScript like a real book — then build with it.</h1>
        <p>JavaScript Mastery by Mr Xavier is a complete study reader with chapters, examples, challenges, quizzes, saved progress, XP, badges, and a built-in Code Lab.</p>
        <div class="hero-actions">
          <button class="btn primary" data-go="learn">Start reading</button>
          <button class="btn" data-go="lab">Open Code Lab</button>
        </div>
      </section>
      <section class="grid">
        <div class="card"><div class="muted">Reading progress</div><div class="stat">${done} <small>/ 53</small></div><div class="progressbar"><i style="width:${done/53*100}%"></i></div></div>
        <div class="card"><div class="muted">Experience earned</div><div class="stat">${state.xp} XP</div><p class="muted">Level ${level()} learner profile</p></div>
        <div class="card"><div class="muted">Practice activity</div><div class="stat">${taskCount + quizCount}</div><p class="muted">${taskCount} challenge checks • ${quizCount} quiz answers</p></div>
      </section>
      <section class="card" style="margin-top:24px"><h2>How the book works</h2><p>Read in order or jump to any chapter. Every chapter includes an explanation, a runnable example, a build prompt, and a quick knowledge check. You are never blocked from continuing; practice is there when you want to sharpen the lesson.</p></section>`;
    bindGo();
  }
  function bindGo(){ view.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>setView(b.dataset.go)); }
  function learn(){
    view.innerHTML = `<h1 class="section-title">The 53-chapter JavaScript book</h1><p class="muted">More than 80,000 words of original learning content. Open any chapter, read, experiment, and continue at your own pace.</p><div class="chapter-list">${chapters.map(c => `<button class="chapter-card ${state.read.includes(c.id)?"read":""}" data-chapter="${c.id}"><strong>Chapter ${c.id}: ${esc(c.title)}</strong><div class="tiny">${esc(c.focus)} • ${words(c)} words ${state.read.includes(c.id)?"• Read":""}</div></button>`).join("")}</div>`;
    view.querySelectorAll("[data-chapter]").forEach(b=>b.onclick=()=>setView("chapter", Number(b.dataset.chapter)));
  }
  function chapterPage(id){
    const c = chapters.find(x=>x.id===Number(id)) || chapters[0];
    if(!state.read.includes(c.id)){ state.read.push(c.id); addXp(10); save(); }
    const previous = chapters.find(x=>x.id===c.id-1), next=chapters.find(x=>x.id===c.id+1);
    view.innerHTML = `<div class="reader-layout"><article class="article">
      <span class="pill">Chapter ${c.id} of 53 • ${words(c)} words</span><h1>${esc(c.title)}</h1><p class="muted">${esc(c.focus)}</p>
      ${renderMarkdown(c.content)}
      <section class="challenge"><h2>Practice build</h2><p>${esc(c.task)}</p><textarea class="editor" id="task-code">${esc(c.example)}</textarea><div class="button-row"><button class="btn primary" id="check-task">Check answer</button><button class="btn" id="run-task">Run code</button></div><div id="task-result" class="output">Write code, then check your answer. Successful checks earn XP once per chapter.</div></section>
      <section class="challenge"><h2>Quick check</h2><p>${esc(c.quiz.question)}</p><div id="quiz-options">${c.quiz.options.map((o,i)=>`<button class="quiz-option" data-option="${i}">${esc(o)}</button>`).join("")}</div><div id="quiz-result" class="output">${state.quizzes[c.id] ? "This question has already been answered." : "Choose the answer that best fits this chapter."}</div></section>
      <div class="button-row">${previous?`<button class="btn" data-open="${previous.id}">← Chapter ${previous.id}</button>`:""}${next?`<button class="btn primary" data-open="${next.id}">Continue to Chapter ${next.id} →</button>`:"<button class='btn primary' data-go='progress'>View final progress</button>"}</div>
    </article><aside class="reader-aside card"><h3>Chapter status</h3><p class="good">✓ Added to reading progress</p><div class="progressbar"><i style="width:${c.id/53*100}%"></i></div><p class="muted">You can move to the next chapter whenever you are ready.</p><button class="btn" data-go="lab">Open Code Lab</button></aside></div>`;
    view.querySelector("#check-task").onclick=()=>checkTask(c);
    view.querySelector("#run-task").onclick=()=>runCode(view.querySelector("#task-code").value, view.querySelector("#task-result"));
    view.querySelectorAll("[data-option]").forEach(b=>b.onclick=()=>answerQuiz(c,Number(b.dataset.option)));
    view.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>setView("chapter", Number(b.dataset.open)));
    bindGo();
  }
  function runWorker(code, callback){
    const workerSource = `self.onmessage=e=>{const logs=[];const console={log:(...x)=>logs.push(x.map(v=>typeof v==='object'?JSON.stringify(v):String(v)).join(' ')),error:(...x)=>logs.push('Error: '+x.join(' ')),warn:(...x)=>logs.push('Warning: '+x.join(' '))};try{const result=(new Function('console',e.data))(console);Promise.resolve(result).then(r=>postMessage({ok:true,logs,result:r})).catch(err=>postMessage({ok:false,error:err.message,logs}))}catch(err){postMessage({ok:false,error:err.message,logs})}}`;
    const blob = new Blob([workerSource],{type:"application/javascript"}), worker = new Worker(URL.createObjectURL(blob));
    const timeout=setTimeout(()=>{worker.terminate(); callback({ok:false,error:"Stopped after 2 seconds. Avoid infinite loops."});},2000);
    worker.onmessage=e=>{clearTimeout(timeout);worker.terminate();callback(e.data);}; worker.postMessage(code);
  }
  function runCode(code, output){
    output.textContent="Running...";
    runWorker(code, r=>{ output.innerHTML = r.ok ? `<span class="good">✓ Finished</span>\n${esc((r.logs||[]).join("\n") || (r.result===undefined?"No console output.":String(r.result)))}` : `<span class="bad">✕ ${esc(r.error)}</span>\n${esc((r.logs||[]).join("\n"))}`;});
  }
  function checkTask(c){
    const code=view.querySelector("#task-code").value, out=view.querySelector("#task-result"), re=new RegExp(c.taskRule,"i");
    if(re.test(code)){const already=state.tasks[c.id]; state.tasks[c.id]=true; if(!already)addXp(40); save();out.innerHTML=`<span class="good">✓ Challenge accepted${already?"":" — +40 XP"}</span>\nYour solution includes the key idea: ${esc(c.taskHint)}`;}
    else out.innerHTML=`<span class="bad">Not quite yet.</span>\n${esc(c.taskHint)}`;
  }
  function answerQuiz(c, option){
    const out=view.querySelector("#quiz-result");
    if(state.quizzes[c.id]) return;
    if(option===c.quiz.answer){state.quizzes[c.id]=true;addXp(20);save();out.innerHTML="<span class='good'>✓ Correct — +20 XP</span>";}
    else out.innerHTML="<span class='bad'>Try again.</span> Re-read the key ideas in this chapter and choose another answer.";
  }
  function taskList(){ genericList("Tasks", "Build practice from each chapter. These prompts are available inside every reading page; completed checks are saved here.", "tasks"); }
  function quizList(){ genericList("Quizzes", "Quick checks help you notice which ideas you understand already. Each chapter has one in the reader.", "quizzes"); }
  function genericList(title, description, kind){
    const completed = kind==="tasks"?state.tasks:state.quizzes;
    view.innerHTML=`<h1 class="section-title">${title}</h1><p class="muted">${description}</p><div class="chapter-list">${chapters.map(c=>`<button class="chapter-card ${completed[c.id]?"read":""}" data-chapter="${c.id}"><strong>Chapter ${c.id}: ${esc(c.title)}</strong><div class="tiny">${completed[c.id]?"Completed":"Open chapter"}</div></button>`).join("")}</div>`;
    view.querySelectorAll("[data-chapter]").forEach(b=>b.onclick=()=>setView("chapter",Number(b.dataset.chapter)));
  }
  function lab(){
    view.innerHTML=`<h1 class="section-title">Code Lab</h1><p class="muted">Run JavaScript practice code directly in the browser. It is designed for learning and console output, not for private keys, passwords, or untrusted code from strangers.</p><div class="lab-grid"><section class="card"><textarea id="lab-code" class="editor">// Try JavaScript here\nconst name = 'Xavier';\nconsole.log(\`Hello, \${name}!\`);\nconsole.log(2 + 2);</textarea><div class="button-row"><button id="lab-run" class="btn primary">Run code</button><button id="lab-clear" class="btn">Clear output</button></div><div id="lab-output" class="output">Output will appear here.</div></section><aside class="card lab-help"><h2>Practice ideas</h2><ul><li>Try variables and template literals.</li><li>Write a function, then call it.</li><li>Use an array with map or filter.</li><li>Test a condition with if/else.</li><li>Copy an example from a chapter and change it.</li></ul><p class="notice">The Code Lab runs JavaScript only. It cannot run server languages such as Python, Java, or C++ on a static GitHub Pages site.</p></aside></div>`;
    view.querySelector("#lab-run").onclick=()=>runCode(view.querySelector("#lab-code").value,view.querySelector("#lab-output"));
    view.querySelector("#lab-clear").onclick=()=>view.querySelector("#lab-output").textContent="Output cleared.";
  }
  function progress(){
    const read=state.read.length,tasks=Object.keys(state.tasks).length,quizzes=Object.keys(state.quizzes).length;
    view.innerHTML=`<h1 class="section-title">Your progress</h1><div class="grid"><div class="card"><div class="muted">Chapters read</div><div class="stat">${read}/53</div><div class="progressbar"><i style="width:${read/53*100}%"></i></div></div><div class="card"><div class="muted">Challenge checks</div><div class="stat">${tasks}/53</div></div><div class="card"><div class="muted">Quiz answers</div><div class="stat">${quizzes}/53</div></div><div class="card"><div class="muted">Experience</div><div class="stat">${state.xp} XP</div><p class="muted">Level ${level()}</p></div></div><section class="card" style="margin-top:20px"><h2>Keep going</h2><p>Your progress is stored on this device using browser storage. Reading a chapter, checking a build, and answering a quick check all update your profile.</p><button class="btn primary" data-go="learn">Continue reading</button></section>`; bindGo();
  }
  function badges(){
    const read=state.read.length,tasks=Object.keys(state.tasks).length,quizzes=Object.keys(state.quizzes).length;
    const list=[["First Page","Read your first chapter",read>=1],["Bookworm","Read 10 chapters",read>=10],["Halfway There","Read 27 chapters",read>=27],["Full Reader","Read all 53 chapters",read>=53],["Builder","Complete 10 challenge checks",tasks>=10],["Quiz Mind","Answer 10 quick checks",quizzes>=10],["JavaScript Master","Reach 1,000 XP",state.xp>=1000]];
    view.innerHTML=`<h1 class="section-title">Badges</h1><p class="muted">Badges unlock from the work you do in the reader.</p><div class="grid">${list.map(([a,b,ok])=>`<div class="badge ${ok?"":"locked"}"><h3>${ok?"★":"☆"} ${a}</h3><p class="muted">${b}</p><strong>${ok?"Unlocked":"Locked"}</strong></div>`).join("")}</div>`;
  }
  function settings(){
    view.innerHTML=`<h1 class="section-title">Settings</h1><section class="card"><div class="settings-row"><div><strong>Local progress</strong><div class="muted">Stored only in this browser on this device.</div></div><button class="btn warn" id="reset-progress">Reset progress</button></div><div class="settings-row"><div><strong>Website</strong><div class="muted">JavaScript Mastery by Mr Xavier</div></div><a class="btn" href="https://mrxavier53.github.io/JavaScript_Mastery_by_Mr-Xavier/" target="_blank" rel="noopener">Open live site</a></div></section>`;
    view.querySelector("#reset-progress").onclick=()=>{if(confirm("Reset all saved reading, XP, tasks, and quizzes on this device?")){state.read=[];state.tasks={};state.quizzes={};state.xp=0;save();updateStats();home();}};
  }
  updateStats(); home();
})();
