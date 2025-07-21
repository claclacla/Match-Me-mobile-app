import { useState } from "react";
import PhoneNumberInput from "../PhoneNumberInput";

interface UsernameInputProps {
    setUsername: (value: string) => void
}

const UsernameInput: React.FC<UsernameInputProps> = ({
    setUsername
}) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedPrefix, setSelectedPrefix] = useState('+39');

    const handleSetPhoneNumber = (value: string) => {
        setPhoneNumber(value);
        setUsername(selectedPrefix + value);
    };

    const handleSetSelectedPrefix = (value: string) => {
        setSelectedPrefix(value);
        setUsername(value + phoneNumber);
    };

    return (
        <PhoneNumberInput
            phoneNumber={phoneNumber}
            setPhoneNumber={handleSetPhoneNumber}
            selectedPrefix={selectedPrefix}
            setSelectedPrefix={handleSetSelectedPrefix}
        />
    );
};

export default UsernameInput;