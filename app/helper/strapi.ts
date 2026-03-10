const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const strapiToken = process.env.STRAPI_API_TOKEN;

interface FetchOptions {
  path: string;
  query?: Record<string, string | number | boolean>;
}

// Generic Strapi API response type for list endpoints
export interface StrapiListResponse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// case archive page type
export type CaseArchive = {
  title: string;
  description: string;
};

/**
 * Fetch data from Strapi API
 * @param options - Path and optional query parameters
 * @returns Promise with the response data
 */
export async function fetchStrapi({
  path,
  query,
}: FetchOptions): Promise<StrapiListResponse> {
  const url = new URL(`${strapiUrl}/api${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  console.log("Fetching from Strapi:", url.toString());

  try {
    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        ...(strapiToken && { "Authorization": `Bearer ${strapiToken}` }),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Strapi API error ${response.status}:`, errorText);
      throw new Error(`Strapi API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    throw error;
  }
}

/**
 * Get image URL from Strapi
 * @param imagePath - Path to the image from Strapi
 * @returns Full URL to the image
 */
export function getStrapiImageUrl(imagePath: string | null): string {
  if (!imagePath) {
    return "";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${strapiUrl}${imagePath}`;
}

/**
 * Get home page from Strapi
 * @returns Promise with the home page data
 */
export async function getHomePage() {
  return fetchStrapi({
    path: "/home",
    query: {
      populate: "*",
    },
  });
}

/**
 * Get all pages from Strapi
 * @returns Promise with all pages
 */
export async function getPages() {
  return fetchStrapi({
    path: "/pages",
    query: {
      populate: "*",
    },
  });
}

/**
 * Get a single page by slug from Strapi
 * @param slug - The page slug
 * @returns Promise with the page data
 */
export async function getPageBySlug(slug: string) {
  return fetchStrapi({
    path: "/pages",
    query: {
      "filters[slug][$eq]": slug,
      pLevel:5,
    },
  });
}

/**
 * Get all blog posts from Strapi
 * @returns Promise with all blog posts
 */
export async function getBlogPosts() {
  return fetchStrapi({
    path: "/blog-posts",
    query: {
      populate: "*",
      sort: "publishedAt:desc",
    },
  });
}

/**
 * Get a single blog post by slug from Strapi
 * @param slug - The blog post slug
 * @returns Promise with the blog post data
 */
export async function getBlogPostBySlug(slug: string) {
  return fetchStrapi({
    path: "/blog-posts",
    query: {
      "filters[slug][$eq]": slug,
      populate: "*",
    },
  });
}
