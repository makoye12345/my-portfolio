// =====================================
// REACT HOOKS
// =====================================
import { useState, useEffect } from "react";

// =====================================
// REACT ROUTER
// =====================================
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// =====================================
// SUPABASE
// =====================================
import { supabase } from "./lib/supabase";

// =====================================
// GLOBAL CSS
// =====================================
import "./App.css";

// =====================================
// SIDEBAR
// =====================================
import Sidebar from "./components/Sidebar";

// =====================================
// PORTFOLIO COMPONENTS
// =====================================
import Home from "./components/Home";
import Services from "./components/Services";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

// =====================================
// ADMIN COMPONENTS
// =====================================
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

// =====================================
// DEFAULT APPEARANCE
// =====================================
const defaultAppearance = {
    primary_color: "#355F5C",
    accent_color: "#C79A4B",
    background_color: "#F6F1E8",
    surface_color: "#FFFBF3",
    text_color: "#3A2718",
    default_theme: "dark"
};

// =====================================
// CHECK SAVED THEME
// =====================================
function getSavedTheme() {
    const saved = localStorage.getItem("portfolio-theme");

    if (saved === "light" || saved === "dark") {
        return saved;
    }

    return null;
}

// =====================================
// PUBLIC PORTFOLIO
// =====================================
function Portfolio() {

    // Appearance settings from Supabase
    const [appearance, setAppearance] = useState(
        defaultAppearance
    );

    // Visitor preference or temporary default
    const [theme, setTheme] = useState(() => {
        return getSavedTheme() || "light";
    });

    // =====================================
    // LOAD APPEARANCE FROM SUPABASE
    // =====================================
    useEffect(() => {

        let active = true;

        async function loadAppearance() {

            try {

                const {
                    data,
                    error
                } = await supabase
                    .from("portfolio_appearance")
                    .select(
                        "primary_color, accent_color, background_color, surface_color, text_color, default_theme"
                    )
                    .eq("id", 1)
                    .maybeSingle();

                if (error) {
                    throw error;
                }

                if (!active || !data) {
                    return;
                }

                const settings = {
                    ...defaultAppearance,
                    ...data
                };

                setAppearance(settings);

                // Apply administrator's default theme
                // only if the visitor has not chosen one.
                if (!getSavedTheme()) {
                    setTheme(settings.default_theme);
                }

            } catch (error) {

                console.error(
                    "Unable to load appearance:",
                    error
                );

            }

        }

        loadAppearance();

        return () => {
            active = false;
        };

    }, []);

    // =====================================
    // APPLY LIGHT/DARK THEME
    // =====================================
    useEffect(() => {

        document.documentElement.setAttribute(
            "data-theme",
            theme
        );

        return () => {
            document.documentElement.removeAttribute(
                "data-theme"
            );
        };

    }, [theme]);

    // =====================================
    // TOGGLE THEME
    // =====================================
    function toggleTheme() {

        const nextTheme =
            theme === "light" ? "dark" : "light";

        setTheme(nextTheme);

        // Remember visitor's choice
        localStorage.setItem(
            "portfolio-theme",
            nextTheme
        );

    }

    // =====================================
    // DYNAMIC CSS VARIABLES
    // =====================================
    const dynamicStyles = {

        "--portfolio-primary":
            appearance.primary_color,

        "--accent-color":
            appearance.accent_color,

        "--sidebar-bg":
            appearance.primary_color,

        // Preserve readable dark mode colors
        "--page-bg":
            theme === "dark"
                ? "#111827"
                : appearance.background_color,

        "--card-bg":
            theme === "dark"
                ? "#1F2937"
                : appearance.surface_color,

        "--text-color":
            theme === "dark"
                ? "#E5E7EB"
                : appearance.text_color,

        "--heading-color":
            theme === "dark"
                ? "#FFFFFF"
                : appearance.text_color,

        "--muted-color":
            theme === "dark"
                ? "#CBD5E1"
                : appearance.text_color,

        "--border-color":
            theme === "dark"
                ? "#374151"
                : "#E5EBE8"

    };

    return (

        <div
            className="portfolio-layout"
            style={dynamicStyles}
        >

            {/* LEFT SIDEBAR */}
            <Sidebar
                theme={theme}
                toggleTheme={toggleTheme}
            />

            {/* MAIN CONTENT */}
            <main className="portfolio-main">

                <Home />

                <Services />

                <About />

                <Skills />

                <Projects />

                <Experience />

                <Contact />

                <Footer />

            </main>

        </div>

    );
}

// =====================================
// MAIN APPLICATION
// =====================================
function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* PUBLIC PORTFOLIO */}
                <Route
                    path="/"
                    element={<Portfolio />}
                />

                {/* ADMIN LOGIN */}
                <Route
                    path="/admin"
                    element={<AdminLogin />}
                />

                {/* ADMIN DASHBOARD */}
                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />

                {/* UNKNOWN ROUTES */}
                <Route
                    path="*"
                    element={
                        <Navigate to="/" replace />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;