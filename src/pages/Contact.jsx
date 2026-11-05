import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { PageMeta } from '../components/common/PageMeta';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { LuxurySelect } from '../components/common/LuxurySelect';
import { PageTransition } from '../components/animations/PageTransition';
import { useAllPropertiesQuery } from '../features/properties/useProperties';
import { submitDemoEnquiry } from '../services/api';

const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z.string().trim().optional(),
  preferredContact: z.enum(['Email', 'Telephone', 'WhatsApp']),
  propertyOfInterest: z.string().min(1, 'Please select an enquiry subject or property.'),
  message: z
    .string()
    .trim()
    .min(12, 'Please share a brief message (at least 12 characters).'),
});

const CONTACT_METHOD_OPTIONS = [
  { label: 'Email', value: 'Email' },
  { label: 'Telephone Call', value: 'Telephone' },
  { label: 'Private WhatsApp', value: 'WhatsApp' },
];

const OFFICES = [
  {
    city: 'London',
    address: '24 Mount Street, Mayfair, London W1K 2TH',
    phone: '+44 20 7946 0821',
    email: 'london@vimrollestate.com',
  },
  {
    city: 'Dubai',
    address: 'Gate Village Building 8, DIFC, Dubai',
    phone: '+971 4 550 9310',
    email: 'dubai@vimrollestate.com',
  },
  {
    city: 'New York',
    address: '745 Fifth Avenue, Suite 1900, New York, NY 10151',
    phone: '+1 212 555 0194',
    email: 'newyork@vimrollestate.com',
  },
  {
    city: 'Lagos',
    address: '4 Bourdillon Road, Old Ikoyi, Lagos',
    phone: '+234 1 279 4410',
    email: 'lagos@vimrollestate.com',
  },
];

