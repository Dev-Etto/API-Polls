import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import z from "zod";
import { Prisma } from "@prisma/client";

const listPolls = async (app: FastifyInstance) => {
  app.get('/polls', async (req, res) => {
    const querySchema = z.object({
      page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
      limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
      search: z.string().optional(),
    });

    const { page, limit, search } = querySchema.parse(req.query);

    const whereClause: Prisma.PollWhereInput = search
      ? { title: { contains: search, mode: "insensitive" } }
      : {};

    const polls = await prisma.poll.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPolls = await prisma.poll.count({ where: whereClause });

    return res.send({
      data: polls.map((poll) => ({
        id: poll.id,
        nome: poll.title,
        createdAt: poll.createdAt,
      })),
      meta: {
        total: totalPolls,
        page,
        limit,
        totalPages: Math.ceil(totalPolls / limit),
      },
    });
  });
};

export default listPolls;
