require("dotenv").config();

const Fastify = require("fastify");
const cors = require("@fastify/cors");

const recommendationRoutes = require("./routes/recommendationRoutes");
const { connectDB } = require("./database/db");

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: [
    "http://localhost:5173",
    "https://movie-recommendation-app-1-syhe.onrender.com",
  ],
});

fastify.get("/", async () => {
  return {
    message: "Movie Recommendation Backend is running",
  };
});

fastify.register(recommendationRoutes, {
  prefix: "/api",
});

const start = async () => {
  try {
    const PORT = process.env.PORT || 8080;

    await connectDB();

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