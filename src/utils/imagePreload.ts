// Shared image preloader for the projects page and the case studies.
//
// Why not just `new Image().src = ...`? Many hosts (and Vite's dev server)
// send `Cache-Control: no-cache` for images, which makes the browser check
// back with the server every time an <img> with that URL appears, even if
// it was preloaded seconds earlier. On a real connection that check is a
// full round trip, so the hero still shows up late.
//
// Instead, each image is downloaded once as raw data (a Blob) and turned
// into an in-memory `blob:` URL. An <img> pointed at that URL draws straight
// from memory with no network request at all. The blob URLs live for the
// whole visit, so moving between pages never re-downloads anything.

const blobUrls = new Map<string, string>();
const inFlight = new Map<string, Promise<string | undefined>>();

/** Start downloading `src` (if it isn't already) and keep it in memory. */
export function preloadImage(src: string): Promise<string | undefined> {
  const done = blobUrls.get(src);
  if (done) return Promise.resolve(done);
  const pending = inFlight.get(src);
  if (pending) return pending;

  const promise = fetch(src)
    .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(`${res.status}`))))
    .then(async (blob) => {
      const url = URL.createObjectURL(blob);
      // Decode now so the first paint of the <img> doesn't have to.
      const img = new Image();
      img.src = url;
      await img.decode?.().catch(() => {});
      blobUrls.set(src, url);
      return url;
    })
    .catch(() => undefined) // on failure, pages just fall back to the normal URL
    .finally(() => inFlight.delete(src));

  inFlight.set(src, promise);
  return promise;
}

/**
 * The URL an <img> should use for `src`: the in-memory copy if it's ready,
 * otherwise the normal URL (first visit, before the preload finished).
 */
export function imageUrl(src: string): string {
  return blobUrls.get(src) ?? src;
}