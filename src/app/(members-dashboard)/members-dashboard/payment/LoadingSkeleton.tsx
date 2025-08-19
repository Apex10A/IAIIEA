"use client";
import React from "react";
import { Card } from "@/components/ui/card";

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse"></div>
          <div className="h-8 bg-gray-100 rounded w-1/4 animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-gray-100 rounded w-48 animate-pulse"></div>
            <div className="h-10 bg-gray-100 rounded w-32 animate-pulse"></div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default LoadingSkeleton;