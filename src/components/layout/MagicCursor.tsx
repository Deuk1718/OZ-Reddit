'use client'

import { useEffect } from 'react'

const COLORS = ['#9f1fef', '#00f2ff', '#f0e8ff', '#c084fc', '#38bdf8']

export function MagicCursor() {
  useEffect(() => {
    const particles: HTMLDivElement[] = []

    function spawnParticle(x: number, y: number) {
      const el = document.createElement('div')
      const size = Math.random() * 6 + 3
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 2 + 1
      const vx = Math.cos(angle) * speed
      const vy = Math.sin(angle) * speed - 2

      el.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        opacity: 1;
        transform: scale(1);
        transition: none;
      `

      document.body.appendChild(el)
      particles.push(el)

      let frame = 0
      const maxFrames = 30 + Math.floor(Math.random() * 20)
      let cx = x - size / 2
      let cy = y - size / 2
      let vy2 = vy

      function animate() {
        frame++
        vy2 += 0.12
        cx += vx
        cy += vy2
        const progress = frame / maxFrames
        el.style.left = `${cx}px`
        el.style.top = `${cy}px`
        el.style.opacity = `${1 - progress}`
        el.style.transform = `scale(${1 - progress * 0.5})`

        if (frame < maxFrames) {
          requestAnimationFrame(animate)
        } else {
          el.remove()
          const idx = particles.indexOf(el)
          if (idx !== -1) particles.splice(idx, 1)
        }
      }

      requestAnimationFrame(animate)
    }

    let lastX = 0
    let lastY = 0
    let throttle = 0

    function onMouseMove(e: MouseEvent) {
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 4) return

      throttle++
      if (throttle % 2 !== 0) return

      lastX = e.clientX
      lastY = e.clientY

      const count = Math.min(Math.floor(dist / 8) + 1, 3)
      for (let i = 0; i < count; i++) {
        spawnParticle(e.clientX, e.clientY)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      particles.forEach((p) => p.remove())
    }
  }, [])

  return null
}
