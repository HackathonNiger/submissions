<?php
// functions.php
function trackPageVisit($page) {
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        if ($db) {
            $query = "INSERT INTO page_visits (page_url, user_agent, ip_address, session_id) 
                      VALUES (:page_url, :user_agent, :ip_address, :session_id)";
            
            $stmt = $db->prepare($query);
            
            $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
            $ip_address = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
            $session_id = session_id();
            
            $stmt->bindParam(":page_url", $page);
            $stmt->bindParam(":user_agent", $user_agent);
            $stmt->bindParam(":ip_address", $ip_address);
            $stmt->bindParam(":session_id", $session_id);
            
            $stmt->execute();
            return true;
        }
    } catch (Exception $e) {
        error_log("Error tracking page visit: " . $e->getMessage());
    }
    return false;
}

// Format currency for display
function formatCurrency($amount) {
    return '₦' . number_format($amount);
}
?>