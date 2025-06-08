"use client"
import React, { useState } from 'react';
import PaymentPage from './Payment';
import PaymentHistory from './PaymentHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function PaymentDashboard() {
  const [activeTab, setActiveTab] = useState("pending");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">Manage your payments and view payment history</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger 
            value="pending"
            className="data-[state=active]:bg-[#D5B93C] data-[state=active]:text-[#0E1A3D]"
          >
            Pending Payments
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="data-[state=active]:bg-[#D5B93C] data-[state=active]:text-[#0E1A3D]"
          >
            Payment History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="p-6">
            <PaymentPage />
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <PaymentHistory />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
