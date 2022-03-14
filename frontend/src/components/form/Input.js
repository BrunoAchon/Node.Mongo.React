import styles from "./Input.module.css";

function Input({
    type,
    text,
    name,
    placeholder,
    handleOnChange,
    value,
    multiplo,
}) {
    return (
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}:</label>
            <input
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                onChange={handleOnChange}
                value={value}
                {...(multiplo) ? {multiplo} : ''} // se for um campo multiplo mostra varios senao mostra "nada"
            />
        </div>
    );
}

export default Input;
