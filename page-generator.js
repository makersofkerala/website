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


const genPages = async () => {
    
    try {
	
    let events = await client.query(q.Map(q.Paginate(q.Match(q.Index("all_maker_events"))), q.Lambda("x", q.Select(["data"], q.Get(q.Var("x"))))));

	await genEventHomePage({upcoming: events.data});

	genEventPages(events.data);

    } catch(err) {

	console.log(err);

    }

};

genPages();

/*

const genEventIndex = () => [];

const genAllEvents = () => [];

genEventIndex(events);

genAllEvents(events);

for(let evt of events) {

    genEventPage(events);

}
*/
