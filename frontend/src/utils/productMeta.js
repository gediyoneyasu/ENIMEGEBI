export const getProductMeta = (id = '') => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const h = Math.abs(hash);
  return {
    discount: 10 + (h % 35),
    sold: 100 + (h % 3000),
    rating: 3.5 + (h % 15) / 10,
    reviewCount: 20 + (h % 800),
    isChoice: h % 4 === 0,
    progress: 35 + (h % 60)
  };
};
