import { Router, Request, Response } from 'express';

export const spacecraftsRouter = Router();

// In-memory persistent database of spacecrafts
export const spacecraftsDb: Record<string, {
  id: string;
  name: string;
  type: 'capsule' | 'probe' | 'satellite' | 'spaceplane' | 'station';
  description?: string;
}> = {
  'sc-orion-01': {
    id: 'sc-orion-01',
    name: 'Orion Exploration Vehicle',
    type: 'capsule',
    description: 'Deep-space exploration crew capsule engineered for lunar and martian transfer trajectories.'
  },
  'sc-voyager-01': {
    id: 'sc-voyager-01',
    name: 'Voyager Interstellar Explorer',
    type: 'probe',
    description: 'Interstellar scientific probe with plasma spectrometer and magnetometer arrays.'
  },
  'sc-starlink-01': {
    id: 'sc-starlink-01',
    name: 'Starlink V2 Mini-Array',
    type: 'satellite',
    description: 'Low-earth orbit phased-array optical satellite for global mesh communication.'
  },
  'sc-dreamchaser-01': {
    id: 'sc-dreamchaser-01',
    name: 'Dream Chaser Tenacity',
    type: 'spaceplane',
    description: 'Autonomous lifting-body spaceplane designed for reusable pressurized runway landings.'
  },
  'sc-iss-gateway-01': {
    id: 'sc-iss-gateway-01',
    name: 'Lunar Gateway Habitat Station',
    type: 'station',
    description: 'Permanent multi-module orbital habitat and refueling outpost.'
  }
};

/**
 * GET /spacecrafts/{spacecraftId}
 * OpenAPI 3.1.0 Sample API implementation
 */
spacecraftsRouter.get('/:spacecraftId', (req: Request, res: Response) => {
  try {
    const { spacecraftId } = req.params;

    if (!spacecraftId || spacecraftId.trim() === '') {
      return res.status(404).json({
        message: 'No spacecraft found for the provided `spacecraftId`'
      });
    }

    const craft = spacecraftsDb[spacecraftId];

    if (!craft) {
      return res.status(404).json({
        message: `No spacecraft found for the provided \`spacecraftId\`: ${spacecraftId}`
      });
    }

    // 200 OK with exact Spacecraft schema
    return res.status(200).json({
      id: craft.id,
      name: craft.name,
      type: craft.type,
      description: craft.description
    });
  } catch (err: any) {
    // 500 Unexpected error with Error schema
    return res.status(500).json({
      message: err?.message || 'Unexpected internal server error occurred while retrieving spacecraft'
    });
  }
});

// Also provide a list endpoint for full management
spacecraftsRouter.get('/', (req: Request, res: Response) => {
  return res.status(200).json(Object.values(spacecraftsDb));
});
