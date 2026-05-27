const OpenAI = require("openai");
const db = require("../database/db");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getMovieRecommendations = async (request, reply) => {
  try {
    const { userInput } = request.body;

    if (!userInput || userInput.trim() === "") {
      return reply.status(400).send({
        message: "User input is required",
      });
    }

    const prompt = `
Recommend 3 to 5 movies based on this user preference:
"${userInput}"

Return ONLY valid JSON array.

Each movie should contain:
title, year, reason
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a movie recommendation assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const resultText = aiResponse.choices[0].message.content;

    let recommendations;

    try {
      recommendations = JSON.parse(resultText);
    } catch (error) {
      recommendations = [
        {
          title: "AI response parsing error",
          year: "N/A",
          reason: resultText,
        },
      ];
    }

    db.prepare(`
      INSERT INTO recommendations (user_input, recommended_movies)
      VALUES (?, ?)
    `).run(userInput, JSON.stringify(recommendations));

    return {
      message: "Recommendations generated successfully",
      recommendations,
    };
  } catch (error) {
    console.error(error);

    return reply.status(500).send({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getMovieRecommendations,
};