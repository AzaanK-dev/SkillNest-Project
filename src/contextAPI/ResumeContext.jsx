import { createContext, useState } from "react";

export const ResumeContext = createContext();

const ResumeProvider = ({ children })=>{
  const [formData, setFormData] = useState(null);

  return (
    <ResumeContext.Provider value={{ formData, setFormData }}>
      {children}
    </ResumeContext.Provider>
  );
}

export default ResumeProvider;