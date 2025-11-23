import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-emerald-50">
      {/* Light Base Background */}
      <div className="absolute inset-0 bg-[#f0fdf4]"></div>

      {/* Moving Gradient Mesh */}
      <div
        className="absolute inset-0 opacity-60 animate-gradient-xy"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(167, 243, 208, 0.4), transparent 50%),
            radial-gradient(circle at 0% 0%, rgba(110, 231, 183, 0.3), transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(134, 239, 172, 0.3), transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(94, 234, 212, 0.3), transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(167, 243, 208, 0.3), transparent 50%)
          `,
          backgroundSize: '200% 200%',
          filter: 'blur(60px)',
        }}
      ></div>

      {/* Noise Texture for robustness/texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-multiply pointer-events-none"></div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,#f0fdf4_100%)] pointer-events-none"></div>
    </div>
  );
};

export default Background;
