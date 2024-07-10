export interface Recipe {
  name: string;
  ingredients_needed: string;
  preparation: string[];
}

export interface RecipesData {
  ingredients_on_image: string;
  recipes: Recipe[];
}