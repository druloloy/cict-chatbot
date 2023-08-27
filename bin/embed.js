const {embedder} = require('../chat-engine');

(async () => {
    try {
        await embedder();
        console.log('Embedding complete');
    } catch (error) {
        console.log(error);
    }
})();