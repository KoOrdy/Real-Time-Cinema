const { createClient } = require('@redis/client');
const redisClient = createClient({
  url: 'redis://127.0.0.1:6379',
});

redisClient.connect().then(() => {
  console.log('Connected to Redis');
}).catch((err) => {
  console.error('Error connecting to Redis:', err);
});

const getAsync = async (key) => {
  try {
    return await redisClient.get(key); 
  } catch (err) {
    console.error('Error getting value from Redis:', err);
  }
};

const setexAsync = async (key, seconds, value) => {
  try {
    await redisClient.setEx(key, seconds, value);
  } catch (err) {
    console.error('Error setting value in Redis:', err);
  }
};

module.exports = { redisClient, getAsync, setexAsync };
