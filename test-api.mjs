// Test script for DriftGuard API
import fetch from 'node-fetch';

async function runTests() {
  const BASE_URL = 'http://localhost:5000/api';
  
  console.log('=== DriftGuard API Tests ===\n');
  
  // Test health
  console.log('1. Testing health endpoint...');
  const health = await fetch(`${BASE_URL}/health`);
  const healthData = await health.json();
  console.log('Health:', healthData.success ? 'OK' : 'FAILED');
  
  // Test login
  console.log('\n2. Testing login...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@driftguard.dev', password: 'demo123' })
  });
  const loginData = await loginRes.json();
  console.log('Login:', loginData.success ? 'OK' : 'FAILED');
  
  if (!loginData.success) {
    console.log('Login error:', loginData);
    return;
  }
  
  const token = loginData.data.token;
  console.log('Token received:', token.substring(0, 30) + '...');
  
  // Test dashboard
  console.log('\n3. Testing dashboard stats...');
  const dashRes = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const dashData = await dashRes.json();
  console.log('Dashboard:', dashData.success ? 'OK' : 'FAILED');
  
  // Test projects
  console.log('\n4. Testing projects list...');
  const projRes = await fetch(`${BASE_URL}/projects`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const projData = await projRes.json();
  console.log('Projects:', projData.success ? 'OK' : 'FAILED');
  
  // Test settings
  console.log('\n5. Testing settings...');
  const setRes = await fetch(`${BASE_URL}/settings`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const setData = await setRes.json();
  console.log('Settings:', setData.success ? 'OK' : 'FAILED');
  
  console.log('\n=== All tests completed ===');
}

runTests().catch(console.error);