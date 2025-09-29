/**
 * Membership Tiers Configuration
 * Defines the different membership tiers for customers and businesses
 */

export const CUSTOMER_TIERS = {
  FREE: {
    id: 'free',
    name: 'Shopper',
    price: 0,
    billing: 'Free Forever',
    description: 'Shop local with pre-order capabilities',
    features: [
      'Browse local businesses and products',
      'Save favorite items and stores',
      'Pre-order for in-store pickup',
      'View real-time inventory',
      'Price comparison tools',
      'Customer reviews and ratings',
      'Email notifications for sales',
      'Basic customer support (24h response)'
    ],
    geoFeatures: [
      'Search businesses within 10km radius',
      'Store locator with business hours',
      'Walking/driving directions',
      'In-store pickup scheduling'
    ],
    cta: 'Start Shopping',
    featured: true
  },
  VIP: {
    id: 'vip',
    name: 'VIP Member',
    price: 4.99,
    billing: 'per month',
    description: 'Unlimited deliveries and premium perks',
    features: [
      'Everything in Shopper, plus:',
      'Unlimited deliveries (where available)',
      'No minimum order fees',
      'Exclusive VIP-only deals',
      'Priority customer support (2h response)',
      'Early access to sales',
      'Personal shopping assistant',
      'Digital receipt tracking',
      'Exclusive member events'
    ],
    geoFeatures: [
      'Expanded search radius (25km)',
      'Priority delivery scheduling',
      'Real-time order tracking',
      'Save multiple delivery addresses',
      'Heatmap of trending products'
    ],
    cta: 'Become a VIP Member',
    featured: true,
    popular: true,
    perks: [
      'First month free',
      'VIP-only discounts',
      'Birthday rewards',
      'Quarterly member gifts',
      'Invitation to VIP events'
    ]
  }
};

export const BUSINESS_TIERS = {
  ESSENTIAL: {
    id: 'essential',
    name: 'Essential Shop',
    price: 19.99,
    originalPrice: 34.99,
    billing: 'per month (billed monthly)',
    description: 'Perfect for small shops and service providers',
    features: [
      'Business Profile with contact info',
      'List up to 50 products/services',
      'Business hours and location on map',
      'Customer messaging system',
      'Priority placement in local searches',
      'Basic business analytics',
      'Email support (24h response)',
      'Product catalog management',
      'Accept pre-orders',
      'In-store pickup management'
    ],
    geoFeatures: [
      'Appear in location-based searches',
      'Store locator integration',
      'Service area definition (10km radius)',
      'Basic delivery zone setup'
    ],
    cta: 'Get Started',
    featured: true,
    popular: true
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium Retail',
    price: 49.99,
    originalPrice: 79.99,
    billing: 'per month (save 37%)',
    description: 'For established retailers with multiple locations',
    features: [
      'Everything in Essential, plus:',
      'List up to 500 products/services',
      'Multi-location management',
      'Advanced inventory tracking',
      'Priority customer support (4h response)',
      'Advanced business analytics',
      'Email & phone support',
      'Custom product variations',
      'Bulk import/export products',
      'Staff accounts (up to 5)'
    ],
    geoFeatures: [
      'Expanded service area (up to 50km)',
      'Advanced location targeting',
      'Neighborhood-specific promotions',
      'Real-time inventory updates',
      'Multiple delivery zones',
      'Delivery time windows'
    ],
    cta: 'Upgrade to Premium',
    featured: true,
    perks: [
      'Featured in "Top Picks" section',
      'Social media promotion',
      'Dedicated account manager',
      'Monthly performance review'
    ]
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 149.99,
    originalPrice: 249.99,
    billing: 'per month (save 40%)',
    description: 'For large retailers and chains',
    features: [
      'Everything in Premium, plus:',
      'Unlimited product/service listings',
      'Premium Profile with video embeds',
      'Top-tier "Featured" placement',
      'Advanced Analytics & Insights',
      'Unlimited promotions and deals',
      'Dedicated priority support'
    ],
    cta: 'Go Pro',
    featured: true,
    perks: [
      'All Growth perks, plus:',
      'Permanent \'Founding Member\' Badge on Your Profile',
      'Direct Line to a Dedicated Account Manager for the First 3 Months',
      'Guaranteed Top-Tier Placement in Your Category for the First Month'
    ]
  }
};
