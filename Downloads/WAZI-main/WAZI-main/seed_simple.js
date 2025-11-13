const mysql = require("mysql2");

// Create connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "wazi_db",
});

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Seed data
const seedData = async () => {
  try {
    // Create tables
    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS fiscal_savings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        county VARCHAR(50),
        year INT,
        savings_amount DECIMAL(15,2),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS ghost_workers_eliminated (
        id INT AUTO_INCREMENT PRIMARY KEY,
        county VARCHAR(50),
        year INT,
        workers_eliminated INT,
        savings_amount DECIMAL(15,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS procurement_fraud_detected (
        id INT AUTO_INCREMENT PRIMARY KEY,
        county VARCHAR(50),
        year INT,
        contracts_flagged INT,
        estimated_savings DECIMAL(15,2),
        status ENUM('pending', 'investigated', 'resolved') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS user_engagement (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        organization VARCHAR(100),
        category ENUM('citizen', 'government', 'partner', 'media', 'other'),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS fiscal_metrics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        metric_name VARCHAR(100),
        value DECIMAL(15,2),
        unit VARCHAR(20),
        description TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // AI Input Tables
    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS payroll_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(50),
        county VARCHAR(50),
        payroll_amount DECIMAL(12,2),
        attendance_rate DECIMAL(3,2),
        biometric_matches INT,
        work_output DECIMAL(5,2),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS procurement_tenders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contract_id VARCHAR(50),
        county VARCHAR(50),
        contract_value DECIMAL(15,2),
        vendor_history_score DECIMAL(3,2),
        price_variance DECIMAL(5,2),
        tender_competition INT,
        delivery_time INT,
        quality_score DECIMAL(3,2),
        status ENUM('pending', 'approved', 'flagged') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS tax_transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaction_id VARCHAR(50),
        business_id VARCHAR(50),
        sector VARCHAR(50),
        transaction_amount DECIMAL(15,2),
        tax_rate DECIMAL(5,4),
        payment_pattern DECIMAL(3,2),
        business_size INT,
        compliance_history DECIMAL(3,2),
        risk_score DECIMAL(5,4),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.promise().execute(`
      CREATE TABLE IF NOT EXISTS ai_analysis_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        analysis_type ENUM('ghost_worker', 'procurement_fraud', 'revenue_leak'),
        record_id VARCHAR(50),
        risk_score DECIMAL(5,4),
        is_flagged BOOLEAN DEFAULT FALSE,
        analysis_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Tables created successfully");

    // Insert fiscal savings data
    await connection.promise().execute(`
      INSERT INTO fiscal_savings (county, year, savings_amount, category) VALUES
      ('Nairobi', 2023, 250000000.00, 'Ghost Workers'),
      ('Nairobi', 2023, 180000000.00, 'Procurement Fraud'),
      ('Nairobi', 2023, 95000000.00, 'Revenue Leakage'),
      ('Kiambu', 2023, 85000000.00, 'Ghost Workers'),
      ('Kiambu', 2023, 62000000.00, 'Procurement Fraud'),
      ('Nakuru', 2023, 120000000.00, 'Ghost Workers'),
      ('Nakuru', 2023, 78000000.00, 'Revenue Leakage'),
      ('Mombasa', 2023, 95000000.00, 'Procurement Fraud'),
      ('Kisumu', 2023, 68000000.00, 'Ghost Workers')
    `);

    // Insert ghost workers data
    await connection.promise().execute(`
      INSERT INTO ghost_workers_eliminated (county, year, workers_eliminated, savings_amount) VALUES
      ('Nairobi', 2023, 1250, 250000000.00),
      ('Kiambu', 2023, 425, 85000000.00),
      ('Nakuru', 2023, 600, 120000000.00),
      ('Kisumu', 2023, 340, 68000000.00),
      ('Uasin Gishu', 2023, 280, 56000000.00),
      ('Machakos', 2023, 195, 39000000.00),
      ('Nyeri', 2023, 165, 33000000.00)
    `);

    // Insert procurement fraud data
    await connection.promise().execute(`
      INSERT INTO procurement_fraud_detected (county, year, contracts_flagged, estimated_savings, status) VALUES
      ('Nairobi', 2023, 45, 180000000.00, 'investigated'),
      ('Mombasa', 2023, 28, 95000000.00, 'resolved'),
      ('Kiambu', 2023, 18, 62000000.00, 'pending'),
      ('Nakuru', 2023, 32, 110000000.00, 'investigated'),
      ('Kisumu', 2023, 15, 45000000.00, 'pending'),
      ('Eldoret', 2023, 22, 78000000.00, 'resolved')
    `);

    // Insert user engagement data one by one to avoid SQL syntax issues
    const userData = [
      [
        "Dr. Sarah Kimani",
        "sarah.kimani@kiprep.or.ke",
        "Kenya Institute for Public Policy Research",
        "government",
        "Interested in implementing AI oversight in our county procurement processes.",
      ],
      [
        "James Odhiambo",
        "james.odhiambo@transparency.or.ke",
        "Transparency International Kenya",
        "partner",
        "We would like to collaborate on anti-corruption initiatives using your AI platform.",
      ],
      [
        "Grace Mwangi",
        "grace.mwangi@techkenya.org",
        "Tech Kenya Initiative",
        "partner",
        "Excited about the potential for AI in public financial management. Let's discuss partnership opportunities.",
      ],
      [
        "Michael Kiprop",
        "michael.kiprop@gmail.com",
        "Concerned Citizen",
        "citizen",
        "As a taxpayer, I'm very interested in how this technology can help reduce waste in government spending.",
      ],
      [
        "Dr. David Njoroge",
        "david.njoroge@nairobi.go.ke",
        "Nairobi County Government",
        "government",
        "We're looking to pilot your AI integrity system in our payroll and procurement departments.",
      ],
    ];

    for (const user of userData) {
      await connection.promise().execute(
        `
        INSERT INTO user_engagement (name, email, organization, category, message) VALUES (?, ?, ?, ?, ?)
      `,
        user
      );
    }

    // Insert fiscal metrics
    await connection.promise().execute(`
      INSERT INTO fiscal_metrics (metric_name, value, unit, description) VALUES
      ('Total Savings Pilot Phase', 10000000.00, 'KES', 'Savings achieved during pilot implementation across 3 counties'),
      ('Ghost Worker Detection Accuracy', 95.00, '%', 'Accuracy rate in identifying phantom employees'),
      ('Audit Process Speed Improvement', 40.00, '%', 'Reduction in time required for comprehensive audits'),
      ('National Projected Annual Savings', 150000000000.00, 'KES', 'Estimated savings if scaled across all 47 counties'),
      ('Counties Ready for Deployment', 47.00, 'counties', 'Number of counties prepared for AI implementation'),
      ('Transparency Accountability Score', 100.00, '%', 'Level of transparency and accountability achieved')
    `);

    // Insert sample AI input data
    await connection.promise().execute(`
      INSERT INTO payroll_data (employee_id, county, payroll_amount, attendance_rate, biometric_matches, work_output) VALUES
      ('EMP001', 'Nairobi', 45000.00, 0.95, 28, 85.50),
      ('EMP002', 'Nairobi', 52000.00, 0.88, 25, 78.20),
      ('EMP003', 'Nairobi', 38000.00, 0.72, 15, 45.30),
      ('EMP004', 'Kiambu', 41000.00, 0.91, 26, 82.10),
      ('EMP005', 'Kiambu', 48000.00, 0.85, 22, 75.60)
    `);

    await connection.promise().execute(`
      INSERT INTO procurement_tenders (contract_id, county, contract_value, vendor_history_score, price_variance, tender_competition, delivery_time, quality_score) VALUES
      ('CONT001', 'Nairobi', 2500000.00, 0.85, 0.15, 5, 90, 0.88),
      ('CONT002', 'Nairobi', 1800000.00, 0.45, 0.45, 2, 180, 0.65),
      ('CONT003', 'Kiambu', 950000.00, 0.92, 0.08, 7, 60, 0.95),
      ('CONT004', 'Nakuru', 3200000.00, 0.78, 0.22, 4, 120, 0.82),
      ('CONT005', 'Mombasa', 1500000.00, 0.35, 0.55, 1, 240, 0.45)
    `);

    await connection.promise().execute(`
      INSERT INTO tax_transactions (transaction_id, business_id, sector, transaction_amount, tax_rate, payment_pattern, business_size, compliance_history) VALUES
      ('TXN001', 'BUS001', 'Retail', 500000.00, 0.16, 0.85, 50, 0.90),
      ('TXN002', 'BUS002', 'Manufacturing', 2500000.00, 0.25, 0.92, 200, 0.95),
      ('TXN003', 'BUS003', 'Services', 750000.00, 0.18, 0.45, 25, 0.60),
      ('TXN004', 'BUS004', 'Construction', 1800000.00, 0.20, 0.78, 75, 0.85),
      ('TXN005', 'BUS005', 'Agriculture', 350000.00, 0.10, 0.35, 15, 0.40)
    `);

    // Create indexes
    await connection
      .promise()
      .execute(
        `CREATE INDEX idx_fiscal_savings_county_year ON fiscal_savings(county, year)`
      );
    await connection
      .promise()
      .execute(
        `CREATE INDEX idx_ghost_workers_county_year ON ghost_workers_eliminated(county, year)`
      );
    await connection
      .promise()
      .execute(
        `CREATE INDEX idx_procurement_county_year ON procurement_fraud_detected(county, year)`
      );
    await connection
      .promise()
      .execute(
        `CREATE INDEX idx_user_engagement_category ON user_engagement(category)`
      );
    await connection
      .promise()
      .execute(
        `CREATE INDEX idx_fiscal_metrics_name ON fiscal_metrics(metric_name)`
      );

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    connection.end();
  }
};

seedData();
