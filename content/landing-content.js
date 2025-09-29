const landingContent = {
    hero: {
        title: "Zimbabwe's Premier Business Network",
        subtitle: "Bridging the gap between local businesses and customers through innovative technology and community spirit",
        backgroundImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        stats: [
            { number: "500+", label: "Businesses" },
            { number: "10K+", label: "Customers" },
            { number: "24/7", label: "Support" }
        ],
        cta: [
            { text: "Join as Customer", url: "#customers", variant: "primary" },
            { text: "Register Business", url: "#shops", variant: "secondary" }
        ]
    },
    story: {
        title: "Our Story",
        content: `Helensvale Connect was born from a vision to revolutionize local commerce in Zimbabwe. Our journey began in the heart of Harare, where we witnessed the untapped potential of local businesses and the challenges they faced in reaching customers.
        
        We've created a platform that not only connects businesses with customers but also provides the tools and resources needed to thrive in today's digital economy. Our commitment to innovation and community has made us Zimbabwe's fastest-growing business network.`,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
    },
    mission: {
        title: "Our Mission & Vision",
        items: [
            {
                title: "Empower Local Businesses",
                content: "We provide local businesses with the tools, platform, and support they need to succeed in the digital economy.",
                icon: "fas fa-store"
            },
            {
                title: "Enhance Customer Experience",
                content: "We create seamless shopping experiences that make it easy to discover and support local businesses.",
                icon: "fas fa-smile"
            },
            {
                title: "Drive Economic Growth",
                content: "We're committed to fostering sustainable economic development by supporting local entrepreneurship.",
                icon: "fas fa-chart-line"
            },
            {
                title: "Build Community",
                content: "We believe in the power of community to create meaningful connections and lasting impact.",
                icon: "fas fa-users"
            }
        ]
    },
    howItWorks: {
        title: "How It Works",
        steps: [
            {
                number: 1,
                title: "Sign Up",
                description: "Create your account in minutes. Choose between business or customer profiles.",
                icon: "fas fa-user-plus"
            },
            {
                number: 2,
                title: "Set Up",
                description: "Complete your profile and preferences to get personalized recommendations.",
                icon: "fas fa-cog"
            },
            {
                number: 3,
                title: "Connect",
                description: "Start discovering local businesses or reaching new customers instantly.",
                icon: "fas fa-link"
            },
            {
                number: 4,
                title: "Grow",
                description: "Access analytics and tools to grow your business or enhance your shopping experience.",
                icon: "fas fa-chart-line"
            }
        ]
    },
    businessPricing: {
        title: "Business Pricing Plans",
        description: "Choose the perfect plan for your business needs. All plans include a 14-day free trial.",
        plans: [
            {
                name: "Starter",
                price: "$24.99",
                period: "per month",
                description: "Perfect for small businesses getting started",
                features: [
                    "Up to 50 products/services",
                    "Basic analytics dashboard",
                    "Email support (48h response)",
                    "Mobile app access",
                    "Customer reviews"
                ],
                cta: {
                    text: "Start Free Trial",
                    url: "#",
                    variant: "outline"
                },
                popular: false
            },
            {
                name: "Growth",
                price: "$49.99",
                period: "per month",
                description: "For growing businesses looking to expand",
                features: [
                    "Up to 200 products/services",
                    "Advanced analytics",
                    "Priority support (24h response)",
                    "Marketing tools",
                    "Inventory management",
                    "Discount & promotion tools"
                ],
                cta: {
                    text: "Start Free Trial",
                    url: "#",
                    variant: "primary"
                },
                popular: true
            },
            {
                name: "Enterprise",
                price: "Custom",
                period: "Tailored Solution",
                description: "For large businesses with custom needs",
                features: [
                    "Unlimited products/services",
                    "Advanced analytics & reporting",
                    "24/7 dedicated support",
                    "API access",
                    "Custom integrations",
                    "Dedicated account manager"
                ],
                cta: {
                    text: "Contact Sales",
                    url: "mailto:sales@helensvaleconnect.co.zw?subject=Enterprise%20Inquiry",
                    variant: "outline"
                },
                popular: false
            }
        ]
    },
    testimonials: {
        title: "Success Stories",
        subtitle: "Hear from businesses and customers using our platform",
        items: [
            {
                quote: "Since joining Helensvale Connect, our sales have increased by 65%. The platform is incredibly intuitive and the support team is exceptional.",
                author: "Tendai Moyo",
                role: "Boutique Owner, Harare",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            {
                quote: "As a small business owner, the Growth plan has given me all the tools I need to compete with larger retailers. The ROI has been outstanding.",
                author: "James Ndlovu",
                role: "Restaurant Owner, Mutare",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            {
                quote: "The analytics dashboard provides insights I never had access to before. We've optimized our inventory and increased profits by 30%.",
                author: "Sarah Chikomo",
                role: "Retail Manager, Bulawayo",
                image: "https://randomuser.me/api/portraits/women/68.jpg"
            }
        ]
    },
    cta: {
        title: "Ready to Transform Your Business?",
        subtitle: "Join hundreds of Zimbabwean businesses already growing with Helensvale Connect. Start your 14-day free trial today!",
        backgroundImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
        buttons: [
            { text: "View Pricing Plans", url: "#pricing", variant: "primary" },
            { text: "Schedule Demo", url: "#contact", variant: "secondary" }
        ]
    }
};

// This will be used to dynamically update the landing page
document.addEventListener('DOMContentLoaded', function() {
  // Implementation to update the DOM will go here
  // This will be called from the main JavaScript file
});
