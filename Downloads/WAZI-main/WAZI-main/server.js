const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3004;

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/solution", (req, res) => {
  res.render("solution");
});

app.get("/data", (req, res) => {
  res.render("data");
});

app.get("/engage", (req, res) => {
  res.render("engage");
});

app.get("/ai-dashboard", (req, res) => {
  res.render("ai-dashboard");
});

// Example route to fetch data from MySQL
app.get("/api/data", (req, res) => {
  db.query("SELECT * FROM your_table", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// AI Analysis Routes
const GhostWorkerDetector = require("./ai/ghost_worker_detector");
const ProcurementFraudDetector = require("./ai/procurement_fraud_detector");
const RevenueLeakMonitor = require("./ai/revenue_leak_monitor");

const ghostWorkerAI = new GhostWorkerDetector();
const procurementAI = new ProcurementFraudDetector();
const revenueAI = new RevenueLeakMonitor();

// Ghost Worker Detection API
app.get("/api/ai/ghost-workers", async (req, res) => {
  try {
    const employees = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM payroll_data", (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const results = await ghostWorkerAI.analyzeBatch(employees);

    // Store results in database
    for (const result of results) {
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO ai_analysis_results (analysis_type, record_id, risk_score, is_flagged, analysis_data) VALUES (?, ?, ?, ?, ?)",
          [
            "ghost_worker",
            result.employee_id,
            result.risk_score,
            result.is_ghost_worker,
            JSON.stringify(result),
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Procurement Fraud Detection API
app.get("/api/ai/procurement-fraud", async (req, res) => {
  try {
    const contracts = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM procurement_tenders", (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const results = await procurementAI.analyzeBatch(contracts);

    // Store results and update contract status
    for (const result of results) {
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO ai_analysis_results (analysis_type, record_id, risk_score, is_flagged, analysis_data) VALUES (?, ?, ?, ?, ?)",
          [
            "procurement_fraud",
            result.contract_id,
            result.risk_score,
            result.is_fraudulent,
            JSON.stringify(result),
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      // Update contract status if flagged
      if (result.is_fraudulent) {
        await new Promise((resolve, reject) => {
          db.query(
            "UPDATE procurement_tenders SET status = ? WHERE contract_id = ?",
            ["flagged", result.contract_id],
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      }
    }

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Revenue Leak Monitoring API
app.get("/api/ai/revenue-leak", async (req, res) => {
  try {
    const transactions = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM tax_transactions", (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const results = await revenueAI.analyzeBatch(transactions);
    const patterns = await revenueAI.detectPatterns(transactions);

    // Store results
    for (const result of results) {
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO ai_analysis_results (analysis_type, record_id, risk_score, is_flagged, analysis_data) VALUES (?, ?, ?, ?, ?)",
          [
            "revenue_leak",
            result.transaction_id,
            result.risk_score,
            result.is_leak,
            JSON.stringify(result),
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    res.json({ success: true, results, patterns });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Integrity Report API
app.get("/api/integrity-report", async (req, res) => {
  try {
    const [savings, ghostWorkers, procurementFraud, aiResults] =
      await Promise.all([
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM fiscal_savings ORDER BY created_at DESC",
            (err, results) => {
              if (err) reject(err);
              else resolve(results);
            }
          );
        }),
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM ghost_workers_eliminated ORDER BY created_at DESC",
            (err, results) => {
              if (err) reject(err);
              else resolve(results);
            }
          );
        }),
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM procurement_fraud_detected ORDER BY created_at DESC",
            (err, results) => {
              if (err) reject(err);
              else resolve(results);
            }
          );
        }),
        new Promise((resolve, reject) => {
          db.query(
            "SELECT * FROM ai_analysis_results ORDER BY created_at DESC LIMIT 100",
            (err, results) => {
              if (err) reject(err);
              else resolve(results);
            }
          );
        }),
      ]);

    const totalSavings = savings.reduce(
      (sum, item) => sum + parseFloat(item.savings_amount),
      0
    );
    const totalGhostWorkers = ghostWorkers.reduce(
      (sum, item) => sum + item.workers_eliminated,
      0
    );
    const totalFraudDetected = procurementFraud.reduce(
      (sum, item) => sum + item.contracts_flagged,
      0
    );

    res.json({
      summary: {
        totalSavings,
        totalGhostWorkers,
        totalFraudDetected,
        aiAnalysesCount: aiResults.length,
      },
      details: {
        savings,
        ghostWorkers,
        procurementFraud,
        recentAIAnalyses: aiResults,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
