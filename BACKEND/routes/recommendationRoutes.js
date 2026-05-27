const {
  getMovieRecommendations,
} = require("../controllers/recommendationController");

async function recommendationRoutes(fastify, options) {
  fastify.post("/recommend", getMovieRecommendations);
}

module.exports = recommendationRoutes;