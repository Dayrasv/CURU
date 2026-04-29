import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [selectedInstitution, setSelectedInstitution] = useState("");

  return (
    <AppContext.Provider value={{ selectedInstitution, setSelectedInstitution }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
