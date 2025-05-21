import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import "../Styles/BackButton.css"

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="back-button-container">
            <Button
                label="Back"
                icon="pi pi-arrow-left"
                onClick={handleBack}
                className="p-button-text gradient-back-button"
            />
        </div>
    );
};

export default BackButton;
