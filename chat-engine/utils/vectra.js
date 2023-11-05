const {
    LocalIndex
} = require('vectra');

async function initVectra(path){
    const index = new LocalIndex(path);

    if (!await index.isIndexCreated()) {
        await index.createIndex();
    }

    return index;
}

async function addItem(index, vector, text){
    await index.insertItem({
        vector,
        metadata: { text }
    });
}

async function query(index, vector, k=3, callback){
    const results = await index.queryItems(vector, k);
    if (results.length > 0) {
        const responses = results.map(item => item.item.metadata.text);
        callback(responses);
    } else {
        // console.log(`No results found.`);
        throw new Error('No results found.');
    }
}


module.exports = {
    initVectra,
    addItem,
    query
}