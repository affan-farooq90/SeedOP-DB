import React, { useEffect, useState } from "react";

const EditModal = ({
  isOpen,
  onClose,
  item,
  privateKeyValue,
  setPrivateKeyValue,
  seedPhraseValues,
  setSeedPhraseValues,
  onSave,
}) => {
  if (!isOpen) return null;

  useEffect(() => {
    // Clear previous values when modal opens
    setPrivateKeyValue("");
    setSeedPhraseValues([]);

    if (item) {
      if (item.privateKey) {
        setPrivateKeyValue(item.privateKey);
      }
      if (item.seedPhrase) {
        setSeedPhraseValues([...item.seedPhrase]);
      }
    }
  }, [item, setPrivateKeyValue, setSeedPhraseValues]);

  // Handle changes in seed phrase inputs
  const handleSeedPhraseChange = (index, value) => {
    const updatedSeedPhrase = [...seedPhraseValues];
    updatedSeedPhrase[index] = value;
    setSeedPhraseValues(updatedSeedPhrase);
  };

  const handleSave = () => {
    const updatedItem = { ...item };
    if (seedPhraseValues.length > 0) {
      updatedItem.seedPhrase = seedPhraseValues;
    } else {
      updatedItem.privateKey = privateKeyValue;
    }
    onSave(updatedItem);
    onClose(); // Call the onSave function with the updated item
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[hsla(125,87%,91%,0.95)] p-5 rounded-lg shadow-lg w-[60%] flex flex-col items-center edit-modal">
        <span className="flex gap-1 items-center my-2">
          <p className="font-medium">Wallet Name: </p>
          <p className="text-lg font-semibold">{item.walletName}</p>
        </span>

        {seedPhraseValues.length > 0 ? (
          <>
            <p className="text-lg font-bold mb-2">Seed Phrase:</p>
            <div className="seedfields grid gap-4 place-items-center w-[90%] text-center">
              {seedPhraseValues.map((phrase, index) => (
                <div key={index} className="flex items-center min-w-[33%]">
                  <span className="w-6">{index + 1}</span>{" "}
                  {/* Fixed width for numbers */}
                  <input
                  
                    id={`seed-input-${index + 1}`}
                    className="w-full" /* Adds some space and makes input responsive */
                    type="text"
                    value={phrase}
                    onChange={(e) =>
                      handleSeedPhraseChange(index, e.target.value)
                    }
                    aria-label={`Seed phrase ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="keyfield text-center mt-4 w-max flex gap-3">
            <p className="font-medium text-lg">Private Key:</p>
            <input
              className="w-[30vw] rounded-xl border px-2 py-1 text-sm"
              placeholder="Your Private Key"
              type="text"
              id="private-key-input"
              value={privateKeyValue}
              onChange={(e) => setPrivateKeyValue(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            <img width={"24px"} src="/close.svg" alt="Copy" />
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            <img width={"20px"} src="/save.svg" alt="Save" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
