import { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { usePropertyStore } from '../../store/usePropertyStore';

export function AcquisitionCalculator({ usdPrice }) {
  const currency = usePropertyStore((state) => state.currency);

  const [depositPct, setDepositPct] = useState(35);
  const [termYears, setTermYears] = useState(25);
  const [interestRate, setInterestRate] = useState(4.65);

  const breakdown = useMemo(() => {
    const depositUsd = (usdPrice * depositPct) / 100;
    const principalUsd = Math.max(usdPrice - depositUsd, 0);
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = termYears * 12;

    let monthlyUsd = 0;
    if (monthlyRate === 0) {
      monthlyUsd = principalUsd / totalMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      monthlyUsd = (principalUsd * (monthlyRate * factor)) / (factor - 1);
    }

    return {
      depositUsd,
      principalUsd,
      monthlyUsd,
    };
  }, [usdPrice, depositPct, termYears, interestRate]);

  return (
    <section className="border-t border-[#E8E1D5] pt-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B69A69]">
            Private Wealth Structuring
          </p>
          <h2 className="mt-2 font-serif text-3xl font-normal text-[#171816]">
            Indicative Financing Estimator
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 border border-[#E8E1D5] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#41413D]">
          <Calculator className="h-3.5 w-3.5 text-[#B69A69]" />
          <span>{currency} Estimate</span>
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 border border-[#E8E1D5] bg-white p-5 sm:p-8 md:grid-cols-12">
        {/* Sliders */}
        <div className="space-y-6 md:col-span-7">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <label htmlFor="calc-deposit" className="font-medium text-[#41413D]">
                Initial Equity Contribution
              </label>
              <span className="font-semibold tabular-nums text-[#171816]">
                {depositPct}% ({formatPrice(breakdown.depositUsd, currency, true)})
              </span>
            </div>
            <input
              id="calc-deposit"
              type="range"
              min={20}
              max={80}
              step={5}
              value={depositPct}
              onChange={(e) => setDepositPct(Number(e.target.value))}
              className="h-1.5 w-full accent-[#B69A69]"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <label htmlFor="calc-term" className="font-medium text-[#41413D]">
                Amortisation Horizon
              </label>
              <span className="font-semibold tabular-nums text-[#171816]">
                {termYears} Years
              </span>
            </div>
            <input
              id="calc-term"
              type="range"
              min={10}
              max={30}
              step={5}
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className="h-1.5 w-full accent-[#B69A69]"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <label htmlFor="calc-rate" className="font-medium text-[#41413D]">
                Indicative Private Bank Rate
              </label>
              <span className="font-semibold tabular-nums text-[#171816]">
                {interestRate.toFixed(2)}% p.a.
              </span>
            </div>
            <input
              id="calc-rate"
              type="range"
              min={3}
              max={7.5}
              step={0.15}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="h-1.5 w-full accent-[#B69A69]"
            />
          </div>
        </div>

        {/* Output Summary */}
        <div className="flex flex-col justify-between border border-[#E8E1D5] bg-[#F7F5F0] p-5 sm:p-6 md:col-span-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B69A69]">
              Estimated Monthly Servicing
            </p>
            <p className="mt-2 font-serif text-3xl text-[#171816] tabular-nums sm:text-4xl">
              {formatPrice(breakdown.monthlyUsd, currency)}
              <span className="font-sans text-xs font-normal text-[#41413D]"> / mo</span>
            </p>

            <dl className="mt-5 space-y-2.5 border-t border-[#E8E1D5] pt-4 text-xs">
              <div className="flex items-center justify-between">
                <dt className="text-[#41413D]">Guide Price</dt>
                <dd className="font-medium tabular-nums text-[#171816]">
                  {formatPrice(usdPrice, currency)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#41413D]">Equity ({depositPct}%)</dt>
                <dd className="font-medium tabular-nums text-[#171816]">
                  {formatPrice(breakdown.depositUsd, currency)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#41413D]">Facility Principal</dt>
                <dd className="font-medium tabular-nums text-[#171816]">
                  {formatPrice(breakdown.principalUsd, currency)}
                </dd>
              </div>
            </dl>
          </div>

          <p className="mt-5 text-[10px] leading-relaxed text-[#41413D]/70">
            Illustrative calculation only; excludes local stamp duty, notary fees, and
            cross-currency hedging.
          </p>
        </div>
      </div>
    </section>
  );
}

