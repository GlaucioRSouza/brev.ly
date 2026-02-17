import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { queryClient } from '../lib/query-client';
import { Loader2 } from 'lucide-react'; // Importação do ícone de carregamento

const createLinkSchema = z.object({
  originalUrl: z.string().url('URL inválida'),
  slug: z.string().min(3, 'Mínimo 3 caracteres').regex(/^[a-z0-9-]+$/, 'Use apenas letras, números e hifens'),
});

type CreateLinkData = z.infer<typeof createLinkSchema>;

export function CreateLinkForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateLinkData>({
    resolver: zodResolver(createLinkSchema),
  });

  // Extraímos o isPending para controlar o estado do botão
  const { mutateAsync: createLink, isPending } = useMutation({
    mutationFn: (data: CreateLinkData) => api.post('/links', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      reset();
    },
  });

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6">Novo link</h2>
      <form onSubmit={handleSubmit((data) => createLink(data))} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Link Original</label>
          <input 
            {...register('originalUrl')} 
            placeholder="https://google.com" 
            className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
          />
          {errors.originalUrl && <p className="text-red-500 text-xs mt-1">{errors.originalUrl.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Link Encurtado</label>
          <div className="flex items-center bg-gray-50 border rounded-lg px-3 focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="text-gray-400">brev.ly/</span>
            <input {...register('slug')} className="w-full p-3 bg-transparent outline-none" />
          </div>
          {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
        </div>

        {/* BOTÃO ANIMADO */}
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> {/* Ícone girando */}
              Salvando...
            </>
          ) : (
            'Salvar link'
          )}
        </button>
      </form>
    </div>
  );
}