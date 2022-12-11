const { console } = require('../helpers')
const stripe = require('stripe')(process.env.STRIPE_SECRET);

class Stripe{
        constructor(){
                this.stripe = stripe;
        }

        async getPaymentDetails( paymentId ){
                return await stripe.paymentIntents.retrieve(paymentId);
        }


        /**
         * verify a payment by paymentId
         * @param {String} paymentId 
         * @returns {Boolean} 
         */
        async verifyPayment(paymentId) {
                try{
                        const paymentDetails = await this.getPaymentDetails(paymentId);
                        console({paymentDetails})
                        if(paymentDetails instanceof Error) return false;
                        else if(paymentDetails && paymentDetails.status === 'succeeded') {
                                let paid = false;
                                paymentDetails.charges.data.map(charge => {
                                        if(charge.paid) paid = true;
                                        else paid = false;
                                });
                                return paid;
                        }
                        else return false;
                }catch(err) {
                        console(err.message);
                        const error = new Error(err.message);
                        error.status = 400;
                        return error;
                }
        }
}


module.exports = new Stripe();