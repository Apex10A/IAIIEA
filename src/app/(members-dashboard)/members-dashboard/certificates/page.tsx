"use client";

import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import html2canvas from "html2canvas";
import { useSession } from "next-auth/react";
import { showToast } from "@/utils/toast";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MembershipCertificate } from "@/components/certificates/MembershipCertificate";
import {
  MEMBERSHIP_CERTIFICATE_HEIGHT,
  MEMBERSHIP_CERTIFICATE_WIDTH,
} from "@/components/certificates/membershipCertificateLayout";

interface CertificateData {
  name: string;
  membership_id: string;
  award_date: string;
  president_name?: string;
  sec_name?: string;
  down_text?: string;
}

function formatAwardDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CertificatesPage() {
  const certRef = useRef<HTMLDivElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.5);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useLayoutEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setPreviewScale(width / MEMBERSHIP_CERTIFICATE_WIDTH);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [certificateData]);

  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const loadCertificate = useCallback(async () => {
    if (!bearerToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/view_profile_details`,
        {
          headers: { Authorization: `Bearer ${bearerToken}` },
        }
      );

      if (!profileRes.ok) {
        throw new Error("Failed to fetch profile");
      }

      const profileJson = await profileRes.json();
      const userId = profileJson?.data?.user_id;

      if (!userId) {
        setCertificateData(null);
        return;
      }

      const certRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificate/membership/${userId}`,
        {
          headers: { Authorization: `Bearer ${bearerToken}` },
        }
      );

      if (!certRes.ok) {
        throw new Error("Failed to fetch certificate");
      }

      const certJson = await certRes.json();
      if (certJson.status === "success" && certJson.data) {
        setCertificateData(certJson.data);
      } else {
        setCertificateData(null);
      }
    } catch (error) {
      console.error("Error loading membership certificate:", error);
      showToast.error("Failed to load membership certificate");
      setCertificateData(null);
    } finally {
      setLoading(false);
    }
  }, [bearerToken]);

  useEffect(() => {
    loadCertificate();
  }, [loadCertificate]);

  const handleDownload = async () => {
    if (!certRef.current || !certificateData) return;

    setDownloading(true);
    try {
      const element = certRef.current;

      const canvas = await html2canvas(element, {
        scale: 1,
        width: MEMBERSHIP_CERTIFICATE_WIDTH,
        height: MEMBERSHIP_CERTIFICATE_HEIGHT,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      const safeName = (certificateData.name || "member")
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
      link.download = `${safeName}_IAIIEA_membership_certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast.success("Certificate downloaded");
    } catch (error) {
      console.error("Certificate download failed:", error);
      showToast.error("Failed to download certificate");
    } finally {
      setDownloading(false);
    }
  };

  const fields = certificateData
    ? {
        name: certificateData.name,
        membershipId: certificateData.membership_id,
        awardDate: formatAwardDate(certificateData.award_date),
      }
    : null;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#203a87]" />
        <p className="text-gray-600">Loading your membership certificate...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Membership Certificate
          </h1>
          <p className="text-gray-600 mt-2">
            Download your official IAIIEA membership certificate.
          </p>
        </div>
        <Button
          onClick={handleDownload}
          disabled={!fields || downloading}
          className="gap-2 bg-[#203a87] text-white hover:bg-[#1a2f6d] shrink-0"
        >
          {downloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download certificate
        </Button>
      </div>

      {!fields ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-6 text-center text-amber-900 max-w-lg mx-auto">
          <p className="font-medium">Certificate not available yet</p>
          <p className="text-sm mt-2 text-amber-800">
            We could not load your membership certificate. Confirm your membership
            is active or contact support if this continues.
          </p>
        </div>
      ) : (
        <div className="flex justify-center">
          <div
            ref={previewWrapRef}
            className="w-full max-w-[960px] overflow-hidden rounded-lg shadow-lg"
            style={{
              height: MEMBERSHIP_CERTIFICATE_HEIGHT * previewScale,
            }}
          >
            <div
              ref={certRef}
              style={{
                width: MEMBERSHIP_CERTIFICATE_WIDTH,
                height: MEMBERSHIP_CERTIFICATE_HEIGHT,
                transform: `scale(${previewScale})`,
                transformOrigin: "top left",
              }}
            >
              <MembershipCertificate fields={fields} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
