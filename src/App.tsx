import Header from '@organisms/Header' // si no usas alias: './components/organisms/Header'
import Hero from '@organisms/Hero'
import Services from '@organisms/Services'
import Contact from '@organisms/Contact'

export default function App() {
    return (
        <>
            <Header />
            <Hero />
            <Services />
            <Contact />
        </>
    )
}
