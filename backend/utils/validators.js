const Joi = require('joi');

const registerValidator = Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid('donor', 'ngo', 'admin'),
    phone: Joi.string().pattern(/^[0-9]{10}$/),
});

 const loginValidator = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required()
});

 const donationValidator = Joi.object({
    foodType: Joi.string().required().valid('cooked', 'packaged', 'raw'),
    quantity: Joi.number().required().min(1),
    quantityUnit: Joi.string().required().valid('kg', 'items', 'servings'),
    expiryTime: Joi.date().required().min('now'),
    pickupAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required().pattern(/^[0-9]{6}$/),
        coordinates: Joi.object({
            type: Joi.string().valid('Point'),
            coordinates: Joi.array().items(Joi.number()).length(2)
        })
    }).required(),
    preferredPickupTime: Joi.object({
        start: Joi.date().required(),
        end: Joi.date().required().greater(Joi.ref('start'))
    }).required(),
    description: Joi.string(),
    temperature: Joi.when('foodType', {
        is: 'cooked',
        then: Joi.number().required(),
        otherwise: Joi.number().optional()
    }),
    packagingNotes: Joi.string(),
    allergenInfo: Joi.array().items(
        Joi.string().valid(
            'dairy', 'eggs', 'fish', 'shellfish', 
            'nuts', 'peanuts', 'wheat', 'soy', 'none'
        )
    )
}); 
module.exports = { registerValidator, loginValidator, donationValidator };