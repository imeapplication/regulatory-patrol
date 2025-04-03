
import React from 'react';

const TaskLoading = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-pulse text-center">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-64 mx-auto"></div>
      </div>
    </div>
  );
};

export default TaskLoading;
