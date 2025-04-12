import React from "react";
import DrawerAppBar from "../../../../principal/components/navbar";
import FiltrosContainer from "../../../containers/FiltrosContainer";

const Filtros = () => {
    return (
        <>
            <DrawerAppBar />
            <div style={{padding: "3em" }}>
                <FiltrosContainer />
            </div>
        </>
    );
};

export default Filtros;
