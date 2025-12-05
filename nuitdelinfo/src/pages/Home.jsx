import React, { useState, useEffect } from "react";
import { Accordion, Placeholder, Modal, Button } from "rsuite";
import SnakeModal from "./snake.jsx";

const items = [
  {
    content:
      "Du matériel rendu fonctionnel alors qu'il fonctionne ?\nDes licenses couteuses ?\nou pleins d'autres choses qui nous paraissent indispensable mais qui sont une véritable perte de ressource, c'est ça la Dépendance Numérique.\nC'est pour pallier à ce problème que le NIRD entre en jeu !",
    id: "1",
    title: "Dépendance numérique",
  },
  {
    content:
      "La démarche NIRD (un Numérique Inclusif, Responsable et Durable)\n Le but:\n-> L'accessibilité au Numérique pour Tous\n-> L'impact environnemental réduit\n-> Une meilleure expérience pour les utilisateurs",
    id: "2",
    title: "Solution NIRD",
  },
];

const cardData = [
  { id: 1,
    title: "Recyclage",
    text: "Reclycler, donner ou encore reconditionner des composants encore fonctionnels afin d'offrir une nouvelle vie à vos appareils numériques. Cela permet aussi à des personne dans le besoin de récupérer des ordinateurs fonctionnels à moindre prix."},
  { id: 2,
    title: "Changer de system",
    text: "passez votre ordinateur sur un system qui demande moins de performance permet d'allonger sa longévité. (Par exemple passer de windows à linux permet de rallonger la durée de vie d'un ordinateur du à sa consomation de ressource moins importante)." },
  { id: 3,
    title: "Limiter les licenses inutiles",
     text: "En limitant les license uniquement aux personne ayant fait la demande pour une certaines license on diminue grandement les coût peu utils des établissements. En effet avor une license par pc dans une salle est plus intéressant que d'acheter une license par étudiant. Une autre méthode intéressante serait d'utiliser des licenses opensources lorsque cela est possible.",  },
  { id: 4,
    title: "Création de serveur",
    text: "C'est une solution légerement plus complèxe mais la création de petis serveurs à domicile est possible avec les appareils ayant des version obselètes sur leurs systèmes d'exploitation",  },
  { id: 5,
    title: "",
    text: "" },
];

// -----------------------------------------------------

function useSecretSequence(sequence = "snake", timeoutMs = 5000, onMatch = () => {}) {
  useEffect(() => {
    let buffer = "";
    let timer = null;

    const reset = () => {
      buffer = "";
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const handler = (e) => {
      const key = e.key?.toLowerCase();
      if (!key || key.length !== 1 || key < "a" || key > "z") return;

      if (buffer.length === 0) {
        timer = setTimeout(reset, timeoutMs);
      }

      buffer += key;

      if (!sequence.startsWith(buffer)) {
        buffer = key === sequence[0] ? key : "";
        clearTimeout(timer);
        timer = buffer ? setTimeout(reset, timeoutMs) : null;
      }

      if (buffer === sequence) {
        reset();
        onMatch();
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearTimeout(timer);
    };
  }, [sequence, timeoutMs, onMatch]);
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });

  const openCardModal = (card) => {
    setModalContent(card);
    setModalOpen(true);
  };

  const [isSnakeOpen, setIsSnakeOpen] = useState(false);

  const openSnakeModal = () => setIsSnakeOpen(true);
  const closeSnakeModal = () => setIsSnakeOpen(false);

  useSecretSequence("snake", 5000, () => setIsSnakeOpen(true));

  return (
    <section style={{ padding: 20 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Home</h1>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 18 }}>CHOSES A SAVOIR</h2>

        <Accordion bordered>
          {items.map((item) => (
            <Accordion.Panel header={item.title} key={item.id}>
              <div style={{ padding: "8px 0", color: "#4b5563", whiteSpace: "pre-line" }}>
                {item.content}
              </div>
            </Accordion.Panel>
          ))}
        </Accordion>
      </div>

      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Comment réduire la dépendance numérique ?</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
          }}
        >
          {cardData.map((card) => (
            <div
              key={card.id}
              onClick={() => (card.id === 5 ? openSnakeModal() : openCardModal(card))}
              style={{
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: 8,
                cursor: "pointer",
                background: "#fafafa",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{card.title}</h3>
              <p style={{ margin: 0, color: "#555" }}>Cliquer pour en savoir plus</p>
            </div>
          ))}
        </div>
      </div>

      {/* CARD MODAL */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="xs">
        <Modal.Header>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalContent.text}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={() => setModalOpen(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* SNAKE MODAL */}
      <SnakeModal isOpen={isSnakeOpen} onClose={closeSnakeModal} />
    </section>
  );
}
