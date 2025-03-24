
import React, { useState } from 'react';
import { complianceData } from '@/data/complianceData';
import GlassCard from '@/components/ui-components/GlassCard';
import Navbar from '@/components/Navbar';
import { Copy, Check } from 'lucide-react';

const JsonView = () => {
  const [copied, setCopied] = useState(false);
  
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(complianceData, null, 2));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-4 min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold animate-slide-down">JSON Data</h1>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
          
          <GlassCard className="animate-scale-in">
            <pre className="text-xs md:text-sm overflow-x-auto p-4 bg-gray-50 rounded-lg">
              {JSON.stringify(complianceData, null, 2)}
            </pre>
          </GlassCard>
        </div>
      </main>
    </>
  );
};

export default JsonView;
