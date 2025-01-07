import type { Route } from "./+types/home";
import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Create a configured instance
const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const recipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
});

type Recipe = z.infer<typeof recipeSchema>;

export async function loader() {
  const result = await generateObject({
    model: openai('gpt-3.5-turbo'),
    prompt: 'Write an Italian traditional recipe for a pizza margherita. Always use metric units, and use the metric system for the ingredients.',
    schema: recipeSchema,
  });

  console.log(result);

  return result;
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
  const {
    object: {
      name, 
      ingredients, 
      instructions
    }
  } = loaderData;

  return (
    <div className="recipe-container">
      <h2>{name}</h2>
      <ul>
        {ingredients.map((ingredient) => <li key={ingredient}>{ingredient}</li>)}
      </ul>
      <ol>
        {instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
      </ol>
    </div>
  );
}
