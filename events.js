import { doc, render } from "./zs.js";
import { formatPageName } from "./utils/url.js";
import { daysRemaining, formatDate } from "./utils/date.js";


const squareCard = ({cover, url="#", title, venue, description}) =>
      ["a.square-event-card", {href: "/events/" + formatPageName(title)},
       ["img", {src: cover, alt: "Image for " + title }],
       ["div.event-details",
	["header", ["h2.title", title]],
	["p.venue", venue],
	["p.description", description]]];

const smallEventCard = ({title, cover, venue, startDate, endDate, startTime, endTime}) =>
      ["a.small-event-card", {href: "/events/" + formatPageName(title)},
       ["img", {src: cover, alt: "Image for " + title}],
       ["div.event-details",
	["header", ["h2.title", title]],
	["p.venue", venue],
	["time.date", formatDate(startDate)],
	startTime ? ["time", startTime + " - " + endTime] : "",
	["p.remaining-time", daysRemaining(startDate) + " days more"]]];

const eventCountLabel = events => {

    let length = events.length;

    return length == 1 ? "1 Event" : length + " events";
    
};

const thisWeeksEvents = events => ["section#this-weeks-events",
				   ["header", ["h2", "This Week"], ["p", eventCountLabel(events)]],
				 ...(events.length === 0 ? [["p.no-events", "No events this week"]] :
				     events.map(e => smallEventCard(e)))];

const todaysEventsView = (events) => ["section#todays-events",
				      ["header", ["h2", "Today"], ["p", eventCountLabel(events)]],
				      events.length === 0 ? ["p.no-events", "No events today"] :
				      ["div.square-cards", ...events.map(e => squareCard(e))]];

const upcomingEventView = (e) => smallEventCard(e);

const upcomingEvents = (events) => ["section#upcoming-events",
				    ["header", ["h2", "Upcoming"], ["a.see-all-button", {href: "/all-events.html"}, "See all events"]],
				    ...events.map(e => upcomingEventView(e))];

const missingEvent = ["div#add-an-event", ["p", "Missing an event?"],
		      ["a", {href: "https://twitter.com/intent/tweet/?text=@makersofkerala"}, "Let us know on Twitter"]];

const head = [["meta",{"charset":"utf-8"}],
	      ["meta",{"name":"viewport","content":"initial-scale=1"}],
	      ["meta",{"name":"description","content":"Curated stream of maker events happening all over Kerala."}],
	      ["meta",{"name":"og:title","content":"Makers of Kerala: Maker Events"}],
	      ["meta",{"name":"og:description","content":"Curated stream of maker events happening all over Kerala"}],
	      ["meta",{"property":"og:site_name","content":"Makers of Kerala: Maker Events"}],
	      ["meta",{"property":"og:url","content":"https://makers-of-kerala.now.sh/events"}],
	      ["meta",{"name":"og:type","content":"website"}],
	      ["link",{"href":"https://fonts.googleapis.com/css?family=Work+Sans:400,500,700|IBM+Plex+Mono:400,400i&display=swap","rel":"stylesheet"}], ["title","Makers of Kerala: Maker Events"], ["link",{"href":"/main.css","type":"text/css","rel":"stylesheet"}]]

const body = ({today = [], thisWeek = [], upcoming = []}) => [["header",{"id":"main-header"},["div",{"id":"branding"},["img",{"src":"/makers-of-kerala-logo.svg","alt":"Makers of Kerala Logo"}],["h1","Makers ",["em","of"],["strong","Kerala"]]],["p","Uniting makers all across Kerala. Stay in the loop, follow us on ",["a",{"href":"https://twitter.com/makersofkerala"},"Twitter"]," and ",["a",{"href":"https://instagram.com/makersofkerala"},"Instagram"]]], ["nav",["ul",["li",["a",{"class":"blog-link","href":"/"},["img",{"src":"/blog.svg","alt":"Blog Icon"}],["p","Blog"]]],["li",["a",{"class":"events-link","href":"/events/"},["img",{"src":"/events.svg","alt":"Events Icon"}],["p","Events"]]]]], ["article",{"id":"events"}, ["div#events-page", ["div#next-events", todaysEventsView(today), thisWeeksEvents(thisWeek)], missingEvent, upcomingEvents(upcoming)]], ["footer", ["div", {"id":"logo-with-copyright"},["img",{"src":"/makers-of-kerala-logo-light.svg","alt":"Makers of Kerala logo light variant"}], ["p","© Makers of Kerala 2020"]], ["ul", ["li",["a",{"href":"#"},"Blog"]],["li",["a",{"href":"#coming-soon"},"Events"]]]], ["script",{"type":"module","src":"events.js"}]]

const page = (events) => doc({head, body: body(events)}); 

export { body, page }
