import React from "react";
import { Accordion} from "rsuite";

const items = [
  {
    content: "Le monde du numérique est un univers vaste qui semble innacessible pour certaines personnes pour différentes raison. Raison sociales ou personnelles ces apprioris peuvent porter préjudices aux personnes souhaitant rejoindre le monde de la tech même si c'est un univers où tout le monde peut trouver sa place ",
    id: "1",
    title: "Le Numérique pour tous",
  },
  {
    content: "Seulement 24% des métiers de la tech sont occupés par des femmes      67% des femmes ne se sentent pas légitimes à faire des études informatiques      48%des femmes citent le manque de modèle féminins dans le numérique",
    id: "2",
    title: "Quelques chiffres",
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

          <Accordion.Panel header="Témoignage d'une étudiante en Informatique à Epitech Nance + Vidéo">
              <p> Naouel, étudiante en informatique à Epitech Nancy, partage aujourd’hui son expérience dans le monde du numérique. Son parcours n’a pas commencé sous les meilleurs auspices : les aprioris, les remarques décourageantes et une certaine réticence à rejoindre un domaine souvent perçu comme “pas fait pour elle” auraient pu la détourner de sa passion. Pourtant, elle a choisi de ne pas écouter les bruits de couloir et de se lancer. Les débuts ont été difficiles, comme pour beaucoup. Il a fallu s’adapter, apprendre, persévérer. Mais jamais elle n’a pensé abandonner. Au contraire, chaque défi est devenu pour elle une preuve supplémentaire qu’elle avait toute sa place dans ce milieu. Aujourd’hui, Naouel démontre chaque jour que la compétence n’a pas de genre, que la motivation et la curiosité valent bien plus que les stéréotypes, et que les femmes ont toute leur légitimité dans la tech. Son témoignage rappelle une chose essentielle : la diversité est une richesse. Encourager les femmes à rejoindre les métiers du numérique, c’est ouvrir la voie à plus de créativité, de perspectives nouvelles et d’innovation. Grâce à des parcours comme celui de Naouel, les futures étudiantes peuvent se projeter et oser, elles aussi, franchir le pas.</p>
          </Accordion.Panel>
        </Accordion>
      </div>
    </section>
  );
}
