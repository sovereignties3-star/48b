export const DEFAULT_CREDENTIALS = {
  url: "https://api.citi.com/v1/cards",
  bearerToken: "mock_citi_hk_token_993817",
  uuid: "hk_citi_user_8829",
  clientId: "citi_hk_client_id_001",
  cardFunction: "details"
};

export const SAMPLE_CITI_RESPONSE = {
  success: true,
  cards: [
    {
      cardId: "HK-CITI-PREMIER-001",
      cardName: "Citi PremierMiles Card",
      status: "Active",
      creditLimit: 250000,
      availableCredit: 215000,
      rewardPoints: 68400,
      currency: "HKD"
    },
    {
      cardId: "HK-CITI-CASH-002",
      cardName: "Citi Cash Back Card",
      status: "Active",
      creditLimit: 150000,
      availableCredit: 132000,
      cashBackEarned: 1450,
      currency: "HKD"
    }
  ]
};
