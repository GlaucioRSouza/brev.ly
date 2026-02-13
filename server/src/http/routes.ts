import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../db/index'; // Sua instância do Drizzle
import { links } from '../db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { exportLinksToCsv } from '../services/export-links';

export async function appRoutes(app: FastifyInstance) {
  
  // Listar todos os links
  app.get('/links', async () => {
    const allLinks = await db.select().from(links).orderBy(desc(links.createdAt));
    return allLinks;
  });

  // Criar novo link
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

  // Obter URL original por Slug
  app.get('/links/:slug', async (request, reply) => {
    const getParamsSchema = z.object({ slug: z.string() });
    const { slug } = getParamsSchema.parse(request.params);

    const [link] = await db.select().from(links).where(eq(links.slug, slug));

    if (!link) return reply.status(404).send({ message: "Link not found" });
    return link;
  });

  // Incrementar acessos
  app.patch('/links/:slug/access', async (request, reply) => {
    const getParamsSchema = z.object({ slug: z.string() });
    const { slug } = getParamsSchema.parse(request.params);

    await db.update(links)
      .set({ clicks: sql`${links.clicks} + 1` })
      .where(eq(links.slug, slug));

    return reply.status(204).send();
  });

  // Deletar link
  app.delete('/links/:slug', async (request, reply) => {
    const getParamsSchema = z.object({ slug: z.string() });
    const { slug } = getParamsSchema.parse(request.params);

    await db.delete(links).where(eq(links.slug, slug));
    return reply.status(204).send();
  });

  // Exportar para CSV
  app.post('/links/export', async () => {
    const allLinks = await db.select().from(links);
    const url = await exportLinksToCsv(allLinks);
    return { url };
  });
}