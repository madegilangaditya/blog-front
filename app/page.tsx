import Hero from "./components/Hero";
import { DynamicContent } from "./helper/render-dynamic-content";
import { getPageBySlug } from "./helper/strapi";

export default async function Home() {
  const response = await getPageBySlug("home");
  const pageData = response?.data?.[0];
  return (
    <main>
      {/* banner home */}
      {/* <section className="h-screen">
        
      </section> */}
      {/* Dynamic Content from Strapi */}
      <DynamicContent
        blocks={pageData?.content}
        options={{ showMissingPlaceholder: process.env.NODE_ENV === "development" }}
      />
    </main>
  );
}
