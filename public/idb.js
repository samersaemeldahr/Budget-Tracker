let db;
const request = indexedDB.open('budget_tracker', 1);

// Upgrade database
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('transaction', { autoIncrement: true });
};