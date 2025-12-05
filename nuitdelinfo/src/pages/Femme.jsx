import React from "react";
import { Accordion } from "rsuite";
import flyer from "../assets/flyer.png";
import video from "../assets/video.mp4";

const items = [
  {
    id: "1",
    title: "Le Numérique pour tous",
    content:
      "Le monde du numérique est un univers vaste qui semble inaccessible pour certaines personnes pour différentes raisons. Raisons sociales ou personnelles, ces apprioris peuvent porter préjudice aux personnes souhaitant rejoindre le monde de la tech, même si c'est un univers où tout le monde peut trouver sa place.",
  },
  {
    id: "2",
    title: "Quelques chiffres",
    content:
      "Seulement 24% des métiers de la tech sont occupés par des femmes. 67% des femmes ne se sentent pas légitimes à faire des études informatiques. 48% des femmes citent le manque de modèles féminins dans le numérique.",
  },
];

export default function Femme() {
  return (
    <section style={{ padding: 20 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
        Les Femmes dans la tech, un univers accessible à tous
      </h1>

      <div style={{ marginTop: 24 }}>
        <Accordion bordered>

          {items.map((item) => (
            <Accordion.Panel key={item.id} header={item.title}>
              <p style={{ color: "#4b5563", marginTop: 8 }}>
                {item.content}
              </p>
            </Accordion.Panel>
          ))}

          <Accordion.Panel header="Témoignage d'une étudiante en Informatique à Epitech Nancy + Vidéo">
            
            <p style={{ color: "#4b5563", marginTop: 8 }}>
              Naouel, étudiante en informatique à Epitech Nancy, partage aujourd’hui son expérience dans le monde du numérique...
            </p>

            {/* 2 colonnes */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginTop: "20px",
                alignItems: "flex-start",
              }}
            >
              {/* Colonne 1 : Image */}
              <div style={{ flex: 1 }}>
                <img
                  src={flyer}
                  alt="flyer"
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <video
                  src={video}
                  controls
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
            </div>

          </Accordion.Panel>
        </Accordion>
      </div>
    </section>
  );
}
