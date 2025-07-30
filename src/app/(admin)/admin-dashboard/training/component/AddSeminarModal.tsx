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
        <button className="bg-[#203a87] text-white px-4 py-2 rounded-md transition-colors">
          Add New Seminar
        </button>
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Create New Seminar - Step {step}
          </Dialog.Title>
          
          <Dialog.Close className="absolute top-4 right-4">
            <Cross2Icon className="h-4 w-4" />
          </Dialog.Close>

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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateSeminarModal;