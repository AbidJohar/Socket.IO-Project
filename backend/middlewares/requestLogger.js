
const requestLogger = (req,__,next)=>{

  const timeStamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get("User-Agent");

  console.log(`[${timeStamp}] | ${method}  | ${url}  | ${userAgent}`);
  
 next();
}

export default requestLogger;