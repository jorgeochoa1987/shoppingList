"use client"
import { useState } from "react";

const productos = [
    {
        id: 11,
        name: "Prueba de jorge ",
        quantity: 100,
        price: 500,
        store: "Twich"
    },
    {
        id: 22,
        name: "Item 2",
        quantity: 2,
        price: 200,
        store: "Y-Mart"
    },
    {
        id: 9,
        name: "Item 3",
        quantity: 3,
        price: 300,
        store: "Z-Mart"
    },
    {
        id: 10,
        name: "Item 4",
        quantity: 4,
        price: 400,
        store: "W-Mart"
    }, {
       id:90,
        name: "Item 5",
        quantity: 4,
        price: 400,
        store: "W-Mart"
    },
]

export default function List() {
    const [items, setItems] = useState(productos);
    return <>
        {items.map((item, index) => (
            <li key={index}>
                <span> ID: </span>{index}
                <span> Nombre: </span>{item.name}
                <span> Cantidad: </span>{item.quantity}
                <span> Precio: </span>{item.price}
                <span> Tienda: </span>{item.store}
            </li>
        ))}
    </>;
}