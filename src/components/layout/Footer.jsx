import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, CheckCircle2, Globe, Mail, MapPin, Phone } from 'lucide-react';
import { Container } from '../common/Container';

const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email address.')
    .email('Please enter a valid email address.'),
});

export function Footer() {
  const [subscribedEmail, setSubscribedEmail] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    setSubscribedEmail(values.email);
    reset();
  };

  return (
    <footer className="border-t border-[#B69A69]/20 bg-[#171816] text-[#F7F5F0]">
      <Container className="py-16 sm:py-20 lg:py-24">
        {/* Top Newsletter & Brand Row */}
        <div className="grid gap-12 border-b border-[#F7F5F0]/10 pb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Link to="/" className="inline-flex flex-col leading-none">
              <span className="font-serif text-3xl tracking-[0.22em] text-[#F7F5F0]">
                VIMROLL
              </span>
              <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.42em] text-[#B69A69]">
                Estate
              </span>
            </Link>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-[#E8E1D5]/75">
              Where Exceptional Living Begins. An international residential marketplace
              and private client advisory curating extraordinary homes across six global
              capitals.
            </p>
          </div>

          <div className="lg:col-span-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
              The Private Journal
            </p>
            <h3 className="mt-2 font-serif text-2xl font-normal text-[#F7F5F0]">
              Receive seasonal off-market previews and architectural dispatches.
            </h3>

            {subscribedEmail ? (
              <div
                role="status"
                className="mt-5 flex items-start gap-3 border border-[#B69A69]/40 bg-[#222320] p-4 text-xs text-[#E8E1D5]"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#B69A69]"
                  strokeWidth={1.6}
                />
                <div>
                  <p className="font-medium text-[#F7F5F0]">
                    Demo subscription recorded for {subscribedEmail}.
                  </p>
                  <p className="mt-1 text-[#E8E1D5]/70">
                    Portfolio preview mode: no external email was dispatched.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <label htmlFor="footer-newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="footer-newsletter-email"
                      type="email"
                      placeholder="Enter your private email address"
                      aria-invalid={Boolean(errors.email)}
                      {...register('email')}
                      className="w-full border border-[#F7F5F0]/20 bg-[#222320] px-4 py-3.5 text-sm text-[#F7F5F0] placeholder:text-[#E8E1D5]/45 focus:border-[#B69A69] focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 bg-[#B69A69] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#171816] transition-colors hover:bg-[#CBB389] disabled:opacity-60"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </button>
                </div>
                {errors.email && (
                  <p role="alert" className="mt-2 text-xs text-[#E5988B]">
                    {errors.email.message}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Middle Navigation Columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
              Navigation
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-[#E8E1D5]/80">
              <li>
                <Link to="/" className="transition-colors hover:text-[#B69A69]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="transition-colors hover:text-[#B69A69]">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/collections" className="transition-colors hover:text-[#B69A69]">
                  Curated Collections
                </Link>
              </li>
              <li>
                <Link to="/locations" className="transition-colors hover:text-[#B69A69]">
                  Global Destinations
                </Link>
              </li>
              <li>
                <Link to="/saved" className="transition-colors hover:text-[#B69A69]">
                  Saved Residences
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-[#B69A69]">
                  About VIMROLL
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-[#B69A69]">
                  Private Advisory
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
              Property Categories
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-[#E8E1D5]/80">
              <li>
                <Link
                  to="/collections/waterfront-estates"
                  className="transition-colors hover:text-[#B69A69]"
                >
                  Waterfront Estates
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/modern-masterpieces"
                  className="transition-colors hover:text-[#B69A69]"
                >
                  Modern Masterpieces
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/private-villas"
                  className="transition-colors hover:text-[#B69A69]"
                >
                  Private Villas
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/penthouse-living"
                  className="transition-colors hover:text-[#B69A69]"
                >
                  Penthouse Living
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/architectural-icons"
                  className="transition-colors hover:text-[#B69A69]"
                >
                  Architectural Icons
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
              Destinations
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-[#E8E1D5]/80">
              {['Dubai', 'London', 'New York', 'Paris', 'Marbella', 'Lagos'].map(
                (city) => (
                  <li key={city}>
                    <Link
                      to={`/properties?location=${encodeURIComponent(city)}`}
                      className="transition-colors hover:text-[#B69A69]"
                    >
                      {city}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
              Private Concierge
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-[#E8E1D5]/80">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#B69A69]"
                  strokeWidth={1.5}
                />
                <span>24 Mount Street, Mayfair, London W1K 2TH</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#B69A69]" strokeWidth={1.5} />
                <a
                  href="tel:+442079460821"
                  className="transition-colors hover:text-[#B69A69]"
                >
                  +44 20 7946 0821
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#B69A69]" strokeWidth={1.5} />
                <a
                  href="mailto:concierge@vimrollestate.com"
                  className="transition-colors hover:text-[#B69A69]"
                >
                  concierge@vimrollestate.com
                </a>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <Globe className="h-4 w-4 shrink-0 text-[#B69A69]" strokeWidth={1.5} />
                <div className="flex items-center gap-4 text-xs uppercase tracking-[0.16em]">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-[#B69A69]"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-[#B69A69]"
                  >
                    LinkedIn
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="flex flex-col justify-between gap-4 border-t border-[#F7F5F0]/10 pt-8 text-xs text-[#E8E1D5]/55 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} VIMROLL Estate. All rights reserved.</p>
          <p>
            Flagship portfolio showcase — property listings and advisory profiles are
            curated demonstration content.
          </p>
        </div>
      </Container>
    </footer>
  );
}

