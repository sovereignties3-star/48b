import { Router, Request, Response } from 'express';
import { recordBridgeEvent } from './quickbooks-bridge';

export const universalIngestRouter = Router();

// Ingest generic banking or ledger payload
universalIngestRouter.post(['/', '/ingest', '/payload'], async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const bridgeRecord = await recordBridgeEvent({
      source: 'UNIVERSAL_INGEST',
      action: 'BATCH_IMPORT',
      externalEntityId: payload?.id || `ingest_${Date.now()}`,
      amount: payload?.amount || 0,
      currency: payload?.currency || 'USD',
      qboLinkedEntityType: 'JournalEntry',
      summary: payload?.summary || 'Universal multi-format data ingestion',
      rawPayload: payload
    });

    res.json({
      success: true,
      message: 'Payload ingested successfully into QuickBooks Bridge',
      bridgeRecord
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET status
universalIngestRouter.get(['/', '/status'], (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'QuickBooks Universal Ingestion Engine',
    timestamp: new Date().toISOString()
  });
});

export default universalIngestRouter;
