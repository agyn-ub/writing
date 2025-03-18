'use client';

export function AnimationStyles() {
  return (
    <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes bounceIn {
        0% { transform: scale(0.8); opacity: 0; }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
      }
      
      .animate-fade-in {
        animation: fadeIn 1s ease-out;
      }
      
      .animate-slide-up {
        animation: slideUp 1s ease-out 0.3s both;
      }
      
      .animate-bounce-in {
        animation: bounceIn 1s ease-out 0.6s both;
      }
      
      .hover\:-translate-y-1:hover {
        transform: translateY(-4px);
        transition: transform 0.3s ease;
      }
    `}</style>
  );
} 