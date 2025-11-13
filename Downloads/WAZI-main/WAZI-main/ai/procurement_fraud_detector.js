const tf = require("@tensorflow/tfjs");

// AI model for procurement fraud detection
class ProcurementFraudDetector {
  constructor() {
    this.model = null;
  }

  async loadModel() {
    // Create neural network for fraud detection
    this.model = tf.sequential();
    this.model.add(
      tf.layers.dense({ inputShape: [6], units: 32, activation: "relu" })
    );
    this.model.add(tf.layers.dense({ units: 16, activation: "relu" }));
    this.model.add(tf.layers.dense({ units: 8, activation: "relu" }));
    this.model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

    this.model.compile({
      optimizer: "adam",
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });
  }

  async analyzeContract(contractData) {
    if (!this.model) await this.loadModel();

    // Features: [contract_value, vendor_history_score, price_variance, tender_competition, delivery_time, quality_score]
    const features = tf.tensor2d([
      [
        contractData.contract_value / 10000000, // normalized
        contractData.vendor_history_score,
        contractData.price_variance,
        contractData.tender_competition,
        contractData.delivery_time / 365, // normalized to years
        contractData.quality_score,
      ],
    ]);

    const prediction = this.model.predict(features);
    const riskScore = (await prediction.data())[0];

    return {
      contract_id: contractData.id,
      risk_score: riskScore,
      is_fraudulent: riskScore > 0.6,
      confidence: riskScore,
      risk_factors: this.identifyRiskFactors(contractData, riskScore),
    };
  }

  identifyRiskFactors(contractData, riskScore) {
    const factors = [];

    if (contractData.price_variance > 0.3) factors.push("High price variance");
    if (contractData.vendor_history_score < 0.5)
      factors.push("Poor vendor history");
    if (contractData.tender_competition < 3) factors.push("Low competition");
    if (contractData.delivery_time > 180)
      factors.push("Extended delivery time");
    if (contractData.quality_score < 0.7) factors.push("Low quality score");

    return factors;
  }

  async analyzeBatch(contracts) {
    const results = [];
    for (const contract of contracts) {
      const result = await this.analyzeContract(contract);
      results.push(result);
    }
    return results;
  }
}

module.exports = ProcurementFraudDetector;
