import { useEffect } from 'react'

export function useWelcomeAnimation({
  welcomeTextRef,
  welcomeNameRef,
  welcomeDescriptionRef,
  loaderRef,
}) {
  useEffect(() => {

    // ELEMENTOS
    const welcomeText = welcomeTextRef.current
    const name = welcomeNameRef.current
    const description = welcomeDescriptionRef.current
    const loader = loaderRef.current

    if (!welcomeText || !name || !description || !loader) {
      return undefined
    }

    // SCROLL
    const handleScroll = () => {
      const scroll = window.scrollY

      // BIENVENIDO
      let welcomeOpacity = 1 - scroll / 150
      welcomeOpacity = Math.max(0, welcomeOpacity)
      welcomeText.style.opacity = welcomeOpacity

      // NOMBRE
      const scale = 1 + scroll / 250
      let nameOpacity = 1 - scroll / 450
      nameOpacity = Math.max(0, nameOpacity)
      name.style.transform = `scale(${scale})`
      name.style.opacity = nameOpacity

      // PORTAFOLIO PERSONAL
      let descriptionOpacity = 1 - scroll / 180
      descriptionOpacity = Math.max(0, descriptionOpacity)
      description.style.opacity = descriptionOpacity

      // LOADER
      let loaderOpacity = 1 - scroll / 100
      loaderOpacity = Math.max(0, loaderOpacity)
      loader.style.opacity = loaderOpacity
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [welcomeTextRef, welcomeNameRef, welcomeDescriptionRef, loaderRef])
}