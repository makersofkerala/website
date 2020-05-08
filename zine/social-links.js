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

padding: 0.5rem 0;
list-style: none;
display: flex;
flex-flow: row;
flex-wrap: wrap;
justify-content: space-between;
min-width: 300px;

}

li {


}

li:first-child {
padding: 0;
}

a {
color: inherit;
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
