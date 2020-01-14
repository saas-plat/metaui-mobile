import React from "react";

import PropTypes from 'prop-types';

export default class ArrowIcon extends React.Component {

    static propTypes={
        style: PropTypes.object
    };

    render() {
        const {style} = this.props;


        // return (<svg width={style.width} height={style.height} style={style} viewBox="0 0 32 32">
        //         <g transform="scale(0.03125, 0.03125)">
        //             <path
        //                 fill="#737383"
        //                 d="M276.446 502.863l223.53 211.271 223.514-211.271 127.807 120.737-351.321 332.007-351.371-332.007zM422.4 751.358v-614.397h153.601v614.397h-153.601z"
        //                 ></path>
        //         </g>
        //     </svg>);
        const {first, mid, end, width, height, ...other} = style;
        return (<svg width={width} height={height} style={other} viewBox="0 0 120 30" fill={style.color}>
            <circle id="first" cx="60" cy="15" r="15" style={first}></circle>
            <circle id="mid" cx="60" cy="15" r="9" fillOpacity="0.3" style={mid}></circle>
            <circle id="end" cx="60" cy="15" r="15" style={end}></circle>
        </svg>);
    }

}
