# Load environment variables from .env
from dotenv import load_dotenv; load_dotenv()

# Fetch environment variables from .env
import os

# OpenAI Python SDK to allow us to make requests to GPT
import openai

# Use this function to print to the console for debugging
def printToConsole(*args, sep=' ', end='\n'):
    print(*args, sep=sep, end=end, flush=True)

# ===========================
# Welcome! This is the part of the file where you'll be writing your code.
# Feel free to add to it and experiment, but altering the starter code is not recommended.
# Make sure to read the comments carefully!
# Don't hesitate to ask for help if you're stuck. Happy coding!
# ===========================

# ===========================
# === MODIFY THIS SECTION ===
# ===========================

# Set OpenAI environment variables as shown in documenation
openai.api_type = '...'

# Call Azure to send the message to GPT and return the response string
def sendMessage(message: str) -> str:
    raise Exception("Exercise 1: send message incomplete.")
