// scripts/generate-token.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const userId = process.argv[2]; // Get user ID from command line
const secret = process.env.JWT_SECRET || 'your-secret-key';

if (!userId) {
  console.error('Please provide a user ID');
  process.exit(1);
}

const token = jwt.sign({ userId }, secret, { expiresIn: '1d' });
console.log('Generated token:');
console.log(token);
console.log('\nUse this in your requests with the Authorization header:');
console.log(`Authorization: Bearer ${token}`);