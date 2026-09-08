"use client";

import Image from "next/image";
import {
  MEMBERSHIP_CERTIFICATE_BG,
  MEMBERSHIP_CERTIFICATE_HEIGHT,
  MEMBERSHIP_CERTIFICATE_WIDTH,
  MembershipCertificateFields,
} from "./membershipCertificateLayout";

interface MembershipCertificateProps {
  fields: MembershipCertificateFields;
  /** When true, fills the parent container (for responsive preview). */
  responsive?: boolean;
}

export function MembershipCertificate({
  fields,
  responsive = false,
}: MembershipCertificateProps) {
  return (
    <div
      className="relative bg-white"
      style={
        responsive
          ? { width: "100%", height: "100%" }
          : {
              width: MEMBERSHIP_CERTIFICATE_WIDTH,
              height: MEMBERSHIP_CERTIFICATE_HEIGHT,
            }
      }
    >
      <Image
        src={MEMBERSHIP_CERTIFICATE_BG}
        alt=""
        fill
        className="object-fill pointer-events-none select-none"
        priority
        unoptimized
        sizes={responsive ? "960px" : `${MEMBERSHIP_CERTIFICATE_WIDTH}px`}
      />

      <p
        className={`absolute left-1/2 -translate-x-1/2 text-center font-bold uppercase tracking-wide text-[#1a3272] ${
          responsive ? "text-[clamp(18px,3.8vw,46px)]" : ""
        }`}
        style={{
          top: "44.5%",
          width: "72%",
          ...(responsive ? {} : { fontSize: 46 }),
          lineHeight: 1.2,
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {fields.name}
      </p>

      <p
        className={`absolute text-center font-semibold text-[#333333] ${
          responsive ? "text-[clamp(11px,1.15vw,22px)]" : ""
        }`}
        style={{
          top: "57.2%",
          left: "18%",
          width: "28%",
          ...(responsive ? {} : { fontSize: 22 }),
          lineHeight: 1.3,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {fields.membershipId}
      </p>

      <p
        className={`absolute text-center font-semibold text-[#333333] ${
          responsive ? "text-[clamp(11px,1.15vw,22px)]" : ""
        }`}
        style={{
          top: "57.2%",
          left: "54%",
          width: "28%",
          ...(responsive ? {} : { fontSize: 22 }),
          lineHeight: 1.3,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {fields.awardDate}
      </p>
    </div>
  );
}
