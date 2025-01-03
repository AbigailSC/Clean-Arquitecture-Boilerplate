import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';

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
    // console.log('🚀 ~ PostgreDatabase ~ connect ~ newLog:', newLog);

    const { dbName, mongoUrl } = options;
    try {
      await mongoose.connect(mongoUrl, {
        dbName: dbName,
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
}
