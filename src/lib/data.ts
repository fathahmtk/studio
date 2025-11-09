import type { Ingredient, Recipe } from '@/lib/types';

export const ingredients: Ingredient[] = [
  { id: '1', name: 'Flour', supplier: 'Qatar Flour Mills', cost: 5, unit: 'kg', quantity: 100 },
  { id: '2', name: 'Sugar', supplier: 'Doha Sugar Co.', cost: 8, unit: 'kg', quantity: 50 },
  { id: '3', name: 'Eggs', supplier: 'Local Farms', cost: 0.5, unit: 'piece', quantity: 200 },
  { id: '4', name: 'Milk', supplier: 'Baladna', cost: 6, unit: 'l', quantity: 30 },
  { id: '5', name: 'Chicken Breast', supplier: 'Al Rawdah', cost: 35, unit: 'kg', quantity: 20 },
  { id: '6', name: 'Tomatoes', supplier: 'Central Market', cost: 4, unit: 'kg', quantity: 40 },
  { id: '7', name: 'Olive Oil', supplier: 'Imported Goods Inc.', cost: 25, unit: 'l', quantity: 10 },
  { id: '8', name: 'Basmati Rice', supplier: 'Qatar Food Imports', cost: 12, unit: 'kg', quantity: 80 },
];

export const recipes: Recipe[] = [
  {
    id: '1',
    name: 'Classic Chicken Biryani',
    description: 'Aromatic and flavorful biryani with tender chicken pieces.',
    imageUrl: 'https://picsum.photos/seed/biryani/600/400',
    imageHint: 'chicken biryani',
    ingredients: [
      { ingredientId: '5', quantity: 0.5 },
      { ingredientId: '8', quantity: 0.3 },
      { ingredientId: '6', quantity: 0.2 },
      { ingredientId: '7', quantity: 0.05 },
    ],
    laborCost: 15,
    overhead: 10,
  },
  {
    id: '2',
    name: 'Vanilla Sponge Cake',
    description: 'A light and fluffy cake perfect for any occasion.',
    imageUrl: 'https://picsum.photos/seed/cake/600/400',
    imageHint: 'vanilla cake',
    ingredients: [
      { ingredientId: '1', quantity: 0.5 },
      { ingredientId: '2', quantity: 0.3 },
      { ingredientId: '3', quantity: 4 },
      { ingredientId: '4', quantity: 0.25 },
    ],
    laborCost: 20,
    overhead: 12,
  },
    {
    id: '3',
    name: 'Grilled Chicken Salad',
    description: 'Healthy and delicious salad with grilled chicken breast.',
    imageUrl: 'https://picsum.photos/seed/salad/600/400',
    imageHint: 'chicken salad',
    ingredients: [
      { ingredientId: '5', quantity: 0.2 },
      { ingredientId: '6', quantity: 0.15 },
      { ingredientId: '7', quantity: 0.02 },
    ],
    laborCost: 10,
    overhead: 5,
  },
];
