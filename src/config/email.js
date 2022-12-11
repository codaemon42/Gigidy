const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');
const { console } = require("../helpers");

module.exports.sendEmail = (from=process.env.NODEMAILER_EMAIL, to, subject, body) => {

    const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        secure: process.env.NODEMAILER_SECURE, // true for 465, false for other ports
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        },
        from,
        tls: {
            rejectUnauthorized: false
        }
    });
      
    const mailOptions = {
        // from: process.env.NODEMAILER_EMAIL,
        from,
        to,
        subject,
        html: body,
        priority: 'high'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console(error, 'email error');
			
        } else {
            console(info, 'email info');
			
        }
    });


    
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const msg = {
    //     from: process.env.SENDGRID_FROM,
    //     to,
    //     subject,
    //     html: body
    // }

    // sgMail.send(msg);

}


module.exports.verificationTemplate = (username, code) => {
		const from= 'gigidy.com.au <support@gigidy.com.au>';
		const subject= 'Account Verification ';
		const body = `
				<p> Hello  ${username},</p>
	
				<p> verify your account for ${process.env.SITE_NAME || 'Gigidy'}</p>
	
				<p> Here is your Verification code: </p>
                ${code}

				<p> regards ${process.env.APP_URL}</p>
			`;
		return {from, subject, body};
}


module.exports.resetTemplate = (username, resetCode) => {
		const from= 'payme.com.au <test@payme.com.au>';
		const subject= 'Password reset CODE';
		const body = `
				<p> Hello  ${username},</p>
	
				<p> verify your account for ${process.env.SITE_NAME || 'Payme'}</p>
	
				<p> this is your reset code :  </p>
				<br/>
				<br/>
				<h3>${resetCode}</h3>
				<br/>
				<br/>
				<br/>

				<p> regards ${process.env.APP_URL}</p>
			`;
		return {from, subject, body};
}