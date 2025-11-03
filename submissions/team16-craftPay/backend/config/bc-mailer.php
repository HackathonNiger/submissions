<?php
/*use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/vendor/phpmailer/src/Exception.php';
require_once __DIR__ . '/vendor/phpmailer/src/PHPMailer.php';
require_once __DIR__ . '/vendor/phpmailer/src/SMTP.php';*/

function customBCMailSender($from, $to, $subject, $message)
{
	$company_name = "Beewave Merchant";
	
	$company_email = "noreply@" . $_SERVER["HTTP_HOST"];

	// Always set content-type when sending HTML email
	$mail_headers = "MIME-Version: 1.0" . "\r\n";
	$mail_headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

	// More headers
	$mail_headers .= 'From: ' . $company_name . ' <noreply@' . $_SERVER["HTTP_HOST"] . '>' . "\r\n";
	$mail_headers .= 'Cc: ' . $from . "\r\n";
	//$mail_headers .= 'Subject: '.$email_subject."\r\n";
	$mail_headers .= "Reply-To: $company_email" . "\r\n"; // Set reply-to email
	$mail_headers .= "X-Mailer: PHP/" . phpversion(); // Set X-Mailer header

	$mail_html_body = mailDesignTemplate($subject, $message);
	/*$smtpMAIL = new PHPMailer(true);
			 try {
				 //Server settings
				 $fromm = "merchant@beewave.ng";
				 $smtpMAIL->isSMTP();
				 $smtpMAIL->Host = 'mail.beewave.ng';
				 $smtpMAIL->SMTPAuth = true;
				 $smtpMAIL->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
				 $smtpMAIL->Port = 587;
				 
				 $smtpMAIL->Username = 'merchant@beewave.ng';  //YOUR gmail email
				 $smtpMAIL->Password = 'Beewave@2408#'; // YOUR gmail password
				 
				 //Sender and recipient settings
				 $smtpMAIL->setFrom($fromm, $from);
				 $smtpMAIL->addAddress($to, $to);
				 $smtpMAIL->addReplyTo($fromm, $fromm);  //to set the reply to
				 
				 //Setting the email content
				 $smtpMAIL->IsHTML(true);
				 $smtpMAIL->Subject = $subject;
				 $smtpMAIL->Body = $mail_html_body;
				 $smtpMAIL->AltBody = $mail_html_body;
				 $smtpMAIL->send();
			 } catch (Exception $e) {
				 echo $e->getMessage();
				 
			 }*/
	//Mail Test
	// fwrite(fopen("./mail-test.html", "a++"), $to." ".$subject." ".$mail_html_body);
	// Inbuilt Mail Functions
	mail($to, $subject, $mail_html_body, $mail_headers);

}

?>