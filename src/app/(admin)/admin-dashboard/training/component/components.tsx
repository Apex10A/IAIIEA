"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  Check,
  Pencil,
  Loader2,
  Plus,
  FileUp,
  Trash2,
  Upload
} from "lucide-react";
import { showToast } from "@/utils/toast";
import Image from "next/image";
import { Resource, AddResourceModalProps } from "./resources";
import { Seminar } from "./index";

interface ResourceCardProps {
  resource: Resource;
  onDelete: (resourceId: number) => Promise<void>;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    try {
      await onDelete(resource.resource_id);
      showToast.success("Resource deleted successfully");
    } catch (error) {
      showToast.error("Failed to delete resource");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="bg-blue-50 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {resource.caption}
            </h3>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Added on {formatDate(resource.date)}
          </p>
          {resource.file && (
            <a
              href={resource.file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-3 h-3 mr-1.5" />
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  seminarId: _seminarId,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [selectedSeminarId, setSelectedSeminarId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [resourceType, setResourceType] = useState("");
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  React.useEffect(() => {
    const fetchSeminars = async () => {
      if (!bearerToken) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch seminars");
        const data = await response.json();
        if (data.status === "success") {
          setSeminars(data.data);
          if (data.data.length > 0) setSelectedSeminarId(data.data[0].id);
        }
      } catch (err) {
        showToast.error("Failed to load seminars");
      }
    };
    fetchSeminars();
  }, [bearerToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !caption || !selectedSeminarId || !date || !resourceType) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resources[]", file);
      formData.append("caption", caption);
      formData.append("seminar_id", selectedSeminarId.toString());
      formData.append("date", date);
      formData.append("resource_type", resourceType);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/upload_seminar_resource`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add resource");
      }
      showToast.success("Resource added successfully");
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error adding resource:", error);
      showToast.error("Failed to add resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant='default' className="flex items-center gap-2">
        <Upload className="w-4 h-4" />
          Add Resource
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-lg shadow-lg p-6 focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Add New Resource
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <Cross2Icon className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seminar
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedSeminarId ?? ''}
                  onChange={e => setSelectedSeminarId(Number(e.target.value))}
                  required
                >
                  {seminars.map(seminar => (
                    <option key={seminar.id} value={seminar.id}>
                      {seminar.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={resourceType}
                  onChange={e => setResourceType(e.target.value)}
                  required
                >
                  <option value="" disabled>Select type</option>
                  <option value="Video">Video</option>
                  <option value="Audio">Audio</option>
                  <option value="PPT">PPT</option>
                  <option value="PDF">PDF</option>
                  <option value="Docx">Docx</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {file ? (
                      <div className="text-sm text-gray-600">
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center">
                          <FileUp className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              onChange={(e) =>
                                setFile(e.target.files?.[0] || null)
                              }
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, PPTX up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="caption"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Caption
                </label>
                <input
                  type="text"
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading || !file || !caption || !selectedSeminarId || !date || !resourceType}
                className="px-4 py-2 text-sm font-medium text-white bg-[#203a87] rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Uploading..." : "Upload Resource"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};