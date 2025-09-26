import { DepositCalculator } from '@/components/deposit-calculator';
import { Landmark } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary p-3 rounded-full mb-4">
            <Landmark className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            DepositEase
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your fixed deposit returns and discover optimal interest rates with our AI-powered smart calculator.
          </p>
        </header>
        <DepositCalculator />
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} DepositEase. All Rights Reserved.
      </footer>
    </div>
  );
}
