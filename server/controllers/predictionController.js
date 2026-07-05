const axios = require("axios");

exports.predictASD = async (req, res) => {
    try {
        console.log('Server received prediction request');
        console.log('Request body:', req.body);

        const response = await axios.post("http://localhost:6000/predict", {
            features: req.body.features
        });

        console.log('ML service response:', response.data);
        res.json({
            prediction: response.data.prediction,
            probability: response.data.probability,
            confidence: response.data.confidence,
            risk_level: response.data.risk_level,
            result: response.data.prediction,
            details: response.data
        });

    } catch (error) {
        res.status(500).json({ error: "ML Service Error" });
    }
};
