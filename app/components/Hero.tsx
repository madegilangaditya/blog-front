'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import {ReactTyped} from 'react-typed'
import { useRef } from 'react'
import Image from "next/image";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
        <section
        ref={ref}
        className="
            relative
            h-screen
            bg-[url('/6.jpg')]
            bg-cover
            bg-center
            bg-fixed
            flex
            items-center
            justify-center
        "
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 text-center text-white"
            >
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                I&apos;m John Arnold
                </h1>

                <h2 className="text-2xl md:text-3xl font-light">
                <ReactTyped
                    strings={['Designer', 'Programmer', 'Photographer']}
                    typeSpeed={60}
                    backSpeed={40}
                    backDelay={1500}
                    loop
                />
                </h2>
            </motion.div>
        </section>
  )
}
