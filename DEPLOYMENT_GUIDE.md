# Evolution API Edge Function Deployment Guide

## 🚨 **Current Issue: 500 Error from Edge Function**

The 500 error indicates that the Supabase Edge Function is not properly deployed or configured. Follow this guide to fix it.

## 📋 **Prerequisites**

1. **Supabase CLI installed**
2. **Access to your Supabase project**
3. **Evolution API server running at `http://134.199.202.47:8080`**

## 🔧 **Step 1: Install Supabase CLI**

```bash
# Windows (using npm)
npm install -g @supabase/cli

# Or using npx (recommended)
npx @supabase/cli --version
```

## 🔑 **Step 2: Login to Supabase**

```bash
npx supabase login
```

You'll need your Supabase access token. Get it from:
1. Go to https://supabase.com/dashboard/account/tokens
2. Generate a new access token
3. Copy and paste it when prompted

## 🌍 **Step 3: Configure Environment Variables**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** > **Edge Functions**
4. Add these environment variables:

```
EVOLUTION_API_URL=http://134.199.202.47:8080
EVOLUTION_API_TOKEN=nutribox-evolution-key-2024
```

## 🚀 **Step 4: Deploy Edge Function**

```bash
# Navigate to your project directory
cd C:\Users\Cleiton Machado\Desktop\nutribox-e032c970

# Deploy the Edge Function
npx supabase functions deploy evolution-api-proxy
```

## ✅ **Step 5: Verify Deployment**

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions**
3. Check if `evolution-api-proxy` is listed and active
4. Check the logs for any errors

## 🧪 **Step 6: Test the Connection**

1. Go to your app: http://localhost:8081
2. Navigate to **Conversas** page
3. Click **Debug** button
4. Click **Executar Debug**
5. Check the results

## 🔍 **Troubleshooting**

### **If you get "Access token not provided":**
```bash
# Set the access token as environment variable
set SUPABASE_ACCESS_TOKEN=your_access_token_here

# Then deploy
npx supabase functions deploy evolution-api-proxy
```

### **If you get "Project not found":**
```bash
# Link your project
npx supabase link --project-ref your_project_ref

# Get project ref from: https://supabase.com/dashboard/project/your_project_ref
```

### **If Edge Function still returns 500:**
1. Check the Edge Function logs in Supabase Dashboard
2. Verify environment variables are set correctly
3. Test the Evolution API server directly:
   ```bash
   curl http://134.199.202.47:8080/instance/fetchInstances
   ```

## 📊 **Expected Results**

After successful deployment, the debug tool should show:
- ✅ **Autenticação do Usuário**: Success
- ✅ **Geração do Nome da Instância**: Success  
- ✅ **Teste Básico da Edge Function**: Success
- ✅ **Verificação de Variáveis de Ambiente**: Success
- ✅ **Teste de Criação de Instância**: Success

## 🆘 **Alternative: Manual Deployment**

If CLI deployment fails, you can deploy manually:

1. Go to Supabase Dashboard > Edge Functions
2. Click **Create a new function**
3. Name it `evolution-api-proxy`
4. Copy the content from `supabase/functions/evolution-api-proxy/index.ts`
5. Set the environment variables
6. Deploy

## 📞 **Need Help?**

If you're still having issues:
1. Run the debug tool and share the results
2. Check the browser console for detailed error messages
3. Verify the Evolution API server is accessible
4. Contact support with the debug report 