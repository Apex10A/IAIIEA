/** Designer background — keep in sync with public/certificate/Certificate of Membership.png */
export const MEMBERSHIP_CERTIFICATE_BG =
  "/certificate/Certificate%20of%20Membership.png";

/** Must match the PNG pixel size exactly (1759×1340). */
export const MEMBERSHIP_CERTIFICATE_WIDTH = 1759;
export const MEMBERSHIP_CERTIFICATE_HEIGHT = 1340;

export const MEMBERSHIP_CERTIFICATE_FONT =
  "Montserrat, var(--font-montserrat, sans-serif)";

export interface MembershipCertificateFields {
  name: string;
  membershipId: string;
  awardDate: string;
}

/** Positions tuned to the membership PNG (1759×1340, landscape). */
export const MEMBERSHIP_CERTIFICATE_LAYOUT = {
  name: {
    top: "43.8%",
    width: "72%",
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#1a3272",
  },
  membershipId: {
    top: "54.6%",
    left: "21%",
    width: "28%",
    fontSize: 15,
    fontWeight: 600,
    color: "#333333",
  },
  awardDate: {
    top: "54.6%",
    left: "59.5%",
    width: "28%",
    fontSize: 15,
    fontWeight: 600,
    color: "#333333",
  },
} as const;
