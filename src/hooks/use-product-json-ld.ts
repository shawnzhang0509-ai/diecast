import { useEffect } from 'react';
import type { Product } from '../types/product';
import { SITE_URL } from '@/config/site-links';
import { SHIPPING_ZONES } from '@/config/shipping';
import { DELIVERY_DAYS } from '@/config/delivery';

/**
 * schema.org Product data for search engines (Google reads JSON-LD added by script). An offer only when the model has
 * a price and can be bought (a live Trade Me listing): made to order, so BackOrder, with our courier rates and the
 * 2–3 week delivery time.
 */
export function useProductJsonLd(product?: Product) {
  useEffect(() => {
    if (!product) return;
    const cheapest = Math.min(...SHIPPING_ZONES.map((z) => z.price));
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      sku: product.id,
      image: (product.images?.length ? product.images : [product.image]).slice(0, 6),
      description: product.description,
      brand: { '@type': 'Brand', name: product.brandShort || product.brand },
      ...(product.price > 0 && product.trademeUrl
        ? {
            offers: {
              '@type': 'Offer',
              url: `${SITE_URL}/product/${product.id}`,
              price: product.price.toFixed(2),
              priceCurrency: 'NZD',
              availability: 'https://schema.org/BackOrder',
              itemCondition: 'https://schema.org/NewCondition',
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: { '@type': 'MonetaryAmount', value: cheapest.toFixed(2), currency: 'NZD' },
                shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'NZ' },
                deliveryTime: {
                  '@type': 'ShippingDeliveryTime',
                  handlingTime: { '@type': 'QuantitativeValue', minValue: DELIVERY_DAYS.min - 3, maxValue: DELIVERY_DAYS.max - 3, unitCode: 'DAY' },
                  transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
                },
              },
            },
          }
        : {}),
    };
    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.text = JSON.stringify(data);
    document.head.appendChild(tag);
    return () => tag.remove();
  }, [product]);
}
