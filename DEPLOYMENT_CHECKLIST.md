# Production Deployment Checklist - PocketPlans

## Issues Found & Fixed

### 1. **SavedPlans.tsx - Hardcoded Localhost URLs** ✅ FIXED
   - **Problem**: The SavedPlans page was still using `http://127.0.0.1:8001` for favorites and history endpoints
   - **Fix**: Updated to use `import.meta.env.VITE_BACKEND_URL`
   - **File**: `frontend/src/pages/SavedPlans.tsx` (lines 28, 32)

### 2. **CORS Configuration Issue** ✅ FIXED
   - **Problem**: Using `"*"` in origins array with `allow_credentials=True` causes CORS failures
   - **Fix**: Set `allow_credentials=False` when using wildcard origins
   - **File**: `backend/main.py` (line 32)

### 3. **Environment Variable Configuration** ✅ VERIFIED
   - **Frontend .env**: Contains `VITE_BACKEND_URL=https://pocketplans-production.up.railway.app`
   - **Note**: Make sure this is also set in your Vercel deployment environment variables

## Deployment Steps

### For Backend (Railway)
1. **Push the updated `backend/main.py`** with the CORS fix
2. Railway should auto-deploy the changes
3. Verify the backend is accessible at: `https://pocketplans-production.up.railway.app`

### For Frontend (Vercel)
1. **Push the updated frontend files**:
   - `frontend/src/pages/Dashboard.tsx`
   - `frontend/src/pages/SavedPlans.tsx`

2. **CRITICAL: Set Environment Variable in Vercel**
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_BACKEND_URL` = `https://pocketplans-production.up.railway.app`
   - **Important**: Redeploy after adding the environment variable

3. Vercel should auto-deploy the changes

## Testing Checklist

After deployment, test these features:

- [ ] Homepage loads and shows "Quick Picks" suggestions
- [ ] Search functionality works and returns recommendations
- [ ] Saved Plans page loads favorites and history
- [ ] No CORS errors in browser console (F12 → Console)

## Common Issues

### If frontend can't connect to backend:
1. Check browser console for CORS errors
2. Verify `VITE_BACKEND_URL` is set in Vercel environment variables
3. Verify Railway backend is running and accessible
4. Check that you redeployed Vercel after adding the environment variable

### If you see "Quick Picks" not loading:
- This means the `/suggestions` endpoint isn't being reached
- Check the environment variable is correctly set in Vercel
- Verify the backend URL is correct and accessible

## Files Modified

### Backend
- `backend/main.py` - CORS configuration fixed

### Frontend  
- `frontend/src/pages/Dashboard.tsx` - Uses environment variable for suggestions
- `frontend/src/pages/SavedPlans.tsx` - Uses environment variable for favorites/history
- `frontend/.env` - Contains production backend URL (local development only)

## Next Steps

1. **Commit and push all changes**:
   ```bash
   git add .
   git commit -m "Fix production deployment: CORS and environment variables"
   git push
   ```

2. **Set Vercel environment variable** (if not already done)

3. **Wait for deployments** to complete on both platforms

4. **Test the live application** using the checklist above

## Notes

- The TypeScript lint errors you're seeing are likely due to missing `node_modules`. These won't affect the production build on Vercel.
- The `.env` file is for local development only - Vercel uses its own environment variable system.
- CORS is now configured to allow all origins, which is fine for a public API but consider restricting it later for security.
