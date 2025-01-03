import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';
import { buildLogger } from '../../config';

interface Options {
  mongoUrl: string;
  dbName: string;
}
const logger = buildLogger();

export class MongoDatabase {
  static async connect(options: Options) {
    const prisma = new PrismaClient();
    // const newLog = await prisma.logModel.create({
    //   data: {
    //     level: 'HIGH',
    //     message: 'Postgre Database connected asdasd',
    //     origin: 'App.ts',
    //   },
    // });
    // console.log('🚀 ~ PostgreDatabase ~ connect ~ newLog:', newLog);
    const logs = await prisma.logModel.findMany({
      where: {
        level: 'HIGH',
      },
    });
    // console.log('🚀 ~ MongoDatabase ~ connect ~ logs:', logs);

    const { dbName, mongoUrl } = options;
    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,
      });
      logger.info('Mongo connected', {
        database: dbName,
        mongoVersion: mongoose.version,
      });
      return true;
    } catch (error) {
      logger.error('Mongo connection error');
      throw error;
    }
  }
}
