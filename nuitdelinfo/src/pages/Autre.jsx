import React, { useState, useEffect } from "react";
import { Plus, Zap, Rocket, Sparkles, Star, Clock, Cog, Target, Trophy, Flame, Atom, Cpu, Database, Globe, Layers, Lock, Unlock, Wind, Waves, Mountain, Wifi, Radio, Activity, Anchor, Aperture, Award } from "lucide-react";

export default function RubeGoldbergCalculator() {
  const [num1, setNum1] = useState("4");
  const [num2, setNum2] = useState("5");
  const [isCalculating, setIsCalculating] = useState(false);
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState(null);
  const [particles, setParticles] = useState([]);
  const [fallingNumbers, setFallingNumbers] = useState([]);
  const [explosionNumbers, setExplosionNumbers] = useState([]);
  const [warpEffect, setWarpEffect] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [blackHole, setBlackHole] = useState(false);

  const stages = [
    { name: "Initialisation du flux quantique", icon: Zap, duration: 2000, effect: "particles" },
    { name: "Déverrouillage des portes dimensionnelles", icon: Unlock, duration: 2500, effect: "shake" },
    { name: "Activation des engrenages primaires", icon: Cog, duration: 2000, effect: "numbers" },
    { name: "Scan des matrices numériques", icon: Database, duration: 3000, effect: "warp" },
    { name: "Lancement de la fusée de transport", icon: Rocket, duration: 2500, effect: "explosion" },
    { name: "Traversée du portail cosmique", icon: Globe, duration: 3000, effect: "blackhole" },
    { name: "Analyse des particules numériques", icon: Sparkles, duration: 2000, effect: "particles" },
    { name: "Synchronisation des ondes cérébrales", icon: Activity, duration: 2500, effect: "numbers" },
    { name: "Calibration du réacteur mathématique", icon: Target, duration: 2000, effect: "shake" },
    { name: "Activation des nano-processeurs", icon: Cpu, duration: 3000, effect: "warp" },
    { name: "Invocation des esprits arithmétiques", icon: Star, duration: 2500, effect: "explosion" },
    { name: "Verrouillage des constantes universelles", icon: Lock, duration: 2000, effect: "particles" },
    { name: "Combustion des algorithmes", icon: Flame, duration: 3000, effect: "blackhole" },
    { name: "Stabilisation des couches multidimensionnelles", icon: Layers, duration: 2500, effect: "numbers" },
    { name: "Émission des signaux radio cosmiques", icon: Radio, duration: 2000, effect: "warp" },
    { name: "Ancrage dans la réalité primaire", icon: Anchor, duration: 2500, effect: "shake" },
    { name: "Création du vortex temporel", icon: Wind, duration: 3000, effect: "explosion" },
    { name: "Navigation dans les vagues quantiques", icon: Waves, duration: 2000, effect: "particles" },
    { name: "Escalade de la montagne de données", icon: Mountain, duration: 2500, effect: "blackhole" },
    { name: "Ajustement de l'ouverture dimensionnelle", icon: Aperture, duration: 3000, effect: "numbers" },
    { name: "Connexion au réseau intergalactique", icon: Wifi, duration: 2000, effect: "warp" },
    { name: "Fusion atomique des chiffres", icon: Atom, duration: 2500, effect: "explosion" },
    { name: "Validation temporelle", icon: Clock, duration: 3000, effect: "shake" },
    { name: "Décernement de la médaille d'excellence", icon: Award, duration: 2000, effect: "particles" },
    { name: "Finalisation cosmique", icon: Trophy, duration: 2500, effect: "blackhole" }
  ];

  useEffect(() => {
    if (isCalculating && stage < stages.length) {
      const effect = stages[stage].effect;
      
      if (effect === "numbers") {
        generateFallingNumbers();
      } else if (effect === "explosion") {
        generateExplosionNumbers();
      } else if (effect === "warp") {
        setWarpEffect(true);
        setTimeout(() => setWarpEffect(false), stages[stage].duration);
      } else if (effect === "shake") {
        setShakeScreen(true);
        setTimeout(() => setShakeScreen(false), stages[stage].duration);
      } else if (effect === "blackhole") {
        setBlackHole(true);
        setTimeout(() => setBlackHole(false), stages[stage].duration);
      }
    }
  }, [stage, isCalculating]);

  const generateFallingNumbers = () => {
    const numbers = Array.from({ length: 150 }, (_, i) => ({
      id: Math.random(),
      value: Math.floor(Math.random() * 10),
      x: Math.random() * 100,
      y: -10,
      speed: 2 + Math.random() * 4,
      size: 20 + Math.random() * 40,
      rotation: Math.random() * 360
    }));
    setFallingNumbers(numbers);
    
    setTimeout(() => setFallingNumbers([]), 3000);
  };

  const generateExplosionNumbers = () => {
    const numbers = Array.from({ length: 50 }, (_, i) => ({
      id: Math.random(),
      value: Math.floor(Math.random() * 10),
      angle: (i / 50) * 360,
      distance: 0,
      size: 20 + Math.random() * 30
    }));
    setExplosionNumbers(numbers);
    
    setTimeout(() => setExplosionNumbers([]), 2000);
  };

  const calculate = () => {
    if (!num1 || !num2) return;
    
    setIsCalculating(true);
    setStage(0);
    setResult(null);
    
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: 2 + Math.random() * 6
    }));
    setParticles(newParticles);

    let currentStage = 0;
    const executeStage = () => {
      if (currentStage < stages.length) {
        setStage(currentStage);
        currentStage++;
        setTimeout(executeStage, stages[currentStage - 1]?.duration || 2000);
      } else {
        setTimeout(() => {
          const finalResult = parseInt(num1) + parseInt(num2);
          setResult(finalResult);
          setIsCalculating(false);
          generateExplosionNumbers();
        }, 1500);
      }
    };
    
    executeStage();
  };

  const CurrentIcon = stage < stages.length ? stages[stage].icon : Trophy;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 overflow-hidden relative ${shakeScreen ? 'animate-shake' : ''}`}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-10px, 5px) rotate(-2deg); }
          20% { transform: translate(10px, -5px) rotate(2deg); }
          30% { transform: translate(-10px, -5px) rotate(-1deg); }
          40% { transform: translate(10px, 5px) rotate(1deg); }
          50% { transform: translate(-5px, 10px) rotate(-2deg); }
          60% { transform: translate(5px, -10px) rotate(2deg); }
          70% { transform: translate(-10px, 0px) rotate(-1deg); }
          80% { transform: translate(10px, 0px) rotate(1deg); }
          90% { transform: translate(-5px, -5px) rotate(-2deg); }
        }
        .animate-shake {
          animation: shake 0.5s infinite;
        }
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .falling-number {
          animation: fall 3s linear forwards;
        }
        @keyframes explode {
          to {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }
        .explosion-number {
          animation: explode 2s ease-out forwards;
        }
        @keyframes warp {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.5) rotate(90deg); }
          50% { transform: scale(0.5) rotate(180deg); }
          75% { transform: scale(1.2) rotate(270deg); }
        }
        .warp-effect {
          animation: warp 1s infinite;
        }
        @keyframes blackhole {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 1; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        .blackhole-effect {
          animation: blackhole 3s ease-in-out infinite;
        }
        @keyframes spiral {
          to {
            transform: rotate(360deg) scale(0);
            opacity: 0;
          }
        }
        .spiral {
          animation: spiral 2s linear forwards;
        }
      `}</style>

      {}
      {blackHole && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="blackhole-effect w-96 h-96 rounded-full bg-gradient-to-br from-purple-900 via-black to-blue-900 border-8 border-purple-500 shadow-2xl" 
               style={{ boxShadow: '0 0 100px 50px rgba(147, 51, 234, 0.8), inset 0 0 100px rgba(0, 0, 0, 0.9)' }} />
        </div>
      )}

      {}
      {warpEffect && (
        <div className="absolute inset-0 pointer-events-none z-40">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute warp-effect"
              style={{
                left: '50%',
                top: '50%',
                width: '4px',
                height: `${100 + i * 50}px`,
                background: `linear-gradient(transparent, ${['#ff00ff', '#00ffff', '#ffff00'][i % 3]})`,
                transformOrigin: 'top',
                transform: `rotate(${i * 18}deg)`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      {}
      {fallingNumbers.map(num => (
        <div
          key={num.id}
          className="absolute falling-number font-bold text-yellow-400 pointer-events-none z-30"
          style={{
            left: `${num.x}%`,
            top: `${num.y}%`,
            fontSize: `${num.size}px`,
            transform: `rotate(${num.rotation}deg)`,
            textShadow: '0 0 20px rgba(250, 204, 21, 0.8)'
          }}
        >
          {num.value}
        </div>
      ))}

      {}
      {explosionNumbers.map(num => {
        const rad = (num.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * 500;
        const ty = Math.sin(rad) * 500;
        return (
          <div
            key={num.id}
            className="absolute explosion-number font-bold text-pink-400 pointer-events-none z-30"
            style={{
              left: '50%',
              top: '50%',
              fontSize: `${num.size}px`,
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              textShadow: '0 0 20px rgba(244, 114, 182, 0.8)'
            }}
          >
            {num.value}
          </div>
        );
      })}

      {}
      {isCalculating && particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-ping pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${['#fbbf24', '#ec4899', '#8b5cf6', '#06b6d4'][particle.id % 4]}, transparent)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '2s'
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto relative z-10">
        {}
        <div className="text-center mb-12">
          <h1 className={`text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-4 ${warpEffect ? 'warp-effect' : 'animate-pulse'}`}>
            CALCULATRICE QUANTIQUE
          </h1>
          <p className="text-xl text-gray-300 italic animate-bounce">
          </p>
          <div className="flex justify-center gap-4 mt-4">
            {[...Array(7)].map((_, i) => (
              <Star
                key={i}
                className="text-yellow-400"
                style={{ 
                  animation: `spin ${2 + i * 0.3}s linear infinite, pulse ${1 + i * 0.2}s ease-in-out infinite`,
                  transform: `scale(${1 + Math.sin(i) * 0.3})`
                }}
              />
            ))}
          </div>
        </div>

        {}
        <div className={`bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-3xl p-8 mb-8 border-4 border-purple-500 shadow-2xl transition-all duration-300 ${isCalculating ? 'scale-95 opacity-80' : 'hover:scale-105'}`}>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <input
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                disabled={isCalculating}
                className="w-32 h-20 text-4xl text-center bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl border-4 border-yellow-400 shadow-lg focus:ring-4 focus:ring-pink-500 focus:outline-none transform transition-all hover:scale-110 disabled:opacity-50"
                placeholder="?"
              />
              <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" />
              <div className="absolute inset-0 bg-blue-400 blur-xl opacity-30 animate-pulse" />
            </div>
            
            <div className="relative">
              <Plus className="w-16 h-16 text-yellow-400" style={{ animation: 'spin 3s linear infinite, pulse 1.5s ease-in-out infinite' }} />
              <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse" />
            </div>
            
            <div className="relative">
              <input
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                disabled={isCalculating}
                className="w-32 h-20 text-4xl text-center bg-gradient-to-br from-pink-600 to-red-600 text-white rounded-xl border-4 border-yellow-400 shadow-lg focus:ring-4 focus:ring-blue-500 focus:outline-none transform transition-all hover:scale-110 disabled:opacity-50"
                placeholder="?"
              />
              <Sparkles className="absolute -top-2 -left-2 text-yellow-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
              <div className="absolute inset-0 bg-pink-400 blur-xl opacity-30 animate-pulse" />
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={isCalculating || !num1 || !num2}
            className="w-full py-6 text-3xl font-bold text-white bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-2xl shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <span className="relative z-10 animate-pulse">
              {isCalculating ? " CALCUL EN COURS " : " LANCER LE CALCUL COSMIQUE "}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300 animate-pulse" />
          </button>
        </div>

        {}
        {isCalculating && (
          <div className={`bg-gray-900 bg-opacity-70 backdrop-blur-lg rounded-3xl p-8 mb-8 border-4 shadow-2xl transition-all duration-500 ${warpEffect ? 'warp-effect border-cyan-500' : 'border-green-500'}`}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <CurrentIcon className="w-16 h-16 text-yellow-400 animate-bounce" style={{ animationDuration: '0.6s' }} />
              <h2 className="text-3xl font-bold text-white animate-pulse">
                Étape {stage + 1}/{stages.length}
              </h2>
              <CurrentIcon className="w-16 h-16 text-yellow-400 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '0.6s' }} />
            </div>
            
            <p className="text-2xl text-center text-green-400 mb-8 animate-pulse" style={{ textShadow: '0 0 20px rgba(74, 222, 128, 0.8)' }}>
              {stages[stage]?.name}
            </p>

            {}
            <div className="relative h-10 bg-gray-700 rounded-full overflow-hidden border-4 border-purple-500 mb-8">
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-yellow-500 transition-all duration-1000 ease-out"
                style={{ 
                  width: `${((stage + 1) / stages.length) * 100}%`,
                  boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)'
                }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse" style={{ animationDuration: '1s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg z-10" style={{ textShadow: '0 0 10px black' }}>
                  {Math.round(((stage + 1) / stages.length) * 100)}% COMPLÉTÉ
                </span>
              </div>
            </div>

            {}
            <div className="grid grid-cols-5 gap-4 mb-8">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-lg shadow-2xl relative overflow-hidden"
                  style={{
                    background: `linear-gradient(${45 + i * 24}deg, ${['#9333ea', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][i % 5]}, ${['#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#9333ea'][i % 5]})`,
                    animation: `pulse ${1 + (i % 3) * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                    transform: `scale(${0.9 + Math.sin(i) * 0.1}) rotate(${i * 2}deg)`
                  }}
                >
                  <div className="h-full flex items-center justify-center">
                    <Cog
                      className="w-10 h-10 text-white"
                      style={{ 
                        animation: `spin ${0.8 + i * 0.2}s linear infinite`,
                        filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))'
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
                </div>
              ))}
            </div>

            {}
            <div className="relative h-64 flex items-center justify-center">
              {[...Array(5)].map((_, ring) => (
                <div
                  key={ring}
                  className="absolute rounded-full border-4 border-dashed"
                  style={{
                    width: `${80 + ring * 40}px`,
                    height: `${80 + ring * 40}px`,
                    borderColor: ['#fbbf24', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'][ring],
                    animation: `spin ${3 + ring}s linear infinite ${ring % 2 === 0 ? 'reverse' : ''}`,
                    opacity: 0.6
                  }}
                >
                  {[...Array(6)].map((_, dot) => (
                    <div
                      key={dot}
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        background: ['#fbbf24', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'][ring],
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${dot * 60}deg) translateY(${-40 - ring * 20}px)`,
                        boxShadow: `0 0 10px ${['#fbbf24', '#ec4899', '#8b5cf6', '#06b6d4', '#10b981'][ring]}`
                      }}
                    />
                  ))}
                </div>
              ))}
              <div className="absolute text-6xl font-bold text-white animate-pulse z-10">
                {Math.floor((stage / stages.length) * 100)}%
              </div>
            </div>
          </div>
        )}

        {}
        {result !== null && (
          <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-3xl p-16 text-center border-8 border-white shadow-2xl animate-bounce relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
            <Trophy className="w-32 h-32 mx-auto mb-6 text-white" style={{ animation: 'spin 2s linear infinite, bounce 1s ease-in-out infinite' }} />
            <h2 className="text-7xl font-bold text-white mb-6" style={{ textShadow: '0 0 30px rgba(0, 0, 0, 0.5)' }}>
              RÉSULTAT FINAL
            </h2>
            <div className="relative inline-block">
              <div className="text-9xl font-black text-white drop-shadow-2xl animate-pulse" style={{ textShadow: '0 0 50px rgba(255, 255, 255, 0.8)' }}>
                {result}
              </div>
              <div className="absolute inset-0 text-9xl font-black text-yellow-300 blur-2xl opacity-70 animate-ping" />
            </div>
            <p className="text-3xl text-white mt-8 italic font-bold">
              Mission accomplie avec succès spectaculaire ! 
            </p>
            <div className="flex justify-center gap-4 mt-8 flex-wrap">
              {[...Array(20)].map((_, i) => (
                <Star
                  key={i}
                  className="text-white"
                  style={{
                    animation: `bounce ${0.5 + (i % 3) * 0.2}s ease-in-out infinite, spin ${2 + i * 0.1}s linear infinite`,
                    animationDelay: `${i * 0.05}s`,
                    filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {}
        {!isCalculating && result === null && (
          <div className="text-center text-gray-300 mt-8 bg-gray-800 bg-opacity-50 rounded-2xl p-6">
            <p className="text-2xl font-bold text-red-400 animate-pulse mb-2">
               ATTENTION: PROCESSUS ULTRA-COMPLEXE 
            </p>
            <p className="text-xl">
              Le calcul peut prendre jusqu'à <span className="text-yellow-400 font-bold">60 SECONDES</span>
            </p>
            <p className="text-lg mt-2 italic text-gray-400">
              (25 étapes cosmiques pour une simple addition)
            </p>
            <p className="text-sm mt-4 text-green-400">
              Préparez-vous à un spectacle visuel DÉMENTIEL ! 
            </p>
          </div>
        )}
      </div>

      {}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: ['#ffffff', '#fbbf24', '#ec4899', '#8b5cf6'][i % 4],
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
              boxShadow: `0 0 10px ${['#ffffff', '#fbbf24', '#ec4899', '#8b5cf6'][i % 4]}`
            }}
          />
        ))}
      </div>
    </div>
  );
}