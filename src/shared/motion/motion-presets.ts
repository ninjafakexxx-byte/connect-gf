export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};
