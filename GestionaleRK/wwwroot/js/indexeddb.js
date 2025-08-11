window.indexedDbHelper = {
    db: null,
    dbName: '',
    storeName: '',

    generateGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    async initialize(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
        
        return new Promise((resolve, reject) => {
            // Use version 2 to force schema recreation
            const request = indexedDB.open(dbName, 2);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Delete old store if it exists
                if (db.objectStoreNames.contains(storeName)) {
                    db.deleteObjectStore(storeName);
                }
                
                // Create new store with correct keyPath
                const store = db.createObjectStore(storeName, { keyPath: 'Id' });
                store.createIndex('cognome', 'Cognome', { unique: false });
                store.createIndex('nome', 'Nome', { unique: false });
            };
        });
    },

    async getAllClients() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const clients = request.result || [];
                resolve(JSON.stringify(clients));
            };
            
            transaction.onerror = () => reject(transaction.error);
        });
    },

    async getClient(id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(id);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const client = request.result;
                resolve(client ? JSON.stringify(client) : '');
            };
            
            transaction.onerror = () => reject(transaction.error);
        });
    },

    async saveClient(clientJson) {
        try {
            const client = JSON.parse(clientJson);
            
            // Ensure we have an Id field
            if (!client.Id) {
                client.Id = this.generateGuid();
            }
            
            return new Promise((resolve, reject) => {
                if (!this.db) {
                    reject(new Error('Database not initialized'));
                    return;
                }
                
                const transaction = this.db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(client);
                
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve();
                
                transaction.onerror = () => reject(transaction.error);
            });
        } catch (error) {
            return Promise.reject(error);
        }
    },

    async deleteClient(id) {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'));
                return;
            }
            
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(id);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
            
            transaction.onerror = () => reject(transaction.error);
        });
    }
};