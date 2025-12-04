
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-blue-300 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 
            md:grid-cols-4 gap-8 w-11/12">

        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Nuit de l'Info 2025</h1>
        </div>

        <div className="text-white">
          <h3 className="text-xl text-white font-bold mb-4">Contributors</h3>
          <ul>
            <li><a className="hover:underline">
              Nathan Flachat</a></li>
            <li><a className="hover:underline">
              Loris Pellizzari</a></li>
            <li><a className="hover:underline">
              Eric Maire</a></li>
            <li><a className="hover:underline">
              Naouel Bouhali</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Services</h3>
          <ul>
            <li><a href="#" className="hover:underline">
              Les Femme dans la Tech</a></li>
            <li><a href="#" className="hover:underline">
              Devenez le CTO de votre Santé posturale</a></li>
            <li><a href="#" className="hover:underline">
              Visualisateur Audio</a></li>
            <li><a href="#" className="hover:underline">
              ft_rub_goldware</a></li>
            <li><a href="#" className="hover:underline">
              Surprise</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
};
