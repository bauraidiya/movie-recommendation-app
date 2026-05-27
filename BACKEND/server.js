const Fastify = require("fastify");
require("dotenv").config();

const fastify = Fastify({
  logger: true,
});

fastify.get("/", async () => {
  return {
    message: "Movie Recommendation Backend is running",
  };
});

const start = async () => {
  try {
    const PORT = process.env.PORT || 8080;

    await fastify.listen({
      port: PORT,
      host: "0.0.0.0",
    });

    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();