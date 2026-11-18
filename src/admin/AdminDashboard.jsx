// =====================================
// REACT HOOKS
// =====================================
import { useEffect, useState } from "react";

// React Router
import { useNavigate } from "react-router-dom";

// Supabase connection
import { supabase } from "../lib/supabase";
import AdminProfile from "./AdminProfile";
import AdminSkills from "./AdminSkills";
import AdminProjects from "./AdminProjects";
import AdminEducation from "./AdminEducation";
import AdminExperience from "./AdminExperience";
import AdminContact from "./AdminContact";
import AdminCV from "./AdminCV";
import AdminAppearance from "./AdminAppearance";

// Dashboard CSS
import "./AdminDashboard.css";

// =====================================
// DASHBOARD MENU
// =====================================
const menuItems = [
    { id: "dashboard", icon: "▣", label: "Dashboard" },
    { id: "profile", icon: "👤", label: "Profile" },
    { id: "skills", icon: "💻", label: "Skills" },
    { id: "projects", icon: "📁", label: "Projects" },
    { id: "education", icon: "🎓", label: "Education" },
    { id: "experience", icon: "💼", label: "Experience" },
    { id: "contact", icon: "📞", label: "Contact" },
    { id: "cv", icon: "📄", label: "CV" },
    { id: "appearance", icon: "🎨", label: "Appearance" },
];

// =====================================
// MANAGEMENT MODULES
// =====================================
const managementModules = [
    {
        id: "profile",
        icon: "👤",
        title: "Manage Profile",
        description: "Update your name, professional title and introduction.",
    },
    {
        id: "skills",
        icon: "💻",
        title: "Manage Skills",
        description: "Add, edit and organize your technical skills.",
    },
    {
        id: "projects",
        icon: "📁",
        title: "Manage Projects",
        description: "Update your projects, screenshots and demo links.",
    },
    {
        id: "education",
        icon: "🎓",
        title: "Manage Education",
        description: "Update your academic qualifications.",
    },
    {
        id: "experience",
        icon: "💼",
        title: "Manage Experience",
        description: "Update your professional experience.",
    },
    {
        id: "contact",
        icon: "📞",
        title: "Manage Contact",
        description: "Update your email, phone and social links.",
    },
    {
        id: "cv",
        icon: "📄",
        title: "Manage CV",
        description: "Replace your existing CV document.",
    },
    {
        id: "appearance",
        icon: "🎨",
        title: "Manage Appearance",
        description: "Manage colors and portfolio appearance.",
    },
];

