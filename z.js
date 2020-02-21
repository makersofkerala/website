import * as f from './fun.js';

/* Checks */

const isTextNode = n => (typeof n == "string" || typeof n == "number" || n == null);

const areAttrs = attrs => f.isObj(attrs);

const isTag = tag => typeof tag == "string" && tag.length > 0;

const isNode = node => f.isArr(node) && isTag(f.head(node)) && (node[0] && (f.isObj(node[0]) || f.isArr(node[0]) || isTextNode(node[0])));

/* Accessors */

const getAttr = (n, key) => {

    let {attrs} = normalizeNode(n);

    return attrs[key];
    
};

/* Helpers */

const $ = x => document.querySelector(x);

const $all = (x) => document.querySelectorAll(x);

const node$ = (node,x) => node.querySelector(x);

const node$all = (node,x) => node.querySelectorAll(x);

const clearChildren = el => {

    while(el.hasChildNodes()) el.removeChild(el.lastChild);

};

/* Normalization */

const processTag = (tag) => {

    let attrs = {};

    let idStart = tag.indexOf("#"), id = null;

    if(idStart > 0) {
	
	let idEnd = tag.indexOf(".", idStart);

	if(idEnd < 0) idEnd = tag.length;

	id = tag.slice(idStart + 1, idEnd);

	tag = tag.slice(0, idStart) + tag.slice(idEnd);

    }

    let [parsed_tag, ...classes] = tag.split(".");

    Object.assign(attrs, id && {id}, (classes.length > 0) && {class: classes.join(" ")});

    return [parsed_tag, attrs || {}];
    
};

const normalizeNode = (zNode) => {

    if(zNode == null || f.isEmpty(zNode)) return {tag: "textNode", attrs: {}, contents: [""]};

    if(isTextNode(zNode)) return {tag: "textNode", attrs: {}, contents: [zNode.toString()]};

    try {
	
	let [tag, ...contents] = zNode;

	if(typeof tag == "string") {

	    let attrs = {};

	    if(areAttrs(contents[0])) {

		attrs = contents[0];

		contents = contents.slice(1);
		
	    }

	    const [parsedTag, parsedAttrs] = processTag(tag);

	    const newAttrs = f.merge(attrs, parsedAttrs);

	    return {tag: parsedTag, attrs: newAttrs, contents};

	} else  {

	    console.log("Please provide a node with a proper tag: " + JSON.stringify(zNode));

	}

    } catch (e) {
	
	throw Error("Cannot normalize: " + JSON.stringify(zNode) + " " + e.toString());
    }
    
};

const walk = (tree, {node, text , contents, combiner}) => {

    const nodeResult = node(tree); 

    if(nodeResult.tag == "textNode") return text(nodeResult);

    else {
	
	return combiner(nodeResult, {contents: nodeResult.contents.map(c => contents(c))});
	
    }
    
};

const normalize = tree => f.treeFold(normalizeNode(tree), {
    node: tree => tree,
    children: ({subtree}) => subtree.contents,
    walker: (fn, n, c) => ({contents: n.tag == "textNode" ? c : f.map(normalize, c)}),
    folder: (n, c) => n ? f.merge(n, c) : null});

/* Denormalization */

