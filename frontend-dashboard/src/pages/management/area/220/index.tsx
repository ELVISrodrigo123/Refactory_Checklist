import React from "react";
import DrawerAppBar from "../../../../principal/components/navbar";
import DomoContainer from "../../../containers/DomoContainer";

const Domo = () => {
    return (
        <>
            <DrawerAppBar />
            <div style={{ padding: "3em" }}>
                <DomoContainer />
            </div>
        </>
    );
};

export default Domo;