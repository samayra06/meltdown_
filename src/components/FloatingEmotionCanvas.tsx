import { useEffect, useState } from "react";
import { OrbMemory, saveOrb, subscribeToOrbs } from "../lib/firestore";

export default function FloatingEmotionCanvas() {
  const [orbs, setOrbs] = useState<OrbMemory[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToOrbs(setOrbs);
    return () => unsubscribe(); // Clean up on unmount
  }, []);

  const handleAddOrb = async () => {
    const newOrb: Omit<OrbMemory, "id"> = {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 100 + Math.random() * 50,
      color: getRandomColor(),
      preview: "this is a meltdown moment",
      fullText: "this is what it feels like to melt inside a memory.",
      timestamp: new Date().toISOString(),
    };

    await saveOrb(newOrb);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#5a0000]">
      {/* RENDER ALL ORBS */}
      {orbs.map((orb, index) => (
        <div
          key={orb.id || index}
          className="absolute rounded-full text-white text-xs p-2 flex items-center justify-center"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            backgroundColor: orb.color || "rgba(255,255,255,0.2)",
            boxShadow: "0 0 20px rgba(255,255,255,0.2)",
            animation: "float 12s ease-in-out infinite",
            animationDelay: `${index * 0.2}s`,
            fontFamily: "droid sans mono, sans-serif",
            textTransform: "lowercase",
            borderRadius: "9999px",
            position: "absolute",
          }}
        >
          <span className="text-center">{orb.preview}</span>
        </div>
      ))}

      {/* ADD TEST ORB BUTTON */}
      <button
        onClick={handleAddOrb}
        className="absolute bottom-4 left-4 bg-white text-[#5a0000] px-4 py-2 rounded-2xl text-xs font-bold"
      >
        Add Orb
      </button>
    </div>
  );
}

function getRandomColor() {
  const palette = ["#ff8ca3", "#ffe9ee", "#fa6a6a", "#fff3f3", "#ffb6c1"];
  return palette[Math.floor(Math.random() * palette.length)];
}
