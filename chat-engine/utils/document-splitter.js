const fs = require('fs');

async function loadDocument(document_path){
    const file_data = fs.readFileSync(document_path, 'utf8');
    const sliced_data = file_data.split('---').map((item) => item.trim());
    
    return sliced_data;
}

module.exports = {
    loadDocument
};