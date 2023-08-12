# No __pycache__ folder in edit directory to prevent confusion
import sys; sys.dont_write_bytecode = True

# To wait for 2 seconds before restarting server
import time

# Load environment variables
from dotenv import load_dotenv; load_dotenv()

# Flask is used to accept HTTP requests
from flask import Flask, request

# To generate random strings
from uuid import uuid4

# To generate random numbers
from random import randint

# Import exercise modules
from _EDIT_THESE_FILES.exercise1 import sendMessage as Exercise1__sendMessage
from _EDIT_THESE_FILES.exercise2 import (
    addAIMessage as Exercise2__addAIMessage, 
    addUserMessage as Exercise2__addUserMessage, 
    sendMessage as Exercise2__sendMessage, 
    history as Exercise2__history
)
from _EDIT_THESE_FILES.exercise3 import (
    addSystemMessage as Exercise3__addSystemMessage,
    addAIMessage as Exercise3__addAIMessage, 
    addUserMessage as Exercise3__addUserMessage, 
    sendMessage as Exercise3__sendMessage, 
    getChatMessages as Exercise3__getChatMessages,
    history as Exercise3__history
)
from _EDIT_THESE_FILES.exercise4 import system_msg as Exercise4__system_msg

# Import OpenAI Python SDK to allow us to make requests to GPT
import openai

# Import os to fetch environment variables
import os

# Set the environment variables for OpenAI
# We prompt the students do this in their code too, but we don't want them blocking on this
openai.api_type = 'azure'
openai.api_version = '2023-05-15'
openai.api_base = os.getenv('OPENAI_API_BASE')
openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)

# Print error to console
def eprint(*args, **kwargs):
    print("ERROR: ", *args, file=sys.stderr, flush=True, **kwargs)

