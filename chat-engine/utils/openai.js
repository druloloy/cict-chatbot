const {OpenAI} = require('openai');
function getOpenAIApiInstance(apiKey){
    const openai = new OpenAI(apiKey);
    return openai;
}
module.exports = {
    getOpenAIApiInstance
}