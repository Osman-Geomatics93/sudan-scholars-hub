import { NextRequest, NextResponse } from 'next/server';
import { CURATED_UNIVERSITIES } from '@/lib/data/curated-universities';
import worldUniversitiesRaw from '@/lib/data/world-universities.json';

interface WorldUniversity {
  name: string;
  domains: string[];
  web_pages: string[];
  country: string;
  alpha_two_code: string;
  'state-province': string | null;
}

interface UniversityResponse {
  id: string;
  name: string;
  nameAr?: string;
  type?: 'public' | 'private';
  domain?: string;
  web?: string;
}

// Slugify for deterministic IDs
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

// Pre-index universities by country code at module load (runs once on cold start)
const indexByCountry: Record<string, WorldUniversity[]> = {};
for (const uni of worldUniversitiesRaw as WorldUniversity[]) {
  const code = (uni.alpha_two_code || '').toLowerCase();
  if (!code) continue;
  if (!indexByCountry[code]) indexByCountry[code] = [];
  indexByCountry[code].push(uni);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get('country') || '').toLowerCase().trim();

  if (!country || country.length !== 2) {
    return NextResponse.json(
      { error: 'Missing or invalid country parameter. Use ISO alpha-2 code (e.g., ?country=sd)' },
      { status: 400 }
    );
  }

  const worldUnis = indexByCountry[country] || [];
  const curatedMap = CURATED_UNIVERSITIES[country] || {};

  // Deduplicate by normalized name
  const seen = new Set<string>();
  const universities: UniversityResponse[] = [];

  // Add all world universities, merging curated data where available
  for (const wu of worldUnis) {
    const normalizedName = wu.name.toLowerCase().trim();
    if (seen.has(normalizedName)) continue;
    seen.add(normalizedName);

    const curated = curatedMap[normalizedName];
    universities.push({
      id: curated?.legacyId || slugify(wu.name),
      name: wu.name,
      nameAr: curated?.nameAr,
      type: curated?.type,
      domain: wu.domains?.[0],
      web: wu.web_pages?.[0],
    });
  }

  // Add curated universities that weren't in the world list
  for (const [normalizedName, curated] of Object.entries(curatedMap)) {
    if (seen.has(normalizedName)) continue;
    seen.add(normalizedName);
    // Capitalize each word for display name
    const displayName = normalizedName.replace(/\b\w/g, (c) => c.toUpperCase());
    universities.push({
      id: curated.legacyId,
      name: displayName,
      nameAr: curated.nameAr,
      type: curated.type,
    });
  }

  // Sort: curated (with type) first, then alphabetically
  universities.sort((a, b) => {
    if (a.type && !b.type) return -1;
    if (!a.type && b.type) return 1;
    return a.name.localeCompare(b.name);
  });

  const response = NextResponse.json({
    countryCode: country,
    total: universities.length,
    universities,
  });

  response.headers.set(
    'Cache-Control',
    'public, max-age=86400, s-maxage=604800'
  );

  return response;
}
