import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { showToast } from '@/utils/toast';
import { Step1Data, Step2Data, AvailableSpeaker } from './types';

export const useSeminarModal = (onSuccess: () => void) => {
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  
  const [step, setStep] = useState(1);
  const [step1Token, setStep1Token] = useState('');
  const [availableSpeakers, setAvailableSpeakers] = useState<AvailableSpeaker[]>([]);
  
  const [step1Data, setStep1Data] = useState<Step1Data>({
    title: '',
    theme: '',
    venue: '',
    start: '',
    end: '',
    mode: '',
    is_free: '',
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    token: '',
    physical_fee_naira: '',
    physical_fee_usd: '',
    virtual_fee_naira: '',
    virtual_fee_usd: '',
    speakers: []
  });

  const fetchSpeakers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/speakers_list`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      const data = await response.json();
      if (data.status === "success") {
        setAvailableSpeakers(data.data);
      }
    } catch (error) {
      showToast.error('Failed to fetch speakers');
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create_seminar/1`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(step1Data),
      });

      const data = await response.json();
      if (data.status === "success" && data.data?.token) {
        setStep1Token(data.data.token);
        setStep2Data(prev => ({ ...prev, token: data.data.token }));
        setStep(2);
        showToast.success('Step 1 completed successfully');
      } else {
        showToast.error("Failed to create seminar");
        throw new Error(data.message || 'Failed to create seminar');
      }
    } catch (error) {
      showToast.error('Failed to create seminar');
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert string values to numbers for API submission
      const submissionData = {
        ...step2Data,
        physical_fee_naira: step2Data.physical_fee_naira === '' ? 0 : Number(step2Data.physical_fee_naira),
        physical_fee_usd: step2Data.physical_fee_usd === '' ? 0 : Number(step2Data.physical_fee_usd),
        virtual_fee_naira: step2Data.virtual_fee_naira === '' ? 0 : Number(step2Data.virtual_fee_naira),
        virtual_fee_usd: step2Data.virtual_fee_usd === '' ? 0 : Number(step2Data.virtual_fee_usd),
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create_seminar/2`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      if (data.status === "success") {
        showToast.success('Seminar created successfully');
        onSuccess();
        resetForm();
      } else {
        throw new Error(data?.message || 'Failed to complete seminar creation');
      }
    } catch (error) {
      showToast.error('Failed to complete seminar creation');
    }
  };

  const resetForm = () => {
    setStep(1);
    setStep1Token('');
    setStep1Data({
      title: '',
      theme: '',
      venue: '',
      start: '',
      end: '',
      mode: '',
      is_free: '',
    });
    setStep2Data({
      token: '',
      physical_fee_naira: '',
      physical_fee_usd: '',
      virtual_fee_naira: '',
      virtual_fee_usd: '',
      speakers: []
    });
  };

  useEffect(() => {
    fetchSpeakers();
  }, [bearerToken]);

  return {
    step,
    step1Data,
    step2Data,
    availableSpeakers,
    setStep1Data,
    setStep2Data,
    handleStep1Submit,
    handleStep2Submit,
    resetForm
  };
};