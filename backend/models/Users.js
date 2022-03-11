const mongoose = require('../db/conn')
const { Schema } = mongoose

const User = mongoose.model(
    'User',
    new Schema ({
        name: { type: String, required: true },
        email: { type: String, required: true },
        Image: { type: String },
        phone: { type: String, required: true },
    },
    { timestamps: true }, // dt_inc / dt_edt
    )
)
module.exports = User