const axios = require('axios');

async function testConnections() {
    console.log('Testing service connections...\n');

    try {
        console.log('1. Testing ML Service (port 6000)...');
        const mlHealth = await axios.get('http://localhost:6000/health');
        console.log('   ✓ ML Service is running:', mlHealth.data);
    } catch (error) {
        console.log('   ✗ ML Service error:', error.message);
        return;
    }

    try {
        console.log('\n2. Testing Main Server (port 5000)...');
        const serverResponse = await axios.get('http://localhost:5000/api');
        console.log('   ✓ Main Server is running:', serverResponse.data);
    } catch (error) {
        console.log('   ✗ Main Server error:', error.message);
        return;
    }

    try {
        console.log('\n3. Testing Prediction Route...');
        const testFeatures = [
            1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
            5,
            1,
            0,
            1,
            3
        ];
        const predictionResponse = await axios.post('http://localhost:5000/api/prediction/predict', {
            features: testFeatures
        });
        console.log('   ✓ Prediction route working:', predictionResponse.data);
    } catch (error) {
        console.log('   ✗ Prediction route error:', error.message);
        if (error.response) {
            console.log('   Response data:', error.response.data);
        }
        return;
    }

    console.log('\n✓ All services are properly connected!');
}

testConnections();