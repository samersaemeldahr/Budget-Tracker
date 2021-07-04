let db;
const request = window.indexedDB.open('budget_tracker', 1);

// Upgrade database
request.onupgradeneeded = function (event) {
    db = event.target.result;
    const store = db.createObjectStore('transaction', { autoIncrement: true });
    store.createIndex('transaction', 'transaction')
};

// Successful connection
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        checkDatabase();
    }
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

// Complete transaction
function checkDatabase() {
    db = request.result;
    const transaction = db.transaction(['transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('transaction');
    const getAll = transactionObjectStore.getAll();


    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response = response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    const transaction = db.transaction(['transaction', 'readwrite']);
                    const transactionObjectStore = transaction.objectStore('transaction');
                    transactionObjectStore.clear();
                    window.location.reload()
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
}

// window.addEventListener('online', checkDatabase);