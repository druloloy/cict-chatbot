const {OpenAIApi, Configuration} = require('openai');
function getOpenAIApiInstance(apiKey){
    const configuration = new Configuration({
        apiKey,
    });

    return new OpenAIApi(configuration);
}
module.exports = {
    getOpenAIApiInstance
}