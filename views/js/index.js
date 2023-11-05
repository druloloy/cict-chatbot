// chatbot.js
export function initChatbot() {
    const chatbotButton = document.querySelector('.chatbot-button-frame');
    const chatbotWindow = document.querySelector('.window-frame');
    const chatbotCloseButton = document.querySelector('.header-frame button');

    chatbotButton.addEventListener('click', () => {
        chatbotWindow.classList.add('active');
        chatbotButton.style.display = 'none';
    });

    chatbotCloseButton.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
        chatbotButton.style.display = 'block';
    });

    window.addEventListener("DOMContentLoaded", () => {
        const form = document.querySelector(".input-form");
        form.addEventListener("submit", submitQuery);
        addChatBubble('bot', `Hey! Thanks for visiting. I'm Blitzle, your CICT Buddy. I can send you updates and provide information on basic queries about TCU via chat. How may I help you today?`);
        addSuggestionsBubble([{
            tag: 'Enrollment',
            value: 'How can I enroll?'
        }, {
            tag: 'Schedule',
            value: 'What is the schedule of enrollment?'
        }, {
            tag: 'Courses',
            value: 'What courses are offered?'
        }]);
    });

    async function submitQuery(e) {
        e.preventDefault();
        const queryInput = document.querySelector('.input-form input');
        const query = queryInput.value;
        if (query === '') return;

        setLoading(queryInput, true);

        addChatBubble('user', query);
        queryInput.value = '';

        const response = await fetch('/api/v1/chat?q=' + query);

        if (response.status >= 400) {
            const data = await response.json();
            const {
                message
            } = data;
            addChatBubble('bot', message);
            return;
        }

        if (response.status === 200) {
            const data = await response.json();
            const {
                message,
                suggestions
            } = data;
            addChatBubble('bot', message);
            addSuggestionsBubble(suggestions);
        }

        setLoading(queryInput, false);
    }

    function addSuggestionsBubble(suggestions) {
        const chatBubbleSuggestions = document.querySelector('.chat-bubble-suggestions');
        chatBubbleSuggestions.innerHTML = '';

        suggestions.forEach(suggestion => {
            const chatBubbleSuggestion = document.createElement('section');
            chatBubbleSuggestion.classList.add('chat-bubble-suggestion');
            chatBubbleSuggestion.setAttribute('role', 'button');
            chatBubbleSuggestion.setAttribute('data-value', suggestion.value);

            const chatBubbleSuggestionText = document.createElement('span');
            chatBubbleSuggestionText.classList.add('chat-bubble-suggestion-text');
            chatBubbleSuggestionText.setAttribute('role', 'text');
            chatBubbleSuggestionText.setAttribute('data-value', suggestion.value);
            chatBubbleSuggestionText.innerText = suggestion.tag;

            chatBubbleSuggestion.appendChild(chatBubbleSuggestionText);
            chatBubbleSuggestions.appendChild(chatBubbleSuggestion);

            chatBubbleSuggestion.addEventListener('click', (e) => {
                const queryInput = document.querySelector('.input-form input');
                queryInput.value = e.target.dataset.value;
                document.querySelector('.input-form button').click();
            });
        });
    }

    function addChatBubble(role, text) {
        const chatBubbleContainer = document.querySelector('.chat-bubble-container');
        const chatBubble = document.createElement('section');
        chatBubble.classList.add('chat-bubble');
        chatBubble.setAttribute('data-role', role);

        if (role === 'bot') {
            const chatBubbleIcon = document.createElement('section');
            chatBubbleIcon.classList.add('chat-bubble-icon');

            const chatBubbleIconImage = document.createElement('img');
            chatBubbleIconImage.src = "./images/icons8-circled-user-female-skin-type-5-48.png";
            chatBubbleIconImage.alt = "blitzle-icon";

            chatBubbleIcon.appendChild(chatBubbleIconImage);
            chatBubble.appendChild(chatBubbleIcon);
        }

        const chatBubbleContent = document.createElement('section');
        chatBubbleContent.classList.add('chat-content-bubble-text');

        const chatBubbleName = document.createElement('span');
        chatBubbleName.classList.add('chat-bubble-name');
        chatBubbleName.setAttribute('role', 'text');
        chatBubbleName.innerText = role === 'bot' ? 'Blitzle' : 'You';

        const chatBubbleText = document.createElement('section');
        chatBubbleText.classList.add('chat-bubble-text');
        chatBubbleText.innerHTML = marked.parse(text);

        chatBubbleContent.appendChild(chatBubbleName);
        chatBubbleContent.appendChild(chatBubbleText);
        chatBubble.appendChild(chatBubbleContent);

        chatBubbleContainer.appendChild(chatBubble);
        scrollToBottom();
    }

    function scrollToBottom() {
        const chatBubbleContainer = document.querySelector('.conversation-frame');
        chatBubbleContainer.scrollTop = chatBubbleContainer.scrollHeight;
    }

    function setLoading(input, isLoading){
        // disable input and show loading when status is loading
        input.disabled = isLoading;
        const loading = document.querySelector('.loading');
        const inputButton = document.querySelector('.input-form button');
        loading.classList.toggle('active', isLoading);
        inputButton.classList.toggle('inactive', isLoading);
    }
}