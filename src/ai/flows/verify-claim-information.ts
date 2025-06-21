'use server';

/**
 * @fileOverview A claim information verification AI agent.
 *
 * - verifyClaimInformation - A function that handles the claim information verification process.
 * - VerifyClaimInformationInput - The input type for the verifyClaimInformation function.
 * - VerifyClaimInformationOutput - The return type for the verifyClaimInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyClaimInformationInputSchema = z.object({
  claimDescription: z
    .string()
    .describe('The description of the claim provided by the claimant.'),
  policyDetails: z.string().describe('The details of the insurance policy.'),
  incidentReport: z.string().describe('The incident report related to the claim.'),
  medicalRecords: z.string().describe('The medical records associated with the claim.'),
});
export type VerifyClaimInformationInput = z.infer<
  typeof VerifyClaimInformationInputSchema
>;

const VerifyClaimInformationOutputSchema = z.object({
  inconsistencies: z
    .array(z.string())
    .describe(
      'A list of inconsistencies found between the claim information and external data sources.'
    ),
  fraudIndicators: z
    .array(z.string())
    .describe('A list of potential fraud indicators identified.'),
  verificationSummary:
    z.string().describe('A summary of the claim information verification process.'),
});

export type VerifyClaimInformationOutput = z.infer<
  typeof VerifyClaimInformationOutputSchema
>;

export async function verifyClaimInformation(
  input: VerifyClaimInformationInput
): Promise<VerifyClaimInformationOutput> {
  return verifyClaimInformationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyClaimInformationPrompt',
  input: {schema: VerifyClaimInformationInputSchema},
  output: {schema: VerifyClaimInformationOutputSchema},
  prompt: `You are an AI agent specializing in verifying insurance claim information.

You will receive claim details, policy details, incident reports, and medical records.
Your task is to analyze this information and identify any inconsistencies or potential fraud indicators by cross-referencing with available data and common fraud patterns.

Claim Description: {{{claimDescription}}}
Policy Details: {{{policyDetails}}}
Incident Report: {{{incidentReport}}}
Medical Records: {{{medicalRecords}}}

Based on the information provided, please identify any inconsistencies, potential fraud indicators, and provide a summary of the verification process. Return the output in JSON format.

Inconsistencies should list any discrepancies found between the provided documents.
Fraud indicators should list potential red flags that suggest fraudulent activity.
The verification summary should provide a brief overview of the verification process and its findings.
`,
});

const verifyClaimInformationFlow = ai.defineFlow(
  {
    name: 'verifyClaimInformationFlow',
    inputSchema: VerifyClaimInformationInputSchema,
    outputSchema: VerifyClaimInformationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
