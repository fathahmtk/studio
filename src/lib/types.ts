export type Supplier = {
  id: string;
  name: string;
  contactInformation: string;
};

export type Ingredient = {
  id: string;
  name: string;
  description?: string;
  purchaseCost: number;
  unitMeasurement: 'kg' | 'g' | 'l' | 'ml' | 'piece';
  supplierId: string;
  stock?: number;
};

export type RecipeIngredient = {
  id: string; // This will be the ingredientId from the subcollection
  ingredientId: string;
  quantity: number;
  // We can fetch ingredient details separately if needed
  name?: string;
  purchaseCost?: number;
  unitMeasurement?: 'kg' | 'g' | 'l' | 'ml' | 'piece';
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  portionSize?: string;
  imageUrl?: string;
  imageHint?: string;
  // Representing the subcollection
  recipeIngredients?: RecipeIngredient[];
  // These could be part of a subcollection or denormalized
  laborCost: number;
  overheadCost: number;
};
