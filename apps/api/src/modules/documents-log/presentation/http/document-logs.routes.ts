import type { FastifyInstance } from 'fastify';

export async function documentLogsRoutes(app: FastifyInstance) {
  app.post('/', async (req, reply) => {});

  app.get('/', async (req, reply) => {});

  app.get('/:id', async (req, reply) => {});

  app.delete('/:id', async (req, reply) => {});

  app.patch('/:id', async (req, reply) => {});
}
