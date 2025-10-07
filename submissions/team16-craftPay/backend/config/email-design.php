<?php
function mailDesignTemplate($title, $message)
{
    global $connection_server, $web_http_host;
    if (!empty(trim(strip_tags($title)))) {
        $mail_title = trim(strip_tags($title));
    } else {
        $mail_title = "No Title";
    }

    $mail_message = str_replace("\n", "<br/>", trim($message));

    $website_logo_url = $web_http_host . "/uploaded-image/logo.png";

    $select_admin_mail_stmt = "SELECT * FROM bc_admin LIMIT 1";
    $select_admin_mail_prepared_stmt = mysqli_prepare($connection_server, $select_admin_mail_stmt);
    mysqli_stmt_execute($select_admin_mail_prepared_stmt);
    $select_admin_mail_stmt_result = mysqli_stmt_get_result($select_admin_mail_prepared_stmt);
    if (mysqli_num_rows($select_admin_mail_stmt_result) == 1) {
        $admin_mail_logged_details = mysqli_fetch_assoc($select_admin_mail_stmt_result);
    }

    return
        '<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border: 1px solid #e0e0e0;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #003158;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                }
                .header img {
                    max-width: 150px;
                    margin-bottom: 10px;
                }
                .content {
                    padding: 20px;
                    line-height: 1.6;
                    color: #333333;
                }
                .content h1 {
                    color: #003158;
                }
                .cta {
                    text-align: center;
                    margin: 20px 0;
                }
                .cta a {
                    background-color: #003158;
                    color: #ffffff;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                }
                .footer {
                    background-color: #f4f4f4;
                    color: #888888;
                    padding: 10px;
                    text-align: center;
                    font-size: 12px;
                }
                .social-icons img {
                    width: 24px;
                    margin: 0 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="' . $website_logo_url . '" alt="Company Logo">
                    <h1>' . $mail_title . '</h1>
                </div>
                <div class="content">
                    ' . $mail_message . '
                </div>
                <div class="footer">
                    <p>Contact us via:</p>
                    <div class="social-icons">
                        <a href="https://wa.me/+234' . substr($admin_mail_logged_details['phone_number'], 1, 11) . '"><img src="' . $web_http_host . '/asset/whatsapp-icon.png" alt="WhatsApp"></a>
                        <!-- <a href="#"><img src="facebook-icon.png" alt="Facebook"></a>
                        <a href="#"><img src="twitter-icon.png" alt="Twitter"></a>
                        <a href="#"><img src="linkedin-icon.png" alt="LinkedIn"></a> -->
                    </div>
                    <p>All Right Reserved</p>
                    <p>' . ucwords(explode(".", $_SERVER['HTTP_HOST'])[0]) . ' &copy; 2024</p>
                </div>
            </div>
        </body>
        </html>';
}
?>