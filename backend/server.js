import express from 'express'
import corsConfiguration from './config/corsConfig.js';
import { Server } from 'socket.io';
import {createServer} from 'http';
import requestLogger from './middlewares/requestLogger.js';
import rateLimiter from './middlewares/rateLimiter.js';
const app = express();

app.use(corsConfiguration());
app.use(rateLimiter(2, 10)) // first parameter maximum rate limit, and second time in minutes
app.use(requestLogger);


const port = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods:['POST', 'GET'],
    credentials:true
  }
});

const users = new Map();

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Register user
  socket.on('register', (username) => {
    users.set(username, socket.id);
    io.emit('userList', Array.from(users.keys()));
  });

  // Private message
  socket.on('privateMessage', ({ to, message, from }) => {
    const receiverSocketId = users.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('privateMessage', {
        from,
        message,
        timestamp: new Date()
      });
    }
  });

  // Group message
  socket.on('groupMessage', ({ recipients, message, from }) => {
    recipients.forEach((recipient) => {
      const socketId = users.get(recipient);
      if (socketId) {
        io.to(socketId).emit('privateMessage', {
          from,
          message,
          timestamp: new Date(),
          isGroup: true
        });
      }
    });
  });

  socket.on('disconnect', () => {
    for (let [username, id] of users) {
      if (id === socket.id) {
        users.delete(username);
        io.emit('userList', Array.from(users.keys()));
        break;
      }
    }
  });
});




app.get('/get-data', (req,res)=>{
return res.json({
  message: "data is here"
})
})



server.listen(port, ()=>{
  console.log(`port is listening on ${port}`);
})
// app.get("/api/products", (req,res)=>{
//  const products =    [
//         {
//           "id": 1,
//           "name": "Wireless Headphones",
//           "description": "Noise-cancelling over-ear headphones with up to 30 hours of battery life.",
//           "price": 99.99,
//           "image": "https://example.com/images/wireless-headphones.jpg",
//           "category": "Electronics",
//           "stock": 50
//         },
//         {
//           "id": 2,
//           "name": "Smartwatch",
//           "description": "Waterproof smartwatch with heart rate monitor and GPS tracking.",
//           "price": 149.99,
//           "image": "https://example.com/images/smartwatch.jpg",
//           "category": "Wearables",
//           "stock": 30
//         },
//         {
//           "id": 3,
//           "name": "Bluetooth Speaker",
//           "description": "Portable Bluetooth speaker with deep bass and 12 hours of playtime.",
//           "price": 59.99,
//           "image": "https://example.com/images/bluetooth-speaker.jpg",
//           "category": "Electronics",
//           "stock": 100
//         },
//         {
//           "id": 4,
//           "name": "Gaming Mouse",
//           "description": "High-precision gaming mouse with customizable RGB lighting.",
//           "price": 39.99,
//           "image": "https://example.com/images/gaming-mouse.jpg",
//           "category": "Gaming",
//           "stock": 200
//         },
//         {
//           "id": 5,
//           "name": "4K Monitor",
//           "description": "27-inch 4K UHD monitor with HDR and FreeSync technology.",
//           "price": 299.99,
//           "image": "https://example.com/images/4k-monitor.jpg",
//           "category": "Computers",
//           "stock": 20
//         },
//         {
//           "id": 6,
//           "name": "Running Shoes",
//           "description": "Lightweight running shoes with breathable mesh and cushioned soles.",
//           "price": 79.99,
//           "image": "https://example.com/images/running-shoes.jpg",
//           "category": "Sportswear",
//           "stock": 75
//         },
//         {
//           "id": 7,
//           "name": "Smartphone",
//           "description": "Latest model smartphone with 128GB storage and a 48MP camera.",
//           "price": 699.99,
//           "image": "https://example.com/images/smartphone.jpg",
//           "category": "Mobile Phones",
//           "stock": 45
//         },
//         {
//           "id": 8,
//           "name": "Laptop Backpack",
//           "description": "Durable laptop backpack with multiple compartments and USB charging port.",
//           "price": 49.99,
//           "image": "https://example.com/images/laptop-backpack.jpg",
//           "category": "Accessories",
//           "stock": 60
//         },
//         {
//           "id": 9,
//           "name": "Electric Kettle",
//           "description": "1.7L electric kettle with fast boiling and auto shut-off feature.",
//           "price": 29.99,
//           "image": "https://example.com/images/electric-kettle.jpg",
//           "category": "Kitchen Appliances",
//           "stock": 80
//         },
//         {
//           "id": 10,
//           "name": "Fitness Tracker",
//           "description": "Slim fitness tracker with sleep monitoring and step counter.",
//           "price": 49.99,
//           "image": "https://example.com/images/fitness-tracker.jpg",
//           "category": "Wearables",
//           "stock": 90
//         }
//       ]
      
//      if(req.query.q){
//         const searchQuery = req.query.q.toLowerCase();
//         console.log(searchQuery)
//        const filterProducts =   products.filter(product=>{
//           return  product.name.toLowerCase().includes(searchQuery);
//          });
//          console.log(filterProducts);
//          res.send(filterProducts);
//          return;
//      }
    

//       setTimeout(() => {
//           res.send(products);
        
//       }, 3000);
// })