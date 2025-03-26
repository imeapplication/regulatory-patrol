
import React, { useState, useEffect } from 'react';
import { complianceData } from '@/data/complianceData';
import GlassCard from '@/components/ui-components/GlassCard';
import Navbar from '@/components/Navbar';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from '@/contexts/UserContext';

const JsonView = () => {
  const [copied, setCopied] = useState(false);
  const [localStorageData, setLocalStorageData] = useState<string>("");
  const { saveComplianceData } = useUser();
  
  useEffect(() => {
    // Get the localStorage data as a formatted JSON string
    const data: Record<string, any> = {};
    
    // Add all localStorage items to our object
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            data[key] = JSON.parse(value);
          }
        } catch (e) {
          // If we can't parse as JSON, just store as is
          const value = localStorage.getItem(key);
          if (value) {
            data[key] = value;
          }
        }
      }
    }
    
    setLocalStorageData(JSON.stringify(data, null, 2));
  }, []);
  
  const handleCopyJson = (jsonData: string) => {
    navigator.clipboard.writeText(jsonData);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleRefreshData = () => {
    // Save current compliance data to localStorage
    saveComplianceData();
    
    // Refresh the page to show the updated data
    window.location.reload();
  };
  
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-12 px-4 min-h-screen bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold animate-slide-down">JSON Data</h1>
            <div className="flex gap-2">
              <button
                onClick={handleRefreshData}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
          
          <Tabs defaultValue="memory">
            <TabsList className="mb-4">
              <TabsTrigger value="memory">In-Memory Data</TabsTrigger>
              <TabsTrigger value="storage">Local Storage Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="memory">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => handleCopyJson(JSON.stringify(complianceData, null, 2))}
                  className="flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
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
            </TabsContent>
            
            <TabsContent value="storage">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => handleCopyJson(localStorageData)}
                  className="flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 transition-colors text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              
              <GlassCard className="animate-scale-in">
                <pre className="text-xs md:text-sm overflow-x-auto p-4 bg-gray-50 rounded-lg">
                  {localStorageData}
                </pre>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default JsonView;
