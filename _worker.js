// lib/db.js
var TZ = "America/New_York";
var dayOf = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
var ready = false;
async function db(env) {
  if (!env.DB) throw new Error("no_db");
  if (!ready) {
    await env.DB.batch([
      env.DB.prepare("CREATE TABLE IF NOT EXISTS hits (day TEXT NOT NULL, t TEXT NOT NULL, u INTEGER NOT NULL DEFAULT 0, n INTEGER NOT NULL DEFAULT 0, slug TEXT NOT NULL, ts INTEGER NOT NULL)"),
      env.DB.prepare("CREATE INDEX IF NOT EXISTS hits_day ON hits(day)")
    ]);
    ready = true;
  }
  return env.DB;
}

// lib/spots.json
var spots_default = [{ name: "Jensen Beach, FL", region: "Treasure Coast", slug: "jensen-beach-fl", lat: 27.25, lon: -80.22, face: 80, slope: 0.072, tide: "8722375", buoy: "41114", wave: [1, 3], nws: "Jensen Beach", near: { n: "mlb", r: "sr", i: 61, x: -80.198, y: 27.2567 } }, { name: "Stuart Beach, FL", region: "Treasure Coast", slug: "stuart-beach-fl", lat: 27.2, lon: -80.16, face: 75, slope: 0.078, tide: "8722375", buoy: "41114", wave: [1, 3], nws: "Jensen Beach", near: { n: "mlb", r: "sr", i: 49, x: -80.164, y: 27.1943 } }, { name: "Hobe Sound, FL", region: "Treasure Coast", slug: "hobe-sound-fl", lat: 27.06, lon: -80.11, face: 75, slope: 0.062, tide: "8722375", buoy: "41114", wave: [1, 3], nws: "Jensen Beach", near: { n: "mlb", r: "sr", i: 19, x: -80.113, y: 27.0605 } }, { name: "Fort Pierce, FL", region: "Treasure Coast", slug: "fort-pierce-fl", lat: 27.47, lon: -80.29, face: 70, slope: 0.06, tide: "8722212", buoy: "41114", wave: [1, 3], nws: "Jensen Beach", near: { n: "mlb", r: "sr", i: 100, x: -80.291, y: 27.4695 } }, { name: "Vero Beach, FL", region: "Treasure Coast", slug: "vero-beach-fl", lat: 27.64, lon: -80.36, face: 70, slope: 0.06, tide: "8722105", buoy: "41114", wave: [1, 3], nws: "Melbourne Beach", near: { n: "mlb", r: "sr", i: 140, x: -80.352, y: 27.6406 } }, { name: "Sebastian Inlet, FL", region: "Treasure Coast", slug: "sebastian-inlet-fl", lat: 27.86, lon: -80.45, face: 70, slope: 0.065, tide: "8722004", buoy: "41114", wave: [1, 3], nws: "Melbourne Beach", near: { n: "mlb", r: "sr", i: 196, x: -80.449, y: 27.8623 } }, { name: "Wabasso Beach, FL", region: "Treasure Coast", slug: "wabasso-beach-fl", lat: 27.76, lon: -80.395, face: 70, slope: 0.085, tide: "8722105", buoy: "41114", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 169, x: -80.394, y: 27.758 } }, { name: "Tracking Station Park (Vero), FL", region: "Treasure Coast", slug: "tracking-station-park-vero-fl", lat: 27.675, lon: -80.36, face: 70, slope: 0.069, tide: "8722105", buoy: "41114", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 148, x: -80.362, y: 27.6735 } }, { name: "Round Island Beach, FL", region: "Treasure Coast", slug: "round-island-beach-fl", lat: 27.56, lon: -80.325, face: 70, slope: 0.038, tide: "8722212", buoy: "41114", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 120, x: -80.324, y: 27.5614 } }, { name: "Waveland Beach, FL", region: "Treasure Coast", slug: "waveland-beach-fl", lat: 27.3, lon: -80.215, face: 75, slope: 0.088, tide: "8722375", buoy: "41114", wave: [1, 3], nws: "Jensen Beach", near: { n: "mlb", r: "sr", i: 67, x: -80.217, y: 27.2978 } }, { name: "Bathtub Reef Beach, FL", region: "Treasure Coast", slug: "bathtub-reef-beach-fl", lat: 27.115, lon: -80.15, face: 75, slope: 0.05, tide: "8722375", buoy: "41114", wave: [1, 3], nws: "Jensen Beach", near: { n: "mlb", r: "sr", i: 33, x: -80.142, y: 27.1165 } }, { name: "Blowing Rocks, FL", region: "Treasure Coast", slug: "blowing-rocks-fl", lat: 26.997, lon: -80.085, face: 80, slope: 0.044, tide: "8722495", buoy: "41114", wave: [1, 3], nws: "Jensen Beach", near: { n: "mlb", r: "sr", i: 4, x: -80.089, y: 26.9943 } }, { name: "Jaycee Park (Vero), FL", region: "Treasure Coast", slug: "jaycee-park-vero-fl", lat: 27.65, lon: -80.354, face: 70, slope: 0.063, tide: "8722105", buoy: "41114", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 142, x: -80.355, y: 27.6486 } }, { name: "Pepper Park, FL", region: "Treasure Coast", slug: "pepper-park-fl", lat: 27.49, lon: -80.3, face: 70, slope: 0.055, tide: "8722212", buoy: "41114", wave: [1, 3], nws: "Jensen Beach", near: { n: "mlb", r: "sr", i: 105, x: -80.298, y: 27.4892 } }, { name: "Hobe Sound Refuge Beach, FL", region: "Treasure Coast", slug: "hobe-sound-refuge-beach-fl", lat: 27.03, lon: -80.105, face: 80, slope: 0.056, tide: "8722495", buoy: "41114", wave: [1, 3], nws: "Jensen Beach", near: { n: "mlb", r: "sr", i: 13, x: -80.101, y: 27.0334 } }, { name: "Jupiter, FL", region: "Palm Beach", slug: "jupiter-fl", lat: 26.94, lon: -80.07, face: 80, slope: 0.072, tide: "8722495", buoy: "41114", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 203, x: -80.07, y: 26.9382 } }, { name: "Juno Beach, FL", region: "Palm Beach", slug: "juno-beach-fl", lat: 26.88, lon: -80.05, face: 80, slope: 0.068, tide: "8722495", buoy: "41114", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 193, x: -80.053, y: 26.8791 } }, { name: "Palm Beach, FL", region: "Palm Beach", slug: "palm-beach-fl", lat: 26.7, lon: -80.03, face: 85, slope: 0.064, tide: "8722607", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 172, x: -80.033, y: 26.7036 } }, { name: "Lake Worth Beach, FL", region: "Palm Beach", slug: "lake-worth-beach-fl", lat: 26.61, lon: -80.03, face: 90, slope: 0.081, tide: "8722670", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 161, x: -80.037, y: 26.606 } }, { name: "Delray Beach, FL", region: "Palm Beach", slug: "delray-beach-fl", lat: 26.46, lon: -80.06, face: 90, slope: 0.045, tide: "8722670", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 145, x: -80.057, y: 26.4657 } }, { name: "Boca Raton, FL", region: "Palm Beach", slug: "boca-raton-fl", lat: 26.35, lon: -80.07, face: 90, slope: 0.061, tide: "8722862", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 132, x: -80.07, y: 26.3472 } }, { name: "Coral Cove (Tequesta), FL", region: "Palm Beach", slug: "coral-cove-tequesta-fl", lat: 26.983, lon: -80.077, face: 80, slope: 0.086, tide: "8722495", buoy: "41114", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 208, x: -80.085, y: 26.9832 } }, { name: "Singer Island, FL", region: "Palm Beach", slug: "singer-island-fl", lat: 26.785, lon: -80.032, face: 85, slope: 0.049, tide: "8722607", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 181, x: -80.033, y: 26.7834 } }, { name: "Ocean Ridge, FL", region: "Palm Beach", slug: "ocean-ridge-fl", lat: 26.528, lon: -80.044, face: 90, slope: 0.062, tide: "8722670", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 152, x: -80.048, y: 26.525 } }, { name: "Highland Beach, FL", region: "Palm Beach", slug: "highland-beach-fl", lat: 26.4, lon: -80.064, face: 90, slope: 0.084, tide: "8722862", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 138, x: -80.065, y: 26.4028 } }, { name: "Jupiter Inlet Beach (DuBois), FL", region: "Palm Beach", slug: "jupiter-inlet-beach-dubois-fl", lat: 26.945, lon: -80.072, face: 80, slope: 0.076, tide: "8722495", buoy: "41114", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 205, x: -80.072, y: 26.9459 } }, { name: "Carlin Park, FL", region: "Palm Beach", slug: "carlin-park-fl", lat: 26.927, lon: -80.067, face: 80, slope: 0.07, tide: "8722495", buoy: "41114", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 200, x: -80.067, y: 26.925 } }, { name: "Juno Beach Pier, FL", region: "Palm Beach", slug: "juno-beach-pier-fl", lat: 26.895, lon: -80.056, face: 80, slope: 0.068, tide: "8722495", buoy: "41114", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 195, x: -80.058, y: 26.8958 } }, { name: "Loggerhead Park, FL", region: "Palm Beach", slug: "loggerhead-park-fl", lat: 26.865, lon: -80.045, face: 80, slope: 0.076, tide: "8722495", buoy: "41114", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 191, x: -80.048, y: 26.8629 } }, { name: "Ocean Reef Park, FL", region: "Palm Beach", slug: "ocean-reef-park-fl", lat: 26.7937, lon: -80.0333, face: 85, slope: 0.069, tide: "8722607", buoy: null, wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 182, x: -80.032, y: 26.7904 } }, { name: "Midtown Beach (Palm Beach), FL", region: "Palm Beach", slug: "midtown-beach-palm-beach-fl", lat: 26.708, lon: -80.034, face: 85, slope: 0.064, tide: "8722607", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 173, x: -80.033, y: 26.7117 } }, { name: "Phipps Ocean Park, FL", region: "Palm Beach", slug: "phipps-ocean-park-fl", lat: 26.65, lon: -80.036, face: 90, slope: 0.102, tide: "8722670", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 166, x: -80.037, y: 26.6484 } }, { name: "Lantana Beach, FL", region: "Palm Beach", slug: "lantana-beach-fl", lat: 26.585, lon: -80.039, face: 90, slope: 0.102, tide: "8722670", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 159, x: -80.037, y: 26.5886 } }, { name: "Boynton Inlet, FL", region: "Palm Beach", slug: "boynton-inlet-fl", lat: 26.545, lon: -80.043, face: 90, slope: 0.052, tide: "8722670", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 154, x: -80.044, y: 26.5418 } }, { name: "Atlantic Dunes Park, FL", region: "Palm Beach", slug: "atlantic-dunes-park-fl", lat: 26.44, lon: -80.06, face: 90, slope: 0.045, tide: "8722670", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 142, x: -80.061, y: 26.4367 } }, { name: "Spanish River Park, FL", region: "Palm Beach", slug: "spanish-river-park-fl", lat: 26.385, lon: -80.067, face: 90, slope: 0.078, tide: "8722862", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 136, x: -80.067, y: 26.3857 } }, { name: "Red Reef Park, FL", region: "Palm Beach", slug: "red-reef-park-fl", lat: 26.36, lon: -80.068, face: 90, slope: 0.068, tide: "8722862", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 134, x: -80.069, y: 26.3639 } }, { name: "South Beach Park (Boca), FL", region: "Palm Beach", slug: "south-beach-park-boca-fl", lat: 26.343, lon: -80.071, face: 90, slope: 0.058, tide: "8722862", buoy: "41122", wave: [1, 3], nws: "Palm Beach", near: { n: "mfl", r: "sr", i: 131, x: -80.071, y: 26.3388 } }, { name: "Fort Lauderdale, FL", region: "Broward", slug: "fort-lauderdale-fl", lat: 26.12, lon: -80.1, face: 95, slope: 0.056, tide: "8722899", buoy: "41122", wave: [1, 2.5], nws: "Fort Lauderdale", near: { n: "mfl", r: "sr", i: 106, x: -80.105, y: 26.116 } }, { name: "Hollywood, FL", region: "Broward", slug: "hollywood-fl", lat: 26.01, lon: -80.12, face: 95, slope: 0.046, tide: "8722979", buoy: "41122", wave: [1, 2.5], nws: "Fort Lauderdale", near: { n: "mfl", r: "sr", i: 94, x: -80.116, y: 26.0085 } }, { name: "Deerfield Beach, FL", region: "Broward", slug: "deerfield-beach-fl", lat: 26.317, lon: -80.075, face: 90, slope: 0.059, tide: "8722862", buoy: "41122", wave: [1, 2.5], nws: "Fort Lauderdale", near: { n: "mfl", r: "sr", i: 129, x: -80.075, y: 26.3204 } }, { name: "Pompano Beach, FL", region: "Broward", slug: "pompano-beach-fl", lat: 26.234, lon: -80.088, face: 90, slope: 0.036, tide: "8722862", buoy: "41122", wave: [1, 2.5], nws: "Fort Lauderdale", near: { n: "mfl", r: "sr", i: 119, x: -80.089, y: 26.2329 } }, { name: "Lauderdale-by-the-Sea, FL", region: "Broward", slug: "lauderdale-by-the-sea-fl", lat: 26.19, lon: -80.094, face: 90, slope: 0.058, tide: "8722899", buoy: "41122", wave: [1, 2.5], nws: "Fort Lauderdale", near: { n: "mfl", r: "sr", i: 114, x: -80.096, y: 26.1864 } }, { name: "Dania Beach, FL", region: "Broward", slug: "dania-beach-fl", lat: 26.053, lon: -80.111, face: 95, slope: 0.063, tide: "8722979", buoy: "41122", wave: [1, 2.5], nws: "Fort Lauderdale", near: { n: "mfl", r: "sr", i: 99, x: -80.112, y: 26.0527 } }, { name: "Hallandale Beach, FL", region: "Broward", slug: "hallandale-beach-fl", lat: 25.985, lon: -80.118, face: 95, slope: 0.062, tide: "8723050", buoy: "41122", wave: [1, 2.5], nws: "Fort Lauderdale", near: { n: "mfl", r: "sr", i: 91, x: -80.118, y: 25.9815 } }, { name: "Hillsboro Beach, FL", region: "Broward", slug: "hillsboro-beach-fl", lat: 26.275, lon: -80.078, face: 90, slope: 0.088, tide: "8722862", buoy: "41122", wave: [1, 2.5], nws: "Fort Lauderdale", near: { n: "mfl", r: "sr", i: 124, x: -80.079, y: 26.2766 } }, { name: "Galt Ocean Mile, FL", region: "Broward", slug: "galt-ocean-mile-fl", lat: 26.2, lon: -80.094, face: 90, slope: 0.053, tide: "8722899", buoy: "41122", wave: [1, 2.5], nws: "Fort Lauderdale", near: { n: "mfl", r: "sr", i: 115, x: -80.094, y: 26.1985 } }, { name: "Las Olas Beach, FL", region: "Broward", slug: "las-olas-beach-fl", lat: 26.119, lon: -80.104, face: 95, slope: 0.056, tide: "8722899", buoy: "41122", wave: [1, 2.5], nws: "Fort Lauderdale", near: { n: "mfl", r: "sr", i: 106, x: -80.105, y: 26.116 } }, { name: "John U. Lloyd Beach, FL", region: "Broward", slug: "john-u-lloyd-beach-fl", lat: 26.085, lon: -80.108, face: 95, slope: 0.075, tide: "8722979", buoy: "41122", wave: [1, 2.5], nws: "Fort Lauderdale", near: { n: "mfl", r: "sr", i: 103, x: -80.109, y: 26.0913 } }, { name: "Haulover, FL", region: "Miami", slug: "haulover-fl", lat: 25.9, lon: -80.12, face: 95, slope: 0.042, tide: "8723080", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 82, x: -80.122, y: 25.9018 } }, { name: "Miami Beach, FL", region: "Miami", slug: "miami-beach-fl", lat: 25.79, lon: -80.13, face: 95, slope: 0.06, tide: "8723178", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 69, x: -80.128, y: 25.7888 } }, { name: "South Pointe, Miami Beach, FL", region: "Miami", slug: "south-pointe-miami-beach-fl", lat: 25.765, lon: -80.13, face: 100, slope: 0.03, tide: "8723178", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 67, x: -80.131, y: 25.7713 } }, { name: "Sunny Isles, FL", region: "Miami", slug: "sunny-isles-fl", lat: 25.94, lon: -80.12, face: 95, slope: 0.046, tide: "8723050", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 86, x: -80.12, y: 25.9375 } }, { name: "Surfside, FL", region: "Miami", slug: "surfside-fl", lat: 25.879, lon: -80.121, face: 95, slope: 0.055, tide: "8723080", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 79, x: -80.12, y: 25.8764 } }, { name: "Key Biscayne, FL", region: "Miami", slug: "key-biscayne-fl", lat: 25.7, lon: -80.153, face: 110, slope: 0.062, tide: "8723178", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 61, x: -80.156, y: 25.7 } }, { name: "Golden Beach, FL", region: "Miami", slug: "golden-beach-fl", lat: 25.966, lon: -80.12, face: 95, slope: 0.061, tide: "8723050", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 89, x: -80.119, y: 25.965 } }, { name: "Bal Harbour, FL", region: "Miami", slug: "bal-harbour-fl", lat: 25.89, lon: -80.122, face: 95, slope: 0.052, tide: "8723080", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 81, x: -80.122, y: 25.8936 } }, { name: "North Beach (Miami Beach), FL", region: "Miami", slug: "north-beach-miami-beach-fl", lat: 25.86, lon: -80.12, face: 95, slope: 0.057, tide: "8723080", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 77, x: -80.119, y: 25.8559 } }, { name: "Mid-Beach (41st St), FL", region: "Miami", slug: "mid-beach-41st-st-fl", lat: 25.815, lon: -80.122, face: 95, slope: 0.05, tide: "8723178", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 72, x: -80.122, y: 25.8131 } }, { name: "Lummus Park (South Beach), FL", region: "Miami", slug: "lummus-park-south-beach-fl", lat: 25.78, lon: -80.13, face: 95, slope: 0.03, tide: "8723178", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 68, x: -80.129, y: 25.7801 } }, { name: "Cape Florida, FL", region: "Miami", slug: "cape-florida-fl", lat: 25.67, lon: -80.157, face: 110, slope: 0.081, tide: "8723178", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 57, x: -80.156, y: 25.6667 } }, { name: "Virginia Key Beach, FL", region: "Miami", slug: "virginia-key-beach-fl", lat: 25.74, lon: -80.148, face: 110, slope: 0.067, tide: "8723178", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 64, x: -80.155, y: 25.7348 } }, { name: "Crandon Park North, FL", region: "Miami", slug: "crandon-park-north-fl", lat: 25.725, lon: -80.155, face: 110, slope: 0.08, tide: "8723178", buoy: "41122", wave: [1, 2.5], nws: "Miami", near: { n: "mfl", r: "sr", i: 63, x: -80.148, y: 25.7194 } }, { name: "Bahia Honda, FL", region: "Keys", slug: "bahia-honda-fl", lat: 24.656, lon: -81.277, face: 160, slope: 0.04, tide: "8724138", buoy: "42095", wave: [0.8, 2], nws: null }, { name: "Sombrero Beach (Marathon), FL", region: "Keys", slug: "sombrero-beach-marathon-fl", lat: 24.692, lon: -81.085, face: 180, slope: 0.04, tide: "8723971", buoy: null, wave: [0.8, 2], nws: null }, { name: "Smathers Beach (Key West), FL", region: "Keys", slug: "smathers-beach-key-west-fl", lat: 24.55, lon: -81.773, face: 180, slope: 0.04, tide: "8724557", buoy: "42095", wave: [0.8, 2], nws: null }, { name: "Cannon Beach (Key Largo), FL", region: "Keys", slug: "cannon-beach-key-largo-fl", lat: 25.125, lon: -80.405, face: 110, slope: 0.04, tide: "8723667", buoy: null, wave: [0.8, 2], nws: null }, { name: "Anne's Beach, FL", region: "Keys", slug: "anne-s-beach-fl", lat: 24.85, lon: -80.735, face: 150, slope: 0.03, tide: "8723869", buoy: null, wave: [0.8, 2], nws: null }, { name: "Long Key State Park, FL", region: "Keys", slug: "long-key-state-park-fl", lat: 24.815, lon: -80.822, face: 150, slope: 0.03, tide: "8723899", buoy: null, wave: [0.8, 2], nws: null }, { name: "Coco Plum Beach, FL", region: "Keys", slug: "coco-plum-beach-fl", lat: 24.73, lon: -81, face: 160, slope: 0.03, tide: "8723971", buoy: null, wave: [0.8, 2], nws: null }, { name: "Higgs Beach (Key West), FL", region: "Keys", slug: "higgs-beach-key-west-fl", lat: 24.548, lon: -81.787, face: 180, slope: 0.04, tide: "8724557", buoy: "42095", wave: [0.8, 2], nws: null }, { name: "Fort Zachary Taylor, FL", region: "Keys", slug: "fort-zachary-taylor-fl", lat: 24.546, lon: -81.81, face: 200, slope: 0.05, tide: "8724557", buoy: "42095", wave: [0.8, 2], nws: null }, { name: "Melbourne Beach, FL", region: "Space Coast", slug: "melbourne-beach-fl", lat: 28.07, lon: -80.56, face: 65, slope: 0.053, tide: "8721804", buoy: "41113", wave: [1, 3], nws: "Melbourne Beach", near: { n: "mlb", r: "sr", i: 234, x: -80.561, y: 28.0779 } }, { name: "Cocoa Beach, FL", region: "Space Coast", slug: "cocoa-beach-fl", lat: 28.32, lon: -80.6, face: 85, slope: 0.03, tide: "8721649", buoy: "41113", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 261, x: -80.608, y: 28.3205 } }, { name: "Cape Canaveral (Jetty Park), FL", region: "Space Coast", slug: "cape-canaveral-jetty-park-fl", lat: 28.405, lon: -80.59, face: 95, slope: 0.03, tide: "8721604", buoy: "41113", wave: [1, 3], nws: "Daytona Beach", near: { n: "mlb", r: "sr", i: 277, x: -80.591, y: 28.4073 } }, { name: "Satellite Beach, FL", region: "Space Coast", slug: "satellite-beach-fl", lat: 28.172, lon: -80.591, face: 75, slope: 0.075, tide: "8721804", buoy: "41113", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 244, x: -80.589, y: 28.1706 } }, { name: "Indian Harbour Beach, FL", region: "Space Coast", slug: "indian-harbour-beach-fl", lat: 28.15, lon: -80.585, face: 75, slope: 0.069, tide: "8721804", buoy: "41113", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 242, x: -80.583, y: 28.1491 } }, { name: "Indialantic, FL", region: "Space Coast", slug: "indialantic-fl", lat: 28.09, lon: -80.566, face: 70, slope: 0.052, tide: "8721804", buoy: "41113", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 235, x: -80.566, y: 28.0902 } }, { name: "Cocoa Beach Pier, FL", region: "Space Coast", slug: "cocoa-beach-pier-fl", lat: 28.367, lon: -80.601, face: 85, slope: 0.037, tide: "8721649", buoy: "41113", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 271, x: -80.603, y: 28.3685 } }, { name: "Lori Wilson Park, FL", region: "Space Coast", slug: "lori-wilson-park-fl", lat: 28.335, lon: -80.607, face: 85, slope: 0.03, tide: "8721649", buoy: "41113", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 263, x: -80.608, y: 28.334 } }, { name: "Patrick SFB Beach, FL", region: "Space Coast", slug: "patrick-sfb-beach-fl", lat: 28.24, lon: -80.598, face: 80, slope: 0.077, tide: "8721804", buoy: "41113", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 250, x: -80.601, y: 28.2356 } }, { name: "Paradise Beach Park, FL", region: "Space Coast", slug: "paradise-beach-park-fl", lat: 28.12, lon: -80.578, face: 75, slope: 0.062, tide: "8721804", buoy: "41113", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 239, x: -80.575, y: 28.1197 } }, { name: "Spessard Holland Beach, FL", region: "Space Coast", slug: "spessard-holland-beach-fl", lat: 28.03, lon: -80.54, face: 70, slope: 0.082, tide: "8721804", buoy: "41113", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 228, x: -80.538, y: 28.0261 } }, { name: "Coconut Point, FL", region: "Space Coast", slug: "coconut-point-fl", lat: 27.98, lon: -80.51, face: 70, slope: 0.095, tide: "8722004", buoy: "41113", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 220, x: -80.514, y: 27.9795 } }, { name: "Sebastian Inlet North, FL", region: "Space Coast", slug: "sebastian-inlet-north-fl", lat: 27.866, lon: -80.447, face: 70, slope: 0.067, tide: "8722004", buoy: "41114", wave: [1, 3], nws: "Cocoa Beach", near: { n: "mlb", r: "sr", i: 197, x: -80.451, y: 27.8663 } }, { name: "New Smyrna Beach, FL", region: "Volusia", slug: "new-smyrna-beach-fl", lat: 29.03, lon: -80.89, face: 65, slope: 0.03, tide: "8721164", buoy: "41070", wave: [1, 3], nws: "Daytona Beach", near: { n: "mlb", r: "sr", i: 354, x: -80.887, y: 29.0225 } }, { name: "Daytona Beach, FL", region: "Volusia", slug: "daytona-beach-fl", lat: 29.21, lon: -80.98, face: 70, slope: 0.031, tide: "8721120", buoy: "41070", wave: [1, 3], nws: "Daytona Beach", near: { n: "mlb", r: "sr", i: 386, x: -80.995, y: 29.2016 } }, { name: "Ormond Beach, FL", region: "Volusia", slug: "ormond-beach-fl", lat: 29.287, lon: -81.04, face: 70, slope: 0.038, tide: "8721120", buoy: "41070", wave: [1, 3], nws: "Daytona Beach", near: { n: "mlb", r: "sr", i: 403, x: -81.037, y: 29.2861 } }, { name: "Daytona Beach Shores, FL", region: "Volusia", slug: "daytona-beach-shores-fl", lat: 29.17, lon: -80.972, face: 65, slope: 0.035, tide: "8721120", buoy: "41070", wave: [1, 3], nws: "Daytona Beach", near: { n: "mlb", r: "sr", i: 379, x: -80.978, y: 29.1675 } }, { name: "Ponce Inlet, FL", region: "Volusia", slug: "ponce-inlet-fl", lat: 29.095, lon: -80.933, face: 65, slope: 0.03, tide: "8721120", buoy: "41070", wave: [1, 3], nws: "Daytona Beach", near: { n: "mlb", r: "sr", i: 363, x: -80.935, y: 29.0953 } }, { name: "Main Street Pier (Daytona), FL", region: "Volusia", slug: "main-street-pier-daytona-fl", lat: 29.229, lon: -81.004, face: 70, slope: 0.03, tide: "8721120", buoy: "41070", wave: [1, 3], nws: "Daytona Beach", near: { n: "mlb", r: "sr", i: 392, x: -81.008, y: 29.2282 } }, { name: "Wilbur-by-the-Sea, FL", region: "Volusia", slug: "wilbur-by-the-sea-fl", lat: 29.15, lon: -80.96, face: 65, slope: 0.033, tide: "8721120", buoy: "41070", wave: [1, 3], nws: "Daytona Beach", near: { n: "mlb", r: "sr", i: 375, x: -80.967, y: 29.1476 } }, { name: "Smyrna Dunes, FL", region: "Volusia", slug: "smyrna-dunes-fl", lat: 29.065, lon: -80.912, face: 60, slope: 0.03, tide: "8721164", buoy: "41070", wave: [1, 3], nws: "Daytona Beach", near: { n: "mlb", r: "sr", i: 355, x: -80.91, y: 29.0663 } }, { name: "Flagler Avenue (New Smyrna), FL", region: "Volusia", slug: "flagler-avenue-new-smyrna-fl", lat: 29.04, lon: -80.893, face: 65, slope: 0.03, tide: "8721164", buoy: "41070", wave: [1, 3], nws: "Daytona Beach", near: { n: "mlb", r: "sr", i: 354, x: -80.887, y: 29.0225 } }, { name: "Bethune Beach, FL", region: "Volusia", slug: "bethune-beach-fl", lat: 28.96, lon: -80.855, face: 65, slope: 0.058, tide: "8721164", buoy: "41070", wave: [1, 3], nws: "Daytona Beach", near: { n: "mlb", r: "sr", i: 348, x: -80.848, y: 28.9629 } }, { name: "St. Augustine, FL", region: "First Coast", slug: "st-augustine-fl", lat: 29.86, lon: -81.26, face: 80, slope: 0.03, tide: "8720587", buoy: "41117", wave: [1, 3], nws: "St. Augustine", near: { n: "jax", r: "sr", i: 97, x: -81.266, y: 29.8575 } }, { name: "Jacksonville Beach, FL", region: "First Coast", slug: "jacksonville-beach-fl", lat: 30.29, lon: -81.39, face: 85, slope: 0.043, tide: "8720291", buoy: "41112", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 184, x: -81.389, y: 30.2897 } }, { name: "Fernandina Beach, FL", region: "First Coast", slug: "fernandina-beach-fl", lat: 30.672, lon: -81.432, face: 85, slope: 0.038, tide: "8679997", buoy: "41112", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 243, x: -81.431, y: 30.6682 } }, { name: "Atlantic Beach, FL", region: "First Coast", slug: "atlantic-beach-fl", lat: 30.334, lon: -81.396, face: 85, slope: 0.052, tide: "8720259", buoy: "41112", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 194, x: -81.396, y: 30.3325 } }, { name: "Neptune Beach, FL", region: "First Coast", slug: "neptune-beach-fl", lat: 30.312, lon: -81.394, face: 85, slope: 0.052, tide: "8720259", buoy: "41112", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 189, x: -81.393, y: 30.3114 } }, { name: "Ponte Vedra Beach, FL", region: "First Coast", slug: "ponte-vedra-beach-fl", lat: 30.24, lon: -81.373, face: 80, slope: 0.043, tide: "8720291", buoy: "41117", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 172, x: -81.378, y: 30.2411 } }, { name: "Vilano Beach, FL", region: "First Coast", slug: "vilano-beach-fl", lat: 29.918, lon: -81.293, face: 75, slope: 0.068, tide: "8720587", buoy: "41117", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 106, x: -81.29, y: 29.9151 } }, { name: "Crescent Beach, FL", region: "First Coast", slug: "crescent-beach-fl", lat: 29.768, lon: -81.25, face: 75, slope: 0.036, tide: "8720587", buoy: "41117", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 80, x: -81.252, y: 29.7674 } }, { name: "American Beach, FL", region: "First Coast", slug: "american-beach-fl", lat: 30.59, lon: -81.44, face: 85, slope: 0.044, tide: "8679997", buoy: "41112", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 232, x: -81.444, y: 30.5907 } }, { name: "Little Talbot Island, FL", region: "First Coast", slug: "little-talbot-island-fl", lat: 30.46, lon: -81.405, face: 85, slope: 0.032, tide: "8720194", buoy: "41112", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 216, x: -81.413, y: 30.4595 } }, { name: "Huguenot Park, FL", region: "First Coast", slug: "huguenot-park-fl", lat: 30.41, lon: -81.41, face: 90, slope: 0.03, tide: "8720194", buoy: "41112", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 209, x: -81.407, y: 30.4126 } }, { name: "Hanna Park, FL", region: "First Coast", slug: "hanna-park-fl", lat: 30.37, lon: -81.402, face: 85, slope: 0.045, tide: "8720259", buoy: "41112", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 201, x: -81.399, y: 30.3733 } }, { name: "Mickler's Landing, FL", region: "First Coast", slug: "mickler-s-landing-fl", lat: 30.18, lon: -81.357, face: 80, slope: 0.07, tide: "8720291", buoy: "41117", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 160, x: -81.361, y: 30.1772 } }, { name: "Guana Beach (South Ponte Vedra), FL", region: "First Coast", slug: "guana-beach-south-ponte-vedra-fl", lat: 30.03, lon: -81.325, face: 80, slope: 0.072, tide: "8720587", buoy: "41117", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 130, x: -81.325, y: 30.028 } }, { name: "Anastasia State Park, FL", region: "First Coast", slug: "anastasia-state-park-fl", lat: 29.875, lon: -81.27, face: 80, slope: 0.035, tide: "8720587", buoy: "41117", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 100, x: -81.271, y: 29.8738 } }, { name: "St. Augustine Beach Pier, FL", region: "First Coast", slug: "st-augustine-beach-pier-fl", lat: 29.857, lon: -81.264, face: 80, slope: 0.03, tide: "8720587", buoy: "41117", wave: [1, 3], nws: "Jacksonville Beach", near: { n: "jax", r: "sr", i: 97, x: -81.266, y: 29.8575 } }, { name: "Honeymoon Island, FL", region: "Tampa Bay", slug: "honeymoon-island-fl", lat: 28.072, lon: -82.833, face: 270, slope: 0.044, tide: "8726809", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 10, x: -82.836, y: 28.0751 } }, { name: "Clearwater Beach, FL", region: "Tampa Bay", slug: "clearwater-beach-fl", lat: 27.978, lon: -82.829, face: 270, slope: 0.03, tide: "8726724", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 29, x: -82.829, y: 27.9788 } }, { name: "Indian Rocks Beach, FL", region: "Tampa Bay", slug: "indian-rocks-beach-fl", lat: 27.89, lon: -82.852, face: 265, slope: 0.04, tide: "8726601", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 44, x: -82.851, y: 27.891 } }, { name: "Madeira Beach, FL", region: "Tampa Bay", slug: "madeira-beach-fl", lat: 27.797, lon: -82.799, face: 250, slope: 0.034, tide: "8726533", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 69, x: -82.798, y: 27.7978 } }, { name: "Treasure Island, FL", region: "Tampa Bay", slug: "treasure-island-fl", lat: 27.768, lon: -82.771, face: 250, slope: 0.03, tide: "8726533", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 78, x: -82.771, y: 27.7659 } }, { name: "St. Pete Beach, FL", region: "Tampa Bay", slug: "st-pete-beach-fl", lat: 27.725, lon: -82.746, face: 250, slope: 0.03, tide: "TEC4271", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 89, x: -82.743, y: 27.7253 } }, { name: "Pass-a-Grille, FL", region: "Tampa Bay", slug: "pass-a-grille-fl", lat: 27.69, lon: -82.738, face: 245, slope: 0.03, tide: "TEC4271", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 97, x: -82.738, y: 27.6891 } }, { name: "Anna Maria Island, FL", region: "Tampa Bay", slug: "anna-maria-island-fl", lat: 27.531, lon: -82.737, face: 260, slope: 0.032, tide: "8726243", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 122, x: -82.739, y: 27.5273 } }, { name: "Bradenton Beach, FL", region: "Tampa Bay", slug: "bradenton-beach-fl", lat: 27.468, lon: -82.7, face: 255, slope: 0.044, tide: "8726243", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 137, x: -82.699, y: 27.4663 } }, { name: "Fred Howard Park, FL", region: "Tampa Bay", slug: "fred-howard-park-fl", lat: 28.155, lon: -82.808, face: 260, slope: 0.03, tide: "8726809", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 7, x: -82.847, y: 28.164 } }, { name: "Caladesi Island, FL", region: "Tampa Bay", slug: "caladesi-island-fl", lat: 28.03, lon: -82.823, face: 270, slope: 0.03, tide: "8726809", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 17, x: -82.822, y: 28.0321 } }, { name: "Sand Key Park, FL", region: "Tampa Bay", slug: "sand-key-park-fl", lat: 27.958, lon: -82.83, face: 270, slope: 0.03, tide: "8726724", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 33, x: -82.831, y: 27.9563 } }, { name: "Belleair Beach, FL", region: "Tampa Bay", slug: "belleair-beach-fl", lat: 27.93, lon: -82.845, face: 265, slope: 0.051, tide: "8726724", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 37, x: -82.842, y: 27.9309 } }, { name: "Redington Shores, FL", region: "Tampa Bay", slug: "redington-shores-fl", lat: 27.83, lon: -82.832, face: 255, slope: 0.032, tide: "8726601", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 59, x: -82.832, y: 27.8282 } }, { name: "Sunset Beach (Treasure Island), FL", region: "Tampa Bay", slug: "sunset-beach-treasure-island-fl", lat: 27.745, lon: -82.757, face: 245, slope: 0.035, tide: "8726533", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 83, x: -82.758, y: 27.7427 } }, { name: "Upham Beach, FL", region: "Tampa Bay", slug: "upham-beach-fl", lat: 27.738, lon: -82.752, face: 250, slope: 0.03, tide: "8726533", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 85, x: -82.753, y: 27.7363 } }, { name: "Fort De Soto (North Beach), FL", region: "Tampa Bay", slug: "fort-de-soto-north-beach-fl", lat: 27.638, lon: -82.74, face: 260, slope: 0.03, tide: "TEC4271", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 107, x: -82.739, y: 27.6364 } }, { name: "Holmes Beach, FL", region: "Tampa Bay", slug: "holmes-beach-fl", lat: 27.51, lon: -82.72, face: 255, slope: 0.035, tide: "8726243", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 128, x: -82.721, y: 27.5098 } }, { name: "Coquina Beach, FL", region: "Tampa Bay", slug: "coquina-beach-fl", lat: 27.45, lon: -82.692, face: 250, slope: 0.039, tide: "8726243", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 140, x: -82.693, y: 27.4501 } }, { name: "Longboat Key, FL", region: "Sarasota", slug: "longboat-key-fl", lat: 27.4, lon: -82.662, face: 250, slope: 0.045, tide: "8726243", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 150, x: -82.656, y: 27.4075 } }, { name: "Lido Key, FL", region: "Sarasota", slug: "lido-key-fl", lat: 27.312, lon: -82.58, face: 250, slope: 0.03, tide: "8726034", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 173, x: -82.578, y: 27.3123 } }, { name: "Siesta Key, FL", region: "Sarasota", slug: "siesta-key-fl", lat: 27.266, lon: -82.552, face: 250, slope: 0.03, tide: "8726034", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 182, x: -82.553, y: 27.2665 } }, { name: "Venice, FL", region: "Sarasota", slug: "venice-fl", lat: 27.1, lon: -82.461, face: 265, slope: 0.084, tide: "8725858", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 215, x: -82.46, y: 27.0998 } }, { name: "Manasota Key, FL", region: "Sarasota", slug: "manasota-key-fl", lat: 26.97, lon: -82.4, face: 250, slope: 0.062, tide: "8725858", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 237, x: -82.395, y: 26.9766 } }, { name: "Whitney Beach (Longboat), FL", region: "Sarasota", slug: "whitney-beach-longboat-fl", lat: 27.44, lon: -82.688, face: 250, slope: 0.038, tide: "8726243", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 141, x: -82.689, y: 27.4428 } }, { name: "North Lido Beach, FL", region: "Sarasota", slug: "north-lido-beach-fl", lat: 27.325, lon: -82.587, face: 250, slope: 0.03, tide: "8726034", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 169, x: -82.587, y: 27.3275 } }, { name: "South Lido Beach, FL", region: "Sarasota", slug: "south-lido-beach-fl", lat: 27.3, lon: -82.57, face: 240, slope: 0.03, tide: "8726034", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 175, x: -82.571, y: 27.3023 } }, { name: "Crescent Beach (Siesta), FL", region: "Sarasota", slug: "crescent-beach-siesta-fl", lat: 27.255, lon: -82.545, face: 250, slope: 0.03, tide: "8726034", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 184, x: -82.541, y: 27.2576 } }, { name: "Turtle Beach, FL", region: "Sarasota", slug: "turtle-beach-fl", lat: 27.22, lon: -82.518, face: 250, slope: 0.071, tide: "8726034", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 191, x: -82.518, y: 27.2206 } }, { name: "Nokomis Beach, FL", region: "Sarasota", slug: "nokomis-beach-fl", lat: 27.125, lon: -82.47, face: 260, slope: 0.065, tide: "8725858", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 210, x: -82.472, y: 27.126 } }, { name: "Brohard Beach (Venice), FL", region: "Sarasota", slug: "brohard-beach-venice-fl", lat: 27.07, lon: -82.45, face: 260, slope: 0.063, tide: "8725858", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 221, x: -82.448, y: 27.0679 } }, { name: "Caspersen Beach, FL", region: "Sarasota", slug: "caspersen-beach-fl", lat: 27.058, lon: -82.443, face: 260, slope: 0.062, tide: "8725858", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 223, x: -82.443, y: 27.0564 } }, { name: "Englewood Beach, FL", region: "Sarasota", slug: "englewood-beach-fl", lat: 26.93, lon: -82.36, face: 240, slope: 0.057, tide: "8725858", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 246, x: -82.366, y: 26.9313 } }, { name: "Stump Pass Beach, FL", region: "Sarasota", slug: "stump-pass-beach-fl", lat: 26.9, lon: -82.337, face: 240, slope: 0.052, tide: "8725577", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 255, x: -82.339, y: 26.8977 } }, { name: "Point of Rocks (Siesta), FL", region: "Sarasota", slug: "point-of-rocks-siesta-fl", lat: 27.245, lon: -82.538, face: 250, slope: 0.066, tide: "8726034", buoy: "42098", wave: [0.8, 2.5], nws: "Clearwater Beach", near: { n: "tbw", r: "sr", i: 186, x: -82.536, y: 27.2455 } }, { name: "Sanibel, FL", region: "Southwest Florida", slug: "sanibel-fl", lat: 26.44, lon: -82.08, face: 200, slope: 0.037, tide: "TEC4207", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 374, x: -82.079, y: 26.4224 } }, { name: "Fort Myers Beach, FL", region: "Southwest Florida", slug: "fort-myers-beach-fl", lat: 26.452, lon: -81.95, face: 220, slope: 0.03, tide: "TEC4207", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 382, x: -81.95, y: 26.4503 } }, { name: "Bonita Beach, FL", region: "Southwest Florida", slug: "bonita-beach-fl", lat: 26.33, lon: -81.848, face: 260, slope: 0.052, tide: "8725283", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 414, x: -81.846, y: 26.3312 } }, { name: "Naples, FL", region: "Southwest Florida", slug: "naples-fl", lat: 26.131, lon: -81.808, face: 265, slope: 0.033, tide: "8725110", buoy: null, wave: [0.8, 2.5], nws: "Naples", near: { n: "mfl", r: "sr", i: 21, x: -81.806, y: 26.1299 } }, { name: "Marco Island, FL", region: "Southwest Florida", slug: "marco-island-fl", lat: 25.94, lon: -81.728, face: 250, slope: 0.03, tide: "8724967", buoy: null, wave: [0.8, 2.5], nws: "Naples", near: { n: "mfl", r: "sr", i: 50, x: -81.735, y: 25.9379 } }, { name: "Boca Grande, FL", region: "Southwest Florida", slug: "boca-grande-fl", lat: 26.75, lon: -82.263, face: 250, slope: 0.068, tide: "8725577", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 288, x: -82.264, y: 26.7483 } }, { name: "Captiva, FL", region: "Southwest Florida", slug: "captiva-fl", lat: 26.53, lon: -82.192, face: 260, slope: 0.052, tide: "8725383", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 336, x: -82.195, y: 26.5309 } }, { name: "Bowman's Beach (Sanibel), FL", region: "Southwest Florida", slug: "bowman-s-beach-sanibel-fl", lat: 26.462, lon: -82.158, face: 220, slope: 0.03, tide: "8725383", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 355, x: -82.159, y: 26.4606 } }, { name: "Lighthouse Beach (Sanibel), FL", region: "Southwest Florida", slug: "lighthouse-beach-sanibel-fl", lat: 26.452, lon: -82.015, face: 180, slope: 0.035, tide: "TEC4207", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach" }, { name: "Lovers Key, FL", region: "Southwest Florida", slug: "lovers-key-fl", lat: 26.39, lon: -81.872, face: 240, slope: 0.041, tide: "8725283", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 403, x: -81.875, y: 26.3855 } }, { name: "Barefoot Beach, FL", region: "Southwest Florida", slug: "barefoot-beach-fl", lat: 26.31, lon: -81.84, face: 265, slope: 0.036, tide: "8725283", buoy: null, wave: [0.8, 2.5], nws: "Naples", near: { n: "mfl", r: "sr", i: 0, x: -81.836, y: 26.3067 } }, { name: "Delnor-Wiggins Pass, FL", region: "Southwest Florida", slug: "delnor-wiggins-pass-fl", lat: 26.28, lon: -81.83, face: 265, slope: 0.045, tide: "8725283", buoy: null, wave: [0.8, 2.5], nws: "Naples", near: { n: "mfl", r: "sr", i: 2, x: -81.828, y: 26.2732 } }, { name: "Vanderbilt Beach, FL", region: "Southwest Florida", slug: "vanderbilt-beach-fl", lat: 26.255, lon: -81.825, face: 265, slope: 0.043, tide: "8725283", buoy: null, wave: [0.8, 2.5], nws: "Naples", near: { n: "mfl", r: "sr", i: 4, x: -81.824, y: 26.2574 } }, { name: "Clam Pass Beach, FL", region: "Southwest Florida", slug: "clam-pass-beach-fl", lat: 26.215, lon: -81.817, face: 265, slope: 0.051, tide: "8725110", buoy: null, wave: [0.8, 2.5], nws: "Naples", near: { n: "mfl", r: "sr", i: 9, x: -81.817, y: 26.2146 } }, { name: "Lowdermilk Park, FL", region: "Southwest Florida", slug: "lowdermilk-park-fl", lat: 26.15, lon: -81.81, face: 265, slope: 0.034, tide: "8725110", buoy: null, wave: [0.8, 2.5], nws: "Naples", near: { n: "mfl", r: "sr", i: 18, x: -81.808, y: 26.1508 } }, { name: "Tigertail Beach (Marco), FL", region: "Southwest Florida", slug: "tigertail-beach-marco-fl", lat: 25.95, lon: -81.745, face: 265, slope: 0.03, tide: "8724967", buoy: null, wave: [0.8, 2.5], nws: "Naples", near: { n: "mfl", r: "sr", i: 47, x: -81.749, y: 25.9482 } }, { name: "South Marco Beach, FL", region: "Southwest Florida", slug: "south-marco-beach-fl", lat: 25.915, lon: -81.722, face: 220, slope: 0.03, tide: "8724967", buoy: null, wave: [0.8, 2.5], nws: "Naples", near: { n: "mfl", r: "sr", i: 56, x: -81.728, y: 25.9129 } }, { name: "Seagate Beach (Naples), FL", region: "Southwest Florida", slug: "seagate-beach-naples-fl", lat: 26.19, lon: -81.815, face: 265, slope: 0.042, tide: "8725110", buoy: null, wave: [0.8, 2.5], nws: "Naples", near: { n: "mfl", r: "sr", i: 12, x: -81.816, y: 26.1933 } }, { name: "Blind Pass (Sanibel), FL", region: "Southwest Florida", slug: "blind-pass-sanibel-fl", lat: 26.482, lon: -82.183, face: 230, slope: 0.046, tide: "8725383", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 348, x: -82.182, y: 26.4814 } }, { name: "Bowditch Point, FL", region: "Southwest Florida", slug: "bowditch-point-fl", lat: 26.464, lon: -81.965, face: 220, slope: 0.03, tide: "TEC4207", buoy: null, wave: [0.8, 2.5], nws: "Fort Myers Beach", near: { n: "tbw", r: "sr", i: 377, x: -81.967, y: 26.4634 } }, { name: "Pensacola Beach, FL", region: "Panhandle", slug: "pensacola-beach-fl", lat: 30.329, lon: -87.142, face: 180, slope: 0.041, tide: "8729807", buoy: "42012", wave: [0.8, 2.5], nws: "Destin", near: { n: "mob", r: "sr", i: 58, x: -87.144, y: 30.3307 } }, { name: "Navarre Beach, FL", region: "Panhandle", slug: "navarre-beach-fl", lat: 30.377, lon: -86.862, face: 180, slope: 0.045, tide: "8729678", buoy: "42012", wave: [0.8, 2.5], nws: "Destin", near: { n: "mob", r: "sr", i: 72, x: -86.864, y: 30.3794 } }, { name: "Destin, FL", region: "Panhandle", slug: "destin-fl", lat: 30.385, lon: -86.47, face: 185, slope: 0.045, tide: "8729511", buoy: null, wave: [0.8, 2.5], nws: "Destin", near: { n: "mob", r: "sr", i: 91, x: -86.465, y: 30.3843 } }, { name: "Panama City Beach, FL", region: "Panhandle", slug: "panama-city-beach-fl", lat: 30.175, lon: -85.805, face: 205, slope: 0.03, tide: "8729210", buoy: null, wave: [0.8, 2.5], nws: "Panama City Beach", near: { n: "tae", r: "sr", i: 68, x: -85.797, y: 30.1707 } }, { name: "Perdido Key, FL", region: "Panhandle", slug: "perdido-key-fl", lat: 30.29, lon: -87.46, face: 180, slope: 0.033, tide: "8730667", buoy: "42012", wave: [0.8, 2.5], nws: "Destin", near: { n: "mob", r: "sr", i: 44, x: -87.464, y: 30.2916 } }, { name: "Johnson Beach, FL", region: "Panhandle", slug: "johnson-beach-fl", lat: 30.32, lon: -87.36, face: 180, slope: 0.041, tide: "8729887", buoy: "42012", wave: [0.8, 2.5], nws: "Destin", near: { n: "mob", r: "sr", i: 49, x: -87.367, y: 30.3109 } }, { name: "Fort Pickens, FL", region: "Panhandle", slug: "fort-pickens-fl", lat: 30.32, lon: -87.28, face: 180, slope: 0.03, tide: "8729887", buoy: "42012", wave: [0.8, 2.5], nws: "Destin", near: { n: "mob", r: "sr", i: 51, x: -87.287, y: 30.3214 } }, { name: "Opal Beach, FL", region: "Panhandle", slug: "opal-beach-fl", lat: 30.358, lon: -86.985, face: 180, slope: 0.03, tide: "8729678", buoy: "42012", wave: [0.8, 2.5], nws: "Destin", near: { n: "mob", r: "sr", i: 67, x: -86.985, y: 30.3608 } }, { name: "Okaloosa Island, FL", region: "Panhandle", slug: "okaloosa-island-fl", lat: 30.392, lon: -86.6, face: 180, slope: 0.038, tide: "8729511", buoy: null, wave: [0.8, 2.5], nws: "Destin", near: { n: "mob", r: "sr", i: 84, x: -86.606, y: 30.3956 } }, { name: "Henderson Beach, FL", region: "Panhandle", slug: "henderson-beach-fl", lat: 30.385, lon: -86.445, face: 185, slope: 0.045, tide: "8729511", buoy: null, wave: [0.8, 2.5], nws: "Destin", near: { n: "mob", r: "sr", i: 92, x: -86.442, y: 30.3846 } }, { name: "Miramar Beach, FL", region: "Panhandle", slug: "miramar-beach-fl", lat: 30.372, lon: -86.36, face: 185, slope: 0.038, tide: "8729511", buoy: null, wave: [0.8, 2.5], nws: "Destin", near: { n: "mob", r: "sr", i: 96, x: -86.361, y: 30.3746 } }, { name: "Rosemary Beach, FL", region: "Panhandle", slug: "rosemary-beach-fl", lat: 30.28, lon: -86.015, face: 195, slope: 0.052, tide: "8729210", buoy: null, wave: [0.8, 2.5], nws: "Panama City Beach", near: { n: "tae", r: "sr", i: 79, x: -86.017, y: 30.2778 } }, { name: "St. Andrews State Park, FL", region: "Panhandle", slug: "st-andrews-state-park-fl", lat: 30.128, lon: -85.738, face: 205, slope: 0.048, tide: "8729136", buoy: null, wave: [0.8, 2.5], nws: "Panama City Beach", near: { n: "tae", r: "sr", i: 64, x: -85.738, y: 30.1277 } }, { name: "Mexico Beach, FL", region: "Panhandle", slug: "mexico-beach-fl", lat: 29.94, lon: -85.415, face: 210, slope: 0.032, tide: "8728958", buoy: null, wave: [0.8, 2.5], nws: "Panama City Beach", near: { n: "tae", r: "sr", i: 56, x: -85.424, y: 29.9493 } }, { name: "Cape San Blas, FL", region: "Panhandle", slug: "cape-san-blas-fl", lat: 29.67, lon: -85.355, face: 240, slope: 0.03, tide: "8728978", buoy: null, wave: [0.8, 2.5], nws: "Panama City Beach", near: { n: "tae", r: "sr", i: 44, x: -85.341, y: 29.673 } }, { name: "Laguna Beach, FL", region: "Panhandle", slug: "laguna-beach-fl", lat: 30.24, lon: -85.925, face: 200, slope: 0.042, tide: "8729210", buoy: null, wave: [0.8, 2.5], nws: "Panama City Beach", near: { n: "tae", r: "sr", i: 74, x: -85.925, y: 30.2396 } }, { name: "Oceanside, CA", region: "San Diego", slug: "oceanside-ca", lat: 33.19, lon: -117.39, face: 260, slope: 0.038, tide: "9410230", buoy: "46224", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0905" } }, { name: "Imperial Beach, CA", region: "San Diego", slug: "imperial-beach-ca", lat: 32.579, lon: -117.135, face: 265, slope: 0.04, tide: "9410120", buoy: "46232", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0053" } }, { name: "Coronado, CA", region: "San Diego", slug: "coronado-ca", lat: 32.681, lon: -117.181, face: 240, slope: 0.038, tide: "TWC0405", buoy: "46254", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0177" } }, { name: "Ocean Beach, San Diego, CA", region: "San Diego", slug: "ocean-beach-san-diego-ca", lat: 32.75, lon: -117.254, face: 270, slope: 0.047, tide: "TWC0405", buoy: "46254", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0348" } }, { name: "Pacific Beach, CA", region: "San Diego", slug: "pacific-beach-ca", lat: 32.797, lon: -117.257, face: 265, slope: 0.034, tide: "9410230", buoy: "46254", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0406" } }, { name: "La Jolla Shores, CA", region: "San Diego", slug: "la-jolla-shores-ca", lat: 32.858, lon: -117.257, face: 290, slope: 0.03, tide: "9410230", buoy: "46254", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0504" } }, { name: "Del Mar, CA", region: "San Diego", slug: "del-mar-ca", lat: 32.959, lon: -117.269, face: 260, slope: 0.036, tide: "9410230", buoy: "46266", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0619" } }, { name: "Solana Beach, CA", region: "San Diego", slug: "solana-beach-ca", lat: 32.991, lon: -117.274, face: 260, slope: 0.034, tide: "9410230", buoy: "46266", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0655" } }, { name: "Cardiff, CA", region: "San Diego", slug: "cardiff-ca", lat: 33.015, lon: -117.282, face: 255, slope: 0.03, tide: "9410230", buoy: "46274", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0680" } }, { name: "Encinitas (Moonlight), CA", region: "San Diego", slug: "encinitas-moonlight-ca", lat: 33.047, lon: -117.297, face: 255, slope: 0.038, tide: "9410230", buoy: "46274", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0722" } }, { name: "Silver Strand, CA", region: "San Diego", slug: "silver-strand-ca", lat: 32.63, lon: -117.142, face: 255, slope: 0.033, tide: "9410120", buoy: "46254", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0109" } }, { name: "Mission Beach, CA", region: "San Diego", slug: "mission-beach-ca", lat: 32.775, lon: -117.253, face: 270, slope: 0.042, tide: "9410230", buoy: "46254", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0381" } }, { name: "Tourmaline, CA", region: "San Diego", slug: "tourmaline-ca", lat: 32.805, lon: -117.262, face: 265, slope: 0.032, tide: "9410230", buoy: "46254", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0416" } }, { name: "Windansea, CA", region: "San Diego", slug: "windansea-ca", lat: 32.83, lon: -117.282, face: 265, slope: 0.085, tide: "9410230", buoy: "46254", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0457" } }, { name: "Black's Beach, CA", region: "San Diego", slug: "black-s-beach-ca", lat: 32.89, lon: -117.253, face: 270, slope: 0.035, tide: "9410230", buoy: "46254", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0541" } }, { name: "Torrey Pines, CA", region: "San Diego", slug: "torrey-pines-ca", lat: 32.925, lon: -117.26, face: 265, slope: 0.042, tide: "9410230", buoy: "46266", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0579" } }, { name: "Swami's, CA", region: "San Diego", slug: "swami-s-ca", lat: 33.035, lon: -117.293, face: 255, slope: 0.032, tide: "9410230", buoy: "46274", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0708" } }, { name: "Beacon's, CA", region: "San Diego", slug: "beacon-s-ca", lat: 33.065, lon: -117.305, face: 255, slope: 0.038, tide: "9410230", buoy: "46274", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0744" } }, { name: "Grandview (Leucadia), CA", region: "San Diego", slug: "grandview-leucadia-ca", lat: 33.075, lon: -117.311, face: 255, slope: 0.04, tide: "9410230", buoy: "46274", wave: [1.5, 3.5], nws: "San Diego County Coastal", near: { c: "D0755" } }, { name: "Laguna Beach, CA", region: "Orange County", slug: "laguna-beach-ca", lat: 33.54, lon: -117.79, face: 245, slope: 0.064, tide: "9410580", buoy: "46253", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC272" } }, { name: "San Clemente, CA", region: "Orange County", slug: "san-clemente-ca", lat: 33.418, lon: -117.62, face: 225, slope: 0.042, tide: "TWC0419", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC040" } }, { name: "Doheny, CA", region: "Orange County", slug: "doheny-ca", lat: 33.46, lon: -117.687, face: 180, slope: 0.084, tide: "TWC0419", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC131" } }, { name: "Aliso Beach, CA", region: "Orange County", slug: "aliso-beach-ca", lat: 33.51, lon: -117.752, face: 230, slope: 0.092, tide: "9410580", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC221" } }, { name: "Victoria Beach, CA", region: "Orange County", slug: "victoria-beach-ca", lat: 33.521, lon: -117.763, face: 230, slope: 0.073, tide: "9410580", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC238" } }, { name: "Crystal Cove, CA", region: "Orange County", slug: "crystal-cove-ca", lat: 33.571, lon: -117.838, face: 225, slope: 0.042, tide: "9410580", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC331" } }, { name: "Corona del Mar, CA", region: "Orange County", slug: "corona-del-mar-ca", lat: 33.591, lon: -117.873, face: 210, slope: 0.072, tide: "9410580", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC370" } }, { name: "The Wedge (Newport), CA", region: "Orange County", slug: "the-wedge-newport-ca", lat: 33.593, lon: -117.882, face: 200, slope: 0.092, tide: "9410580", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC381" } }, { name: "Newport Beach, CA", region: "Orange County", slug: "newport-beach-ca", lat: 33.607, lon: -117.93, face: 215, slope: 0.034, tide: "9410583", buoy: "46253", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC427" } }, { name: "Huntington Beach, CA", region: "Orange County", slug: "huntington-beach-ca", lat: 33.655, lon: -118.003, face: 220, slope: 0.038, tide: "9410583", buoy: "46253", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC514" } }, { name: "Seal Beach, CA", region: "Orange County", slug: "seal-beach-ca", lat: 33.74, lon: -118.105, face: 210, slope: 0.078, tide: "9410680", buoy: "46256", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC643" } }, { name: "Trestles, CA", region: "Orange County", slug: "trestles-ca", lat: 33.385, lon: -117.59, face: 215, slope: 0.088, tide: "TWC0419", buoy: "46277", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "D1205" } }, { name: "T-Street, CA", region: "Orange County", slug: "t-street-ca", lat: 33.415, lon: -117.616, face: 225, slope: 0.041, tide: "TWC0419", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC036" } }, { name: "Poche Beach, CA", region: "Orange County", slug: "poche-beach-ca", lat: 33.44, lon: -117.642, face: 220, slope: 0.065, tide: "TWC0419", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC071" } }, { name: "Capistrano Beach, CA", region: "Orange County", slug: "capistrano-beach-ca", lat: 33.455, lon: -117.668, face: 200, slope: 0.05, tide: "TWC0419", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC099" } }, { name: "Strands Beach, CA", region: "Orange County", slug: "strands-beach-ca", lat: 33.47, lon: -117.712, face: 230, slope: 0.038, tide: "TWC0419", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC163" } }, { name: "Salt Creek, CA", region: "Orange County", slug: "salt-creek-ca", lat: 33.478, lon: -117.722, face: 235, slope: 0.038, tide: "TWC0419", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC175" } }, { name: "Thousand Steps, CA", region: "Orange County", slug: "thousand-steps-ca", lat: 33.495, lon: -117.742, face: 230, slope: 0.065, tide: "TWC0419", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC202" } }, { name: "Brooks Street, CA", region: "Orange County", slug: "brooks-street-ca", lat: 33.534, lon: -117.778, face: 240, slope: 0.072, tide: "9410580", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC257" } }, { name: "Thalia Street, CA", region: "Orange County", slug: "thalia-street-ca", lat: 33.537, lon: -117.781, face: 240, slope: 0.065, tide: "9410580", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC262" } }, { name: "Crescent Bay (Laguna), CA", region: "Orange County", slug: "crescent-bay-laguna-ca", lat: 33.546, lon: -117.802, face: 250, slope: 0.061, tide: "9410580", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC284" } }, { name: "Little Corona, CA", region: "Orange County", slug: "little-corona-ca", lat: 33.589, lon: -117.868, face: 210, slope: 0.069, tide: "9410580", buoy: "46285", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC365" } }, { name: "Balboa Pier, CA", region: "Orange County", slug: "balboa-pier-ca", lat: 33.6, lon: -117.9, face: 200, slope: 0.105, tide: "9410583", buoy: "46253", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC399" } }, { name: "56th Street (Newport), CA", region: "Orange County", slug: "56th-street-newport-ca", lat: 33.628, lon: -117.955, face: 220, slope: 0.044, tide: "9410583", buoy: "46253", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC465" } }, { name: "Huntington State Beach, CA", region: "Orange County", slug: "huntington-state-beach-ca", lat: 33.643, lon: -117.98, face: 215, slope: 0.051, tide: "9410583", buoy: "46253", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC487" } }, { name: "Huntington Dog Beach, CA", region: "Orange County", slug: "huntington-dog-beach-ca", lat: 33.672, lon: -118.016, face: 225, slope: 0.042, tide: "9410583", buoy: "46256", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC538" } }, { name: "Bolsa Chica, CA", region: "Orange County", slug: "bolsa-chica-ca", lat: 33.7, lon: -118.048, face: 225, slope: 0.062, tide: "9410680", buoy: "46256", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC581" } }, { name: "Sunset Beach, CA", region: "Orange County", slug: "sunset-beach-ca", lat: 33.72, lon: -118.073, face: 225, slope: 0.074, tide: "9410680", buoy: "46256", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "OC611" } }, { name: "San Onofre, CA", region: "Orange County", slug: "san-onofre-ca", lat: 33.375, lon: -117.567, face: 215, slope: 0.076, tide: "TWC0419", buoy: "46277", wave: [1.5, 3.5], nws: "Orange County Coastal", near: { c: "D1178" } }, { name: "Redondo Beach, CA", region: "Los Angeles", slug: "redondo-beach-ca", lat: 33.842, lon: -118.392, face: 255, slope: 0.108, tide: "9410738", buoy: "46221", wave: [1.5, 3.5], nws: "Los Angeles County Beaches", near: { c: "L0500" } }, { name: "Hermosa Beach, CA", region: "Los Angeles", slug: "hermosa-beach-ca", lat: 33.862, lon: -118.402, face: 265, slope: 0.055, tide: "9410738", buoy: "46221", wave: [1.5, 3.5], nws: "Los Angeles County Beaches", near: { c: "L0528" } }, { name: "Manhattan Beach, CA", region: "Los Angeles", slug: "manhattan-beach-ca", lat: 33.885, lon: -118.413, face: 265, slope: 0.046, tide: "9410777", buoy: "46221", wave: [1.5, 3.5], nws: "Los Angeles County Beaches", near: { c: "L0556" } }, { name: "Venice Beach, CA", region: "Los Angeles", slug: "venice-beach-ca", lat: 33.985, lon: -118.475, face: 240, slope: 0.045, tide: "9410840", buoy: "46268", wave: [1.5, 3.5], nws: "Los Angeles County Beaches", near: { c: "L0683" } }, { name: "Santa Monica, CA", region: "Los Angeles", slug: "santa-monica-ca", lat: 34.008, lon: -118.497, face: 225, slope: 0.043, tide: "9410840", buoy: "46268", wave: [1.5, 3.5], nws: "Los Angeles County Beaches", near: { c: "L0715" } }, { name: "Malibu (Surfrider), CA", region: "Los Angeles", slug: "malibu-surfrider-ca", lat: 34.035, lon: -118.678, face: 180, slope: 0.072, tide: "9410840", buoy: "46268", wave: [1.5, 3.5], nws: "Malibu Coast", near: { c: "L0903" } }, { name: "Torrance Beach, CA", region: "Los Angeles", slug: "torrance-beach-ca", lat: 33.81, lon: -118.393, face: 250, slope: 0.085, tide: "9410738", buoy: "46256", wave: [1.5, 3.5], nws: "Los Angeles County Beaches", near: { c: "L0465" } }, { name: "El Porto, CA", region: "Los Angeles", slug: "el-porto-ca", lat: 33.9, lon: -118.421, face: 260, slope: 0.043, tide: "9410777", buoy: "46268", wave: [1.5, 3.5], nws: "Los Angeles County Beaches", near: { c: "L0574" } }, { name: "Dockweiler, CA", region: "Los Angeles", slug: "dockweiler-ca", lat: 33.93, lon: -118.438, face: 255, slope: 0.064, tide: "9410777", buoy: "46268", wave: [1.5, 3.5], nws: "Los Angeles County Beaches", near: { c: "L0611" } }, { name: "Playa del Rey, CA", region: "Los Angeles", slug: "playa-del-rey-ca", lat: 33.955, lon: -118.447, face: 250, slope: 0.08, tide: "9410777", buoy: "46268", wave: [1.5, 3.5], nws: "Los Angeles County Beaches", near: { c: "L0639" } }, { name: "Will Rogers Beach, CA", region: "Los Angeles", slug: "will-rogers-beach-ca", lat: 34.033, lon: -118.535, face: 200, slope: 0.07, tide: "9410840", buoy: "46268", wave: [1.5, 3.5], nws: "Los Angeles County Beaches", near: { c: "L0759" } }, { name: "Topanga Beach, CA", region: "Los Angeles", slug: "topanga-beach-ca", lat: 34.039, lon: -118.582, face: 190, slope: 0.078, tide: "9410840", buoy: "46268", wave: [1.5, 3.5], nws: "Malibu Coast", near: { c: "L0808" } }, { name: "Leo Carrillo, CA", region: "Los Angeles", slug: "leo-carrillo-ca", lat: 34.043, lon: -118.935, face: 210, slope: 0.068, tide: "TWC0445", buoy: "46268", wave: [1.5, 3.5], nws: "Malibu Coast", near: { c: "L1177" } }, { name: "Ventura, CA", region: "Central Coast", slug: "ventura-ca", lat: 34.275, lon: -119.293, face: 215, slope: 0.071, tide: "9411189", buoy: "46053", wave: [1.5, 3.5], nws: "Ventura County Beaches", near: { c: "VE461" } }, { name: "Santa Barbara (East Beach), CA", region: "Central Coast", slug: "santa-barbara-east-beach-ca", lat: 34.416, lon: -119.676, face: 160, slope: 0.078, tide: "9411340", buoy: "46053", wave: [1.5, 3.5], nws: "Santa Barbara County Southeastern Coast", near: { c: "B0205" } }, { name: "Pismo Beach, CA", region: "Central Coast", slug: "pismo-beach-ca", lat: 35.14, lon: -120.645, face: 250, slope: 0.03, tide: "9412110", buoy: "46286", wave: [1.5, 3.5], nws: "San Luis Obispo County Beaches", near: { c: "SL093" } }, { name: "Avila Beach, CA", region: "Central Coast", slug: "avila-beach-ca", lat: 35.179, lon: -120.733, face: 180, slope: 0.04, tide: "9412110", buoy: "46286", wave: [1.5, 3.5], nws: "San Luis Obispo County Beaches", near: { c: "SL144" } }, { name: "Silver Strand (Oxnard), CA", region: "Central Coast", slug: "silver-strand-oxnard-ca", lat: 34.16, lon: -119.224, face: 220, slope: 0.078, tide: "9411065", buoy: "46025", wave: [1.5, 3.5], nws: "Ventura County Beaches", near: { c: "VE307" } }, { name: "Hollywood Beach (Oxnard), CA", region: "Central Coast", slug: "hollywood-beach-oxnard-ca", lat: 34.17, lon: -119.234, face: 230, slope: 0.071, tide: "9411065", buoy: "46025", wave: [1.5, 3.5], nws: "Ventura County Beaches", near: { c: "VE322" } }, { name: "Oxnard Shores, CA", region: "Central Coast", slug: "oxnard-shores-ca", lat: 34.195, lon: -119.247, face: 240, slope: 0.073, tide: "9411065", buoy: "46025", wave: [1.5, 3.5], nws: "Ventura County Beaches", near: { c: "VE352" } }, { name: "Emma Wood, CA", region: "Central Coast", slug: "emma-wood-ca", lat: 34.29, lon: -119.335, face: 210, slope: 0.062, tide: "9411189", buoy: "46053", wave: [1.5, 3.5], nws: "Ventura County Beaches", near: { c: "VE500" } }, { name: "Rincon, CA", region: "Central Coast", slug: "rincon-ca", lat: 34.373, lon: -119.477, face: 200, slope: 0.065, tide: "9411270", buoy: "46053", wave: [1.5, 3.5], nws: "Santa Barbara County Southeastern Coast", near: { c: "VE678" } }, { name: "Carpinteria, CA", region: "Central Coast", slug: "carpinteria-ca", lat: 34.393, lon: -119.52, face: 200, slope: 0.04, tide: "9411270", buoy: "46053", wave: [1.5, 3.5], nws: "Santa Barbara County Southeastern Coast", near: { c: "B0047" } }, { name: "Leadbetter Beach, CA", region: "Central Coast", slug: "leadbetter-beach-ca", lat: 34.402, lon: -119.7, face: 180, slope: 0.065, tide: "9411340", buoy: "46053", wave: [1.5, 3.5], nws: "Santa Barbara County Southeastern Coast", near: { c: "B0230" } }, { name: "Hendry's Beach, CA", region: "Central Coast", slug: "hendry-s-beach-ca", lat: 34.403, lon: -119.743, face: 190, slope: 0.035, tide: "9411340", buoy: "46053", wave: [1.5, 3.5], nws: "Santa Barbara County Southeastern Coast", near: { c: "B0278" } }, { name: "Goleta Beach, CA", region: "Central Coast", slug: "goleta-beach-ca", lat: 34.416, lon: -119.83, face: 180, slope: 0.072, tide: "9411340", buoy: "46053", wave: [1.5, 3.5], nws: "Santa Barbara County Southeastern Coast", near: { c: "B0363" } }, { name: "Refugio, CA", region: "Central Coast", slug: "refugio-ca", lat: 34.462, lon: -120.07, face: 190, slope: 0.052, tide: "9411399", buoy: "46053", wave: [1.5, 3.5], nws: "Santa Barbara County Southwestern Coast", near: { c: "B0616" } }, { name: "Oceano Dunes, CA", region: "Central Coast", slug: "oceano-dunes-ca", lat: 35.095, lon: -120.63, face: 260, slope: 0.03, tide: "9412110", buoy: "46286", wave: [1.5, 3.5], nws: "San Luis Obispo County Beaches", near: { c: "SL068" } }, { name: "Grover Beach, CA", region: "Central Coast", slug: "grover-beach-ca", lat: 35.12, lon: -120.637, face: 255, slope: 0.03, tide: "9412110", buoy: "46286", wave: [1.5, 3.5], nws: "San Luis Obispo County Beaches", near: { c: "SL082" } }, { name: "Shell Beach, CA", region: "Central Coast", slug: "shell-beach-ca", lat: 35.155, lon: -120.672, face: 230, slope: 0.089, tide: "9412110", buoy: "46286", wave: [1.5, 3.5], nws: "San Luis Obispo County Beaches", near: { c: "SL110" } }, { name: "Point Mugu Beach, CA", region: "Central Coast", slug: "point-mugu-beach-ca", lat: 34.085, lon: -119.06, face: 200, slope: 0.092, tide: "TWC0445", buoy: "46025", wave: [1.5, 3.5], nws: "Ventura County Beaches", near: { c: "VE120" } }, { name: "Mandalay Beach, CA", region: "Central Coast", slug: "mandalay-beach-ca", lat: 34.21, lon: -119.255, face: 250, slope: 0.068, tide: "9411189", buoy: "46025", wave: [1.5, 3.5], nws: "Ventura County Beaches", near: { c: "VE370" } }, { name: "Pierpont (Ventura), CA", region: "Central Coast", slug: "pierpont-ventura-ca", lat: 34.263, lon: -119.272, face: 215, slope: 0.058, tide: "9411189", buoy: "46053", wave: [1.5, 3.5], nws: "Ventura County Beaches", near: { c: "VE432" } }, { name: "Ocean Beach, SF, CA", region: "NorCal", slug: "ocean-beach-sf-ca", lat: 37.76, lon: -122.51, face: 270, slope: 0.03, tide: "9414290", buoy: "46237", wave: [1.5, 3.5], nws: "San Francisco and San Mateo", near: { c: "SF029" } }, { name: "Santa Cruz (Main Beach), CA", region: "NorCal", slug: "santa-cruz-main-beach-ca", lat: 36.963, lon: -122.02, face: 180, slope: 0.053, tide: "9413745", buoy: "46236", wave: [1.5, 3.5], nws: "Santa Cruz County Coastal", near: { c: "SC149" } }, { name: "Capitola, CA", region: "NorCal", slug: "capitola-ca", lat: 36.972, lon: -121.952, face: 180, slope: 0.068, tide: "9413745", buoy: "46236", wave: [1.5, 3.5], nws: "Santa Cruz County Coastal", near: { c: "SC111" } }, { name: "Monterey (Del Monte), CA", region: "NorCal", slug: "monterey-del-monte-ca", lat: 36.602, lon: -121.88, face: 10, slope: 0.038, tide: "9413450", buoy: "46236", wave: [1.5, 3.5], nws: "Monterey Bay", near: { c: "MO768" } }, { name: "Carmel, CA", region: "NorCal", slug: "carmel-ca", lat: 36.553, lon: -121.928, face: 260, slope: 0.05, tide: "9413375", buoy: "46236", wave: [1.5, 3.5], nws: "Monterey Bay", near: { c: "MO645" } }, { name: "Pacifica, CA", region: "NorCal", slug: "pacifica-ca", lat: 37.595, lon: -122.502, face: 265, slope: 0.039, tide: "9414131", buoy: "46237", wave: [1.5, 3.5], nws: "San Francisco and San Mateo", near: { c: "SM376" } }, { name: "Stinson Beach, CA", region: "NorCal", slug: "stinson-beach-ca", lat: 37.9, lon: -122.645, face: 200, slope: 0.043, tide: "9414906", buoy: "46237", wave: [1.5, 3.5], nws: "Marin", near: { c: "MA123" } }, { name: "Pleasure Point, CA", region: "NorCal", slug: "pleasure-point-ca", lat: 36.955, lon: -121.97, face: 170, slope: 0.072, tide: "9413745", buoy: "46236", wave: [1.5, 3.5], nws: "Santa Cruz County Coastal", near: { c: "SC116" } }, { name: "Seabright, CA", region: "NorCal", slug: "seabright-ca", lat: 36.964, lon: -122.005, face: 180, slope: 0.058, tide: "9413745", buoy: "46236", wave: [1.5, 3.5], nws: "Santa Cruz County Coastal", near: { c: "SC131" } }, { name: "Seacliff, CA", region: "NorCal", slug: "seacliff-ca", lat: 36.97, lon: -121.915, face: 200, slope: 0.082, tide: "9413745", buoy: "46236", wave: [1.5, 3.5], nws: "Santa Cruz County Coastal", near: { c: "SC082" } }, { name: "Rio Del Mar, CA", region: "NorCal", slug: "rio-del-mar-ca", lat: 36.965, lon: -121.902, face: 205, slope: 0.068, tide: "9413745", buoy: "46236", wave: [1.5, 3.5], nws: "Santa Cruz County Coastal", near: { c: "SC074" } }, { name: "Manresa, CA", region: "NorCal", slug: "manresa-ca", lat: 36.932, lon: -121.862, face: 230, slope: 0.063, tide: "9413745", buoy: "46236", wave: [1.5, 3.5], nws: "Santa Cruz County Coastal", near: { c: "SC052" } }, { name: "Sunset State Beach, CA", region: "NorCal", slug: "sunset-state-beach-ca", lat: 36.89, lon: -121.835, face: 240, slope: 0.059, tide: "9413616", buoy: "46236", wave: [1.5, 3.5], nws: "Santa Cruz County Coastal", near: { c: "SC024" } }, { name: "Moss Landing, CA", region: "NorCal", slug: "moss-landing-ca", lat: 36.81, lon: -121.79, face: 270, slope: 0.055, tide: "9413616", buoy: "46236", wave: [1.5, 3.5], nws: "Monterey Bay", near: { c: "MO895" } }, { name: "Marina State Beach, CA", region: "NorCal", slug: "marina-state-beach-ca", lat: 36.698, lon: -121.81, face: 270, slope: 0.087, tide: "9413616", buoy: "46236", wave: [1.5, 3.5], nws: "Monterey Bay", near: { c: "MO833" } }, { name: "Asilomar, CA", region: "NorCal", slug: "asilomar-ca", lat: 36.62, lon: -121.94, face: 270, slope: 0.032, tide: "9413450", buoy: "46236", wave: [1.5, 3.5], nws: "Monterey Bay", near: { c: "MO720" } }, { name: "Half Moon Bay, CA", region: "NorCal", slug: "half-moon-bay-ca", lat: 37.47, lon: -122.448, face: 260, slope: 0.111, tide: "9414131", buoy: "46237", wave: [1.5, 3.5], nws: "San Francisco and San Mateo", near: { c: "SM267" } }, { name: "Montara, CA", region: "NorCal", slug: "montara-ca", lat: 37.545, lon: -122.515, face: 270, slope: 0.089, tide: "9414131", buoy: "46237", wave: [1.5, 3.5], nws: "San Francisco and San Mateo", near: { c: "SM337" } }, { name: "Fort Funston, CA", region: "NorCal", slug: "fort-funston-ca", lat: 37.715, lon: -122.505, face: 270, slope: 0.041, tide: "9414290", buoy: "46237", wave: [1.5, 3.5], nws: "San Francisco and San Mateo", near: { c: "SF004" } }, { name: "Baker Beach, CA", region: "NorCal", slug: "baker-beach-ca", lat: 37.795, lon: -122.484, face: 290, slope: 0.06, tide: "9414290", buoy: "46237", wave: [1.5, 3.5], nws: "San Francisco and San Mateo", near: { c: "SF061" } }, { name: "Muir Beach, CA", region: "NorCal", slug: "muir-beach-ca", lat: 37.86, lon: -122.576, face: 200, slope: 0.056, tide: "9414906", buoy: "46237", wave: [1.5, 3.5], nws: "Marin", near: { c: "MA082" } }, { name: "Bolinas, CA", region: "NorCal", slug: "bolinas-ca", lat: 37.905, lon: -122.688, face: 170, slope: 0.061, tide: "9414906", buoy: "46237", wave: [1.5, 3.5], nws: "Marin", near: { c: "MA138" } }, { name: "Carmel River Beach, CA", region: "NorCal", slug: "carmel-river-beach-ca", lat: 36.536, lon: -121.93, face: 250, slope: 0.088, tide: "9413375", buoy: "46236", wave: [1.5, 3.5], nws: "Monterey Bay", near: { c: "MO632" } }, { name: "Ocean Beach South (Sloat), CA", region: "NorCal", slug: "ocean-beach-south-sloat-ca", lat: 37.735, lon: -122.507, face: 270, slope: 0.038, tide: "9414290", buoy: "46237", wave: [1.5, 3.5], nws: "San Francisco and San Mateo", near: { c: "SF015" } }, { name: "Rockaway Beach (Pacifica), CA", region: "NorCal", slug: "rockaway-beach-pacifica-ca", lat: 37.61, lon: -122.496, face: 270, slope: 0.095, tide: "9414131", buoy: "46237", wave: [1.5, 3.5], nws: "San Francisco and San Mateo", near: { c: "SM387" } }, { name: "Tybee Island, GA", region: "Georgia & Carolinas", slug: "tybee-island-ga", lat: 32, lon: -80.84, face: 110, slope: 0.03, tide: "8670892", buoy: "41067", wave: [1, 3], nws: "Tybee Island", near: { n: "chs", r: "er", i: 24, x: -80.843, y: 32.0014 } }, { name: "Folly Beach, SC", region: "Georgia & Carolinas", slug: "folly-beach-sc", lat: 32.65, lon: -79.94, face: 150, slope: 0.038, tide: "TEC3127", buoy: "41076", wave: [1, 3], nws: "Folly Beach", near: { n: "chs", r: "er", i: 48, x: -79.94, y: 32.6547 } }, { name: "Myrtle Beach, SC", region: "Georgia & Carolinas", slug: "myrtle-beach-sc", lat: 33.69, lon: -78.89, face: 125, slope: 0.048, tide: "8661070", buoy: "41013", wave: [1, 3], nws: "Myrtle Beach", near: { n: "ilm", r: "er", i: 31, x: -78.894, y: 33.6781 } }, { name: "Wrightsville Beach, NC", region: "Georgia & Carolinas", slug: "wrightsville-beach-nc", lat: 34.21, lon: -77.8, face: 165, slope: 0.042, tide: "8658163", buoy: "41110", wave: [1, 3], nws: "Wrightsville Beach", near: { n: "ilm", r: "er", i: 82, x: -77.797, y: 34.2041 } }, { name: "Rodanthe, NC", region: "Georgia & Carolinas", slug: "rodanthe-nc", lat: 35.59, lon: -75.46, face: 80, slope: 0.058, tide: "8652678", buoy: "44095", wave: [1, 3], nws: "Rodanthe", near: { n: "mhx", r: "er", i: 367, x: -75.463, y: 35.591 } }, { name: "Nags Head, NC", region: "Georgia & Carolinas", slug: "nags-head-nc", lat: 35.96, lon: -75.62, face: 80, slope: 0.063, tide: "8651370", buoy: "44086", wave: [1, 3], nws: "Nags Head", near: { n: "mhx", r: "er", i: 419, x: -75.623, y: 35.9571 } }, { name: "Virginia Beach, VA", region: "Mid-Atlantic & Northeast", slug: "virginia-beach-va", lat: 36.85, lon: -75.98, face: 60, slope: 0.06, tide: "8638863", buoy: "44099", wave: [1, 3], nws: "Virginia Beach" }, { name: "Ocean City, MD", region: "Mid-Atlantic & Northeast", slug: "ocean-city-md", lat: 38.33, lon: -75.08, face: 90, slope: 0.032, tide: "8570283", buoy: "44084", wave: [1, 3], nws: "Ocean City Beaches", near: { n: "akq", r: "er", i: 246, x: -75.084, y: 38.332 } }, { name: "Dewey Beach, DE", region: "Mid-Atlantic & Northeast", slug: "dewey-beach-de", lat: 38.69, lon: -75.07, face: 90, slope: 0.031, tide: "8557380", buoy: "44084", wave: [1, 3], nws: "Rehoboth Beach", near: { n: "phi", r: "er", i: 14, x: -75.074, y: 38.7039 } }, { name: "Ocean City, NJ", region: "Mid-Atlantic & Northeast", slug: "ocean-city-nj", lat: 39.26, lon: -74.58, face: 120, slope: 0.03, tide: "8534770", buoy: "44091", wave: [1, 3], nws: "Ocean City", near: { n: "phi", r: "er", i: 49, x: -74.595, y: 39.2617 } }, { name: "Long Beach, NY", region: "Mid-Atlantic & Northeast", slug: "long-beach-ny", lat: 40.58, lon: -73.66, face: 180, slope: 0.03, tide: "8516881", buoy: "44065", wave: [1, 3], nws: "Long Beach", near: { n: "okx", r: "er", i: 40, x: -73.661, y: 40.5835 } }, { name: "Galveston, TX", region: "Texas", slug: "galveston-tx", lat: 29.3, lon: -94.79, face: 150, slope: 0.03, tide: "8771450", buoy: "42035", wave: [1, 3], nws: null, near: { n: "hgx", r: "sr", i: 83, x: -94.79, y: 29.2883 } }];

// lib/regions.json
var regions_default = ["Treasure Coast", "Palm Beach", "Broward", "Miami", "Keys", "Space Coast", "Volusia", "First Coast", "Tampa Bay", "Sarasota", "Southwest Florida", "Panhandle", "San Diego", "Orange County", "Los Angeles", "Central Coast", "NorCal", "Georgia & Carolinas", "Mid-Atlantic & Northeast", "Texas"];

// lib/seo.js
var SITE = "https://skimcastapp.com";
var esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
var slugify = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
var ld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}<\/script>`;
var STATES = {
  FL: "Florida",
  CA: "California",
  GA: "Georgia",
  SC: "South Carolina",
  NC: "North Carolina",
  VA: "Virginia",
  MD: "Maryland",
  DE: "Delaware",
  NJ: "New Jersey",
  NY: "New York",
  TX: "Texas"
};
var shortName = (sp) => sp.name.replace(/,\s*[A-Z]{2}$/, "");
var stateOf = (sp) => STATES[(sp.name.match(/,\s*([A-Z]{2})$/) || [])[1]] || "";
var regionSlug = (r) => `${slugify(r)}-skimboarding`;
var REGION_BY_SLUG = Object.fromEntries(regions_default.map((r) => [regionSlug(r), r]));
var inRegion = (r) => spots_default.filter((s) => s.region === r);
var miles = (a, b) => {
  const R = 3958.8, toR = (d) => d * Math.PI / 180, dLat = toR(b.lat - a.lat), dLon = toR(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
var nearby = (sp, n = 6) => spots_default.filter((s) => s.slug !== sp.slug).map((s) => ({ s, d: miles(sp, s) })).sort((a, b) => a.d - b.d).slice(0, n);
var facing = (deg) => ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"][Math.round((deg % 360 + 360) % 360 / 45) % 8];
var slopeWord = (sl) => sl < 0.045 ? "gentle, wide" : sl < 0.065 ? "medium" : sl < 0.085 ? "steep" : "very steep";
var bestTide = (sl) => sl >= 0.075 ? "around mid tide" : sl >= 0.055 ? "from low to mid tide, as it comes in" : "near low tide";
var ft = (w) => `${w[0]} to ${w[1]} ft`;
var stateWord = (sp) => stateOf(sp) ? `, ${stateOf(sp)}` : "";
function beachMeta(sp) {
  const n = shortName(sp), st = (sp.name.match(/,\s*([A-Z]{2})$/) || [])[1];
  let title = `${n}${st ? ", " + st : ""} Skimboarding Forecast Today | SkimCast`;
  if (title.length > 62) title = `${n}${st ? ", " + st : ""} Skimboarding Forecast | SkimCast`;
  return {
    title,
    desc: [
      `Is it a W Skim day at ${n}? Live skim score, shorebreak size, tide times and wind for skimboarding at ${sp.name}, updated through the day. Free.`,
      `Live skim score, shorebreak size, tide and wind for skimboarding at ${sp.name}. Find today's W Skim, free.`,
      `Skimboarding forecast for ${sp.name}: live skim score, shorebreak, tide and wind.`
    ].find((x) => x.length <= 160) || `Skimboarding forecast for ${n}.`
  };
}
function beachFaq(sp) {
  const n = shortName(sp);
  return [
    [
      `When is the best time to skimboard at ${n}?`,
      `${n} has a ${slopeWord(sp.slope)} beach, so wave riding is usually best ${bestTide(sp.slope)} with light or offshore wind. Flatland skimming is best near low tide, when the sand stays wet and the shorebreak is small. The hour-by-hour forecast on this page shows the best window for today and the next 5 days.`
    ],
    [
      `Is ${n} good for skimboarding today?`,
      `Check the skim score at the top of this page. 8 or higher is a W Skim, 6.5 or higher is good, 4.5 or higher is fair, and anything lower is a day to skip. It updates through the day from NOAA tides, NOAA buoys, the National Weather Service and marine forecast models.`
    ],
    [
      `What size waves are best for skimboarding at ${n}?`,
      `For wave riding, SkimCast looks for about ${ft(sp.wave)} of shorebreak breaking close to the sand at ${n}. Smaller days are better for flatland, and bigger days tend to close out hard on the beach.`
    ]
  ];
}
function beachContent(sp) {
  const n = shortName(sp), near2 = nearby(sp, 6);
  const sources = [
    sp.tide ? `NOAA tide predictions from station ${esc(sp.tide)}` : "",
    sp.buoy ? `live wave readings from NOAA buoy ${esc(sp.buoy)}` : "",
    sp.nws ? `the National Weather Service surf zone forecast for ${esc(sp.nws)}` : "",
    "Open-Meteo wave and wind models"
  ].filter(Boolean);
  const list = sources.length > 1 ? sources.slice(0, -1).join(", ") + " and " + sources.at(-1) : sources[0];
  const faq = beachFaq(sp).map(([q, a]) => `<h3 class="seo-q">${esc(q)}</h3><p class="note">${esc(a)}</p>`).join("");
  return `<div class="seo-more" id="seoMore" data-slug="${esc(sp.slug)}">
<h2 class="h">Skimboarding at ${esc(n)}</h2>
<p class="note">${esc(n)} is a ${facing(sp.face)}-facing beach in the ${esc(sp.region)} area${esc(stateWord(sp))}, with a ${slopeWord(sp.slope)} shoreline. For wave riding, SkimCast looks for about ${ft(sp.wave)} of shorebreak breaking close to the sand, light or offshore wind, and the tide ${bestTide(sp.slope)}. For flatland, the best sessions come near low tide on small days.</p>
<p class="note">The forecast for ${esc(n)} combines ${list}. The skim score updates through the day, so check it before you go.</p>
${faq}
<h3 class="seo-q">Skimboarding beaches near ${esc(n)}</h3>
<ul class="seo-near">${near2.map(({ s, d }) => `<li><a href="/${s.slug}">${esc(s.name)}</a> <span>${d < 1 ? "under 1" : Math.round(d)} mi</span></li>`).join("")}</ul>
<p class="note"><a href="/${regionSlug(sp.region)}">All ${esc(sp.region)} skimboarding beaches \u2192</a></p>
</div>`;
}
function beachLd(sp, url) {
  const { title, desc } = beachMeta(sp), n = shortName(sp);
  return ld({ "@context": "https://schema.org", "@graph": [
    {
      "@type": "WebPage",
      "@id": url,
      name: title,
      url,
      description: desc,
      isPartOf: { "@type": "WebSite", name: "SkimCast", url: SITE + "/" },
      about: {
        "@type": "Beach",
        name: sp.name,
        geo: { "@type": "GeoCoordinates", latitude: sp.lat, longitude: sp.lon },
        address: { "@type": "PostalAddress", addressRegion: stateOf(sp) || void 0, addressCountry: "US" }
      }
    },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "SkimCast", item: SITE + "/" },
      { "@type": "ListItem", position: 2, name: `${sp.region} skimboarding`, item: `${SITE}/${regionSlug(sp.region)}` },
      { "@type": "ListItem", position: 3, name: `${n} skimboarding forecast`, item: url }
    ] },
    { "@type": "FAQPage", mainEntity: beachFaq(sp).map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }
  ] });
}
function homeContent() {
  const groups = regions_default.map((r) => ({ r, n: inRegion(r).length })).filter((g) => g.n);
  return `<div class="seo-more" id="seoHome">
<h2 class="h">Skimboarding forecasts by area</h2>
<ul class="seo-near seo-regions">${groups.map((g) => `<li><a href="/${regionSlug(g.r)}">${esc(g.r)}</a> <span>${g.n} beaches</span></li>`).join("")}</ul>
<p class="note"><a href="/skimboarding-conditions">How to read skimboarding conditions: tide, waves and wind \u2192</a></p>
</div>`;
}
var homeLd = () => ld({ "@context": "https://schema.org", "@graph": [
  { "@type": "WebSite", name: "SkimCast", url: SITE + "/", description: "Free skimboarding forecast for 300 beaches in Florida and California." },
  { "@type": "Organization", name: "SkimCast", url: SITE + "/", logo: SITE + "/icon-512.png", sameAs: ["https://www.instagram.com/skim_cast/"] }
] });
var PAGE_CSS = `:root{--bg:#1D1C1A;--panel:#262422;--line:#3A3733;--fg:#F2EFE8;--mute:#A8A296;--coral:#D2425A;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 'Archivo',system-ui,-apple-system,'Segoe UI',sans-serif;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.wrap{max-width:780px;margin:0 auto;padding-block:28px 56px}a{color:var(--fg);text-decoration-color:var(--coral);text-underline-offset:3px}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:28px}.brand{font:400 1.6rem/1 'Anton',Impact,sans-serif;letter-spacing:.04em;text-decoration:none}.brand i{display:block;height:4px;background:var(--coral);border-radius:4px;margin-top:5px}
.cta{background:var(--coral);color:#fff;text-decoration:none;font-weight:700;padding:10px 14px;border-radius:10px;white-space:nowrap}
h1{font:400 clamp(2.2rem,7vw,3.4rem)/1.02 'Anton',Impact,sans-serif;text-transform:uppercase;margin:0 0 12px;text-wrap:balance}
h2{font:400 1.4rem/1.15 'Anton',Impact,sans-serif;letter-spacing:.04em;text-transform:uppercase;margin:32px 0 10px}h3{font-size:1.05rem;margin:22px 0 6px}
p,li{color:#DCD7CC;max-width:68ch}.mute{color:var(--mute)}.crumbs{color:var(--mute);font-size:.9rem;margin-bottom:10px}
.beaches{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}
.beaches li{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px 12px;max-width:none}.beaches a{font-weight:600}.beaches span{display:block;color:var(--mute);font-size:.85rem}
footer{border-top:1px solid var(--line);margin-top:40px;padding-top:14px;color:var(--mute);font-size:.85rem}`;
var FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@400;600;700&display=swap" rel="stylesheet">`;
function shell({ title, desc, url, body, extraLd = "" }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${url}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${SITE}/og-image.png">
<meta name="theme-color" content="#1D1C1A"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
${FONTS}<style>${PAGE_CSS}</style>${extraLd}</head><body><div class="wrap">
<div class="top"><a class="brand" href="/">SKIMCAST<i></i></a><a class="cta" href="/">Open the live forecast</a></div>
${body}
<footer>SkimCast is a free skimboarding forecast for ${spots_default.length} beaches. Forecasts are estimates and can be wrong. Check local conditions and lifeguard flags before you go in the water. <a href="/sponsor">Sponsor SkimCast</a></footer>
</div></body></html>`;
}
function regionPage(r) {
  const url = `${SITE}/${regionSlug(r)}`, beaches = inRegion(r);
  const states = [...new Set(beaches.map(stateOf).filter(Boolean))].join(" and ");
  const title = `${r} Skimboarding Forecast: ${beaches.length} Beaches | SkimCast`;
  const desc = [
    `Skimboarding conditions for ${beaches.length} beaches in ${r}${states ? ", " + states : ""}: live skim scores, shorebreak size, tide and wind. Find today's W Skim.`,
    `Skimboarding conditions for ${beaches.length} beaches in ${r}: live skim scores, shorebreak size, tide and wind. Find today's W Skim.`
  ].find((x) => x.length <= 160) || `Skimboarding forecast for ${beaches.length} beaches in ${r}.`;
  const steep = beaches.filter((s) => s.slope >= 0.065).map(shortName), gentle = beaches.filter((s) => s.slope < 0.045).map(shortName);
  const others = regions_default.filter((x) => x !== r && inRegion(x).length);
  const body = `<div class="crumbs"><a href="/">SkimCast</a> \u203A ${esc(r)}</div>
<h1>${esc(r)} skimboarding forecast</h1>
<p>Live skimboarding conditions for ${beaches.length} beaches in ${esc(r)}${states ? ", " + esc(states) : ""}. Each beach gets a skim score from 0 to 10, built from shorebreak size, how close the waves break to the sand, wind, tide and swell quality. 8 or higher is a W Skim.</p>
${steep.length ? `<p>Steeper beaches here, like ${esc(steep.slice(0, 4).join(", "))}, usually skim best around mid tide, when waves break right on the sand.${gentle.length ? ` Flatter, wider beaches, like ${esc(gentle.slice(0, 4).join(", "))}, are better near low tide and on small days for flatland.` : ""}</p>` : gentle.length ? `<p>Many beaches here are flat and wide, like ${esc(gentle.slice(0, 4).join(", "))}, so they skim best near low tide and on small days, which suits flatland.</p>` : ""}
<h2>Beaches in ${esc(r)}</h2>
<ul class="beaches">${beaches.map((s) => `<li><a href="/${s.slug}">${esc(s.name)}</a><span>${facing(s.face)}-facing \xB7 ${slopeWord(s.slope)} beach</span></li>`).join("")}</ul>
<h2>Other areas</h2>
<p>${others.map((x) => `<a href="/${regionSlug(x)}">${esc(x)}</a>`).join(" \xB7 ")}</p>
<p class="mute"><a href="/skimboarding-conditions">How to read skimboarding conditions \u2192</a></p>`;
  const extraLd = ld({ "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", name: title, url, description: desc, isPartOf: { "@type": "WebSite", name: "SkimCast", url: SITE + "/" } },
    { "@type": "ItemList", itemListElement: beaches.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: `${SITE}/${s.slug}` })) },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "SkimCast", item: SITE + "/" }, { "@type": "ListItem", position: 2, name: `${r} skimboarding`, item: url }] }
  ] });
  return shell({ title, desc, url, body, extraLd });
}
var GUIDE = [
  [
    "What tide is best for skimboarding?",
    "It depends on the beach. On steep beaches, waves break right on the sand around mid tide, which is ideal for wave riding. On flat, wide beaches the water runs out too far at mid and high tide, so low tide and the first part of the incoming tide work better. Flatland skimming almost always works best near low tide, when there is a long stretch of wet, smooth sand."
  ],
  [
    "What size waves are best for skimboarding?",
    "For wave riding, about 1 to 3 ft of shorebreak is the sweet spot on most Florida beaches, and a little bigger in California. Under about half a foot is too small to ride but can be great for flatland. Much over 4 ft, waves tend to close out hard on the sand."
  ],
  [
    "How far out should the waves break?",
    "Close. You want to reach the wave in a few steps after dropping your board, usually within 10 to 30 ft of the water's edge. Steep beaches make waves break closer to shore, which is why they are popular for wave riding."
  ],
  [
    "What wind is best for skimboarding?",
    "Light wind or wind blowing from the land out to sea (offshore). Offshore wind keeps wave faces clean and glassy. Onshore wind, blowing from the sea onto the beach, makes the shorebreak choppy and messy, even when the waves are a good size."
  ],
  [
    "Does swell period matter for skimboarding?",
    "Yes. Longer-period swell (8 seconds and up) makes cleaner, punchier shorebreak with more shape. Short-period wind chop (under 5 seconds) makes crumbly, messy waves that are hard to ride."
  ],
  [
    "How does SkimCast score skimboarding conditions?",
    "Every daylight hour gets a score out of 10 from shorebreak size, how close the waves break, wind, tide and swell quality, with points taken off for rain and storms. 8 or higher is a W Skim, 6.5 or higher is good, 4.5 or higher is fair. A W Skim needs at least two strong hours in a row, not one lucky hour."
  ]
];
function guidePage() {
  const url = `${SITE}/skimboarding-conditions`;
  const title = "Best Conditions for Skimboarding: Tide, Waves and Wind | SkimCast";
  const desc = "When to skimboard: the best tide, wave size, wind and swell for skimboarding, explained simply, plus how the SkimCast skim score works.";
  const body = `<div class="crumbs"><a href="/">SkimCast</a> \u203A Skimboarding conditions</div>
<h1>Best conditions for skimboarding</h1>
<p>Good skimboarding comes down to four things: the tide, the size of the shorebreak, how close it breaks to the sand, and the wind. Here is what to look for, whether you ride waves or skim flatland.</p>
${GUIDE.map(([q, a]) => `<h2>${esc(q)}</h2><p>${esc(a)}</p>`).join("")}
<h2>Check a beach</h2>
<p>Find your beach by area: ${regions_default.filter((r) => inRegion(r).length).slice(0, 12).map((r) => `<a href="/${regionSlug(r)}">${esc(r)}</a>`).join(" \xB7 ")}.</p>`;
  const extraLd = ld({ "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: "Best conditions for skimboarding: tide, waves and wind", url, description: desc, author: { "@type": "Organization", name: "SkimCast", url: SITE + "/" }, publisher: { "@type": "Organization", name: "SkimCast", logo: { "@type": "ImageObject", url: SITE + "/icon-512.png" } }, dateModified: "2026-11-06" },
    { "@type": "FAQPage", mainEntity: GUIDE.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }
  ] });
  return shell({ title, desc, url, body, extraLd });
}
var SITEMAP_EXTRA = () => [...regions_default.filter((r) => inRegion(r).length).map((r) => `${SITE}/${regionSlug(r)}`), `${SITE}/skimboarding-conditions`];

