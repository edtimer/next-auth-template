export async function handleAuthRedirect({
  url,
  baseUrl,
}: {
  url: string;
  baseUrl: string;
}) {
  try {
    // Only attempt URL parsing if the path contains /signin
    if (url.includes("/signin")) {
      // Create a URL object from the incoming url
      const redirectUrl = new URL(
        url.startsWith("/") ? `${baseUrl}${url}` : url
      );
      const pathname = redirectUrl.pathname;
      const destination = redirectUrl.searchParams.get("from");

      // Handle signin page scenarios
      if (pathname === "/signin") {
        // If no destination is specified, redirect to homepage
        if (!destination) {
          return baseUrl;
        }

        // If destination is specified, redirect there
        if (destination) {
          return `${baseUrl}${destination}`;
        }
      }
    }

    // Default case: return the original URL with proper base handling
    const finalUrl = url.startsWith("/") ? `${baseUrl}${url}` : url;
    return finalUrl;
  } catch (error) {
    console.error("Error in handleAuthRedirect:", error);
    return baseUrl;
  }
}
