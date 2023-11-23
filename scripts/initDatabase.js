const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as needed

require('dotenv').config();

const initialUsers = [
  {
    Name: 'Manimekalai',
    Mobile: '9876543210',
    email: 'manimekalai.eee123@gmail.com',
    password: 'mani@123',
    bio: "A food enthusiast",
    profileImage: "https://in.images.search.yahoo.com/images/view;_ylt=AwrKArWMe19lpLYoSGK9HAx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkA2VmMjI0NTZmNWU2OTliNjBkYjE0YmQxYTkyOTc0OTg3BGdwb3MDMTYEaXQDYmluZw--?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Dprofile%2Bimage%26type%3DE211IN826G0%26fr%3Dmcafee%26fr2%3Dpiv-web%26tab%3Dorganic%26ri%3D16&w=474&h=474&imgurl=www.goodmorninghdloveimages.com%2Fwp-content%2Fuploads%2F2020%2F04%2FWhatsapp-Profile-Photo-Images-5.jpg&rurl=https%3A%2F%2Fwww.goodmorninghdloveimages.com%2Fwhatsapp-profile-photo%2F&size=88.3KB&p=profile+image&oid=ef22456f5e699b60db14bd1a92974987&fr2=piv-web&fr=mcafee&tt=135%2B+The+Best+Whatsapp+Profile+Photo+Images+Free+Download+-+Good+Morning&b=0&ni=21&no=16&ts=&tab=organic&sigr=szXtup3eBWzK&sigb=ur4NnR3c219q&sigi=bHJHhCRqtevJ&sigt=KvQES6ixSz0a&.crumb=5xdOcpQHHKL&fr=mcafee&fr2=piv-web&type=E211IN826G0"
        
  },
  {
    Name: 'User1',
    Mobile: '9873216540',
    email: 'User1@gmail.com',
    password: 'User1@123',
"bio": "Passionate about cooking",
    "profileImage": "https://example.com/profile-images/jane.jpg"
   
  },
{
    "Name": "John Doe",
    "Mobile": 1234567890,
    "email": "john.doe@example.com",
    "password": "hashed_password_1",
    "bio": "A food enthusiast",
    "profileImage": "https://example.com/profile-images/john.jpg"
  },
{
    "Name": "Jane Smith",
    "Mobile": 9876541230,
    "email": "jane.smith@example.com",
    "password": "hashed_password_2",
    "bio": "Passionate about cooking",
    "profileImage": "https://example.com/profile-images/jane.jpg"
  }
];

// Function to hash passwords
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

// Hash passwords for initial users
const hashPasswordsForInitialUsers = async () => {
  for (const user of initialUsers) {
    if (user.password) {
      user.password = await hashPassword(user.password);
    }
  }
};

// Check if the URL environment variable is defined
if (!process.env.URL) {
  console.error("URL is not defined in your .env file.");
  process.exit(1); // Exit the script with an error code
}

mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to the database');

    // Hash passwords for initial users
    await hashPasswordsForInitialUsers();

    // Insert the initial users into the database
    return User.insertMany(initialUsers);
  })
  .then(() => {
    console.log('Initial users inserted.');
  })
  .catch((err) => {
    console.error('Error inserting initial users:', err);
  })
  .finally(() => {
    // Close the database connection when done
    mongoose.connection.close();
  });