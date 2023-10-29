import { IndexedDbName } from "./helper";

export const setItem = (StoreName, keyPath, data, callback) => {

    const request = indexedDB.open(IndexedDbName, 1);

    // Create the object store if it doesn't exist
    request.onupgradeneeded = () => {
        const db = request.result;
        const objectStore = db.createObjectStore(StoreName, { keyPath: keyPath });
    };
    // Add data to the store
    request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(StoreName, "readwrite");
        const objectStore = transaction.objectStore(StoreName);

        const addRequest = objectStore.add(data);

        addRequest.onsuccess = () => {
            // db.close()
            callback();
        };
    };

    // Retrieve data from the store
    // request.onsuccess = (event) => {
    //     const db = event.target.result;
    //     const transaction = db.transaction(storeName, "readonly");
    //     const objectStore = transaction.objectStore(storeName);

    //     const getRequest = objectStore.get(1);

    //     getRequest.onsuccess = () => {
    //         const data = getRequest.result;
    //         console.log(data); // { id: 1, name: "John Doe", age: 30 }
    //     };
    // }; 
}


export const getItem = (StoreName, keyPath, keyValue, callback) => {

    const request = indexedDB.open(IndexedDbName, 1);

    // Create the object store if it doesn't exist
    request.onupgradeneeded = () => {
        const db = request.result;
        const objectStore = db.createObjectStore(StoreName, { keyPath: keyPath });
    };


    // Retrieve data from the store
    request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(StoreName, "readonly");
        const objectStore = transaction.objectStore(StoreName);

        const getRequest = objectStore.get(keyValue);

        getRequest.onsuccess = () => {
            const data = getRequest.result;
            // db.close()
            if (data) callback({ state: true, data: data })
            else callback({ state: false })
        };
        getRequest.onerror = () => {
            // db.close()
            callback({ state: false })
        }
    };
}