import cors from 'cors';

const corsConfiguration = () => {
  return cors({
    origin: (origin, cb) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'https://yourcustomdomain.com'
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true); // Allow request
      } else {
        cb(new Error('Not allowed by CORS')); // Block request
      }
    },
    methods: ['POST', 'GET', 'DELETE', 'PUT'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies and authentication headers
    optionsSuccessStatus: 204 // For preflight requests
  });
};

export default corsConfiguration;
