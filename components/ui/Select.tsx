import React, { useState, useRef, useEffect } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  id?: string;
  value: string | number;
  options: SelectOption[];
  onChange?: (value: string) => void;
  className?: string;
  size?: 'small' | 'middle' | 'large';
}

const Select = ({ id, value, options, onChange, className = '', size = 'middle' }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  let sizeClass = 'py-2 px-3 text-sm';
  if (size === 'small') sizeClass = 'py-1 px-2 text-xs';
  if (size === 'large') sizeClass = 'py-3 px-4 text-base';

  return (
    <div className={`relative inline-block w-full ${className}`} ref={containerRef}>
      <button
        id={id}
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded border border-border bg-background text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary ${sizeClass}`}
      >
        <span className='truncate'>{selectedOption?.label ?? 'Select...'}</span>
        <IoMdArrowDropdown
          className={`ml-2 flex-shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className='absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-background shadow-lg'>
          {options.map(option => (
            <div
              key={option.value}
              className={`cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-muted ${
                option.value === value
                  ? 'bg-blue-50 font-bold text-foreground dark:bg-blue-950/40'
                  : 'text-foreground'
              }`}
              onClick={() => {
                onChange?.(String(option.value));
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
