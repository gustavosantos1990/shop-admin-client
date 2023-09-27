import { Menubar } from 'primereact/menubar';
import './Header.css';

export default function Header() {
    
    const items = [
        {label: 'Produtos'},
        {label: 'Componentes de Produtos'}
    ];

    return(
        <header>
            <Menubar model={items}/>
        </header>
    );
}