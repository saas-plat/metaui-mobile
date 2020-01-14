import React from "react";
import PropTypes from 'prop-types';

export default class LoadingIcon extends React.Component {

    static propTypes = {
        style: PropTypes.object
    };


    render() {

        const {style} = this.props;
        // console.log('LoadingIcon: ',style);

            // <svg width={style.width} height={style.height} style={style} viewBox="0 0 36 32">
            //     <g transform="scale(0.03125, 0.03125)">
            //         <path
            //             d="M1024 512c0-249.6-198.4-448-448-448C480 64 390.4 96 313.6 147.2 281.6 172.8 281.6 217.6 307.2 243.2l0 0c25.6 25.6 57.6 25.6 83.2 6.4C441.6 211.2 505.6 192 576 192c179.2 0 320 140.8 320 320l-128 0 192 192 192-192L1024 512zM128 512c0 249.6 198.4 448 448 448 96 0 185.6-32 262.4-83.2 32-25.6 32-70.4 6.4-96l0 0c-25.6-25.6-57.6-25.6-83.2-6.4C710.4 812.8 646.4 832 576 832c-179.2 0-320-140.8-320-320l128 0L192 320l-192 192L128 512z"
            //             fill="#737383"></path>
            //     </g>
            // </svg>
        return (
            <svg width={style.width} height={style.height} style={style} viewBox="0 0 120 30" fill={style.color}>
                <circle cx="15" cy="15" r="15">
                    <animate attributeName="r" from="15" to="15"
                             begin="0s" dur="0.8s"
                             values="15;9;15" calcMode="linear"
                             repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="1" to="1"
                             begin="0s" dur="0.8s"
                             values="1;.5;1" calcMode="linear"
                             repeatCount="indefinite" />
                </circle>
                <circle cx="60" cy="15" r="9" fillOpacity="0.3">
                    <animate attributeName="r" from="9" to="9"
                             begin="0s" dur="0.8s"
                             values="9;15;9" calcMode="linear"
                             repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="0.5" to="0.5"
                             begin="0s" dur="0.8s"
                             values=".5;1;.5" calcMode="linear"
                             repeatCount="indefinite" />
                </circle>
                <circle cx="105" cy="15" r="15">
                    <animate attributeName="r" from="15" to="15"
                             begin="0s" dur="0.8s"
                             values="15;9;15" calcMode="linear"
                             repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" from="1" to="1"
                             begin="0s" dur="0.8s"
                             values="1;.5;1" calcMode="linear"
                             repeatCount="indefinite" />
                </circle>
            </svg>
        );

    }
}
