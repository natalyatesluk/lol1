import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";


export const userRegister = async (req, res) => {
    try {
        const {userRegName, userRegEmail, userRegPassword} = req.body;
        
        
        const user = await User.exists({ email: userRegEmail})
        
        if (user) return res.json({msg: "This email is already in use"})

        
        const passwordHash = await bcrypt.hash(userRegPassword, 10);
        
        
        const newUser = new User ({
            name: userRegName,
            email: userRegEmail,
            password: passwordHash
        });
        
      
        await newUser.save()
        
        .then(savedUser => {
            
            const resUser = {
                _id: savedUser._id,
                name: savedUser.name,
                // email: savedUser.email,
                isAdmin: savedUser.isAdmin,
                cart: savedUser.cart
            }
            
            const accesstoken = createAccessToken({_id: newUser._id});
            const refreshtoken = createRefreshToken({_id: newUser._id});
            
            res.cookie('accessToken', accesstoken, { httpOnly: true, secure: true, sameSite: 'none' });
            res.cookie('refreshToken', refreshtoken, { httpOnly: true, secure: true, sameSite: 'none' });
            
            res.status(200).json(resUser); ;
            
            
          })
          .catch(error => {
            console.log(error);
            res.status(401).json({ message: 'Помилка реєстрації' });
          });

    } catch (error) {
        console.error(error);
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
          
        if (!refreshToken)  return res.status(401).json({ msg: "Помилка оновлення токена. Refreshtoken відсутній" });
  
        new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                        if (err) { reject(err);} else {resolve(decoded);}
                    });
            })
            .then(decoded => {
            
            const userId = decoded._id;
            
           
            const accessToken = jwt.sign({ _id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    
            
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'none' });
            res.status(200).json({ msg: 'Token updated successful' });
            
            })
            .catch(err => {
                res.status(401).json({ message: 'Invalid access token' });
            });
        
     
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        

    } catch (error) {
        console.error('Помилка перевірки або оновлення токена:', error);
        res.status(401).json({ msg: 'Недійсний оновлювальний токен' });
    }
}

export const userLogout = async (req, res) => {
    try {
      
        res.clearCookie('accessToken', {sameSite: "none", secure: true});
        res.clearCookie('refreshToken', {sameSite: "none", secure: true});
        res.status(200).json({ msg: 'Logout completed' });
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

export const userLogin = async (req, res) => {
    try {
        
        const { userLoginEmail, userLoginPassword } = req.body;

        
        User.findOne({email: userLoginEmail})
            .then(user => {
                if(!user) return res.status(400).json({emailMsg: "User doesn't exist"})
        
            
            bcrypt.compare(userLoginPassword, user.password)
                .then(match => {
                    if (match) {
                        
                        const logedUser = {
                            _id: user._id,
                            name: user.name,
                            // email: user.email,
                            isAdmin: user. isAdmin,
                            cart: user.cart
                        }
                        
                        const accesstoken = createAccessToken({_id: user._id});
                        const refreshtoken = createRefreshToken({_id: user._id});
                       
                        res.cookie('accessToken', accesstoken, { httpOnly: true, secure: true, sameSite: 'none' });
                        res.cookie('refreshToken', refreshtoken, { httpOnly: true, secure: true, sameSite: 'none' });
                        
                       
                        res.status(200).json(logedUser); 
                    } else {
                        res.status(400).json({pwdMsg: "The password is incorrect"})
                    }
                })
                .catch(err => {
                    res.status(500).json({ message: 'Password decryption error' });
                  });
        })

    } catch (error) {
        return res.status(500).json({msg: err.message})
    }
}

export const cartUpdate = async (req, res) => {
    try {
        await User.findByIdAndUpdate (req.body._id, {cart: req.body.cart}, { new: true })
        .then (updatedUser => {
            res.status(200).json({user: updatedUser});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error})
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}