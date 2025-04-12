import React from "react";
import DrawerAppBar from "../../../../principal/components/navbar";
import CarguioContainer from "../../../containers/CarguioContainer";

const Carguio = () => {
    return (
        <>
            <DrawerAppBar />
            <div style={{  padding: "3em" }}>
                <CarguioContainer />
            </div>
        </>
    );
};

export default Carguio;
