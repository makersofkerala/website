const formatDate = (dateStr) => {

    try {

	let date = new Date(dateStr);

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-IN', options)

    return formatter.format(date)

    } catch(err) {

	return "N/A";

    }

};

const daysRemaining = (date) => {

    const today = +new Date();
    const span = +new Date(date) - today;

    const dayDuration = 1000 * 60 * 60 * 24;

    return parseInt(span/dayDuration);
    
};

export { formatDate, daysRemaining };