// src/worker.js
var SITE2 = "https://skimcastapp.com";
var BY_SLUG = Object.fromEntries(spots_default.map((s) => [s.slug, s]));
var esc2 = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
var CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "content-type" };
var text = (body, status = 200, extra = {}) => new Response(body, { status, headers: { ...CORS, ...extra } });
var json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { ...CORS, "content-type": "application/json", "cache-control": "no-store" } });
async function buoy(url) {
  const id = (url.searchParams.get("id") || "").trim();
  if (!/^[A-Za-z0-9]{4,7}$/.test(id)) return text("Bad buoy id", 400);
  try {
    const r = await fetch(`https://www.ndbc.noaa.gov/data/realtime2/${id.toUpperCase()}.txt`, {
      headers: { "user-agent": "SkimCast skimboard forecast (buoy relay)" },
      signal: AbortSignal.timeout(8e3),
      cf: { cacheTtl: 600, cacheEverything: true }
    });
    if (!r.ok) return text(`NOAA returned ${r.status}`, 502);
    return text(await r.text(), 200, { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=600" });
  } catch (e) {
    return text("Could not reach NOAA", 504);
  }
}
async function nws(url) {
  const file = (url.searchParams.get("file") || "").trim();
  if (!/^fz[a-z]{2}\d\d\.k[a-z]{3}\.srf\.[a-z]{3}\.txt$/.test(file)) return text("Bad file name", 400);
  try {
    const r = await fetch(`https://tgftp.nws.noaa.gov/data/raw/fz/${file}`, {
      headers: { "user-agent": "SkimCast skimboard forecast (surf forecast relay)" },
      signal: AbortSignal.timeout(8e3),
      cf: { cacheTtl: 900, cacheEverything: true }
    });
    if (!r.ok) return text(`NWS returned ${r.status}`, 502);
    return text(await r.text(), 200, { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=900" });
  } catch (e) {
    return text("Could not reach the NWS", 504);
  }
}
var OM_HOSTS = { "api.open-meteo.com": "customer-api.open-meteo.com", "marine-api.open-meteo.com": "customer-marine-api.open-meteo.com" };
var OM_FRESH = 30 * 6e4;
var OM_KEEP = 3 * 3600;
var cacheOf = () => typeof caches !== "undefined" && caches.default || null;
function served(res, state, maxAge) {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(CORS)) out.headers.set(k, v);
  out.headers.set("cache-control", `public, max-age=${maxAge}`);
  out.headers.set("x-skimcast-cache", state);
  out.headers.delete("x-fetched");
  return out;
}
async function om(url, env, ctx) {
  let u;
  try {
    u = new URL(url.searchParams.get("u") || "");
  } catch {
    return text("Bad url", 400);
  }
  if (u.protocol !== "https:" || !OM_HOSTS[u.hostname] || !/^\/v1\/(marine|forecast)$/.test(u.pathname) || u.toString().length > 9e3) return text("Not allowed", 403);
  u.searchParams.delete("apikey");
  const cache = cacheOf(), key = new Request(`${url.origin}/__om_cache?${encodeURIComponent(u.toString())}`);
  let hitRes = null;
  try {
    hitRes = cache ? await cache.match(key) : null;
  } catch (e) {
    hitRes = null;
  }
  const age = hitRes ? Date.now() - +(hitRes.headers.get("x-fetched") || 0) : Infinity;
  if (hitRes && age < OM_FRESH) return served(hitRes, "HIT", 600);
  const up = new URL(u.toString());
  if (env && env.OPEN_METEO_KEY) {
    up.hostname = OM_HOSTS[u.hostname];
    up.searchParams.set("apikey", env.OPEN_METEO_KEY);
  }
  try {
    const r = await fetch(up.toString(), { headers: { "user-agent": "SkimCast skimboard forecast (skimcastapp.com)" }, signal: AbortSignal.timeout(1e4) });
    const body = r.ok ? await r.text() : "";
    if (r.ok && /^[\[{]/.test(body)) {
      const fresh = new Response(body, { headers: { "content-type": "application/json", "cache-control": `public, max-age=${OM_KEEP}`, "x-fetched": String(Date.now()) } });
      if (cache) {
        const put = cache.put(key, fresh.clone()).catch(() => {
        });
        if (ctx && ctx.waitUntil) ctx.waitUntil(put);
        else await put;
      }
      return served(fresh, "MISS", 600);
    }
  } catch (e) {
  }
  if (hitRes && age < OM_KEEP * 1e3) return served(hitRes, "STALE", 120);
  return text("The weather service is busy. Try again in a minute.", 503);
}
async function tide(url) {
  const st = (url.searchParams.get("station") || "").trim(), iv = url.searchParams.get("interval"), bd = url.searchParams.get("begin") || "";
  if (!/^[A-Za-z0-9]{5,8}$/.test(st) || !["h", "hilo"].includes(iv) || !/^\d{8}$/.test(bd)) return text("Bad tide request", 400);
  const q = `product=predictions&application=skimcast&station=${st}&begin_date=${bd}&range=168&datum=MLLW&time_zone=lst_ldt&units=english&interval=${iv}&format=json`;
  try {
    const r = await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${q}`, {
      headers: { "user-agent": "SkimCast skimboard forecast (tide relay)" },
      signal: AbortSignal.timeout(9e3),
      cf: { cacheTtl: 21600, cacheEverything: true }
    });
    const body = await r.text();
    if (r.ok && iv === "h" && /No Predictions data/i.test(body)) return text('{"predictions":[]}', 200, { "content-type": "application/json", "cache-control": "public, max-age=21600" });
    if (!r.ok || !body.includes("predictions")) return text("NOAA tides unavailable", 502);
    return text(body, 200, { "content-type": "application/json", "cache-control": "public, max-age=21600" });
  } catch (e) {
    return text("Could not reach NOAA tides", 504);
  }
}
var NWPS = "https://nomads.ncep.noaa.gov/pub/data/nccf/com/nwps/prod";
var CDIP = "https://thredds.cdip.ucsd.edu/thredds/dodsC/cdip/model/MOP_alongshore";
var UA = { "user-agent": "SkimCast skimboard forecast (skimcastapp.com)" };
var ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
var RUN_MEMO = /* @__PURE__ */ new Map();
async function nwpsRun(n, r, ctx) {
  const mem = RUN_MEMO.get(n);
  if (mem && Date.now() - mem.at < 30 * 6e4) return mem.run;
  const cache = cacheOf(), key = new Request(`https://skimcast.cache/nwps-run/v3/${n}`);
  const hit2 = cache && await cache.match(key);
  if (hit2) {
    try {
      const j = await hit2.json();
      if (Array.isArray(j) && j.length) {
        RUN_MEMO.set(n, { at: Date.now(), run: j });
        return j;
      }
    } catch (e) {
    }
  }
  const now = /* @__PURE__ */ new Date(), tries = [];
  for (const back of [0, 1, 2, 3]) for (const c of ["18", "12", "06", "00"]) {
    const d = new Date(now - back * 864e5);
    const t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), +c);
    if (t <= now) tries.push({ day: ymd(d), c, t, url: `${NWPS}/${r}.${ymd(d)}/${n}/${c}/CG1/nwps.t${c}z.20m_CG1_runup.${n}.txt` });
  }
  const got = await Promise.all(tries.slice(0, 14).map(async (x) => {
    try {
      const res = await fetch(x.url, { headers: { ...UA, range: "bytes=0-2047" }, signal: AbortSignal.timeout(8e3) });
      if (res.status !== 206 && res.status !== 200) return null;
      const head = await res.text(), lines = head.split("\n");
      let hdr = 0;
      for (const l of lines) {
        if (l.startsWith("%")) hdr += l.length + 1;
        else break;
      }
      const first = lines.find((l) => l.trim() && !l.startsWith("%")) || "";
      return { ...x, hdr, line: first.length + 1 };
    } catch (e) {
      return null;
    }
  }));
  const best = got.filter((x) => x && x.line > 100).sort((a, b) => b.t - a.t).slice(0, 4);
  if (!best.length) return [];
  RUN_MEMO.set(n, { at: Date.now(), run: best });
  if (cache && ctx) ctx.waitUntil(cache.put(key, new Response(JSON.stringify(best), { headers: { "content-type": "application/json", "cache-control": "public, max-age=1800" } })));
  return best;
}
async function nwpsSpot(nr, ctx) {
  const runs = await nwpsRun(nr.n, nr.r, ctx);
  for (const run of runs.slice(0, 3)) for (const hours of [145, 121]) {
    const start = run.hdr + nr.i * hours * run.line, end = start + hours * run.line - 1;
    const res = await fetch(run.url, { headers: { ...UA, range: `bytes=${start}-${end}` }, signal: AbortSignal.timeout(9e3) });
    if (res.status !== 206) break;
    const rows = (await res.text()).split("\n").filter((l) => l.trim()).map((l) => l.trim().split(/\s+/));
    const okRow = (p2) => p2.length > 5 && Math.abs(+p2[1] - 360 - nr.x) < 2e-3 && Math.abs(+p2[2] - nr.y) < 2e-3;
    if (rows.length < hours * 0.9 || !rows.every(okRow) || !rows[0][0].endsWith(`.${run.c}00`)) continue;
    const t = [], h = [], p = [];
    rows.forEach((x) => {
      const [d, hm] = x[0].split(".");
      t.push(Date.UTC(+d.slice(0, 4), +d.slice(4, 6) - 1, +d.slice(6, 8), +hm.slice(0, 2)) / 1e3);
      h.push(+x[3]);
      p.push(+x[4]);
    });
    return { src: "NOAA nearshore wave model (NWPS, " + nr.n.toUpperCase() + ")", run: `${run.day} ${run.c}z`, t, h, p };
  }
  return null;
}
async function cdipSpot(id) {
  const res = await fetch(`${CDIP}/${id}_forecast.nc.ascii?waveTime,waveHs,waveTp,waveDp`, { headers: UA, signal: AbortSignal.timeout(9e3) });
  if (!res.ok) return null;
  const body = await res.text(), arr = (k) => {
    const m = body.match(new RegExp("\\n" + k + "\\[\\d+\\]\\n([^\\n]*)"));
    return m ? m[1].split(",").map(Number) : [];
  };
  const t = arr("waveTime"), h = arr("waveHs"), p = arr("waveTp"), d = arr("waveDp");
  if (t.length < 4 || h.length !== t.length) return null;
  const ok = h.map((v) => v >= 0 && v < 20);
  return { src: "CDIP nearshore wave model (Scripps MOP " + id + ")", run: "", t: t.filter((_, k) => ok[k]), h: h.filter((_, k) => ok[k]), p: p.filter((_, k) => ok[k]), d: d.filter((_, k) => ok[k]) };
}
async function near(url, ctx) {
  const sp = BY_SLUG[(url.searchParams.get("s") || "").toLowerCase()];
  if (!sp || !sp.near) return json({ none: true }, 404);
  const cache = cacheOf(), key = new Request(`https://skimcast.cache/near/v1/${sp.slug}`);
  const hit2 = cache && await cache.match(key);
  if (hit2) return new Response(hit2.body, hit2);
  let out = null;
  try {
    out = sp.near.c ? await cdipSpot(sp.near.c) : await nwpsSpot(sp.near, ctx);
  } catch (e) {
    out = null;
  }
  if (!out) return json({ none: true });
  const res = new Response(JSON.stringify(out), { headers: { ...CORS, "content-type": "application/json", "cache-control": "public, max-age=3600" } });
  if (cache) ctx.waitUntil(cache.put(key, res.clone()));
  return res;
}
var repReady = false;
async function repDb(env) {
  const d = await db(env);
  if (!repReady) {
    await d.batch([
      d.prepare("CREATE TABLE IF NOT EXISTS reports (slug TEXT NOT NULL, ts INTEGER NOT NULL, r INTEGER NOT NULL, m TEXT NOT NULL, fs REAL, who TEXT NOT NULL)"),
      d.prepare("CREATE INDEX IF NOT EXISTS reports_slug_ts ON reports(slug, ts)")
    ]);
    repReady = true;
  }
  return d;
}
async function report(request, url, env) {
  if (request.method === "OPTIONS") return text(null, 204);
  try {
    const d = await repDb(env);
    if (request.method === "GET") {
      if (url.searchParams.get("all")) {
        const days = Math.min(120, Math.max(1, parseInt(url.searchParams.get("days") || "30", 10) || 30));
        const r3 = await d.prepare("SELECT slug, ts, r, m, fs FROM reports WHERE ts > ? ORDER BY ts DESC LIMIT 5000").bind(Date.now() - days * 864e5).all();
        return json({ reports: r3.results || [] });
      }
      const sp2 = BY_SLUG[(url.searchParams.get("s") || "").toLowerCase()];
      if (!sp2) return json({ reports: [] });
      const r2 = await d.prepare("SELECT ts, r, m FROM reports WHERE slug = ? AND ts > ? ORDER BY ts DESC LIMIT 50").bind(sp2.slug, Date.now() - 36 * 36e5).all();
      return json({ reports: r2.results || [] });
    }
    if (request.method !== "POST") return text("GET or POST only", 405);
    if (/bot|crawl|spider|preview|headless|lighthouse|pingdom/i.test(request.headers.get("user-agent") || "")) return text(null, 204);
    let b = {};
    try {
      b = JSON.parse((await request.text()).slice(0, 300));
    } catch {
      return text("bad body", 400);
    }
    const sp = BY_SLUG[String(b.s || "").toLowerCase()], r = +b.r, m = b.m === "flat" ? "flat" : "wave";
    if (!sp || ![1, 2, 3].includes(r)) return text("bad report", 400);
    const fs = Number.isFinite(+b.fs) ? Math.max(0, Math.min(10, +b.fs)) : null;
    const raw = new TextEncoder().encode((request.headers.get("cf-connecting-ip") || "x") + "|" + dayOf(/* @__PURE__ */ new Date()) + "|skimcast-reports");
    const who = [...new Uint8Array(await crypto.subtle.digest("SHA-256", raw))].slice(0, 8).map((x) => x.toString(16).padStart(2, "0")).join("");
    const dup = await d.prepare("SELECT COUNT(*) AS n FROM reports WHERE slug = ? AND who = ? AND ts > ?").bind(sp.slug, who, Date.now() - 3 * 36e5).first();
    if (dup && dup.n > 0) {
      await d.prepare("UPDATE reports SET r = ?, m = ?, fs = ?, ts = ? WHERE slug = ? AND who = ? AND ts > ?").bind(r, m, fs, Date.now(), sp.slug, who, Date.now() - 3 * 36e5).run();
    } else {
      await d.prepare("INSERT INTO reports (slug, ts, r, m, fs, who) VALUES (?, ?, ?, ?, ?, ?)").bind(sp.slug, Date.now(), r, m, fs, who).run();
    }
    return json({ ok: true });
  } catch (e) {
    return json({ error: e && e.message === "no_db" ? "no database" : "could not save" }, 500);
  }
}
async function hit(request, env) {
  if (request.method === "OPTIONS") return text(null, 204);
  if (request.method !== "POST") return text("POST only", 405);
  let b = {};
  try {
    b = JSON.parse((await request.text()).slice(0, 500));
  } catch {
    return text("bad body", 400);
  }
  if (/bot|crawl|spider|preview|headless|lighthouse|pingdom/i.test(request.headers.get("user-agent") || "")) return text(null, 204);
  const t = ["v", "b", "c"].includes(b.t) ? b.t : null;
  if (!t) return text("bad type", 400);
  const u = t === "v" && b.u ? 1 : 0, n = t === "v" && b.n ? 1 : 0;
  const slug = String(b.s || "none").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 48) || "none";
  try {
    const d = await db(env);
    await d.prepare("INSERT INTO hits (day, t, u, n, slug, ts) VALUES (?, ?, ?, ?, ?, ?)").bind(dayOf(/* @__PURE__ */ new Date()), t, u, n, slug, Date.now()).run();
  } catch (e) {
    return text("store failed", 500);
  }
  return text(null, 204);
}
async function stats(url, env) {
  const days = Math.min(90, Math.max(1, parseInt(url.searchParams.get("days") || "30", 10) || 30));
  try {
    const d = await db(env);
    const list = [];
    for (let i = days - 1; i >= 0; i--) list.push(dayOf(new Date(Date.now() - i * 864e5)));
    const uniq = [...new Set(list)], from = uniq[0];
    const [byDay, byBeach] = await d.batch([
      d.prepare("SELECT day, SUM(t='v') AS visits, SUM(t='v' AND u=1) AS visitors, SUM(t='v' AND n=1) AS newVisitors, SUM(t IN ('v','b')) AS beachViews, SUM(t='c') AS sponsorClicks FROM hits WHERE day >= ? GROUP BY day").bind(from),
      d.prepare("SELECT day, slug, COUNT(*) AS views FROM hits WHERE day >= ? AND t IN ('v','b') GROUP BY day, slug").bind(from)
    ]);
    const map = Object.fromEntries((byDay.results || []).map((r) => [r.day, r]));
    const per = {};
    (byBeach.results || []).forEach((r) => {
      (per[r.day] = per[r.day] || {})[r.slug] = r.views;
    });
    const out = uniq.map((day) => {
      const r = map[day] || {};
      return { date: day, visitors: r.visitors || 0, visits: r.visits || 0, newVisitors: r.newVisitors || 0, beachViews: r.beachViews || 0, sponsorClicks: r.sponsorClicks || 0, beaches: per[day] || {} };
    });
    const sum = (k) => out.reduce((a, x) => a + (x[k] || 0), 0);
    const beaches = {};
    out.forEach((x) => Object.entries(x.beaches).forEach(([s, v]) => {
      beaches[s] = (beaches[s] || 0) + v;
    }));
    return json({
      today: dayOf(/* @__PURE__ */ new Date()),
      timezone: TZ,
      days: out,
      totals: { visitors: sum("visitors"), visits: sum("visits"), newVisitors: sum("newVisitors"), beachViews: sum("beachViews"), sponsorClicks: sum("sponsorClicks") },
      beaches: Object.entries(beaches).sort((a, b) => b[1] - a[1]).map(([slug, views]) => ({ slug, views }))
    });
  } catch (e) {
    return json({ error: e && e.message === "no_db" ? "The visit database isn't connected yet." : "Could not read the visit records." }, 500);
  }
}
async function beachPage(request, env, sp) {
  const res = await env.ASSETS.fetch(new Request(new URL("/", request.url), request));
  let html = await res.text();
  const url = `${SITE2}/${sp.slug}`, { title, desc } = beachMeta(sp);
  const intro = `Skimboarding forecast for ${sp.name}: a skim score with shorebreak size, how far out the waves break, tide, wind and the best time to skim today and the next 5 days. Updated through the day from NOAA, the National Weather Service and marine forecast models. One of ${spots_default.length} beaches on SkimCast.`;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc2(title)}</title>`).replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc2(desc)}">`).replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc2(title)}">`).replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc2(desc)}">`).replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`).replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">
