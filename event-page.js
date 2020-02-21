import { render } from "./z.js";

const eventPage = ({title, image, url, fees, description, venue, date, time, hashtags = [], social = []}) =>
      ["div.event",
       ["header#main",
	["img", {src: image, alt: "Image for " + title }],
	["div.title-and-button",
	 ["div.title",
	  ["h2", ["em", (fees == 0 ? "Free" : "Paid")], title],
	  ["div.remaining-time", "3 days to go"]],
	 ["a.book-tickets", {href: url}, "Book Tickets"]]],
	["div.event-details",

	 ["div.item",
	  ["h3", "Date"],
	 ["div.value", date]],

	 ["div.item",
	  ["h3", "Time"],
	  ["div.value", time]],

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

const event = {image: "innocentwow.png", title: "BeachHack 2020", venue: "Kozhicode", description: "Hack at the beach and enjoy the ride.", date: "2 February, 2020", time: "9pm - 4pm", hashtags: ["beach", "hackathon"], social: ["twitter", "facebook", "instagram"]};

       render("#event-page", eventPage(event));
