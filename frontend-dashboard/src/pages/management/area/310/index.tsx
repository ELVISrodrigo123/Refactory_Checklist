import React from "react";
import DrawerAppBar from "../../../../principal/components/navbar";
import EspesadoresContainer from "../../../containers/EspesadoresContainer";

const Espesadores = () => {
    return (
        <>
            <DrawerAppBar />
            <div style={{ padding: "3em" }}>
                <EspesadoresContainer />
            </div>
        </>
    );
};

export default Espesadores;
