import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Analyzes an image using Google Gemini 1.5 Flash.
 * @param {File} imageFile - The image file to analyze.
 * @param {string} apiKey - The user's Google AI Studio API Key.
 * @returns {Promise<Object>} - The analysis result.
 */
export async function analyzeImage(imageFile, apiKey) {
    if (!apiKey) {
        throw new Error("API Key is required");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Use specific version requested by user
        const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

        // Convert file to base64
        const base64Data = await fileToBase64(imageFile);

        const prompt = `
        You are an AI assistant specialized in analyzing images of official documents. Your task is to examine the provided image of a disabled person parking placard, identify the expiration date, and determine if it is currently valid.

        The current date for reference is December 6, 2025.

        Follow these steps:
        1. Locate the text within the image that specifies the expiration date.
        2. Compare that date to the current date (December 6, 2025).
        3. State clearly whether the placard is "Valid" or "Not Valid".
        4. Provide a brief, one-sentence explanation for your determination, mentioning the visible expiration date.

        Return a VALID JSON object (no markdown formatting, just the raw JSON) with the following fields:
        - isViolation (boolean): true if it appears to be a violation, false otherwise.
        - reason (string): A short specific explanation of why it is or isn't a violation.
        - licensePlate (string): The license plate number if visible, otherwise "Unknown".
        - confidence (number): A value between 0.0 and 1.0 indicating your confidence in the assessment.
        - location (string): "Fairpark HQ (Detected)" (hardcoded for now as we don't have geo-data).

        If it is NOT a vehicle or NOT a parking analysis, return isViolation: false and explain why.
        `;

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: imageFile.type
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // 1. Try to find a JSON code block
        const jsonBlockMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);

        let cleanText;
        if (jsonBlockMatch) {
            cleanText = jsonBlockMatch[1];
        } else {
            // 2. Fallback: Try to find the first '{' and the last '}'
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');

            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                cleanText = text.substring(firstBrace, lastBrace + 1);
            }
        }

        if (!cleanText) {
            console.error("No JSON found in Gemini response:", text);
            throw new Error("Invalid response format: No JSON object found");
        }

        try {
            const analysis = JSON.parse(cleanText);

            // Add raw text for debugging/reference
            analysis.rawText = text;

            return analysis;
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            throw new Error("Invalid response format from AI model");
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error(`Analysis Failed: ${error.message}`);
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove data:image/xxx;base64, prefix
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = error => reject(error);
    });
}
