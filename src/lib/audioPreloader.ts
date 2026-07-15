import { SECTION_TRACKS, WELCOME_TRACK } from "@/content/narrationTracks";

/**
 * Downloads every narration track *in full* before the site is revealed, and
 * hands back local `blob:` URLs for them.
 *
 * ## Why not just `<audio preload="auto">` + `canplaythrough`?
 *
 * `canplaythrough` is the browser's *estimate* that it can play to the end
 * without stalling, made against the current download rate — not proof the
 * file has arrived. On a fast local connection the estimate and the reality
 * are the same and everything is instant; on a slower deployed host the
 * estimate fires early, the gate opens on it, and then `play()` still has to
 * wait for bytes — the audible lag between the curtain clearing and the
 * narration starting.
 *
 * A `fetch(...).blob()` has no such ambiguity: when it resolves, every byte
 * is in memory. Pointing the real `<audio>` element at the resulting
 * `blob:` URL means `play()` reads from RAM and starts on the same frame,
 * with no network round-trip — on the hero the instant the door opens, and
 * on every later section the instant it parks.
 *
 * The blobs are fetched once, on first import, and shared: the gate and the
 * section player both read the same map, so the ~1.4MB of audio is downloaded
 * a single time for the whole page.
 */

/** Every track the page will ever play, welcome greeting first. */
const ALL_TRACKS = [WELCOME_TRACK, ...SECTION_TRACKS] as const;

/** Network URL → local `blob:` URL, filled in as each download completes. */
const blobUrls = new Map<string, string>();

let readyPromise: Promise<void> | null = null;

/**
 * Kicks off the downloads (idempotent) and returns a promise that resolves
 * once every track has finished downloading — or failed. A failed track is
 * treated as settled, not fatal: it simply keeps its network URL and the
 * page falls back to streaming it, so one bad file can never hang the gate.
 *
 * Safe to call during render or an effect; the actual fetching only ever
 * happens once per page load.
 */
export function preloadAllAudio(): Promise<void> {
  if (readyPromise) return readyPromise;

  readyPromise = Promise.all(
    ALL_TRACKS.map(async (src) => {
      try {
        const res = await fetch(src);
        if (!res.ok) return;
        const blob = await res.blob();
        blobUrls.set(src, URL.createObjectURL(blob));
      } catch {
        // Network error / offline. Leave this track without a blob URL — the
        // element keeps its original src and streams it the old way. The gate
        // must not be held hostage to one unreachable file.
      }
    }),
  ).then(() => undefined);

  return readyPromise;
}

/**
 * The local `blob:` URL for a track if it has finished downloading, or the
 * original network URL if not (so the element always has a valid, playable
 * source — it just streams instead of playing from memory until the blob is
 * ready). Server-side and before {@link preloadAllAudio} runs this is always
 * the network URL, which is exactly the right SSR value.
 */
export function audioSrc(src: string): string {
  return blobUrls.get(src) ?? src;
}
