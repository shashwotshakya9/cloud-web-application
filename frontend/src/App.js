import { useState, useEffect, useCallback } from "react";
import './index.css'; 

function App() {
    // stating variables
    const [contacts, getContacts] = useState([]);
    const [newContactName, setNewContactName] = useState("");
    const [isDivVisible, setDivVisibility] = useState(false);
    const [statsData, setStatsData] = useState(null);

    // function to fetch data from an API
    const fetchData = async (url, options = {}) => {
        const response = await fetch(url, options);
        return response.json();
    };

    // function to fetch contacts from the API
    const fetchContacts = useCallback(async () => {
        try {
            const data = await fetchData("http://localhost:5000/api/contacts");
            getContacts(data);
        } catch (error) {
            console.log("Error fetching data:", error);
        }
    }, []); // empty dependency array means this is only called on mount

    // fetch contacts when mounting or when fetchContacts changes
    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    // function to create a new contact
    const createContact = async (name) => {
      if (name.trim() === "") {
          alert("Contact name cannot be blank");
          return;
      }
      try {
          await fetchData("http://localhost:5000/api/contacts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name }),
          });
          // clear the input text
          setNewContactName("");
          fetchContacts();
      } catch (error) {
          console.log("Error:", error);
      }
  };

  // function to delete a contact
  const deleteContact = async (contactId) => {
    try {
        const response = await fetchData(`http://localhost:5000/api/contacts/${contactId}`, {
            method: "DELETE",
        });

        if (response.message === 'update or delete on table "contacts" violates foreign key constraint "phones_contactId_fkey" on table "phones"') {
            alert("Delete the phone numbers associated with the contact first.");
        } else {
            fetchContacts();
        }
    } catch (error) {
        console.log("Error:", error);
        
    }
    };

    // function to fetch statistics data
    const fetchStatsData = async () => {
        try {
          const response = await fetchData('http://localhost:5000/api/stats');
          if (response) {
            const data = await response;
            setStatsData(data); // Store stats data in state
          } else {
            console.log('Error fetching statistics.');
          }
        } catch (error) {
          console.log('Error:', error);
        }
      };

    // function to toggle the visibility of stats div
      const toggleDiv = () => {
        setDivVisibility(!isDivVisible);
        if (isDivVisible) {
          setStatsData(null);
        } else {
          fetchStatsData();
        }
      };

      // Function to refresh statistics data
    const refreshStats = () => {
        fetchStatsData();
    };

    return (
        <div className="contentTitle">
          <h1>Contactor</h1>
          <div className="container">
            <div className="mainContainer">
              <h2 className="header">Contacts</h2>
              <div className="contactForm">
                <input
                  className="input"
                  type="text"
                  placeholder="Name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                />
                <button className="buttonAdd" onClick={() => createContact(newContactName)}>
                  Create Contact
                </button>
              </div>
              <hr />
              <div className="contactList">
              <div className="scrollable-container">
                {contacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    deleteContact={deleteContact}
                    fetchData={fetchData}
                  />
                ))}
              </div>
              </div>
            </div>
            <div className="footer">
            <p>Click a contact to view associated phone numbers</p>
            </div>
            <div>
                <div className="showButton" onClick={toggleDiv}>
                    {isDivVisible ? 'Hide Stats' : 'Show Stats'}
                </div>
                {isDivVisible && (
                    <div className="container-stats">
                        {statsData ? (
                            <div className="center-text">
                            <p><b>Total Contacts:</b> <br />{statsData.totalContacts}</p>
                            <p><b>Total Phones:</b> <br />{statsData.totalPhones}</p>
                            <p><b>Newest Contact Timestamp:</b><br /> {statsData.newestContactTimestamp}</p>
                            <p><b>Oldest Contact Timestamp:</b><br /> {statsData.oldestContactTimestamp}</p>
                            <button className="showButton" onClick={refreshStats}>
                                Refresh Stats
                            </button>
                            </div>
                        ) : (
                            <p>Loading stats...</p>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>

);
}

function ContactCard({ contact, deleteContact, fetchData }) {
    //Defining required variables
    const [phones, setPhones] = useState([]);
    const [phoneName, setPhoneName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showDetails, setShowDetails] = useState(false);

    //function to fetch phones 
    const fetchPhones = async () => {
        try {
            const data = await fetchData(`http://localhost:5000/api/contacts/${contact.id}/phones`);
            setPhones(data);
        } catch (error) {
            console.log("Error fetching phones:", error);
        }
    };

    useEffect(() => {
        fetchPhones();
    }, [contact.id, fetchData]);

     //function to add phones
    const addPhone = async () => {
        if (!phoneName.trim() || !phoneNumber.trim()) {
        alert("Both phone name and number are required!");
        return;
        }
        try {
        await fetchData(`http://localhost:5000/api/contacts/${contact.id}/phones`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            name: phoneName,
            number: phoneNumber,
            contactId: contact.id
            }),
        });
        setPhoneName("");
        setPhoneNumber("");
        fetchPhones();
        } catch (error) {
        console.log("Error adding phone:", error);
        }
    };

      //function to delete phones
    const deletePhone = async (phoneId) => {
        try {
        await fetchData(`http://localhost:5000/api/contacts/${contact.id}/phones/${phoneId}`, {
            method: "DELETE",
        });
        fetchPhones();
        } catch (error) {
        console.log("Error deleting phone:", error);
        }
    };

    return (
        <div className="contactCard">
          <div
            className="details"
            onClick={() => setShowDetails(!showDetails)}
          >
            <div className="contactName">{contact.name}</div>
            <button className="contactDeleteButton" onClick={(e) => { e.stopPropagation(); deleteContact(contact.id); }}>
              Delete
            </button>
          </div>
          {showDetails && (
            <div>
            <hr />
              <div className="phoneInput">
                <input
                  className="input"
                  placeholder="Name"
                  value={phoneName}
                  onChange={(e) => setPhoneName(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <button className="buttonAdd" onClick={addPhone}>Add</button>
              </div>
              <table className="table">
                <thead>
                  <tr className="row">
                    <th className="headerCell">Name</th>
                    <th className="headerCell">Number</th>
                    <th className="headerCell"></th>
                  </tr>
                </thead>
                <tbody>
                  {phones.map(phone => (
                    <tr key={phone.id} className="row">
                      <td className="cell">{phone.name}</td>
                      <td className="cell">{phone.number}</td>
                      <td className="cell lastCell">
                        <button className="buttonDelete" onClick={() => deletePhone(phone.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
}

export default App;