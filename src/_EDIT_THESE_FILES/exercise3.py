# Load environment variables from .env
from dotenv import load_dotenv; load_dotenv()

# Typings are good practice to know what your code is producing
from typing import List

# OpenAI Python SDK to allow us to make requests to GPT
import openai

# Use this function to print to the console for debugging
def printToConsole(*args, sep=' ', end='\n'):
    print(*args, sep=sep, end=end, flush=True)

# ===========================
# === MODIFY THIS SECTION ===
# ===========================

class Chat:
	def __init__(self, system_msg: str = None):
		self.messages = []

		if (system_msg):
			self.addSystemMessage(system_msg)

	# Add a message of role "system" to the self.messages array
	def addSystemMessage(self, message: str) -> None:
		raise Exception("Exercise 3: Add system message not implemented.")

	# Add a message of role "user" to the self.messages array
	def addUserMessasge(self, message: str) -> None:
		# You can copy this from exercise 2
		raise Exception("Exercise 3: Add user message not implemented.")

	# Add a message of role "assistant" to the self.messages array
	def addAIMessasge(self, message: str) -> None:
		# You can copy this from exercise 2
		raise Exception("Exercise 3: Add assistant message not implemented.")

	# Send a message to GPT and return the response string
	def sendMessage(self, message: str) -> str:
		# You can copy this from exercise 2
		raise Exception("Exercise 3: Send message not implemented.")

	
	# Get all non-system messages from array
	def getChatMessages(self) -> List:
		raise Exception("Exercise 3: Get chat messages not implemented.")

		# Feel free you use any method you'd like to filter out the system message
		# Ex. loop, python filter function, subarrays, etc.

