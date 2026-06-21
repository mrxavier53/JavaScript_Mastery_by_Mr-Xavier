const COURSE_MODULES = [
 {id:1,title:'Start JavaScript',icon:'🚀',range:[1,14],description:'Discover JavaScript, set up your tools, and write your first programs.'},
 {id:2,title:'Logic & Decisions',icon:'🧭',range:[15,25],description:'Teach your programs how to compare, decide, repeat, and handle mistakes.'},
 {id:3,title:'Functions & Reusable Code',icon:'⚙️',range:[26,34],description:'Write cleaner code with reusable functions and useful patterns.'},
 {id:4,title:'Arrays & Objects',icon:'📦',range:[35,45],description:'Organise collections of data and work with modern JavaScript features.'},
 {id:5,title:'Build for the Web',icon:'🌐',range:[46,53],description:'Use the DOM, events, storage, and projects to build interactive websites.'}
];
const CHAPTER_TITLES = [
 'What is JavaScript?','What can JavaScript build?','Installing VS Code and useful extensions','Using the browser console','Your first JavaScript program','Comments and clean code','Variables: let, const and var','Data types','Strings','Numbers and maths','Boolean values','Operators','User input with prompt()','Output with console.log() and alert()',
 'Comparison operators','if, else if and else','Logical operators: &&, || and !','Truthy and falsy values','switch statements','Ternary operators','Loops: for','Loops: while and do...while','break and continue','Nested loops','Debugging JavaScript errors',
 'What are functions?','Function parameters','Return values','Arrow functions','Function scope','Global vs local variables','Default parameters','Callback functions','Introduction to recursion',
 'Introduction to arrays','Array methods: push, pop, shift, unshift','Array searching and sorting','Array loops: forEach, map, filter','find, reduce and some','Introduction to objects','Object properties and methods','Arrays of objects','Destructuring','Spread and rest operators','JSON basics',
 'Introduction to the HTML DOM','Selecting elements from a page','Changing text, styles and HTML','Events: clicks, typing and submit','Forms and validation','Creating and deleting elements','Local storage','Final project: build a complete web app'
];
function moduleForChapter(n){return COURSE_MODULES.find(m=>n>=m.range[0]&&n<=m.range[1])}
function chapterSnippet(n,title){
 const examples={
  1:'console.log("Hello, JavaScript!");',7:'const username = "Xavier";\nlet score = 0;\nconsole.log(username, score);',9:'const greeting = "Welcome to JavaScript Mastery";\nconsole.log(greeting.length);',16:'const age = 16;\nif (age >= 13) {\n  console.log("Welcome!");\n} else {\n  console.log("Ask a parent first.");\n}',21:'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}',26:'function greet(name) {\n  return `Hello, ${name}!`;\n}\nconsole.log(greet("Xavier"));',35:'const colors = ["yellow", "blue", "green"];\nconsole.log(colors[0]);',40:'const student = {\n  name: "Xavier",\n  level: "Beginner"\n};\nconsole.log(student.name);',46:'const title = document.querySelector("h1");\nconsole.log(title.textContent);',52:'localStorage.setItem("theme", "dark");\nconst theme = localStorage.getItem("theme");'};
 return examples[n] || `// Chapter ${n}: ${title}\nconst lesson = "${title}";\nconsole.log(lesson);`;
}
const CHAPTERS = CHAPTER_TITLES.map((title,index)=>{const id=index+1, mod=moduleForChapter(id);return {id,title,module:mod.id,moduleTitle:mod.title,difficulty:id<=14?'Beginner':id<=34?'Intermediate':'Advanced',minutes:id%4===0?15:10,summary:`In this chapter, you will understand the key ideas behind ${title.toLowerCase()} and use them in a simple JavaScript example.`,learn:[`Understand the purpose of ${title.toLowerCase()}.`,`Read and explain a short JavaScript example.`,`Use the idea in a small practice task.`],example:chapterSnippet(id,title)}});
const PROJECTS = [
 {id:'age-checker',title:'Age Checker',emoji:'🎂',module:1,description:'Ask for a user age and show a friendly result with if / else.',skills:['Variables','Input','Conditions'],xp:150},
 {id:'guessing-game',title:'Number Guessing Game',emoji:'🎯',module:2,description:'Generate a secret number and let the user keep guessing.',skills:['Loops','Conditions','Math'],xp:200},
 {id:'quiz-game',title:'Simple Quiz Game',emoji:'🧠',module:3,description:'Create questions, score answers, and show a final score.',skills:['Functions','Arrays','Logic'],xp:250},
 {id:'marks-manager',title:'Student Marks Manager',emoji:'📊',module:4,description:'Store marks, calculate an average, and show a result.',skills:['Objects','Arrays','Methods'],xp:250},
 {id:'todo-app',title:'To-Do List App',emoji:'✅',module:5,description:'Build an interactive to-do app that saves tasks in the browser.',skills:['DOM','Events','Local Storage'],xp:350},
 {id:'final-web-app',title:'Final Web App Challenge',emoji:'🏆',module:5,description:'Choose a notes app, expense tracker, study timer, or weather app and build it from scratch.',skills:['Everything','Planning','Problem solving'],xp:500}
];
const BADGES = [
 {id:'first-step',icon:'🌱',title:'First Step',description:'Complete Chapter 1.',check:s=>s.completedChapters.includes(1)},
 {id:'bookworm',icon:'📘',title:'Bookworm',description:'Complete 10 chapters.',check:s=>s.completedChapters.length>=10},
 {id:'quick-learner',icon:'🧠',title:'Quick Learner',description:'Score 100% on any quiz.',check:s=>Object.values(s.quizScores).some(x=>x===5)},
 {id:'learning-streak',icon:'🔥',title:'Focused Session',description:'Complete 3 chapters in one saved course journey.',check:s=>s.completedChapters.length>=3},
 {id:'code-starter',icon:'💻',title:'Code Starter',description:'Finish your first practice task.',check:s=>s.completedTasks.length>=1},
 {id:'js-explorer',icon:'⚙️',title:'JavaScript Explorer',description:'Finish the JavaScript Basics module.',check:s=>CHAPTERS.filter(c=>c.module===1).every(c=>s.completedChapters.includes(c.id))},
 {id:'loop-master',icon:'🔁',title:'Loop Master',description:'Finish Logic & Decisions.',check:s=>CHAPTERS.filter(c=>c.module===2).every(c=>s.completedChapters.includes(c.id))},
 {id:'function-wizard',icon:'🧩',title:'Function Wizard',description:'Finish Functions & Reusable Code.',check:s=>CHAPTERS.filter(c=>c.module===3).every(c=>s.completedChapters.includes(c.id))},
 {id:'data-handler',icon:'📦',title:'Data Handler',description:'Finish Arrays & Objects.',check:s=>CHAPTERS.filter(c=>c.module===4).every(c=>s.completedChapters.includes(c.id))},
 {id:'web-builder',icon:'🌐',title:'Web Builder',description:'Finish Build for the Web.',check:s=>CHAPTERS.filter(c=>c.module===5).every(c=>s.completedChapters.includes(c.id))},
 {id:'js-master',icon:'🏆',title:'JavaScript Master',description:'Complete all 53 chapters.',check:s=>s.completedChapters.length===53},
 {id:'elite-student',icon:'👑',title:"Xavier’s Elite Student",description:'Complete every project and every chapter.',check:s=>s.completedProjects.length===PROJECTS.length&&s.completedChapters.length===53}
];
function tasksForChapter(c){return ['Easy','Medium','Hard','Bonus'].map((difficulty,i)=>({id:`c${c.id}-${i+1}`,chapter:c.id,module:c.module,difficulty,title:`${difficulty}: ${c.title}`,description:i===0?`Write a tiny example that uses the main idea from Chapter ${c.id}.`:i===1?`Extend the Chapter ${c.id} example with one extra variable, condition, or output.`:i===2?`Build a mini program using ${c.title.toLowerCase()} without copying the lesson code.`:`Explain your solution in comments and improve it with a creative extra feature.`,hint:i===0?'Start with console.log() and one simple value.':i===1?'Break the task into small lines and test after each one.':i===2?'Write the steps in plain English before you write code.':'Focus on clean naming, comments, and a small user-friendly detail.',xp:i===0?25:i===1?35:i===2?50:65}));}
const TASKS=CHAPTERS.flatMap(tasksForChapter);
function quizForChapter(chapter){const t=chapter.title;return [
 {q:`What is the main focus of Chapter ${chapter.id}: ${t}?`,options:['A JavaScript concept used in the lesson','A CSS-only technique','A hardware component','A database password'],answer:0},
 {q:'Which habit helps when learning JavaScript?',options:['Testing small pieces of code','Never reading errors','Copying without understanding','Avoiding practice'],answer:0},
 {q:'Where can you safely test small JavaScript snippets?',options:['Browser console','A photo editor','A spreadsheet cell only','A printer'],answer:0},
 {q:'What is a good next step after reading an example?',options:['Change it and test what happens','Delete it immediately','Memorise it without trying','Ignore the output'],answer:0},
 {q:'Why are practice tasks useful?',options:['They turn ideas into skill','They remove all errors forever','They replace learning basics','They only make pages look pretty'],answer:0}
 ]}
