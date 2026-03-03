# SafeNow - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

2. **Deploy:**

   ```bash
   cd frontend
   vercel
   ```

3. **Follow prompts:**
   - Login/Signup
   - Confirm project settings
   - Deploy!

4. **Your app is live!** 🎉

**Alternative:** Push to GitHub and connect at [vercel.com](https://vercel.com)

---

### Option 2: Netlify

1. **Build the project:**

   ```bash
   cd frontend
   npm run build
   ```

2. **Install Netlify CLI:**

   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --dir=dist
   ```

**Alternative:** Drag & drop the `dist` folder at [netlify.com/drop](https://app.netlify.com/drop)

---

### Option 3: GitHub Pages

1. **Install gh-pages:**

   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update vite.config.js:**

   ```javascript
   export default defineConfig({
     base: "/your-repo-name/",
     // ... rest of config
   });
   ```

3. **Add to package.json:**

   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

---

### Option 4: Firebase Hosting

1. **Install Firebase CLI:**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login and initialize:**

   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure firebase.json:**

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

---

### Option 5: Docker

1. **Create Dockerfile:**

   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=0 /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf:**

   ```nginx
   server {
     listen 80;
     location / {
       root /usr/share/nginx/html;
       index index.html;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. **Build and run:**
   ```bash
   docker build -t safenow .
   docker run -p 80:80 safenow
   ```

---

## 🔧 Environment Variables

Create `.env` file in frontend directory:

```env
# Google Maps (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here

# API Endpoints (When integrating backend)
VITE_API_URL=https://api.safenow.com
VITE_WS_URL=wss://ws.safenow.com
```

**Note:** Restart dev server after adding .env

---

## 📋 Pre-Deployment Checklist

- [ ] Test all features work
- [ ] Check mobile responsiveness
- [ ] Verify OTP flow
- [ ] Test admin and user roles
- [ ] Check SOS button functionality
- [ ] Verify location permissions
- [ ] Test map integration (if API key added)
- [ ] Review error boundaries
- [ ] Check loading states
- [ ] Test logout functionality
- [ ] Verify protected routes
- [ ] Build successfully (`npm run build`)
- [ ] No console errors
- [ ] SEO meta tags in place
- [ ] PWA manifest configured

---

## 🌐 Custom Domain Setup

### For Vercel:

1. Go to project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as shown

### For Netlify:

1. Go to Site settings > Domain management
2. Add custom domain
3. Configure DNS:

   ```
   Type: A
   Name: @
   Value: 75.2.60.5

   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

---

## 🔒 SSL/HTTPS

All recommended platforms (Vercel, Netlify, Firebase) provide **automatic SSL certificates** for free.

For custom hosting:

- Use [Let's Encrypt](https://letsencrypt.org/)
- Or Cloudflare SSL

---

## 🚨 Important for Production

### 1. Replace Mock APIs

Update `src/utils/mockApi.js` with real backend calls:

```javascript
// Before (Mock)
export const sendOTP = async (mobile) => {
  await delay(800);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return { success: true, otp };
};

// After (Real)
export const sendOTP = async (mobile) => {
  const response = await fetch(`${API_URL}/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile }),
  });
  return response.json();
};
```

### 2. Add Real WebSocket

Update `src/hooks/useWebSocket.js`:

```javascript
// Replace mock with real Socket.io connection
const socket = io(process.env.VITE_WS_URL, {
  auth: { token: user.token },
});
```

### 3. Add Google Maps API Key

In `src/components/MapView.jsx`:

```javascript
const GOOGLE_MAPS_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;
```

### 4. Configure CORS

Ensure your backend allows requests from your domain:

```javascript
// Backend example
app.use(
  cors({
    origin: "https://safenow.example.com",
  }),
);
```

---

## 📊 Performance Optimization

### 1. Enable Code Splitting

In components using React.lazy:

```javascript
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
```

### 2. Optimize Images

- Use WebP format
- Compress images
- Lazy load below fold

### 3. Enable Compression

Most platforms enable this by default. For custom hosting:

```nginx
# nginx.conf
gzip on;
gzip_types text/css application/javascript application/json;
```

---

## 🔍 SEO Optimization

Add to `index.html`:

```html
<!-- Structured Data -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SafeNow",
    "description": "Real-time emergency help platform",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Any"
  }
</script>
```

---

## 📱 PWA Configuration

### Enable Service Worker

In `src/main.jsx`:

```javascript
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((reg) => console.log("SW registered"))
    .catch((err) => console.log("SW error:", err));
}
```

---

## 🧪 Testing Before Deploy

```bash
# Build
npm run build

# Preview production build locally
npm run preview

# Test on different devices
npx ngrok http 4173
```

---

## 📈 Analytics Setup (Optional)

### Google Analytics

1. Add to `index.html`:

```html
<!-- Google Analytics -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

---

## 🛡️ Security Headers

Recommended headers (most platforms auto-configure):

```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self)
```

---

## 📞 Support & Monitoring

### Error Tracking

Consider adding:

- [Sentry](https://sentry.io/) for error tracking
- [LogRocket](https://logrocket.com/) for session replay

### Uptime Monitoring

- [UptimeRobot](https://uptimerobot.com/)
- [Pingdom](https://www.pingdom.com/)

---

## 🎉 You're Ready to Deploy!

Choose your platform and follow the steps above. The app is production-ready (with mock data) and will work immediately.

For any issues, check the browser console and verify:

1. All dependencies installed
2. Build completes successfully
3. No TypeScript/lint errors
4. Environment variables set correctly

---

**Good luck with your deployment! 🚀**

For questions, refer to:

- [README.md](README.md) - Full documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project overview
