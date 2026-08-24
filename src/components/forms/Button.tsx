type ButtonVariant = 'primary' | 'danger' | 'warning' | 'ghost' | 'check';

interface ButtonProps {
  buttonText: string;
  variant?: ButtonVariant;
  loading?: boolean;
  loadingText?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-800 text-white',
  check: 'bg-green-600 hover:bg-green-800 text-white',
  danger: 'bg-red-600 hover:bg-red-800 text-white',
  warning: 'bg-amber-500 hover:bg-amber-700 text-white',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
};

export function Button({
  buttonText,
  variant = 'primary',
  loading,
  loadingText,
  type = 'button',
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`pr-3 pl-3 rounded-md py-2 text-sm font-medium transition disabled:opacity-50 ${variantStyles[variant]}`}
    >
      {loading ? (loadingText ?? 'Carregando...') : buttonText}
    </button>
  );
}
