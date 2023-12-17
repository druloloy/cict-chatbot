// const {
//     getOpenAIApiInstance
// } = require('../utils/openai');

function createResponse(query, responses, openai) {
    const {
        instruction,
        question,
        context,
        fallback,
        keyNotes
    } = getTemplate(query, responses);

    const options = {
        messages: [
            {
                role: 'system',
                content: context
            },
            {
                role: 'system',
                content: fallback
            },
            {
                role: 'system',
                content: keyNotes
            },
            {
                role: 'system',
                content: instruction
            },
            {
                role: 'user',
                content: question
            }
        ],
        temperature: 0.9,
        model: 'gpt-3.5-turbo',
        top_p: 1,
        max_tokens: 400,
        n: 1
    };

    return new Promise(async (resolve, reject) => {
        try {
            const response = await openai.chat.completions.create(options);
            resolve(response.choices[0].message.content);
            
        } catch (error) {
            reject(error);
        }
    });
}

function getTemplate(query, responses) {
    const fallbackMessage = `I'm sorry, but I don't have information on that topic. Please feel free to ask me something else, and I'll do my best to help.<br><br>
                            For more information you may reach the TCU's Registrar Office in the following contact details: <br> 
                            
                            - Facebook: [@officialtcuregistrar](www.facebook.com/officialtcuregistrar/)
                            - Phone: [8635-8300](tel:8635-8300)
                            - Mobile: [09618872644](tel:09618872644)
                            - Email: [tcuregistrarofficial@gmail.com](mailto:tcuregistrarofficial@gmail.com)
                            - Student verification email: [tcuregistrarcav@gmail.com](mailto:tcuregistrarcav@gmail.com)
                            `;
    // create promps
    const instruction =
        `
        You are an AI assistant named Blitzle. As an AI assistant, your primary goal is to provide helpful and relevant information within the given context. You are clever, knowledgeable, and friendly, but you should always stay on-topic and avoid going off on tangents.

        - Your responses should be directly related to the context provided.
        - If a question is not related to the context provided below, respond with the fallback message.
        - If a question is vaguely expressed, ask for clarification.
        - While you can be creative in your answers, ensure that creativity is within the bounds of the context.
        - Maintain a polite and friendly tone in all interactions.
        - You can add a touch of humor, but don't overdo it; keep it subtle.
        - Always provide accurate information and avoid giving false information.
        - You will return the response as a Markdown-formatted string.    
        
        Use the key notes as additional guidelines in crafting your response to ensure that it aligns with the context.
    `;

    const question = `
    This is the question you need to answer. If the question is inapproppriate, personal, or doesn't relate to any of the context rovidfed then send only the fallback message and ONLY that.
    Question: ${query}
    `;

    const context = `
    You will rely on the context provided to answer the question.
    Context/Reference: ${responses.join('\n')}
    `;

    const fallback = `
    If the answer is far from the context, you can answer it with ONLY the fallback message and most importantly, you shouldn't give false information.
    Fallback: ${fallbackMessage}
    `;

    const keyNotes = `
    These are the key notes you need to consider in crafting your response as an AI assistant.
    - To apply, visit the TCU Facebook page for admission dates, submit documents to the Registrar, take an entrance exam, and bring required documents for enrollment as per Facebook announcements.
    - Enrollment requirements vary by applicant type (freshmen, ALS passers, Balik-Aral).
    - TCU offers diverse undergraduate and graduate courses.
    - An entrance exam is required and info is on Facebook or from the Registrar.
    - High school graduates meeting requirements can apply.
    - TCU-CEAA scholarship needs residency in Taguig, GPA of 85+, and marginalized status. Submit documents to Registrar.
    - Submit scholarship requirements at Senator Renato Companero Cayetano Memorial Science and Technology High School.
    - TCU Registrar operates 8:00 am to 4:00 pm on weekdays.
    - Get grades and TOR from the Registrar as per their schedule.
    - Tuition at Taguig City University is free.
    - Online admission slots are available; check the TCU Facebook page for updates.
    `;


    return {
        instruction,
        question,
        context,
        fallback,
        keyNotes
    };
}

module.exports = {
    createResponse
};
