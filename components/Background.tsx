import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-black">
      {/* Deep Base Background */}
      <div className="absolute inset-0 bg-[#020617]"></div>

      {/* Moving Gradient Mesh */}
      <div
        className="absolute inset-0 opacity-40 animate-gradient-xy"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(6, 78, 59, 0.4), transparent 50%),
            radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.3), transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(34, 197, 94, 0.3), transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(20, 184, 166, 0.3), transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(5, 150, 105, 0.3), transparent 50%)
          `,
          backgroundSize: '200% 200%',
          filter: 'blur(60px)',
        }}
      ></div>

      {/* Noise Texture for robustness/texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,#020617_100%)] pointer-events-none"></div>
    </div>
  );
};

export default Background;
