import fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes';
import { env } from '../env';

const app = fastify();

app.register(cors, { origin: '*' }); 
app.register(appRoutes);

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`🚀 HTTP Server running on http://localhost:${env.PORT}`);
});