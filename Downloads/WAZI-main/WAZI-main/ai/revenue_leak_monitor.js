const tf = require("@tensorflow/tfjs");

// AI model for revenue leak monitoring
class RevenueLeakMonitor {
  constructor() {
    this.model = null;
  }

  async loadModel() {
    // Create neural network for revenue monitoring
    this.model = tf.sequential();
    this.model.add(
      tf.layers.dense({ inputShape: [5], units: 24, activation: "relu" })
    );
    this.model.add(tf.layers.dense({ units: 12, activation: "relu" }));
    this.model.add(tf.layers.dense({ units: 6, activation: "relu" }));
    this.model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

    this.model.compile({
      optimizer: "adam",
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });
  }

  async analyzeTransaction(transactionData) {
    if (!this.model) await this.loadModel();

    // Features: [transaction_amount, tax_rate, payment_pattern, business_size, compliance_history]
    const features = tf.tensor2d([
      [
        transactionData.transaction_amount / 1000000, // normalized
        transactionData.tax_rate,
        transactionData.payment_pattern,
        transactionData.business_size / 1000, // normalized
        transactionData.compliance_history,
      ],
    ]);

    const prediction = this.model.predict(features);
    const riskScore = (await prediction.data())[0];

    return {
      transaction_id: transactionData.id,
      risk_score: riskScore,
      is_leak: riskScore > 0.5,
      confidence: riskScore,
      estimated_loss: this.calculateEstimatedLoss(transactionData, riskScore),
    };
  }

  calculateEstimatedLoss(transactionData, riskScore) {
    // Simple estimation based on risk score and transaction amount
    const baseLoss = transactionData.transaction_amount * 0.1; // 10% potential tax evasion
    return baseLoss * riskScore;
  }

  async analyzeBatch(transactions) {
    const results = [];
    for (const transaction of transactions) {
      const result = await this.analyzeTransaction(transaction);
      results.push(result);
    }
    return results;
  }

  async detectPatterns(transactions) {
    // Analyze patterns across multiple transactions
    const patterns = {
      evasion_patterns: [],
      high_risk_sectors: [],
      seasonal_anomalies: [],
    };

    // Group by sector and analyze
    const sectorGroups = {};
    transactions.forEach((t) => {
      if (!sectorGroups[t.sector]) sectorGroups[t.sector] = [];
      sectorGroups[t.sector].push(t);
    });

    for (const [sector, sectorTransactions] of Object.entries(sectorGroups)) {
      const avgRisk =
        sectorTransactions.reduce((sum, t) => sum + t.risk_score, 0) /
        sectorTransactions.length;
      if (avgRisk > 0.6) {
        patterns.high_risk_sectors.push({
          sector,
          average_risk: avgRisk,
          transaction_count: sectorTransactions.length,
        });
      }
    }

    return patterns;
  }
}

module.exports = RevenueLeakMonitor;
