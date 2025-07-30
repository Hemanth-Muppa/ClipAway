import axios from 'axios';
import fs from 'fs';
import userModel from '../models/userModel.js';
import FormData from 'form-data';
import 'dotenv/config'


// controller fuction to remove bg from image
const removeBgImage = async (req, res) => {
    try {

        const {clerkId} = req.body;

        const user = await userModel.findOne({clerkId});

        if(!user) {
            return res.json({
                success: false,
                message: 'User Not Found'
            })
        }

        if(user.creditBalance === 0) {
            return res.json({
                success: false,
                message:'No Credit Balance',
                creditBalance:user.creditBalance
            })
        }

        // path of the file in the server disc storage
        const imagePath = req.file.path;
        // Reading the image file
        const imageFile = fs.createReadStream(imagePath);

        // form data must be multipart form-data for clipdrop-api
        const formData = new FormData();
        formData.append('image_file', imageFile);

        // api call should be post method

        const { data } = await axios.post('https://clipdrop-api.co/remove-background/v1', formData, {
            headers: {'x-api-key': process.env.CLIPDROP_API,},
            responseType: 'arraybuffer'
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64');

        const resultImage = `data:${req.file.mimetype};base64,${base64Image}`

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1});

        res.json({
            success: true,
            resultImage,
            creditBalance : user.creditBalance - 1,
            message: 'Background Removed'
        })
        
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        })
    }
}

export { removeBgImage };