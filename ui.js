import { $, render } from "./zs.js";

render("#app", ["div#view", ["header", ["h1", "മരം"],
			     ["p", "ഒരു വരം"]],	
		["div.code-and-schema",
		 ["textarea.code", `<html>
  <head></head>
  <div>
    <p>
      <span class="കേൾക്കുന്നില്ല">കമ്പിളി പൊതപ്പ്</span>
    </p>
  </div>
</html>`],
		 ["div.schema"]]]);


const parseTree = (val) => {

    let dom = new DOMParser();

    try {
	
    let doc = dom.parseFromString(val, "text/html");

	return doc.documentElement.childNodes;

    } catch(e) {

	return ["div", "Error " + e];
	
    }
    
}

const textNodeView = (node) => {

    let nodeContent = node.textContent.trim();

    if(nodeContent != "") {

	console.log(node.textContent);
	
	return ["div.text-node", "#text: " + `"${node.textContent}"`];

    } else return "";

}

const treeWalk = (node) => {

    if(node.nodeType === 3) return textNodeView(node);

    return ["details.node", {open: true}, ["summary", node.tagName.toLowerCase()], ...[...node.childNodes].map(n => treeWalk(n))];
    
};

const htmlBrowser = (val) => {

    const textVal = val.trim();

    if(textVal != "")
	
	return treeWalk({tagName: "html", childNodes: parseTree(val)});

    else
	return ["div", ""];


};

window.onload = () => {

    let nodes = htmlBrowser($(".code").value);

    render(".schema", ["div", nodes]);``
    
    $(".code").addEventListener("input", (e) => {

	let nodes = htmlBrowser(e.target.value);

	render(".schema", ["div", nodes]);``
	
    });

};
