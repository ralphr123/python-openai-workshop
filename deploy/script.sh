#!/bin/bash

export MY_RESOURCE_GROUP_NAME=bex-event
export MY_LOCATION=eastus
export SUBSCRIPTION_ID=d180949e-b427-4f03-8561-23192883b9f9

az login
az account set --subscription $SUBSCRIPTION_ID

az group create --name $MY_RESOURCE_GROUP_NAME --location $MY_LOCATION

az deployment group create --resource-group $MY_RESOURCE_GROUP_NAME --template-file main.bicep --query "properties.outputs"