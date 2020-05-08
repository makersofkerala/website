import { doc, render } from "./zs.js";
import { mainHeader } from "./commons.js";
import { formatPageName } from "./utils/url.js";

const head = [["meta",{"charset":"utf-8"}],
	      ["meta",{"name":"viewport","content":"initial-scale=1"}],
	      ["meta",{"name":"description","content":"Curated stream of maker events happening all over Kerala."}],
	      ["meta",{"name":"og:title","content":"Makers of Kerala: All Events"}],
	      ["meta",{"name":"og:description","content":"Curated stream of maker events happening all over Kerala"}],
	      ["meta",{"property":"og:site_name","content":"Makers of Kerala: All Events"}],
	      ["meta",{"property":"og:url","content":"https://makers-of-kerala.now.sh/all-events"}],
	      ["meta",{"name":"og:type","content":"website"}],
	      ["link",{"href":"https://fonts.googleapis.com/css?family=Work+Sans:400,500,700|IBM+Plex+Mono:400,400i&display=swap","rel":"stylesheet"}], ["title","Makers of Kerala: Maker Events"], ["link",{"href":"/main.css","type":"text/css","rel":"stylesheet"}]];

const body = ({today = [], thisWeek = [], upcoming = []}) => [mainHeader, mainNav, ["article",{"id":"all-events"}, ["div#all-events-page", "All Events"], mainFooter];

const page = (events) => doc({head, body: body(events)}); 

export { body, page }
