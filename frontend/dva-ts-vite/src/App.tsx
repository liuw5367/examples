import { useState } from "react";
import "./App.css";
import DvaExample from "./DvaExample";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <DvaExample />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </div>
  );
}

export default App;
