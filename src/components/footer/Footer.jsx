import React, { useEffect } from 'react'
import './Footer.css';

export default function Footer() {

    useEffect(() => {
        console.log("starting Footer...");
      });

    return(
        <footer>
            <small>Gustavo de Almeida Santos &copy; 2023</small>
        </footer>
    );
}