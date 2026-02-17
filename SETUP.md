# 🚀 Gaze Guide Setup Guide

## Features Implemented

### ✅ Completed Features:
1. **Authentication System** - Supabase Auth with email/password login
2. **History Panel** - View and manage your word lookup history
3. **PDF Upload** - Upload and read from PDF files
4. **URL Reader** - Load articles from any website URL
5. **Improved Eye Tracking** - Better calibration and smoother detection (2.5s dwell time)
6. **Database Integration** - PostgreSQL via Supabase for storing user data
7. **User-Specific Storage** - All lookups, documents, and sessions are tied to authenticated users

---

## 📋 Setup Instructions

### Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Create a new project:
   - Choose a project name: `gaze-guide` (or any name)
   - Set a strong database password (save it!)
   - Choose a region close to you
   - Wait 2-3 minutes for setup to complete

### Step 2: Set Up the Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create:
- `profiles` table (user profiles)
- `documents` table (PDFs and URLs)
- `reading_sessions` table (track reading sessions)
- `word_lookups` table (chat/definition history)
- `gaze_data` table (optional analytics)
- Row-level security policies
- Automatic profile creation trigger

### Step 3: Get Your Supabase Credentials

1. In Supabase dashboard, go to **Project Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 4: Configure Environment Variables

1. In your project root, create a `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Gemini API (for AI definitions)
GEMINI_API_KEY=your_existing_gemini_api_key
```

2. Replace the placeholder values with:
   - Your Supabase Project URL
   - Your Supabase anon key
   - Your existing Gemini API key

### Step 5: Enable Email Authentication in Supabase

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Make sure **Email** provider is enabled
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize signup confirmation email if desired

### Step 6: Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## 🎯 How to Use

### 1. **Sign Up / Login**
- Go to `http://localhost:3000`
- Click "Get Started"
- Create an account or login
- Verify your email if required

### 2. **Start Reading**
- Grant camera permission when prompted
- Complete the 9-point calibration by looking at each dot
- Click "Load Document" to upload a PDF or paste a URL
- Or read the default sample article

### 3. **Use Eye Tracking**
- Look at any word for 2.5 seconds
- A blue progress circle will appear
- AI definition will pop up automatically
- Close tooltip to continue reading

### 4. **View History**
- Click the "History" button in the top navigation
- See all your word lookups
- Delete individual items or clear all history
- History is saved to your account

### 5. **Controls**
- **Recalibrate** button (blue eye icon) - Restart calibration
- **Pause/Resume** button - Pause eye tracking temporarily
- **Kill Switch** button (red) - Stop tracking and clear all data

---

## 📊 Database Schema Overview

### Tables Created:

1. **profiles** - User profile information
   - Extends Supabase auth.users
   - Stores full_name, avatar_url, etc.

2. **documents** - Uploaded PDFs and URLs
   - Stores document content, type, and metadata
   - User-specific with RLS

3. **reading_sessions** - Track reading sessions
   - Duration, words looked up, timestamps
   - Links to documents

4. **word_lookups** - Chat/Definition history
   - Word, definition, context
   - Timestamps and user association

5. **gaze_data** - Optional analytics
   - For future heatmap visualization
   - Stores gaze coordinates and timestamps

---

## 🔧 Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Eye Tracking**: WebGazer.js with TFFacemesh
- **AI**: Google Gemini API
- **PDF Processing**: PDF.js
- **Web Scraping**: Cheerio

---

## 🎨 Improvements Made

### Eye Tracking Enhancements:
1. ✅ Reduced dwell time from 3s to 2.5s (more responsive)
2. ✅ Increased smoothing factor (0.7 instead of 0.6)
3. ✅ Enabled Kalman filter for smoother predictions
4. ✅ Changed prediction dot color to blue (less intrusive)
5. ✅ Improved visual feedback with progress indicator
6. ✅ Better word boundary detection with regex split

### User Experience:
1. ✅ Added authentication flow
2. ✅ History panel with delete functionality
3. ✅ Document uploader modal
4. ✅ Top navigation bar with quick access buttons
5. ✅ Loading states and error handling
6. ✅ Responsive design

---

## 🔒 Security & Privacy

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Camera feed processed locally (not sent to server)
- Kill switch to clear all eye tracking data
- Secure authentication with Supabase
- Environment variables for sensitive keys

---

## 🐛 Troubleshooting

### Camera not working?
- Check browser permissions (Settings → Privacy → Camera)
- Use HTTPS or localhost (WebRTC requirement)
- Try Chrome or Edge (best WebGazer support)

### Calibration not accurate?
- Ensure good lighting
- Center your face in the camera
- Sit at a consistent distance
- Use the recalibrate button to start over

### PDF upload failing?
- Ensure PDF is text-based (not scanned images)
- Check file size (large PDFs may timeout)
- Content is limited to 50,000 characters

### URL fetch not working?
- Some websites block scraping
- CORS restrictions may apply
- Try websites with accessible content

### Database errors?
- Verify environment variables are set correctly
- Check Supabase project status
- Ensure SQL schema was executed successfully

---

## 📝 Next Steps (Optional)

### Future Enhancements:
1. **OAuth Providers** - Add Google/GitHub login
2. **Heatmap Visualization** - Use gaze_data for visual analytics
3. **Reading Speed** - Calculate WPM (words per minute)
4. **Reading Goals** - Set and track daily reading goals
5. **Bookmarks** - Save interesting documents
6. **Shareable Reports** - Export reading statistics
7. **Mobile Support** - Responsive design for tablets
8. **Offline Mode** - PWA with service workers
9. **Multi-language** - Support for multiple languages
10. **Voice Definitions** - Text-to-speech for definitions

---

## 📧 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure Supabase schema is properly set up
4. Check that Gemini API key is valid

---

## 🎉 You're All Set!

Your Gaze Guide app is now fully configured with:
- ✅ Authentication system
- ✅ History tracking
- ✅ PDF & URL support
- ✅ Improved eye tracking
- ✅ Database storage

Enjoy your AI-powered reading experience! 👁️📚
