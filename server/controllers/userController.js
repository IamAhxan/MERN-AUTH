import userModel from '../models/userModel.js'

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.userId

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'user not found' })
        }
        res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,           // add if you need it
                isAccountVerified: user.isVerified
            }
        });
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// export const getUserData = async (req, res) => {
//     try {
//         console.log("req.userId:", req.userId);   // 👈 Check token decoding
//         const user = await userModel.findById(req.userId);
//         console.log("user from DB:", user);       // 👈 Check what DB returns

//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         res.json({
//             success: true,
//             userData: {
//                 name: user.name,
//                 email: user.email,
//                 isAccountVerified: user.isVerified
//             }
//         });
//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// };

