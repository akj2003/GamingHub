# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Authentication Setup (Firebase)

This application uses Firebase for Google authentication. To enable this functionality locally or when deploying, you need to set up your own Firebase project.

### 1. Create/Use a Firebase Project

*   Go to the [Firebase Console](https://console.firebase.google.com/).
*   Create a new project or select an existing one.

### 2. Add a Web App to Firebase

*   In your Firebase project, go to Project Overview.
*   Click the Web icon (`</>`) to add a new web application.
*   Register your app:
    *   **App nickname**: Choose a name (e.g., "Gaming Hub Web").
    *   **Firebase Hosting**: You can skip this for now if you only need authentication.
*   After registering, Firebase will provide you with a `firebaseConfig` object. **Copy this object.**

### 3. Configure Firebase in the Application

*   In the project's source code, locate or create the file `src/firebase-config.ts`.
*   Replace the placeholder or existing content of this file with the `firebaseConfig` object you copied from your Firebase project. It should look similar to this:

    ```typescript
    import { initializeApp } from "firebase/app";

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID" // Optional
    };

    const app = initializeApp(firebaseConfig);
    export default app;
    ```

### 4. Enable Google Sign-In Provider

*   In the Firebase Console, navigate to **Authentication** (under the "Build" section).
*   Go to the **Sign-in method** tab.
*   Click on **Google** in the list of providers.
*   Toggle the **Enable** switch.
*   Provide a **Project support email**.
*   Click **Save**.

### 5. (Optional) Set up other providers (Facebook, Microsoft)

*   The current implementation primarily focuses on Google Sign-In. If you wish to add Facebook or Microsoft:
    *   Follow similar steps in the Firebase Console to enable them.
    *   This will require creating developer apps on Facebook for Developers and Azure Portal, respectively, to get App IDs and Secrets.
    *   You would also need to update the `AuthContext.tsx` and `Login.tsx` components to include buttons and logic for these providers.

### 6. Ensure Authorized Domains

*   Still in Firebase Authentication > Sign-in method tab, scroll down to **Authorized domains**.
*   Ensure that the domain from which you are serving your application (e.g., `localhost` for local development, or your deployment domain) is listed. Firebase usually adds `localhost` by default.

Once these steps are completed, the Google Sign-In functionality should work in your local environment or deployment.

## Deployment Notes

After running `npm run build`, the application will be in the `dist` folder. When deploying this folder:

1.  **Serve from Root or Configure Base Path**:
    *   This project is configured with `base: './'` in `vite.config.ts`, which makes asset paths relative. This should work well for most static hosting platforms, whether served from the root or a subdirectory.
    *   If you were to change `base` to `'/'` (the default), ensure your application is served from the root of your domain (e.g., `yourdomain.com`, not `yourdomain.com/some-app/`) or that your server correctly handles root-relative paths.

2.  **SPA Fallback / `index.html`**:
    *   For Single Page Applications (SPAs) like this one, your web server must be configured to serve the `dist/index.html` file for any routes that don't match a static file in the `dist` directory. This is often called a "fallback" or "rewrite" rule.
    *   Consult your hosting provider's documentation for how to set this up (e.g., for Netlify, Vercel, GitHub Pages, Firebase Hosting, AWS S3/CloudFront, Nginx, Apache).

3.  **MIME Types**:
    *   Ensure your server is correctly configured to serve JavaScript files (`.js`) with the `application/javascript` (or `text/javascript`) MIME type. CSS files (`.css`) should be `text/css`, etc. Most modern static hosting providers handle this automatically.

4.  **Console Error - Raw File Content**:
    *   If you deploy and see a blank page, and the browser's developer console shows the *content* of one of your source files (like `AuthContext.tsx` or `main.tsx`), it strongly indicates an issue with how JavaScript files are being served by your hosting environment (often an incorrect MIME type or the server not finding the built JS files and incorrectly serving the source or `index.html` as plain text for the JS request). Double-check your server configuration and MIME type settings.
