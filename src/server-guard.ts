// Node-safe stand-in for `server-only`: throws in the browser, stays silent in
// plain-Node loaders (Payload migrate/seed, scripts) so headless getPayload works.
if (typeof window !== 'undefined') {
  throw new Error('This module cannot be imported from a Client Component.')
}
export {}
