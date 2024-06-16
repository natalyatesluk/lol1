import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true
        }, 
        remark: {
            type: String,
            required: false
        },
        post_office: {
            type: Number,
            required: true
        },
        cart: {
            type: Array,
            default: []
        },
        status: {
            type: String,
            enum: ['pending', 'shipped', 'completed', 'canceled'],
            default: 'pending'
        }
    }, 
    {
        timestamps: true
    }
)
const Order = mongoose.model('Order', orderSchema);

export default Order;