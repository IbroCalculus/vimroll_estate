import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';

export function LuxurySelect({
  label,
  value,
  onChange,
  options = [],
  theme = 'light',
  size = 'md',
  className = '',
  ariaLabel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listboxId = useId();
  const buttonId = useId();

  const selectedIndex = options.findIndex(
    (opt) => String(opt.value) === String(value)
  );
  const selectedOption =
    selectedIndex >= 0 ? options[selectedIndex] : options[0] || { label: '', value: '' };

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return next;
    });
  };

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % options.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (focusedIndex >= 0 && options[focusedIndex]) {
        handleSelect(options[focusedIndex].value);
      }
    }
  };

  const isDark = theme === 'dark';
  const paddingClass =
    size === 'sm' ? 'min-h-[38px] px-3 py-1.5 text-xs' : 'min-h-[44px] px-3.5 py-2.5 text-sm';

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label
          htmlFor={buttonId}
          className={`mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] ${
            isDark ? 'text-[#B69A69]' : 'text-[#41413D]'
          }`}
        >
          {label}
        </label>
      )}

      <button
        id={buttonId}
        type="button"
        aria-label={ariaLabel || label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={`flex w-full items-center justify-between gap-2 border text-left transition-colors ${paddingClass} ${
          isDark
            ? isOpen
              ? 'border-[#B69A69] bg-[#222320] text-[#F7F5F0]'
              : 'border-[#F7F5F0]/18 bg-[#222320] text-[#F7F5F0] hover:border-[#B69A69]/70'
            : isOpen
              ? 'border-[#B69A69] bg-white text-[#171816]'
              : 'border-[#E8E1D5] bg-[#F7F5F0]/60 text-[#171816] hover:border-[#171816]/45'
        }`}
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
            isDark ? 'text-[#B69A69]' : 'text-[#41413D]'
          } ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={1.7}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={listboxId}
            role="listbox"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute left-0 right-0 z-50 mt-1 max-h-64 min-w-[180px] overflow-y-auto border py-1 shadow-2xl ${
              isDark
                ? 'border-[#B69A69]/45 bg-[#171816] text-[#F7F5F0]'
                : 'border-[#E8E1D5] bg-white text-[#171816]'
            }`}
          >
            {options.map((opt, idx) => {
              const isSelected = String(opt.value) === String(value);
              const isFocused = idx === focusedIndex;
              return (
                <li
                  key={`${opt.value}-${opt.label}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setFocusedIndex(idx)}
                  onClick={() => handleSelect(opt.value)}
                  className={`flex min-h-[40px] cursor-pointer items-center justify-between gap-3 px-3.5 py-2 text-xs sm:text-sm transition-colors ${
                    isDark
                      ? isSelected
                        ? 'bg-[#222320] font-medium text-[#B69A69]'
                        : isFocused
                          ? 'bg-[#222320]/80 text-[#F7F5F0]'
                          : 'text-[#E8E1D5]/85'
                      : isSelected
                        ? 'bg-[#F7F5F0] font-medium text-[#171816]'
                        : isFocused
                          ? 'bg-[#F7F5F0]/70 text-[#171816]'
                          : 'text-[#41413D]'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check
                      className="h-3.5 w-3.5 shrink-0 text-[#B69A69]"
                      strokeWidth={1.8}
                    />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

