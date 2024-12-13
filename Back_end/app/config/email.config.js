require('dotenv').config(); 

module.exports = {
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER || 'yheiaelkordy@gmail.com', 
    pass: process.env.EMAIL_PASS || 'bluncskknznknnqq'         
  }
};