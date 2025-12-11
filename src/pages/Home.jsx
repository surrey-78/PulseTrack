import { Link } from "react-router-dom";
import "../styles/global.css"; // I recommend creating a specific file for this

export default function Home() {
    return (
        <div className="hero-container">
            <div className="hero-content">
                {/* Optional: A small 'pill' tag for a tech feel */}
                <span className="badge">Powered by Machine Learning</span>
                
                <h1 className="hero-title">
                    Health Risk <br />
                    <span className="highlight">Prediction System</span>
                </h1>
                
                <p className="hero-subtitle">
                    Predict diabetes, hypertension, and heart disease risks with high accuracy. 
                    Get personalized food and medicine recommendations instantly.
                </p>

                <div className="cta-group">
                    <Link to="/predict" className="btn-primary">
                        Start Analysis &rarr;
                    </Link>
                    <button className="btn-secondary">Learn How it Works</button>
                </div>
            </div>
            
            {/* Decorative background element (Optional, handled in CSS) */}
            <div className="hero-background-pattern"></div>
        </div>
    );
}