"use client";

import {
  MEMBERSHIP_CERTIFICATE_BG,
  MEMBERSHIP_CERTIFICATE_FONT,
  MEMBERSHIP_CERTIFICATE_HEIGHT,
  MEMBERSHIP_CERTIFICATE_LAYOUT,
  MEMBERSHIP_CERTIFICATE_WIDTH,
  MembershipCertificateFields,
} from "./membershipCertificateLayout";

interface MembershipCertificateProps {
  fields: MembershipCertificateFields;
}

export function MembershipCertificate({ fields }: MembershipCertificateProps) {
  const { name, membershipId, awardDate } = MEMBERSHIP_CERTIFICATE_LAYOUT;

  return (
    <div
      className="relative shrink-0 bg-white"
      style={{
        width: MEMBERSHIP_CERTIFICATE_WIDTH,
        height: MEMBERSHIP_CERTIFICATE_HEIGHT,
        fontFamily: MEMBERSHIP_CERTIFICATE_FONT,
      }}
    >
      {/* Native resolution background — avoids Next/Image resize blur */}
      <img
        src={MEMBERSHIP_CERTIFICATE_BG}
        alt=""
        width={MEMBERSHIP_CERTIFICATE_WIDTH}
        height={MEMBERSHIP_CERTIFICATE_HEIGHT}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill"
        draggable={false}
        decoding="sync"
      />

      <p
        className="absolute left-1/2 -translate-x-1/2 text-center uppercase"
        style={{
          top: name.top,
          width: name.width,
          fontSize: name.fontSize,
          fontWeight: name.fontWeight,
          letterSpacing: name.letterSpacing,
          color: name.color,
          lineHeight: 1.15,
          fontFamily: MEMBERSHIP_CERTIFICATE_FONT,
        }}
      >
        {fields.name}
      </p>

      <p
        className="absolute text-center"
        style={{
          top: membershipId.top,
          left: membershipId.left,
          width: membershipId.width,
          fontSize: membershipId.fontSize,
          fontWeight: membershipId.fontWeight,
          color: membershipId.color,
          lineHeight: 1.2,
          fontFamily: MEMBERSHIP_CERTIFICATE_FONT,
        }}
      >
        {fields.membershipId}
      </p>

      <p
        className="absolute text-center"
        style={{
          top: awardDate.top,
          left: awardDate.left,
          width: awardDate.width,
          fontSize: awardDate.fontSize,
          fontWeight: awardDate.fontWeight,
          color: awardDate.color,
          lineHeight: 1.2,
          fontFamily: MEMBERSHIP_CERTIFICATE_FONT,
        }}
      >
        {fields.awardDate}
      </p>
    </div>
  );
}
