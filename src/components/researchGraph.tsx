import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import type { IdType } from "vis-network";
import ContextMenu, { ContextMenuState, ContextMenuType } from "./contextMenu";
import { Summary } from "./sidebar/researchSummaries";
import styled from "styled-components";
import { AlertState, AlertType } from "./alert";
import { VisContext } from "../context/visContext";
import MobileContextButton from "./buttons/mobileContext";

const StyledCanvas = styled.div`
    height: inherit;
    width: inherit;
    top: inherit;
    left: inherit;
    position: fixed;
`;

interface Props {
    containerId: string;
    summaries: Summary[];
    setSummaries: Dispatch<SetStateAction<Summary[]>>;
    setCurrentSummary: Dispatch<SetStateAction<Summary | null>>;
    setAlertState: Dispatch<SetStateAction<AlertState>>;
    darkMode: boolean;
}

const WikiGraph: React.FC<Props> = ({
    containerId,
    summaries,
    setSummaries,
    setCurrentSummary,
    setAlertState,
    darkMode,
}) => {
    const { vis, visNetwork } = React.useContext(VisContext);

    // keep track of selected nodes and labels
    // TODO: combine into one object
    const [selection, setSelection] = useState<IdType[]>([]);
    const [selectionLabels, setSelectionLabels] = useState([""]);

    // keep track of whether the context menu is open or closed
    const [contextMenuState, _setContextMenuState] = useState<ContextMenuState>({
        open: false,
        type: ContextMenuType.Canvas,
        mobile: window.innerWidth < 1100,
        x: 0,
        y: 0,
    });

    // get reference to context menu state to use current value in event listener
    const contextMenuStateRef = useRef(contextMenuState);

    // update reference when state is updated
    const setContextMenuState = (data: ContextMenuState) => {
        contextMenuStateRef.current = data;
        _setContextMenuState(data);
    };

    // change context menu state on window resize
    window.onresize = () => {
        if (window.innerWidth < 1100) {
            if (!contextMenuState.mobile) {
                setContextMenuState({ ...contextMenuState, mobile: true });
            }
        } else {
            if (contextMenuState.mobile) {
                setContextMenuState({ ...contextMenuState, mobile: false });
            }
        }
    };

    // get reference to selection so that we can use the current value in the vis event listeners
    // otherwise, the value lags behind
    const selectionRef = useRef(selection);

    // ----- initialize visualization and neovis object -----
    // TODO: maybe export to util file?
    useEffect(() => {
        if (!vis || !visNetwork) {
            return;
        }
        
        const updateSelectionState = (nodeIds: IdType[]) => {
            console.log(nodeIds)
            // update selection
            setSelection(nodeIds);
            selectionRef.current = nodeIds;

            // update selection labels
            var labels = vis
                .nodes()
                .get()
                .filter((node: any) => (nodeIds ? nodeIds.includes(node.id) : ""))
                .map(({ label }: { label?: any }) => {
                    return label;
                });
            setSelectionLabels(labels);
            console.log(labels)
        };

        // 1. listener for "select"
        visNetwork.onSelect((e, nodeIds) => {
            // update selection state
            if (nodeIds) {
                updateSelectionState(nodeIds);
            }
        });

        // 2. listener for "click"
        visNetwork.onClick((click) => {
            // we want to use a reference in the event listener so that we only change the state on click
            // if the context menu is currently open
            // otherwise, it changes the state every time and causes the parent component to rerender
            if (contextMenuStateRef.current.open) {
                // close context menu
                setContextMenuState({
                    open: false,
                    type: ContextMenuType.Canvas,
                    mobile: window.innerWidth < 1100,
                    x: 0,
                    y: 0,
                });
            }

            // TODO: find out how to do this
            // it doesn't work the same way as the context menu because the alert lives in the App,
            // not in this component
            // if (alertStateRef.current.show) {
            // close alert
            setAlertState({
                show: false,
                type: AlertType.None,
            });
            // }
        });

        // 3. listener for "double click"
        visNetwork.onDoubleClick((click) => {
            // if there's a node under the cursor, update visualization with its links
            if (click.nodes.length > 0) {
                const nodeId = click.nodes[0];
                var cypher = `MATCH (p1: Page)-[l: LINKS_TO]-(p2: Page) WHERE ID(p1) = ${nodeId} RETURN p1, l, p2`;
                vis.updateWithCypher(cypher);
            }
        });

        // 4. listener for "right click"
        visNetwork.onContextClick((click) => {
            click.event.preventDefault();

            // TODO: figure out why click.nodes is not accurate on right click
            // get adjusted coordinates to place the context menu
            var rect = click.event.target.getBoundingClientRect();
            let correctedX = click.event.x - rect.x;
            let correctedY = click.event.y - rect.y;

            var type = ContextMenuType.Canvas;
            // check if there's a node under the cursor
            var nodeId = visNetwork.getNodeAt({ x: correctedX, y: correctedY });
            // update context menu state based on check
            if (nodeId && selectionRef.current.length > 0) {
                // if there is a node under the cursor AND there is a selected node, change type to Node/Nodes
                // had to add the second part to handle the case where there are no nodes selected and user right-clicks a node (now that right-click doesn't select the node)
                const nodeIds = visNetwork.getSelectedNodes();
                if (nodeIds) {
                    nodeIds.length > 1 ? (type = ContextMenuType.Nodes) : (type = ContextMenuType.Node);
                }
            } else {
                // otherwise type should be canvas
                type = ContextMenuType.Canvas;
            }

            setContextMenuState({
                open: true,
                type: type,
                mobile: window.screen.width < 1100,
                x: correctedX,
                y: correctedY,
            });
        });
    }, [vis, visNetwork, setAlertState]);

    return (
        <StyledCanvas id="canvas">
            <div id={containerId} />
            {!vis && <h2 style={{ position: `absolute`, right: `25px`, bottom: `5px` }}>Loading...</h2>}
            {contextMenuState.mobile && (
                <MobileContextButton
                    contextMenuState={contextMenuState}
                    setContextMenuState={setContextMenuState}
                    selection={selection}
                    darkMode={darkMode}
                />
            )}
            {vis && visNetwork && (
                <ContextMenu
                    vis={vis}
                    visNetwork={visNetwork}
                    darkMode={darkMode}
                    state={contextMenuState}
                    setState={setContextMenuState}
                    selection={selection}
                    setSelection={setSelection}
                    selectionLabels={selectionLabels}
                    setSelectionLabels={setSelectionLabels}
                    summaries={summaries}
                    setSummaries={setSummaries}
                    setCurrentSummary={setCurrentSummary}
                />
            )}
        </StyledCanvas>
    );
};

export default WikiGraph;