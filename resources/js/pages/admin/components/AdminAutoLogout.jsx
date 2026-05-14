import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminAutoLogout() {

    const navigate = useNavigate();

    // ✅ 60 MINUTES
    const INACTIVITY_TIME = 60 * 60 * 1000;

    useEffect(() => {

        let timeout;

        // ✅ LOGOUT FUNCTION
        const logout = () => {

            localStorage.removeItem("admin_token");

            alert("Session expired due to inactivity");

            navigate("/admin/login");

        };

        // ✅ RESET TIMER
        const resetTimer = () => {

            clearTimeout(timeout);

            timeout = setTimeout(logout, INACTIVITY_TIME);

        };

        // ✅ USER ACTIVITY EVENTS
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keydown", resetTimer);
        window.addEventListener("click", resetTimer);
        window.addEventListener("scroll", resetTimer);

        // ✅ START TIMER
        resetTimer();

        return () => {

            clearTimeout(timeout);

            window.removeEventListener("mousemove", resetTimer);
            window.removeEventListener("keydown", resetTimer);
            window.removeEventListener("click", resetTimer);
            window.removeEventListener("scroll", resetTimer);

        };

    }, [navigate]);

    return null;
}