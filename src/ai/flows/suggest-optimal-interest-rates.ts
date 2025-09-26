'use server';

/**
 * @fileOverview AI-driven suggestions for optimal FD interest rates based on the FD amount, FD period, and current market trends.
 *
 * - suggestOptimalInterestRates - A function that suggests optimal FD interest rates.
 * - SuggestOptimalInterestRatesInput - The input type for the suggestOptimalInterestRates function.
 * - SuggestOptimalInterestRatesOutput - The return type for the suggestOptimalInterestRates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalInterestRatesInputSchema = z.object({
  fdAmount: z.number().describe('The amount for the fixed deposit.'),
  fdPeriod: z.number().describe('The period (in months) for the fixed deposit.'),
});
export type SuggestOptimalInterestRatesInput = z.infer<typeof SuggestOptimalInterestRatesInputSchema>;

const SuggestOptimalInterestRatesOutputSchema = z.object({
  suggestedInterestRate: z.number().describe('The suggested optimal interest rate for the given FD amount and period, considering current market trends.'),
  reasoning: z.string().describe('The reasoning behind the suggested interest rate, considering current market conditions.'),
});
export type SuggestOptimalInterestRatesOutput = z.infer<typeof SuggestOptimalInterestRatesOutputSchema>;

export async function suggestOptimalInterestRates(input: SuggestOptimalInterestRatesInput): Promise<SuggestOptimalInterestRatesOutput> {
  return suggestOptimalInterestRatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalInterestRatesPrompt',
  input: {schema: SuggestOptimalInterestRatesInputSchema},
  output: {schema: SuggestOptimalInterestRatesOutputSchema},
  prompt: `You are an expert financial advisor specializing in fixed deposit (FD) interest rates.

  Based on the FD amount, FD period, and current market trends, suggest an optimal interest rate for the FD.
  Provide a reasoning for the suggested rate, considering the current market conditions.

  FD Amount: {{{fdAmount}}}
  FD Period (months): {{{fdPeriod}}}

  Consider current market conditions when providing your suggestion.
  Give the suggestedInterestRate as a decimal number (e.g., 0.05 for 5%).  Do NOT include a percent (%) sign in the suggestedInterestRate.
  `,
});

const suggestOptimalInterestRatesFlow = ai.defineFlow(
  {
    name: 'suggestOptimalInterestRatesFlow',
    inputSchema: SuggestOptimalInterestRatesInputSchema,
    outputSchema: SuggestOptimalInterestRatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
