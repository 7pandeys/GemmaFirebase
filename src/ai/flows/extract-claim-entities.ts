'use server';

/**
 * @fileOverview A flow for extracting key entities from a claim description.
 *
 * - extractClaimEntities - A function that extracts entities from a claim description.
 * - ExtractClaimEntitiesInput - The input type for the extractClaimEntities function.
 * - ExtractClaimEntitiesOutput - The return type for the extractClaimEntities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractClaimEntitiesInputSchema = z.object({
  claimDescription: z
    .string()
    .describe('The description of the claim incident.'),
});
export type ExtractClaimEntitiesInput = z.infer<typeof ExtractClaimEntitiesInputSchema>;

const ExtractClaimEntitiesOutputSchema = z.object({
  entities: z
    .object({
      names: z.array(z.string()).describe('List of names mentioned in the claim.'),
      dates: z.array(z.string()).describe('List of dates mentioned in the claim.'),
      locations: z.array(z.string()).describe('List of locations mentioned in the claim.'),
      incidentTypes: z.array(z.string()).describe('List of incident types mentioned in the claim.'),
    })
    .describe('Extracted entities from the claim description.'),
});
export type ExtractClaimEntitiesOutput = z.infer<typeof ExtractClaimEntitiesOutputSchema>;

export async function extractClaimEntities(input: ExtractClaimEntitiesInput): Promise<ExtractClaimEntitiesOutput> {
  return extractClaimEntitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractClaimEntitiesPrompt',
  input: {schema: ExtractClaimEntitiesInputSchema},
  output: {schema: ExtractClaimEntitiesOutputSchema},
  prompt: `You are an AI assistant specialized in extracting key entities from claim descriptions.

  Given the following claim description, extract the names, dates, locations, and incident types mentioned in the description. Respond in JSON format.

  Claim Description: {{{claimDescription}}}

  Output the extracted entities in the following JSON format:
  {
    "entities": {
      "names": ["name1", "name2", ...],
      "dates": ["date1", "date2", ...],
      "locations": ["location1", "location2", ...],
      "incidentTypes": ["type1", "type2", ...]
    }
  }`,
});

const extractClaimEntitiesFlow = ai.defineFlow(
  {
    name: 'extractClaimEntitiesFlow',
    inputSchema: ExtractClaimEntitiesInputSchema,
    outputSchema: ExtractClaimEntitiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
