import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyCeIA0bZI40-Ckq3A47QdFvbVYJkzu0qAM');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ask = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
};

export default ask;