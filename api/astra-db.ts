import { DataAPIClient } from '@datastax/astra-db-ts';
import { Router, Request, Response } from 'express';

/**
 * DataStax Astra DB Integration
 * Initializes the Data API Client using environment variables.
 */

const ASTRA_DB_APPLICATION_TOKEN = process.env.ASTRA_DB_APPLICATION_TOKEN || '';
const ASTRA_DB_API_ENDPOINT = process.env.ASTRA_DB_API_ENDPOINT || '';

// Initialize the client
const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
export const db = client.db(ASTRA_DB_API_ENDPOINT);

export const astraDbRouter = Router();

/**
 * GET /api/astra/status
 * Check Astra DB Connection Status
 */
astraDbRouter.get('/status', async (req: Request, res: Response) => {
  try {
    if (!ASTRA_DB_APPLICATION_TOKEN || !ASTRA_DB_API_ENDPOINT) {
      return res.status(400).json({
        success: false,
        error: 'Astra DB credentials not configured in environment (ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT)',
      });
    }

    // List collections to verify connectivity
    const collections = await db.listCollections();
    
    res.json({
      success: true,
      status: 'CONNECTED',
      endpoint: ASTRA_DB_API_ENDPOINT,
      collections: collections.map(c => c.name),
    });
  } catch (err: any) {
    console.error('[ASTRA DB ERROR]', err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/**
 * POST /api/astra/collection
 * Create a new collection
 */
astraDbRouter.post('/collection', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Collection name required' });

    await db.createCollection(name);
    res.json({ success: true, message: `Collection '${name}' created successfully.` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/astra/data/:collection
 * Retrieve all data from a collection
 */
astraDbRouter.get('/data/:collection', async (req: Request, res: Response) => {
  try {
    const { collection } = req.params;
    const coll = db.collection(collection);
    const cursor = coll.find({});
    const documents = await cursor.toArray();
    
    res.json({ success: true, collection, count: documents.length, data: documents });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
