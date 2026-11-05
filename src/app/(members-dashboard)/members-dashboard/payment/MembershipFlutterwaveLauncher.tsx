"use client";

import { useEffect, useRef } from "react";
import { useFlutterwave } from "flutterwave-react-v3";
import type {
  FlutterwaveConfig,
  FlutterWaveResponse,
} from "flutterwave-react-v3/dist/types";

type Props = {
  config: FlutterwaveConfig | null;
  onSuccess: (response: FlutterWaveResponse) => void;
  onClose: () => void;
};

const PLACEHOLDER_CONFIG: FlutterwaveConfig = {
  public_key: "",
  tx_ref: "",
  amount: 0,
  currency: "USD",
  customer: { email: "", name: "" },
};

export default function MembershipFlutterwaveLauncher({
  config,
  onSuccess,
  onClose,
}: Props) {
  const openedTxRef = useRef<string | null>(null);
  const handleFlutterPayment = useFlutterwave(config ?? PLACEHOLDER_CONFIG);

  useEffect(() => {
    if (!config?.public_key || !config.tx_ref) return;
    if (openedTxRef.current === config.tx_ref) return;
    openedTxRef.current = config.tx_ref;

    handleFlutterPayment({
      callback: (response) => {
        openedTxRef.current = null;
        onSuccess(response);
      },
      onClose: () => {
        openedTxRef.current = null;
        onClose();
      },
    });
  }, [config, handleFlutterPayment, onSuccess, onClose]);

  return null;
}
