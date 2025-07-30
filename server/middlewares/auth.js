import jwt from 'jsonwebtoken'

// Middleware Function to decode jwt token to get clerkId  -> custimize session in clerk
const authUser = async (req,res,next) => {
    try {
        const {token} = req.headers

        if (!token) {
            return res.json({success:false, message:'Not Authorized Login Again'})
        }
        req.body = req.body || {};
        const token_decode = jwt.decode(token)
        req.body.clerkId = token_decode.clerkId
        next()

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}

export default authUser