const parseAttrs = attrs => {

    let attrsArr = attrs.length > 0 ? attrs.split(" ").filter(n => n.trim(" ").length > 0) : [];

    let attrsMap = attrsArr.map(attrs => { let [ k, v ] = attrs.split("="); return {[k]: v.replace(/'/g, "").replace(/"/g, "")} }).reduce((i, n) => f.merge(i, n), {});

    return attrsMap;
    
};

/* Entities */
const isDoctype = s => s.startsWith("<!doctype");

const isComment = s => s.startsWith("<!--");

const splitBetween = (s, start, end) => {

    const startIdxEnd = s.indexOf(start) + start.length;

    const endIdxStart = s.indexOf(end, startIdxEnd);

    const endIdxEnd = endIdxStart + end.length;

    if(endIdxStart == -1 || endIdxEnd == -1) throw Error("Couldn't split string with " + start + " and " + end);
    
    const contents = s.slice(startIdxEnd, endIdxStart);

    const rest = s.slice(endIdxEnd);

    return {contents: [{tag: "textNode", contents: [contents]}], rest};

};

const readTextContent = s => {

    const nextNodeIdx = s.indexOf("<");

    return (nextNodeIdx != -1) ? {contents: [s.slice(0, nextNodeIdx)], rest: s.slice(nextNodeIdx)} : {contents: [s], rest: ""};
    
};

const findTag = (content) => {

    const selfClosingTagEnd = content.indexOf("/>");

    const closingTagEnd = content.indexOf(">");

    const endIdx = selfClosingTagEnd == -1 ? closingTagEnd : Math.min(closingTagEnd, selfClosingTagEnd);

    if(endIdx != -1) {

	// content stats with <tagName>
	const tagWithAttrs = content.slice(1, endIdx);

	const delimIndex = tagWithAttrs.indexOf(" ");

	const tagEndIdx = (delimIndex == -1) ? endIdx : delimIndex;

	const tag = tagWithAttrs.slice(0, tagEndIdx);

	const attrs = delimIndex == -1 ? "" : tagWithAttrs.slice(tagEndIdx);

	if(selfClosingTagEnd != -1) return { tag, attrs: parseAttrs(attrs), rest: content.slice(closingTagEnd +  1) };

	else return {tag, attrs: parseAttrs(attrs), rest: content.slice(closingTagEnd + 1)};
	
    } else throw Error("Couldn't find any tags");

};

const readContent = (htmlText, parentTag) => {

    let rest = htmlText;

    let result = [];

    while(rest.trim() !== "") {

	if(isEndTag(rest)) {

	    const endTag = `</${parentTag}>`;

	    const endTagIdx = rest.indexOf(endTag);

	    if(endTagIdx == -1) throw Error("Stray end tag found " + rest);

	    rest = rest.slice(endTagIdx + endTag.length).trim();

	    return {contents: result, rest};

	}
	    
	    let { tag, attrs = {}, contents: newContents, rest: restContents = ""  } = readNode(rest);

	    result.push({tag, attrs, contents: newContents});

	rest = restContents.trim();

    }

    if(parentTag) throw Error("Parent tag " + parentTag + " was not closed");

    return {contents: result, rest};

};

const isStartTag = (str) => !isEndTag(str) && str.startsWith(`<`);

const isEndTag = (str) => str.startsWith(`</`);

const readNode = (htmlText) => {
    
    const voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

    if(isDoctype(htmlText)) return f.merge({tag: "doctype"}, splitBetween(htmlText, "<!doctype", ">"));

    else if(isComment(htmlText)) return f.merge({tag: "comment"}, splitBetween(htmlText, "<!--", "-->"));

    else if(!isStartTag(htmlText)) return f.merge({tag: "textNode"}, readTextContent(htmlText));

    else if(isStartTag(htmlText)) {

	let {tag, attrs, rest} = findTag(htmlText);

	if(!voidTags.find(x => tag == x)) return f.merge({tag, attrs}, readContent(rest, tag));

	else return {tag, attrs, contents: [], rest};

    } else throw Error("Unknown text to parse " + htmlText);

};

const parseHTML = htmlText => readContent(htmlText).contents;

const normalNodeToZ = ({tag, attrs, contents}) => {

    if(tag == "textNode") {

	return contents.join("");

    } else if(f.notEmpty(attrs)) {

	return [tag, attrs, ...contents];

    } else return [tag, ...contents];
    
};

const normalsToZ = tree => f.treeFold(tree, {node: tree => tree,
						children: ({subtree}) => typeof subtree == "string" ? [] : subtree.contents,
						folder: (n, c) => typeof n == "string" ? n : normalNodeToZ(f.merge(n, {contents: c}))});

const htmlToZ = (tree) =>  parseHTML(tree).map(a => normalsToZ(a));

const zToHTML = (zNode) => {};

const domToNormals = () => {};

const entityMap = tag => ({'&': '&amp;', '<': '&lt;', '>': '&gt;'})[tag] || tag;

const escapeHTML = str => str.replace(/[&<>]/g, entityMap);

const joinPair = (map = {}, join, delimiter, transform) => Object.entries(map).map(([k, v]) => transform ? transform(k,v,join) : k + join + v).join(delimiter);

const normalizeData = dataMap => f.kvmap((dk,dv) => ({["data-" + dk]: dv}), dataMap);

const escapeStr = (st) => (typeof st == "string") ? `"${st}"` : st;

const serializeStyle = s => joinPair(s, ":", ";");

const parseStyle = (k, v,join) => (v !== null && v !== false) ? ((k == "style") ? `${k}='${serializeStyle(v)}'` : k + join + escapeStr(v)) : "";

const attrsToStr = attrs => {

    const { data = {} } = attrs;

    const dataAttrs = normalizeData(data);

    const attrsMap = f.merge(dataAttrs, f.dissoc(attrs, "data"));

    return joinPair(attrsMap, "=", " ", parseStyle);

};

const textJoin = ({tag, attrs, contents}) => {

    const voidTags = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];

    if(voidTags.find(x => tag == x)) return `<${tag}${attrs ? " " + attrs : ""}${contents} />`;
    
    return tag == "textNode" ? contents.join("") : `<${tag}${attrs ? " " + attrs : ""}>${contents.join("")}</${tag}>`;

}

const serializeNode = (normalizedNode) => {

    let {tag, attrs = {}, contents = []} = normalizedNode;

    if(!tag) throw Error("Please provide a tag");

    const newAttrs = attrsToStr(f.dissoc(attrs, "events"));

    return textJoin({tag, attrs: newAttrs, contents});

};

const serialize = (z) => f.treeFold(normalizeNode(z), {
    node: tree => tree,
    children: ({subtree}) => subtree.contents,
    walker: (fn, n, c) => ({contents: n.tag == "textNode" ? c : f.map(serialize, c)}),
    folder: (n, c) => serializeNode(f.merge(n,c)) });

/* DOM Operations */

const setAttrs = (el,attrs = {}) => f.kvmap((k,v) => {

    if(k == "style") el.setAttribute(k, serializeStyle(v));

    else if(k == "data") f.kvmap((dk, dv) => el.setAttribute("data-" + dk,dv), v);

    else { if(v !== null  && v !== false) el.setAttribute(k,v); }

}, attrs);

const transition = (state, currentTransition, transitions, event, changes = []) => {

    transitions.lastTransition = Date.now();

    let [action, path, payload] = currentTransition;

    payload = typeof payload === "function" ? payload(event, {state, path}) : payload;

    let op = transitions[action];

    if(op) {
	
	let result = op({state, path, payload});

	changes.push(path);

	if(result instanceof Array) {

	    transition(state, result, transitions, event, changes);

	} else {
	    
	    transitions.depChanges = changes;
	}
	
    } else {

	console.warn("Action " + action + " is not defined.");

    }

    // TODO: What is the advantage of making each state operation yield a new state?
    // TODO: Keep the history of the transitions may be?
    // state = op({state, payload});

};

const attachEvents = (el, events = {}, {state, transitions}) => {
    
return f.kvmap((k,v) => el.addEventListener(k, e => transition(state, v, transitions, e)), events);

}

const normalsToDOM = (nNode, {state, renderer = normalsToDOM, transitions} = {}) => {

    let {key, tag, attrs, contents} = nNode;

    if(tag == "textNode") return document.createTextNode(contents.join(""));

    const el = document.createElement(tag);

    if(attrs) setAttrs(el, f.dissoc(attrs, "events"));

    attachEvents(el, attrs.events || {}, {state, transitions});

    contents.forEach(child => el.appendChild(renderer(child, {state, renderer, transitions})));

    return el;

};

const nodeToDOM = (nNode, state, transitions) => {
    
    let {key, tag, attrs, contents} = nNode;

    if(tag == "textNode") return document.createTextNode(contents.join(""));

    const el = document.createElement(tag);

    if(attrs) setAttrs(el, f.dissoc(attrs, "events"));

    attachEvents(el, attrs.events || {}, state, transitions);

    return el;

};

const zToDOM = (z, state) => {

    return f.treeFold(z, {node: tree => normalizeNode(tree),
			  children: ({pnode}) => pnode.tag == "textNode" ? [] : pnode.contents,
			  walker: (fn, n, c) => c,
			  folder: (n, c) => {
			      
			      let node = nodeToDOM(n);

			      let children = f.map(zToDOM, c);

			      children.forEach(c => node.appendChild(c));

			      return node;

			  }});

};

const build = async (zNode, state, {renderer = normalize} = {}) => {
    
    if(typeof zNode === "function") zNode = await zNode(state);

    if(isNode(zNode)) {
	
	return renderer(zNode, state);

    } else {

	console.log("Please provide a valid node to render. Provided: " + zNode);
	
    }

};

/* DOM Ops */

const updateNode = async (domNode, diff, state, domBuilder) => {

    let {add, sub} = diff;

    let parentNode = domNode.parentNode;

    if(!f.isEmpty(add) && !f.isEmpty(sub)) {
	
	if(parentNode.tagName == "TEXTAREA") {

	    parentNode.value = add.contents[0];
	    
	} else {

	    parentNode.replaceChild(domBuilder(add, state), domNode);

	}

    } else if(!f.isEmpty(add)) domNode.appendChild(domBuilder(add, state));

    else if(!f.isEmpty(sub)) {

	parentNode.removeChild(domNode);

    }

};

const setNestedAttrs = (node, attr, vals) => f.kvmap((k,{add, sub}) => {

    if(sub) node[attr][k] = "";

    if(add) node[attr][k] = add;

}, vals);

const setAttrDiffs = (node, attr, vals,  {state, prevView, transitions}) => {

    if(attr == "value") {

	let {add = ""} = vals;

	if(add) node.value = add;

    } else if(attr == "style") {

	setNestedAttrs(node, "style", vals);
	
    } else if(attr == "data") {

	setNestedAttrs(node, "dataset", vals);
	
    } else if(attr === "events") {
	
	f.kvmap((k,v) => {

	    let {sub, add} = v;

	    if(f.eq(sub, add)) {
		
	    } else {
		
	    if(add) attachEvents(node, {[k]:add}, {state, transitions});

	    }

	}, vals);
	
    } else {

	let {add, sub} = vals;

	if(sub) node.removeAttribute(attr);

	if(add) node.setAttribute(attr, add);
	
    };
    
};

const changeAttrs = (domNode, diff, {state, prevView, transitions}) => 
      f.kvmap((k,diffs) => setAttrDiffs(domNode, k, diffs, {state, prevView, transitions}), diff || {});

const changeContents = (domNode, diffs, {state, prevView, renderer, transitions}) => {

    let array = Array.from(domNode.childNodes);

    diffs.map((diff, i) => {

	renderDiff((array[i]) || domNode, diff, {state, prevView: prevView && prevView[i], renderer, transitions});

    });
};


const renderDiff = async (domNode, diff, {state, prevView, renderer, transitions}) => {

    if(diff && !diff.eq) {

	let {node = {}, attrs = {}, contents = []} = diff;

	if(!f.isEmpty(node) && (node["add"] || node["sub"])) {

	    await updateNode(domNode, node, state, renderer);

	} else {

	    changeAttrs(domNode, attrs, {state, prevView: prevView.attrs, transitions});

	    changeContents(domNode, contents, {state, prevView: prevView.contents, renderer, transitions});

	};

    }
    
};

/* Return type is: [{type: "node" | "attrs" | "content", diff: [diffs..]}] */
/* Content is [Node] */

const diffContent = (content1, content2, {showEq = true}, depChanges) => {
    
    let results = f.map((x,y) => diff(x,y, {showEq}, depChanges), ...f.normalizeArrs(content1, content2));

    return f.isAny(x => x != null, results) ? results : null;

};

const diffEvents = (e1, e2) => {

    const diffTransition = (a, b) => {
	
	let delta = f.diff(a, b);

	return f.isEvery(x => x === null || x.eq != null, delta) ? {eq: a} : {sub: a, add: b};

    };

    let result = f.kvmap((k, v) => {

	let diff = v instanceof Array ? diffTransition(v, e2[k]) : f.diff(v, e2[k]);
	
	return !diff.eq ? {[k]: diff} : {};

    }, e1);

    return result;

    
};

const diffNodes = (node1, node2, {showEq = true} = {}, depChanges) => {
    
    const {tag: tag1, attrs: attrs1, contents: contents1} = node1;

    const {tag: tag2, attrs: attrs2, contents: contents2} = node2;

    if(tag1 == "textNode" && tag2 == "textNode") {

	if(contents1[0] !== contents2[0]) {

	    return {node: {"sub": node1, "add": node2}};

	} else {

	    return null;

	}

    };

    if(tag1 !== tag2) return {node: {"sub": node1, "add": node2}};

    else {

	const events1 = attrs1.events || {};

	const newAttrs1 = f.dissoc(attrs1, "events");

	const events2 = attrs2.events || {};

	const newAttrs2 = f.dissoc(attrs2, "events");

	let attrs = f.diff(newAttrs1, newAttrs2, {showEq: false}) || {};

	attrs = f.isAny(([k,v]) => !f.isEmpty(v), Object.entries(attrs)) ? attrs : {};

	let events = diffEvents(events1, events2);

	if(!f.isEmpty(events)) attrs.events = events;

	let contents = diffContent(contents1, contents2, {showEq}, depChanges) || [];

	contents = f.isAny(x => x !== null && !x["eq"], contents) ? contents : [];

	if(f.isEmpty(attrs)  && f.isEmpty(contents)) return {eq: node1};

	else return f.notEmpty(f.merge({...(f.isEmpty(attrs) ? {} : {attrs}), ...(f.isEmpty(contents) ? {}: {contents})}));

    }
};

/* TODO: Return only the entities which has add and sub in them */
const diff = (node1, node2, {showEq = true} = {}, depChanges) => {

    if(!node1 && !node2) return null;

    if(!node1 || !node2) return {node: f.diff(node1, node2, {showEq})};

    else if(f.isObj(node1) && f.isObj(node2)) {

	if(node1.attrs.deps === false && node2.attrs.deps === false) return null;

	if(node1.attrs.deps && node2.attrs.deps) {

	    const allDeps = node2.attrs.deps;

	    if(allDeps.filter(item => depChanges.find(dep => dep === item) != null).length > 0) {

		return diffNodes(node1, node2, {showEq}, depChanges);

	    }

	    else return null;

	} else {

	    return diffNodes(node1, node2, {showEq}, depChanges);

	}

    } else {

	throw Error("Unknown Items Passed: " + JSON.stringify(node1) + JSON.stringify(node2));
	
    };

};

const init = (parentNode, nTree, {state,  transitions, renderer}) => {

    clearChildren(parentNode);

    const DOM = normalsToDOM(nTree, {state, transitions, renderer});

    parentNode.appendChild(DOM);

};

const render = async (parentNode, view, {state = {}, transitions = {}, renderer = normalsToDOM, prevView} = {}) => {

    if(typeof parentNode == "string") { parentNode = $(parentNode); };

    let newView = null;

    if(prevView) {
	
	if(transitions.lastTransition >= transitions.lastRender) {

	    newView = await build(view, state);

	    const delta = diff(prevView, newView, {showEq: true}, transitions.depChanges || []);

	    await renderDiff(parentNode.firstChild, delta, {state, prevView, renderer, transitions});

            transitions.lastRender = Date.now();

	}

    } else {

	newView = await build(view, state);

	init(parentNode, newView, {state, transitions, renderer});

        transitions.lastRender = Date.now();

        transitions.lastTransition = Date.now();

    }

	requestAnimationFrame(() => render(parentNode, view, {state, transitions, renderer, prevView: newView || prevView}));

};

const doc = (head = "", body = "") => {

    if(!body) {

	body = head;

	head = "";

    }

    return "<!doctype html>" + serialize(["html", ["head", ...head], ["body", ...body]]);

};

const css = link => serialize(["link", {rel: "stylesheet", type: "text/css", href: link}]);

const nodejsZ = {serialize, doc, css, isNode};

if(typeof module !== "undefined" && module.exports) module.exports = nodejsZ;

export {$, $all, node$, node$all, doc, clearChildren, setAttrs, serialize, render, css, diff, normalize, normalizeNode, htmlToZ, parseHTML, transition };
