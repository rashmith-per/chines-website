import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { EASE } from './variants'
import { cn } from '@/core/lib/cn'

/**
 * Masked word-by-word headline reveal.
 * Use `\n` in `text` to force line breaks; wrap words in *asterisks* to accent them.
 */
export function SplitText({ text, className, wordClassName, delay = 0, stagger = 0.06, as = 'h2', once = true }) {
  const Comp = motion[as] ?? motion.h2
  const lines = text.split('\n')
  let index = 0
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.4 }}
      aria-label={text.replaceAll('*', '').replaceAll('\n', ' ')}
    >
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden>
          {line.split(' ').map((raw, wi) => {
            const accent = raw.startsWith('*') && raw.endsWith('*')
            const word = accent ? raw.slice(1, -1) : raw
            const i = index++
            return (
              <span key={wi} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                <motion.span
                  className={cn('inline-block', accent && 'italic text-gradient-gold', wordClassName)}
                  variants={{
                    hidden: { y: '110%', rotate: 4 },
                    show: { y: '0%', rotate: 0, transition: { duration: 1, ease: EASE, delay: delay + i * stagger } },
                  }}
                >
                  {word}
                </motion.span>
                {' '}
              </span>
            )
          })}
        </span>
      ))}
    </Comp>
  )
}

/**
 * Scrollytelling paragraph — each word lights up as the reader scrolls through it.
 */
export function ScrollHighlightText({ text, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={cn('flex flex-wrap', className)}>
      {words.map((w, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return <Word key={i} progress={scrollYProgress} range={[start, end]} word={w} />
      })}
    </p>
  )
}

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const accent = word.startsWith('*') && word.endsWith('*')
  return (
    <span className="relative mr-[0.25em]">
      <motion.span style={{ opacity }} className={cn(accent && 'italic text-gradient-gold')}>
        {accent ? word.slice(1, -1) : word}
      </motion.span>
    </span>
  )
}
