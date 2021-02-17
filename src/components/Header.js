import React from 'react'
import {Helmet} from "react-helmet";

function Header () {
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Algo Visualizer</title>
            </Helmet>
        </div>
    )
}

export default Header; 
