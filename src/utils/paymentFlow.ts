/** Where the processor redirects after checkout (often appends `reference` or `payment_id`). */
export function getPaymentCallbackUrl(): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ||
        process.env.NEXTAUTH_URL ||
        "";

  const base = origin.replace(/\/$/, "");
  return `${base}/members-dashboard?tab=payment`;
}

/** Payment id from the return URL after Squad (or similar) redirect. */
export function getPaymentIdFromReturnSearchParams(
  searchParams: Pick<URLSearchParams, "get">
): string | null {
  const direct = searchParams.get("payment_id")?.trim();
  if (direct) return direct;

  for (const key of ["reference", "transaction_ref", "ref"] as const) {
    const value = searchParams.get(key)?.trim();
    if (value) return value;
  }

  return null;
}

export function getPaymentLinkFromInitiateResponse(
  payload: unknown
): string | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const data =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const link = data.payment_link ?? data.link;
  return typeof link === "string" && link.trim().length > 0 ? link.trim() : null;
}

const PENDING_PAYMENT_CONTEXT_KEY = "iaiiea_pending_payment_context";

export type PendingPaymentKind = "conference" | "seminar" | "membership";

export interface PendingPaymentContext {
  kind: PendingPaymentKind;
  id: number;
  plan?: string;
  /** Conference attendance: virtual | physical */
  type?: "virtual" | "physical";
  /** Seminar attendance */
  mode?: "virtual" | "physical";
}

export interface PendingPaymentInitiateInput {
  payment_id: string;
  title: string;
  amount?: number;
  currency?: string;
  sub_payments?: Record<string, number> | [];
  id?: number;
  event_id?: number;
  conference_id?: number;
  seminar_id?: number;
  plan?: string;
  type?: string;
  mode?: string;
  attendance_type?: string;
}

export function savePendingPaymentContext(
  storageKey: string,
  context: PendingPaymentContext
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(PENDING_PAYMENT_CONTEXT_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, PendingPaymentContext>) : {};
    map[storageKey] = context;
    sessionStorage.setItem(PENDING_PAYMENT_CONTEXT_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
}

export function getPendingPaymentContext(
  storageKey: string
): PendingPaymentContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_PAYMENT_CONTEXT_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, PendingPaymentContext>;
    return map[storageKey] ?? null;
  } catch {
    return null;
  }
}

function resolvePendingPaymentContext(
  payment: PendingPaymentInitiateInput
): PendingPaymentContext | null {
  const direct = getPendingPaymentContext(payment.payment_id);
  if (direct) return direct;

  const eventId = resolveEventId(payment);
  if (eventId != null) {
    const kind = inferPendingPaymentKind(payment);
    if (kind === "conference") {
      return getPendingPaymentContext(`conference-${eventId}`);
    }
    if (kind === "seminar") {
      return getPendingPaymentContext(`seminar-${eventId}`);
    }
  }

  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_PAYMENT_CONTEXT_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, PendingPaymentContext>;
    const kind = inferPendingPaymentKind(payment);
    const matches = Object.values(map).filter((ctx) => ctx.kind === kind);
    return matches.length === 1 ? matches[0] : null;
  } catch {
    return null;
  }
}

function inferPendingPaymentKind(
  payment: PendingPaymentInitiateInput
): PendingPaymentKind {
  const idUpper = payment.payment_id.toUpperCase();
  const titleLower = payment.title.toLowerCase();

  if (titleLower.includes("conference") || idUpper.includes("-CNF")) {
    return "conference";
  }
  if (
    titleLower.includes("seminar") ||
    titleLower.includes("webinar") ||
    idUpper.includes("-SEM")
  ) {
    return "seminar";
  }
  if (
    titleLower.includes("membership") ||
    titleLower.includes("dues") ||
    titleLower.includes("subscription") ||
    idUpper.includes("-MEM") ||
    idUpper.includes("-MBR")
  ) {
    return "membership";
  }
  return "membership";
}

export function inferPendingPaymentKindFromItem(
  payment: PendingPaymentInitiateInput
): PendingPaymentKind {
  return inferPendingPaymentKind(payment);
}

export async function enrichPendingPaymentForInitiate(
  payment: PendingPaymentInitiateInput,
  bearerToken: string
): Promise<PendingPaymentInitiateInput> {
  if (resolveEventId(payment)) return payment;

  const kind = inferPendingPaymentKind(payment);
  if (kind !== "conference" && kind !== "seminar") return payment;

  const endpoint =
    kind === "conference" ? "/landing/events" : "/landing/seminars";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
      {
        headers: { Authorization: `Bearer ${bearerToken}` },
      }
    );
    const json = await response.json();
    const list = Array.isArray(json?.data) ? json.data : [];
    const active = list.filter((item: { status?: string }) => {
      const status = (item.status || "").toLowerCase();
      return status === "incoming" || status === "ongoing";
    });

    if (active.length !== 1) return payment;

    const eventId = Number(active[0]?.id);
    if (!Number.isFinite(eventId) || eventId <= 0) return payment;

    return kind === "conference"
      ? { ...payment, conference_id: eventId, id: eventId }
      : { ...payment, seminar_id: eventId, id: eventId };
  } catch {
    return payment;
  }
}

