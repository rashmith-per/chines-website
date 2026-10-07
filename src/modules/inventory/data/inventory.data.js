export const INVENTORY_CATEGORIES = ['Rice', 'Noodles', 'Chicken', 'Seafood', 'Vegetables', 'Sauces', 'Spices', 'Beverages', 'Packaging Materials']

const ago = (days) => Date.now() - days * 86_400_000
const I = (id, name, category, unit, stock, min, max, cost, supplier, restocked, usage) => ({ id, name, category, unit, stock, min, max, cost, supplier, lastRestocked: ago(restocked), usagePerDay: usage })

export const INVENTORY = [
  I('rice-jasmine', 'Jasmine Rice', 'Rice', 'kg', 42, 20, 80, 145, 'Sri Lakshmi Traders', 3, 9),
  I('rice-sticky', 'Glutinous Rice', 'Rice', 'kg', 12, 5, 25, 160, 'Sri Lakshmi Traders', 6, 1.5),
  I('noodles-hakka', 'Hakka Noodles', 'Noodles', 'kg', 25, 10, 50, 120, 'Ching’s Foodservice', 2, 6),
  I('noodles-rice', 'Flat Rice Noodles', 'Noodles', 'kg', 8, 10, 30, 180, 'Ching’s Foodservice', 5, 2.5),
  I('noodles-egg', 'Egg Noodles', 'Noodles', 'kg', 14, 6, 30, 150, 'Ching’s Foodservice', 2, 2),
  I('chicken-breast', 'Chicken Breast (boneless)', 'Chicken', 'kg', 18, 15, 45, 290, 'Venky’s Fresh', 1, 12),
  I('chicken-mince', 'Chicken Mince', 'Chicken', 'kg', 6, 8, 20, 260, 'Venky’s Fresh', 1, 4),
  I('prawns-tiger', 'Tiger Prawns', 'Seafood', 'kg', 7, 5, 20, 780, 'Coastal Catch Co.', 1, 3),
  I('fish-basa', 'Basa Fillet', 'Seafood', 'kg', 9, 4, 18, 420, 'Coastal Catch Co.', 2, 1.5),
  I('veg-mixed', 'Mixed Vegetables', 'Vegetables', 'kg', 30, 15, 50, 60, 'Bowenpally Market', 0, 10),
  I('veg-bokchoy', 'Bok Choy', 'Vegetables', 'kg', 4, 6, 15, 140, 'Ooty Greens', 1, 2),
  I('veg-mushroom', 'Shiitake Mushroom', 'Vegetables', 'kg', 5, 3, 12, 520, 'Ooty Greens', 2, 1),
  I('tofu', 'Silken Tofu', 'Vegetables', 'kg', 6, 4, 15, 210, 'Soya Fresh', 2, 1.5),
  I('sauce-soy', 'Light Soy Sauce', 'Sauces', 'L', 22, 10, 40, 180, 'Lee Kum Kee India', 7, 2.5),
  I('sauce-schezwan', 'Schezwan Sauce', 'Sauces', 'L', 9, 8, 25, 240, 'House-made', 2, 2),
  I('sauce-oyster', 'Oyster Sauce', 'Sauces', 'L', 3, 5, 15, 390, 'Lee Kum Kee India', 9, 0.8),
  I('sauce-chilli-oil', 'Chilli Oil', 'Sauces', 'L', 6, 4, 12, 310, 'House-made', 3, 0.7),
  I('spice-sichuan', 'Sichuan Peppercorn', 'Spices', 'kg', 1.8, 1, 5, 1650, 'Spice Route Imports', 12, 0.15),
  I('spice-fivespice', 'Five Spice Powder', 'Spices', 'kg', 2.5, 1, 5, 980, 'Spice Route Imports', 15, 0.1),
  I('spice-chilli', 'Dried Red Chillies', 'Spices', 'kg', 4, 2, 10, 420, 'Guntur Spice Co.', 8, 0.4),
  I('bev-jasmine', 'Jasmine Pearl Tea', 'Beverages', 'kg', 1.2, 1.5, 5, 3800, 'Darjeeling Tea House', 20, 0.12),
  I('bev-oolong', 'Oolong Tea', 'Beverages', 'kg', 2, 1, 5, 2900, 'Darjeeling Tea House', 14, 0.08),
  I('bev-lemongrass', 'Lemongrass', 'Beverages', 'kg', 3, 1, 6, 180, 'Ooty Greens', 4, 0.2),
  I('pack-containers', 'Takeaway Containers', 'Packaging Materials', 'pcs', 340, 200, 1000, 9, 'EcoPack Hyderabad', 6, 65),
  I('pack-bags', 'Kraft Paper Bags', 'Packaging Materials', 'pcs', 120, 150, 600, 6, 'EcoPack Hyderabad', 6, 40),
  I('pack-chopsticks', 'Bamboo Chopsticks', 'Packaging Materials', 'pairs', 900, 300, 2000, 2, 'EcoPack Hyderabad', 10, 90),
]

/** Very small recipe model: how much stock one portion consumes. */
export function consumptionFor(line, orderType) {
  const use = []
  const q = line.qty
  if (line.station === 'Noodles') use.push(['noodles-hakka', 0.15 * q])
  if (line.station === 'Rice') use.push(['rice-jasmine', 0.2 * q])
  if (!line.veg && ['Main Course', 'Starters'].includes(line.station)) use.push(['chicken-breast', 0.18 * q])
  if (line.veg && line.station !== 'Beverages' && line.station !== 'Desserts') use.push(['veg-mixed', 0.15 * q])
  if (line.station !== 'Beverages' && line.station !== 'Desserts') use.push(['sauce-soy', 0.02 * q])
  if (line.id?.includes('schezwan') || line.spice >= 2) use.push(['sauce-schezwan', 0.03 * q])
  if (line.id === 'jasmine-tea') use.push(['bev-jasmine', 0.01 * q])
  if (['takeaway', 'delivery'].includes(orderType)) use.push(['pack-containers', q])
  return use
}
