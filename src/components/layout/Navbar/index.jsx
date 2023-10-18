import React from 'react'
import styles from './index.module.css'

const Navbar = () => {
  return (
    <div className={styles.containerFull}>
        <div className={styles.leftSide}>logo</div>
        <div className={styles.rightSide}>
            <ul className={styles.ul}>
                <li>Home</li>
                <li>About Us</li>
                <li>Contact Us</li>
            </ul>
        </div>
    </div>
  )
}

export default Navbar