import { createElement } from 'react';
import type { ReactNode, CSSProperties } from 'react';

/**
 * VisuallyHidden Component
 * 
 * Hides content visually but keeps it accessible to screen readers.
 * Useful for providing additional context to assistive technologies.
 */

interface VisuallyHiddenProps {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}

const hiddenStyles: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
};

export function VisuallyHidden({ children, as = 'span' }: VisuallyHiddenProps) {
  return createElement(
    as,
    {
      className: 'sr-only',
      style: hiddenStyles,
    },
    children
  );
}
