const mongoose = require('../db/conn')
const { Schema } = mongoose

const Pet = mongoose.model(
    'Pet',
    new Schema ({
        name: { type: String, required: true },
        age: { type: Number, required: true },
        weight: { type: Number, required: true },
        color: { type: String, required: true },
        images: { type: Array, required: true },
        avaliable: {type: Boolean},
        user: Object,
        adopter: Object
    },
    { timestamps: true }, // dt_inc / dt_edt
    )
)
module.exports = Pet