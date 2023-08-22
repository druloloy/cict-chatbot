if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const path = require('path');
const splitter = require('../utils/document-splitter');
const {initVectra, addItem, query} = require('../utils/vectra');
const {getOpenAIApiInstance} = require('../utils/openai');

const openaikey = process.env.OPENAI_API_KEY;
const vectrapath = path.join(__dirname, 'store');

const openai = getOpenAIApiInstance(openaikey);

async function vectorizeText(text){
    const response = await openai.createEmbedding({
        'model': 'text-embedding-ada-002',
        'input': text,
    });

    return response.data.data[0].embedding;
}

module.exports = async function(){
    return new Promise(async (resolve, reject) => {
        try {
            const index = await initVectra(vectrapath);

            // add items
            const fileDataArray = await splitter.loadDocument(path.join(__dirname, 'knowledge-base.md'));

            for (const fileData of fileDataArray) {
                const vector = await vectorizeText(fileData);
                await addItem(index, vector, fileData);
            }

            return resolve(true);

        } catch (error) {
            return reject(error);
        }
    });
}