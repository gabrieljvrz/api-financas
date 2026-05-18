import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

const url = process.env.DATABASE_URL as string;

const adapter = new PrismaMariaDb(url);
const prisma = new PrismaClient({ adapter });

export default prisma;