class Header extends HTMLElement {

    constructor() {

	super();

	var shadow = this.attachShadow({mode: "open"});

	const temp = document.createElement("template");

	temp.innerHTML = `<style>

* {
margin: 0;
padding: 0;
}

:host {
width: 100%;
}

header {
box-sizing: border-box;
width: 100%;
padding: 0 1rem;
font-size: 0.75rem;
display: flex;
flex-flow: row;
flex-wrap: wrap;
align-items: center;
justify-content: space-between;
color: inherit;
}

social-links {


font-size: 0.875rem;

}
</style>

<header part="container">
<h2>Makers of Kerala</h2>
<social-links></social-links>
</header>

`;

	this.shadowRoot.appendChild(temp.content.cloneNode(true));
	
    }

}

export { Header };
