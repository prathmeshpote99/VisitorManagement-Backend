import { Sequelize } from "sequelize";

const options = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
  dialectOptions: {
    family: 4,
  },
  logging: false,
};

const masterSequelize = new Sequelize(options);

export async function connectToDB() {
  try {
    await masterSequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
    await masterSequelize.sync();
    console.log('✅ All models were synchronized successfully.');
  } catch (error) {
    console.error(`❌ Unable to connect to the database`, error);
  }
}

export default masterSequelize;
