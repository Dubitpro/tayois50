import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export default function SEO({ 
  title, 
  description, 
  image = "https://images.unsplash.com/photo-1542314831-c6a4d14d285c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80", 
  url = "https://golden-jubilee-tribute.com" 
}: SEOProps) {
  const fullTitle = `${title} | Royal Golden Jubilee`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#D4AF37" />
    </Helmet>
  );
}
