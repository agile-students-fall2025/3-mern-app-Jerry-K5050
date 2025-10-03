const mongoose = require("mongoose")
const Schema = mongoose.Schema

const AboutUsSchema = new Schema({ 
    bio: { 
        type: String,
        required: true, 
    },
    photo: { 
        type: String,
        required: true
    } 
},
{
    timestamps: true,
    collection: 'about_us',
})
const AboutUs = mongoose.model("AboutUs", AboutUsSchema)
module.exports = { AboutUs, }