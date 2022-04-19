const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const validators = require('../validators/userValidator.js');


// @desc Register User
// @route POST /api/users
// @access Public
exports.registerUser = async (req, res) => {
	const { email, password} = req.body;
	if ( !email || !password) {
		res.status(400).json({ message: 'Please add all fields'});
	}

  //Validate email format
  if (!validators.emailValidator(email)) {
		res.status(400).json({ message: 'Please provide a valid email'});
  }
	
	//check user exists
  try {
    const userExists = await User.findOne({ where: { email: email }})
    if (userExists) {
      res.status(400).json({ message: 'User already exists'});
    }
  } catch (error) {
    res.status(500).json({ message: `Problem finding user: ${error}`})
  }

	
    
	//hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);


	//create user
	  try {
    const USER_MODEL = {
      email: req.body.email,
      password: hashedPassword,
    };

    try {
      const user = await User.create(USER_MODEL);
      if (user) {
        res.status(201).json({
          message: "User Created",
          _id: user.id,
          email: user.email,
        });
      }
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }

  } catch (error) {
    return res.status(500).json(error);
  }

}

// @desc Authenticate User
// @route POST /api/users/login
// @access Public
exports.loginUser = async (req, res) => {
	const {email, password} = req.body;

  if ( !email || !password) {
		res.status(400).json({ message: 'Please add all fields'});
	}
	
  //find the user
  try {
    const user = await User.findOne( { where: { email: email } });

    //check for existing auth token
    if (user.token) {
      res.status(400).json({message: 'You are already logged in!'});
    } 

     //if user is valid and password is correct
	  if (user && (await bcrypt.compare(password, user.password))) {

      //generate login token
      const loginToken = generateToken(user.id);

      //update user's auth token in db and return updated user
      try {
        const updatedUser = await User.update({ token: loginToken }, { where: { email: user.email } })
        const loggedInUser = await User.findOne( { where: { email: email } });

        res.status(200).json({ message: 'Successfully logged in', user: loggedInUser})

      } catch (error) {
        return res.status(500).json(error)
      }
	  } else {
		  res.status(400).json({ message: 'Invalid credentials'});
	  }

  } catch (error) {
    res.status(500).json({ message: `Problem finding user: ${error}`})
  }
};

// @desc Logout User
// @route POST /api/users/logout
// @access Public
exports.logoutUser = async (req, res) => {
	const {email} = req.body;
  
  if ( !email ) {
		res.status(400).json({ message: 'Please provide an email'});
	}

  //find the user
  try {
     const user = await User.findOne(
       { where: { email: email } }
     );

     //check for existing token
    if (!user.token) {
      res.status(400).json({message: 'You are not logged in!'})
    }


  //remove the user's auth token and return the updated user
    if (user) { 
        
      try {
      
        const updatedUser = await User.update({ token: null} ,{ where: { email: user.email } })
        const loggedOutUser = await User.findOne( { where: { email: email } });
        return res.status(200).json({ message: "Logged out", user: loggedOutUser})

      } catch (error) {
        return res.status(500).json(error)
      }

    } else {
      res.status(400).json({message: 'Invalid user credentials!'})
    }
  } catch (error) {
      res.status(500).json({ message: 'Problem finding user'})
  }
};

//Generate json web token
const generateToken = (id ) => {
	return jwt.sign({
		id
	}, process.env.JWT_SECRET, {
		expiresIn: '1h'
	});
};