function resolveEventId(payment: PendingPaymentInitiateInput): number | undefined {
  const candidates = [
    payment.id,
    payment.conference_id,
    payment.seminar_id,
    payment.event_id,
  ];
  for (const value of candidates) {
    const num = Number(value);
    if (Number.isFinite(num) && num > 0) return num;
  }
  return undefined;
}

function resolveAttendanceType(
  payment: PendingPaymentInitiateInput,
  context: PendingPaymentContext | null
): "virtual" | "physical" {
  const raw =
    payment.type ??
    payment.mode ??
    payment.attendance_type ??
    context?.type ??
    context?.mode ??
    "virtual";
  const normalized = String(raw).toLowerCase();
  return normalized === "physical" ? "physical" : "virtual";
}

/** Resume checkout for an existing pending payment (same initiate routes as registration). */
export function buildPendingPaymentInitiateRequest(
  payment: PendingPaymentInitiateInput,
  selectedPlan: string,
  callbackUrl: string
): { path: string; body: Record<string, unknown> } {
  const kind = inferPendingPaymentKind(payment);
  const context = resolvePendingPaymentContext(payment);
  const plan =
    normalizePlanForApi(selectedPlan) ||
    normalizePlanForApi(payment.plan ?? "") ||
    normalizePlanForApi(context?.plan ?? "");

  if (kind === "conference") {
    const eventId = resolveEventId(payment) ?? context?.id;
    if (!eventId) {
      throw new Error(
        "Conference ID is missing for this payment. Open the conference page and register again, or ask support to link this pending payment."
      );
    }

    return {
      path: "conference/initiate_pay/",
      body: {
        id: eventId,
        plan: plan || "standard",
        type: resolveAttendanceType(payment, context),
        callback_url: callbackUrl,
        payment_id: payment.payment_id,
      },
    };
  }

  if (kind === "seminar") {
    const eventId = resolveEventId(payment) ?? context?.id;
    if (!eventId) {
      throw new Error(
        "Seminar ID is missing for this payment. Open the seminar page and register again."
      );
    }

    return {
      path: "seminar/initiate_pay/",
      body: {
        id: eventId,
        mode: resolveAttendanceType(payment, context),
        callback_url: callbackUrl,
        payment_id: payment.payment_id,
      },
    };
  }

  const membershipPlan =
    plan ||
    normalizePlanForApi(payment.plan ?? "") ||
    normalizePlanForApi(context?.plan ?? "") ||
    defaultPlanFromSubPayments(payment);

  return {
    path: "membership/initiate_pay/",
    body: {
      payment_id: payment.payment_id,
      callback_url: callbackUrl,
      plan: membershipPlan || "basic",
    },
  };
}

/** Backend route(s) for membership checkout — sandbox may only expose these once deployed. */
export const MEMBERSHIP_INITIATE_PAY_PATHS = [
  "membership/initiate_pay/",
  "member/initiate_pay/",
] as const;

export function resolvePendingPaymentAmount(
  payment: PendingPaymentInitiateInput,
  selectedPlan: string
): number {
  if (
    payment.sub_payments &&
    typeof payment.sub_payments === "object" &&
    !Array.isArray(payment.sub_payments) &&
    selectedPlan &&
    payment.sub_payments[selectedPlan] != null
  ) {
    return Number(payment.sub_payments[selectedPlan]);
  }
  return Number(payment.amount ?? 0);
}

export async function postInitiatePay(
  path: string,
  body: Record<string, unknown>,
  bearerToken: string
): Promise<{ response: Response; result: Record<string, unknown> }> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(body),
  });

  let result: Record<string, unknown> = {};
  try {
    result = (await response.json()) as Record<string, unknown>;
  } catch {
    result = { status: "error", message: "Invalid server response" };
  }

  return { response, result };
}

/** Try membership initiate routes; returns null if every path is 404. */
export async function tryMembershipInitiatePay(
  body: Record<string, unknown>,
  bearerToken: string
): Promise<{
  response: Response;
  result: Record<string, unknown>;
  path: string;
} | null> {
  for (const path of MEMBERSHIP_INITIATE_PAY_PATHS) {
    const { response, result } = await postInitiatePay(path, body, bearerToken);
    if (response.status === 404) continue;
    return { response, result, path };
  }
  return null;
}

function defaultPlanFromSubPayments(
  payment: PendingPaymentInitiateInput
): string {
  if (
    payment.sub_payments &&
    typeof payment.sub_payments === "object" &&
    !Array.isArray(payment.sub_payments)
  ) {
    const first = Object.keys(payment.sub_payments)[0];
    if (first) return normalizePlanForApi(first) || first;
  }
  return "";
}

function normalizePlanForApi(plan: string): string {
  const trimmed = plan.trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  if (lower === "basic" || lower === "standard" || lower === "premium") {
    return lower;
  }
  if (lower.includes("standard")) return "standard";
  if (lower.includes("basic")) return "basic";
  if (lower.includes("premium")) return "premium";

  return trimmed;
}

export async function confirmPaymentWithId(
  paymentId: string,
  bearerToken: string
): Promise<{ status: string; message?: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/confirm_payment/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({ payment_id: paymentId }),
    }
  );

  const result = await response.json();
  return result;
}
