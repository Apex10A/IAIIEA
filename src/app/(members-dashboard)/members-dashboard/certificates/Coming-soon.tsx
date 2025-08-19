import React from 'react'
import Link from 'next/link'
import { Award, Clock, Bell, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ComingSoon: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Certificates</h1>
        <p className="text-gray-600 mt-2">Manage and download your IAIIEA membershi certificates.</p>
      </div>

      {/* Coming Soon Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#D5B93C]/15 text-[#D5B93C] flex items-center justify-center">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Certificates are coming soon</CardTitle>
              <CardDescription>
                We’re putting the finishing touches on your certificate dashboard experience.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

      </Card>
    </div>
  )
}

export default ComingSoon