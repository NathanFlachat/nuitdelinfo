import React, { useState } from "react";
import { Accordion, Placeholder, Modal, Button } from "rsuite";

const items = [
  {
    content: "blablabla",
    id: "1",
    title: "Dépendance numérique",
  },
  {
    content: "bliblibliblibl",
    id: "2",
    title: "Solution NIRD",
  },
];

const cardData = [
  {
    id: 1,
    title: "AHHHHHHHHHHHH",
    text: "EL MORDJENE",
  },
  {
    id: 2,
    title: "SUBHANALLA",
    text: "YE ZEBBI",
  },
  {
    id: 3,
    title: "ALLO SALEM",
    text: "SIGISSSHI",
  },
  {
    id: 4,
    title: "1 Peu de GAzouz",
    text: "Gazouz ou Gattouz",
  },
];

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", text: "" });

  const openCardModal = (card) => {
    setModalContent(card);
    setModalOpen(true);
  };

  return (
    <section style={{ padding: 20 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>Home</h1>
      <p style={{ marginTop: 8 }}>FTG</p>

      {}
      <div style={{ marginTop: 24 }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 18 }}>CHOSES A SAVOIR</h2>

        <Accordion bordered>
          {items.map((item) => (
            <Accordion.Panel
              header={item.title}
              key={item.id}
              defaultExpanded={false}
            >
              <div style={{ padding: "8px 0", color: "#4b5563" }}>
                {item.content}
              </div>
            </Accordion.Panel>
          ))}

          <Accordion.Panel header="">
            <Placeholder.Paragraph rows={3} />
          </Accordion.Panel>
        </Accordion>
      </div>

      {}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>
          Comment réduire la dépendance numérique ?
        </h2>

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
              onClick={() => openCardModal(card)}
              style={{
                padding: "16px",
                border: "1px solid #ddd",
                borderRadius: 8,
                cursor: "pointer",
                background: "#fafafa",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "0.2s",
              }}
            >
              <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{card.title}</h3>
              <p style={{ margin: 0, color: "#555" }}>Cliquer pour en savoir plus</p>
            </div>
          ))}
        </div>
      </div>

      {}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="xs">
        <Modal.Header>
          <Modal.Title>{modalContent.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>{modalContent.text}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setModalOpen(false)} appearance="primary">
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
