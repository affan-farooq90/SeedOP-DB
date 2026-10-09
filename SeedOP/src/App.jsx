import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Modal from "./components/Modal";
import EditModal from "./components/EditModal";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/ReactToastify.css'


function App() {
  const [seedPhrase, setSeedPhrase] = useState(false);
  const [privateKey, setPrivateKey] = useState(false);
  const [Item, setItem] = useState([]);

  const [seedPhraseValues, setseedPhraseValues] = useState([]);
  const [privateKeyValue, setprivateKeyValue] = useState("");
  const [walletName, setwalletName] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);



  // Load Items from the Mongodb Backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/wallets',{method:"GET"});
        const data = await response.json();
        setItem(data)
      }catch(error){
        console.error(error)
      }
    }
    fetchItems()
  },[Item])
  
  // Save items to MongoDB backend
  const saveToDB = async (data) => {
    const response = await fetch("http://localhost:3000/api/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return await response.json(); // Return the saved item
};

  const handleAddItem = async () => {
    if (walletName) {
        let newItem = {};
        if (seedPhrase) {
            const inputValues = [];
            for (let i = 1; i <= 12; i++) {
                const inputValue = document.getElementById(`seed-input-${i}`).value;
                inputValues.push(inputValue);
            }
            newItem = { walletName, seedPhrase: inputValues };
        } else if (privateKey) {
            newItem = { walletName, privateKey: privateKeyValue };
        }
        const savedItem = await saveToDB(newItem); // Save to DB and get the saved item
        setItem((prevItems) => [...prevItems, savedItem]); // Add saved item to state
        notify("Saved");
        resetFields();
    } else {
        notify("Missing");
        resetFields();
    }
};

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Wallet?");
    if (!confirmDelete) return;
    try{
      const newItems = Item.filter((item) => item._id !== id);
      setItem(newItems);

      const response = await fetch(`http://localhost:3000/api/wallets/${id}`, {
        method:"DELETE",
      });

      if(!response.ok) {
        throw new Error(response.statusText);
      }
      notify("Deleted") 

    } catch(error) {
      setItem(Item);
      console.error("Error Deleting Wallet:", error);
      notify("delError")
    }
    
  };

  const handleEdit = (id) => {
    const itemToEdit = Item.find((item) => item._id === id);
    if (itemToEdit) {
      setEditItem(itemToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleSave = (updatedItem) => {
    const updatedItems = Item.map((item) =>
      item._id === updatedItem._id ? updatedItem : item
    );
    setItem(updatedItems);
    saveToDB(updatedItems); // Save to DB after editing
  };

  const resetFields = () => {
    setwalletName("");
    setprivateKeyValue("");
    setseedPhraseValues([]);
    document.querySelectorAll(".seedfields input").forEach((input) => (input.value = ""));
    setSeedPhrase(false);
    setPrivateKey(false);
  };

  const handleToggle = (e) => {
    if (e.target.id === "Seed") {
      setSeedPhrase(true);
      setPrivateKey(false);
    } else if (e.target.id === "Key") {
      setSeedPhrase(false);
      setPrivateKey(true);
    }
  };

  const handleSaveEditedItem = async (updatedItem) => {
    try {
        const response = await fetch(`http://localhost:3000/api/wallets/${updatedItem._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem),
        });
        const result = await response.json();

        // Update the local state with the edited item
        const updatedItems = Item.map((item) =>
            item._id === result._id ? result : item
        );
        setItem(updatedItems);
        notify("Edited"); // Notify user about the edit
        handleCloseEditModal(); // Close the edit modal
    } catch (error) {
        console.error("Error updating item:", error);
        notify("Error updating item");
    }
};

  const handleShow = (id) => {
    const itemToShow = Item.find((item) => item._id === id);
    if (itemToShow) {
      setSelectedItem(itemToShow);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditItem(null);
  };

  const handleNameChange = (e) => {
    setwalletName(e.target.value);
  };

  const handleKeyChange = (e) => {
    setprivateKeyValue(e.target.value);
  };

  const notify = (state , name) => {
    if(state === "Saved"){
      toast.success("Item Added Succesfully");
    }
    else if(state === "Deleted"){
      toast.error(`Item Deleted Succesfully`);
    }
    else if(state === "Edited"){
      toast.success("Item Edited Succesfully")
    }
    else if(state === "Missing"){
      toast.warning("Missing Fields Required!")
    }
    else if(state === "Copied"){
      toast.info("Text Copied!")
    }
    
  };

  return (
    <>

    <div>
      {/* Toast container to display the toast notifications */}
      <ToastContainer 
      className={' antialiased '}
        position="top-right" 
        autoClose={2000} 
        hideProgressBar={false} 
        newestOnTop={true} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss
        pauseOnHover={false}
        draggable 
        theme="dark"
      />
    </div>

      <Navbar />
      
      <div className="bg-[#ddfedfbf] min-h-[90vh] flex flex-col items-center p-8">
        <div className="header flex flex-col items-center">
          <h1 className="text-[--primary-text] text-3xl font-semibold  ">
            <span className="text-[--buttons-secondary]">&lt;</span> Seed
            <span className="text-[--buttons-secondary]">OP</span>
            <span className="text-[--buttons-secondary]">/ &gt;</span>{" "}
          </h1>
          <p className="text-sm head ">Your Own Seed Phrase / Private Key Manager</p>
        </div>

        <div className="form flex flex-col mt-10 gap-4 w-[50vw] items-center">
          <input
            type="text"
            required
            className="w-[50vw] rounded-xl border px-2 py-1 text-sm "
            placeholder="Name of Your Wallet"
            id="walletname"
            value={walletName}
            onChange={handleNameChange}
          />
          <div className="checks flex flex-col items-center">
            <div className="checklabels flex gap-2 font-medium">
              <label htmlFor="Seed">Seed-Phrase</label>
              <label htmlFor="Key">Private-Key</label>
            </div>
            <div className="check flex gap-16">
              <input
                type="radio"
                name="toggle"
                checked={seedPhrase}
                onChange={handleToggle}
                id="Seed"
              />
              <input
                type="radio"
                name="toggle"
                checked={privateKey}
                onChange={handleToggle}
                id="Key"
              />
            </div>
          </div>
          {seedPhrase && (
            <div className="seedfields grid gap-2 place-items-center w-[100%] text-center ">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i + 1} className="flex items-center min-w-[33%]">
                  <span className="w-6">{i + 1}</span>
                  <input id={`seed-input-${i + 1}`} type="text" className=" w-full" />
                </div>
              ))}
            </div>
          )}

          {privateKey && (
            <div className="keyfield text-center mt-4 w-[50vw]">
              <input
                className="w-[50vw] rounded-xl border px-2 py-1 text-sm "
                placeholder="Your Private Key"
                type="text"
                id="private-key-input"
                value={privateKeyValue}
                onChange={handleKeyChange}
              />
            </div>
          )}

          <button
          title="Save"
            className="bg-green-500 w-max p-3 px-4 text-lg font-medium text-center border border-black rounded-2xl flex items-center gap-1"
            onClick={handleAddItem}>
            <img width={'20px'} src="/save.svg" alt="Save" />
          </button>
        </div>

        <div className="main w-[75vw] px-6 mt-2">
          <h1 className="text-left text-xl font-bold">
            Your Seed Phrases / Private Keys
          </h1>
          {Item.length === 0 ? (
            <p>No Saved Items</p>
          ) : (
            <div className="content">
              <div className="main-header bg-green-700 text-white flex  font-medium py-2 px-10  border rounded-md w-[100%] ">
                <h2 className="text-left w-[33.33%]">
                  Wallet Name
                </h2>
                <h2 className="text-center w-[33.33%]">
                  Seed Phrase / Private Key
                </h2>
                <h2 className="text-right w-[33.33%]">Actions</h2>
              </div>

              <div className="main-content w-[100%]">
                <ul className="w-[100%]">
                  {Item.map((item) => (
                    <li
                      key={item._id}
                      className="bg-green-200 flex border rounded-md py-1  items-center  "
                    >
                      <p className=" walletname text-left px-14 w-[33.33%]">
                        {item.walletName}
                      </p>

                      <div className="text-center flex justify-center gap-2 w-[33.33%]">
                        {item.seedPhrase ? (
                          <p className="text-center">SeedPhrase</p>
                        ) : (
                          <p className="text-center">Private Key</p>
                        )}
                        <button title="Show" onClick={() => handleShow(item._id)}>
                          <img width={'32px'} src="/eye-off.svg" alt="Show" />
                        </button>
                      </div>

                      <div className="text-right actions flex gap-2 justify-end px-8 w-[33.33%]">
                        <button title="Edit" onClick={() => handleEdit(item._id)}>
                          <img width={'32px'} src="/pen.svg" alt="Edit" />
                        </button>
                        <button title="Delete" onClick={() => handleDelete(item._id)}>
                        <img width={'32px'} src="/del.svg" alt="Delete" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} item={selectedItem} notify={notify}/>

        <EditModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} item={editItem} privateKeyValue={privateKeyValue} handleKeyChange={handleKeyChange} 
        setPrivateKeyValue={setprivateKeyValue} seedPhraseValues={seedPhraseValues} setSeedPhraseValues={setseedPhraseValues} onSave={handleSaveEditedItem}/>
        
      </div>
    </>
  );
}

export default App;
