import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import logger from '../../config/logger.config';

interface Options {
  mongoUrl: string;
  dbName: string;
}

export class PostgreDatabase {
  static async connect(options: Options) {
    const prisma = new PrismaClient();
    const newLog = await prisma.logModel.create({
      data: {
        level: 'HIGH',
        message: 'Postgre Database connected',
        origin: 'App.ts',
      },
    });
    console.log('🚀 ~ PostgreDatabase ~ connect ~ newLog:', newLog);

    const { dbName, mongoUrl } = options;
    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,
      });
      logger.info('Mongo connected');
      return true;
    } catch (error) {
      logger.error('Mongo connection error');
      throw error;
    }
  }
}
