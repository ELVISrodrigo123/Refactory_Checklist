import React from "react";
import DrawerAppBar from "../../../../principal/components/navbar";
import MoliendaContainer from "../../../containers/MoliendaContainer";

const Molienda = () => {
    return (
        <>
            <DrawerAppBar />
            <div style={{ padding: "3em" }}>
            <MoliendaContainer/>
            </div>
        </>
    );
};

export default Molienda;



