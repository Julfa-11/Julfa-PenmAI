
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState, useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Sparkles, Landmark, Percent, Calendar, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import ResultsChart from './results-chart';
import { suggestOptimalInterestRates } from '@/ai/flows/suggest-optimal-interest-rates';

const formSchema = z.object({
  principal: z.coerce.number().min(1, 'Principal amount is required.'),
  rate: z.coerce.number().min(0.01, 'A positive interest rate is required.'),
  time: z.coerce.number().min(1, 'Time period must be at least 1.'),
  timeUnit: z.enum(['months', 'years']),
  compounding: z.string().min(1, 'Compounding frequency is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function DepositCalculator() {
  const [results, setResults] = useState({ maturityValue: 0, totalInterest: 0 });
  const [aiSuggestion, setAiSuggestion] = useState<{ suggestedInterestRate: number; reasoning: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: 100000,
      rate: 6.5,
      time: 1,
      timeUnit: 'years',
      compounding: '4', // Quarterly
    },
  });

  const { watch, getValues, setValue } = form;
  const watchedValues = watch();

  useEffect(() => {
    const calculate = (values: FormValues) => {
      const { principal, rate, time, timeUnit, compounding } = values;

      const P = principal || 0;
      const r = (rate || 0) / 100;
      const n = parseInt(compounding || '1', 10);
      const t = timeUnit === 'years' ? (time || 0) : (time || 0) / 12;

      if (P > 0 && r > 0 && t > 0 && n > 0) {
        const amount = P * Math.pow(1 + r / n, n * t);
        setResults({
          maturityValue: amount,
          totalInterest: amount - P,
        });
      } else {
        setResults({ maturityValue: P, totalInterest: 0 });
      }
    };
    calculate(watchedValues);

    const subscription = watch((values) => {
      calculate(values as FormValues);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const timeInYears = useMemo(() => {
    const { time, timeUnit } = watchedValues;
    if (!time) return 0;
    return timeUnit === 'years' ? time : time / 12;
  }, [watchedValues.time, watchedValues.timeUnit]);

  const handleAiSuggest = async () => {
    setIsAiLoading(true);
    setAiSuggestion(null);
    form.clearErrors("rate");
    const { principal, time, timeUnit } = getValues();
    const fdPeriodInMonths = timeUnit === 'years' ? time * 12 : time;

    try {
      const suggestion = await suggestOptimalInterestRates({
        fdAmount: principal,
        fdPeriod: fdPeriodInMonths,
      });
      setAiSuggestion(suggestion);
      toast({
        title: "AI Suggestion Ready!",
        description: "An optimal interest rate has been suggested.",
      });
    } catch (error) {
      console.error("AI suggestion failed:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Couldn't fetch AI suggestion. Please try again.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const applyAiRate = () => {
    if (aiSuggestion) {
      setValue('rate', parseFloat((aiSuggestion.suggestedInterestRate * 100).toFixed(2)), { shouldValidate: true });
      setAiSuggestion(null);
      toast({
        title: "Rate Applied",
        description: "The AI suggested interest rate has been applied.",
      })
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      <Card className="lg:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle>Calculator</CardTitle>
          <CardDescription>Enter your deposit details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="principal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal Amount (₹)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" placeholder="e.g., 100000" {...field} className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Interest Rate (%)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" placeholder="e.g., 6.5" {...field} step="0.01" className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-center my-4">
                 <Button type="button" onClick={handleAiSuggest} disabled={isAiLoading} variant="outline" className="w-full bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                    {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Suggest Optimal Rate with AI
                </Button>
              </div>

              {aiSuggestion && (
                <Alert className="bg-primary/5 border-primary/20">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">AI Suggestion</AlertTitle>
                  <AlertDescription>
                    <p className="font-bold text-lg">{ (aiSuggestion.suggestedInterestRate * 100).toFixed(2) }%</p>
                    <p className="text-xs mt-1 mb-3">{aiSuggestion.reasoning}</p>
                    <Button type="button" size="sm" onClick={applyAiRate} className="bg-accent hover:bg-accent/90">Apply this rate</Button>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Period</FormLabel>
                       <FormControl>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="number" placeholder="e.g., 5" {...field} className="pl-9"/>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timeUnit"
                  render={({ field }) => (
                    <FormItem className="self-end">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="years">Years</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="compounding"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compounding Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="12">Monthly</SelectItem>
                        <SelectItem value="4">Quarterly</SelectItem>
                        <SelectItem value="2">Half-Yearly</SelectItem>
                        <SelectItem value="1">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="lg:col-span-3 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-muted-foreground">Maturity Value</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl md:text-4xl font-bold text-primary">{formatCurrency(results.maturityValue)}</p>
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-muted-foreground">Total Interest Earned</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl md:text-4xl font-bold text-accent">{formatCurrency(results.totalInterest)}</p>
                </CardContent>
            </Card>
        </div>
        <ResultsChart
          principal={watchedValues.principal || 0}
          rate={watchedValues.rate || 0}
          timeInYears={timeInYears}
          compounding={parseInt(watchedValues.compounding || '1', 10)}
        />
      </div>
    </div>
  );
}
