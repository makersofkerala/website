import { doc, render } from "./z.js";
import { daysRemaining, formatDate } from "./utils/date.js";

const eventView = ({title, cover, url, fees, description, venue, startDate, time, hashtags = [], social = []}) =>
      ["div#event-page",
       ["header#main",
	cover ? ["img#cover", {src: cover, alt: "Image for " + title }] : ["div#cover.title-letter", title.split(" ").reduce((i,n) => i + (isNaN(parseInt(n)) ? n[0] : n), "")],
	["div.title-and-button",
	 ["div.title",
	  ["h2", ["em", (fees == 0 ? "Free" : "Paid")], title],
	  ["div.remaining-time", daysRemaining(startDate) + " days to go"]],
	 ["a.book-tickets", {href: url}, "Book Tickets"]]],
	["div.event-details",

	 ["div.item",
	  ["h3", "Date"],
	  ["div.value", formatDate(startDate)]],

	 ["div.item",
	  ["h3", "Time"],
	  ["div.value", time]],

	 ["div.item",
	  ["h3", "Fees"],
	  ["div.value", "₹ " + fees]],

	 ["div.item",
	  ["h3", "Venue"],
	  ["div.value", venue]]],

	 ["div.description",
	  ["p", description],

	  ["div.tags",
	   ["header", ["h2", "Tags"]],
	   ["ul", ...hashtags.map(tag => ["li", tag])]],

	  ["div.handles",
	   ["header", ["h2", "Handles"]],
	   ["ul.handles", ...social.map(handle => ["li", handle])]]]];

const page = (event) => {

    const head = [["meta",{"charset":"utf-8"}],["meta",{"name":"viewport","content":"initial-scale=1"}],["meta",{"name":"description","content":"Curated stream of maker events happening all over Kerala."}],["meta",{"name":"og:title","content":"Makers of Kerala: Maker Events"}],["meta",{"name":"og:description","content":"Curated stream of maker events\n\t\t\t\t happening all over Kerala"}],["meta",{"property":"og:site_name","content":"Makers of Kerala: Maker Events"}],["meta",{"property":"og:url","content":"https://makers-of-kerala.now.sh/events"}],["meta",{"name":"og:type","content":"website"}],["link",{"href":"https://fonts.googleapis.com/css?family=Work+Sans:400,500,700|IBM+Plex+Mono:400,400i&display=swap","rel":"stylesheet"}],["title","Makers of Kerala: Maker Event"],["link",{"href":"/main.css","type":"text/css","rel":"stylesheet"}]];

    const body = [["header",{"id":"main-header"},["div",{"id":"branding"},["img",{"src":"/makers-of-kerala-logo.svg","alt":"Makers of Kerala Logo"}],["h1","Makers ",["em","of"],["strong","Kerala"]]],["p","Uniting makers all across Kerala. Stay in the loop, follow us\n on ",["a",{"href":"https://twitter.com/makersofkerala"},"Twitter"],"\n and ",["a",{"href":"https://instagram.com/makersofkerala"},"Instagram"]]],["nav",["ul",["li",["a",{"class":"blog-link","href":"/"},["img",{"src":"/blog.svg","alt":"Blog Icon"}],["p","Blog"]]],["li",["a",{"class":"events-link","href":"/events/"},["img",{"src":"/events.svg","alt":"Events Icon"}],["p","Events"]]]]], eventView(event), ["footer",["div",{"id":"logo-with-copyright"},["img",{"src":"/makers-of-kerala-logo-light.svg","alt":"Makers of\n\tKerala logo light variant"}],["p","© Makers of Kerala 2020"]],["ul",["li",["a",{"href":"#"},"Blog"]],["li",["a",{"href":"#coming-soon"},"Events"]]]],["script",{"type":"module","src":"event-page.js"}]];

    return doc(head, body);

};


export { page };
