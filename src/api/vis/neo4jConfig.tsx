import { red } from "@mui/material/colors";
import NeoVis, { NeovisConfig } from "neovis.js";

export const createConfig = (
    containerId: string,
    serverDatabase: string,
    serverURI: string,
    serverUser: string,
    serverPassword: string
) => {
    var config: NeovisConfig = {
        containerId: containerId,
        // neo4j database connection settings
        serverDatabase: serverDatabase, // specify which database to read from
        neo4j: {
            serverUrl: serverURI,
            serverUser: serverUser,
            serverPassword: serverPassword,
            driverConfig: {
                // enforce encryption
                // https://stackoverflow.com/questions/71719427/how-to-visualize-remote-neo4j-auradb-with-neovis-js
                //encrypted: "ENCRYPTION_OFF",
                //trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES",
            },
        },
        // override the default vis.js settings
        // https://visjs.github.io/vis-network/docs/network/#options
        visConfig: {
            nodes: {
                shape: "dot",
                borderWidth: 1.5,
                color: {
                    background: "lightgray",
                    border: "gray",
                    highlight: {
                        border: "#a42a04",
                        background: "lightgray",
                    },
                },
                font: {
                    strokeWidth: 7.5,
                },
            },
            edges: { arrows: { to: { enabled: true } } },
            physics: {
                enabled: true,
                // use the forceAtlas2Based solver to compute node positions
                solver: "forceAtlas2Based",
                forceAtlas2Based: {
                    gravitationalConstant: -75,
                },
                repulsion: {
                    centralGravity: 0.01,
                    springLength: 200,
                },
            },
            interaction: { multiselect: true }, // allows for multi-select using a long press or cmd-click
            layout: { randomSeed: 1337 },
        },
        // node and edge settings
        labels: { 
            Article: { label: "doi", value: "clicksInto", color:"#ffebee", },
            Author: { label: "name", value: "clicksInto" },
     },
        relationships: { 
            CITES: { value: "quantity" },
            AUTHORED_BY: { value: "quantity" } },
        initialCypher:
            "MATCH (n)-[r]->(m) RETURN n,r,m;",
    };
    const vis: NeoVis = new NeoVis(config);
    return vis;
};