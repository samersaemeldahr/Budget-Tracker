let db;
const request = indexedDB.open('budget_tracker', 1);

// Upgrade database
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('transaction', { autoIncrement: true });
};

// Successful connection
request.onsuccess = function (event) {
    db = event.target.result;
};

// In case of an error
request.onerror = function (event) {
    console.log(event.target.errorCode);
}

// Save record to store
function saveRecord(record) {
    const transaction = db.transaction(['transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('transaction')
    transactionObjectStore.add(record);
};
