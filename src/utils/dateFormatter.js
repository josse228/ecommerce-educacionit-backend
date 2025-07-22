//funcion que formatea la fecha de esto: "yyyy-mm-dd" a formato ISO 8601.
function formatDateToUTC(dateReceived){
    return new Date(`${dateReceived}T00:00:00.000Z`)
}

module.exports = { 
    formatDateToUTC
};