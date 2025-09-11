import { Sequelize } from "sequelize";
import db from "../models/index.js";

const tenantConnections = {}; // cache by dbName

export async function getTenantConnection(subdomain) {
  if (subdomain !== "admin") {
    // 1. Find company in master DB
    const company = await db.Company.findOne({
      where: { co_subdomain: subdomain },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    const dbName = company.co_database;

    // 2. Return cached if exists
    if (tenantConnections[dbName]) {
      return tenantConnections[dbName];
    }

    // 3. Create new Sequelize instance
    const tenantSequelize = new Sequelize({
      dialect: "postgres",
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: dbName,
      port: process.env.DB_PORT,
      logging: false,
    });

    // 4. Initialize tenant models + associations
    const models = db.initTenantModels(tenantSequelize);

    // 5. Sync (only first time, no force)
    await tenantSequelize.sync();

    // 6. Cache
    tenantConnections[dbName] = models;

    return models;
  }
}
