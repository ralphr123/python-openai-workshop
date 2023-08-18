param locations array = [
  'eastus'
  'eastus2'
  'canadaeast'
  'uksouth'
  'northcentralus'
  'francecentral'
  'australiaeast'
]

param sku string = 's0'

// Change this to a unique name for your deployment
param deploymentName string = 'python-openai-workshop-'

// Deploy the Azure OpenAI resources
resource accounts 'Microsoft.CognitiveServices/accounts@2022-03-01' = [for location in locations: {
  name: '${deploymentName}${location}'
  location: location
  kind: 'OpenAI'
  sku: {
    name: sku
  }
  properties: {
    customSubDomainName: '${deploymentName}${location}'
  }
}]

// Create the 16k context OpenAI model deployments inside their respective Azure OpenAI resources
@batchSize(1)
resource deployment1 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = [for (_, i) in locations: {
  parent: accounts[i]
  name: 'gpt-35-turbo'
  dependsOn: [
    accounts[i]
  ]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-35-turbo-16k'
      version: '0613'
    }
  }
  sku: {
    name: 'Standard'
    capacity: 240
  }
}]

// Create the 4k context OpenAI model deployments inside their respective Azure OpenAI resources
@batchSize(1)
resource deployment2 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = [for (_, i) in locations: {
  parent: accounts[i]
  name: 'gpt-35-turbo-2'
  dependsOn: [
    deployment1[i]
  ]
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-35-turbo'
      version: '0613'
    }
  }
  sku: {
    name: 'Standard'
    capacity: 240
  }
}]

// Output the OpenAI resource endpoints and keys
output endpoints array = [for (_, i) in locations: accounts[i].properties.endpoint]
output keys array =  [for (_, i) in locations: accounts[i].listKeys()] 
