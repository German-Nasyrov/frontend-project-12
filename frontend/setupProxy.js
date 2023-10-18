import { createProxyMiddleware } from 'http-proxy-middleware';

const setupProxy = (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://secret-chat-project-backend.onrender.com',
      changeOrigin: true,
    }),
  );
};

export default setupProxy;
