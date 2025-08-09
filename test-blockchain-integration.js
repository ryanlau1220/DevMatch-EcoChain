#!/usr/bin/env node

/**
 * 🚀 Blockchain Data Hub Integration Test Script
 * 
 * This script helps you test the integration of your blockchain data hub
 * with the deployed subgraph and smart contract.
 */

const SUBGRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/118239/ecochain-environmental-data/v0.0.4'
const CONTRACT_ADDRESS = '0x2CA22FCA74ABD51cCD166845a13E2064390605aC'

console.log('🌱 EcoChain Blockchain Data Hub Integration Test')
console.log('=' .repeat(60))

async function testSubgraphConnection() {
  console.log('\n🔍 Testing Subgraph Connection...')
  
  try {
    const query = `
      {
        environmentalDatas(first: 5, orderBy: timestamp, orderDirection: desc) {
          id
          sensorId
          timestamp
          temperature
          humidity
          airQuality
          location
          verified
        }
      }
    `

    const response = await fetch(SUBGRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    
    if (result.errors) {
      console.log('❌ GraphQL errors:', result.errors)
      return false
    }

    const data = result.data.environmentalDatas
    console.log(`✅ Subgraph connection successful!`)
    console.log(`📊 Found ${data.length} environmental data records`)
    
    if (data.length > 0) {
      console.log('\n📋 Sample Data:')
      const sample = data[0]
      console.log(`   ID: ${sample.id.slice(0, 20)}...`)
      console.log(`   Sensor: ${sample.sensorId.slice(0, 10)}...`)
      console.log(`   Temperature: ${(parseInt(sample.temperature) / 100).toFixed(1)}°C`)
      console.log(`   Humidity: ${(parseInt(sample.humidity) / 100).toFixed(1)}%`)
      console.log(`   AQI: ${sample.airQuality}`)
      console.log(`   Verified: ${sample.verified ? '✅ Yes' : '⏳ Pending'}`)
    }
    
    return true
  } catch (error) {
    console.log('❌ Subgraph connection failed:', error.message)
    return false
  }
}

async function testDataFreshness() {
  console.log('\n⏰ Testing Data Freshness...')
  
  try {
    const query = `
      {
        environmentalDatas(first: 1, orderBy: timestamp, orderDirection: desc) {
          timestamp
        }
      }
    `

    const response = await fetch(SUBGRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    const result = await response.json()
    const latestTimestamp = parseInt(result.data.environmentalDatas[0].timestamp)
    const now = Math.floor(Date.now() / 1000)
    const ageInMinutes = Math.floor((now - latestTimestamp) / 60)
    
    console.log(`✅ Latest data timestamp: ${new Date(latestTimestamp * 1000).toLocaleString()}`)
    console.log(`⏱️  Data age: ${ageInMinutes} minutes`)
    
    if (ageInMinutes < 10) {
      console.log('🟢 Data is fresh (less than 10 minutes old)')
    } else if (ageInMinutes < 60) {
      console.log('🟡 Data is recent (less than 1 hour old)')
    } else {
      console.log('🔴 Data is old (more than 1 hour old)')
    }
    
    return ageInMinutes < 60
  } catch (error) {
    console.log('❌ Data freshness test failed:', error.message)
    return false
  }
}

async function testContractEvents() {
  console.log('\n📡 Testing Contract Events...')
  
  try {
    const query = `
      {
        environmentalDatas(first: 10, orderBy: timestamp, orderDirection: desc) {
          sensorId
          timestamp
          verified
        }
      }
    `

    const response = await fetch(SUBGRAPH_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    const result = await response.json()
    const data = result.data.environmentalDatas
    
    // Group by sensor
    const sensorCounts = {}
    data.forEach(record => {
      const sensor = record.sensorId
      sensorCounts[sensor] = (sensorCounts[sensor] || 0) + 1
    })
    
    console.log(`✅ Found events from ${Object.keys(sensorCounts).length} sensors`)
    
    Object.entries(sensorCounts).forEach(([sensor, count]) => {
      console.log(`   Sensor ${sensor.slice(0, 10)}...: ${count} events`)
    })
    
    return true
  } catch (error) {
    console.log('❌ Contract events test failed:', error.message)
    return false
  }
}

async function runAllTests() {
  console.log('🚀 Starting Blockchain Data Hub Integration Tests...\n')
  
  const tests = [
    { name: 'Subgraph Connection', fn: testSubgraphConnection },
    { name: 'Data Freshness', fn: testDataFreshness },
    { name: 'Contract Events', fn: testContractEvents }
  ]
  
  const results = []
  
  for (const test of tests) {
    const result = await test.fn()
    results.push({ name: test.name, passed: result })
  }
  
  console.log('\n📊 Test Results Summary')
  console.log('=' .repeat(40))
  
  results.forEach(test => {
    const status = test.passed ? '✅ PASS' : '❌ FAIL'
    console.log(`${status} ${test.name}`)
  })
  
  const passedTests = results.filter(r => r.passed).length
  const totalTests = results.length
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`)
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your blockchain integration is ready!')
    console.log('\n💡 Next steps:')
    console.log('   1. Add the Blockchain Data Hub tab to your Header component')
    console.log('   2. Test the component in your React app')
    console.log('   3. Customize colors and styling if needed')
    console.log('   4. Prepare your demo for judges and sponsors!')
  } else {
    console.log('⚠️  Some tests failed. Check the errors above and fix them.')
  }
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runAllTests().catch(console.error)
}

module.exports = { testSubgraphConnection, testDataFreshness, testContractEvents } 