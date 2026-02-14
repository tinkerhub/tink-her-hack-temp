# Deploy to Vercel

Click the button below to deploy the frontend to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/SHE_WANTS)

## After Deployment

1. Your frontend will be live at: `https://your-project.vercel.app`
2. Deploy the backend to Render following [DEPLOY_NOW.md](DEPLOY_NOW.md)
3. Update the `VITE_API_URL` environment variable in Vercel with your Render backend URL

## Environment Variables

Add these in Vercel:
- `VITE_API_URL`: Your Render backend URL (e.g., `https://she-wants-backend.onrender.com`)
