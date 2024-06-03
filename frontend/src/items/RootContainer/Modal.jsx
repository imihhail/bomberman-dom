
import styles from "./Modal.module.css"

const Modal = () => {
  return (
    <div className={styles.backdrop}>
        <div className={styles.loader}></div>
    </div>
  )
}

export default Modal