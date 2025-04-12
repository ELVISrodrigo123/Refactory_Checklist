import React from "react";
import DrawerAppBar from "../../../../principal/components/navbar";
import ReactivosContainer from "../../../containers/ReactivosContainer";

const Reactivos = () => {
    return (
        <>
            <DrawerAppBar />
            <div style={{ padding: "3em" }}>
                <ReactivosContainer />
            </div>
        </>
    );
};

export default Reactivos;
