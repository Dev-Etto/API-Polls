import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { redis } from "../../lib/redis";

const listPolls = async (app: FastifyInstance) => {
  app.get('/polls', async (_req, res) => {
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          select: {
            id: true,
          },
        },
      },
    });

    const pollsWithVotes = await Promise.all(
      polls.map(async (poll) => {
        const totalVotes = await poll.options.reduce(async (accPromise, option) => {
          const acc = await accPromise;
          const votes = await redis.zscore(poll.id, option.id);
          return acc + (votes ? Number(votes) : 0);
        }, Promise.resolve(0));

        return {
          id: poll.id,
          nome: poll.title,
          totalDeVotos: totalVotes,
        };
      })
    );

    return res.send(pollsWithVotes);
  });
};

export default listPolls;
