import { HUGGINGFACE_API_KEY, DEFAULT_MODEL } from "./config"

export interface ModelConfig {
  provider: "huggingface"
  modelName: string
}

export interface ClarifyingQuestion {
  id: string
  question: string
  answer: string
}

export interface PromptEnhancementResult {
  enhancedPrompt: string
  clarifyingQuestions: ClarifyingQuestion[]
  suggestions: string[]
}

// Get the current model configuration - now always returns the fixed config
export function getCurrentModel(): ModelConfig {
  return {
    provider: "huggingface",
    modelName: DEFAULT_MODEL,
  }
}

// This function is now a no-op since we're using a fixed configuration
export function saveModelConfig(config: ModelConfig) {
  // No-op function to maintain API compatibility
  console.log("Model configuration is fixed to Mixtral 8x7B")
  return
}

// Custom function to call Hugging Face API
async function callHuggingFaceAPI(prompt: string, system: string) {
  const apiKey = HUGGINGFACE_API_KEY
  const model = DEFAULT_MODEL
  const url = `https://api-inference.huggingface.co/models/${model}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      inputs: `<|system|>\n${system}\n<|user|>\n${prompt}\n<|assistant|>`,
      parameters: {
        max_new_tokens: 1024,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.statusText}`)
  }

  const result = await response.json()
  return result[0]?.generated_text || ""
}

// Generate text with the model
async function generateWithModel(system: string, prompt: string) {
  const fullResponse = await callHuggingFaceAPI(prompt, system)

  // Extract just the assistant's response
  const assistantResponseMatch = fullResponse.match(/<\|assistant\|>\n([\s\S]*)/)
  const text = assistantResponseMatch ? assistantResponseMatch[1].trim() : fullResponse

  return { text }
}

export async function generateClarifyingQuestions(originalPrompt: string): Promise<ClarifyingQuestion[]> {
  const system = `You are a prompt engineering assistant. Your task is to generate 3 clarifying questions that will help improve the user's prompt.
  The questions should help understand the user's intent, desired output format, and specific requirements.
  Return the questions in a JSON array format with each question having an "id" and "question" field.`

  const { text } = await generateWithModel(system, `Original prompt: "${originalPrompt}"`)

  try {
    const parsed = JSON.parse(text)
    // Ensure we have an array of objects with id and question properties
    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => {
        // If item is already in the correct format, return it
        if (typeof item === "object" && item !== null && "id" in item && "question" in item) {
          return item
        }
        // Otherwise, create a properly formatted object
        return {
          id: `q-${index}`,
          question: typeof item === "string" ? item : String(item),
        }
      })
    }
    return []
  } catch (error) {
    console.error("Error parsing clarifying questions:", error)
    return []
  }
}

export async function generateSuggestions(originalPrompt: string): Promise<string[]> {
  const system = `You are a prompt engineering assistant. Your task is to generate 3 specific suggestions to improve the user's prompt.
  The suggestions should focus on making the prompt more specific, structured, and effective for LLMs.
  Return the suggestions in a JSON array format of strings.`

  const { text } = await generateWithModel(system, `Original prompt: "${originalPrompt}"`)

  try {
    const parsed = JSON.parse(text)
    // Ensure we have an array of strings
    if (Array.isArray(parsed)) {
      return parsed.map((item) => {
        // If item is an object with a 'suggestion' property, extract it
        if (typeof item === "object" && item !== null && "suggestion" in item) {
          return String(item.suggestion)
        }
        // Otherwise, convert to string
        return String(item)
      })
    }
    return []
  } catch (error) {
    console.error("Error parsing suggestions:", error)
    return []
  }
}

export async function enhancePrompt(
  originalPrompt: string,
  clarifyingQuestions: ClarifyingQuestion[],
): Promise<string> {
  const questionsWithAnswers = clarifyingQuestions
    .map((q) => `Question: ${q.question}\nAnswer: ${q.answer}`)
    .join("\n\n")

  const system = `You are a prompt engineering assistant. Your task is to enhance the user's original prompt based on their answers to clarifying questions.
  Create a well-structured, specific, and effective prompt that will produce better results from LLMs.
  The enhanced prompt should be comprehensive but concise, and should incorporate all the information from the original prompt and the answers to the clarifying questions.`

  const { text } = await generateWithModel(
    system,
    `Original prompt: "${originalPrompt}"\n\nClarifying questions and answers:\n${questionsWithAnswers}\n\nEnhanced prompt:`,
  )

  return text
}
