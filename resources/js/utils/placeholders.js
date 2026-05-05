const svgPlaceholder = (width, height, label) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="12" y="12" width="${Math.max(width - 24, 0)}" height="${Math.max(height - 24, 0)}" rx="12" fill="#e5e7eb" stroke="#cbd5e1"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="${Math.max(
        Math.min(width, height) / 10,
        12
      )}">${label}</text>
    </svg>`
  )}`;

export const productPlaceholder = svgPlaceholder(400, 400, "No Image");
export const promoPlaceholder = svgPlaceholder(400, 500, "Promo");
export const smallProductPlaceholder = svgPlaceholder(150, 150, "Product");
export const cartPlaceholder = svgPlaceholder(100, 100, "Cart");
export const wideProductPlaceholder = svgPlaceholder(500, 300, "Featured");
export const orderPlaceholder = svgPlaceholder(220, 220, "Order");
