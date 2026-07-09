"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * AdminShell — chrome compartido del panel /admin (rediseño 2026-07-09).
 * Header pegajoso con el logo real de Reviá + navegación Leads/Catálogo, hoja de
 * estilos scopeada bajo `.adm`, y encabezado de página con título + acción.
 * Lo usan LeadsBoard y CatalogBoard para que el admin se sienta un solo producto.
 */

export const ADMIN_STYLES = `
.adm { background: var(--revia-cream-50); min-height: 100vh; color: var(--revia-coffee-900); font-family: var(--font-manrope); }
.adm-top { position: sticky; top: 0; z-index: 20; background: rgba(251,246,241,0.94); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(89,65,60,0.12); }
.adm-top-in { max-width: 1240px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 18px 40px; flex-wrap: wrap; }
.adm-brandwrap { display: flex; align-items: center; gap: 30px; flex-wrap: wrap; }
.adm-logo { height: 34px; width: auto; display: block; }
.adm-nav { display: flex; gap: 24px; align-items: center; }
.adm-nav a { font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; text-decoration: none; color: var(--revia-coffee-500); transition: color .2s ease; }
.adm-nav a:hover { color: var(--revia-coffee-900); }
.adm-nav a.is-active { color: var(--revia-coffee-900); font-weight: 600; }
.adm-top-right { display: flex; align-items: center; gap: 20px; }
.adm-saving { font-size: 13px; color: var(--revia-coffee-500); font-style: italic; }
.adm-email { font-size: 14px; color: var(--revia-coffee-700); }

.adm-wrap { max-width: 1240px; margin: 0 auto; padding: 48px 40px 130px; }
.adm-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; flex-wrap: wrap; margin-bottom: 32px; }
.adm-title { font-family: var(--font-jost); font-size: clamp(32px, 3.4vw, 42px); line-height: 1.08; margin: 0; letter-spacing: -0.015em; }
.adm-sub { font-size: 17px; color: var(--revia-coffee-700); margin: 12px 0 0; max-width: 640px; line-height: 1.6; }

.adm-note { display: flex; gap: 12px; padding: 17px 20px; background: var(--revia-cream-100); border-left: 3px solid var(--revia-amber-300); border-radius: 4px; margin-bottom: 34px; font-size: 15px; line-height: 1.6; color: var(--revia-coffee-700); }
.adm-note strong { color: var(--revia-coffee-900); }

.adm-alert { padding: 15px 18px; border-radius: 4px; margin-bottom: 24px; font-size: 15px; }
.adm-alert-err { background: rgba(178,74,58,0.09); color: var(--revia-terracotta-600); }

.adm-cat { background: #fffdfb; border: 1px solid rgba(89,65,60,0.14); border-radius: 10px; padding: 30px 32px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(89,65,60,0.05); }
.adm-cat-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
.adm-cat-titlewrap { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.adm-cat-name { font-family: var(--font-jost); font-size: 27px; line-height: 1.2; margin: 0; letter-spacing: -0.01em; }
.adm-cat-metaline { font-size: 13px; color: var(--revia-coffee-500); margin: 9px 0 0; letter-spacing: 0.03em; }
.adm-cat-headline { font-size: 15px; font-style: italic; color: var(--revia-coffee-700); margin: 9px 0 0; }
.adm-pill { display: inline-block; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 13px; border-radius: 999px; color: var(--revia-coffee-900); font-weight: 500; }

.adm-tr-list { margin-top: 26px; border-top: 1px solid rgba(89,65,60,0.10); }
.adm-tr { display: flex; align-items: flex-start; justify-content: space-between; gap: 22px; padding: 24px 0; border-bottom: 1px solid rgba(89,65,60,0.10); flex-wrap: wrap; }
.adm-tr:last-child { border-bottom: none; }
.adm-tr.is-hidden .adm-tr-body { opacity: 0.5; }
.adm-tr-body { min-width: 280px; flex: 1; }
.adm-tr-name { font-size: 19px; font-weight: 600; margin: 0; color: var(--revia-coffee-900); }
.adm-tr-sum { font-size: 15px; line-height: 1.55; color: var(--revia-coffee-700); margin: 8px 0 0; max-width: 640px; }
.adm-tr-zones { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--revia-coffee-500); margin: 11px 0 0; }
.adm-tag { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--revia-coffee-500); margin-left: 11px; padding: 3px 8px; border: 1px solid rgba(89,65,60,0.22); border-radius: 999px; }
.adm-actions { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; justify-content: flex-end; }

.adm-add { width: 100%; margin-top: 24px; padding: 17px; border: 1.5px dashed rgba(89,65,60,0.32); border-radius: 7px; background: transparent; color: var(--revia-coffee-900); font-family: var(--font-manrope); font-size: 15px; font-weight: 500; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all .2s ease; }
.adm-add:hover { border-color: var(--revia-coffee-900); background: rgba(89,65,60,0.045); }
.adm-add .plus { font-size: 20px; line-height: 1; }

.adm-btn { font-family: var(--font-manrope); font-size: 14px; padding: 10px 18px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; line-height: 1; white-space: nowrap; transition: all .18s ease; border: 1px solid transparent; font-weight: 500; }
.adm-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.adm-btn-primary { background: var(--revia-coffee-900); color: var(--revia-cream-50); border-color: var(--revia-coffee-900); }
.adm-btn-primary:hover:not(:disabled) { background: var(--revia-coffee-700); border-color: var(--revia-coffee-700); }
.adm-btn-outline { background: transparent; color: var(--revia-coffee-900); border-color: rgba(89,65,60,0.28); }
.adm-btn-outline:hover:not(:disabled) { border-color: var(--revia-coffee-900); background: rgba(89,65,60,0.045); }
.adm-btn-danger { background: transparent; color: var(--revia-terracotta-600); border-color: rgba(178,74,58,0.35); }
.adm-btn-danger:hover:not(:disabled) { background: rgba(178,74,58,0.09); border-color: var(--revia-terracotta-600); }
.adm-btn-ghost { background: transparent; color: var(--revia-coffee-700); border-color: transparent; }
.adm-btn-ghost:hover:not(:disabled) { color: var(--revia-coffee-900); background: rgba(89,65,60,0.05); }
.adm-btn-lg { font-size: 15px; padding: 13px 24px; }
.adm-ico { width: 42px; height: 42px; padding: 0; justify-content: center; font-size: 17px; }

.adm-toggle { font-family: var(--font-manrope); font-size: 13px; font-weight: 600; letter-spacing: 0.05em; padding: 9px 15px; border-radius: 999px; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; border: 1px solid; transition: all .18s ease; }
.adm-toggle:disabled { opacity: 0.5; cursor: not-allowed; }
.adm-toggle .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.adm-toggle-on { background: rgba(122,169,186,0.16); color: var(--revia-coffee-900); border-color: rgba(122,169,186,0.55); }
.adm-toggle-on .dot { background: var(--revia-sky-500); }
.adm-toggle-off { background: transparent; color: var(--revia-coffee-500); border-color: rgba(89,65,60,0.24); }

.adm-form { display: grid; gap: 20px; background: var(--revia-cream-100); border: 1px solid rgba(89,65,60,0.18); border-radius: 8px; padding: 26px; }
.adm-form-title { font-family: var(--font-jost); font-size: 21px; margin: 0; }
.adm-field label { display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--revia-coffee-700); margin-bottom: 9px; font-weight: 600; }
.adm-hint { font-size: 13px; color: var(--revia-coffee-500); margin: 7px 0 0; }
.adm-input { width: 100%; font-family: var(--font-manrope); font-size: 16px; padding: 12px 15px; border: 1px solid rgba(89,65,60,0.24); border-radius: 6px; background: #fff; color: var(--revia-coffee-900); }
.adm-input:focus { outline: none; border-color: var(--revia-coffee-900); box-shadow: 0 0 0 3px rgba(89,65,60,0.08); }
textarea.adm-input { resize: vertical; min-height: 80px; line-height: 1.55; }
select.adm-input { cursor: pointer; }
.adm-row { display: flex; gap: 20px; flex-wrap: wrap; }
.adm-row > .adm-field { flex: 1; min-width: 240px; }
.adm-check { display: inline-flex; align-items: center; gap: 11px; font-size: 16px; color: var(--revia-coffee-900); cursor: pointer; }
.adm-check input { width: 19px; height: 19px; accent-color: var(--revia-coffee-900); cursor: pointer; }
.adm-form-actions { display: flex; gap: 14px; align-items: center; }

.adm-empty { font-size: 16px; color: var(--revia-coffee-700); padding: 8px 0 4px; }

.adm-filters { display: flex; flex-wrap: wrap; gap: 11px; margin-bottom: 34px; }
.adm-filter { font-family: var(--font-manrope); font-size: 13px; letter-spacing: 0.07em; text-transform: uppercase; padding: 11px 20px; border-radius: 999px; border: 1px solid rgba(89,65,60,0.22); background: transparent; color: var(--revia-coffee-700); cursor: pointer; transition: all .18s ease; font-weight: 500; }
.adm-filter:hover { border-color: var(--revia-coffee-900); color: var(--revia-coffee-900); }
.adm-filter.is-active { background: var(--revia-coffee-900); color: var(--revia-cream-50); border-color: var(--revia-coffee-900); }

.adm-lead-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; flex-wrap: wrap; }
.adm-lead-name { font-family: var(--font-jost); font-size: 24px; line-height: 1.2; margin: 0; }
.adm-lead-contact { font-size: 15px; color: var(--revia-coffee-700); margin: 9px 0 0; }
.adm-lead-contact a { color: var(--revia-coffee-700); text-decoration: none; }
.adm-lead-contact a:hover { color: var(--revia-coffee-900); text-decoration: underline; }
.adm-estado { display: inline-block; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; border-radius: 999px; color: var(--revia-coffee-900); font-weight: 600; }
.adm-lead-date { font-size: 13px; color: var(--revia-coffee-500); margin: 11px 0 0; }
.adm-lead-interes { font-size: 15px; color: var(--revia-coffee-700); margin: 18px 0 0; }
.adm-lead-msg { font-size: 16px; line-height: 1.6; color: var(--revia-coffee-900); margin: 16px 0 0; white-space: pre-wrap; }
.adm-lead-controls { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 28px; margin-top: 26px; }
`;

export function AdminShell({
  active,
  userEmail,
  busy,
  title,
  subtitle,
  action,
  children,
}: {
  active: "leads" | "catalogo";
  userEmail: string;
  busy?: boolean;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <main id="contenido" className="adm">
      <style>{ADMIN_STYLES}</style>

      <div className="adm-top">
        <div className="adm-top-in">
          <div className="adm-brandwrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="adm-logo" src="/brand/revia-logo-terra.png" alt="Reviá" />
            <nav className="adm-nav">
              <Link href="/admin" className={active === "leads" ? "is-active" : ""}>Leads</Link>
              <Link href="/admin/catalogo" className={active === "catalogo" ? "is-active" : ""}>Catálogo</Link>
            </nav>
          </div>
          <div className="adm-top-right">
            {busy && <span className="adm-saving">Guardando…</span>}
            <span className="adm-email">{userEmail}</span>
            <button type="button" className="adm-btn adm-btn-ghost" onClick={logout}>Salir</button>
          </div>
        </div>
      </div>

      <div className="adm-wrap">
        {(title || action) && (
          <div className="adm-head">
            <div>
              {title && <h1 className="adm-title">{title}</h1>}
              {subtitle && <p className="adm-sub">{subtitle}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </main>
  );
}
