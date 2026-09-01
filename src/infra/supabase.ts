import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_SUPABASE_URL!,
  process.env.NEXT_SUPABASE_PUBLISHABLE_KEY!,
);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export class InvalidImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidImageError';
  }
}

function validateImageFile(file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new InvalidImageError(
      'Formato de imagem não suportado. Use JPEG, PNG ou WebP.',
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new InvalidImageError('Imagem muito grande. Tamanho máximo: 5 MB.');
  }
}

export async function uploadProductImage(file: File): Promise<string> {
  validateImageFile(file);
  const fileName = `${crypto.randomUUID()}-${file.name}`;
  console.log(file);
  const { error } = await supabase.storage
    .from('products')
    .upload(fileName, file);
  if (error) throw error;

  const { data } = supabase.storage.from('products').getPublicUrl(fileName);
  return data.publicUrl;
}
