const nodemailer = require('nodemailer');
const receipt = require('receipt');
const config = require('../config');

receipt.config.currency = '₹';
receipt.config.width = 60;
receipt.config.ruler = '-';

createReceipt = (items) => {
    let total = 0;
    let products = [];

    items.forEach((item, i) => {
        if(item.dish) {
            total += item.price * item.quantity;
            products.push({ item: item.dish, qty: item.quantity, cost: item.price*100 })
        }
        if(item.drink) {
            total += item.price * item.quantity;
            products.push({ item: item.drink, qty: item.quantity, cost: item.price*100 })
        }
    });

    let GST = total * 0.18;
    let totalExcludingGST = total - GST;

    return receipt.create([
        { type: 'text', value: [
            'Restaurant',
            '123 Foodlane',
            'restaurant@example.com',
            'www.restaurant.com'
        ], align: 'center' },
        { type: 'empty' },
        { type: 'properties', lines: [
            { name: 'Order Number', value: '1' },
            { name: 'Date', value: new Date().toLocaleString() }
        ] },
        { type: 'table', lines: products },
        { type: 'empty' },
        { type: 'text', value: 'Some extra information to add to the footer of this docket.', align: 'center' },
        { type: 'empty' },
        { type: 'properties', lines: [
            { name: 'GST (18.00%)', value: `Rs. ${GST.toFixed(2)}` },
            { name: 'Total amount (excl. GST)', value: `Rs. ${totalExcludingGST.toFixed(2)}` },
            { name: 'Total amount (incl. GST)', value: `Rs. ${total.toFixed(2)}` }
        ] },
        { type: 'empty' },
        { type: 'text', value: 'Thank you for shopping at Foodlane!', align: 'center', padding: 5 }
    ]);
}

sendOrderDetails = (items, to) => {
    return new Promise(async (resolve, reject) => {
        if(!items) reject('Items must be defined!');

        let text = 'Thank you for your order! Here are the order details:\n';
        text += createReceipt(items);

        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <restaurant@example.com>', // sender address
            to, // list of receivers
            subject: "Order Details - Restaurant, Foodlane", // Subject line
            text, // plain text body
        });

        if(info.messageId) {
            resolve('Mail sent!');
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info)); 
        }
        else reject('Could not send mail');
        
    });
}

exports.sendOrderDetails = sendOrderDetails;