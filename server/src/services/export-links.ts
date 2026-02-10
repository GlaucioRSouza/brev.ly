import { stringify } from 'csv-stringify/sync'; // Versão sync para arquivos menores ou use stream para grandes
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '../lib/r2';
import { env } from '../env';
import { randomUUID } from 'node:crypto';

interface LinkData {
  originalUrl: string;
  slug: string;
  clicks: number;
  createdAt: Date;
}

export async function exportLinksToCsv(data: LinkData[]) {
  const fileName = `${randomUUID()}.csv`;
  
  // Transforma o array de objetos em string CSV
  const csvContent = stringify(data, {
    header: true,
    columns: [
      { key: 'originalUrl', header: 'URL Original' },
      { key: 'slug', header: 'URL Encurtada' },
      { key: 'clicks', header: 'Acessos' },
      { key: 'createdAt', header: 'Data de Criação' }
    ]
  });

  // Faz o upload para o bucket definido no .env
  await r2.send(new PutObjectCommand({
    Bucket: env.CLOUDFLARE_BUCKET,
    Key: fileName,
    Body: csvContent,
    ContentType: 'text/csv',
  }));

  // Retorna a URL pública para o frontend baixar
  return `${env.CLOUDFLARE_PUBLIC_URL}/${fileName}`;
}