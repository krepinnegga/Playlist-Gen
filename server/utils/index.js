const cleanAndParseJSON = text => {
  try {
    // Remove markdown code blocks if present
    let cleaned = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // Parse the JSON
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    throw new Error('Failed to parse the response into valid JSON');
  }
};

export { cleanAndParseJSON };
