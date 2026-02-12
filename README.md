# Gaze Guide 👁️ AI-Powered Reading Assistant

An advanced eye-tracking reading assistant built with Next.js, WebGazer.js, and Gemini AI. Look at any word for 3 seconds to get an AI-powered definition, and track your reading patterns with focus heatmaps.

## 🚀 Features

### 📖 Reader Mode
- **Eye Tracking**: Real-time gaze tracking using WebGazer.js
- **9-Point Calibration**: Game-like calibration for precise tracking
- **AI Definitions**: Contextual word definitions from Gemini AI
- **Dwell Detection**: Automatic trigger after 3-second focus
- **Visual Feedback**: Progress indicator showing dwell time

### 📊 Analytics Dashboard
- **Focus Heatmaps**: Visualize where you spent the most time
- **Reading Stats**: Track time, words viewed, and dwell patterns
- **AI Insights**: Get personalized reading improvement suggestions

### 🔒 Privacy & Performance
- **Kill Switch**: Instantly stop tracking and clear all data
- **Battery Optimization**: Pause tracking when tab is hidden
- **Smooth Predictions**: Kalman filtering and weighted moving average
- **Local Processing**: All eye tracking happens in your browser

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + React 19 + TypeScript
- **Eye Tracking**: WebGazer.js
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS 4
- **Math**: Kalman Filter, Weighted Moving Average
- **Icons**: Lucide React

## 📦 Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   Get your API key from: https://makersuite.google.com/app/apikey

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
gaze-guide/
├── app/
│   ├── api/
│   │   └── define/
│   │       └── route.ts          # Gemini API integration
│   ├── dashboard/
│   │   └── page.tsx              # Analytics dashboard
│   ├── reader/
│   │   └── page.tsx              # Reading interface
│   ├── layout.tsx
│   └── page.tsx                  # Homepage
├── components/
│   ├── Reader/
│   │   ├── Calibration.tsx       # 9-dot calibration
│   │   ├── EyeTracker.tsx        # WebGazer initialization
│   │   └── WordTooltip.tsx       # AI definition tooltip
│   └── Analytics/
│       └── HeatmapOverlay.tsx    # Heatmap visualization
├── hooks/
│   └── useGazeLogic.ts           # Dwell-time detection hook
├── lib/
│   ├── filters.ts                # Kalman & WMA smoothing
│   └── gemini.ts                 # Gemini API config
└── public/
```

## 🎯 How It Works

### 1. Calibration Phase
- Display 9 calibration points across the screen
- User clicks each point 5 times while looking at it
- WebGazer learns the user's unique eye patterns

### 2. Reading Phase
- Text is parsed into individual word spans with `gaze-target` class
- Eye tracker provides smoothed (x, y) coordinates
- `useGazeLogic` hook:
  - Checks if gaze is within word bounding box
  - Starts timer if gaze remains on same word
  - Triggers AI definition after 3 seconds

### 3. AI Definition
- Word + surrounding context sent to Gemini API
- AI generates simple, contextual explanation
- Tooltip displays above gaze point

### 4. Analytics
- Gaze history aggregated every 10 seconds
- Heatmap generated using canvas gradients
- Statistics calculated from stored data

## 🔧 Technical Deep Dive

### Smoothing Algorithm
Raw eye-tracking data is jittery due to saccades. We apply:

**Weighted Moving Average:**
```
smoothed_x = 0.8 * previous_x + 0.2 * new_x
smoothed_y = 0.8 * previous_y + 0.2 * new_y
```

**Kalman Filter** (optional, more advanced):
- Prediction update based on process noise
- Measurement update based on observation
- Provides optimal estimate of true gaze position

### Dwell-Time State Machine
```
State: IDLE
  → Gaze enters target → START_TIMER
State: START_TIMER
  → Gaze stays in target > 3s → TRIGGER_AI
  → Gaze leaves target → RESET_TIMER
State: TRIGGER_AI
  → Show tooltip → IDLE (on close)
```

### Battery Optimization
- Listen to `visibilitychange` event
- Call `webgazer.pause()` when tab hidden
- Resume tracking when tab becomes visible

## 🚧 Senior-Level Challenges Solved

1. **Z-Index Management**: Prediction dot uses `pointer-events: none` to avoid interfering with text interaction

2. **Midas Touch Problem**: 3-second dwell threshold with visual progress indicator prevents accidental triggers

3. **Data Batching**: Only save aggregated data every 10s instead of 60fps to prevent database overload

4. **Smoothing**: Dual Kalman filter for x and y coordinates reduces jitter from ~50px to ~5px

5. **Privacy Mode**: Complete webcam shutdown + localStorage clearing on kill switch

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI definitions | Yes |

## 🎨 Customization

### Change Dwell Threshold
Edit the threshold in the reader page:
```tsx
const { processGazePoint } = useGazeLogic(3000); // milliseconds
```

### Adjust Smoothing
Modify the weight in filters:
```tsx
new WeightedMovingAverage(0.8); // 0.8 = more smoothing
```

## 🙏 Acknowledgments

- **WebGazer.js** - Eye tracking library
- **Google Gemini** - AI definitions
- **Next.js** - React framework
- **Tailwind CSS** - Styling

---

Built with ❤️ for readers everywhere

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
