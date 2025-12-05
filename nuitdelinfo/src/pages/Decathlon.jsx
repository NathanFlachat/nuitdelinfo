import { useState } from 'react';

export default function Decathlon() {
  const [formData, setFormData] = useState({
    niveau: '',
    sports: [],
    objectifs: [],
    frequence: '',
    blessures: ''
  });
  const [showResults, setShowResults] = useState(false);

  const handleRadioChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field];
    if (currentValues.includes(value)) {
      setFormData({ ...formData, [field]: currentValues.filter(v => v !== value) });
    } else {
      setFormData({ ...formData, [field]: [...currentValues, value] });
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const getConseils = () => {
    const conseils = [];

    if (formData.sports.includes('raquette')) {
      conseils.push({
        titre: 'Sports de raquette',
        texte: 'Renforce tes avant-bras et ta coiffe des rotateurs pour éviter le tennis elbow. Échauffe bien tes épaules avant chaque session.',
        produit: 'Coudière de compression - 12.99€'
      });
    }

    if (formData.sports.includes('collectifs')) {
      conseils.push({
        titre: 'Sports collectifs',
        texte: 'Travaille ta proprioception (équilibre) pour protéger tes chevilles. Porte des chaussures avec bon maintien latéral.',
        produit: 'Chevillères stabilisatrices - 16.99€'
      });
    }

    if (formData.sports.includes('fitness')) {
      conseils.push({
        titre: 'Fitness/Musculation',
        texte: 'Maîtrise parfaitement la technique avant d\'augmenter les charges. Engage toujours ton gainage pour protéger ton dos.',
        produit: 'Ceinture lombaire - 29.99€'
      });
    }

    if (formData.sports.includes('combat')) {
      conseils.push({
        titre: 'Sports de combat',
        texte: 'Utilise TOUJOURS tes protections (protège-dents, gants, coquille). Bande bien tes poignets avant les séances.',
        produit: 'Kit protection combat - 79.99€'
      });
    }

    if (formData.sports.includes('bienetre')) {
      conseils.push({
        titre: 'Yoga/Bien-être',
        texte: 'Ne force jamais une posture. La flexibilité vient avec le temps. Une légère tension est ok, la douleur ne l\'est jamais.',
        produit: 'Briques de yoga - 14.99€'
      });
    }

    return conseils;
  };

  return (
    <section>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>
        Decath'check : Ton corps mérite mieux qu'une blessure
      </h1>
      <p>Évalue ton niveau et tes habitudes sportives pour recevoir des recommandations personnalisées et pratiquer en toute sécurité.</p>
      
      <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '20px' }}>
        Question 1 : Quel est ton niveau actuel en sport ?
      </h2>
      
      <div style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="niveau" value="novice" onChange={() => handleRadioChange('niveau', 'novice')} />
          <span style={{ marginLeft: '8px' }}>Novice - Je débute complètement</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="niveau" value="debutant" onChange={() => handleRadioChange('niveau', 'debutant')} />
          <span style={{ marginLeft: '8px' }}>Débutant - Quelques mois de pratique</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="niveau" value="intermediaire" onChange={() => handleRadioChange('niveau', 'intermediaire')} />
          <span style={{ marginLeft: '8px' }}>Intermédiaire - 1 à 2 ans de pratique</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="niveau" value="confirme" onChange={() => handleRadioChange('niveau', 'confirme')} />
          <span style={{ marginLeft: '8px' }}>Confirmé - Plus de 2 ans</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="niveau" value="expert" onChange={() => handleRadioChange('niveau', 'expert')} />
          <span style={{ marginLeft: '8px' }}>Expert - Je participe à des compétitions</span>
        </label>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '30px' }}>
        Question 2 : Quels types de sports pratiques-tu ? (plusieurs choix possibles)
      </h2>
      
      <div style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" name="sports" value="raquette" onChange={() => handleCheckboxChange('sports', 'raquette')} />
          <span style={{ marginLeft: '8px' }}>Sports de raquette (Tennis, badminton, squash, padel)</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" name="sports" value="collectifs" onChange={() => handleCheckboxChange('sports', 'collectifs')} />
          <span style={{ marginLeft: '8px' }}>Sports collectifs (Football, basketball, rugby, handball)</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" name="sports" value="fitness" onChange={() => handleCheckboxChange('sports', 'fitness')} />
          <span style={{ marginLeft: '8px' }}>Sports individuels / Fitness (Musculation, course, natation, vélo)</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" name="sports" value="combat" onChange={() => handleCheckboxChange('sports', 'combat')} />
          <span style={{ marginLeft: '8px' }}>Sports de combat (Boxe, judo, karaté, MMA, taekwondo)</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" name="sports" value="bienetre" onChange={() => handleCheckboxChange('sports', 'bienetre')} />
          <span style={{ marginLeft: '8px' }}>Sports de bien-être (Yoga, pilates, stretching, danse)</span>
        </label>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '30px' }}>
        Question 3 : Quels sont tes objectifs sportifs ? (plusieurs choix possibles)
      </h2>
      
      <div style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" name="objectifs" value="forme" onChange={() => handleCheckboxChange('objectifs', 'forme')} />
          <span style={{ marginLeft: '8px' }}>Rester en forme et en bonne santé</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" name="objectifs" value="perte-poids" onChange={() => handleCheckboxChange('objectifs', 'perte-poids')} />
          <span style={{ marginLeft: '8px' }}>Perdre du poids / Affiner ma silhouette</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" name="objectifs" value="muscle" onChange={() => handleCheckboxChange('objectifs', 'muscle')} />
          <span style={{ marginLeft: '8px' }}>Prendre du muscle / Gagner en force</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" name="objectifs" value="endurance" onChange={() => handleCheckboxChange('objectifs', 'endurance')} />
          <span style={{ marginLeft: '8px' }}>Améliorer mon endurance</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" name="objectifs" value="souplesse" onChange={() => handleCheckboxChange('objectifs', 'souplesse')} />
          <span style={{ marginLeft: '8px' }}>Gagner en souplesse / Mobilité</span>
        </label>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '30px' }}>
        Question 4 : À quelle fréquence t'entraînes-tu actuellement ?
      </h2>

      <div style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="frequence" value="occasionnel" onChange={() => handleRadioChange('frequence', 'occasionnel')} />
          <span style={{ marginLeft: '8px' }}>Occasionnellement (moins d'1 fois par semaine)</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="frequence" value="1fois" onChange={() => handleRadioChange('frequence', '1fois')} />
          <span style={{ marginLeft: '8px' }}>1 fois par semaine</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="frequence" value="2-3fois" onChange={() => handleRadioChange('frequence', '2-3fois')} />
          <span style={{ marginLeft: '8px' }}>2-3 fois par semaine</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="frequence" value="4-5fois" onChange={() => handleRadioChange('frequence', '4-5fois')} />
          <span style={{ marginLeft: '8px' }}>4-5 fois par semaine</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="frequence" value="quotidien" onChange={() => handleRadioChange('frequence', 'quotidien')} />
          <span style={{ marginLeft: '8px' }}>Quotidiennement (6-7 fois par semaine)</span>
        </label>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: '600', marginTop: '30px' }}>
        Question 5 : As-tu déjà eu des blessures sportives ?
      </h2>

      <div style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="blessures" value="jamais" onChange={() => handleRadioChange('blessures', 'jamais')} />
          <span style={{ marginLeft: '8px' }}>Non, jamais</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="blessures" value="legeres" onChange={() => handleRadioChange('blessures', 'legeres')} />
          <span style={{ marginLeft: '8px' }}>Oui, des blessures légères (courbatures, petites douleurs)</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="blessures" value="moderees" onChange={() => handleRadioChange('blessures', 'moderees')} />
          <span style={{ marginLeft: '8px' }}>Oui, des blessures modérées (entorses, tendinites)</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="blessures" value="graves" onChange={() => handleRadioChange('blessures', 'graves')} />
          <span style={{ marginLeft: '8px' }}>Oui, des blessures graves (fractures, déchirures musculaires)</span>
        </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          <input type="radio" name="blessures" value="chroniques" onChange={() => handleRadioChange('blessures', 'chroniques')} />
          <span style={{ marginLeft: '8px' }}>J'ai des douleurs chroniques actuellement</span>
        </label>
      </div>

      <button 
        onClick={handleSubmit}
        style={{ 
          marginTop: '30px', 
          padding: '12px 30px', 
          backgroundColor: '#0066cc', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Voir mes conseils
      </button>

      {showResults && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#0066cc' }}>
            Tes conseils de prévention
          </h2>
          
          {getConseils().map((item, index) => (
            <div key={index} style={{ 
              marginBottom: '25px', 
              padding: '20px', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '10px',
              borderLeft: '5px solid #0066cc'
            }}>
              <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '10px', color: '#0066cc' }}>
                {item.titre}
              </h3>
              <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '15px' }}>
                {item.texte}
              </p>
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#e0f2fe', 
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                💡 Produit recommandé : {item.produit}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
} 