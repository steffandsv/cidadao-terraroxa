import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

// Use gemini-1.5-flash for speed and vision capabilities
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null

interface AnalysisResult {
    sufficient: boolean
    feedback: string
}

export async function analyzeImageQuality(base64Image: string, promptInstruction: string): Promise<AnalysisResult> {
    if (!model) {
        console.warn("Gemini API Key not set. Mocking response.")
        // Mock response for dev environment without key
        return { sufficient: true, feedback: "Análise simulada: A foto parece boa." }
    }

    try {
        // Strip header if present (data:image/jpeg;base64,...)
        const imageParts = [
            {
                inlineData: {
                    data: base64Image.replace(/^data:image\/\w+;base64,/, ""),
                    mimeType: "image/jpeg",
                },
            },
        ]

        const prompt = `${promptInstruction}

        Responda EXATAMENTE no seguinte formato JSON:
        {
            "sufficient": boolean,
            "feedback": "Texto explicativo curto para o usuário"
        }
        `

        const result = await model.generateContent([prompt, ...imageParts])
        const response = await result.response
        const text = response.text()

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim()

        const parsed = JSON.parse(jsonStr)
        return {
            sufficient: parsed.sufficient,
            feedback: parsed.feedback
        }

    } catch (error) {
        console.error("Gemini Analysis Error:", error)
        return { sufficient: false, feedback: "Erro ao analisar imagem. Tente novamente." }
    }
}
