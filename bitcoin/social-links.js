class SocialLinks extends HTMLElement {

    constructor() {

	super();

	var shadow = this.attachShadow({mode: "open"});

	const temp = document.createElement("template");

	temp.innerHTML = `<style>

* {
margin: 0;
padding: 0;
}

ul {

list-style: none;
display: flex;
flex-flow: row;
flex-wrap: wrap;

}

li {

padding: 0 0.5rem;

}

li:first-child {
padding: 0;
}

a {
color: white;
}

</style>

<ul>
<li><a href="https://twitter.com/makersofkerala">Twitter</a></li>
<li><a href="https://facebook.com/makersofkerala">Facebook</a></li>
<li><a href="https://instagram.com/makersofkerala">Instagram</a></li>
<li><a href="https://t.me/makersofkerala">Telegram</a></li>
</ul>

`;

	this.shadowRoot.appendChild(temp.content.cloneNode(true));
	
    }

}

export { SocialLinks };
