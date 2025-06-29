import {rateLimit} from 'express-rate-limit'
const rateLimiter = (maxReq, time)=>{
return rateLimit({
    windowMs: time * 60 * 1000,
    limit: maxReq,
    message:"Too many request, please try again later",
    standardHeaders: true,
    legacyHeaders: false
 })
 
}


export default rateLimiter;