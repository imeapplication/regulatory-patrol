
import { useState, useEffect } from 'react';
import { AllocationHistoryEntry } from '@/types/userAllocation';

export const useAllocationHistory = () => {
  // Add state for allocation history
  const [allocationHistory, setAllocationHistory] = useState<AllocationHistoryEntry[]>(() => {
    const savedHistory = localStorage.getItem('allocationHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Sync allocation history with localStorage
  useEffect(() => {
    localStorage.setItem('allocationHistory', JSON.stringify(allocationHistory));
  }, [allocationHistory]);

  // Functions to access allocation history
  const getAllocationHistory = (): AllocationHistoryEntry[] => {
    return allocationHistory;
  };

  const getUserAllocationHistory = (userId: string): AllocationHistoryEntry[] => {
    return allocationHistory.filter(entry => entry.userId === userId);
  };

  const addAllocationHistoryEntry = (entry: AllocationHistoryEntry) => {
    setAllocationHistory(prev => [...prev, entry]);
  };

  return {
    allocationHistory,
    getAllocationHistory,
    getUserAllocationHistory,
    addAllocationHistoryEntry
  };
};
