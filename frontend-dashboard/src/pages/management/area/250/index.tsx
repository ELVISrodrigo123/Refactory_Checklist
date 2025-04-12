import React from "react";
import DrawerAppBar from "../../../../principal/components/navbar";
import FlotacionZincContainer from "../../../containers/FlotacionZincContainer";

const FlotacionZinc = () => {
    return (
        <>
            <DrawerAppBar />
            <div style={{ padding: "3em" }}>
                <FlotacionZincContainer />
            </div>
        </>
    );
};

export default FlotacionZinc;
