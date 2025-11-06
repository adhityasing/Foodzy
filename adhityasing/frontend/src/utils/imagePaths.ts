/**
 * Image paths for frontend assets
 * Images should be placed in: frontend/public/images/
 * 
 * Usage: <img src={imagePaths.products.lemon} alt="Lemon" />
 */

export const imagePaths = {
  // Product images
  products: {
    lemon: '/images/products/lemon.png',
    hazelnut: '/images/products/hazelnut.png',
    watermelon: '/images/products/watermelon.png',
    apple: '/images/products/apple.png',
    'coconut-flakes': '/images/products/coconut-flakes.png',
    'mighty-muffin': '/images/products/mighty-muffin.png',
    'pistachio-butter': '/images/products/pistachio-butter.png',
    'yuya-niacin': '/images/products/yuya-niacin.png',
    'cafe-altura': '/images/products/cafe-altura.png',
    'pukka-latte': '/images/products/pukka-latte.png',
    'chicken-meatballs': '/images/products/chicken-meatballs.png',
    'boomchickapop': '/images/products/boomchickapop.png',
    'foster-farms': '/images/products/foster-farms.png',
    'blue-diamond-almonds': '/images/products/blue-diamond-almonds.png',
    'quinoa-mix': '/images/products/quinoa-mix.png',
    'vegetable-mix': '/images/products/vegetable-mix.png',
    'citrus-mix': '/images/products/citrus-mix.png',
    'green-peas': '/images/products/green-peas.png',
  },
  
  // Hero section images
  hero: {
    freshVegetables: '/images/hero/fresh-vegetables.png',
  },
  
  // Promotional block images
  promotional: {
    onions: '/images/promotional/onions.png',
    smoothie: '/images/promotional/smoothie.png',
    vegetables: '/images/promotional/vegetables.png',
  },
  
  // Delivery/Other images
  delivery: {
    deliveryPerson: '/images/delivery/delivery-person.png',
    cooking: '/images/delivery/cooking.png',
  },
  
  // Footer images
  footer: {
    foodRow: '/images/footer/food-row.png', // Single long image with 5 food items
  },
  
  // Fallback placeholder
  placeholder: '/images/products/placeholder.png',
}

/**
 * Helper function to get product image by product ID or name
 */
export const getProductImage = (productId: string | number, productName?: string): string => {
  // Map product IDs to images
  const productImageMap: Record<string, string> = {
    '1': imagePaths.products.lemon,
    '2': imagePaths.products.hazelnut,
    '3': imagePaths.products.watermelon,
    '4': imagePaths.products.apple,
    '5': imagePaths.products['coconut-flakes'],
    '6': imagePaths.products['mighty-muffin'],
    '7': imagePaths.products['pistachio-butter'],
    '8': imagePaths.products['yuya-niacin'],
    '9': imagePaths.products['cafe-altura'],
    '10': imagePaths.products['pukka-latte'],
    '11': imagePaths.products['chicken-meatballs'],
    '12': imagePaths.products['boomchickapop'],
    '13': imagePaths.products['foster-farms'],
    '14': imagePaths.products['blue-diamond-almonds'],
    '15': imagePaths.products['quinoa-mix'],
    '16': imagePaths.products['vegetable-mix'],
    '17': imagePaths.products['citrus-mix'],
    '18': imagePaths.products['green-peas'],
  }
  
  // Try to get by ID first
  if (productImageMap[String(productId)]) {
    return productImageMap[String(productId)]
  }
  
  // Try to match by product name (case-insensitive)
  if (productName) {
    const nameLower = productName.toLowerCase()
    if (nameLower.includes('lemon')) return imagePaths.products.lemon
    if (nameLower.includes('hazelnut') || nameLower.includes('hazel nut')) return imagePaths.products.hazelnut
    if (nameLower.includes('watermelon')) return imagePaths.products.watermelon
    if (nameLower.includes('apple')) return imagePaths.products.apple
    if (nameLower.includes('coconut')) return imagePaths.products['coconut-flakes']
    if (nameLower.includes('muffin')) return imagePaths.products['mighty-muffin']
    if (nameLower.includes('pistachio')) return imagePaths.products['pistachio-butter']
    if (nameLower.includes('yuya') || nameLower.includes('niacin')) return imagePaths.products['yuya-niacin']
    if (nameLower.includes('cafe') || nameLower.includes('altura') || nameLower.includes('coffee')) return imagePaths.products['cafe-altura']
    if (nameLower.includes('pukka') || nameLower.includes('latte')) return imagePaths.products['pukka-latte']
    if (nameLower.includes('chicken') && nameLower.includes('meatball')) return imagePaths.products['chicken-meatballs']
    if (nameLower.includes('boomchickapop')) return imagePaths.products['boomchickapop']
    if (nameLower.includes('foster') || nameLower.includes('farms')) return imagePaths.products['foster-farms']
    if (nameLower.includes('blue diamond') || (nameLower.includes('almond') && nameLower.includes('blue'))) return imagePaths.products['blue-diamond-almonds']
    if (nameLower.includes('quinoa') && (nameLower.includes('red rice') || nameLower.includes('brown'))) return imagePaths.products['quinoa-mix']
    if (nameLower.includes('vegetable') && nameLower.includes('mix')) return imagePaths.products['vegetable-mix']
    if (nameLower.includes('citrus') || (nameLower.includes('orange') && nameLower.includes('lemon'))) return imagePaths.products['citrus-mix']
    if (nameLower.includes('green peas') || nameLower.includes('pea')) return imagePaths.products['green-peas']
  }
  
  // Return placeholder if no match
  return imagePaths.placeholder
}

