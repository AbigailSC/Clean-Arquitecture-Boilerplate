import mongoose from "mongoose";
import logger from "../../infraestructure/logger/logger.config";

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class MongoDatabase {
  static async connect(options: Options) {
    const { dbName, mongoUrl } = options;
    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,
      });
      logger.info("Mongo connected");
    } catch (error) {
      logger.error("Mongo connection error");
      throw error;
    }
  }
}
