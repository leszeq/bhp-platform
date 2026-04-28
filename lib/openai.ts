import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_build_key',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  maxRetries: 5, // Zwiększona liczba prób przy błędach 429
})

export const isAiMockMode = process.env.AI_MOCK_MODE === 'true'
