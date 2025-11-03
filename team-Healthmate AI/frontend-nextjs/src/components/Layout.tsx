import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navigation from './Navigation';

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ 
  children, 
  title = 'HealthMate AI - Your Everyday Health Companion',
  description = 'AI-powered health assistant providing reliable health guidance in multiple Nigerian languages.'
}: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="relative">
          {children}
        </main>
      </div>
    </>
  );
}