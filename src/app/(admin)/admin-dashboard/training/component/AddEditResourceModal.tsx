import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showToast } from '@/utils/toast';
import { Loader2 } from 'lucide-react';
import AddResourceModal from '@/components/AddResourceModal';

interface AddEditResourceModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  resource?: any; // resource object for edit mode
  seminarId: number;
  resourceTypes: string[];
}

const AddEditResourceModal: React.FC<AddEditResourceModalProps> = ({
  open,
  onClose,
  onSuccess,
  resource,
  seminarId,
  resourceTypes,
}) => {
  const [type, setType] = useState(resource?.resource_type || '');
  const [caption, setCaption] = useState(resource?.caption || '');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (resource) {
      setType(resource.resource_type || '');
      setCaption(resource.caption || '');
      setFile(null);
    } else {
      setType('');
      setCaption('');
      setFile(null);
    }
  }, [resource, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !caption || (!file && !resource)) {
      showToast.error('Please fill all fields and upload a file.');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('seminar_id', seminarId.toString());
      formData.append('resource_type', type);
      formData.append('caption', caption);
      if (file) formData.append('file', file);
      if (resource) formData.append('resource_id', resource.resource_id);
      const endpoint = resource
        ? `${process.env.NEXT_PUBLIC_API_URL}/admin/edit_seminar_resource`
        : `${process.env.NEXT_PUBLIC_API_URL}/admin/add_seminar_resource`;
      const method = 'POST';
      const response = await fetch(endpoint, {
        method,
        headers: {
          // 'Content-Type': 'multipart/form-data', // Let browser set this
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.status === 'success') {
        showToast.success(resource ? 'Resource updated!' : 'Resource added!');
        onSuccess();
        onClose();
      } else {
        showToast.error(data.message || 'Failed to save resource');
      }
    } catch (error) {
      showToast.error('Failed to save resource');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-w-lg w-[90vw] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-50">
          <Dialog.Title className="text-xl font-bold mb-4">
            {resource ? 'Edit Resource' : 'Add Resource'}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Resource Type</Label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full border rounded-md p-2"
                required
              >
                <option value="">Select type</option>
                {resourceTypes.map(rt => (
                  <option key={rt} value={rt}>{rt}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Caption</Label>
              <Input
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Enter caption/description"
                required
              />
            </div>
            <div>
              <Label>File {resource ? '(leave blank to keep current)' : ''}</Label>
              <Input
                type="file"
                accept="video/*,audio/*,.ppt,.pptx,.pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Dialog.Close asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : resource ? 'Save Changes' : 'Add Resource'}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddEditResourceModal; 