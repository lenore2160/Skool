import React from 'react';

export interface FractionProps {
  numerator: number | string;
  denominator: number | string;
  whole?: number | string | null;
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  lineClassName?: string;
  ariaLabel?: string;
}

const SIZE_STYLES: Record<string, { container: string; whole: string; numDen: string; line: string; gap: string }> = {
  xs: {
    container: 'text-[11px]',
    whole: 'text-[13px] mr-0.5',
    numDen: 'text-[9px] px-0.5',
    line: 'border-b',
    gap: 'my-0',
  },
  sm: {
    container: 'text-xs',
    whole: 'text-sm mr-1',
    numDen: 'text-[10px] px-0.5',
    line: 'border-b',
    gap: 'my-[0.5px]',
  },
  base: {
    container: 'text-sm sm:text-base',
    whole: 'text-base sm:text-lg mr-1',
    numDen: 'text-xs sm:text-sm px-1',
    line: 'border-b-2',
    gap: 'my-[1px]',
  },
  md: {
    container: 'text-base sm:text-lg',
    whole: 'text-lg sm:text-xl mr-1.5',
    numDen: 'text-sm sm:text-base px-1',
    line: 'border-b-2',
    gap: 'my-[1px]',
  },
  lg: {
    container: 'text-lg sm:text-xl',
    whole: 'text-xl sm:text-2xl mr-1.5',
    numDen: 'text-base sm:text-lg px-1.5',
    line: 'border-b-2',
    gap: 'my-0.5',
  },
  xl: {
    container: 'text-xl sm:text-2xl',
    whole: 'text-2xl sm:text-3xl mr-2',
    numDen: 'text-lg sm:text-xl px-2',
    line: 'border-b-[2.5px]',
    gap: 'my-0.5',
  },
  '2xl': {
    container: 'text-2xl sm:text-3xl',
    whole: 'text-3xl sm:text-4xl mr-2',
    numDen: 'text-xl sm:text-2xl px-2',
    line: 'border-b-[3px]',
    gap: 'my-1',
  },
  '3xl': {
    container: 'text-3xl sm:text-4xl',
    whole: 'text-4xl sm:text-5xl mr-2.5',
    numDen: 'text-2xl sm:text-3xl px-2.5',
    line: 'border-b-4',
    gap: 'my-1',
  },
};

/**
 * Standardized Top-Over-Bottom Fraction Component
 * Always strictly renders fractions with the numerator stacked directly above
 * the denominator, separated by a clean horizontal fraction line (vinculum).
 */
export const Fraction: React.FC<FractionProps> = ({
  numerator,
  denominator,
  whole,
  size = 'base',
  className = '',
  lineClassName = '',
  ariaLabel,
}) => {
  const styles = SIZE_STYLES[size] || SIZE_STYLES.base;
  const hasWhole = whole !== undefined && whole !== null && whole !== '' && whole !== 0 && whole !== '0';

  const defaultAria = hasWhole
    ? `${whole} and ${numerator} over ${denominator}`
    : `${numerator} over ${denominator}`;

  return (
    <span
      className={`inline-flex items-center align-middle font-bold leading-none select-none ${styles.container} ${className}`}
      aria-label={ariaLabel || defaultAria}
      role="math"
    >
      {hasWhole && (
        <span className={`font-black ${styles.whole} leading-none`}>
          {whole}
        </span>
      )}
      <span className="inline-flex flex-col items-center justify-center text-center leading-none">
        <span className={`font-black ${styles.numDen} pb-[1px] leading-none`}>
          {numerator}
        </span>
        <span
          className={`w-full min-w-[10px] ${styles.line} ${styles.gap} border-current ${lineClassName}`}
        />
        <span className={`font-black ${styles.numDen} pt-[1px] leading-none`}>
          {denominator}
        </span>
      </span>
    </span>
  );
};

export interface FormattedFractionTextProps {
  text: string;
  className?: string;
  fractionClassName?: string;
  size?: 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

/**
 * FormattedFractionText:
 * Parses any text containing fractions written as "1/2", "12/12", "1 3/12", etc.
 * and replaces every instance with a standardized top-over-bottom <Fraction /> component.
 */
export const FormattedFractionText: React.FC<FormattedFractionTextProps> = ({
  text,
  className = '',
  fractionClassName = '',
  size = 'base',
}) => {
  if (!text) return null;

  // Regex matches mixed numbers e.g. "1 3/12" or simple fractions "4/6", "1/2"
  // Group 1 (optional): whole number
  // Group 2: numerator
  // Group 3: denominator
  const fractionRegex = /(?:(?<=^|[\s(])(\d+)\s+)?(\d+)\/(\d+)/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fractionRegex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = fractionRegex.lastIndex;

    // Push preceding text
    if (matchStart > lastIndex) {
      parts.push(text.substring(lastIndex, matchStart));
    }

    const whole = match[1] ? Number(match[1]) : undefined;
    const num = match[2];
    const den = match[3];

    parts.push(
      <Fraction
        key={`frac-${matchStart}-${num}-${den}`}
        whole={whole}
        numerator={num}
        denominator={den}
        size={size}
        className={`mx-0.5 ${fractionClassName}`}
      />
    );

    lastIndex = matchEnd;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <span className={className}>{parts}</span>;
};
