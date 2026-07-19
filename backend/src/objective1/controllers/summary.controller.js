import { generateSummaryService } from "../services/summary.service.js";

export const generateSummaryController = async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const ai_summary = await generateSummaryService(prompt);
        res.status(200).json({ ai_summary });
    } catch (error) {
        console.error("AI Summary Error:", error);

        res.status(503).json({
            message: "Summary service is temporarily unavailable."
        });
    }
};