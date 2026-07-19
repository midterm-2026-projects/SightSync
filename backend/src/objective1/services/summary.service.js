import { generateSummary } from "./ai.service.js";

export const generateSummaryService = async (prompt) => {

    try{
        const ai_summary = await generateSummary(prompt);

        return ai_summary;
        
    } catch (error){
        console.error("AI Summary Error:", error);

        throw new Error("Summary service is temporarily unavailable.");
    }
};