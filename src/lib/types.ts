export type Ingredient = {
  id: string;
  name: string;
  supplier: string;
  cost: number;
  unit: 'kg' | 'g' | 'l' | 'ml' | 'piece';
  quantity: number;
};

export type RecipeIngredient = {
  ingredientId: string;
  quantity: number;
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  ingredients: RecipeIngredient[];
  laborCost: number;
  overhead: number;
};
