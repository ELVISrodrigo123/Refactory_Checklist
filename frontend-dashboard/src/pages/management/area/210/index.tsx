import React from "react";
import DrawerAppBar from "../../../../principal/components/navbar";
import ChancadoContainer from "../../../containers/ChancadoContainer";

const Chancado = () => {
    return (
        <>
            <DrawerAppBar />
            <div style={{ padding: "3em" }}>
                <ChancadoContainer />
            </div>
        </>
    );
};

export default Chancado;