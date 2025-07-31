import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { CreateSeminarModalProps } from './types';
import { useSeminarModal } from './useSeminarModal';
import Step1Form from './Step1Form';
import Step2Form from './Step2Form';

const CreateSeminarModal: React.FC<CreateSeminarModalProps> = ({ onSuccess }) => {
  const {
    step,
    step1Data,
    step2Data,
    availableSpeakers,
    setStep1Data,
    setStep2Data,
    handleStep1Submit,
    handleStep2Submit,
    resetForm
  } = useSeminarModal(onSuccess);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="bg-[#203a87] text-white px-4 py-2 rounded-md transition-colors hover:bg-[#1a2f6b]">
          Add New Seminar
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900">
                Create New Seminar - Step {step}
              </Dialog.Title>
              
              <Dialog.Close className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Cross2Icon className="h-4 w-4 text-gray-500" />
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {step === 1 ? (
                <Step1Form
                  data={step1Data}
                  onDataChange={setStep1Data}
                  onSubmit={handleStep1Submit}
                />
              ) : (
                <Step2Form
                  data={step2Data}
                  onDataChange={setStep2Data}
                  onSubmit={handleStep2Submit}
                  availableSpeakers={availableSpeakers}
                />
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateSeminarModal;