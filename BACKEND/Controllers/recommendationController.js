const { getDB } = require("../database/db");

const getMovieRecommendations = async (request, reply) => {
  try {
    const { userInput } = request.body;

    if (!userInput || userInput.trim() === "") {
      return reply.status(400).send({
        message: "User input is required",
      });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          {
            role: "system",
            content: "You are a movie recommendation assistant.",
          },
          {
            role: "user",
           content: `
Recommend 4 movies based on this user preference:
"${userInput}"

IMPORTANT:
Return ONLY valid JSON.
Do not write explanation text.
Do not write markdown.
Do not use backticks.

Format exactly like this:

[
  {
    "title": "Movie Name",
    "year": "2020",
    "reason": "Short reason"
  }
]
`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("OpenRouter Error:", data);
      return reply.status(500).send({
        message: "AI API error",
        error: data,
      });
    }

    const resultText = data.choices[0].message.content;

    let recommendations;

    try {
      recommendations = JSON.parse(resultText);
    } catch (error) {
    const movieBlocks = resultText
      .split(/\n\s*\n/)
      .filter((block) => block.trim() !== "");

    recommendations = movieBlocks.map((block) => {
      const lines = block.split("\n").filter((line) => line.trim() !== "");

      const title = lines[0]?.trim() || "Unknown Movie";

      const yearLine = lines.find((line) =>
        line.toLowerCase().startsWith("year")
      );

      const year = yearLine
        ? yearLine.replace(/year:/i, "").trim()
        : "N/A";

      const reason = lines
        .filter((line) => line !== lines[0] && line !== yearLine)
        .join(" ")
        .trim();

      return {
        title,
        year,
        reason,
      };
    });
}
    const db = getDB();

await db.run(
  `INSERT INTO recommendations (user_input, recommended_movies)
   VALUES (?, ?)`,
  [userInput, JSON.stringify(recommendations)]
);

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