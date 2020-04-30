class SiteHeader extends HTMLElement {
    
    constructor() {

	super();

	let template = document.createElement("template");

	template.innerHTML = `
<style>
  * {
  margin: 0;
  padding: 0;
  }

  section {
  color: white;
  background: #6E5BE5;
  padding: 2rem;
  }

:host:not(:defined) {
  /* Pre-style, give layout, replicate app-drawer's eventual styles, etc. */
  display: inline-block;
  height: 100vh;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

header {
display: flex;
box-sizing: border-box;
width: 100%;
align-items: center;
justify-content: space-between;
flex-wrap: wrap;
justify-items: center;
padding-bottom: 1rem;
}

header #titles {

display: flex;
flex-flow: row;
padding: 1rem 0;
align-items: center;
flex-wrap: wrap;
justify-items: center;

}

#share {
display: flex;
align-items: center;
justify-content: space-between;
flex-wrap;
width: 100%;
box-sizing: border-box;
}

header #titles img {
max-width: 100px;
margin-right: 1rem;

}

#titles h2 {
max-width: 200px;
}

header a {

display: block;
background: linear-gradient(180deg, rgba(244, 245, 249, 0.12) 0%, rgba(110, 91, 229, 0.12) 100%), #FFFFFF;
box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
padding: 0.75rem 1.5rem;
color: #6E5BE5;
border-radius: 150px;
text-shadow: 0px -2px 2px #FFFFFF;
text-decoration: none;
font-weight: bold;

}

</style>

<section>

<!--
    <nav>
      <p>Choose Language:</p>
      <ul>
	<li class="active">English</li>
	<li>Malayalam</li>
      </ul>
    </nav>
-->

  <header>
    <div id="titles">
      <img src="bitcoin-logo.png" alt="Bitcoin logo" />
      <h2>Illustrated Guide to Bitcoin</h2>
    </div>
    <a href="https://t.me/joinchat/HO7ZHRaOlOs1HLKc4G2_6Q">Join us on Telegram</a>
  </header>

    <div id="share">
      <p>Share this on:</p>
      <social-links></social-links>
    </div>
  
<!--
    <nav>
      <ul>
	<li><a href="guide.html">Guide</a></li>
	<li><a href="journal.html">Journal</a></li>
	<li><a href="about.html">About</a></li>
      </ul>
    </nav>

-->

</section>
</template>`;

	this.attachShadow({mode: "open"});

	this.shadowRoot.appendChild(template.content.cloneNode(true));

    }

}

export { SiteHeader };
