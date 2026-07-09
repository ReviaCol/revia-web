import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * equipo.ts — read-layer de especialidades (visible) y médicos (oculto) (CMS Fase 2).
 * ADR: 03-decisions/0016-cms-fase2-hero-faqs-equipo.md
 * Tag "site-content". Fallback estático a lo hardcodeado.
 */

const TAG = "site-content";

/* ── Especialidades (visible en /nosotros#equipo) ─────────────────────────── */

const FALLBACK_SPECIALTIES: string[] = [
  "Dermatólogos",
  "Médicos estéticos",
  "Nutricionistas",
  "Especialistas en medicina regenerativa",
  "Tricólogos",
  "Especialistas en bienestar y longevidad",
];

function publicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

async function fetchSpecialtiesFromDb(): Promise<string[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { data, error } = await publicClient()
    .from("specialties")
    .select("name,sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return null;
  return (data as { name: string }[]).map((r) => r.name);
}

const getCachedSpecialties = unstable_cache(
  async (): Promise<string[]> => {
    const fromDb = await fetchSpecialtiesFromDb();
    if (!fromDb) throw new Error("specialties: DB read failed or empty");
    return fromDb;
  },
  ["revia-specialties"],
  { tags: [TAG] },
);

export async function getSpecialties(): Promise<string[]> {
  try {
    return await getCachedSpecialties();
  } catch {
    return FALLBACK_SPECIALTIES;
  }
}

/* ── Médicos (CMS oculto, se renderiza en Fase 3) ──────────────────────────── */

export type TeamMember = {
  id: string;
  name: string;
  specialty: string;
  credentials: string[];
  quote: string | null;
  photoUrl: string | null;
};

type MemberRow = {
  id: string;
  name: string;
  specialty: string;
  credentials: string[] | null;
  quote: string | null;
  photo_url: string | null;
};

async function fetchMembersFromDb(): Promise<TeamMember[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const { data, error } = await publicClient()
    .from("team_members")
    .select("id,name,specialty,credentials,quote,photo_url,sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return null;
  return (data as MemberRow[]).map((r) => ({
    id: r.id,
    name: r.name,
    specialty: r.specialty,
    credentials: r.credentials ?? [],
    quote: r.quote,
    photoUrl: r.photo_url,
  }));
}

const getCachedMembers = unstable_cache(
  async (): Promise<TeamMember[]> => {
    const fromDb = await fetchMembersFromDb();
    if (!fromDb) throw new Error("team_members: DB read failed or empty");
    return fromDb;
  },
  ["revia-team-members"],
  { tags: [TAG] },
);

/** Médicos visibles. Aún NO se renderiza en el sitio (Fase 3). */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    return await getCachedMembers();
  } catch {
    return [];
  }
}
