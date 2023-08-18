#!/bin/bash

# Set required variables, these have to be changed to your own values
export MY_RESOURCE_GROUP_NAME=python-gpt-workshop
export MY_LOCATION=eastus
export SUBSCRIPTION_ID=12345678-1234-1234-1234-123456789012

# The following steps require the AzureCLI: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli

# Login to Azure account
az login

# Set the default subscription to use for the deployment
az account set --subscription $SUBSCRIPTION_ID

# Create the resource group to deploy the resources into
az group create --name $MY_RESOURCE_GROUP_NAME --location $MY_LOCATION

# Deploy the resources and output the keys to the deployed resources
az deployment group create --resource-group $MY_RESOURCE_GROUP_NAME --template-file main.bicep --query "properties.outputs"