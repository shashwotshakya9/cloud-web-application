import { useState, useEffect } from 'react';  // import useEffect
import './App.css';

function App() {
    const [name, setName] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your logic for creating a contact here
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      color: 'black',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    form: {
      marginBottom: '20px',
    },
    input: {
      marginRight: '10px',
    },
    button: {
      backgroundColor: 'green',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} style={styles.input} />
        </label>
        <input type="submit" value="Create Contact" style={styles.button} />
      </form>
      <p>Click a contact to view associated phone numbers</p>
      <button style={styles.button}>Show Stats</button>
    </div>
  );
}

export default App;