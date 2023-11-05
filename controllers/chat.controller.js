const {
    query
} = require('../chat-engine');
const prompts = require('../utils/prompts.json');

exports.chat = async (req, res, next) => {
    try {
        // get req
        const {
            q
        } = req.query;

        if (!q) return res.status(400).json({
            message: 'q is required'
        });

        const k = 3;

        // process req
        const result = await query(q, k);

        // generate suggestions
        const suggestions = generateSuggestions();

        // send res
        res.status(200).json({
            message: result,
            suggestions
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Sorry, I am not available right now. Please try again later.",
            error: error.message
        });
    }
}

function generateSuggestions() {
    const suggestions = [];
    const keys = Object.keys(prompts);
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * keys.length);
        const key = keys[randomIndex];

        // select random value
        const value = prompts[key][Math.floor(Math.random() * prompts[key].length)];

        // if existing in suggestions, skip
        if (suggestions.find(suggestion => suggestion.tag === key)) continue;

        suggestions.push({
            tag: key,
            value
        });
    }

    return suggestions;
}