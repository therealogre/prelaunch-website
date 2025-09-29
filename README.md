# Helensvale Connect - Local Business Marketplace

Welcome to Helensvale Connect, a platform connecting local businesses with customers in their community. This repository contains the source code for the Helensvale Connect web application.

## 🚀 Features

### For Businesses
- **Membership Plans**: Choose from Essential, Premium, and Enterprise tiers
- **Secure Payments**: Integrated PayNow payment processing
- **Business Dashboard**: Manage your store, products, and orders
- **Customer Engagement**: Connect with your local customer base

### For Customers
- **Local Discovery**: Find businesses in your area
- **Secure Checkout**: Safe and easy payment processing
- **Order Tracking**: Real-time updates on your orders
- **Exclusive Deals**: Special offers from local businesses

## 🛠️ Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Netlify CLI (for local development)
- Supabase account
- PayNow merchant account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/therealogre/prelaunch-website.git
   cd prelaunch-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in the root directory
   - Update the values in `.env` with your configuration
   - For Netlify deployment, set these variables in your site settings

4. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start the Netlify development server at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# PayNow Integration
PAYNOW_INTEGRATION_ID=your_paynow_id
PAYNOW_INTEGRATION_KEY=your_paynow_key

# MailerLite Configuration (optional)
MAILERLITE_API_KEY=your_mailerlite_api_key
MAILERLITE_GROUP_ID_CUSTOMER=your_customer_group_id
MAILERLITE_GROUP_ID_BUSINESS=your_business_group_id

# Application Settings
NODE_ENV=development
PORT=3000
```

## 🚀 Deployment

### Netlify

1. Connect your GitHub repository to Netlify
2. Set up the build settings:
   - Build command: `npm run build`
   - Publish directory: `.`
   - Functions directory: `functions`
3. Add environment variables in the Netlify dashboard
4. Deploy!

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your hosting provider

## 📦 Project Structure

```
.
├── assets/              # Static assets (images, fonts, etc.)
├── content/             # Content files (markdown, JSON, etc.)
├── css/                 # Global styles
├── functions/           # Netlify serverless functions
├── js/                  # JavaScript source files
│   ├── config/          # Configuration files
│   └── ...
├── .env.example         # Example environment variables
├── .gitignore           # Git ignore file
├── netlify.toml         # Netlify configuration
├── package.json         # Project dependencies
└── README.md            # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For support or questions, please contact support@helensvaleconnect.com

## 📋 Project Structure

```
/
├── index.html                    # Main landing page
├── business-registration-new.html # Business registration
├── business-dashboard.html       # Business dashboard
├── customer-vip.html             # Customer VIP section
├── pricing.html                  # Pricing plans
├── success.html                  # Success pages
├── assets/                      # Images and icons
├── css/                         # Stylesheets
│   ├── core.css                 # Base styles
│   ├── landing.css              # Landing page styles
│   ├── dashboard.css            # Dashboard styles
│   └── membership.css           # Membership styles
└── js/
    ├── countdown.js             # Countdown timer
    ├── business-registration.js # Registration logic
    ├── business-dashboard.js    # Dashboard functionality
    └── registration-countdown.js # 7-day campaign timer
```

## 🚀 Deployment Guide

### Quick Start
1. **Domain Setup**
   - Point `helensvaleconnect.art` to Squarespace servers
   - Verify DNS settings in `DEPLOYMENT-GUIDE.md`

2. **Squarespace Setup**
   - Upload all files to Squarespace
   - Configure custom code injection
   - Set up form handlers and email notifications

3. **Testing**
   - Run through the `TESTING-CHECKLIST.md`
   - Verify all forms and payment processing
   - Test on multiple devices and browsers

## 📅 Timeline

- **Sep 29, 2025**: Registration opens
- **Oct 6, 2025**: Registration closes at 23:59
- **Oct 7, 2025**: Official launch

## 📝 Documentation

- [Deployment Guide](DEPLOYMENT-GUIDE.md) - Complete deployment instructions
- [Testing Checklist](TESTING-CHECKLIST.md) - Pre-launch testing procedures
- [System Architecture](SYSTEM_REFACTOR_REPORT.md) - Technical overview

## 📞 Support

For support, contact:
- Email: support@helensvaleconnect.art
- Phone: +263 77 123 4567
- Live Chat: Available on the website

---

© 2025 Helensvale Connect. All rights reserved.
   - Product list validation

2. Payment flow
   - Successful payment
   - Failed payment
   - Form submission with errors

3. Mobile responsiveness
   - Form layout on small screens
   - Touch targets
   - Input handling

## Deployment

1. Upload all files to your web server
2. Update any API endpoints in the JavaScript files
3. Test the complete flow in a production environment

## Support

For any issues or questions, please contact support@helensvaleconnect.com
