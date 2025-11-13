const tf = require("@tensorflow/tfjs");

// Simple AI model for ghost worker detection
class GhostWorkerDetector {
  constructor() {
    this.model = null;
  }

  async loadModel() {
    // Create a simple neural network for demonstration
    this.model = tf.sequential();
    this.model.add(
      tf.layers.dense({ inputShape: [4], units: 16, activation: "relu" })
    );
    this.model.add(tf.layers.dense({ units: 8, activation: "relu" }));
    this.model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

    this.model.compile({
      optimizer: "adam",
      loss: "binaryCrossentropy",
      metrics: ["accuracy"],
    });
  }

  async analyzeEmployee(employeeData) {
    if (!this.model) await this.loadModel();

    // Features: [payroll_amount, attendance_rate, biometric_matches, work_output]
    const features = tf.tensor2d([
      [
        employeeData.payroll_amount / 100000, // normalized
        employeeData.attendance_rate,
        employeeData.biometric_matches,
        employeeData.work_output / 100, // normalized
      ],
    ]);

    const prediction = this.model.predict(features);
    const riskScore = (await prediction.data())[0];

    return {
      employee_id: employeeData.id,
      risk_score: riskScore,
      is_ghost_worker: riskScore > 0.7,
      confidence: riskScore,
    };
  }

  async analyzeBatch(employees) {
    const results = [];
    for (const employee of employees) {
      const result = await this.analyzeEmployee(employee);
      results.push(result);
    }
    return results;
  }
}

module.exports = GhostWorkerDetector;
