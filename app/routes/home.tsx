import type { Route } from "./+types/home";
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

// Create a configured instance
const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export async function loader() {
  const { text } = await generateText({
    model: openai('gpt-3.5-turbo'),
    prompt: 'Write an Italian traditional recipe for a pizza margherita. Always use metric units, and use the metric system for the ingredients.',
  });

  return {
    recipe: text
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Pizza Recipe" },
    { name: "description", content: "AI-powered pizza recipe generator" },
  ];
}

export default function Home({
  loaderData
}: Route.ComponentProps) {
  const { recipe } = loaderData;

  return (
    <div className="recipe-container">
      <pre className="recipe">{recipe}</pre>
    </div>
  );
}
