import {
  Clock,
  Compass,
  Navigation,
  Plane,
  ShieldCheck,
  SunMedium,
  Volume2,
} from 'lucide-react';

/**
 * Beyond-Expected UHNW Enclave, Aviation & Technical Intelligence Dossier.
 * Displays private jet FBO proximity, heliport / yacht access, solar orientation,
 * acoustic glazing rating, security protocol tier, and local timezone.
 */
export function EnclaveIntelligence({ property }) {
  const intel = property?.enclaveIntelligence;
  if (!intel) return null;

  const metrics = [
    {
      icon: Plane,
      label: 'Private Aviation FBO',
      value: intel.privateAviation,
      detail: 'Chauffeur / Maybach tarmac transfer',
    },
    {
      icon: Navigation,
      label: 'Heliport & Maritime Access',
      value: intel.heliportAccess,
      detail: 'Direct vertical or tender arrival',
    },
    {
      icon: SunMedium,
      label: 'Solar & Glazing Profile',
      value: intel.solarProfile,
      detail: property.spatial3D?.orientation || 'Optimal natural daylight trajectory',
    },
    {
      icon: Volume2,
      label: 'Acoustic Isolation',
      value: intel.acousticRating,
      detail: 'Museum-grade silence & climate control',
    },
    {
      icon: ShieldCheck,
      label: 'Security Protocol Tier',
      value: intel.securityTier,
      detail: 'Discreet 24/7 private estate protection',
    },
    {
      icon: Clock,
      label: 'Enclave Climate & Time',
      value: `${intel.climate} · ${intel.timezone}`,
      detail: `${property.location.neighbourhood}, ${property.location.city}`,
    },
  ];

  return (
    <section
      aria-label="Private aviation and technical enclave intelligence"
      className="border-t border-[#E8E1D5] pt-10"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
            <Compass className="h-3.5 w-3.5" strokeWidth={1.6} />
            <span>UHNW Logistics & Technical Brief</span>
          </p>
          <h2 className="mt-2 font-serif text-3xl font-normal text-[#171816]">
            Aviation, Security & Environmental Intelligence
          </h2>
        </div>

        <span className="border border-[#E8E1D5] bg-[#EFECE5] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]">
          Verified Dossier · {property.reference}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex flex-col justify-between border border-[#E8E1D5] bg-white p-5 transition-colors hover:border-[#B69A69]/70"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B69A69]">
                    {item.label}
                  </span>
                  <Icon className="h-4 w-4 text-[#B69A69]" strokeWidth={1.5} />
                </div>
                <p className="mt-2.5 font-serif text-lg leading-snug text-[#171816]">
                  {item.value}
                </p>
              </div>
              <p className="mt-3 border-t border-[#E8E1D5]/70 pt-2.5 text-xs text-[#41413D]/75">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

