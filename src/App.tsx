import React from 'react';
import Reserve from './components/Reserve';

export default class App extends React.Component {
    render() {
        return (
            <div id='wrap'>
                <div className="container">
                    <Reserve />
                </div>
            </div>
        );
    }
}