# Allow frontend origin to make requests
@app.after_request
def afterRequest(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = '*'
    return response

# EXERCISE 1

@app.route('/exercise1', methods=['POST'])
def exercise1():
    try:
        # Get request body
        data = request.get_json()
        message = data.get('message')

        if message == None:
            raise Exception('No message provided in request body.')

        # Initialize exercise function
        res = Exercise1__sendMessage(message)

        if (not isinstance(res, str)):
            raise Exception("Response is not a string. Recieved: ", res)

        return { 'response': res }
    except Exception as e:
        eprint(f"Error running exercise 1: {e}")
        return { 'success': False, 'error': str(e) }

@app.route('/exercise1/run-tests')
def exercise1Tests():
    try:
        # Generate a random ID
        randId = str(uuid4())

        # Send the ID to GPT using exercise function
        res = Exercise1__sendMessage(f'Hello! Repeat this back to be: {randId}')

        if (not isinstance(res, str)):
            raise Exception("Response is not a string. Recieved: ", res)

        # If the ID is not found in the response, then the function did not work. 
        if (not randId in res):
            raise Exception("Incorrect response recieved: ", res)

        return { 'success': True  }
    except Exception as e:
        eprint(f"Failed exercise 1 tests: {e}")
        return { 'success': False, 'error': str(e) }

# EXERCISE 2
    
@app.route('/exercise2', methods=['POST'])
def exercise2():
    try:
        # Clear chat history
        Exercise2__history.clear()

        # Get request body
        data = request.get_json()
        messages = data.get('messages')

        if messages == None:
            raise Exception('No message provided in request body.')
        
        # Load chat history
        for message in messages[:-1]:
            if (message['role'] == 'assistant'):
                Exercise2__addAIMessage(message['content'])
            if (message['role'] == 'user'):
                Exercise2__addUserMessage(message['content'])

        # Send latest user message to GPT using exercise class
        res = Exercise2__sendMessage(messages[-1].get('content'))

        if (not isinstance(res, str)):
            raise Exception("Response is not a string. Recieved: ", res)

        return { 'messages': Exercise2__history }
    except Exception as e:
        eprint(f"Error running exercise 2: {e}")
        return { 'success': False, 'error': str(e) }

@app.route('/exercise2/run-tests')
def exercise2Tests():
    try:
        # Clear chat history
        Exercise2__history.clear()

        # Generate random ID
        randId = str(uuid4())

        # Send the ID to GPT in the first message
        res1 = Exercise2__sendMessage(f'Hello! Remember this code and respond with just "Remembered": {randId}')

        if (not isinstance(res1, str)):
            raise Exception("Response is not a string. Recieved: ", res1)

        # Ask for the ID again in the second message
        res2 = Exercise2__sendMessage('What was the code?')

        # If the history was correctly set up, the id should be in the second response
        if (not randId in res2):
            raise Exception("Incorrect response recieved: ", res2)

        return { 'success': True  }
    except Exception as e:
        eprint(f"Failed exercise 2 tests: {e}")
        return { 'success': False, 'error': str(e) }

# EXERCISE 3

@app.route('/exercise3', methods=['POST'])
def exercise3():
    try:
        # Clear chat history
        Exercise3__history.clear()

        # Get request body
        data = request.get_json()
        system_msg = data.get('systemMessage')
        messages = data.get('messages')

        if system_msg == None or messages == None:
            raise Exception('No message provided in request body.')

        Exercise3__addSystemMessage(system_msg)

        # Load chat history
        for message in messages[:-1]:
            if (message['role'] == 'assistant'):
                Exercise3__addAIMessage(message['content'])
            if (message['role'] == 'user'):
                Exercise3__addUserMessage(message['content'])

        # Send latest user message
        res = Exercise3__sendMessage(messages[-1].get('content'))

        if (not isinstance(res, str)):
            raise Exception("Response is not a string. Recieved: ", res)

        # Return only chat messages (not including the system message)
        return { 'messages': Exercise3__getChatMessages() }
    except Exception as e:
        eprint(f"Error running exercise 3: {e}")
        return { 'success': False, 'error': str(e) }
    
@app.route('/exercise3/run-tests')
def exercise3Tests():
    try:
        # Clear chat history
        Exercise3__history.clear()

        # Generate a random ID
        randId = str(uuid4())

        # Declare a system message that prompts GPT to include the ID in each response
        system_msg = f"You are a droid, and you end off every message with -{randId}"

        # Initialize exercise class instance with the custom system message
        Exercise3__addSystemMessage(system_msg)
        res = Exercise3__sendMessage('Hello!')

        if (not isinstance(res, str)):
            raise Exception("Response is not a string. Recieved: ", res)

        # If the system message was implemented correctly, ID should be in response
        if (not randId in res):
            raise Exception("Incorrect response recieved: ", res)

        return { 'success': True  }
    except Exception as e:
        eprint(f"Failed exercise 3 tests: {e}")
        return { 'success': False, 'error': str(e) }
    
# EXERCISE 4

@app.route('/exercise4/<maze_code>')
def exercise4(maze_code: str):
    try:
        # Clear chat history
        Exercise3__history.clear()

        # Declare an exercise 3 instance with students' exercise 4 system message
        Exercise3__addSystemMessage(Exercise4__system_msg)

        # Send the maze code to GPT
        res = Exercise3__sendMessage(maze_code)

        if (not isinstance(res, str)):
            raise Exception("Response is not a string. Recieved: ", res)

        # Return GPT's response instructions, split by newline
        return { 'instructions': res.splitlines() }
    except Exception as e:
        eprint(f"Error running exercise 4: {e}")
        return { 'success': False, 'error': str(e) }
    
@app.route('/exercise4/run-tests')
def exercise4Tests():
    try:
        # Clear chat history
        Exercise3__history.clear()

        # Generate a random maze code
        maze_code = f'\\instr -R {randint(0, 4)} -U {randint(0, 2)} -L {randint(0, 5)}'

        # Declare an exercise 3 instance with students' exercise 4 system message
        Exercise3__addSystemMessage(Exercise4__system_msg)

        # Send the generated maze code to GPT
        res = Exercise3__sendMessage(maze_code)

        if (not isinstance(res, str)):
            raise Exception("Response is not a string. Recieved: ", res)
        
        # Split the instructions by newline
        instructions = res.splitlines()

        # Generate a maze code from the instructions in the response
        generated_maze_code = '\\instr'
        for instruction in instructions:
            split_instruction = instruction.split(' ')

            if not len(split_instruction) == 4:
                raise Exception(f"Malformed instructions, recieved: {instructions}")

            _, direction, steps, _ = split_instruction

            generated_maze_code += f" -{direction[0].upper()} {steps}"

        # Expect the maze code generated from instructions to equal the original one
        if not generated_maze_code == maze_code:
            raise Exception(f"Generated code: {generated_maze_code} does not match maze code: {maze_code}")
        
        return { 'success': True  }
    except Exception as e:
        eprint(f"Failed exercise 4 tests: {e}")
        return { 'success': False, 'error': str(e) }

# HELLO WORLD
@app.route('/')
def helloWorld():
    return "Hello world!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4200)
