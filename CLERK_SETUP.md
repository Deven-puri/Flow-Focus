# 🔐 Clerk Authentication Setup for Gaze Guide

## Quick Setup Steps:

### 1. Create a Clerk Account
1. Go to [https://clerk.com](https://clerk.com)
2. Click "Start building for free"
3. Sign up with email or GitHub

### 2. Create an Application
1. After login, click "Add application"
2. Choose a name: `Gaze Guide`
3. Select authentication methods:
   - ✅ Email
   - ✅ Google (recommended for easy login)
   - ✅ GitHub (optional)
4. Click "Create application"

### 3. Get Your API Keys
1. In your Clerk dashboard, go to **API Keys**
2. Copy these two values:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

### 4. Add Keys to .env.local
Open `/flow-focus/.env.local` and replace:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
```

### 5. Configure Clerk Settings (Optional but Recommended)
In your Clerk dashboard:
1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable/disable as preferred
3. Go to **Paths**
   - Sign-in URL: `/auth`
   - Sign-up URL: `/auth`
   - User button redirect: `/reader`

### 6. Restart Your Dev Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 🎯 Features Enabled:

- ✅ **Email/Password Authentication**
- ✅ **Google OAuth** (one-click login)
- ✅ **GitHub OAuth** (optional)
- ✅ **Guest Mode** - Try without account
- ✅ **Session Management** - Auto sign-in
- ✅ **User Profiles** - Profile pictures & names
- ✅ **History Saving** - Only for logged-in users

## 💡 Guest Mode vs Signed In:

### Guest Mode:
- ✅ Eye tracking works
- ✅ AI definitions work
- ❌ No history saving
- ❌ No PDF/URL upload
- ❌ Data not persistent

### Signed In:
- ✅ All features enabled
- ✅ History panel
- ✅ PDF & URL upload
- ✅ Data saved to your account
- ✅ Access from any device

## 🚀 How It Works:

1. **Homepage** → Click "Get Started"
2. **Auth Page** → Choose:
   - Sign In / Sign Up with email
   - Sign in with Google
   - **Continue as Guest** button
3. **Reader Page** → 
   - Guest badge shows if in guest mode
   - "Sign In" button to create account later
   - Full features if signed in

## 🔧 Why Clerk Instead of Supabase Auth?

- ✅ **Easier setup** - No database schema needed
- ✅ **Built-in UI components** - Pre-styled forms
- ✅ **OAuth ready** - Google/GitHub in 1 click
- ✅ **Better UX** - Modern, polished interface
- ✅ **Free tier** - 10,000 MAU (Monthly Active Users)
- ✅ **Session management** - Handled automatically

## 📊 Database Integration:

Clerk handles authentication, Supabase handles data storage:
- **Clerk** → User authentication & management
- **Supabase** → History, documents, sessions

Use `user.id` from Clerk to store data in Supabase tables.

## 🐛 Troubleshooting:

### "Invalid publishable key"
- Check that you copied the correct key from Clerk dashboard
- Make sure it starts with `pk_test_` or `pk_live_`
- Restart dev server after adding keys

### Guest mode not working
- Check that `/reader?guest=true` URL has the query parameter
- Middleware should allow public routes

### Sign in/up forms not showing
- Verify @clerk/nextjs is installed: `npm list @clerk/nextjs`
- Check browser console for errors
- Make sure ClerkProvider wraps your app in layout.tsx

## 📝 Free Tier Limits:

- **10,000 Monthly Active Users**
- **Unlimited API requests**
- **All authentication methods**
- **Email support**

Perfect for development and MVP!

---

**Need help?** Check [Clerk Documentation](https://clerk.com/docs)
