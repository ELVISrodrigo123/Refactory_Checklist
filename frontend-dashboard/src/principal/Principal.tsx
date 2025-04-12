
import DrawerAppBar from './components/navbar';
import VisionSection from './components/BarListimg';
import RiskAnalysis from './components/Mycomponentsone';
import Footer from './components/Footer';
import IndustrialSafety from './components/Mycomponentsthree';
export default function Principal() {


  return (
    <>
      <div className='background-home'>
        <DrawerAppBar />
        <VisionSection/>
        <RiskAnalysis/>
        <IndustrialSafety/>
        <Footer></Footer>
      </div>
    </>
  );
}

