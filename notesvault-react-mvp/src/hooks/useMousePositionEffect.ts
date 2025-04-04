import { useState, useEffect, RefObject } from 'react';

// Custom hook to track mouse position relative to a referenced element
// and update CSS custom properties on that element.
// Accept RefObject<HTMLElement | null> to match useRef initialization
export function useMousePositionEffect(elementRef: RefObject<HTMLElement | null>) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return; // Exit if the element is not yet available

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      // Calculate mouse position relative to the element
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      // Update CSS custom properties directly for performance
      element.style.setProperty('--mouse-x', `${x}px`);
      element.style.setProperty('--mouse-y', `${y}px`);
      // We don't strictly need React state for this, but keeping it
      // might be useful if the coords were needed elsewhere in the component.
      // For purely CSS effects, direct style setting is often better.
      setCoords({ x, y });
    };

    const handleMouseLeave = () => {
        // Optional: Reset position when mouse leaves the element
        // This prevents the spotlight from staying in the last position
        element.style.setProperty('--mouse-x', `-999px`);
        element.style.setProperty('--mouse-y', `-999px`);
        setCoords({ x: -999, y: -999 });
    };

    // Set initial position off-screen
    handleMouseLeave();

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave); // Add leave listener

    // Cleanup listeners on unmount or if the ref changes
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef]); // Re-run effect if the ref object itself changes

  // Return coords if needed by the component, otherwise it can be omitted
  return coords;
}