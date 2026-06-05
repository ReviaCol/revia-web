import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBookingByToken } from "@/lib/booking-store";
import { categoryLabel, humanizeSlot, type BookingCategory } from "@/lib/booking";
import { StatusPoller } from "./_components/StatusPoller";
import { Countdown } from "./_components/Countdown";

/**
 * /reserva/[token] — página personal de seguimiento de la reserva.
 *
 * Server component: lee el snapshot de Supabase por token. Inyecta el
 * `<StatusPoller />` que pollea el estado cada 20s mientras el booking sea
 * `pending_payment`; al detectar transición, fuerza un re-render server.
 *
 * Robots: noindex (es un URL personal con token).
 *
 * ADR: 03-decisions/0010-booking-pago-bold-recordatorios.md (adenda 2026-06-02)
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Tu reserva — Reviá",
  description: "Estado de tu reserva en Reviá.",
  robots: { index: false, follow: false },
};

export default async function ReservaPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const booking = await getBookingByToken(token).catch(() => null);
  if (!booking) notFound();

  const whenLabel = humanizeSlot(booking.date, booking.time);
  const catLabel = categoryLabel(booking.category);

  return (
    <main
      id="contenido"
      className="relative"
      style={{
        background: "var(--revia-cream-100)",
        minHeight: "100vh",
        padding: "clamp(48px, 8vw, 96px) clamp(16px, 4vw, 32px)",
      }}
    >
      <StatusPoller token={token} initialStatus={booking.status_mirror} />

      <div
        className="mx-auto"
        style={{
          maxWidth: "560px",
          background: "var(--revia-cream-50)",
          padding: "clamp(28px, 5vw, 48px)",
        }}
      >
        {booking.status_mirror === "pending_payment" ? (
          <PendingView
            whenLabel={whenLabel}
            catLabel={catLabel}
            paymentLink={booking.payment_link}
            expiresAt={booking.expires_at}
            token={token}
          />
        ) : booking.status_mirror === "paid" ? (
          <PaidView whenLabel={whenLabel} catLabel={catLabel} />
        ) : (
          <CancelledView
            whenLabel={whenLabel}
            catLabel={catLabel}
            category={booking.category}
          />
        )}
      </div>
    </main>
  );
}

// ─── Vistas ─────────────────────────────────────────────────────────────────

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p
      className="font-body inline-flex items-center text-coffee-700 m-0 mb-4 uppercase"
      style={{ fontSize: "11px", letterSpacing: "0.28em", gap: "12px" }}
    >
      <span
        aria-hidden="true"
        className="block"
        style={{ width: "24px", height: "1px", background: color }}
      />
      {children}
    </p>
  );
}

function Headline({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="font-display text-coffee-900 m-0 mb-5"
      style={{
        fontSize: "clamp(26px, 4vw, 36px)",
        lineHeight: 1.15,
        fontWeight: 400,
      }}
    >
      {children}
    </h1>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid gap-1 mt-3">
      <span
        className="font-body uppercase text-coffee-500"
        style={{ fontSize: "10px", letterSpacing: "0.18em" }}
      >
        {label}
      </span>
      <span
        className="font-body text-coffee-900"
        style={{ fontSize: "15px", lineHeight: 1.5 }}
      >
        {value}
      </span>
    </div>
  );
}

function WhatsAppFallback() {
  return (
    <p
      className="font-body m-0 mt-5"
      style={{ fontSize: "12px", lineHeight: 1.6, color: "var(--revia-coffee-500)" }}
    >
      ¿Algo no funciona? Escríbenos por{" "}
      <a
        href="https://wa.me/573188279094"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
        style={{ color: "var(--revia-turquesa-700)" }}
      >
        WhatsApp
      </a>
      .
    </p>
  );
}

// ── Pending ────────────────────────────────────────────────────────────────

function PendingView({
  whenLabel,
  catLabel,
  paymentLink,
  expiresAt,
  token,
}: {
  whenLabel: string;
  catLabel: string;
  paymentLink: string | null;
  expiresAt: string;
  token: string;
}) {
  return (
    <>
      <Eyebrow color="var(--revia-coffee-500)">Reserva pendiente de pago</Eyebrow>
      <Headline>
        Tu <em className="font-display" style={{ fontStyle: "italic", color: "var(--revia-turquesa-700)" }}>momento</em> te espera.
      </Headline>

      <p
        className="font-body text-coffee-700 m-0 mb-6"
        style={{ fontSize: "14px", lineHeight: 1.65 }}
      >
        Para confirmar tu reserva, completa el pago. Tu slot está reservado
        durante <Countdown expiresAt={expiresAt} />.
      </p>

      <DetailRow label="Fecha y hora" value={<strong style={{ fontWeight: 600 }}>{whenLabel}</strong>} />
      <DetailRow label="Interés" value={`Valoración ${catLabel}`} />
      <DetailRow label="Lugar" value="Cra 16 # 86B-52, Bogotá" />

      <div className="mt-7">
        {paymentLink ? (
          <a
            href={paymentLink}
            className="inline-flex items-center justify-center gap-3 bg-coffee-900 text-cream-50 px-6 py-4 font-body uppercase transition-all duration-500 ease-out hover:-translate-y-0.5"
            style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textDecoration: "none" }}
          >
            Pagar ahora
            <span aria-hidden="true">→</span>
          </a>
        ) : (
          <p
            className="font-body m-0"
            style={{ fontSize: "13px", color: "var(--revia-coffee-700)" }}
          >
            Estamos generando tu link de pago. Refresca la página en un momento.
          </p>
        )}
      </div>

      <p
        className="font-body m-0 mt-5"
        style={{ fontSize: "11px", color: "var(--revia-coffee-500)", letterSpacing: "0.06em" }}
      >
        Referencia: {token}
      </p>

      <WhatsAppFallback />
    </>
  );
}

// ── Paid ───────────────────────────────────────────────────────────────────

function PaidView({ whenLabel, catLabel }: { whenLabel: string; catLabel: string }) {
  return (
    <>
      <Eyebrow color="var(--revia-turquesa-700)">Reserva confirmada</Eyebrow>
      <Headline>Tu valoración está confirmada.</Headline>

      <p
        className="font-body text-coffee-900 m-0 mb-6"
        style={{ fontSize: "15px", lineHeight: 1.65 }}
      >
        Te esperamos para conversar sobre lo que buscas revelar — sin presión,
        con el cuidado que mereces.
      </p>

      <DetailRow label="Fecha y hora" value={<strong style={{ fontWeight: 600 }}>{whenLabel}</strong>} />
      <DetailRow label="Interés" value={`Valoración ${catLabel}`} />
      <DetailRow label="Lugar" value="Cra 16 # 86B-52, Bogotá" />

      <p
        className="font-display m-0 mt-8"
        style={{
          fontSize: "18px",
          fontStyle: "italic",
          color: "var(--revia-coffee-900)",
          lineHeight: 1.4,
        }}
      >
        Tu belleza ya existe.<br />Espera ser revelada.
      </p>

      <WhatsAppFallback />
    </>
  );
}

// ── Cancelled ──────────────────────────────────────────────────────────────

function CancelledView({
  whenLabel,
  catLabel,
  category,
}: {
  whenLabel: string;
  catLabel: string;
  category: BookingCategory;
}) {
  return (
    <>
      <Eyebrow color="var(--revia-coffee-500)">Tu reserva no se confirmó</Eyebrow>
      <Headline>Tu momento sigue esperando.</Headline>

      <p
        className="font-body text-coffee-900 m-0 mb-6"
        style={{ fontSize: "15px", lineHeight: 1.65 }}
      >
        El plazo para confirmar tu reserva pasó y liberamos el horario para
        alguien más. Pero nuestra puerta sigue abierta — cuando quieras, te
        recibimos.
      </p>

      <DetailRow label="Reserva original" value={whenLabel} />
      <DetailRow label="Interés" value={`Valoración ${catLabel}`} />

      <div className="mt-7">
        <a
          href={`/contacto?categoria=${category}`}
          className="inline-flex items-center justify-center gap-3 bg-coffee-900 text-cream-50 px-6 py-4 font-body uppercase transition-all duration-500 ease-out hover:-translate-y-0.5"
          style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.08em", textDecoration: "none" }}
        >
          Agendar de nuevo
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <WhatsAppFallback />
    </>
  );
}
