// src/components/Layout/Footer.jsx

import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: {
      title: "Product",
      links: [
        { name: "Browse Internships", path: "/opportunities" },
        { name: "Companies", path: "/companies" },
        { name: "Create Account", path: "/register" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "Post an Internship", path: "/post-internship" }
      ]
    },
    company: {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Blog", path: "/blog" },
        { name: "Contact", path: "/contact" },
        { name: "Careers", path: "/careers" }
      ]
    },
    legal: {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
        { name: "Security", path: "/security" }
      ]
    }
  };

  const socialLinks = [
    { name: "Twitter", icon: "🐦", path: "https://twitter.com" },
    { name: "LinkedIn", icon: "🔗", path: "https://linkedin.com" },
    { name: "Instagram", icon: "📷", path: "https://instagram.com" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">in</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Intern<span className="text-blue-400">Link</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Connecting students with internship opportunities across Kenya. 
              Your gateway to professional growth and career success.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110"
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{footerLinks.product.title}</h3>
            <ul className="space-y-2">
              {footerLinks.product.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 text-sm hover:text-blue-400 transition duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{footerLinks.company.title}</h3>
            <ul className="space-y-2">
              {footerLinks.company.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 text-sm hover:text-blue-400 transition duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{footerLinks.legal.title}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.links.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    className="text-gray-400 text-sm hover:text-blue-400 transition duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} InternLink by FutureSpace. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs flex items-center gap-2">
            Made with precision by 
            <span className="text-blue-400">FutureSpace</span> 
            & 
            <span className="text-blue-400">KenTom</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;