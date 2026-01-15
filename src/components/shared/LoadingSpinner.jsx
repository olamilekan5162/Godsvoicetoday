/**
 * LoadingSpinner component
 * Displays an animated loading indicator with configurable size
 *
 * @param {Object} props - Component props
 * @param {string} props.size - Size variant: 'small', 'medium', 'large'
 * @param {boolean} props.centered - Whether to center the spinner
 */
const LoadingSpinner = ({ size = "medium", centered = false }) => {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-3",
    large: "w-16 h-16 border-4",
  };

  const spinnerClass = `${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`;

  const spinner = (
    <div className={spinnerClass} role="status" aria-label="Loading"></div>
  );

  if (centered) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
