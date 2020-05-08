(() => {
    
    const keywords = {"ചെയ്യുക": "do",
		      "ആണെങ്കിൽ":"if",
		      "ഇല്‍": "in",
		      "ഇന്": "for",
		      "ആവട്ടെ": "let",
		      "പുതിയ": "new",
		      "ശ്രമിക്കുക": "try",
		      "അസ്ഥിരം": "var",
		      "അവസ്ഥ": "case",
		      "അല്ലെങ്കിൽ": "else",
		      "എണ്ണല്‍": "enum",
		      "മൂല്യനിർണ്ണയം": "eval",
		      "അസാധു": "null",
		      "ഇത്": "this",
		      "ശരി": "true",
		      "വ്യർത്ഥം": "void",
		      "ഒപ്പം": "with",
		      "കാത്തിരിക്കുക": "await",
		      "മുടക്കുക": "break",
		      "പിടിക്കുക": "catch",
		      "ഗണം": "class",
		      "ശാശ്വതം": "const",
		      "തെറ്റ്": "false",
		      "ഉയര്‍ന്നതരം": "super",
		      "എറിയുക": "throw",
		      "എന്നിരിക്കെ": "while",
		      "നല്‍കുക": "yield",
		      "കളയുക": "delete",
		      "കയറ്റുമതി": "export",
		      "ഇറക്കുമതി": "import",
		      "പൊതു": "public",
		      "മടക്കം": "return",
		      "സ്ഥായി": "static",
		      "തിരിക്കുക": "switch",
		      "എത്തരം": "typeof",
		      "അടിസ്ഥാനം": "default",
		      "വ്യാപിപ്പിക്കുന്നു": "extends",
		      "ഒടുവിൽ": "finally",
		      "ഭാണ്‌ഡം": "package",
		      "സ്വകാര്യ": "private",
		      "തുടരുക": "continue",
		      "പ്രവർത്തി": "function",
		      "പ്രയോഗം": "function",
		      "തിരുത്തൽ": "debugger",
		      "വാദം": "arguments",
		      "സമ്പര്‍ക്കമുഖം": "interface",
		      "സുരക്ഷിതമാക്കപ്പെട്ട": "protected",
		      "നിർവഹിക്കുന്നു": "implements",
		      "ഉദാഹരണമാണ്": "instanceof"};

    const dataTypes = {};

    const translate = (x) => {

	let replacer = new RegExp(Object.keys(keywords).join("|"),"gi")

	return x.replace(replacer, (matched) => keywords[matched]);

    }

    const run = fns => (() => eval(fns))();

    const compile = (x) => run(translate(x));

    const showResults = (val) => document.querySelector(".result").textContent = compile(val);

    let ed = document.querySelector(".demo-editor");

    let m = CodeMirror(ed, {value: "ആവട്ടെ ക = 2, ച = 4;\n\n// ഇത് 6 എന്ന് തരും;\n\nക + ച;", mode: "javascript"});

    let sEditor = document.querySelector("#sample-editor");

    CodeMirror(sEditor, {value:
			 `/* വാരിയബിൾസ് ഇത് പോലെ ഉണ്ടാക്കാം */
ആവട്ടെ ക = 2, ച = 4;

/* എന്നിട്ടിങ്ങനെ അവ തമ്മിൽ കൂട്ടാം */
ക + ച; // => 6

/* ഫങ്ങ്ഷൻസ് എഴുതുന്നതിങ്ങനെ */
പ്രയോഗം വിളി(പേര്) {
    മടക്കം "കമോണ്ട്രാ " + പേര് + "!";
};

 വിളി("മഹേഷേ"); // => "കമോണ്ട്രാ മഹേഷേ!"

 /* കൂടുതൽ ഉദാഹരണങ്ങൾ താഴെയുണ്ട് */`, mode: "javascript", theme: "birds-of-paradise"});

    showResults(m.getValue());


    m.on("change", evnt => {
	try {
	    
	    showResults(m.getValue());

	} catch(e) {
	    
	    document.querySelector(".result").textContent = e;

	}});

let codeExamples = [{"id": "variables",
		     "title": "വാരിയബിൾസ് (variables)",
		     "code": `/* ആദ്യം വാരിയബിൾസ് ഉണ്ടാക്കാം. */

ആവട്ടെ ക, ച;


/* എന്നിട്ട് അവയുടെ മൂല്യങ്ങൾ നിർണയിക്കാം.
ഇവിടെ ക്ലിക്ക് ചെയ്തു നിങ്ങൾക്കിഷ്ടമുള്ളത് പോലെ
ഈ സംഖ്യകൾ മാറ്റി നോക്കാം. */

ക = 2, ച = 4;


/* പിന്നെ അവ തമ്മിൽ കൂട്ടാം.
ഈ പ്രവർത്തിയുടെ റിസൾട്ട് കീഴേ
കാണാവുന്നതാണ്. */

ക + ച;`},
		    {"id": "functions",
		     "title": "ഫങ്ങ്ഷൻസ് (functions)",
		     "code":
                     `/* ഫങ്ങ്ഷൻസ് ഉണ്ടാകുന്നത് എങ്ങനെയെന്ന് നോക്കാം.
ഒരു സംഖ്യയുടെ വർഗ്ഗം എന്നാൽ ആ സംഖ്യ കൊണ്ട് അതിനെ
തന്നെ ഗുണിച്ചത്. */

പ്രയോഗം വർഗ്ഗം(സംഖ്യ) {
  
  മടക്കം സംഖ്യ * സംഖ്യ;
  
}

/* ഇങ്ങനെ ഉണ്ടാക്കിയ ഫങ്ങ്ഷനെ ഇപ്രകാരം വിളിക്കാം. */

വർഗ്ഗം(വർഗ്ഗം(4));`},
		    {"id": "conditionals",
		     "title": "നിബന്ധനകൾ (conditionals)",
		     "code": `ആവട്ടെ കിട്ടിയാൽ = ശരി;

ആണെങ്കിൽ(കിട്ടിയാൽ) "ഊട്ടി";
അല്ലെങ്കിൽ "ചട്ടി";`},
		    {"id": "squaresum",
		     "title": "വർഗ്ഗങ്ങളുടെ തുക (Sum of squares)",
		     "code":`/* ഇനി കുറച്ചു വികസിതമായ ഉദാഹരണം കാണാം.
സംഖ്യയുടെ വർഗ്ഗം: ആ സംഖ്യ കൊണ്ട് അതിനെ തന്നെ ഗുണിച്ചത് */

പ്രയോഗം വർഗ്ഗം(സംഖ്യ) {
  
  മടക്കം സംഖ്യ * സംഖ്യ;
  
}

/* രണ്ടു സംഖ്യകളുടെ വർഗ്ഗത്തിന്റെ ആകെ തുക */

പ്രയോഗം വർഗ്ഗത്തുക(ഒരു_സംഖ്യ, മറ്റൊരു_സംഖ്യ) {
  
  മടക്കം വർഗ്ഗം(ഒരു_സംഖ്യ) + വർഗ്ഗം(മറ്റൊരു_സംഖ്യ);
  
}

വർഗ്ഗത്തുക(3,4);`},
		    {"id": "currying",
		     "title": "കറിവെക്കൽ (currying)",
		     "code": `/* പ്രോഗ്രാമിങ്ങിലെ ആശയമായ കറി എങ്ങനെ പ്രയോഗിക്കാമെന്നു നോക്കാം */

പ്രയോഗം ഹരണം_കറി(വിഭേദനി) {
  
  മടക്കം പ്രയോഗം(സംഖ്യ) {
    
    മടക്കം സംഖ്യ/വിഭേദനി;
  
  }
}

ആവട്ടെ പാതി = ഹരണം_കറി(2);

പാതി(48);`},
		    {"id": "objects",
		     "title": "മുകുന്ദേട്ടാ സുമിത്ര വിളിക്കുന്നു (objects)",
		     "code":
		     `ആവട്ടെ മുകുന്ദൻ = {
പേര്: "മുകുന്ദൻ",
വിളിപ്പേര്: "മുകുന്ദേട്ടാ",
വിളി: (വ്യക്തി) => {
    മടക്കം വ്യക്തി.വിളിപ്പേര് + " മുകുന്ദൻ വിളിക്കുന്നു"; 
}};

ആവട്ടെ സുമിത്ര = {
പേര്: "സുമിത്ര",
വിളിപ്പേര്: "സുമിത്രേച്ചി",
വിളി: (വ്യക്തി) => {
    മടക്കം വ്യക്തി.വിളിപ്പേര് + " സുമിത്ര വിളിക്കുന്നു";
}};

സുമിത്ര.വിളി(മുകുന്ദൻ);`}];

    let samples = Array.from(document.querySelectorAll(".sample-programs li a"));

    const setItem = (selection) => {

	let selectedId = selection.dataset.id;

	selection.classList.add("selected");

	m.setValue(codeExamples.find(({id}) => { return id == selectedId}).code);
	
    };

    samples.map(x => {

	x.addEventListener("click", evnt => {

	    samples.map(x => x.classList = "");

	    setItem(evnt.target);

	});
	
    });

    setItem(samples[0]);

})();
