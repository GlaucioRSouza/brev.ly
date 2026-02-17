import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/index';
import { links } from '../db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { exportLinksToCsv } from '../services/export-links';

export async function appRoutes(app: FastifyInstance) {
  
  // --- 1. ROTAS FIXAS ---
  
  app.get('/links', async () => {
    const allLinks = await db.select().from(links).orderBy(desc(links.createdAt));
    return allLinks;
  });

  app.post('/links', async (request, reply) => {
    const createLinkSchema = z.object({
      originalUrl: z.string().url(),
      slug: z.string().min(3),
    });

    const { originalUrl, slug } = createLinkSchema.parse(request.body);

    try {
      await db.insert(links).values({ originalUrl, slug });
      return reply.status(201).send();
    } catch (err) {
      return reply.status(400).send({ message: "Slug already exists or invalid data." });
    }
  });

  app.post('/links/export', async () => {
    const allLinks = await db.select().from(links);
    const url = await exportLinksToCsv(allLinks);
    return { url };
  });

  // --- 2. ROTAS COM PARÂMETROS ESPECÍFICOS ---

  // Verificação de existência antes de deletar
  app.delete('/links/:slug', async (request, reply) => {
    const { slug } = z.object({ slug: z.string() }).parse(request.params);

    try {
      // Adicione o await para garantir que o banco termine antes de responder
      await db.delete(links).where(eq(links.slug, slug));
      
      // O .send() no final é OBRIGATÓRIO para liberar o navegador
      return reply.status(204).send(); 
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: "Erro interno no servidor" });
    }
  });

  // --- 3. ROTA DE REDIRECIONAMENTO (Sempre por último) ---

  app.get('/:slug', async (request, reply) => {
    const getParamsSchema = z.object({ slug: z.string() });
    const { slug } = getParamsSchema.parse(request.params);

    // Proteção reforçada contra rotas internas
    const reservedWords = ['links', 'favicon.ico', 'public', 'assets'];
    if (reservedWords.includes(slug)) {
        return reply.status(404).send();
    }

    const [link] = await db.select().from(links).where(eq(links.slug, slug));

    if (!link) {
      return reply.status(404).send({ message: "Link not found" });
    }

    // Garantir que a URL original seja válida para o navegador
    let destination = link.originalUrl;
    if (!destination.startsWith('http')) {
      destination = `https://${destination}`;
    }

    await db.update(links)
      .set({ clicks: sql`${links.clicks} + 1` })
      .where(eq(links.id, link.id));

    return reply.redirect(destination);
  });
}