const getPage = () => window.location.pathname;

const getIP = async () => {

    let resp = await fetch("https://freegeoip.app/json/");
    let json = await resp.json();
    let {ip = "N/A", longitude, latitude, country_name} = json;
    return {ip, longitude, latitude, country_name};
    
};


const setCookie = (key,value,days=1) => {

    var expires = "";

    if (days) {

	const date = new Date();

	date.setTime(date.getTime() + (days*24*60*60*1000));

	expires = date.toUTCString();

    }

    document.cookie = key + "=" + (value || "")  + "; expires=" + expires + "; path=/";
};

const getCookie = (name) => {

    const nameVal = name;

    const entries = document.cookie.split(';');

    for(let id = 0; id < entries.length; id++) {

	let [entryName, value] = entries[id].split("=");

	if(entryName == nameVal) return value;
	
    }

    return null;

};

const parseOrigin = () => getCookie("origin");

const setOrigin = () => setCookie("origin", window.location.pathname, 365);

const readOrigin = () => {

    const origin = parseOrigin();

    if(!origin) {

	setOrigin();

	return window.location.pathname;

    } else {

	return origin;

    }

};

const readReferral = () => new URLSearchParams(window.location.search).get("r") || document.referrer;

const logSession = async () => {

    const page = getPage();

    const ip = await getIP();

    const origin = readOrigin();

    const referral = readReferral();

    const logData = {page, ...ip, origin, ref: referral, time: new Date().toISOString()};

    let resp = await fetch("/api/populate", {method: "post", body: JSON.stringify(logData)});

    let respJSON = await resp.json();

    console.log(respJSON);

    let count = respJSON.data.count;

    let views = document.querySelector("#distribution-count .counter");

    if(views) {

	views.textContent = count + "";

    }
    
};

const logClick = async (id) => {

    let link = document.querySelector(id);

    const ip = await getIP();

    if(!link) { console.error("DOM element doesn't exist", id); };

    link.addEventListener("click", e => {

	fetch("/.netlify/functions/clickstream", {method: "post", body: JSON.stringify({page: getPage(), linkId: id, time: new Date().toISOString(), ip})});
	
    })
}

logSession();

export { logClick };
