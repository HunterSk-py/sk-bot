require("dotenv").config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(express.json())
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 5000;


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);



app.use(express.static('public'));
app.set('view engine', 'ejs');

const chitChatFilePath = path.join(__dirname, 'chit_chat.json');

async function getBotResponse(userMessage) {
  const conversationData = JSON.parse(fs.readFileSync(chitChatFilePath));
  for (const conversation of conversationData.conversations) {
    if (userMessage.toLowerCase().includes(conversation.user.toLowerCase())) {
      return conversation.bot;
    }
  }

  // If no specific response is found, use the OpenAI API to generate a response

  return getOpenAIResponse(userMessage);
}

async function getOpenAIResponse(userMessage) {
  try {
    if (userMessage == null) {
      throw new Error("Uh oh, no prompt was provided");
    }
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: userMessage,
      max_tokens: 600, // Control the length of the response
      temperature: 0.7,
    });
    const completion = response.data.choices[0].text;
    console.log(completion);
    return completion;
  } catch (error) {
    console.log(error.message);
  }
}

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/bot-response', async (req, res) => {
  const userMessage = req.query.message;
  try {
    const botResponse = await getBotResponse(userMessage);
    res.json({ botResponse });
  } catch (error) {
    console.error('Error while getting bot response:', error);
    res.status(500).json({ botResponse: "I'm sorry, there was an error while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Chatbot app listening at http://localhost:${port}`);
});
