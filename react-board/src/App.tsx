import './App.css'
import { Board } from './components/BoardComponent/Board'
import { Routes, Route } from "react-router-dom";
export const App = () => {

  return (
    <>
      <Routes>
  <Route
    path="/"
    element={
      <section id="center">
        <Board />
      </section>
    }
  />

  <Route
    path="/tasks/:id"
    element={
      <div
        style={{
          padding: 40,
          color: "white",
          background: "#0f172a",
          minHeight: "100vh",
        }}
      >
        Task Details Page
      </div>
    }
  />
</Routes>
    </>
  )
}