export default function Contact() {
  const [confirmation, setConfirmation] = useState(null);
  const { data: properties = [] } = useAllPropertiesQuery();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      preferredContact: 'Email',
      propertyOfInterest: 'General Private Advisory',
      message: '',
    },
  });

  const preferredContact = watch('preferredContact');
  const propertyOfInterest = watch('propertyOfInterest');

  const propertyOptions = useMemo(
    () => [
      {
        label: 'General Private Advisory / Bespoke Search',
        value: 'General Private Advisory',
      },
      {
        label: 'List a Residence With VIMROLL Estate',
        value: 'List a Property With VIMROLL',
      },
      ...properties.map((prop) => {
        const val = `${prop.reference} — ${prop.title} (${prop.location.city})`;
        return { label: val, value: val };
      }),
    ],
    [properties]
  );

  const onSubmit = async (values) => {
    const result = await submitDemoEnquiry(values);
    setConfirmation(result);
  };

  return (
    <PageTransition>
      <PageMeta
        title="Contact & Private Enquiries"
        description="Connect with VIMROLL Estate's private client advisory desks in London, Dubai, New York, and Lagos."
      />

      {/* Header */}
      <section className="border-b border-[#E8E1D5] bg-[#EFECE5] pt-28 pb-14 sm:pt-36 sm:pb-20">
        <Container>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#B69A69]">
            Private Client Desk
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl font-normal text-[#171816] sm:text-5xl">
            Begin a Confidential Conversation.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#41413D] sm:text-base">
            Whether requesting a private architectural dossier, arranging an in-person or
            virtual viewing, or discussing representation of a trophy property, our
            regional desks are at your disposal.
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-14 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left: Office Directory */}
            <div className="space-y-8 lg:col-span-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                  International Desks
                </p>
                <h2 className="mt-2 font-serif text-3xl font-normal text-[#171816]">
                  Global Advisory Offices
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {OFFICES.map((office) => (
                  <div
                    key={office.city}
                    className="border border-[#E8E1D5] bg-white p-6"
                  >
                    <h3 className="font-serif text-2xl font-normal text-[#171816]">
                      {office.city}
                    </h3>
                    <ul className="mt-3 space-y-2 text-xs text-[#41413D]">
                      <li className="flex items-start gap-2.5">
                        <MapPin
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B69A69]"
                          strokeWidth={1.5}
                        />
                        <span>{office.address}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Phone
                          className="h-3.5 w-3.5 shrink-0 text-[#B69A69]"
                          strokeWidth={1.5}
                        />
                        <a
                          href={`tel:${office.phone.replace(/\s+/g, '')}`}
                          className="hover:text-[#171816]"
                        >
                          {office.phone}
                        </a>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Mail
                          className="h-3.5 w-3.5 shrink-0 text-[#B69A69]"
                          strokeWidth={1.5}
                        />
                        <a
                          href={`mailto:${office.email}`}
                          className="hover:text-[#171816]"
                        >
                          {office.email}
                        </a>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 border border-[#E8E1D5] bg-[#EFECE5] p-5 text-xs text-[#41413D]">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#B69A69]"
                  strokeWidth={1.5}
                />
                <p>
                  Private viewings are arranged strictly by appointment Monday through
                  Saturday across local time zones.
                </p>
              </div>
            </div>

            {/* Right: Enquiry Form */}
            <div className="lg:col-span-7">
              <div className="border border-[#E8E1D5] bg-white p-6 sm:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
                  Direct Enquiry
                </p>
                <h2 className="mt-2 font-serif text-3xl font-normal text-[#171816]">
                  Speak With an Advisor
                </h2>

                {confirmation ? (
                  <div
                    role="status"
                    className="mt-8 border border-[#B69A69]/45 bg-[#F7F5F0] p-7"
                  >
                    <div className="flex items-center gap-3 text-[#171816]">
                      <CheckCircle2
                        className="h-6 w-6 text-[#B69A69]"
                        strokeWidth={1.6}
                      />
                      <h3 className="font-serif text-2xl">
                        Demo Enquiry Confirmation
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[#41413D]">
                      Thank you, <strong className="text-[#171816]">{confirmation.payload.name}</strong>.
                      Your enquiry regarding{' '}
                      <strong className="text-[#171816]">
                        {confirmation.payload.propertyOfInterest}
                      </strong>{' '}
                      has been validated under reference{' '}
                      <strong className="text-[#171816]">
                        {confirmation.confirmationId}
                      </strong>
                      .
                    </p>
                    <p className="mt-3 text-xs text-[#41413D]/75">
                      Demonstration notice: Because this frontend operates without a live
                      mail server, no external email or message was transmitted.
                    </p>
                    <div className="mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setConfirmation(null);
                          reset();
                        }}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="mt-8 space-y-5"
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
                        >
                          Full Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          placeholder="Enter your full name"
                          aria-invalid={Boolean(errors.name)}
                          {...register('name')}
                          className="min-h-[44px] w-full border border-[#E8E1D5] bg-[#F7F5F0]/50 px-4 py-3 text-sm text-[#171816] focus:border-[#B69A69] focus:bg-white focus:outline-none"
                        />
                        {errors.name && (
                          <p role="alert" className="mt-1.5 text-xs text-red-700">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
                        >
                          Email Address *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          placeholder="name@domain.com"
                          aria-invalid={Boolean(errors.email)}
                          {...register('email')}
                          className="min-h-[44px] w-full border border-[#E8E1D5] bg-[#F7F5F0]/50 px-4 py-3 text-sm text-[#171816] focus:border-[#B69A69] focus:bg-white focus:outline-none"
                        />
                        {errors.email && (
                          <p role="alert" className="mt-1.5 text-xs text-red-700">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
                        >
                          Telephone (Optional)
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          placeholder="+44 20 7946 0000"
                          {...register('phone')}
                          className="min-h-[44px] w-full border border-[#E8E1D5] bg-[#F7F5F0]/50 px-4 py-3 text-sm text-[#171816] focus:border-[#B69A69] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <LuxurySelect
                        label="Preferred Contact Method"
                        value={preferredContact}
                        onChange={(val) =>
                          setValue('preferredContact', val, { shouldValidate: true })
                        }
                        options={CONTACT_METHOD_OPTIONS}
                      />
                    </div>

                    <LuxurySelect
                      label="Property of Interest"
                      value={propertyOfInterest}
                      onChange={(val) =>
                        setValue('propertyOfInterest', val, { shouldValidate: true })
                      }
                      options={propertyOptions}
                    />

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
                      >
                        Your Enquiry *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        placeholder="Share your acquisition criteria, preferred destinations, or viewing schedule..."
                        aria-invalid={Boolean(errors.message)}
                        {...register('message')}
                        className="w-full border border-[#E8E1D5] bg-[#F7F5F0]/50 px-4 py-3 text-sm text-[#171816] focus:border-[#B69A69] focus:bg-white focus:outline-none"
                      />
                      {errors.message && (
                        <p role="alert" className="mt-1.5 text-xs text-red-700">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto"
                    >
                      {isSubmitting ? 'Submitting Enquiry...' : 'Submit Private Enquiry'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}
