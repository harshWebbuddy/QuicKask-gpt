import React, { Dispatch, SetStateAction } from "react";
import Modal from "react-modal";
import Locale from "../locales";

type Props = {
  modalState: boolean;
  setModalState: Dispatch<SetStateAction<boolean>>;
};

const SubAlertModal = ({ modalState, setModalState }: Props) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      color: "#000",
      transform: "translate(-50%, -50%)",
      padding: "30px 40px 50px 40px",
      width: "30%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0,0, .5)",
    },
  };

  return (
    <Modal
      isOpen={modalState}
      onRequestClose={() => setModalState(false)}
      style={customStyles}
      contentLabel="Subscription Modal"
    >
      <div className="modal-wrapper">
        <h2>{Locale.LoginPage.Modal.title}</h2>
        <span onClick={() => setModalState(false)}>x</span>
      </div>

      <div className="modal-content">
        <p>{Locale.LoginPage.Modal.description}</p>
        <button
          onClick={() => {
            setModalState(false);
            window.open("https://my.dogai.com/login", "_blank");
          }}
        >
          {Locale.LoginPage.Modal.buttonText}
        </button>
      </div>
    </Modal>
  );
};

export default SubAlertModal;
