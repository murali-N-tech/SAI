import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/layout/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm',
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  )
}

export default App