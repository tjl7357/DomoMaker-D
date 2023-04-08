// Imports
const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleDomo = (e) => {
    // Prevent Default and Hide Error Message
    e.preventDefault();
    helper.hideError();

    // Gets the Parameters
    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;

    // If There is a Missing Parameter
    if (!name || !age) {
        helper.handleError('All Fields Are Required!');
        return false;
    }

    // Sends the Post
    helper.sendPost(e.target.action, {name, age}, loadDomosFromServer);
    return false;
};

// Domo Form Component
const DomoForm = (props) => {
    return(
        <form id='domoForm'
            onSubmit={handleDomo}
            name='domoForm'
            action='/maker'
            method='POST'
            className='domoForm'
        >
            <label htmlFor='name'>Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name' />
            <label htmlFor='age'>Age: </label>
            <input id='domoAge' type='number' min='0' name='age' />
            <input className='makeDomoSubmit' type='submit' value='Make Domo' />
        </form>
    );
};

// Domo List Component
const DomoList = (props) => {
    // If there are no Domos
    if(props.domos.length === 0){
        return (
            <div className='domoList'>
                <h3 className='emptyDomo'>No Domos Yet!</h3>
            </div>
        );
    }

    // Maps the Domos to a Div
    const domoNodes = props.domos.map(domo => {
        return(
            <div key={domo._id} className='domo'>
                <img src='/assets/img/domoface.jpeg' alt='domo face' className='domoFace' />
                <h3 className='domoName'>Name: {domo.name}</h3>
                <h3 className='domoAge'>Age: {domo.age}</h3>
            </div>
        );
    });

    // Calls the Above Function
    return(
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};

// Loads Domos From a Server and Renders a DomoList component
const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />, document.getElementById('domos')
    );
};

// Init
const init = () => {
    ReactDOM.render(
        <DomoForm />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );

    loadDomosFromServer();
};

window.onload = init;