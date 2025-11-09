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
  id: string; 
  recipeId: string;
  ingredientId: string;
  quantity: number;
};

export type Recipe = {
  id: string;
  name: string;
  description: string;
  portionSize?: string;
  imageUrl?: string;
  imageHint?: string;
  laborCost: number;
  overheadCost: number;
};
