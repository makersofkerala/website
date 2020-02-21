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

const attachEvents = (el, events = {}, {state, transitions}) => {
    
return f.kvmap((k,v) => el.addEventListener(k, e => transition(state, v, transitions, e)), events);

};

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

const init = (parentNode, nTree, {state,  transitions, renderer}) => {

    clearChildren(parentNode);

    const DOM = normalsToDOM(nTree, {state, transitions, renderer});

    parentNode.appendChild(DOM);

};

const render = async (parentNode, view, {state = {}, transitions = {}, renderer = normalsToDOM, prevView} = {}) => {

    if(typeof parentNode == "string") { parentNode = $(parentNode); };


    let newView = await build(view, state);

    init(parentNode, newView, {renderer});

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

export {$, $all, node$, node$all, doc, clearChildren, setAttrs, serialize, render, css, normalize, normalizeNode };
