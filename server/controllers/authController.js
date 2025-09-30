import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from './../models/userModel.js'
import transporter from '../config/nodemailer.js'

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' })
    }

    try {
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "user Already Exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = new userModel({ name, email, password: hashedPassword })

        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true,        // true if using https
  sameSite: "None"     // important for cross-site cookies
});

        const mailOptions = {
            to: email,
            subject: "welcome to Ahsan's Auth website",
            text: `Welcome to Ahsan's Auth Website, your account has been created with email id : ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and Password are required" })
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.json({ success: false, message: 'invalid email' })
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.json({ success: false, message: 'invalid Password' })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true,        // true if using https
  sameSite: "None"     // important for cross-site cookies
});
    res.json({ success: true })
    try {
        const user = await userModel.findOne({ email })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}



export const logout = async (req, res) => {
    try {
res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true,        // true if using https
  sameSite: "None"     // important for cross-site cookies
});
        return res.json({ success: true, message: "logged Out" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.userId;

        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'user is already verified' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        user.verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save()

        const mailOptions = {
            to: user.email,
            subject: "Account verification OTP",
            text: `your otp for email ID: ${user.email} is ${otp} valid for 24 hours`
        }

        await transporter.sendMail(mailOptions)

        res.json({ success: true, message: 'Verification OTP sent to your email' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const verifyEmail = async (req, res) => {
    const { otp } = req.body;
    const {userId} = req.userId

    if (!userId || !otp) {
        return res.json({ success: false, message: 'missing Details' })
    }

    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'user not found' })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'OTP invalid' })
        }
        if (user.verifyOtpExpiredAt < Date.now()) {
            return res.json({ success: false, message: 'otp expired' })
        }
        user.isVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiredAt = 0;
        await user.save()

        return res.json({ success: true, message: 'email verified successfully' })


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const testMail = async (req, res) => {
    try {
        const mailOptions = {
            to: 'mohammadahsan7744@outlook.com',
            subject: "test mail",
            text: `test mail`
        }

        await transporter.sendMail(mailOptions)

        return res.json({ success: true })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'email is required' })
    }

    try {
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 15 + 60 * 1000;

        await user.save();

        const mailOptions = {
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your Password reset otp is : ${otp} valid for 15 minutes`
        }
        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'password reset OTP sent successfully' })



    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Missing Details" })
    }
    try {

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: 'User not Found' })
        }
        if (user.resetOtp = '' || otp !== user.resetOtp) {
            return res.json({ success: false, message: "Invalid OTP" })
        }
        if (user.resetOtpExpiredAt < Date.now()) {
            return res.json({ success: false, message: 'Your OTP is expired' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;
        user.save()

        return res.json({ success: true, message: 'Password changed successfully' })


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}