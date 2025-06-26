const { User } = require("../models/users");
const sendEmailConfirmation = require('../utils/sendEmail')


const register = async (req, res) => {
  const { username, email, password } = req.body;

  if(!username || !password || !email){
    return res.status(400).json({msg: 'Enter all the fields'})
  }

  const existingEmail = await User.findByEmail(email);
  if(existingEmail) {
     return res.status(400).json({msg: 'cant create acc with this mail'})
  }

   const existingUsername = await User.findByUser(username);
    if (existingUsername) {
      return res.status(400).json({
        msg: "User with this username already exist. Enter new username.",
      });
    };

    try {
      const newUser = await User.create({ username, password, email });
      if(!newUser){
        return res.status(404).json({msg: 'Database problem. Unable to create'})
      }


      await sendEmailConfirmation(newUser.email)

      return res.status(200).json({msg:'User created',
        user: {
          newUser
        }
      })


    }
    catch(error){

    }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter email and password" });
  }
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      res.status(400).json({ msg: "User is not registered in our system." });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = user.createJWT();

    res.status(200).json({
      msg: "Successful login",
      user: {
        username: user.username,
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("error while logging");
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { register, login };
