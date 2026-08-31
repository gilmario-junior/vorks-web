type ButtonVariant =
  | 'primary'
  | 'danger'
  | 'warning'
  | 'ghost'
  | 'search'
  | 'linkPrimary'
  | 'linkDanger';

interface ButtonProps {
  buttonText: string;
  variant?: ButtonVariant;
  loading?: boolean;
  loadingText?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 hover:bg-blue-800 text-white',
  search: 'bg-gray-500 hover:bg-gray-800 text-white',
  danger: 'bg-red-600 hover:bg-red-800 text-white',
  warning: 'bg-amber-500 hover:bg-amber-700 text-white',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  linkPrimary: 'text-sm font-medium text-blue-600 hover:underline',
  linkDanger: 'text-sm font-medium text-red-600 hover:underline',
};

export function Button({
  buttonText,
  variant = 'primary',
  loading,
  loadingText,
  type = 'button',
  onClick,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`pr-3 pl-3 rounded-md py-2 text-sm font-medium transition disabled:opacity-50 ${variantStyles[variant]} ${className}`}
    >
      {loading ? (loadingText ?? 'Carregando...') : buttonText}
    </button>
  );
}
