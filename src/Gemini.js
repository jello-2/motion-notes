import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyDF3iTtAGVEZlooiNBWFOK5_oDzQhupc_8');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ask = async (prompt) => {
    try {
        const result = await model.generateContent("Answer this prompt masterfully. Keep it brief and to the point while being useful. " + prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating content:', error);
        if (error.message.includes('Candidate was blocked due to SAFETY')) {
            return "Content may be inappropriate.";
        }
        throw error;
    }
};


export default ask;