// =====================================
// ADMIN DASHBOARD COMPONENT
// =====================================
function AdminDashboard() {
    const navigate = useNavigate();

    // Authorization states
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    // Current administrator email
    const [adminEmail, setAdminEmail] = useState("");

    // Current dashboard section
    const [activeSection, setActiveSection] = useState("dashboard");

    // Mobile sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Logout
    const [loggingOut, setLoggingOut] = useState(false);

    // Error message
    const [errorMessage, setErrorMessage] = useState("");

    // =====================================
    // VERIFY ADMINISTRATOR ACCESS
    // =====================================
    useEffect(() => {
        let active = true;

        async function checkAdmin() {
            try {
                const {
                    data,
                    error: userError,
                } = await supabase.auth.getUser();

                if (!active) return;

                // Redirect unauthenticated users
                if (userError || !data.user) {
                    navigate("/admin", { replace: true });
                    return;
                }

                // Check administrator membership
                const {
                    data: admin,
                    error: adminError,
                } = await supabase
                    .from("portfolio_admins")
                    .select("user_id")
                    .eq("user_id", data.user.id)
                    .maybeSingle();

                if (!active) return;

                if (adminError || !admin) {
                    await supabase.auth.signOut();

                    if (active) {
                        navigate("/admin", { replace: true });
                    }

                    return;
                }

                // Authorized administrator
                setAdminEmail(data.user.email || "");
                setAuthorized(true);
            } catch (error) {
                console.error("Admin verification failed:", error);

                if (active) {
                    setErrorMessage(
                        "Unable to verify administrator access."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        checkAdmin();

        return () => {
            active = false;
        };
    }, [navigate]);

    // =====================================
    // CHANGE DASHBOARD SECTION
    // =====================================
    function openSection(sectionId) {
        setActiveSection(sectionId);
        setSidebarOpen(false);
    }

    // =====================================
    // ADMIN LOGOUT
    // =====================================
    async function handleLogout() {
        setLoggingOut(true);
        setErrorMessage("");

        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw error;
            }

            setAuthorized(false);

            navigate("/admin", {
                replace: true,
            });
        } catch (error) {
            console.error("Logout failed:", error);

            setErrorMessage(
                "Unable to log out. Please try again."
            );
        } finally {
            setLoggingOut(false);
        }
    }

    // =====================================
    // LOADING SCREEN
    // =====================================
    if (loading) {
        return (
            <div className="admin-status-screen">
                <p>Checking administrator access...</p>
            </div>
        );
    }

    // =====================================
    // ACCESS ERROR
    // =====================================
    if (!authorized) {
        return (
            <div className="admin-status-screen">
                <div className="admin-status-card">
                    <h2>Administrator Access</h2>

                    <p>
                        {errorMessage ||
                            "You are not authorized to access this page."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/admin")}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    // =====================================
    // CURRENT SECTION
    // =====================================
    const currentSection = menuItems.find(
        (item) => item.id === activeSection
    );

    return (
        <div className="admin-layout">

            {/* =====================================
                MOBILE SIDEBAR OVERLAY
            ===================================== */}
            {sidebarOpen && (
                <button
                    className="admin-sidebar-overlay"
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* =====================================
                LEFT SIDEBAR
            ===================================== */}
            <aside
                className={`admin-side-panel ${
                    sidebarOpen ? "open" : ""
                }`}
            >
                {/* Dashboard branding */}
                <div className="admin-brand">
                    <div className="admin-brand-icon">
                        DM
                    </div>

                    <div>
                        <h2>Portfolio Admin</h2>
                        <span>Management System</span>
                    </div>
                </div>

                {/* Administrator information */}
                <div className="admin-user-info">
                    <div className="admin-avatar">
                        👤
                    </div>

                    <div>
                        <h3>Deus Makoye</h3>
                        <p title={adminEmail}>
                            Administrator
                        </p>
                    </div>
                </div>

                {/* Dashboard navigation */}
                <nav
                    className="admin-side-nav"
                    aria-label="Admin navigation"
                >
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className={`admin-nav-item ${
                                activeSection === item.id
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                openSection(item.id)
                            }
                        >
                            <span className="admin-nav-icon">
                                {item.icon}
                            </span>

                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Sidebar footer */}
                <div className="admin-side-footer">
                    <a
                        href="/"
                        className="admin-view-site"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🌐 View Portfolio ↗
                    </a>

                    <button
                        type="button"
                        className="admin-logout"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        🚪 {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </aside>

            {/* =====================================
                RIGHT CONTENT
            ===================================== */}
            <main className="admin-main-content">

                {/* Top navigation */}
                <header className="admin-topbar">
                    <div className="admin-topbar-left">
                        <button
                            type="button"
                            className="admin-menu-toggle"
                            onClick={() =>
                                setSidebarOpen(!sidebarOpen)
                            }
                            aria-label="Toggle sidebar"
                            aria-expanded={sidebarOpen}
                        >
                            ☰
                        </button>

                        <div>
                            <h1>
                                {currentSection?.label || "Dashboard"}
                            </h1>

                            <p>
                                Manage your professional portfolio
                            </p>
                        </div>
                    </div>

                    <div className="admin-topbar-right">
                        <span className="admin-online-dot" />

                        <span className="admin-online-label">
                            Admin Access
                        </span>
                    </div>
                </header>

                {/* Main dashboard */}
                <div className="admin-page-content">

                    {errorMessage && (
                        <div
                            className="admin-alert"
                            role="alert"
                        >
                            {errorMessage}
                        </div>
                    )}

                    {/* DASHBOARD OVERVIEW */}
                    {activeSection === "dashboard" ? (
                        <>
                            <div className="admin-welcome">
                                <div>
                                    <h2>Welcome back!</h2>

                                    <p>
                                        Manage your portfolio content
                                        from one place.
                                    </p>
                                </div>

                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="admin-preview-button"
                                >
                                    View Website ↗
                                </a>
                            </div>

                            {/* Quick overview */}
                            <div className="admin-stats-grid">

                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon">
                                        👤
                                    </div>

                                    <div>
                                        <span>Profile</span>
                                        <strong>1</strong>
                                        <small>Profile section</small>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon">
                                        📁
                                    </div>

                                    <div>
                                        <span>Projects</span>
                                        <strong>3</strong>
                                        <small>Portfolio projects</small>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon">
                                        💻
                                    </div>

                                    <div>
                                        <span>Skills</span>
                                        <strong>4</strong>
                                        <small>Skill categories</small>
                                    </div>
                                </div>

                                <div className="admin-stat-card">
                                    <div className="admin-stat-icon">
                                        💼
                                    </div>

                                    <div>
                                        <span>Experience</span>
                                        <strong>2</strong>
                                        <small>Experience entries</small>
                                    </div>
                                </div>

                            </div>

                            {/* Management modules */}
                            <div className="admin-section-heading">
                                <h2>Portfolio Management</h2>

                                <p>
                                    Select a section to manage.
                                </p>
                            </div>

                            <div className="admin-modules-grid">
                                {managementModules.map((module) => (
                                    <div
                                        className="admin-module-card"
                                        key={module.id}
                                    >
                                        <div className="admin-module-icon">
                                            {module.icon}
                                        </div>

                                        <h3>{module.title}</h3>

                                        <p>{module.description}</p>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openSection(module.id)
                                            }
                                        >
                                            Open Section →
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                   ) : activeSection === "profile" ? (

    /* PROFILE MANAGEMENT FORM */
    <AdminProfile />
    ) : activeSection === "skills" ? (

    <AdminSkills />
    ) : activeSection === "projects" ? (
    <AdminProjects />
    ) : activeSection === "education" ? (

    <AdminEducation />

    ) : activeSection === "experience" ? (

    <AdminExperience />
    ) : activeSection === "contact" ? (

    <AdminContact />
    ) : activeSection === "cv" ? (

    <AdminCV />
    ) : activeSection === "appearance" ? (
    <AdminAppearance />



) : (

    /* OTHER MODULES */
    <div className="admin-module-placeholder">

        <div className="admin-placeholder-icon">
            {currentSection?.icon}
        </div>

        <h2>
            {currentSection?.label} Management
        </h2>

        <p>
            This section will be implemented in the
            next development phase.
        </p>

        <button
            type="button"
            onClick={() => openSection("dashboard")}
        >
            ← Back to Dashboard
        </button>

    </div>

)}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;