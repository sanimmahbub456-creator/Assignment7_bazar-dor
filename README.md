# বাজার দর 

**বাজারের প্রয়োজনীয় পণ্যের দাম এক নজরে।**

বাজার দর একটি responsive web application যেখানে ব্যবহারকারীরা প্রয়োজনীয়
পণ্যের বর্তমান তালিকাভুক্ত দাম, দাম বাড়া-কমার পরিবর্তন, পণ্যের বিভাগ এবং
বাজারভিত্তিক দামের তথ্য দেখতে পারেন। অ্যাপটিতে email/password
authentication-এর পাশাপাশি Google ও GitHub social login রয়েছে।

## 🔗 Project Links

-   **Live Website:** https://bazar-dor-eosin-theta.vercel.app/
-   **GitHub Repository:**https://github.com/sanimmahbub456-creator/Assignment7_bazar-dor

## ✨ Key Features

1.  **Responsive design** --- mobile, tablet ও desktop screen-এর জন্য
    উপযোগী layout।
2.  **Product catalogue** --- পণ্যের নাম, ছবি/emoji, একক, দাম এবং
    price-change indicator-সহ product cards।
3.  **Price movement sections** --- দাম বাড়া ও কমা পণ্য আলাদা section-এ
    দেখা।
4.  **Category browsing and sorting** --- category অনুযায়ী পণ্য দেখা এবং
    দাম কম থেকে বেশি বা বেশি থেকে কম সাজানো।
5.  **Product details** --- পণ্যের বিবরণ, সর্বনিম্ন, সর্বোচ্চ ও গড় দাম এবং
    বাজারভিত্তিক price information।
6.  **Authentication** --- Better Auth-এর মাধ্যমে email/password, Google
    এবং GitHub sign-in/sign-up।
7.  **Protected pages** --- login প্রয়োজন এমন পৃষ্ঠা এবং authentication
    redirect।
8.  **User profile** --- profile information দেখা এবং নাম update করার
    সুবিধা (যদি update-user feature project-এ enabled থাকে)।
9.  **Loading and feedback states** --- data fetch করার সময়
    loading/skeleton UI এবং authentication action-এর success/error
    feedback।
10. **Friendly error pages** --- unknown বা invalid route-এর জন্য home
    page-এ ফেরার link-সহ error page।

## 🧰 Technologies Used

-   **Next.js** --- React framework and App Router
-   **TypeScript** --- type-safe application code
-   **Tailwind CSS** --- styling and responsive layout
-   **daisyUI** --- UI components
-   **Better Auth** --- authentication and user sessions
-   **MongoDB** --- authentication data storage
-   **Vercel** --- deployment
-   **BazarDor Products API** --- product and category data

## 🔌 API Configuration

The project can use the following BazarDor API endpoints. Configure the
base URL in the project's environment/configuration file according to
the API provider currently working.

  Purpose                       Endpoint
  ----------------------------- ---------------------------
  All products                  `/products`
  Filter products by category   `/products?category=chal`
  Single product                `/products/1`
  All categories                `/categories`
  Single category               `/categories/chal`

Available base URLs:

-   Main: `https://openapi.programming-hero.com/api/bazardor`
-   Alternative 1: `https://api.api-store.workers.dev/api/bazardor`
-   Alternative 2: `https://api.abcz.workers.dev/api/bazardor`

Example full endpoint:

``` text
https://openapi.programming-hero.com/api/bazardor/products
```

## ⚙️ Environment Variables

Create a local `.env.local` file. **Do not commit secrets to GitHub.**

``` env
# App URL — local development
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# Better Auth
BETTER_AUTH_SECRET=replace_with_a_long_random_secret

# MongoDB connection string
BETTER_AUTH_DB_URL=replace_with_your_mongodb_connection_string

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

For production, set the same variables in your hosting provider's
environment settings. Set the production app URL to:

``` env
BETTER_AUTH_URL=https://bazar-dor-eosin-theta.vercel.app
NEXT_PUBLIC_BETTER_AUTH_URL=https://bazar-dor-eosin-theta.vercel.app
```

OAuth callback URLs for this deployment:

-   Google:
    `https://bazar-dor-eosin-theta.vercel.app/api/auth/callback/google`
-   GitHub:
    `https://bazar-dor-eosin-theta.vercel.app/api/auth/callback/github`

Ensure the callback URLs match the corresponding OAuth provider settings
exactly. Never put real secrets in this README or in source control.

## 🚀 Getting Started

### Prerequisites

-   Node.js version supported by the installed Next.js version
-   npm
-   MongoDB database
-   Google and/or GitHub OAuth credentials for social login

### Installation

1.  Clone your repository:

    ``` bash
    git clone YOUR_GITHUB_REPOSITORY_URL
    cd bazar-dor
    ```

2.  Install dependencies:

    ``` bash
    npm install
    ```

3.  Create `.env.local` and add the required environment variables.

4.  Start the development server:

    ``` bash
    npm run dev
    ```

5.  Open <http://localhost:3000> in your browser.

### Production Build

Run a production build before deploying:

``` bash
npm run build
npm run start
```

## 📱 Responsive Experience

The interface is designed to adapt to mobile, tablet, and desktop
widths. Product grids, navigation, price ticker, hero section, forms,
and detail views should remain usable across screen sizes.

## 🔐 Authentication Notes

-   Email/password and social sign-in use Better Auth.
-   Configure Google and GitHub OAuth credentials in the relevant
    provider dashboards.
-   The production callback URLs must match the deployed domain.
-   Keep `.env.local` out of version control and rotate any credential
    that has been exposed.
-   Protected pages should redirect unauthenticated users to sign in and
    provide clear feedback.

## ⚠️ Price Disclaimer

**সকল দাম সম্ভাব্য; বাজারের অবস্থা, স্থান ও সময় অনুযায়ী পরিবর্তিত হতে পারে।**
এই অ্যাপের দামকে বাজারের নিশ্চিত বা সরকারি মূল্য হিসেবে বিবেচনা করবেন না।

## License
See the [LICENSE](LICENSE.md)file.
