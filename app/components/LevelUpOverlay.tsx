'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Trophy, Sparkles, Star, Crown, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LevelUpOverlayProps {
    newLevel: string
    onClaim: () => Promise<any>
}

export default function LevelUpOverlay({ newLevel, onClaim }: LevelUpOverlayProps) {
    const [isOpen, setIsOpen] = useState(true)
    const [isClaiming, setIsClaiming] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (isOpen) {
            // Initial burst
            triggerConfetti()
            // Periodic bursts
            const interval = setInterval(() => {
                triggerSideConfetti()
            }, 2000)
            return () => clearInterval(interval)
        }
    }, [isOpen])

    const triggerConfetti = () => {
        const count = 200;
        const defaults = { origin: { y: 0.7 } };

        function fire(particleRatio: number, opts: any) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, { spread: 26, startVelocity: 55, colors: ['#FFD700', '#FFA500'] });
        fire(0.2, { spread: 60, colors: ['#00FFFF', '#FF00FF'] });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }

    const triggerSideConfetti = () => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FFD700', '#FFA500']
        });
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#FFD700', '#FFA500']
        });
    }

    const handleClaim = async () => {
        setIsClaiming(true)
        // Final massive explosion
        confetti({ particleCount: 500, spread: 360, startVelocity: 80, origin: { y: 0.5 } })

        await onClaim()
        // Small delay to let user see the button reaction
        setTimeout(() => {
             setIsOpen(false)
             router.refresh()
        }, 800)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-hidden"
            >
                {/* Rotating Sunburst Background */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-[200vmax] h-[200vmax] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_20deg,#FFD700_40deg,transparent_60deg,transparent_80deg,#FF4500_100deg,transparent_120deg)] opacity-20"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute w-[150vmax] h-[150vmax] bg-[conic-gradient(from_0deg,transparent_0deg,#00FFFF_40deg,transparent_80deg,#FF00FF_120deg,transparent_160deg)] opacity-20 mix-blend-screen"
                    />
                </div>

                <motion.div
                    initial={{ scale: 0.3, y: 300, rotateX: 60 }}
                    animate={{ scale: 1, y: 0, rotateX: 0 }}
                    transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                    className="relative w-full max-w-sm"
                >
                    {/* Floating Icons */}
                    <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -top-12 -left-8 text-yellow-400 z-20">
                        <Star size={40} fill="currentColor" />
                    </motion.div>
                    <motion.div animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute top-20 -right-10 text-cyan-400 z-20">
                        <Zap size={40} fill="currentColor" />
                    </motion.div>

                    {/* Main Card */}
                    <div className="bg-gradient-to-b from-yellow-500 via-orange-500 to-red-600 p-[3px] rounded-3xl shadow-[0_0_60px_rgba(255,165,0,0.6)]">
                        <div className="bg-gradient-to-br from-gray-900 to-black rounded-[22px] p-6 text-center relative overflow-hidden border border-white/10">

                            {/* Inner Shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 w-[200%]" />

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                                transition={{ delay: 0.3, type: "spring" }}
                                className="mb-6 relative inline-block"
                            >
                                <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-50 animate-pulse" />
                                <Crown className="w-24 h-24 text-yellow-300 relative z-10 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]" strokeWidth={1.5} />
                            </motion.div>

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="text-3xl font-black uppercase italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                            >
                                Level Up!
                            </motion.h2>

                            <div className="my-6 space-y-2">
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Nova patente desbloqueada</p>
                                <motion.div
                                    initial={{ scale: 0.5, filter: "blur(10px)" }}
                                    animate={{ scale: 1, filter: "blur(0px)" }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="bg-white/10 border-t border-white/20 p-4 rounded-xl backdrop-blur-lg"
                                >
                                    <span className="text-2xl font-black text-white drop-shadow-lg block bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300">
                                        {newLevel}
                                    </span>
                                </motion.div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleClaim}
                                disabled={isClaiming}
                                className="w-full relative overflow-hidden group bg-gradient-to-b from-green-400 to-green-600 text-white font-black py-4 rounded-xl text-lg shadow-[0_4px_0_#15803d] active:shadow-none active:translate-y-1 transition-all"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isClaiming ? 'RESGATANDO...' : 'RESGATAR RECOMPENSA'}
                                    {!isClaiming && <Sparkles className="w-5 h-5 animate-spin-slow" />}
                                </span>
                                {/* Button Shine */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-in-out skew-x-[-20deg]" />
                            </motion.button>

                            <p className="mt-4 text-[10px] text-gray-500">
                                Continue sua jornada para se tornar uma lenda de Terra Roxa.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
