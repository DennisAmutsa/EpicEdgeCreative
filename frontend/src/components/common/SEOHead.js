import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({
  title = "EpicEdge Creative - Project Management for Creative Agencies",
  description = "Transform your creative agency with EpicEdge Creative's powerful project management system. Track progress, collaborate with clients, and deliver exceptional results. Empowering your brand with design, code, and care.",
  keywords = "project management, creative agency, design, web development, client collaboration, project tracking, creative services, digital agency, brand empowerment, Nairobi, Kenya",
  image = "/logo.png",
  url = "https://epicedgecreative.com",
  type = "website",
  structuredData = null
}) => {
  const siteUrl = "https://epicedgecreative.com";
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="EpicEdge Creative" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="EpicEdge Creative" />
      <meta name="publisher" content="EpicEdge Creative" />
      <meta name="copyright" content="EpicEdge Creative" />
      <meta name="application-name" content="EpicEdge Creative" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
