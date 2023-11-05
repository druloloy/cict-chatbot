if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const {query, initVectra} = require('../utils/vectra');
const {getOpenAIApiInstance} = require('../utils/openai');
const path = require('path');
const { createResponse } = require('./prompt');

const openaikey = process.env.OPENAI_API_KEY;
const openai = getOpenAIApiInstance(openaikey);

async function vectorizeText(text){
    const response = await openai.embeddings.create({
        'model': 'text-embedding-ada-002',
        'input': text,
    });
    return response.data[0].embedding;
}

module.exports = async function (q, k){
    if(!q) return;

    return new Promise(async (resolve, reject) => {
        try {
            const index = await initVectra(path.join(__dirname, '../store'));
            const vector = await vectorizeText(q);

            await query(
                    index, 
                    vector, 
                    k, 
                    async (result) => {
                        // resolve(result.item.metadata.text);
                        await createResponse(q, result, openai)
                        .then((response) => resolve(response))
                        .catch((error) => reject(error));                     
                    });
        } catch (error) {
            reject(error);
        }
    });
}