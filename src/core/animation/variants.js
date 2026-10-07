export const EASE = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: EASE, delay: i * 0.08 },
  }),
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({ opacity: 1, transition: { duration: 0.8, ease: EASE, delay: i * 0.08 } }),
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: (i = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE, delay: i * 0.06 } }),
}

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: EASE } },
}