${beachLd(sp, url)}`).replace(/<h1 id="spotname" class="anton"><\/h1>/, `<h1 id="spotname" class="anton">${esc2(sp.name)}</h1>`).replace(/(<p class="note" id="seoText"[^>]*>)[^<]*(<\/p>)/, `$1${esc2(intro)}$2
${beachContent(sp)}`);
  return new Response(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
}
async function homePage(request, env) {
  const res = await env.ASSETS.fetch(new Request(new URL("/", request.url), request));
  let html = await res.text();
  html = html.replace(/<link rel="canonical" href="[^"]*">/, (m) => `${m}
${homeLd()}`).replace(/(<p class="note" id="seoText"[^>]*>[^<]*<\/p>)/, `$1
${homeContent()}`);
  return new Response(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300" } });
}
var page = (html) => new Response(html, { status: 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=3600" } });
function robots() {
  return text(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /stats

Sitemap: ${SITE2}/sitemap.xml
`, 200, { "content-type": "text/plain; charset=utf-8" });
}
function sitemap() {
  const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const urls = [`${SITE2}/`, ...SITEMAP_EXTRA(), ...spots_default.map((s) => `${SITE2}/${s.slug}`), `${SITE2}/sponsor`];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
` + urls.map((u) => `  <url><loc>${u}</loc><lastmod>${day}</lastmod><changefreq>hourly</changefreq></url>`).join("\n") + `
</urlset>
`;
  return text(body, 200, { "content-type": "application/xml; charset=utf-8" });
}
var worker_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    switch (url.pathname) {
      case "/api/om":
        return om(url, env, ctx);
      case "/api/tide":
        return tide(url);
      case "/api/buoy":
        return buoy(url);
      case "/api/nws":
        return nws(url);
      case "/api/hit":
        return hit(request, env);
      case "/api/stats":
        return stats(url, env);
      case "/api/near":
        return near(url, ctx);
      case "/api/report":
        return report(request, url, env);
    }
    if (url.pathname.startsWith("/api/")) return text("Not found", 404);
    if (url.pathname === "/robots.txt") return robots();
    if (url.pathname === "/sitemap.xml") return sitemap();
    if (url.pathname === "/" || url.pathname === "/index.html") return homePage(request, env);
    if (url.pathname === "/skimboarding-conditions") return page(guidePage());
    const rg = url.pathname.match(/^\/([a-z0-9-]+-skimboarding)\/?$/);
    if (rg && REGION_BY_SLUG[rg[1]]) return page(regionPage(REGION_BY_SLUG[rg[1]]));
    const m = url.pathname.match(/^\/([a-z0-9-]+)(\/)?$/);
    if (m && BY_SLUG[m[1]]) {
      if (m[2]) return Response.redirect(`${url.origin}/${m[1]}${url.search}`, 301);
      return beachPage(request, env, BY_SLUG[m[1]]);
    }
    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);
    out.headers.set("access-control-allow-origin", "*");
    return out;
  }
};
export {
  worker_default as default
};
