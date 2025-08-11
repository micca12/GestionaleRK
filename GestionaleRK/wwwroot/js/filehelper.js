window.downloadFile = function(fileName, content, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
};

window.readFileAsText = function(fileInputElement) {
    return new Promise((resolve, reject) => {
        const file = fileInputElement.files[0];
        if (!file) {
            reject('Nessun file selezionato');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.onerror = function() {
            reject('Errore nella lettura del file');
        };
        reader.readAsText(file);
    });
};

window.clearFileInput = function(fileInputElement) {
    fileInputElement.value = '';
};