// public/script.js
const chatBody = document.getElementById('chat-body');
const userInput = document.getElementById('user-input');

function appendMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.textContent = message;
  chatBody.appendChild(messageElement);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotResponse(userMessage) {
  return fetch(`/api/bot-response?message=${encodeURIComponent(userMessage)}`)
    .then(response => response.json())
    .then(data => data.botResponse) // Extract the bot response from the data object
    .catch(error => {
      console.error('Error fetching bot response:', error);
      return "Open ai will send data.";
    });
}



async function sendMessage() {
  const message = userInput.value;
  if (message.trim() !== '') {
    appendMessage('user', message);

    try {
      const botResponse = await getBotResponse(message.toLowerCase());
      appendMessage('bot', botResponse);
    } catch (error) {
      console.error('Error while getting bot response:', error);
      appendMessage('bot', "I'm sorry, there was an error while processing your request.");
    }

    userInput.value = '';
  }
}

userInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
});
