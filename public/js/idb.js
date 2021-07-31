let db;
const request = indexedDB.open('budget', 1);

// Upgrade database
request.onupgradeneeded = function (event) {
    const db = event.target.result;

    db.createObjectStore('new_transaction', { autoIncrement: true });
};

// Successful connection
request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        uploadTransaction();
    }
};

// In case of an error
request.onerror = function (event) {
    console.log(event.target.errorCode);
}

// Save record to store
function saveRecord(record) {
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const transactionObjectStore = transaction.objectStore('new_transaction')

    transactionObjectStore.add(record);
};

// Complete transaction
function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('new_transaction');
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

                    const transaction = db.transaction(['new_transaction', 'readwrite']);
                    const transactionObjectStore = transaction.objectStore('new_transaction');
                    transactionObjectStore.clear();
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }
}

window.addEventListener('online', uploadTransaction);