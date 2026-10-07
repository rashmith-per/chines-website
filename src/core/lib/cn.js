import clsx from 'clsx'

/** Compose class names (thin clsx wrapper so the implementation can change in one place). */
export const cn = (...inputs) => clsx(inputs)
