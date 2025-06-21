import { config } from 'dotenv';
config();

import '@/ai/flows/extract-claim-entities.ts';
import '@/ai/flows/verify-claim-information.ts';