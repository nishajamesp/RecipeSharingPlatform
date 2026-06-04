// POST /api/ai/suggest  — suggests recipes based on ingredients
export const suggestRecipes = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ message: 'Please provide ingredients' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-opus-4-20250514',
        max_tokens: 1024,
        messages: [{
          role:    'user',
          content: `I have these ingredients: ${ingredients.join(', ')}.
                    Suggest 3 recipes I can make. For each recipe give:
                    - Name
                    - Cooking time
                    - Difficulty (Easy/Medium/Hard)
                    - Brief description
                    Format as JSON array.`
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;

    // Parse JSON from AI response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : text;

    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/ai/substitute  — suggests ingredient substitutes
export const substituteIngredient = async (req, res) => {
  try {
    const { ingredient, recipeContext } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-opus-4-20250514',
        max_tokens: 512,
        messages: [{
          role:    'user',
          content: `What can I substitute for "${ingredient}" in a ${recipeContext || 'recipe'}?
                    Give 3 substitutes with brief explanations. Format as JSON array with
                    fields: substitute, ratio, notes.`
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const substitutes = jsonMatch ? JSON.parse(jsonMatch[0]) : text;

    res.json({ substitutes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};