import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, CheckCircle2, Mail, Phone } from 'lucide-react';
import { Button } from '../common/Button';
import { LuxuryImage } from '../common/LuxuryImage';
import { LuxurySelect } from '../common/LuxurySelect';
import { submitDemoEnquiry } from '../../services/api';

const enquirySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z.string().trim().optional(),
  preferredContact: z.enum(['Email', 'Telephone', 'WhatsApp']),
  requestViewing: z.boolean().optional(),
  preferredDate: z.string().optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Please include a brief note (at least 10 characters).'),
});

const CONTACT_METHOD_OPTIONS = [
  { label: 'Email', value: 'Email' },
  { label: 'Telephone', value: 'Telephone' },
  { label: 'WhatsApp', value: 'WhatsApp' },
];

export function EnquiryPanel({ property }) {
  const [confirmation, setConfirmation] = useState(null);
  const consultant = property.consultant;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      preferredContact: 'Email',
      requestViewing: false,
      preferredDate: '',
      message: `I would like to receive the private dossier and floorplans for ${property.title} (${property.reference}).`,
    },
  });

  const requestViewing = watch('requestViewing');
  const preferredContact = watch('preferredContact');

  const onSubmit = async (values) => {
    const response = await submitDemoEnquiry({
      ...values,
      propertyReference: property.reference,
      propertyTitle: property.title,
    });
    setConfirmation(response);
  };

  return (
    <aside className="border border-[#E8E1D5] bg-white p-6 sm:p-8">
      {/* Consultant Profile */}
      {consultant && (
        <div className="flex items-center gap-4 border-b border-[#E8E1D5] pb-6">
          <LuxuryImage
            src={consultant.avatar}
            alt={consultant.name}
            className="h-16 w-16 shrink-0"
          />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
              Private Client Advisor
            </p>
            <h3 className="mt-0.5 font-serif text-xl font-normal text-[#171816]">
              {consultant.name}
            </h3>
            <p className="text-xs text-[#41413D]/75">{consultant.office} Desk</p>
          </div>
        </div>
      )}

      {consultant && (
        <div className="grid grid-cols-2 gap-2.5 border-b border-[#E8E1D5] py-4 text-xs">
          <a
            href={`tel:${consultant.phone.replace(/\s+/g, '')}`}
            className="flex min-h-[44px] items-center justify-center gap-1.5 border border-[#E8E1D5] py-2.5 font-medium text-[#171816] transition-colors hover:border-[#171816]"
          >
            <Phone className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.5} />
            <span>Call Desk</span>
          </a>
          <a
            href={`mailto:${consultant.email}?subject=Enquiry:%20${encodeURIComponent(property.reference)}`}
            className="flex min-h-[44px] items-center justify-center gap-1.5 border border-[#E8E1D5] py-2.5 font-medium text-[#171816] transition-colors hover:border-[#171816]"
          >
            <Mail className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.5} />
            <span>Direct Email</span>
          </a>
        </div>
      )}

      {/* Quick Toggle: Private Viewing vs General Dossier */}
      <div className="mt-6 flex items-center justify-between gap-2 bg-[#F7F5F0] p-1">
        <button
          type="button"
          onClick={() => setValue('requestViewing', false)}
          className={`flex min-h-[40px] flex-1 items-center justify-center py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
            !requestViewing
              ? 'bg-[#171816] text-[#F7F5F0]'
              : 'text-[#41413D] hover:text-[#171816]'
          }`}
        >
          Private Enquiry
        </button>
        <button
          type="button"
          onClick={() => setValue('requestViewing', true)}
          className={`inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
            requestViewing
              ? 'bg-[#171816] text-[#F7F5F0]'
              : 'text-[#41413D] hover:text-[#171816]'
          }`}
        >
          <Calendar className="h-3.5 w-3.5 text-[#B69A69]" strokeWidth={1.5} />
          <span>Request Viewing</span>
        </button>
      </div>

      {confirmation ? (
        <div
          role="status"
          className="mt-6 border border-[#B69A69]/45 bg-[#F7F5F0] p-6"
        >
          <div className="flex items-center gap-2.5 text-[#171816]">
            <CheckCircle2 className="h-5 w-5 text-[#B69A69]" strokeWidth={1.6} />
            <h4 className="font-serif text-xl">Demo Enquiry Recorded</h4>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#41413D]">
            Reference <strong className="text-[#171816]">{confirmation.confirmationId}</strong>{' '}
            for <strong className="text-[#171816]">{property.reference}</strong> has been
            validated locally.
          </p>
          <p className="mt-2 text-[11px] text-[#41413D]/75">
            Portfolio demonstration note: No live backend is connected yet, so no
            external message was dispatched.
          </p>
          <button
            type="button"
            onClick={() => {
              setConfirmation(null);
              reset();
            }}
            className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#977D50] underline underline-offset-4 hover:text-[#171816]"
          >
            Submit Another Enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]">
              Property Reference
            </label>
            <input
              type="text"
              readOnly
              value={`${property.reference} — ${property.title}`}
              className="min-h-[44px] w-full border border-[#E8E1D5] bg-[#F7F5F0] px-3.5 py-2.5 text-xs font-medium text-[#41413D]"
            />
          </div>

          <div>
            <label
              htmlFor="enq-name"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
            >
              Full Name *
            </label>
            <input
              id="enq-name"
              type="text"
              placeholder="Your full name"
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
              className="min-h-[44px] w-full border border-[#E8E1D5] bg-white px-3.5 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:outline-none"
            />
            {errors.name && (
              <p role="alert" className="mt-1 text-xs text-red-700">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="enq-email"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
            >
              Email Address *
            </label>
            <input
              id="enq-email"
              type="email"
              placeholder="name@domain.com"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
              className="min-h-[44px] w-full border border-[#E8E1D5] bg-white px-3.5 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:outline-none"
            />
            {errors.email && (
              <p role="alert" className="mt-1 text-xs text-red-700">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="enq-phone"
                className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
              >
                Phone (Optional)
              </label>
              <input
                id="enq-phone"
                type="tel"
                placeholder="+44 20 ..."
                {...register('phone')}
                className="min-h-[44px] w-full border border-[#E8E1D5] bg-white px-3.5 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:outline-none"
              />
            </div>

            <LuxurySelect
              label="Preferred Contact"
              value={preferredContact}
              onChange={(val) =>
                setValue('preferredContact', val, { shouldValidate: true })
              }
              options={CONTACT_METHOD_OPTIONS}
            />
          </div>

          {requestViewing && (
            <div>
              <label
                htmlFor="enq-date"
                className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
              >
                Preferred Viewing Date
              </label>
              <input
                id="enq-date"
                type="date"
                {...register('preferredDate')}
                className="min-h-[44px] w-full border border-[#E8E1D5] bg-white px-3.5 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="enq-message"
              className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#41413D]"
            >
              Message *
            </label>
            <textarea
              id="enq-message"
              rows={4}
              aria-invalid={Boolean(errors.message)}
              {...register('message')}
              className="w-full border border-[#E8E1D5] bg-white px-3.5 py-2.5 text-sm text-[#171816] focus:border-[#B69A69] focus:outline-none"
            />
            {errors.message && (
              <p role="alert" className="mt-1 text-xs text-red-700">
                {errors.message.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting
              ? 'Validating Request...'
              : requestViewing
                ? 'Schedule Private Viewing'
                : 'Request Private Dossier'}
          </Button>
        </form>
      )}
    </aside>
  );
}
