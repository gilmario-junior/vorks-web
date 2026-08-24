// src/components/forms/Modal.tsx
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div
        role='dialog'
        aria-modal='true'
        className='w-full max-w-sm rounded-lg bg-white p-6 shadow-lg'
      >
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-center items-center text-2xl font-semibold text-gray-900'>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label='Fechar'
            className='text-gray-400 transition hover:text-gray-600'
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
