"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface ModalContextType {
  isMicModalOpen: boolean;
  isSpeakerModalOpen: boolean;
  toggleMicModal: () => void;
  toggleSpeakerModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isMicModalOpen, setMicModalOpen] = useState(false);
  const [isSpeakerModalOpen, setSpeakerModalOpen] = useState(false); 

  const toggleMicModal = useCallback(() => {
    setMicModalOpen((prev) => !prev);
  }, []);

  const toggleSpeakerModal = useCallback(() => {
    setSpeakerModalOpen((prev) => !prev);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isMicModalOpen,
        isSpeakerModalOpen,
        toggleMicModal,
        toggleSpeakerModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
