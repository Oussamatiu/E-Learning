// Test script to verify course creation API
// Run this with: node test_course_creation.js

const API_BASE_URL = 'http://127.0.0.1:8000';

async function testCourseCreation() {
  try {
    console.log('Testing course creation API...');

    // First, let's test if the API is reachable
    const response = await fetch(`${API_BASE_URL}/api/courses`);
    if (!response.ok) {
      throw new Error(`API not reachable: ${response.status}`);
    }
    console.log('✓ API is reachable');

    // Test categories endpoint
    const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`);
    if (!categoriesResponse.ok) {
      throw new Error(`Categories endpoint failed: ${categoriesResponse.status}`);
    }
    const categories = await categoriesResponse.json();
    console.log('✓ Categories endpoint working');
    console.log('Available categories:', categories.data.map(c => c.name).join(', '));

    // Test course creation (this would require authentication)
    console.log('\n✓ Basic API connectivity test passed!');
    console.log('\nNote: Course creation requires authentication.');
    console.log('Make sure you have a valid token to create courses.');

  } catch (error) {
    console.error('✗ Test failed:', error.message);
    process.exit(1);
  }
}

testCourseCreation();