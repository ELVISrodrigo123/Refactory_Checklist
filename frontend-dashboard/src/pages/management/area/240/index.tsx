import React from "react";
import DrawerAppBar from "../../../../principal/components/navbar";
import FlotacionPlomoContainer from "../../../containers/FlotacionPlomoContainer";

const FlotacionPlomo = () => {
    return (
        <>
            <DrawerAppBar />
            <div style={{ padding: "3em" }}>
                <FlotacionPlomoContainer />
            </div>
        </>
    );
};

export default FlotacionPlomo;
