import { Router } from 'express';
import { exportJWK, generateKeyPair } from 'jose';

export const wellKnownRouter = Router();

// Generate a static key pair for dev purposes (in production, use a secure vault)
let publicKeyJwk: any = null;

async function getPublicKey() {
  if (!publicKeyJwk) {
    const { publicKey } = await generateKeyPair('RS256');
    publicKeyJwk = await exportJWK(publicKey);
    publicKeyJwk.kid = 'dev-key-1';
    publicKeyJwk.use = 'sig';
    publicKeyJwk.alg = 'RS256';
  }
  return publicKeyJwk;
}

wellKnownRouter.get('/jwks.json', async (req, res) => {
  const jwk = await getPublicKey();
  res.json({ keys: [jwk] });
});
