const Cart = require('../models/Cart');
const Mailer = require('../models/Mailer');

validate = (item, email) => {
    if (!item || !email) throw new Error('Params must be defined!');
    if ((item.drink && item.type !== "drink") || (item.dish && item.type !== "dish"))
        throw new Error('Invalid object');
}

getItems = async (req, res) => {
    const email = req.user.email;

    let cart = await Cart.findOne({ email });
    console.log(cart);
    if (cart) {
        return res.send({ success: true, data: cart });
    }
    else 
        return res.send({ success: true, data: {} });
}

addItem = async (req, res) => {
    const email = req.user.email;
    const item = req.body.item;

    validate(item, email);

    item.quantity = 1;

    let cart = await Cart.findOne({ email });
    if (cart) {
        let itemExists = cart.items.filter(i => { 
            if (i.type === 'dish' && item.dish)
                return i.dish === item.dish;
            else if(i.type == 'drink' && item.drink)
                return i.drink === item.drink;
        });

        if (itemExists.length !== 0) throw new Error('Item already added!');
        else {
            let cart = await Cart.updateOne({ email }, { $push: { items: item }});
            if (cart) return res.send({ success: true, message: 'Item added' });
            else throw new Error('Could not add item!');
        }
    }
    else {
        cart = await Cart.findOneAndUpdate({ email }, { $push: { items: item }}, { new: true, upsert: true });
        if (cart) return res.send({ success: true, message: 'Item added' });
        else throw new Error('Could not add item!');
    }
}

editItem = async (req, res) => {
    const email = req.user.email;
    const item = req.body.item;

    validate(item, email);

    let cart = await Cart.findOne({ email, 'items.dish': item.dish });

    if(cart) {
        let result;
        if (item.dish) {
            let quantity = cart.items.filter(i => item.dish === i.dish)[0].quantity + 1;
            if (quantity > 0)
                result = await Cart.updateOne({ email, 'items.dish': item.dish }, { '$set': {
                    'items.$.quantity': quantity
                }});
            else
                result = await Cart.updateOne({ email }, { $pull: { 'items': { 'dish': item.dish }}});

        }
        else if (item.drink) {
            let quantity = cart.items.filter(i => item.drink === i.drink)[0].quantity + 1;
            if (quantity > 0)
                result = await Cart.updateOne({ email, 'items.drink': item.drink }, { '$set': {
                    'items.$.quantity': quantity
                }});
            else
                result = await Cart.updateOne({ email }, { $pull: { 'items': { 'dish': item.dish }}});
        }
        
        if (result.modifiedCount > 0) return res.send({ success: true, message: 'Item incremented' });
        else throw new Error('Could not find dish!');
    }
    else 
        throw new Error('Could not find dish!');
}

deleteItem = async (req, res) => {
    const email = req.user.email;
    const item = req.body.item;

    validate(item, email);

    let cart = await Cart.findOne({ email, 'items.dish': item.dish });

    if(cart) {
        let result;
        if (item.dish) {
            let quantity = cart.items.filter(i => item.dish === i.dish)[0].quantity - 1;
            if (quantity > 0)
                result = await Cart.updateOne({ email, 'items.dish': item.dish }, { '$set': {
                    'items.$.quantity': quantity
                }});
            else
                result = await Cart.updateOne({ email }, { $pull: { 'items': { 'dish': item.dish }}});

        }
        else if (item.drink) {
            let quantity = cart.items.filter(i => item.drink === i.drink)[0].quantity - 1;
            if (quantity > 0)
                result = await Cart.updateOne({ email, 'items.drink': item.drink }, { '$set': {
                    'items.$.quantity': quantity
                }});
            else
                result = await Cart.updateOne({ email }, { $pull: { 'items': { 'dish': item.dish }}});
        }

        if (result.modifiedCount > 0) return res.send({ success: true, message: 'Item decremented' });
        else throw new Error('Could not find dish!');
    }
    else 
        throw new Error('Could not find dish!');
}

deleteAllItems = async (req, res) => {
    const email = req.user.email;
    const item = req.body.item;

    validate(item, email);

    let cart = await Cart.findOne({ email });

    if(cart) {
        let result;
        if (item.dish)
            result = await Cart.updateOne({ email }, { $pull: { 'items': { 'dish': item.dish }}});
        else if (item.drink)
            result = await Cart.updateOne({ email }, { $pull: { 'items': { 'drink': item.drink }}});
        if (result.modifiedCount > 0) return res.send({ success: true, message: 'Item deleted' });
        else throw new Error('Could not find dish!');
    }
    else 
        throw new Error('No items in cart!');
}

order = async (req, res) => {
    const email = req.user.email;
    let cart = await Cart.findOne({ email });

    if(cart && cart.items.length > 0) {
        try {
            let result = await Mailer.sendOrderDetails(cart.items, email);
            if(result) {
                let emptyCart = await Cart.updateOne({ email }, {$set: { items: [] }});
                res.send({ success: true, message: 'Mail sent with order details' });
            } 
        }
        catch(err) {
            throw new Error(err);
        }
    }
    else
        throw new Error('No items in cart!');
}

exports.getItems = getItems;
exports.addItem = addItem;
exports.editItem = editItem;
exports.deleteItem = deleteItem;
exports.deleteAllItems = deleteAllItems;
exports.order = order;
