// Shared GLB constants. Bump GLB_VERSION when scene.glb changes so
// browsers (and any intermediate caches) fetch the new copy instead
// of serving a stale one.
export const GLB_VERSION = '6';

const v = (path) => `${path}?v=${GLB_VERSION}`;

export const GLB_PATH = v('/models/scene.glb');

// Decoder for Draco-compressed meshes. gstatic CDN serves the same
// version of the decoder Three.js publishes; using it avoids shipping
// the WASM blob from our own bundle.
export const DRACO_DECODER_PATH = 'https://www.gstatic.com/draco/v1/decoders/';
