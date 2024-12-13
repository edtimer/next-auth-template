export async function handleAuthRedirect({
  url,
  baseUrl,
}: {
  url: string;
  baseUrl: string;
}) {
  // If we see a URL that contains '/signin?from=', we want to extract
  // the actual destination from the 'from' parameter
  if (url.includes("/signin?from=")) {
    // Parse the URL to get the 'from' parameter
    const signinUrl = new URL(url);
    const destination = signinUrl.searchParams.get("from");

    if (destination) {
      // Decode the destination
      const decodedDestination = decodeURIComponent(destination);

      // If it's a relative URL, make it absolute
      if (decodedDestination.startsWith("/")) {
        const finalUrl = `${baseUrl}${decodedDestination}`;
        return finalUrl;
      }
    }
  }

  // For all other cases, use the default logic
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  }

  // If the URL is already absolute and matches our domain, use it
  if (url.startsWith(baseUrl)) {
    return url;
  }

  // Default to the base URL
  return baseUrl;
}
