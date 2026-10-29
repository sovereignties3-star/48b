window.gon = {};
gon.global = {
  "segment_js_write_key": "7JVChyK8LN1tHam3imvcvqDHwQe038Xv",
  "auth0_client_id": "IdAxBDkXxeqce3MmSjmNQzT7mKJx2yG7",
  "auth0_custom_domain": "auth.moderntreasury.com",
  "auth0_redirect": "https://app.moderntreasury.com",
  "datadog_rum_application_id": "cdd8dc81-f472-4c1a-b16a-f1ac3aa2f309",
  "datadog_rum_client_token": "pubf6cc287fc89bb715c8be1902a70aad4f",
  "datadog_rum_environment": "production",
  "rails_env": "production",
  "plaid_environment": "production",
  "plaid_public_key": "1f0b22416062984fa3c5f9a4d7c0bb",
  "sardineHost": "api.sardine.ai",
  "sardineIsDev": "false",
  "sentry_dsn": "https://63e01c5b9ec44918be59cc3272db7d24@sentry.io/1244199",
  "sentry_release": "138761",
  "sentry_environment": "production",
  "sentry_cell": "us001"
};
gon.sentry_context = {
  "user": {
    "id": "b8201fa9-b39e-4f3a-99eb-17b20d750f24",
    "email": "jamesocallaghanprivatebank@gmail.com"
  },
  "tags": {
    "live_mode": false,
    "organization_id": "7e61b1b1-e6b1-4088-8cb3-a99544dbc1c0"
  },
  "extras": {
    "organization_name": "Citibank Demo Business Inc",
    "request_id": "1-65dd75b7-72f01168559d21db7ad3bfa9",
    "is_ghosting": false
  }
};
gon.organization = {
  "id": "7e61b1b1-e6b1-4088-8cb3-a99544dbc1c0",
  "name": "Citibank Demo Business Inc",
  "ticker": "CD",
  "createdAt": 1641366081,
  "showPii": true
};
gon.flatfile = {
  "licenseKey": "be6d29d6-2e51-477b-b480-ac7254ea60f7"
};
gon.internalAccounts = {
  "byId": {
    "207e2c16-17e9-4317-920c-fc5efd01fdca": {
      "id": "207e2c16-17e9-4317-920c-fc5efd01fdca",
      "name": "Revenue (••• 1491)",
      "long_name": "GWB Revenue (••• 1491)",
      "connection_id": "5794d62e-6f0d-431e-af7a-6c2d7f8ed513",
      "currency": "USD"
    },
    "88168fc0-f378-4b9f-ac8b-00742782da8c": {
      "id": "88168fc0-f378-4b9f-ac8b-00742782da8c",
      "name": "Expenses (••• 1491)",
      "long_name": "GWB Expenses (••• 1491)",
      "connection_id": "5794d62e-6f0d-431e-af7a-6c2d7f8ed513",
      "currency": "USD"
    },
    "54488dce-fe5a-48c9-8b90-3c4709a1a1a8": {
      "id": "54488dce-fe5a-48c9-8b90-3c4709a1a1a8",
      "name": "Corporate (••• 1491)",
      "long_name": "GWB Corporate (••• 1491)",
      "connection_id": "5794d62e-6f0d-431e-af7a-6c2d7f8ed513",
      "currency": "USD"
    },
    "fb90d8eb-daf6-4362-833a-6aa44e213a7b": {
      "id": "fb90d8eb-daf6-4362-833a-6aa44e213a7b",
      "name": "Signet Wallet (••• 0d76)",
      "long_name": "GWB Signet Wallet (••• 0d76)",
      "connection_id": "5794d62e-6f0d-431e-af7a-6c2d7f8ed513",
      "currency": "USD"
    }
  },
  "allIds": [
    "207e2c16-17e9-4317-920c-fc5efd01fdca",
    "88168fc0-f378-4b9f-ac8b-00742782da8c",
    "54488dce-fe5a-48c9-8b90-3c4709a1a1a8",
    "fb90d8eb-daf6-4362-833a-6aa44e213a7b"
  ]
};
console.log("[Modern Treasury] Loaded window.gon from mt.js successfully.");
