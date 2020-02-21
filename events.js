import { render } from "./z.js";

const squareCard = ({image, url="#", title, venue, description}) =>
      ["a.square-event-card", {href: "events/" + title},
       ["img", {src: image, alt: "Image for " + title }],
       ["div.event-details",
	["header", ["h2.title", title]],
	["p.venue", venue],
	["p.description", description]]];

const smallEventCard = ({title, url, image, venue, date}) =>
      ["a.small-event-card", {href: "events/" + title},
       ["img", {src: image, alt: "Image for " + title}],
       ["div.event-details",
	["header", ["h2.title", title]],
	["p.venue", venue],
	["time", date],
	["p.remaining-time", 3 + " days more"]]];

const thisWeeksEvents = evts => ["section#this-weeks-events",
				 ["header", ["h2", "This Week"]],
				 ...evts.map(e => smallEventCard(e))];

const events = {today: [{image: "innocentwow.png", title: "BeachHack 2020", venue: "Kozhicode", description: "Hack at the beach"}, {image: "innocentwow.png", title: "BeachHack 2020", venue: "Kozhicode", description: "Hack at the beach"}],
		upcoming:[{image: "a10wow.png", title: "BeachHack 2020", venue: "Thrissur, Kerala", description: "Kerala", date: "2 Feb, 2020"},
			  {image: "sankaradi2.png", title: "BeachHack 2020", venue: "Kozhicode", description: "Hack at the beach", date: "4 Feb 2020"}],
		thisWeek: [{image: "sankaradi1.png", title: "Space Apps Challenge", venue: "Thrissur", description: "NASA Space Apps challenge Thrissur Chapter", date: "Hack at the beach Feb 2020"}, {image: "sankaradi2.png", title: "BeachHack 2020", venue: "Kozhicode", description: "Hack at the beach", date: "4 Feb 2020"}]};

const todaysEventsView = (events) => ["section#todays-events",
				      ["header", ["h2", "Today"]],
				      ["div.square-cards", ...events.map(e => squareCard(e))]];

const upcomingEventView = (e) => smallEventCard(e);

const upcomingEvents = (events) => ["section#upcoming-events",
				    ["header", ["h2", "Upcoming"], ["a.see-all-button", {href: "/all-events.html"}, "See all events"]],
				    ...events.map(e => upcomingEventView(e))];

const missingEvent = ["div#add-an-event", ["p", "Missing an event?"],
		      ["a", {href: "https://twitter.com/intent/tweet/?text=@makersofkerala"}, "Let us know on Twitter"]];


const eventsPage = ({today, thisWeek, upcoming}) => ["div#events-page",
						     ["div#next-events",
						      todaysEventsView(today),
						      thisWeeksEvents(thisWeek)],
						     missingEvent, upcomingEvents(upcoming)];

render("#events", eventsPage(events));
