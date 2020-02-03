import faunadb, { query as q } from 'faunadb';

const client = new faunadb.Client({secret: process.env.FAUNADB_SECRET});

const parseReferral = (r) => {
    
    const referrer = {tw: "Twitter", tl: "Telegram", ig: "Instagram", fb: "Facebook", wa: "Whatsapp", e: "Email"}[r];

    return referrer || "organic";

};

module.exports = async (req, res) => {

    let details = {};

    try {
	
	console.log(req.body);

	details = JSON.parse(req.body);

	details.ref = parseReferral(details.ref);

    } catch (err) {

	res.status(400).json({error: "Parse Error: " + err.message});
	
    }

    let q = faunadb.query;

    let page = details.page;

    const audienceCollection = 'audience';

    let createAudience = client.query(
	q.Create(
	    q.Collection(audienceCollection),
	    { data: details}));

    createAudience.then(resp => console.log(resp));

    const documentId = '256357672554594827';

    try {
	
    let incrementView = await client.query(
	q.Let({viewcount: q.Add(q.Select(["data", page],q.Get(q.Ref(q.Collection("counts"), documentId)), 0), 1)},
	      q.Update(q.Ref(q.Collection("counts"),documentId), {data: {[page]: q.Var("viewcount")}})))

    } catch (err) {

	res.status(400).json({error: "Count Error" + err.message});
	
    };

    let count = 0;

    try {
	
	count = await client.query(q.Select(["data", page],q.Get(q.Ref(q.Collection("counts"), documentId)), 0));

    } catch (err) {

	res.status(400).json({error: "Count Error" + err.message});
	
    }

    res.status(200).json({data: {count}});

};
