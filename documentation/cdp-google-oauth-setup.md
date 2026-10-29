# Google OAuth Configuration

Configure your own Google OAuth application to enable custom branding and control over the Google Sign-In experience for CDP wallets.

**Time to complete**: ~15-20 minutes

## Prerequisites

* **Google Cloud Platform account**: Sign up at console.cloud.google.com
* **CDP Project ID**: Available in your CDP Portal dashboard
* **Access to CDP Portal**: Permission to configure user wallet settings

## Step 1: Create a Google Cloud project

1. Navigate to the Google Cloud Console.
2. Click the project dropdown and click **New Project**.
3. Enter a project name (e.g., "My App - CDP") and click **Create**.

## Step 2: Configure OAuth consent screen

1. In Google Cloud Console, navigate to **Google Auth Platform** > **Audience**.
2. Choose user type (Internal/External).
3. Fill in **Branding** (App name, support email, logo, links).
4. On **Data Access**, add scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile`, `openid`.
5. Save and return to dashboard.

## Step 3: Create OAuth 2.0 credentials

1. Navigate to **Google Auth Platform** > **Clients**.
2. Click **Create client**.
3. Choose **Web application**.
4. Set **Authorized redirect URI**:
   `https://api.cdp.coinbase.com/platform/v2/end-users/auth/oauth/google/callback`
5. Click **Create** and securely store your **Client ID** and **Client Secret**.

## Step 4: Configure CDP Portal

1. Go to the [CDP Portal](https://portal.cdp.coinbase.com/).
2. Select your project.
3. Go to **Non-custodial Wallet** > **Authentication**.
4. Toggle **Google** to on.
5. Paste your **Client ID** and **Client Secret**.
6. Click **Save Changes**.

## Step 5: Verification

Test your configuration by initiating the Google sign-in flow in your application using the CDP SDK. Ensure the consent screen shows your application name.
