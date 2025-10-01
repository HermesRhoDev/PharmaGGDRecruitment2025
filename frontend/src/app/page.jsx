import Link from 'next/link';
import 'App/app/Home.scss';

export default function Home() {
    return (
        <div className="home-page">
            <div className="home-container">
                <div className="home-card">
                    <h1>Bienvenue sur PharmaGDD</h1>
                    <p>Découvrez notre catalogue de produits pharmaceutiques</p>
                    <p>Explorez notre gamme complète de produits de qualité.</p>
                    
                    <div className="home-actions">
                        <Link href="/products" className="cta-button primary">
                            Voir nos produits
                        </Link>
                        <Link href="/admin" className="cta-button secondary">
                            Espace administrateur
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}