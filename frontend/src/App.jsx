import { useEffect, useState } from 'react'
import PWABadge from './PWABadge.jsx'

function getUrlImage(urlBase) {
  const random = Math.floor(Math.random() * 1000)
  return `${urlBase}?random=${random}`
}

function Image({ url }){
  return(
    <img src={ url } className='object-cover h-full w-full hover:scale-105 transition-transform duration-300 cursor-pointer'></img>
  )
}

function Gallery({urlBase}){
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargarGaleria() {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setLoading(false)
    }
    cargarGaleria()
  }, [])

  if (loading) {
    return <p className="text-xl font-medium">Cargando...</p>
  }

  return(
    <div className="grid grid-cols-3 gap-4">
      <Image url={ getUrlImage(urlBase) }  />
      <Image url={ getUrlImage(urlBase) }  />
      <Image url={ getUrlImage(urlBase) }  />
      <Image url={ getUrlImage(urlBase) }  />
      <Image url={ getUrlImage(urlBase) }  />
      <Image url={ getUrlImage(urlBase) }  />
    </div>
  )
}

function Header() {
  return (
    <header className="flex flex-col items-center gap-2">
      <h1 className="text-3xl font-bold">Galeria de fotografia</h1>
      <p>Proyecto para la biblioteca de la Utl</p>
    </header>
  )
}

function App() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-4 p-24 bg-amber-50">
        <Header />
        <Gallery urlBase="https://picsum.photos/300/200" />
      </main>
      <PWABadge />
    </>
  )
}

export default App