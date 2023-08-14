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
param namePrefix string = 'bex-event-4-'

resource accounts 'Microsoft.CognitiveServices/accounts@2022-03-01' = [for location in locations: {
  name: '${namePrefix}${location}'
  location: location
  kind: 'OpenAI'
  sku: {
    name: sku
  }
  properties: {
    customSubDomainName: '${namePrefix}${location}'
  }
}]

@batchSize(1)
resource deployment1 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = [for (_, i) in locations: {
  parent: accounts[i]
  name: 'gpt-35-turbo'
  dependsOn: [
    accounts[i] // This ensures the corresponding deployment2 won't start until the corresponding deployment1 is complete
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

@batchSize(1)
resource deployment2 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = [for (_, i) in locations: {
  parent: accounts[i]
  name: 'gpt-35-turbo-2'
  dependsOn: [
    deployment1[i] // This ensures the corresponding deployment2 won't start until the corresponding deployment1 is complete
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


output endpoints array = [for (_, i) in locations: accounts[i].properties.endpoint]
output keys array =  [for (_, i) in locations: accounts[i].listKeys()] 
