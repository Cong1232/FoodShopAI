import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Bootstrap CSS (đưa vào trước style riêng của dự án để dễ override)
import 'bootstrap/dist/css/bootstrap.min.css'

// Style biến dùng chung (màu sắc, font...) và style toàn cục
import './assets/styles/variables.css'
import './assets/styles/global.css'
import './assets/styles/auth.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter đặt ở ngoài cùng để toàn bộ app dùng được React Router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
