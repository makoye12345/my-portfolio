// Global CSS
import "./App.css";

// Sidebar
import Sidebar from "./components/Sidebar";

// Main portfolio components
import Home from "./components/Home";
import Services from "./components/Services";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
    return (
        <div className="portfolio-layout">

            {/* Fixed left sidebar */}
            <Sidebar />

            {/* Main content */}
            <main className="portfolio-main">

                {/* Introduction */}
                <Home />

                {/* What I Do */}
                <Services />

                {/* About Me */}
                <About />

                {/* Skills */}
                <Skills />

                {/* Projects */}
                <Projects />

                {/* Education & Experience */}
                <Experience />

                {/* Contact */}
                <Contact />

                {/* Footer */}
                <Footer />

            </main>

        </div>
    );
}

export default App;