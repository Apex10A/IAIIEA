"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Resource {
  resource_id: number;
  resource_type: string;
  caption: string;
  date: string;
  file: string;
}

interface ResourcesSectionProps {
  resources: Resource[];
}

export const ResourcesSection = ({ resources }: ResourcesSectionProps) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
        Resources & Materials
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <Card
            key={resource.resource_id || index}
            className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {resource.resource_type === 'PDF' && (
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {resource.resource_type === 'Video' && (
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {resource.resource_type === 'Docx' && (
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {!['PDF', 'Video', 'Docx'].includes(resource.resource_type) && (
                    <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                      <Download className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1 truncate">
                    {resource.caption}
                  </h3>
                  <p className="text-sm text-white/60 mb-2">
                    {resource.resource_type} • {resource.date}
                  </p>
                  
                  <Button
                    size="sm"
                    className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] text-xs"
                    onClick={() => {
                      if (resource.file) {
                        window.open(resource.file, '_blank');
                      }
                    }}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};