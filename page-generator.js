import { serialize } from "./z.js";
import { page as eventHomePage } from "./events.js";
import { page as eventPage } from "./event.js";
import fs from "fs";
import { formatPageName } from "./utils/url.js";

import faunadb from "faunadb";
let q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });


const saveFile = ({data, loc}) => {

    fs.writeFile(loc, data, "utf-8", (err) => {

	if(err) throw err;

	console.log("Saved file: " + loc);
	
    });
    
};

const genEventHomePage = (events) => {

    let data = serialize(eventHomePage(events));

    saveFile({data, loc: "events/index.html"});
    
};

const genEventPages = (events) => {

    for(let evt of events) {

	let data = serialize(eventPage(evt));

	saveFile({data, loc: "events/" + formatPageName(evt.title)});

    };
    
};

const dateToday = () => {
    
    const now = new Date();

    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getYear();

    return { day, month, year };

}


const getTodaysEvents = (events) => {

    const { startDate } = events;

    const { day, month, year } = dateToday();

    return events.filter(({startDate}) => {
	
	const evtDate = new Date(startDate);

	return day === evtDate.getDate() && month === evtDate.getMonth() && year === evtDate.getYear();

    });
    
};

const daysAfterToday = (days) => {

    const currentDate = new Date((new Date()).setHours(0,0,0,0));

    return currentDate.setDate(currentDate.getDate() + days);

};

const getThisWeeksEvent = (events) => {

    const tomorrow = daysAfterToday(1);

    const dayAfterThisWeek = daysAfterToday(8);

    return events.filter(({startDate}) => {

	let date = +new Date(startDate);

	return (date > tomorrow) && (date < dayAfterThisWeek);
	
    });
    
};

const getUpcomingEvents = (events) => {

    const dayAfterThisWeek = daysAfterToday(8);

    const dayAfterThisMonth = daysAfterToday(31);

    return events.filter(({startDate}) => {

	let date = +new Date(startDate);

	console.log(startDate, date, dayAfterThisMonth);

	return date > dayAfterThisWeek && date < dayAfterThisMonth;

    });
    
};

const marshallData = events => {

    const today = getTodaysEvents(events);
    const thisWeek = getThisWeeksEvent(events);
    const upcoming = getUpcomingEvents(events);

    return {today, thisWeek, upcoming};

};


const genPages = async () => {
    
    try {
	
	let {data: events} = await client.query(q.Map(q.Paginate(q.Match(q.Index("all_maker_events"))), q.Lambda("x", q.Select(["data"], q.Get(q.Var("x"))))));

	await genEventHomePage(marshallData(events));

	genEventPages(events);

    } catch(err) {

	console.log(err);

    }

};

genPages();

/*

const genEventIndex = () => [];

*/
