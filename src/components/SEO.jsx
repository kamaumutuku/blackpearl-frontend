import { Helmet } from "react-helmet-async";

export default function SEO({
  title = "The Black Pearl | Premium Store",
  description = "The Black Pearl offers premium products with fast delivery and secure checkout.",
  keywords = "The Black Pearl, luxury store, premium products, Nairobi",
  image = "/seo-banner.png",
  url = window.location.href,
  type = "website",
}) {
  return (
    <Helmet>
      {/* 🔹 Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="The Black Pearl" />
      <link rel="canonical" href={url} />

      {/* 🔹 Open Graph (Facebook, WhatsApp) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="The Black Pearl" />

      {/* 🔹 Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* 🔹 Mobile / PWA */}
      <meta name="theme-color" content="#0B0B0C" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
    </Helmet>
  );
}
