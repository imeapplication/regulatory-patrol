
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DomainDetailLayout from './DomainDetailLayout';

const DomainError = () => {
  return (
    <DomainDetailLayout>
      <Card className="bg-white border-none shadow-lg animate-fade-in">
        <CardContent className="p-6">
          <p>Domain not found or error loading data.</p>
          <Button asChild className="mt-4">
            <Link to="/">Go Back</Link>
          </Button>
        </CardContent>
      </Card>
    </DomainDetailLayout>
  );
};

export default DomainError;
