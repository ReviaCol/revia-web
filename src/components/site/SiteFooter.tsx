import Image from "next/image";
import Link from "next/link";
import { getSiteContact } from "@/lib/site-content";

/**
 * SiteFooter — port del footer del mockup Claude Design.
 * Logo cream + manifiesto + Instagram destacado + 3 columnas + copyright.
 */
export async function SiteFooter() {
  const contact = await getSiteContact();
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Image
            className="flogo"
            src="/brand/revia-logo-cream.png"
            alt="Reviá"
            width={220}
            height={90}
          />
          <p className="fmanif">
            Tu belleza ya existe.
            <br />
            Espera ser revelada.
          </p>
          <a
            className="fig"
            href={contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ic">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="#FBF6F1"
                  strokeWidth="1.6"
                />
                <circle cx="12" cy="12" r="4" stroke="#FBF6F1" strokeWidth="1.6" />
                <circle cx="17.5" cy="6.5" r="1" fill="#FBF6F1" />
              </svg>
            </span>
            <span>
              <span className="k">Síguenos en Instagram</span>
              <span className="h">{contact.instagramHandle}</span>
            </span>
          </a>
        </div>

        <div className="fcol">
          <div className="ct">Explorar</div>
          <ul>
            <li>
              <Link href="/nosotros">Nosotros</Link>
            </li>
            <li>
              <Link href="/tratamientos">Tratamientos</Link>
            </li>
            <li>
              <Link href="/longevidad">Longevidad</Link>
            </li>
            <li>
              <Link href="/contacto">Contacto</Link>
            </li>
          </ul>
        </div>

        <div className="fcol">
          <div className="ct">Contacto</div>
          <ul>
            <li>
              <Link href="/contacto">{contact.address.split(",")[0]}</Link>
            </li>
            <li>
              <a href={contact.telHref}>{contact.telDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          </ul>
        </div>

        <div className="fcol">
          <div className="ct">Legal</div>
          <ul>
            <li>
              <Link href="/privacidad">Privacidad</Link>
            </li>
            <li>
              <Link href="/terminos">Términos</Link>
            </li>
            <li>
              <Link href="/aviso-medico">Aviso médico</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap copyright">
        © 2026 Reviá — Belleza y Vitalidad. Todos los derechos reservados.
      </div>
    </footer>
  );
}
