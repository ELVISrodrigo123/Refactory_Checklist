
import DrawerAppBar from './components/navbar';
import VisionSection from './components/BarListimg';
import RiskAnalysis from './components/Mycomponentsone';
import Footer from './components/Footer';
import IndustrialSafety from './components/Mycomponentsthree';
import { Box } from "@mui/material";
export default function Principal() {


  return (
    <>
      <Box>
        <DrawerAppBar />
        <VisionSection />
        <RiskAnalysis />
        <IndustrialSafety />
        <Footer></Footer>
      </Box>
    </>
  );
}

