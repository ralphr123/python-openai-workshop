# Load environment variables from .env
from dotenv import load_dotenv; load_dotenv()

# OpenAI Python SDK to allow us to make requests to GPT
import openai

# ===========================
# === MODIFY THIS SECTION ===
# ===========================

# List to store message history
history = []

# Add a message of role "user" to the history array
def addUserMessage(message: str):
	raise NotImplementedError('addUserMessage() has not been implemented yet') # Remove this line when you start working on this function

# Add a message of role "assistant" to the history array
def addAIMessage(message: str):
	raise NotImplementedError('addAIMessage() has not been implemented yet') # Remove this line when you start working on this function

# Send a message to GPT and return the response string
def sendMessage(message: str) -> str:
	raise NotImplementedError('sendMessage() has not been implemented yet') # Remove this line when you start working on this function