import NavBar, { NavTab } from "./sidebar/navbar";
import UserManual from "./sidebar/userManual";
import About from "./sidebar/about";
import WikipediaSummaries, { Summary } from "./sidebar/researchSummaries";
import styled from "styled-components";
import { Dispatch, SetStateAction, useState } from "react";
import React from "react";
import { VisContext } from "../context/visContext";

/* https://www.w3schools.com/howto/howto_css_fixed_sidebar.asp */
const StyledSidebar = styled.div`
    height: 100%;
    width: 33%;
    padding-top: 20px;
    top: 0;
    right: 0;
    position: fixed; /* stay in place on scroll */
    z-index: 100;
    overflow-x: hidden; /* disable horizontal scroll */
    border-left: 1px solid var(--borderColor);
    background-color: var(--primaryBackgroundColor);

    @media (max-width: 1100px) {
        height: 100%;
        width: 100%;
        top: 80%;
        display: block;
        position: absolute;
        z-index: 1000;
        border-left: none;
        border-top: 1px solid var(--borderColor);
    }
`;

interface Props {
    input: string;
    setInput: Dispatch<SetStateAction<string>>;
    summaries: Summary[];
    setSummaries: Dispatch<SetStateAction<Summary[]>>;
    currentSummary: Summary | null;
    setCurrentSummary: Dispatch<SetStateAction<Summary | null>>;
}

const Sidebar: React.FC<Props> = ({ input, setInput, summaries, setSummaries, currentSummary, setCurrentSummary }) => {
    const { vis, visNetwork } = React.useContext(VisContext);

    // keep track of nav bar tab state
    const [currentNavTab, setCurrentNavTab] = useState<NavTab>(NavTab.Home);

    if (!vis || !visNetwork) {
        return <StyledSidebar className="sidebar"></StyledSidebar>;
    }

    // ----- execute cypher query when user inputs search, update visualization -----
    

    return (
        <StyledSidebar className="sidebar">
            <NavBar currentNavTab={currentNavTab} setCurrentNavTab={setCurrentNavTab} />
            {currentNavTab === NavTab.Home && (
                <>
                    <WikipediaSummaries
                        summaries={summaries}
                        setSummaries={setSummaries}
                        currentSummary={currentSummary}
                        setCurrentSummary={setCurrentSummary}
                    />
                    
                </>
            )}
            {currentNavTab === NavTab.About && <About />}
            {currentNavTab === NavTab.UserManual && <UserManual />}
        </StyledSidebar>
    );
};

export default Sidebar;