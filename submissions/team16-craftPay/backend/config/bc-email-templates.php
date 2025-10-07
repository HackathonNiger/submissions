<?php
function getEmailNotification($notification_type)
{
	//User Registration
	if ($notification_type == "user-reg") {
		$notification_array = array(
			"subject" => "Welcome to Our Platform",
			"body" => "Dear {fullname},\n\nThank you for registering with us. We are excited to have you on board!\n\nPlease find below the details you provided during registration:\n\n- Email address: {email}\n- Phone number: {phone}\n- Username: {username}\n- Home address: {address}\n\nIf you have any questions or need assistance, feel free to contact us.\n\nBest regards,\nThe Support Team"
		);
	}

	//User Login
	if ($notification_type == "user-log") {
		$notification_array = array(
			"subject" => "User Login Notification",
			"body" => "Hello {fullname},\n\nYour login details are as follows:\nUsername: {username}\nIP Address: {ip_address}\n\nThank you,\nThe Support Team"
		);
	}

	//Admin Registration
	if ($notification_type == "admin-reg") {
		$notification_array = array(
			"subject" => "Welcome Admin",
			"body" => "Dear {fullname},\n\nYour admin dasboard is ready. \n\nPlease find below the details you provided during registration:\n\n- Email address: {email}\n- Phone number: {phone}\n- Contact Email: {contact_email}\n- Home address: {address}.\n\nBest regards,\nAdministrator"
		);
	}

	//Admin Login
	if ($notification_type == "admin-log") {
		$notification_array = array(
			"subject" => "Admin Login Notification",
			"body" => "Hello {fullname},\n\nYour login details are as follows:\nEmail: {email}\nIP Address: {ip_address}\n\nThank you,\nThe Support Team"
		);
	}

	//Admin Registration
	if ($notification_type == "admin-account-update") {
		$notification_array = array(
			"subject" => "Admin Account Infomation Update",
			"body" => "Dear {fullname},\n\nYour account infomation has been successfully updated. \n\nDetails:\n\n- Email address: {email}\n- Phone number: {phone}\n- Contact Email: {contact_email}\n- Home address: {address}.\n\nBest regards,\nAdministrator"
		);
	}

	//User Password Update
	if ($notification_type == "user-pass-update") {
		$notification_array = array(
			"subject" => "Password Update Notification",
			"body" => "Dear {fullname},\n\nYour password has been successfully updated.\n\nIf you did not make this change, please contact our support team immediately.\n\nBest regards,\nThe Support Team"
		);
	}

	//User Account Update
	if ($notification_type == "user-account-update") {
		$notification_array = array(
			"subject" => "Account Information Updated",
			"body" => "Dear {fullname},\n\nYour account information has been successfully updated.\n\nDetails:\nEmail: {email}\nPhone: {phone}\nAddress: {address}\n\nThank you for keeping your information up to date.\n\nSincerely,\nThe Support Team"
		);
	}

	//User Registration Auth
	if ($notification_type == "user-reg-auth") {
		$notification_array = array(
			"subject" => "Complete your registration",
			"body" => "Hello {fullname} ({username}),\n\nWe received your request to register account on our platform.\n\nYour registration confirmation code is: {reg_code}\n\nPlease do not share this code with anyone.\n\nBest regards,\nThe Support Team"
		);
	}

	//User Account Recovery
	if ($notification_type == "user-account-recovery") {
		$notification_array = array(
			"subject" => "Password Recovery",
			"body" => "Hello {fullname},\n\nWe received a request to recover your account password.\n\nYour recovery code is: {recovery_code}\n\nPlease use this code to reset your password.\n\nBest regards,\nThe Support Team"
		);
	}

	//User Account Status
	if ($notification_type == "user-account-status") {
		$notification_array = array(
			"subject" => "User Account Status Update",
			"body" => "Hello {fullname},\n\nWe are writing to inform you about your account status.\n\nYour account is currently {account_status}.\n\nThank you.\n\nSincerely,\nThe Management"
		);
	}

	//User API Status
	if ($notification_type == "user-api-status") {
		$notification_array = array(
			"subject" => "User API Status Update",
			"body" => "Hello {fullname}, \n\nWe wanted to inform you about the current status of your API:\n\n{api_status}\n\nBest regards,\nThe API Team"
		);
	}

	//User 
	if ($notification_type == "user-upgrade") {
		$notification_array = array(
			"subject" => "Upgrade Notification",
			"body" => "Hello {fullname},\n\nWe are pleased to inform you that your account has been upgraded to {account_level}. Thank you for choosing our service.\n\nBest regards,\nThe Team"
		);
	}

	//User Referral Commission
	if ($notification_type == "user-referral-commission") {
		$notification_array = array(
			"subject" => "Referral Commission Earned",
			"body" => "Hello {fullname},\n\nWe are pleased to inform you that you have earned a referral commission of {referral_commission}.\n\nThe commission was earned from your referral, {referree}, who is currently at {account_level} account level.\n\nThank you for your participation in our referral program!\n\nBest regards,\nThe Support Team"
		);
	}

	//User Transaction (Admin)
	if ($notification_type == "user-transactions") {
		$notification_array = array(
			"subject" => "User Transaction Update",
			"body" => "Hello {admin_fullname}\n\nA transaction has been made by user {username}, {fullname}.\n\nPrevious balance: {balance_before}\nNew balance: {balance_after}\n\nAmount: {amount}\nDescription: {description}\nType: {type}"
		);
	}

	//User Credit/Debit Transaction
	if ($notification_type == "user-funding") {
		$notification_array = array(
			"subject" => "Transaction Update",
			"body" => "Hello {fullname},\n\nYour account has been updated with the following transaction details:\n\n- Balance Before: {balance_before}\n- Balance After: {balance_after}\n- Amount: {amount}\n- Description: {description}\n- Type: {type}\n\nIf you have any questions or concerns, feel free to reach out to us.\n\nBest regards,\nThe Support Team"
		);
	}

	//User Refund
	if ($notification_type == "user-refund") {
		$notification_array = array(
			"subject" => "Refund Notification",
			"body" => "Dear {fullname},\n\nWe are pleased to inform you that a refund has been processed for you.\n\nAmount: {amount}\nDescription: {description}\n\nIf you have any questions or concerns, feel free to reach out to our customer support team.\n\nBest regards,\nThe Support Team"
		);
	}

	//Merchant Withdrawal OTP
	if ($notification_type == "merchant-withdrawal-otp") {
		$notification_array = array(
			"subject" => "Your Withdrawal OTP Request",
			"body" => "Dear {fullname},\n\nWe have received a request to process a withdrawal from your account.\n\nYour One-Time Password (OTP) for this withdrawal is: {withdrawal_otp}\n\nPlease enter this OTP to complete your withdrawal request. If you did not request this, please contact support immediately.\n\nBest regards,\nThe Support Team"
		);
	}

	if ($notification_type == "merchant-withdrawal-placed") {
		$notification_array = array(
			"subject" => "Withdrawal Request Successfully Placed",
			"body" => "Dear {fullname},\n\nWe have successfully received and processed your withdrawal request.\n\nDetails of your withdrawal are as follows:\n\nWithdrawal Amount: {withdrawal_amount}\nAccount Name: {account_name}\nAccount Number: {account_number}\nBank Name: {bank_name}\n\nYour request will be reviewed and processed shortly. You will be notified once your withdrawal is complete. If you have any questions, feel free to contact our support team.\n\nBest regards,\nThe Support Team"
		);
	}	

	if (!isset($notification_array)) {
		$notification_array = array("subject" => "", "body" => "");
	}

	return json_encode($notification_array, true);
}

?>