## Introduction

This is the starter code for a workshop built for students looking to learn more about how large language models are integrated into applications programmatically. It leverages the OpenAI SDK for Python and GPT-3.5. The workshop and manuals are intended for participants of all programming skill levels, from no experience to advanced. However, some Python experience will increase the likelihood of participants completing the exercises without heavy guidance.

**This is the starter code for the workshop, it does not include completed solutions for the exercises.**

There are two manuals included in this repo. They are intended to be distributed to the participants of the workshop.

1. **setup-manual.pdf** - For the participants to setup their environment locally or on Codespaces.
2. **workshop-manual.pdf** - For the participants to follow along with the workshop.

Keep in mind the current manuals are intended for use with Azure OpenAI, but can be easily modified to work with OpenAI directly.

## Workshop overview

There are four exercises in this lab, each one being a Python API students have to complete. A deployed version of the workshop can be found at https://gray-beach-052df4810.3.azurestaticapps.net. Keep in mind that the deployed version has the completed code, so all exercises are available and functional.

1. (POST /exercise1) Send a single message to GPT
   ![image](https://github.com/ralphr123/bex-workshop-sol/assets/29685125/68762092-cb31-4f8d-9c4e-6af631de38e1)
2. (POST /exercise2) Maintain a conversation history with GPT
   ![image](https://github.com/ralphr123/bex-workshop-sol/assets/29685125/d80bf9e8-16f0-41eb-a814-5fff6d365349)
3. (POST /exercise3) Send a system prompt to GPT before a conversation.
   ![image](https://github.com/ralphr123/bex-workshop-sol/assets/29685125/6692d283-bc19-44c6-ae06-4db07989af78)
4. (GET /exercise4) Develop a prompt to get GPT to translate maze codes into readable instructions
   ![image](https://github.com/ralphr123/bex-workshop-sol/assets/29685125/391f964f-5def-4f4a-b2c6-2ee84553f62e)

Every time an exercise page is opened, students will have a test area in the center, a Run tests button on the bottom right, and a Back button on the top left.

![image](https://github.com/ralphr123/bex-workshop-sol/assets/29685125/87f83a6a-bd4f-4f6e-a39f-ee9d8a8fa882)

**Back button**: Takes students back to the home page
**Test area**: Test Python code by interacting with the test area.
**Run tests button**: Once students are ready to verify their code, they click on _Run tests_. It will light up green if the backend implementation is correct, and the exercise is completed. Otherwise students can retry as many times as they’d like.

Once students successfully complete an exercise, they can go back to the home page and start the next one whenever they’re ready.

![image](https://github.com/ralphr123/python-openai-workshop-sol/assets/29685125/756ff130-c2c1-426c-9451-b68e0fcbacb8)

## Workshop implementation

If you are a workshop organizer and are trying to apply this starter code to your own event, you will need to create your own OpenAI resources and encrypt their keys into .env1.gpg files using the GPG command line tool. You will need to fork this repo and update the /env folder with your own encrypted .env files.

The Python starter code expects three keys to be set:

1. OPENAI_API_KEY: Your OpenAI API key
2. OPENAI_API_BASE: The base URL for the OpenAI API
3. OPENAI_API_TYPE (optional): The source of the OpenAI API (e.g. "Azure")

The following command will encrypt your .env file into a .env.gpg file. You will need to include the passphrase for your students as part of the startup commands in the setup manual (see setup-manual.pdf).

```bash
gpg --output .env${N}.gpg --cipher-algo AES256 --symmetric .env
```

If there are many students in your workshop, it is highly recommended to use multiple OpenAI endpoints to avoid rate limiting. You can do this by:

1. On Azure: creating multiple Azure OpenAI resources across multiple Azure subscriptions, regions, and model deployments. The /azure-deploy folder has a shell script and Bicep template for automating this.
2. On OpenAI: creating multiple OpenAI accounts, or by creating multiple organizations within the same account.

You can then create multiple .env files and encrypt them into .env1.gpg, .env2.gpg, etc. inside of the /env folder. The setup manual should give the correct command for students that will decrypt the correct env file for them.

If there are any issues with or questions about the setup, please reach out to Ralph Rouhana (ralph.rouhana@gmail.com).

## Installation overview

The manual contains more detailed instructions for participants to run this code on Codespaces (easier) and locally (more involved).

As a quick overview, to be able to run this app locally, you will need both Docker and Git installed on your machine.

#### Mac with intel chip

1. **Docker:** [link](https://desktop.docker.com/mac/main/amd64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-mac-amd64)
2. **Git:** If not preinstalled, running `git --version` in the command line will guide you through installing it.

#### Mac with M1/M2 chip

1. **Docker:** [link](https://desktop.docker.com/mac/main/arm64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-mac-arm64)
2. **Git:** If not preinstalled, running `git --version` in the command line will guide you through installing it.

#### Windows

1. **Docker:** [link](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe)
2. **Git:** [link](https://github.com/git-for-windows/git/releases/download/v2.41.0.windows.1/Git-2.41.0-32-bit.exe)

## Quick start

1. **Clone the app:** Run `git clone https://github.com/ralphr123/bam-workshop && cd bam-workshop`
2. **Run the app:** In your project directory root, run `export P=<password> N=<integer> && docker-compose up`
3. **Stop the app:** CTRL + C in the terminal window where the app is running
