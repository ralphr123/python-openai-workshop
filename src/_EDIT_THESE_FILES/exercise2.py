# Load environment variables from .env
from dotenv import load_dotenv; load_dotenv()

# OpenAI Python SDK to allow us to make requests to GPT
import openai

# Use this function to print to the console for debugging
def printToConsole(*args, sep=' ', end='\n'):
    print(*args, sep=sep, end=end, flush=True)

# ===========================
# === MODIFY THIS SECTION ===
# ===========================

class Chat:
	def __init__(self):
		self.messages = []

	# Add a message of role "user" to the self.messages array
	def addUserMessasge(self, message: str) -> None:
		raise Exception("Exercise 2: Add user message not implemented.")

	# Add a message of role "assistant" to the self.messages array
	def addAIMessasge(self, message: str) -> None:
		raise Exception("Exercise 2: Add assistant message not implemented.")

	# Send a message to GPT and return the response string
	def sendMessage(self, message: str) -> str:
		raise Exception("Exercise 2: Send message not implemented.")
	
		# 1. Use the function you completed to add the message as a user message
		# 2. Call Azure to send the message to GPT (similar to exercise 1)
		# 3. Store the result in a variable
		# 4. Use the function you completed to add the response as an AI message
		# 5. Return the response string
