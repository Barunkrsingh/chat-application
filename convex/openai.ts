import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini AI SDK

const apiKey = process.env.GEMINI_API_KEY; // Use GEMINI_API_KEY for Gemini

// Add a check to ensure apiKey is defined
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}

const genAI = new GoogleGenerativeAI(apiKey); // Initialize Gemini AI

export const chat = action({
	args: {
		messageBody: v.string(),
		conversation: v.id("conversations"),
	},
	handler: async (ctx, args) => {
		const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Use gemini-pro for text generation

		try {
			const result = await model.generateContent(args.messageBody); // Generate content using Gemini
			const response = await result.response;
			const messageContent = response.text(); // Get the text content from Gemini's response

			await ctx.runMutation(api.messages.sendAIGeneratedMessage, { // Call the renamed mutation
				content: messageContent ?? "I'm sorry, I don't have a response for that",
				conversation: args.conversation,
				messageType: "text",
			});
		} catch (error) {
			console.error("Error generating Gemini chat response:", error);
			await ctx.runMutation(api.messages.sendAIGeneratedMessage, {
				content: "An error occurred while processing your request with Gemini AI.",
				conversation: args.conversation,
				messageType: "text",
			});
		}
	},
});

export const dall_e = action({ // This action will now handle image requests, but with Gemini's current capabilities
	args: {
		conversation: v.id("conversations"),
		messageBody: v.string(),
	},
	handler: async (ctx, args) => {
		// Gemini AI's `gemini-pro` model does not directly support image generation from text prompts like DALL-E.
		// If you need image generation, you would typically integrate a separate service here (e.g., Google Cloud's Imagen, or another third-party image generation API).
		// For demonstration, we'll send a message indicating this limitation or a placeholder.

		const errorMessage = "Gemini AI (gemini-pro) does not support image generation directly. Please use a dedicated image generation service.";
		const placeholderImageUrl = "/no-image-available.png"; // You might want to have a placeholder image

		// Option 1: Send an error message as text
		await ctx.runMutation(api.messages.sendAIGeneratedMessage, {
			content: errorMessage,
			conversation: args.conversation,
			messageType: "text",
		});

		// Option 2: Send a placeholder image (if you have one)
		// await ctx.runMutation(api.messages.sendAIGeneratedMessage, {
		// 	content: placeholderImageUrl,
		// 	conversation: args.conversation,
		// 	messageType: "image",
		// });
	},
});
