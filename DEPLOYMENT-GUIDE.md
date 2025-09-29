# Helensvale Connect - Deployment Guide

## Pre-Launch Deployment Checklist

### 1. Domain and DNS Setup (helensvaleconnect.art)

1. **Squarespace DNS Configuration**
   - Log in to your domain registrar (where helensvaleconnect.art is registered)
   - Update the following DNS records:

   ```
   Type    | Name  | Value
   ---------------------------------------------
   A       | @     | 198.185.159.145
   A       | @     | 198.185.159.144
   A       | @     | 198.49.23.144
   A       | @     | 198.49.23.145
   CNAME   | www   | ext-cust.squarespace.com
   ```

   - For SSL/HTTPS (recommended), ensure the following records are also set:
     - CAA records for Let's Encrypt
     - Or use Squarespace's built-in SSL

2. **Verify DNS Propagation**
   - Use tools like [DNS Checker](https://dnschecker.org/) to verify propagation
   - Allow up to 48 hours for full propagation

### 2. Squarespace Setup

1. **Create New Site**
   - Log in to your Squarespace account
   - Create a new site and select a template (minimalist templates work best for custom code)
   - Set the site title to "Helensvale Connect"

2. **Domain Connection**
   - Go to Settings > Domains
   - Click "Use a Domain I Own"
   - Enter "helensvaleconnect.art" and follow the verification steps

3. **Custom Code Injection**
   - Go to Settings > Advanced > Code Injection
   - In the HEADER section, add:
     ```html
     <!-- Preconnect for external resources -->
     <link rel="preconnect" href="https://fonts.googleapis.com">
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     
     <!-- Custom CSS -->
     <link rel="stylesheet" href="/css/core.css">
     <link rel="stylesheet" href="/css/landing.css">
     <link rel="stylesheet" href="/css/dashboard.css">
     <link rel="stylesheet" href="/css/membership.css">
     
     <!-- Font Awesome -->
     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
     
     <!-- Google Fonts -->
     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
     
     <!-- Custom JavaScript -->
     <script src="/js/countdown.js" defer></script>
     <script src="/js/auth.js" defer></script>
     ```

### 3. File Upload

1. **Upload Static Files**
   - Upload all files from the following directories to the Squarespace "Files" section:
     - `/css/*`
     - `/js/*`
     - `/assets/*`
   - Ensure file permissions are set to public

2. **Create Custom Pages**
   - For each HTML file in the root (index.html, business.html, etc.), create a new page in Squarespace
   - Use the "Code" block to paste the HTML content
   - For dynamic pages (like dashboards), use the "Embed" block with an iframe pointing to your hosted application

### 4. Form Handling

1. **Set Up Form Endpoints**
   - Ensure all form actions point to your backend endpoints
   - Test form submissions to verify data is being captured correctly

2. **Email Notifications**
   - Set up email notifications for new registrations
   - Configure auto-responders for signup confirmation

### 5. Testing

1. **Cross-Browser Testing**
   - Test on Chrome, Firefox, Safari, and Edge
   - Verify responsive design on mobile devices

2. **Form Validation**
   - Test all forms with valid and invalid data
   - Verify error messages are clear and helpful

3. **Payment Processing**
   - Test payment flows with test cards
   - Verify webhook integration for payment confirmations

### 6. Analytics and Monitoring

1. **Google Analytics**
   - Add Google Analytics tracking code
   - Set up goals for conversions (signups, purchases, etc.)

2. **Error Monitoring**
   - Set up error tracking (e.g., Sentry, LogRocket)
   - Monitor server logs for 4xx/5xx errors

### 7. Launch Checklist

- [ ] All DNS changes have propagated
- [ ] SSL certificate is active and valid
- [ ] All forms are submitting data correctly
- [ ] Payment processing is working
- [ ] Email notifications are being sent
- [ ] 404/500 error pages are customized
- [ ] SEO metadata is properly set
- [ ] Social media previews are working
- [ ] Analytics are tracking correctly
- [ ] Backup of current site is complete

## Post-Launch Tasks

1. **Monitor Performance**
   - Track page load times
   - Monitor server response times
   - Watch for 404 errors in Google Search Console

2. **Marketing**
   - Submit sitemap to Google Search Console
   - Set up Google Business Profile
   - Plan social media announcements

3. **Support**
   - Set up help desk/email support
   - Create FAQ/documentation
   - Prepare for common user questions

## Troubleshooting

### Common Issues

1. **DNS Not Propagating**
   - Clear DNS cache
   - Try different DNS servers (e.g., Google's 8.8.8.8)
   - Contact domain registrar if issues persist

2. **Mixed Content Warnings**
   - Ensure all resources are loaded over HTTPS
   - Update any hardcoded HTTP URLs

3. **Form Submissions Failing**
   - Check CORS headers on your API
   - Verify form action URLs are correct
   - Check browser console for JavaScript errors

### Support Contacts

- **Squarespace Support**: https://support.squarespace.com
- **Domain Registrar**: [Your registrar's support contact]
- **Backend API**: [Your backend team's contact]
