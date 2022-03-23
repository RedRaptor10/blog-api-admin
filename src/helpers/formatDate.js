const { DateTime } = require('luxon');

// Change date to readable format - Jan 01, 2022
const formatDate = (time) => {
    return DateTime.fromJSDate(new Date(time)).toLocaleString(DateTime.DATE_MED);
};

// Remove trailing 'Z' timezone from ISOString date (YYYY-MM-DDTmm:ss.sssZ)
const removeTimeZone = (ISOString) => {
    return ISOString.substring(0, ISOString.length - 1);
};

export { formatDate, removeTimeZone };