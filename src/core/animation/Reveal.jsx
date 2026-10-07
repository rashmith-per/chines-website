import { motion } from 'framer-motion'
import { fadeUp, stagger } from './variants'

/** Fades + lifts children into view once. */
export function Reveal({ as = 'div', children, delay = 0, variants = fadeUp, amount = 0.25, className, ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      custom={delay}
      {...rest}
    >
      {children}
    </Comp>
  )
}

/** Parent that staggers any `RevealItem` children. */
export function RevealGroup({ as = 'div', children, className, gap = 0.08, amount = 0.15, ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp
      className={className}
      variants={stagger(gap)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      {...rest}
    >
      {children}
    </Comp>
  )
}

export function RevealItem({ as = 'div', children, className, variants = fadeUp, ...rest }) {
  const Comp = motion[as] ?? motion.div
  return (
    <Comp className={className} variants={variants} {...rest}>
      {children}
    </Comp>
  )
}
