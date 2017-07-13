import React from 'react'
import {connect} from "react-redux";
import {addItem} from "../../actions/items";

let AddItemComponent = ({dispatch}) => {
    let name;
    let value;
    let description;

    return (
        <div>
            <input ref={node => {
                name = node;
            }} size="40"/>
            <input ref={node => {
                value = node;
            }} size="10"/>
            <input ref={node => {
                description = node;
            }} size="20"/>
            <button onClick={() => {
                const item = {
                    name: name.value,
                    value: value.value,
                    description: description.value,
                    completed: false
                };
                addItem(item)(dispatch);

                name.value = '';
                value.value = '';
                description.value = '';
            }}>
                Add Item
            </button>
        </div>
    );
};

export default connect()(AddItemComponent);
