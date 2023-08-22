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
        for (const result of results) {
            // console.log(`[${result.score}] ${result.item.metadata.text}`);
            callback(result);
        }
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